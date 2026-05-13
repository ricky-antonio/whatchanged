import type { Metadata } from 'next'
import { JetBrains_Mono, Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Diff — Text Comparison Tool',
  description: 'Paste two versions of any text and instantly see what changed.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full`} suppressHydrationWarning>
      <body className="h-full bg-background text-foreground antialiased transition-colors duration-150">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
