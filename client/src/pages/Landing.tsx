import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    title: 'For Donors',
    description: 'Post surplus food quickly, share pickup windows, and manage requests from local NGOs.',
  },
  {
    title: 'For NGOs',
    description: 'Find available food listings, request pickups, and coordinate rescue efforts efficiently.',
  },
  {
    title: 'For Admins',
    description: 'Monitor listings, maintain trust, and oversee platform activity from one dashboard.',
  },
];

const stats = [
  { value: '1.2k+', label: 'Meals rescued' },
  { value: '120+', label: 'Active partners' },
  { value: '24/7', label: 'Pickup coordination' },
];

const steps = [
  {
    title: 'Post a listing',
    description: 'Share the food type, quantity, pickup window, and address in minutes.',
  },
  {
    title: 'Receive requests',
    description: 'Trusted NGOs respond instantly and coordinate pickup with clear updates.',
  },
  {
    title: 'Track impact',
    description: 'Monitor how much food is rescued and how many communities are helped.',
  },
];

export default function Landing() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={user.role === 'DONOR' ? '/donor' : user.role === 'NGO' ? '/ngo' : '/admin'} replace />;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#ecfdf5,_#f9fafb_60%)]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-full border border-emerald-100 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
          <Link to="/" className="flex items-center gap-1.5 text-xl font-bold text-emerald-600 hover:opacity-85 transition-opacity cursor-pointer select-none">
            <span>🌿</span>
            <span>FeedLink</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <Link to="/about" className="rounded-full px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-emerald-700">
              About Us
            </Link>
            <a href="#how-it-works" className="rounded-full px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-emerald-700">
              How it works
            </a>
            <a href="#impact" className="rounded-full px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-emerald-700">
              Impact
            </a>
            <Link to="/login" className="rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-emerald-700">
              Login
            </Link>
            <Link to="/register" className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
              Sign Up
            </Link>
          </div>
        </header>

        <main className="flex flex-1 flex-col justify-center py-12 lg:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="max-w-2xl">
              <p className="mb-4 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                Food rescue made simple
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Connect donors, shelters, and communities to reduce food waste.
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                FeedLink helps restaurants, cafés, and kitchens share surplus food with trusted NGOs and shelters in a fast, secure, and transparent way.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/about" className="rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                  Explore more
                </Link>
                <a href="#how-it-works" className="rounded-full border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50">
                  See how it works
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-gray-500">
                <span className="rounded-full border border-gray-200 bg-white px-3 py-1">Real-time requests</span>
                <span className="rounded-full border border-gray-200 bg-white px-3 py-1">Verified partners</span>
                <span className="rounded-full border border-gray-200 bg-white px-3 py-1">Simple dashboard</span>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl">
              <div className="rounded-2xl bg-emerald-50 p-4">
                <p className="text-sm font-semibold text-emerald-700">Platform overview</p>
                <div className="mt-4 space-y-3">
                  {features.map((feature) => (
                    <div key={feature.title} className="rounded-xl border border-emerald-100 bg-white p-3">
                      <p className="text-sm font-semibold text-gray-900">{feature.title}</p>
                      <p className="mt-1 text-sm text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        <section id="impact" className="mt-4 grid gap-4 rounded-3xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-emerald-50 p-4 text-center">
              <p className="text-2xl font-bold text-emerald-700">{stat.value}</p>
              <p className="mt-1 text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </section>

        <section id="how-it-works" className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">How it works</p>
            <h2 className="mt-2 text-2xl font-semibold text-gray-900">A clear path from surplus food to community impact</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <h3 className="text-base font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
