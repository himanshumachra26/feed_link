import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Globe, Clock, Award, Smile, Sparkles, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#ecfdf5,_#f9fafb_60%)] pb-12">
      <div className="mx-auto flex max-w-5xl flex-col px-6 py-8 lg:px-8">
        
        {/* Header Navigation */}
        <header className="flex items-center justify-between rounded-full border border-emerald-100 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
          <Link to="/" className="flex items-center gap-1.5 text-xl font-bold text-emerald-600 hover:opacity-85 transition-opacity cursor-pointer select-none">
            <span>🌿</span>
            <span>FeedLink</span>
          </Link>
          <Link to="/" className="rounded-full px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-emerald-700">
            Back home
          </Link>
        </header>

        {/* Main Content */}
        <main className="flex-1 py-10 space-y-10">
          
          {/* Main Hero Card */}
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles size={12} /> Our Mission & Vision
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl leading-tight">
              A community-driven digital bridge rescuing fresh meals and nourishing neighborhoods.
            </h1>
            <p className="text-lg leading-8 text-gray-600">
              At FeedLink, we believe that food belongs on plates, not in landfill sites. 
              We are a team of tech-driven optimists and social volunteers building clean logistics pipelines 
              to connect surplus commercial kitchen stocks directly with registered NGOs, shelters, and care homes.
            </p>
          </div>

          {/* The Story Section (Human Narrative) */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 p-8 flex flex-col justify-center space-y-4 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Heart className="text-emerald-600" size={20} /> How FeedLink Began
              </h2>
              <p className="text-sm leading-7 text-gray-700">
                It started with a simple, unsettling observation at closing time in a local restaurant: 
                a commercial kitchen was packing clean, untouched trays of vegetable biryani and fresh breads for disposal. 
                Just three streets over, volunteers at a neighborhood night shelter were trying to divide a small pot of rice 
                among thirty children.
              </p>
              <p className="text-sm leading-7 text-gray-700">
                This wasn’t a shortage of food—it was a failure of communication, logistics, and trust. 
                We created FeedLink to solve this gap. By utilizing a real-time digital system, we allow restaurants 
                to list their surpluses in under a minute, giving nearby certified NGOs immediate access to claim and collect it.
              </p>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-8 flex flex-col justify-center space-y-5 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Award className="text-emerald-600" size={20} /> Our Core Values
              </h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl h-10 w-10 flex-shrink-0 flex items-center justify-center">
                    <Globe size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Zero-Waste Mindset</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-5">Food represents hours of farming, water, and labor. Throwing it away is an environmental and moral loss we work to prevent.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl h-10 w-10 flex-shrink-0 flex items-center justify-center">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Verified Platform Security</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-5">We manually verify every NGO, restaurant, and platform administrator account to ensure food transfers remain secure, healthy, and respectful.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-xl h-10 w-10 flex-shrink-0 flex items-center justify-center">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Time-Sensitive Logistics</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-5">Surplus meals are highly time-critical. Our dashboard allows instant alerts and quick pickup coordination before quality declines.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Three Pillars of Impact */}
          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Smile className="text-emerald-600" size={20} /> Three Pillars of Our Impact
              </h2>
              <p className="text-xs text-gray-500 mt-1">Measuring the social, environmental, and neighborhood outcomes of food rescue.</p>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-between">
                <div>
                  <span className="text-2xl">🍛</span>
                  <h3 className="font-bold text-gray-900 text-sm mt-3">Nourishing Lives</h3>
                  <p className="text-xs text-gray-500 mt-1.5 leading-5">
                    Rescued meals go directly to children’s homes, day shelters, and daily wage workers, allowing NGOs to direct scarce cash resources to education and medicine.
                  </p>
                </div>
              </div>

              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-between">
                <div>
                  <span className="text-2xl">🌍</span>
                  <h3 className="font-bold text-gray-900 text-sm mt-3">Protecting Our Climate</h3>
                  <p className="text-xs text-gray-500 mt-1.5 leading-5">
                    Discarded food rotting in landfills is a primary source of climate-damaging methane. By diverting organic waste, we offset platform carbon footprint volumes.
                  </p>
                </div>
              </div>

              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-between">
                <div>
                  <span className="text-2xl">🤝</span>
                  <h3 className="font-bold text-gray-900 text-sm mt-3">Neighborhood Connection</h3>
                  <p className="text-xs text-gray-500 mt-1.5 leading-5">
                    We foster proud, transparent partnerships between local restaurants, food chains, hospitality operators, and night shelter volunteers right in their local zip code.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action (CTA) */}
          <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-8 text-white text-center shadow-md space-y-4">
            <h2 className="text-2xl font-bold">Be Part of the Solution</h2>
            <p className="max-w-xl mx-auto text-sm text-emerald-100 leading-6">
              Whether you are a chef, restaurant owner, store manager, or an NGO volunteer coordinating community care—your involvement makes a real difference.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link to="/register" className="bg-white hover:bg-emerald-50 text-emerald-700 font-bold px-6 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2 cursor-pointer shadow">
                Join the Platform <ArrowRight size={16} />
              </Link>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
