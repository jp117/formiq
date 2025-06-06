import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: ReactNode
  userData: {
    first_name: string
    is_admin?: boolean
    company?: {
      company_name: string
    }
  }
  breadcrumbs?: Array<{
    label: string
    href?: string
  }>
}

export default function Layout({ children, userData, breadcrumbs }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header userData={userData} breadcrumbs={breadcrumbs} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
} 