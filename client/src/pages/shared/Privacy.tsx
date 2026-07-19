import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        
        {/* Header Section */}
        <div className="text-center border-b border-gray-150 pb-6 relative">
          <Link to="/" className="inline-flex items-center gap-1.5 text-2xl font-bold text-emerald-600 mb-2">
            <span>🌿</span>
            <span>FeedLink</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mt-2">Last Updated: July 19, 2026</p>
          <div className="absolute top-0 right-0 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] uppercase tracking-wider font-bold rounded-full px-3 py-1 shadow-sm">
            AdSense Approval Pending
          </div>
        </div>

        {/* Free Access Notice Banner */}
        <div className="bg-emerald-50 border border-emerald-250 rounded-2xl p-4 text-emerald-800 text-sm">
          <p className="font-semibold flex items-center gap-2">
            <span>ℹ️</span> Platform Accessibility Note
          </p>
          <p className="mt-1">
            Access to our dashboards and listings requires signing in or registering. **Creating an account is entirely free of charge. We do not assess server fees, email authentication charges, or SMS delivery costs.**
          </p>
        </div>

        {/* Privacy Policy details */}
        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">1. Information We Collect</h2>
            <p>
              To coordinate food rescues safely and efficiently, we collect key registration data from our users:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Organization Details:</strong> Business name, NGO registration details, and operating category.</li>
              <li><strong>Contact Credentials:</strong> Authorized email address, phone numbers, and profile avatars.</li>
              <li><strong>Locations:</strong> City and physical street address (required to coordinate pickups).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">2. How We Share & Protect Data</h2>
            <p>
              FeedLink is a community-matching platform. Your contact details (like phone number and address) are kept private during general exploration and are only shared with a registered, verified partner once a specific food pickup request has been accepted.
            </p>
            <p>
              For public/guest explorers, we automatically obfuscate sensitive data like phone numbers, emails, and exact address strings using `***` character masking.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">3. Data Security & Storage</h2>
            <p>
              We implement industry-standard secure storage rules (SSL/TLS encryption, bcrypt password hashing, and token-based API authentication) to protect your account from unauthorized access.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">4. Third-Party Advertising & Data Sharing (Google AdSense)</h2>
            <p>
              We are applying to partner with **Google AdSense** as an ad delivery service. If approved, Google AdSense will serve advertising banners on this site.
            </p>
            <p>
              To display relevant ads and track conversions, Google AdSense uses cookies, tracking identifiers, and non-personally identifiable usage details. By using this site, you consent to the placement of these cookies and the collection of operational engagement metadata by Google for ad customization. **This partnership is currently pending approval.**
            </p>
          </section>
        </div>

        {/* Footer actions */}
        <div className="border-t border-gray-150 pt-6 flex flex-wrap gap-3 items-center justify-between">
          <Link to="/" className="text-sm font-semibold text-emerald-600 hover:underline">
            Back to Home
          </Link>
          <div className="flex gap-2">
            <Link to="/login" className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
              Sign In
            </Link>
            <Link to="/register" className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-700">
              Register Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
