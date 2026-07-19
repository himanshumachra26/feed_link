import { Link } from 'react-router-dom';
import { Lock, Unlock } from 'lucide-react';

interface RouteItem {
  name: string;
  path: string;
  desc: string;
  authRequired: boolean;
}

interface RoleSection {
  role: string;
  badgeColor: string;
  desc: string;
  routes: RouteItem[];
}

const sitemapData: RoleSection[] = [
  {
    role: 'Guest / Public User',
    badgeColor: 'bg-gray-100 text-gray-800 border-gray-200',
    desc: 'Pages accessible immediately without registering. Ideal for exploring platform stats and finding information.',
    routes: [
      { name: 'Home Landing Page', path: '/', desc: 'Platform landing page featuring stats, how it works, and login forms.', authRequired: false },
      { name: 'About Us', path: '/about', desc: 'Learn about FeedLink’s food rescue mission, background, and partners.', authRequired: false },
      { name: 'Food Rescue & Safety Blogs', path: '/blogs', desc: 'Read food safety procedures, waste reduction guidelines, and legal acts.', authRequired: false },
      { name: 'Help & FAQs', path: '/help', desc: 'Answers to general logistics, pickup windows, and standard compliance questions.', authRequired: false },
      { name: 'Terms of Service', path: '/terms', desc: 'User agreement containing Emerson Good Samaritan Act details and safety norms.', authRequired: false },
      { name: 'Privacy Policy', path: '/privacy', desc: 'Information details regarding secure data storage, masking, and Google AdSense.', authRequired: false },
      { name: 'Sitemap Directory', path: '/sitemap', desc: 'This page. A visual list of all pages and authentication rules.', authRequired: false },
      { name: 'Advertising Partner Info', path: '/ads-partner', desc: 'Detailed terms and data sharing statements for upcoming ad network partnerships.', authRequired: false },
      { name: 'Explore Dashboard (Donor Mode)', path: '/donor', desc: 'Browse stats and layout of a food provider dashboard (masked details).', authRequired: false },
      { name: 'Explore Dashboard (NGO Mode)', path: '/ngo', desc: 'Browse stats and layout of a shelter partner dashboard (masked details).', authRequired: false },
      { name: 'Explore Dashboard (Admin Mode)', path: '/admin', desc: 'Browse stats and layout of a platform manager dashboard (masked details).', authRequired: false },
    ],
  },
  {
    role: 'Donor (Restaurants & Food Providers)',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-100',
    desc: 'Authorized pages for businesses posting wholesome surplus food donations.',
    routes: [
      { name: 'Donor Dashboard', path: '/donor', desc: 'Overview of active listings, pending pickup requests, and quick stats.', authRequired: false },
      { name: 'Create Donation Listing', path: '/donor/listings/new', desc: 'Publish details, portions, allergens, and pickup times for surplus food.', authRequired: true },
      { name: 'My Listings Directory', path: '/donor/listings', desc: 'View, filter, edit, or delete listings published by your organization.', authRequired: false },
      { name: 'Manage Pickup Requests', path: '/donor/requests', desc: 'Approve or reject requests submitted by local NGOs and mark food left.', authRequired: false },
      { name: 'Operations Hub', path: '/donor/operations', desc: 'Access guides, logs, and downloads to assist in food prep packaging.', authRequired: false },
      { name: 'Donor Reports', path: '/donor/reports', desc: 'Review environmental carbon savings, total meals saved, and partner metrics.', authRequired: false },
      { name: 'Past Handover Records', path: '/donor/records', desc: 'Access comprehensive transaction logs of completed food pickups.', authRequired: false },
      { name: 'Account Settings', path: '/donor/settings', desc: 'Update default address, contact phone, operating times, and password.', authRequired: true },
      { name: 'Profile Information', path: '/donor/profile', desc: 'Review your verification status and public account credentials.', authRequired: true },
    ],
  },
  {
    role: 'NGO (Shelters, Pantries, & Charities)',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-100',
    desc: 'Authorized pages for verified non-profit partners requesting food pickups.',
    routes: [
      { name: 'NGO Dashboard', path: '/ngo', desc: 'Overview of current pickup statuses, available listings, and impact metrics.', authRequired: false },
      { name: 'Browse Food Listings', path: '/ngo/browse', desc: 'Explore fresh food listings shared by nearby restaurants and place claims.', authRequired: false },
      { name: 'My Pickup Requests', path: '/ngo/requests', desc: 'Track pending requests, view accepted pickup instructions, and confirm collections.', authRequired: false },
      { name: 'Operations Hub', path: '/ngo/operations', desc: 'Access food handling guidelines, log templates, and delivery checklists.', authRequired: false },
      { name: 'Impact Reports', path: '/ngo/reports', desc: 'Track meals distributed, partner count, and volunteer logistics efficiency.', authRequired: false },
      { name: 'Claim History Records', path: '/ngo/records', desc: 'Review historical receipt logs for audit compliance and reporting.', authRequired: false },
      { name: 'NGO Account Settings', path: '/ngo/settings', desc: 'Edit alert options, contact email, phone, location, and password.', authRequired: true },
      { name: 'NGO Profile Info', path: '/ngo/profile', desc: 'Access public listings and review organization details.', authRequired: true },
    ],
  },
  {
    role: 'Platform Administrator (Admin)',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    desc: 'Authorized pages for platform administrators managing user registrations and listings.',
    routes: [
      { name: 'Admin Dashboard', path: '/admin', desc: 'High-level dashboard monitoring registered accounts, listings, and pickups.', authRequired: false },
      { name: 'User Management', path: '/admin/users', desc: 'Approve new registrations, verify business details, and suspend violations.', authRequired: true },
      { name: 'Listing Moderation', path: '/admin/listings', desc: 'Monitor, edit, or remove listings to maintain trust standards.', authRequired: true },
      { name: 'System Requests Log', path: '/admin/requests', desc: 'Review all matches, request histories, and approval timelines.', authRequired: true },
      { name: 'Transit Deliveries Dispatch', path: '/admin/deliveries', desc: 'Track active pickups in transit and troubleshoot delivery issues.', authRequired: true },
      { name: 'System Reports', path: '/admin/reports', desc: 'Access system growth metrics, regional success rates, and partner logs.', authRequired: true },
      { name: 'All Transaction Records', path: '/admin/records', desc: 'Search and export complete historical database transaction logs.', authRequired: true },
      { name: 'Admin Settings', path: '/admin/settings', desc: 'Manage administration credentials and activity alerts.', authRequired: true },
    ],
  },
];

export default function Sitemap() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        
        {/* Header Section */}
        <div className="text-center border-b border-gray-150 pb-6 relative">
          <Link to="/" className="inline-flex items-center gap-1.5 text-2xl font-bold text-emerald-600 mb-2">
            <span>🌿</span>
            <span>FeedLink</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900">Sitemap & User Directory</h1>
          <p className="text-sm text-gray-500 mt-2">Complete structure of pages and access rules under each user role</p>
          <div className="absolute top-0 right-0 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] uppercase tracking-wider font-bold rounded-full px-3 py-1 shadow-sm">
            AdSense Approval Pending
          </div>
        </div>

        {/* Free Access Notice Banner */}
        <div className="bg-emerald-50 border border-emerald-250 rounded-2xl p-4 text-emerald-800 text-sm">
          <p className="font-semibold flex items-center gap-2">
            <span>ℹ️</span> Access Control Note
          </p>
          <p className="mt-1">
            Guest users can explore the structure and view public dashboard layouts. However, writing changes or opening sensitive configurations requires logging in. **Registration is 100% free of charge with zero server or SMS provider fees.**
          </p>
        </div>

        {/* Sitemap Sections */}
        <div className="space-y-10">
          {sitemapData.map((section) => (
            <section key={section.role} className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-bold text-gray-950">{section.role}</h2>
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${section.badgeColor}`}>
                  {section.routes.length} pages
                </span>
              </div>
              <p className="text-xs text-gray-500">{section.desc}</p>
              
              <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-150 bg-gray-50/50">
                {section.routes.map((route) => (
                  <div key={route.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 hover:bg-white transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link to={route.path} className="text-sm font-semibold text-emerald-700 hover:underline">
                          {route.name}
                        </Link>
                        <code className="rounded bg-gray-200 px-1.5 py-0.5 text-[10px] text-gray-600 font-mono">
                          {route.path}
                        </code>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{route.desc}</p>
                    </div>

                    <div className="flex-shrink-0 flex items-center gap-1.5">
                      {route.authRequired ? (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-50 border border-amber-200 px-2.5 py-1 text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                          <Lock size={12} /> Sign-in Required
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-50 border border-emerald-150 px-2.5 py-1 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                          <Unlock size={12} /> Public / Guest OK
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
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
