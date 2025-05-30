import Link from 'next/link'

interface HeaderProps {
  userData: {
    first_name: string
    company?: {
      company_name: string
    }
  }
  breadcrumbs?: Array<{
    label: string
    href?: string
  }>
}

export default function Header({breadcrumbs }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/formiq" className="flex items-center">
              <div className="bg-slate-800 rounded-lg p-2 w-10 h-10 flex items-center justify-center">
                <span className="text-white text-sm font-bold">FIQ</span>
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900">FormIQ</h1>
            </Link>
            {breadcrumbs && (
              <nav className="ml-8">
                <ol className="flex items-center space-x-2 text-sm text-gray-500">
                  {breadcrumbs.map((crumb, index) => (
                    <li key={index} className="flex items-center">
                      {index > 0 && (
                        <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                      {crumb.href ? (
                        <Link href={crumb.href} className="hover:text-gray-700">
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className="text-gray-900 font-medium">{crumb.label}</span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <form action="/auth/signout" method="post">
              <button 
                type="submit"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
} 