import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        
        {/* Header Section */}
        <div className="text-center border-b border-gray-150 pb-6 relative">
          <Link to="/" className="inline-flex items-center gap-1.5 text-2xl font-bold text-emerald-600 mb-2">
            <span>🌿</span>
            <span>FeedLink</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900">Terms & Conditions</h1>
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
            Creating an account and logging in are required for full system access (including publishing donations, requesting food, and viewing live delivery tracking). **Registration is completely free of cost. There are zero email provider fees, no SMS delivery surcharges, and no server maintenance costs.**
          </p>
        </div>

        {/* Main Terms Details */}
        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">1. Legal Protections (Good Samaritan Act)</h2>
            <p>
              FeedLink operates in strict accordance with the **Bill Emerson Good Samaritan Food Donation Act** (and local equivalents). This federal statute shields businesses, restaurants, and nonprofit organizations from civil and criminal liability when donating apparently wholesome food in good faith to a nonprofit organization for ultimate distribution to needy individuals.
            </p>
            <p>
              Donors are protected except in instances of gross negligence or intentional misconduct. By using this platform, all partners agree to cooperate in good faith to uphold safety standards that protect both donors and recipients.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">2. Food Safety & Temperature Standards (HACCP)</h2>
            <p>
              To maintain the integrity of rescued food, donors and NGOs must adhere to the **Hazard Analysis Critical Control Point (HACCP)** standards:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Hot-holding food</strong> must be held and posted at or above <strong>60°C (140°F)</strong>.</li>
              <li><strong>Cold-holding food</strong> must be kept refrigerated at or below <strong>4°C (40°F)</strong>.</li>
              <li><strong>Frozen food</strong> must be stored solid at or below <strong>-18°C (0°F)</strong>.</li>
              <li>Donors must clearly disclose cooking times, packaging dates, and specific allergens (peanuts, milk, wheat, etc.) in every listing.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">3. Partner Code of Conduct</h2>
            <p>
              <strong>Donors (Restaurants & Cafes):</strong> Must verify that all posted surplus items are wholesome, edible, and packaged in food-grade bags or containers.
            </p>
            <p>
              <strong>NGOs & Shelters:</strong> Must collect accepted donations within the specified pickup window. Transport vehicles must maintain thermal bags or refrigerated storage units for transit lengths exceeding 20 minutes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">4. Service Terms</h2>
            <p>
              FeedLink is a digital coordination utility. While we perform baseline validations on registered entities, we do not verify the live kitchen sanitation practices of individual food posts in real-time. Safety relies on strict adherence to the temperature and allergen protocols detailed above.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">5. Advertising Partners & Google AdSense Compliance</h2>
            <p>
              FeedLink is currently applying to partner with Google AdSense as a third-party ad vendor. By using this service, you acknowledge and agree that relevant non-personally identifiable usage details, device cookies, and system telemetry can be shared with Google AdSense to optimize and serve relevant advertisements.
            </p>
            <p>
              The status of this ad partner application is currently **AdSense Approval Pending**.
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
