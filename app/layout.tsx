import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'

const outfit = Outfit({ 
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'EnTrain - Gagnez des années de vie en forme',
  description: 'Approche hyper scientifique pour gagner des années de vie en forme grâce à des séances coachées qui renforcent le corps, stimulent le cerveau et recréent du lien - depuis chez vous.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={outfit.className}>{children}</body>
    </html>
  )
}
