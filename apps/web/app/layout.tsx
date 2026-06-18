import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import ChatWidget from '@/components/ChatWidget'

export const metadata: Metadata = {
  title: 'JangaRoo - Dance Studio Booking',
  description: 'Book dance classes and private lessons at your favorite studio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <ChatWidget studioSlug={process.env.NEXT_PUBLIC_DEFAULT_STUDIO_SLUG ?? 'rhythm'} />
      </body>
    </html>
  )
}
