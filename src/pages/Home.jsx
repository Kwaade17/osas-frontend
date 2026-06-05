import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export default function Home() {
  const [announcements, setAnnouncements] = useState([]);
  const [services, setServices] = useState([]); // New State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [annRes, srvRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/announcements`),
          fetch(`${API_BASE_URL}/api/site-services`) // Dynamic service endpoint
        ]);
        
        if (!annRes.ok || !srvRes.ok) {
          throw new Error('Failed to retrieve homepage data.');
        }
        
        const annData = await annRes.json();
        const srvData = await srvRes.json();
        
        setAnnouncements(annData);
        setServices(srvData);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
        setError('Unable to load current campus data at this time.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHomeData();
  }, []);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Dynamically split services and programs on the client side [1]
  const renderedServices = services.filter(item => item.service_type === 'service');
  const renderedPrograms = services.filter(item => item.service_type === 'program');
  
  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* Hero Section */}
      <header className="relative py-24 px-4 text-center overflow-hidden min-h-[450px] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-500"
          style={{ backgroundImage: `url('/school-bg.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/95 via-emerald-900/90 to-slate-950/95 z-10" />
        <div className="relative z-20 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight text-white">
            Nurturing Student Welfare & Growth Outside the Classroom
          </h1>
          <p className="text-sm md:text-base text-emerald-100/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Supporting your journey at La Carlota City College through personal development, counseling, activities, and campus life advocacy.
          </p>
          <div className="flex justify-center">
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
          <div className="bg-rose-50 border border-rose-200 text-rose-850 p-6 rounded-lg text-sm text-center">
            ⚠️ {error}
          </div>
        ) : announcements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {announcements.map((item) => (
              <article key={item.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md hover:border-emerald-200 transition flex flex-col justify-between">
                <div>
                  <div className="h-48 w-full overflow-hidden bg-slate-100 relative">
                    <img 
                      src={item.image_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop'} 
                      alt={item.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop';
                      }}
                    />
                  </div>

                  <div className="p-6">
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-4 mb-1">{item.title}</h3>
                    <p className="text-[11px] text-slate-400 mb-4">{formatDate(item.published_date)}</p>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.summary}</p>
                  </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50">
                  <button 
                    onClick={() => alert(`Details for: ${item.title}`)}
                    className="w-full bg-emerald-800 hover:bg-emerald-950 text-white font-semibold text-xs py-2 px-4 rounded text-center transition cursor-pointer"
                  >
                    Read Announcement Details
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="max-w-xl mx-auto bg-white border border-emerald-100 rounded-lg shadow-sm p-8 text-center space-y-4 hover:border-emerald-200 transition">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center text-2xl mx-auto">
              📢
            </div>
            <h3 className="text-lg font-bold text-slate-900">Campus Bulletins are Clear</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              There are currently no active announcements in the OSAS database. Please check back soon for updates regarding scholarships, student activities, and guidance counseling schedules!
            </p>
            <div className="pt-2">
              <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                La Carlota City College
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Services and Flagship Programs Grid */}
      <section className="bg-white py-16 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-16">
            Services and Programs
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* LEFT COLUMN: SERVICES */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-800 mb-4 border-b border-emerald-100 pb-2">
                Our Services
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {renderedServices.length > 0 ? (
                  renderedServices.map((srv) => (
                    <div key={srv.id} className="p-6 bg-slate-50/50 rounded-lg border border-slate-200 hover:border-emerald-400 hover:shadow-sm transition flex flex-col justify-between">
                      <div>
                        <div className="h-10 w-10 bg-emerald-50 text-emerald-800 rounded-lg flex items-center justify-center mb-4 text-base shadow-sm border border-emerald-100/40">
                          <i className={srv.icon_class || 'fa-solid fa-brain'}></i>
                        </div>
                        <h4 className="font-bold text-base text-slate-800 mb-2">{srv.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {srv.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No services listed.</p>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: PROGRAMS */}
            <div className="lg:col-span-1 space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-800 mb-4 border-b border-emerald-100 pb-2">
                Flagship Programs
              </h3>
              
              <div className="grid grid-cols-1 gap-6">
                {renderedPrograms.length > 0 ? (
                  renderedPrograms.map((prg) => (
                    <div key={prg.id} className="p-6 bg-slate-50/50 rounded-lg border border-slate-200 hover:border-emerald-400 hover:shadow-sm transition flex flex-col justify-between">
                      <div>
                        <div className="h-10 w-10 bg-emerald-50 text-emerald-800 rounded-lg flex items-center justify-center mb-4 text-base shadow-sm border border-emerald-100/40">
                          <i className={prg.icon_class || 'fa-solid fa-trophy'}></i>
                        </div>
                        <h4 className="font-bold text-base text-slate-800 mb-2">{prg.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {prg.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No flagship programs listed.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}