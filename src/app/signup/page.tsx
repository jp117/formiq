import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-4">
        {/* Logo */}
        <div className="flex justify-center pt-4">
          <div className="bg-slate-800 rounded-lg p-4 w-20 h-20 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">FIQ</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-4xl font-bold text-gray-900">
            Join FormIQ
          </h1>
          <p className="text-gray-900 text-lg">
            Start automating your electrical switchboard quoting today
          </p>
        </div>

        {/* Sign Up Form */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="block text-base font-medium text-gray-700 mb-1">
                First name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-colors placeholder:text-gray-600 placeholder:text-sm"
                placeholder="First name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-base font-medium text-gray-700 mb-1">
                Last name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-colors placeholder:text-gray-600 placeholder:text-sm"
                placeholder="Last name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="company" className="block text-base font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              id="company"
              name="company"
              type="text"
              autoComplete="organization"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-colors placeholder:text-gray-600 placeholder:text-sm"
              placeholder="Your company name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-1">
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
            <label htmlFor="password" className="block text-base font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-colors placeholder:text-gray-600 placeholder:text-sm"
              placeholder="Create a password"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-base font-medium text-gray-700 mb-1">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-colors placeholder:text-gray-600 placeholder:text-sm"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-slate-700 transition-colors focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 mt-4"
          >
            Create account
          </button>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-gray-900">
            Already have an account?{" "}
            <Link href="/" className="text-slate-800 font-medium hover:text-slate-600 transition-colors">
              Sign in
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