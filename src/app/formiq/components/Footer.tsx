export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} FormIQ. All rights reserved.
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <p className="text-sm text-gray-600">
              Powered by <span className="font-medium text-gray-900">Atlas Switch</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 