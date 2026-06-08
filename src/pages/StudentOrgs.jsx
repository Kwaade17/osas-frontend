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
            <div className="space-y-8">
              {filteredOrgs.length > 0 ? (
                ["Major", "Program-Limited", "College"].map((category) => {
                  const categoryOrgs = filteredOrgs.filter((org) => org.org_type === category);

                  if (categoryOrgs.length === 0) {
                    return null;
                  }

                  return (
                    <div key={category} className="space-y-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{category} Organizations</h3>
                          <p className="text-sm text-slate-500">Grouped by category for easier navigation and review.</p>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-600">
                          {categoryOrgs.length} {categoryOrgs.length === 1 ? 'organization' : 'organizations'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {categoryOrgs.map((org) => (
                          <div key={org.id} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:border-emerald-200 transition grid gap-6 h-full">
                              {/* Top section */}
                              <div className="grid grid-cols-2 gap-4 items-center">
                                <div>
                                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                    {org.org_type}
                                  </span>
                                </div>
                                <div className="flex items-center justify-end gap-3">
                                  <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center text-lg font-bold shadow-sm overflow-hidden">
                                    {org.icon_url ? (
                                      <img src={org.icon_url} alt={`${org.name} icon`} className="h-full w-full object-cover" />
                                    ) : (
                                      org.acronym?.slice(0, 2)
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">{org.acronym}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Middle section */}
                              <div className="flex flex-col justify-between gap-4 h-full">
                                <div className="space-y-4">
                                  <h3 className="font-bold text-slate-900 text-lg">{org.name}</h3>
                                  <p className="text-sm text-slate-600 leading-relaxed">{org.description}</p>
                                </div>
                                <div className="bg-emerald-50/70 border border-emerald-100/70 p-4 rounded-md">
                                  <h4 className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1">📢 Latest Update</h4>
                                  <p className="text-sm text-slate-700 italic leading-snug">
                                    {org.latest_update || 'No latest update provided yet.'}
                                  </p>
                                </div>
                              </div>

                              {/* Bottom section */}
                              <div className="grid grid-cols-2 gap-4 items-center pt-4 border-t border-slate-100">
                                <button className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-100 transition">
                                  About More
                                </button>
                                <div className="flex items-center justify-end gap-3">
                                  <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-100 ring-1 ring-slate-200 flex items-center justify-center text-[11px] font-bold text-slate-700">
                                    {org.adviser_image ? (
                                      <img src={org.adviser_image} alt={org.adviser} className="h-full w-full object-cover" />
                                    ) : (
                                      org.adviser?.split(' ').map((part) => part[0]).join('').slice(0, 2)
                                    )}
                                  </div>
                                  <div className="text-right text-[11px] text-slate-500">
                                    <div className="font-semibold text-slate-700">{org.adviser}</div>
                                    <div>Adviser</div>
                                  </div>
                                </div>
                              </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
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