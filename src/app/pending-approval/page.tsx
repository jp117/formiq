import Link from "next/link";

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="bg-slate-800 rounded-lg p-4 w-20 h-20 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">FIQ</span>
          </div>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            Account Pending Approval
          </h1>
          <p className="text-gray-900 text-lg">
            Your account has been created successfully
          </p>
        </div>

        {/* Message */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center justify-center mb-3">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Waiting for Admin Approval
          </h3>
          <p className="text-yellow-700">
            Your account is currently under review. You&apos;ll receive an email notification once your account has been approved and you can access FormIQ.
          </p>
        </div>

        {/* Instructions */}
        <div className="space-y-4">
          <div className="text-left bg-white rounded-lg p-4 border">
            <h4 className="font-semibold text-gray-900 mb-2">What happens next?</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• An administrator will review your account</li>
              <li>• You&apos;ll receive an email when approved</li>
              <li>• You can then access all FormIQ features</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button className="w-full bg-slate-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-slate-700 transition-colors">
            Check Status
          </button>
          
          <Link href="/" className="block w-full text-center text-slate-800 font-medium hover:text-slate-600 transition-colors">
            Back to Sign In
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center pt-4">
          <p className="text-gray-800">
            Powered by <span className="font-medium">Atlas Switch</span>
          </p>
        </div>
      </div>
    </div>
  );
} 