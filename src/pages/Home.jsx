import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import lcccLogo from '../assets/LCCC-logo.png';
import chedLogo from '../assets/CHED-logo.png'; // Import logo URLs

export default function Home() {
  const [announcements, setAnnouncements] = useState([]);
  const [services, setServices] = useState([]);
  const [homeData, setHomeData] = useState({
    hero_title: 'Nurturing Student Welfare & Growth Outside the Classroom',
    hero_subtitle: 'Supporting your journey at La Carlota City College through personal development, counseling, activities, and campus life advocacy.',
    hero_bg_image: '/school-bg.jpg' // Default fallback [1]
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==========================================
  // NEW: LCCC INTERACTIVE MODAL STATE [1]
  // ==========================================
  const [isLcccModalOpen, setIsLcccModalOpen] = useState(false);
  const [lcccActiveTab, setLcccActiveTab] = useState('history'); // Tracks active tab inside modal [1]
  
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [annRes, srvRes, homeRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/announcements`),
          fetch(`${API_BASE_URL}/api/site-services`),
          fetch(`${API_BASE_URL}/api/home`) // Fetch dynamic hero contents [1]
        ]);
        
        if (!annRes.ok || !srvRes.ok || !homeRes.ok) {
          throw new Error('Failed to retrieve homepage data.');
        }
        
        const annData = await annRes.json();
        const srvData = await srvRes.json();
        const hData = await homeRes.json();
        
        setAnnouncements(annData);
        setServices(srvData);
        if (hData.hero_title) {
          setHomeData(hData); // Populate dynamic homepage text/image [1]
        }
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
  
  const renderedServices = services.filter(item => item.service_type === 'service');
  const renderedPrograms = services.filter(item => item.service_type === 'program');
  
  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* 
        ================= HERO SECTION (DYNAMICALLY RESOLVED) ================= 
        Loads background, titles, and subtitles directly from your cloud database [1]
      */}
      <header className="relative py-24 px-4 text-center overflow-hidden min-h-112.5 flex items-center justify-center">
        
        {/* Dynamic Background Image (Loads Base64 or standard path seamlessly) */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-500"
          style={{ backgroundImage: `url('${homeData.hero_bg_image}')` }}
        />
        <div className="absolute inset-0 bg-linear-to-br from-emerald-950/95 via-emerald-900/90 to-slate-950/95 z-10" />
        
        <div className="relative z-20 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight text-white">
            {homeData.hero_title}
          </h1>
          <p className="text-sm md:text-base text-emerald-100/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            {homeData.hero_subtitle}
          </p>
          <div className="flex justify-center">
            {/* Navigates smoothly to Services grid below when clicked */}
            <a 
              href="#services-section"
              className="bg-white hover:bg-slate-100 text-emerald-950 font-bold px-8 py-3 rounded-md shadow-md transition text-sm cursor-pointer"
            >
              Explore Our Services
            </a>
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
            <h3 className="text-lg font-bold text-slate-900">No Announcements!</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              There are currently no active announcements available. Please check back soon for updates on scholarships, student activities, and guidance counseling schedules.
            </p>
            <div className="pt-2">
              <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                La Carlota City College
              </span>
            </div>
          </div>
        )}
      </section>

      {/* ================= LCCC SECTION ================= */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            <div className="flex justify-center">
              <div className="w-80 h-80 overflow-hidden bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center shadow-sm border border-emerald-100/50">
                <img className="w-full h-full" src={lcccLogo} alt="LCCC Logo" />
              </div>
            </div>

            {/* TEXT CONTENT COLUMN */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                  La Carlota City College
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-4">
                  The College
                </h2>
              </div>
              
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                La Carlota City College (LCCC) was established in 1966 with a noble vision: to provide affordable, high-quality tertiary education to the youth of La Carlota City and its neighboring towns. As the first city college in Negros and a recognized center of academic excellence, LCCC remains "A College for the People"—serving as a vital catalyst for positive change, community progress, and student success.
              </p>

              <div>
                {/* Trigger: Open Interactive LCCC Detail Modal */}
                <button
                  onClick={() => setIsLcccModalOpen(true)}
                  className="w-1/3 bg-emerald-800 hover:bg-emerald-950 text-white font-semibold text-xs py-2.5 px-4 rounded text-center transition cursor-pointer"
                >
                  Read More
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* =============================================================== */}

      {/* ================= CHED SECTION ================= */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            <div className="flex justify-center md:order-last">
              <div className="w-80 h-80 overflow-hidden bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center shadow-sm border border-emerald-100/50">
                <img className="w-full h-full" src={chedLogo} alt="CHED Logo" />
              </div>
            </div>

            {/* TEXT CONTENT COLUMN */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                  Commission on Higher Education
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-4">
                  What is CHED-NIR?
                </h2>
              </div>
              
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                CHED-NIR is the newly established regional office of the Commission on Higher Education dedicated to serving the Negros Island Region. Functioning through its main regional office in Dumaguete City and a sub-regional office in Talisay City, CHED-NIR streamlines essential services for local students and institutions—including academic record verification (CAV), institutional quality evaluation, and the administration of national scholarship programs like UniFAST.
              </p>

              <div>
                {/* Securely open official CHED resource in a new tab [1] */}
                <button
                  onClick={() => window.open('https://ched.gov.ph', '_blank', 'noopener,noreferrer')}
                  className="w-1/3 bg-emerald-800 hover:bg-emerald-950 text-white font-semibold text-xs py-2 px-4 rounded text-center transition cursor-pointer"
                >
                  Read More
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* =============================================================== */}

      {/* Services and Programs Grid */}
      <section id="services-section" className="py-16 border-t border-b border-slate-200">
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

      {/* 
        ===================================================================
        NEW: LCCC INTERACTIVE DETAIL OVERLAY MODAL (CUSTOMIZABLE SNIPPET) [1]
        ===================================================================
        - This is the interactive overlay triggered by clicking "Read More" under the LCCC section [1].
        - It uses your Emerald-Green & White theme and features internal tabs to swap details [1].
        - Scroll down and edit the text inside any tab segment to customize your LCCC content! [1]
      */}
      {isLcccModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-emerald-900 text-white px-6 py-5 flex justify-between items-center sticky top-0 z-10 shadow-sm">
              <div className="flex items-center space-x-3">
                <img src={lcccLogo} alt="LCCC Seal" className="h-10 w-10 bg-white rounded-full p-1" />
                <div>
                  <h3 className="font-extrabold text-base leading-tight">La Carlota City College</h3>
                  <p className="text-[10px] text-emerald-200 uppercase tracking-widest font-semibold mt-0.5">History of La Carlota City College</p>
                </div>
              </div>
            </div>

            {/* Modal Hero Image */}
            <div className="h-48 w-full bg-slate-100 overflow-hidden relative">
              <img 
                src={homeData.hero_bg_image || '/school-bg.jpg'} 
                alt="LCCC Campus" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
              <span className="absolute bottom-4 left-6 text-white font-bold text-lg">"A College for the People"</span>
            </div>

            {/* Modal Interactive Navigation Tabs [1] */}
            <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
              <button 
                onClick={() => setLcccActiveTab('history')}
                className={`flex-1 py-3 text-center border-b-2 transition cursor-pointer ${lcccActiveTab === 'history' ? 'border-emerald-800 text-emerald-900 font-bold bg-white' : 'border-transparent hover:bg-slate-100'}`}
              >
                📖 Our History
              </button>
              <button 
                onClick={() => setLcccActiveTab('campuses')}
                className={`flex-1 py-3 text-center border-b-2 transition cursor-pointer ${lcccActiveTab === 'campuses' ? 'border-emerald-800 text-emerald-900 font-bold bg-white' : 'border-transparent hover:bg-slate-100'}`}
              >
                🏫 Campuses
              </button>
              <button 
                onClick={() => setLcccActiveTab('values')}
                className={`flex-1 py-3 text-center border-b-2 transition cursor-pointer ${lcccActiveTab === 'values' ? 'border-emerald-800 text-emerald-900 font-bold bg-white' : 'border-transparent hover:bg-slate-100'}`}
              >
                💎 Core Values
              </button>
            </div>

            {/* Modal Dynamic Body Content */}
            <div className="p-6 grow overflow-y-auto">
              
              {/* --- SUB-TAB A: HISTORY TEXT (EDITABLE) --- */}
              {lcccActiveTab === 'history' && (
                <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                  <h4 className="font-extrabold text-slate-900 text-base">Established in 1966</h4>
                  <p>
                    La Carlota City College (LCCC) was chartered in 1966 through the collaborative efforts of local government leaders and educational pioneers. Our primary mandate is to provide affordable, accessible, and top-tier higher education for students who might otherwise be constrained by financial barriers [1].
                  </p>
                  <p>
                    LCCC holds a distinct legacy as the pioneer city college in the province of Negros Occidental. Over the decades, it has expanded its academic programs, acquired recognition under CHED policies, and graduated thousands of professionals now leading in industries both locally and internationally [1].
                  </p>
                  <p className="italic bg-emerald-50 border-l-4 border-emerald-800 text-emerald-950 p-3 rounded-r text-xs">
                    "LCCC serves as a vital catalyst for positive change, community progress, and student success."
                  </p>
                </div>
              )}

              {/* --- SUB-TAB B: CAMPUS DETAILS (EDITABLE) --- */}
              {lcccActiveTab === 'campuses' && (
                <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                  <h4 className="font-extrabold text-slate-900 text-base">Our Learning Centers</h4>
                  <p>
                    LCCC provides conducive study, recreational, and organizational facilities across our campuses to support student integration and holistic development [1].
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="border border-slate-100 p-4 rounded-lg bg-slate-50">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1">🏢 Main Administration Campus</h5>
                      <p className="text-xs text-slate-500">Houses central administrative offices, the main library, science labs, and academic classrooms for foundational college programs.</p>
                    </div>
                    <div className="border border-slate-100 p-4 rounded-lg bg-slate-50">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1">🏛️ LCCC Gymnasium & Oval</h5>
                      <p className="text-xs text-slate-500">The premier location for physical development, university athletic events, club assemblies, and the annual student organization fair.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* --- SUB-TAB C: CORE VALUES (EDITABLE WITH ICONS) --- */}
              {lcccActiveTab === 'values' && (
                <div className="space-y-6">
                  <h4 className="font-extrabold text-slate-900 text-base">The Pillars of LCCC</h4>
                  <div className="space-y-4">
                    
                    {/* Value 1 */}
                    <div className="flex items-start space-x-3">
                      <div className="text-emerald-700 bg-emerald-50 h-8 w-8 rounded-full flex items-center justify-center text-xs shrink-0 mt-1">
                        <i className="fa-solid fa-medal"></i>
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900 text-sm">Academic Excellence</h5>
                        <p className="text-xs text-slate-500 leading-relaxed mt-0.5">Striving constantly to deliver quality tertiary programs accredited under national education commissions [1].</p>
                      </div>
                    </div>

                    {/* Value 2 */}
                    <div className="flex items-start space-x-3">
                      <div className="text-emerald-700 bg-emerald-50 h-8 w-8 rounded-full flex items-center justify-center text-xs shrink-0 mt-1">
                        <i className="fa-solid fa-handshake-angle"></i>
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900 text-sm">Social Responsibility</h5>
                        <p className="text-xs text-slate-500 leading-relaxed mt-0.5">Empowering community-driven programs, waste-reduction campaigns, and active socio-civic leadership.</p>
                      </div>
                    </div>

                    {/* Value 3 */}
                    <div className="flex items-start space-x-3">
                      <div className="text-emerald-700 bg-emerald-50 h-8 w-8 rounded-full flex items-center justify-center text-xs shrink-0 mt-1">
                        <i className="fa-solid fa-star-and-crescent"></i>
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900 text-sm">Inclusivity & Character</h5>
                        <p className="text-xs text-slate-500 leading-relaxed mt-0.5">Preserving a welcoming environment that values diversity, protects student rights, and builds moral standards.</p>
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-100 p-4 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setIsLcccModalOpen(false)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs py-2 px-6 rounded transition cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
      {/* =================================================================== */}

    </div>
  );
}