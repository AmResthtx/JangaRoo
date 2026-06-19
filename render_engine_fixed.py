import time
import os
import tempfile
import zipfile
import platform
import subprocess
from PIL import Image, ImageDraw, ImageFont
import numpy as np
from moviepy.editor import (AudioFileClip, CompositeVideoClip, CompositeAudioClip, ImageClip,
                              VideoFileClip)
from moviepy.audio.fx.audio_loop import audio_loop
from moviepy.audio.fx.audio_normalize import audio_normalize
import requests
from utility.config import get_config

def download_file(url, filename):
    with open(filename, 'wb') as f:
        headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        response = requests.get(url, headers=headers)
        f.write(response.content)

def search_program(program_name):
    try:
        search_cmd = "where" if platform.system() == "Windows" else "which"
        return subprocess.check_output([search_cmd, program_name]).decode().strip()
    except subprocess.CalledProcessError:
        return None

def get_program_path(program_name):
    program_path = search_program(program_name)
    return program_path

def get_output_media(audio_file_path, timed_captions, background_video_data, video_server, background_music_path=None):
    config = get_config()

    render_engine = os.getenv('RENDER_ENGINE', 'moviepy').lower()
    if render_engine == 'remotion':
        print("[RenderEngine] Routing compilation to React/Remotion renderer...")
        from utility.render.remotion_renderer import render_with_remotion
        return render_with_remotion(
            audio_file_path=audio_file_path,
            timed_captions=timed_captions,
            background_video_data=background_video_data,
            background_music_path=background_music_path
        )

    OUTPUT_FILE_NAME = "rendered_video.mp4"

    visual_clips = []
    for (t1, t2), video_url in background_video_data:
        video_filename = tempfile.NamedTemporaryFile(delete=False).name
        download_file(video_url, video_filename)
        video_clip = VideoFileClip(video_filename)
        video_clip = video_clip.set_start(t1)
        video_clip = video_clip.set_end(t2)
        visual_clips.append(video_clip)

    audio_clips = []
    audio_file_clip = AudioFileClip(audio_file_path)
    audio_clips.append(audio_file_clip)

    if background_music_path and os.path.exists(background_music_path):
        try:
            bg_music_clip = AudioFileClip(background_music_path)
            bg_music_clip = bg_music_clip.volumex(0.12)
            if bg_music_clip.duration < audio_file_clip.duration:
                bg_music_clip = audio_loop(bg_music_clip, duration=audio_file_clip.duration)
            else:
                bg_music_clip = bg_music_clip.set_duration(audio_file_clip.duration)
            audio_clips.append(bg_music_clip)
            print("[RenderEngine] Successfully loaded and mixed background music.")
        except Exception as e:
            print(f"[RenderEngine] Error loading/mixing background music: {e}")

    if config.get_captions_enabled():
        for (t1, t2), text in timed_captions:
            font_size = config.get_caption_font_size()
            font_color = config.get_caption_font_color()
            stroke_width = config.get_caption_stroke_width()
            stroke_color = config.get_caption_stroke_color()
            font_face = config.get_caption_font_face()
            caption_position = config.get_caption_position()

            if caption_position == 'bottom_center':
                y_pos = 1000
            elif caption_position == 'bottom_left':
                y_pos = 1000
            elif caption_position == 'bottom_right':
                y_pos = 1000
            elif caption_position == 'top':
                y_pos = 100
            elif caption_position == 'center':
                y_pos = 540
            else:
                y_pos = 1000

            frame_size = (1080, 1920)
            img = Image.new("RGBA", frame_size, (0, 0, 0, 0))
            draw = ImageDraw.Draw(img)
            try:
                pil_font = ImageFont.truetype("arial.ttf", font_size)
            except:
                pil_font = ImageFont.load_default()
            bbox = draw.textbbox((0, 0), text, font=pil_font)
            text_w = bbox[2] - bbox[0]
            x = (frame_size[0] - text_w) // 2
            y = y_pos
            if stroke_width:
                draw.text((x - stroke_width, y), text, font=pil_font, fill=stroke_color)
                draw.text((x + stroke_width, y), text, font=pil_font, fill=stroke_color)
                draw.text((x, y - stroke_width), text, font=pil_font, fill=stroke_color)
                draw.text((x, y + stroke_width), text, font=pil_font, fill=stroke_color)
            draw.text((x, y), text, font=pil_font, fill=font_color)
            text_clip = ImageClip(np.array(img)).set_start(t1).set_end(t2)
            visual_clips.append(text_clip)

    video = CompositeVideoClip(visual_clips)

    if audio_clips:
        audio = CompositeAudioClip(audio_clips)
        video.duration = audio.duration
        video.audio = audio

    video.write_videofile(OUTPUT_FILE_NAME, codec='libx264', audio_codec='aac', fps=25, preset='veryfast')

    return OUTPUT_FILE_NAME
