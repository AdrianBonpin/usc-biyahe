import './globals.css'

import Providers from './components/providers'

export const metadata = {
  title: 'Biyahe Cebu',
  description: 'biyahe ta bai!',
}

export default async function RootLayout({ children }) {

  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}