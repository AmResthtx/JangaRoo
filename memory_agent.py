"""
Claude Memory Agent — a reusable wrapper around the Anthropic memory tool.
Gives any Claude-backed script a /memories directory that persists across runs.
"""

import argparse
import os
import shutil
from pathlib import Path

import anthropic
from anthropic.types.beta import BetaLocalFilesystemMemoryTool

DEFAULT_MODEL = "claude-sonnet-4-6"

DEFAULT_SYSTEM_PROMPT = (
    "You are a helpful assistant with access to a persistent memory tool. "
    "Use memory to store important facts, decisions, and context that should "
    "be remembered across conversations. Retrieve relevant memories at the "
    "start of each response when they would be helpful."
)


class MemoryAgent:
    def __init__(
        self,
        memory_dir: str = "./memories",
        system_prompt: str = DEFAULT_SYSTEM_PROMPT,
        context_management: dict | None = {"type": "auto"},
        model: str = DEFAULT_MODEL,
    ):
        self.model = model
        self.system_prompt = system_prompt
        self.context_management = context_management
        self.memory_dir = Path(memory_dir)
        self.memory_dir.mkdir(parents=True, exist_ok=True)

        self.client = anthropic.Anthropic()
        self.memory_tool = BetaLocalFilesystemMemoryTool(base_path=str(self.memory_dir))
        self.messages: list[dict] = []

    def send(self, message: str) -> str:
        self.messages.append({"role": "user", "content": message})

        kwargs = {
            "model": self.model,
            "max_tokens": 8096,
            "system": self.system_prompt,
            "tools": [self.memory_tool],
            "messages": self.messages,
            "betas": ["memory-2025-11-05"],
        }
        if self.context_management is not None:
            kwargs["context_management"] = self.context_management

        runner = self.client.beta.messages.tool_runner(**kwargs)
        response = runner.get_final_message()

        reply_text = ""
        for block in response.content:
            if hasattr(block, "text"):
                reply_text += block.text

        self.messages.append({"role": "assistant", "content": response.content})
        return reply_text

    def view_memories(self) -> str:
        files = list(self.memory_dir.rglob("*"))
        if not files:
            return f"No memory files found in {self.memory_dir}"
        lines = [f"Memory directory: {self.memory_dir}"]
        for f in sorted(files):
            if f.is_file():
                lines.append(f"\n--- {f.relative_to(self.memory_dir)} ---")
                try:
                    lines.append(f.read_text())
                except Exception as e:
                    lines.append(f"(error reading: {e})")
        return "\n".join(lines)

    def clear_memories(self) -> str:
        if self.memory_dir.exists():
            shutil.rmtree(self.memory_dir)
        self.memory_dir.mkdir(parents=True, exist_ok=True)
        return f"Cleared all memories in {self.memory_dir}"


def _interactive(agent: MemoryAgent) -> None:
    print(f"Claude Memory Agent (model: {agent.model}, memory: {agent.memory_dir})")
    print("Commands: /memory_view  /memory_clear  /quit\n")
    while True:
        try:
            user_input = input("You: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nBye.")
            break
        if not user_input:
            continue
        if user_input == "/quit":
            print("Bye.")
            break
        if user_input == "/memory_view":
            print(agent.view_memories())
            continue
        if user_input == "/memory_clear":
            print(agent.clear_memories())
            continue
        reply = agent.send(user_input)
        print(f"Claude: {reply}\n")


def main() -> None:
    parser = argparse.ArgumentParser(description="Claude Memory Agent")
    parser.add_argument("--memory-dir", default="./memories", help="Path to memory directory")
    parser.add_argument("--once", metavar="MESSAGE", help="Send a single message and exit")
    parser.add_argument("--model", default=DEFAULT_MODEL, help="Claude model to use")
    args = parser.parse_args()

    agent = MemoryAgent(memory_dir=args.memory_dir, model=args.model)

    if args.once:
        print(agent.send(args.once))
    else:
        _interactive(agent)


if __name__ == "__main__":
    main()
