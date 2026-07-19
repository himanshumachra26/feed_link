import { Link } from 'react-router-dom';

export default function AdsPartner() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        
        {/* Header Section */}
        <div className="text-center border-b border-gray-150 pb-6 relative">
          <Link to="/" className="inline-flex items-center gap-1.5 text-2xl font-bold text-emerald-600 mb-2">
            <span>🌿</span>
            <span>FeedLink</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900">Advertising Partner Details</h1>
          <p className="text-sm text-gray-500 mt-2">Information regarding our upcoming monetization and ad network partners</p>
          <div className="absolute top-0 right-0 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] uppercase tracking-wider font-bold rounded-full px-3 py-1 shadow-sm">
            AdSense Approval Pending
          </div>
        </div>

        {/* Free Access Notice Banner */}
        <div className="bg-emerald-50 border border-emerald-250 rounded-2xl p-4 text-emerald-800 text-sm">
          <p className="font-semibold flex items-center gap-2">
            <span>ℹ️</span> Monetization Policy Note
          </p>
          <p className="mt-1">
            FeedLink is committed to keeping registration and listings 100% free of charge for both donors and NGO partners. We do not assess server maintenance charges, verification fees, or API overhead costs. To cover server operation expenses, we display ads via third-party ad networks.
          </p>
        </div>

        {/* Ads Partner Info details */}
        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">1. Google AdSense Partnership</h2>
            <p>
              We have applied to partner with **Google AdSense** to serve relevant advertising banners across public sections of our platform. Under this advertising partnership, once approved, Google AdSense will act as our primary third-party ad vendor.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">2. Sharing of Cookies & Telemetry Details</h2>
            <p>
              To deliver tailored, localized ads and track conversion performance, Google AdSense uses cookies, tracking identifiers, and non-personally identifiable telemetry details. 
            </p>
            <p>
              These cookies collect anonymized usage details such as device type, browser settings, language preferences, approximate geographical location, and page interaction times. Personally identifiable details (like your email address, phone number, and exact street address) are **never** shared with Google AdSense.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">3. Status: Pending Approval</h2>
            <p>
              Our application to partner with Google AdSense is currently **pending approval**. During this review period, you will not see advertisements on the platform. We will update our Terms of Service and Privacy Policy the moment approval is finalized.
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
