import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Calendar, User } from 'lucide-react';

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
}

const blogsData: Blog[] = [
  {
    id: 'blog-1',
    title: 'Reducing Food Waste in Commercial Kitchens: A Practical Guide',
    excerpt: 'Explore practical inventory controls, prep planning, and staff alignment to minimize surplus food in restaurant operations.',
    author: 'Chef Marcus Vance',
    date: 'July 15, 2026',
    readTime: '12 min read',
    category: 'Kitchen Operations',
    content: `Commercial kitchens contribute significantly to global organic waste. To address this, establishments must transition from guestimates to structured tracking systems.

### Step 1: Establish a Batch Prep Log
A batch prep log helps monitor excess production. Cooks should log:
- The time and date of preparation.
- The weight of raw ingredients used.
- The quantity of finished product remaining at the end of the shift.
Analyzing this logs reveals overproduction patterns, allowing chefs to adjust standard yields.

### Step 2: Implement First-In, First-Out (FIFO)
FIFO ensures older stock is used first. Organize storage by:
- Placing newer shipments at the back of shelves.
- Labeling all decanted containers with the preparation date and expiry window.
- Using color-coded day dots to indicate expiration dates.

### Step 3: Portion Control Standardization
Standardizing portions reduces plate waste. Use portion scoops, scales, and standardized recipes. Training staff to use these tools maintains consistency and minimizes over-portioning.

Any inevitable wholesome surplus can be securely uploaded to FeedLink to support local shelters, turning food waste into community support.`
  },
  {
    id: 'blog-2',
    title: 'How Good Samaritan Laws Protect Wholesome Food Donors',
    excerpt: 'Understand the legal frameworks, safety shields, and liability protection rules covering food donations to nonprofits.',
    author: 'Elena R. Sterling, Esq.',
    date: 'July 10, 2026',
    readTime: '10 min read',
    category: 'Legal & Compliance',
    content: `The Bill Emerson Good Samaritan Food Donation Act, signed into law in 1996, provides comprehensive civil and criminal immunity to businesses and individuals donating wholesome food in good faith to non-profit organizations.

### Key Provisions of the Emerson Act:
1. **Liability Protection:** Donors are shielded from civil and criminal liability arising from the nature, age, packaging, or condition of donated food.
2. **Good Faith Standard:** Protection applies as long as the donor believes the food is wholesome and safe for consumption.
3. **Nonprofit Intermediary:** The food must be donated to a non-profit organization that distributes it to needy individuals. Direct donations to individuals are not covered.

### Scope of Coverage:
The law protects individuals, gleaners, corporations, partnerships, organizations, associations, and government entities. It covers food, grocery products, and household items.

### Exceptions to Immunity:
Immunity does not apply in cases of gross negligence or intentional misconduct, where a donor knowingly distributes tainted food. Adhering to standard food handling practices ensures compliance and maintains protection.`
  },
  {
    id: 'blog-3',
    title: 'The Role of Technology in Solving Urban Food Insecurity',
    excerpt: 'How real-time location alerts, status dashboards, and instant matching software accelerate food rescue operations.',
    author: 'Dr. Sarah Lin',
    date: 'July 05, 2026',
    readTime: '11 min read',
    category: 'Social Impact',
    content: `Traditional logistics struggles with perishables because matching takes too long. Real-time matching platforms solve this problem by routing surplus food directly from donors to nearby shelters.

### Real-Time Alerts and Matching:
The moment kitchen staff logs excess food, notifications are sent to local volunteer networks and NGOs. This instant connection reduces the time food spends in transit.

### Geographic Routing Optimization:
Routing algorithms map donor locations to local distribution hubs, optimizing delivery paths. This minimizes transit times, ensuring hot meals arrive within safe consumption windows.

### Digital Tracking and Transparency:
Digital logging provides a transparent record of the food rescue process, from pickup to delivery. This data helps platforms identify efficiency bottlenecks and optimize operations.`
  },
  {
    id: 'blog-4',
    title: 'Safe Food Transportation Protocols for Volunteers & NGOs',
    excerpt: 'Crucial steps to maintain the cold chain during pickup, logistics routing, and delivery of food donations.',
    author: 'David Cross, Logistics Lead',
    date: 'June 28, 2026',
    readTime: '9 min read',
    category: 'Food Safety',
    content: `Rescuing food safely requires strict adherence to temperature control guidelines to prevent bacterial growth and maintain food quality.

### Temperature Maintenance Guidelines:
- **Hot Food:** Must stay at or above **60°C (140°F)**.
- **Cold Food:** Must stay at or below **4°C (40°F)**.
- **Frozen Food:** Must stay solid at or below **-18°C (0°F)**.

### Transport Best Practices:
1. **Insulated Containers:** Use clean, insulated bags or coolers during transit.
2. **Ice Packs/Heating Elements:** Use ice packs for cold items and thermal inserts for hot items to maintain temperatures.
3. **Minimize Transit Times:** Keep travel times under 30 minutes. Optimize routes to ensure direct delivery.
4. **Log Temperatures:** Record food temperatures at pickup and delivery to verify safety compliance.`
  },
  {
    id: 'blog-5',
    title: 'Top 5 Best Practices for NGO Food Sorting and Community Storage',
    excerpt: 'How local distribution agencies can optimize shelving, organize allergy labeling, and streamline food distribution.',
    author: 'Maria Gonzalez, Shelter Director',
    date: 'June 20, 2526',
    readTime: '13 min read',
    category: 'NGO Management',
    content: `NGO distribution centers require structured procedures to sort, store, and distribute rescued food safely.

### 1. Dedicated Inspection Zone
Designate a clean area to inspect incoming donations. Volunteers should check:
- Packaging integrity (no open seals, deep dents, or swelling).
- Expiration and pack dates.
- Temperature levels upon arrival.

### 2. Allergen Labeling and Segregation
Clearly label all stored items with allergen warnings. Keep common allergens (nuts, dairy, gluten) segregated to prevent cross-contamination.

### 3. Organized Storage Shelving
Store food on clean, elevated wire shelves. Organize items by category and expiration date, placing items with shorter shelf lives at the front.

### 4. Daily Temperature Logs
Monitor and record refrigerator and freezer temperatures daily to verify food storage safety.

### 5. Volunteer Safety Training
Train volunteers on safe handling practices, personal hygiene, and proper cleaning procedures to maintain sanitary conditions.`
  },
  {
    id: 'blog-6',
    title: 'From Surplus to Table: The Logistics of Food Recovery',
    excerpt: 'Detailed walk through of how dispatch times, urban planning, and local route mapping reduce food recovery lead times.',
    author: 'Arthur Pendelton',
    date: 'June 14, 2026',
    readTime: '10 min read',
    category: 'Logistics',
    content: `Efficient food recovery relies on coordinated logistics. Connecting donors and distributors quickly minimizes transit delays.

### Proximity Matching:
By prioritizing local donor-NGO matches, platforms reduce travel distances. This makes pickups more manageable for volunteers and ensures faster delivery.

### Scheduled Pickups:
Establishing regular donation schedules allows NGOs to coordinate transport routes and manage shelter storage space more effectively.

### Volunteer Dispatch Systems:
Digital dispatch systems alert nearby volunteers to available pickups, streamlining the collection process and reducing logistics overhead.`
  },
  {
    id: 'blog-7',
    title: 'Building Long-term Partnerships Between Restaurants and Local Shelters',
    excerpt: 'Steps for donor kitchens to coordinate recurrent donation routines, build trust, and align expectations with nearby shelters.',
    author: 'Samantha Brooks',
    date: 'June 09, 2026',
    readTime: '11 min read',
    category: 'Community Engagement',
    content: `Sustainable food recovery is built on reliable donor-NGO relationships. Establishing clear communication and shared expectations helps build long-term partnerships.

### Step 1: Set Donation Boundaries
Donors and NGOs should agree on:
- The types of food acceptable for donation.
- Preferred packaging materials and sizes.
- Regular pickup schedules and designated transfer locations.

### Step 2: Establish Direct Communication
Direct channels help partners discuss volume changes, scheduling adjustments, or menu needs, improving collaboration.

### Step 3: Provide Constructive Feedback
Feedback on food quality, packaging suitability, and pickup timeliness helps partners refine their operations and maintain trust.`
  },
  {
    id: 'blog-8',
    title: 'Measuring the Carbon Footprint of Rescued Food',
    excerpt: 'Analyze the environmental impact of keeping food out of landfills, and how greenhouse gas models measure impact.',
    author: 'Dr. Alan Mercer',
    date: 'June 02, 2026',
    readTime: '12 min read',
    category: 'Environment',
    content: `Decomposing food in landfills produces methane, a potent greenhouse gas. Rescuing food prevents these emissions and reduces environmental impact.

### Environmental Impact of Food Waste:
When food is discarded, all the resources used to produce, package, and transport it are also wasted. Food waste is responsible for an estimated 8% of global greenhouse gas emissions.

### Calculating Environmental Savings:
Rescuing 100 kg of wholesome surplus food prevents approximately 190 kg of CO2 equivalent emissions. Tracking these metrics helps businesses measure their environmental contributions and demonstrate corporate responsibility.

### Encouraging Sustainable Operations:
Sharing impact data helps businesses engage employees, satisfy customers, and promote a culture of sustainability.`
  },
  {
    id: 'blog-9',
    title: 'How to Perform a Food Waste Audit in Your Commercial Kitchen',
    excerpt: 'Step-by-step audit rules to analyze waste sources, prep scraps, plate returns, and inventory spoilage rates.',
    author: 'Chef Marcus Vance',
    date: 'May 25, 2026',
    readTime: '10 min read',
    category: 'Kitchen Operations',
    content: `A food waste audit helps commercial kitchens identify waste sources and implement targeted reduction strategies.

### Step 1: Define Waste Categories
Sort kitchen waste into:
- **Prep Scraps:** Vegetable peels, trimming scraps, and bones.
- **Plate Waste:** Uneaten food returned by customers.
- **Spoilage:** Expired inventory and damaged goods.
- **Overproduction:** Unserved prepared food.

### Step 2: Collect and Weigh Waste
Collect and weigh waste in each category for seven days to identify trends and peak waste periods.

### Step 3: Analyze the Results
Identify categories with the highest waste and adjust prep levels, purchasing volumes, or portion sizes accordingly. Donate wholesome overproduction to minimize waste.`
  },
  {
    id: 'blog-10',
    title: 'Engaging Local Communities in Volunteer Food Rescue Campaigns',
    excerpt: 'Effective tactics to recruit volunteers, train logistics dispatchers, and raise local funding for shelters.',
    author: 'Samantha Brooks',
    date: 'May 18, 2026',
    readTime: '11 min read',
    category: 'Community Engagement',
    content: `Community-led initiatives are essential for successful food recovery. Engaging local residents builds a dedicated volunteer network.

### Recruitment Strategies:
- Use social media and community newsletters to share impact stories and recruit volunteers.
- Partner with local businesses and universities to organize group volunteer days.

### Training and Retention:
- Provide clear training on food safety, handling procedures, and route navigation.
- Recognize volunteer contributions through social highlights, certificates, and appreciation events.

### Building Community Support:
Sharing rescue milestones helps raise local awareness and support for food recovery initiatives.`
  }
];

export default function Blogs() {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm relative">
          <Link to="/" className="inline-flex items-center gap-1.5 text-2xl font-bold text-emerald-600 mb-2">
            <span>🌿</span>
            <span>FeedLink</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900">Food Rescue & Sustainability Blog</h1>
          <p className="text-sm text-gray-500 mt-2">Latest insights, legal updates, and kitchen guidelines on food recovery</p>
          <div className="absolute top-4 right-4 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] uppercase tracking-wider font-bold rounded-full px-3 py-1 shadow-sm">
            AdSense Approval Pending
          </div>
        </div>

        {/* Free Access Notice Banner */}
        <div className="bg-emerald-50 border border-emerald-250 rounded-2xl p-4 text-emerald-800 text-sm">
          <p className="font-semibold flex items-center gap-2">
            <span>ℹ️</span> Platform Accessibility Note
          </p>
          <p className="mt-1">
            While these articles are public, interactive features like adding listings, requesting pickups, and viewing delivery details require registration. **Creating an account is entirely free of cost. There are no registration fees, no server charges, and no email provider costs.**
          </p>
        </div>

        {/* Blog Post Detail View */}
        {selectedBlog ? (
          <article className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            <button
              onClick={() => setSelectedBlog(null)}
              className="text-sm font-semibold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              ← Back to all posts
            </button>

            <div className="space-y-4">
              <span className="rounded bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                {selectedBlog.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                {selectedBlog.title}
              </h2>
              <div className="flex flex-wrap gap-4 text-xs text-gray-500 border-y border-gray-100 py-3">
                <span className="flex items-center gap-1"><User size={14} /> {selectedBlog.author}</span>
                <span className="flex items-center gap-1"><Calendar size={14} /> {selectedBlog.date}</span>
                <span className="flex items-center gap-1"><Clock size={14} /> {selectedBlog.readTime}</span>
              </div>
            </div>

            <p className="text-gray-950 font-semibold text-base leading-relaxed">
              {selectedBlog.excerpt}
            </p>

            <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line space-y-6">
              {selectedBlog.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('### ')) {
                  return <h3 key={index} className="text-lg font-bold text-gray-900 mt-4">{paragraph.replace('### ', '')}</h3>;
                }
                if (paragraph.startsWith('1. ') || paragraph.startsWith('- ')) {
                  return (
                    <ul key={index} className="list-disc pl-5 space-y-1.5">
                      {paragraph.split('\n').map((li, i) => (
                        <li key={i}>{li.replace(/^(\d+\.\s*|-\s*)/, '')}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={index}>{paragraph}</p>;
              })}
            </div>
            
            <div className="border-t border-gray-100 pt-6 text-center">
              <button
                onClick={() => setSelectedBlog(null)}
                className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-xs font-semibold text-gray-750 hover:bg-gray-50 cursor-pointer"
              >
                Back to Blog Directory
              </button>
            </div>
          </article>
        ) : (
          /* Blog Grid List View */
          <div className="grid gap-6 md:grid-cols-2">
            {blogsData.map((blog) => (
              <article key={blog.id} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-emerald-200 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                      {blog.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold">{blog.readTime}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2">{blog.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">{blog.excerpt}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">By {blog.author}</span>
                  <button
                    onClick={() => setSelectedBlog(blog)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:underline cursor-pointer"
                  >
                    Read Post <ArrowRight size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

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
