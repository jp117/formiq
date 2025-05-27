import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex justify-center pt-8">
          <div className="bg-slate-800 rounded-lg p-4 w-20 h-20 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">FIQ</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome to FormIQ
          </h1>
          <p className="text-gray-900 text-lg">
            Electrical switchboard quoting and engineering automation
          </p>
        </div>

        {/* Login Form */}
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-colors placeholder:text-gray-600 placeholder:text-sm"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-base font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-colors placeholder:text-gray-600 placeholder:text-sm"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-slate-700 transition-colors focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 mt-6"
          >
            Sign in
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-gray-900">
            Don't have an account?{" "}
            <Link href="/signup" className="text-slate-800 font-medium hover:text-slate-600 transition-colors">
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-800">
            Powered by <span className="font-medium">Atlas Switch</span>
          </p>
        </div>
      </div>
    </div>
  );
}
