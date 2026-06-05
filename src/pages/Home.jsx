import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export default function Home() {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/announcements`);
        if (!response.ok) {
          throw new Error('Failed to retrieve announcements.');
        }
        const data = await response.json();
        setAnnouncements(data);
      } catch (err) {
        console.error('Error fetching announcements:', err);
        setError('Unable to load current announcements at this time.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* 
        ================= HERO SECTION WITH BACKGROUND IMAGE ================= 
        Uses relative positioning, an absolute image back-layer, a dark gradient overlay, 
        and high-contrast text on top.
      */}
      <header className="relative py-24 px-4 text-center overflow-hidden min-h-[450px] flex items-center justify-center">
        
        {/* Background Image Layer (points to public/school-bg.jpg) */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-500"
          style={{ 
            backgroundImage: `url('/school-bg.jpg')`,
            // Optional temporary fallback image if school-bg.jpg is missing
            backgroundFallbackImage: 'linear-gradient(to bottom, #064e3b, #022c22)'
          }}
        />
        
        {/* Dark Emerald Tint Gradient Overlay (Ensures text remains completely legible) */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/95 via-emerald-900/90 to-slate-950/95 z-10" />
        
        {/* Centered Content (elevated with z-20 so it sits on top) */}
        <div className="relative z-20 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight text-white">
            Nurturing Student Welfare & Growth Outside the Classroom
          </h1>
          <p className="text-sm md:text-base text-emerald-100/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Supporting your journey at La Carlota City College through personal development, counseling, activities, and campus life advocacy.
          </p>
          <div className="flex justify-center">
            {/* Centered Primary Call-To-Action Button */}
            <button className="bg-white hover:bg-slate-100 text-emerald-950 font-bold px-8 py-3 rounded-md shadow-md transition text-sm cursor-pointer">
              Explore Our Services
            </button>
          </div>
        </div>
      </header>

      {/* Announcements Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-slate-800 mb-8 border-b border-slate-200 pb-4">
          Latest Announcements
        </h2>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-sm">Loading current announcements...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-lg text-sm text-center">
            ⚠️ {error}
          </div>
        ) : announcements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {announcements.map((item) => (
              <article key={item.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md hover:border-emerald-200 transition flex flex-col justify-between">
                <div className="p-6">
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-4 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-400 mb-4">{formatDate(item.published_date)}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.summary}</p>
                </div>
                <div className="p-6 border-t border-slate-100 bg-slate-50">
                  <a href="#" className="text-xs text-emerald-800 hover:text-emerald-900 font-semibold inline-flex items-center">
                    Read Announcement details &rarr;
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <p className="text-slate-500 text-sm">No announcements posted at this time.</p>
          </div>
        )}
      </section>

      {/* Quick Navigation Core Services */}
      <section className="bg-white py-16 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-12">
            Functional Divisions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Guidance */}
            <div className="p-6 bg-slate-50 rounded-lg border border-slate-200 hover:border-emerald-400 transition">
              <div className="h-10 w-10 bg-emerald-50 text-emerald-800 rounded-lg flex items-center justify-center mb-4 text-xl">🧠</div>
              <h3 className="font-bold text-base text-slate-800 mb-2">Guidance & Counseling</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Confidential testing, counseling sessions, and student guidance support.</p>
            </div>

            {/* Student Discipline */}
            <div className="p-6 bg-slate-50 rounded-lg border border-slate-200 hover:border-emerald-400 transition">
              <div className="h-10 w-10 bg-emerald-50 text-emerald-800 rounded-lg flex items-center justify-center mb-4 text-xl">⚖️</div>
              <h3 className="font-bold text-base text-slate-800 mb-2">Student Discipline</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Advocating student rights while ensuring discipline procedures and handbook guidelines.</p>
            </div>

            {/* Student Orgs */}
            <div className="p-6 bg-slate-50 rounded-lg border border-slate-200 hover:border-emerald-400 transition">
              <div className="h-10 w-10 bg-emerald-50 text-emerald-800 rounded-lg flex items-center justify-center mb-4 text-xl">👥</div>
              <h3 className="font-bold text-base text-slate-800 mb-2">Student Government</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Connecting student leaders and promoting transparent administrative activities.</p>
            </div>

            {/* Student Pubs */}
            <div className="p-6 bg-slate-50 rounded-lg border border-slate-200 hover:border-emerald-400 transition">
              <div className="h-10 w-10 bg-emerald-50 text-emerald-800 rounded-lg flex items-center justify-center mb-4 text-xl">✍️</div>
              <h3 className="font-bold text-base text-slate-800 mb-2">Publications</h3>
              <p className="text-xs text-slate-600 leading-relaxed">The home of freedom of expression and student journalism outlets.</p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}