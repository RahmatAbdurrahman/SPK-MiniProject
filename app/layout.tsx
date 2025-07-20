import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistem Pendukung Keputusan - Pemilihan Influencer",
  description:
    "Penerapan Metode Simple Additive Weighting (SAW) dalam Pemilihan Influencer untuk Meningkatkan Pendapatan Toko Fashion",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="light" storageKey="influencer-dss-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
