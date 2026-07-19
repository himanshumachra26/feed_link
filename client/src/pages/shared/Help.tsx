import { Link } from 'react-router-dom';

export default function Help() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        
        {/* Header Section */}
        <div className="text-center border-b border-gray-150 pb-6 relative">
          <Link to="/" className="inline-flex items-center gap-1.5 text-2xl font-bold text-emerald-600 mb-2">
            <span>🌿</span>
            <span>FeedLink</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900">Help & FAQs</h1>
          <p className="text-sm text-gray-500 mt-2">Find answers to common questions about food rescue operations</p>
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
            While guest users can view active listings, creating requests and listing food require signing in. **Sign up is 100% free of charge. There are no server upkeep costs, no database charges, and no email verification fees.**
          </p>
        </div>

        {/* FAQ list */}
        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">Q: What is FeedLink?</h2>
            <p>
              A: FeedLink is a digital matching portal that connects food providers (like restaurants, caterers, and grocery stores) directly with verified local food distribution organizations (like shelters, pantries, and NGOs) to quickly rescue edible surplus food.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">Q: Who handles food pickup?</h2>
            <p>
              A: Typically, the receiving NGO organizes volunteers or staff to collect the food within the donor's specified pickup window. The delivery option is specified on each listing.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">Q: What are the packaging requirements?</h2>
            <p>
              A: Food must be packaged in clean, food-grade bags, boxes, or disposable foil trays. Liquid food must be sealed in spill-proof containers. Each package should ideally have a label detailing the item name, packaging timestamp, and allergen warnings.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">Q: How are legal liabilities handled?</h2>
            <p>
              A: The Good Samaritan Food Donation Act legally protects donors from liability when donating wholesome food in good faith. More details are available on our [Terms & Conditions](/terms) page.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">Q: How can I change my profile or city settings?</h2>
            <p>
              A: Registered users can edit their profile details, update location coordinates, adjust default pickup hours, and change passwords on the [Settings](/donor/settings) page inside the dashboard.
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
