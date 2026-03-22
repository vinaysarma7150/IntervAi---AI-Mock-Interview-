import { Mona_Sans } from "next/font/google"
import "./globals.css"
import Provider from "./provider"
import { Toaster } from "@/components/ui/sonner"

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
})

export const metadata = {
  title: "AI MOCK INTERVIEW",
  description: "AI BASED INTERVIEW AGENT",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${monaSans.variable} font-sans antialiased`}>
        <Provider>
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  )
}
