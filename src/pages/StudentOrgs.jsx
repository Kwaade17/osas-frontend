import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export default function StudentOrgs() {
  const [organizations, setOrganizations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Major", "Program-Limited", "College"];

  // Fetch the accredited organizations from the backend on load
  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/organizations`);
        if (!response.ok) {
          throw new Error('Failed to retrieve organizations.');
        }
        const data = await response.json();
        setOrganizations(data);
      } catch (err) {
        console.error(err);
        setError('Unable to load accredited organizations at this time.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrgs();
  }, []);

  // Filter logic based on type and search input
  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          org.acronym.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || org.org_type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Page Header */}
      <div className="bg-emerald-900 text-white py-12 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">OSAS Accredited Student Organizations</h1>
        <p className="text-emerald-100 mt-2 max-w-xl mx-auto">
          View and check current bulletins of Major, Program-Limited, and College organizations overseen by our CORE Coordinator.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 gap-8">
        
        {/* Left/Middle Column: Directory & Filter */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Accredited Directory</h2>
            
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search by organization name or acronym..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
              <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition cursor-pointer ${
                    selectedCategory === category 
                      ? 'bg-emerald-800 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {category} Orgs
                </button>
              ))}
            </div>
          </div>

          {/* Directory Results */}
          {isLoading ? (
            <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
              <p className="text-slate-500 text-sm">Loading accredited organizations...</p>
            </div>
          ) : error ? (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-lg text-sm text-center">
              ⚠️ {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredOrgs.length > 0 ? (
                filteredOrgs.map((org) => (
                  <div key={org.id} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-200 transition">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-emerald-950 bg-emerald-50 px-2.5 py-0.5 rounded uppercase tracking-wider">
                          {org.acronym}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                          {org.org_type}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base mb-2">{org.name}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">{org.description}</p>
                      
                      {/* New Bulletin/Updates Section */}
                      <div className="bg-emerald-50/50 border border-emerald-100/50 p-3 rounded-md mb-4 mt-2">
                        <h4 className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1">📢 Latest Update:</h4>
                        <p className="text-[11px] text-slate-700 italic leading-snug">{org.latest_update}</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500">
                      🧑‍🏫 Adviser: <span className="font-semibold text-slate-700">{org.adviser}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 text-center py-12 bg-white rounded-lg border border-slate-200">
                  <span className="text-4xl">⚠️</span>
                  <p className="text-sm text-slate-500 mt-2">No accredited organizations match your search or filters.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column */}
        {/* <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-2">Accreditation Process</h2>
            <p className="text-xs text-emerald-100 leading-relaxed mb-6">
              New Major, Program-Limited, and College organizations are registered and approved annually under the LCCC OSAS CORE framework.
            </p>
            <div className="space-y-2">
              <button className="w-full bg-white hover:bg-slate-100 text-emerald-950 font-bold py-2.5 px-4 rounded text-xs transition">
                Checklist of Requirements (PDF)
              </button>
              <button className="w-full bg-transparent hover:bg-white/10 border border-white font-semibold py-2.5 px-4 rounded text-xs transition">
                Download Recognition Form
              </button>
            </div>
          </div>
        </div> */}

      </div>
    </div>
  );
}