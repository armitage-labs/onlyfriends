import { GeistSans } from "geist/font/sans";
import { cn } from '@/lib/utils';
import './globals.css'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          GeistSans.className,
          "bg-gradient-to-r from-primary/50 to-fuchsia-300/50 antialiased h-full w-full"
        )}
      >
        {children}</body>
    </html>
  )
}
