import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-9xl font-bold text-orange-600">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mt-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mt-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block w-full py-3 px-6 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Go Home
          </Link>
          
          <Link 
            href="/contact"
            className="inline-block w-full py-3 px-6 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
          >
            Contact Support
          </Link>
        </div>
        
        <div className="text-sm text-gray-500">
          <p>Need help? <Link href="/contact" className="text-orange-600 hover:underline">Contact us</Link></p>
        </div>
      </div>
    </div>
  );
}