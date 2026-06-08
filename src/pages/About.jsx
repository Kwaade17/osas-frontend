import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export default function About() {
  const [aboutData, setAboutData] = useState({
    content: {
      heading: 'About OSAS',
      subheading: 'Loading our details...',
      vision: 'Loading vision...',
      mission: 'Loading mission...'
    },
    functionalAreas: [],
    staff: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/about`);
        if (!response.ok) {
          throw new Error('Failed to retrieve About page content.');
        }
        const data = await response.json();
        setAboutData(data);
      } catch (err) {
        console.error(err);
        setError('Unable to load about details at this time.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Page Header */}
      <div className="bg-emerald-900 text-white py-12 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          {aboutData.content.heading}
        </h1>
        <p className="text-emerald-100 mt-2 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          {aboutData.content.subheading}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        
        {isLoading ? (
          <div className="text-center py-20 text-slate-500">Loading page details...</div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-lg text-sm text-center">⚠️ {error}</div>
        ) : (
          <>
            {/* Mission & Vision */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
                <h2 className="text-2xl font-bold text-emerald-900 mb-4 border-b border-emerald-100 pb-2">Our Vision</h2>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  {aboutData.content.vision}
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
                <h2 className="text-2xl font-bold text-emerald-900 mb-4 border-b border-emerald-100 pb-2">Our Mission</h2>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  {aboutData.content.mission}
                </p>
              </div>
            </section>

            {/* Staff Directory */}
            <section>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-8 border-b pb-3">
                Our Administrative Team
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {aboutData.staff.map((person) => (
                  <div key={person.id} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm text-center">
                    <div className={`w-16 h-16 ${person.color || 'bg-emerald-800'} text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4`}>
                      {person.initials}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">{person.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-1">{person.role}</p>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <a href={`mailto:${person.name.toLowerCase().replace(/\s+/g, '')}@school.edu.ph`} className="text-xs text-emerald-800 font-semibold hover:underline">
                        Contact Staff &rarr;
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

      </div>
    </div>
  );
}