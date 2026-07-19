import AppShell from '../../components/layout/AppShell';
import { ArrowRight, ClipboardList, Gift, Package2, Settings, Users2, Truck, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function OperationsHub() {
  const { user } = useAuth();

  // Generate dynamic sections depending on logged in role
  const getSections = () => {
    if (user?.role === 'NGO') {
      return [
        {
          title: 'Browse Food',
          description: 'Browse available surplus food donations and place pickup requests.',
          href: '/ngo/browse',
          icon: Gift,
          color: 'from-emerald-500 to-teal-600',
        },
        {
          title: 'My Requests',
          description: 'Track the status of your requested listings and coordinate pickups.',
          href: '/ngo/requests',
          icon: ClipboardList,
          color: 'from-sky-500 to-blue-600',
        },
        {
          title: 'Past Records',
          description: 'Review your complete historical claims and community impact details.',
          href: '/ngo/records',
          icon: FileText,
          color: 'from-purple-500 to-indigo-600',
        },
        {
          title: 'Account Settings',
          description: 'Adjust organization profile and alert notifications in one place.',
          href: '/ngo/settings',
          icon: Settings,
          color: 'from-amber-500 to-orange-500',
        },
      ];
    }

    if (user?.role === 'ADMIN') {
      return [
        {
          title: 'User Management',
          description: 'Approve, suspend, and view registered NGO and Restaurant accounts.',
          href: '/admin/users',
          icon: Users2,
          color: 'from-violet-500 to-fuchsia-600',
        },
        {
          title: 'Food Listings',
          description: 'Monitor active, reserved, and completed food donations across the platform.',
          href: '/admin/listings',
          icon: Gift,
          color: 'from-emerald-500 to-teal-600',
        },
        {
          title: 'Transit Deliveries',
          description: 'Track active in-transit pickups and delivery logistics details.',
          href: '/admin/deliveries',
          icon: Truck,
          color: 'from-sky-500 to-blue-600',
        },
        {
          title: 'System Settings',
          description: 'Manage admin profile password and review login activity logs.',
          href: '/admin/settings',
          icon: Settings,
          color: 'from-amber-500 to-orange-500',
        },
      ];
    }

    // Default to DONOR (Restaurant)
    return [
      {
        title: 'Create Donation',
        description: 'Post available meals, baked items, and surplus food for nearby NGOs.',
        href: '/donor/listings/new',
        icon: Gift,
        color: 'from-emerald-500 to-teal-600',
      },
      {
        title: 'My Listings',
        description: 'Review active and past food posts listed by your restaurant.',
        href: '/donor/listings',
        icon: Package2,
        color: 'from-purple-500 to-indigo-600',
      },
      {
        title: 'Manage Requests',
        description: 'Track pending requests from local NGOs and mark food left.',
        href: '/donor/requests',
        icon: ClipboardList,
        color: 'from-sky-500 to-blue-600',
      },
      {
        title: 'Account Settings',
        description: 'Adjust restaurant details, security, and notification settings.',
        href: '/donor/settings',
        icon: Settings,
        color: 'from-amber-500 to-orange-500',
      },
    ];
  };

  const sections = getSections();

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Operations hub</p>
              <h1 className="mt-2 text-2xl font-semibold text-gray-900">Everything you need in one dashboard</h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-600">Access features, review requests, manage partner records, and stay on top of your operations.</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-white/80 p-3 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-700">
                <Package2 size={18} />
                <span className="text-sm font-semibold">Live operations center</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.title} to={section.href} className="block rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${section.color} text-white`}>
                  <Icon size={18} />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-gray-900">{section.title}</h2>
                <p className="mt-2 text-sm text-gray-600">{section.description}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                  Open section <ArrowRight size={16} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Operational Documents & Resource Library */}
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="text-emerald-600" size={20} />
              Resource Library & Operational Guidelines
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Access standard operating procedures, template logs, safety guidelines, and legal documents for food donations.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: 'Food Safety Standard Operating Procedures (SOP)',
                desc: 'Official guidelines on food temperatures, hygiene, shelf-life validation, allergen controls, and packaging requirements.',
                type: 'PDF Guide',
                size: '1.4 MB',
              },
              {
                title: 'Good Samaritan Food Protection Guide',
                desc: 'A comprehensive summary of liability protections and legal rights for food donors and distribution charities.',
                type: 'PDF Document',
                size: '890 KB',
              },
              {
                title: 'NGO Logbook & Handover Protocol Template',
                desc: 'A print-friendly logbook template for NGOs to record food weight, donor source, transit time, and temperature at receipt.',
                type: 'XLSX Sheet',
                size: '420 KB',
              },
              {
                title: 'Volunteer Onboarding & Training Checklist',
                desc: 'Quick instruction guide for training volunteers on safe food handling, pickup logs, and community distribution protocols.',
                type: 'DOCX Template',
                size: '1.2 MB',
              },
            ].map((doc) => (
              <article key={doc.title} className="rounded-2xl border border-gray-100 p-4 bg-gray-50/50 flex flex-col justify-between hover:border-emerald-100 transition-colors">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="rounded bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                      {doc.type}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold">{doc.size}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm">{doc.title}</h3>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{doc.desc}</p>
                </div>
                <button
                  type="button"
                  className="mt-4 w-full rounded-xl border border-emerald-600 bg-white py-2 text-center text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                >
                  Download File
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
