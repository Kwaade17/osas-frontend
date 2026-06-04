import { useState } from 'react';

export default function Downloads() {
  const documents = [
    {
      id: 1,
      name: "Official Student Handbook (2026 Edition)",
      category: "Handbook",
      format: "PDF",
      size: "4.2 MB",
      description: "Complete guide to school policies, academic rules, student code of conduct, and rights."
    },
    {
      id: 2,
      name: "Absence Excuse Slip Form",
      category: "Forms",
      format: "PDF",
      size: "180 KB",
      description: "Required template for submitting excuses for academic absences to the OSAS department."
    },
    {
      id: 3,
      name: "Activity Permit & Facility Reservation Request",
      category: "Forms",
      format: "PDF",
      size: "340 KB",
      description: "Form for registered student organizations requesting permission to host campus events and reserve halls."
    },
    {
      id: 4,
      name: "Student Organization Accreditation Application Guidelines",
      category: "Guidelines",
      format: "PDF",
      size: "1.2 MB",
      description: "Manual detailing the processes, criteria, and documentation needed to accredit or renew a club."
    },
    {
      id: 5,
      name: "Financial Assistance & Scholarship Application Form",
      category: "Forms",
      format: "PDF",
      size: "620 KB",
      description: "Form to apply for university-backed scholarships, tuition discounts, or special grants."
    }
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Handbook", "Forms", "Guidelines"];

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Page Header */}
      <div className="bg-emerald-900 text-white py-12 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Downloads & Resources</h1>
        <p className="text-emerald-100 mt-2 max-w-xl mx-auto">
          Access the latest downloadable files, handbooks, official templates, and guidelines managed by the OSAS.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-6">
        
        {/* Filter Controls */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search bar (Updated focus ring to emerald) */}
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Search documents by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
            />
            <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
          </div>

          {/* Category Tabs (Updated to Emerald) */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                  selectedCategory === category 
                    ? 'bg-emerald-800 text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Document Grid */}
        <div className="space-y-4">
          {filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => (
              <div key={doc.id} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-emerald-200 transition">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    {/* Category Badge updated to Emerald */}
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {doc.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {doc.format} ({doc.size})
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{doc.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">{doc.description}</p>
                </div>
                
                {/* Simulated Download Button updated to Emerald */}
                <button 
                  onClick={() => alert(`Simulated download for: ${doc.name}`)}
                  className="w-full sm:w-auto bg-emerald-800 hover:bg-emerald-950 text-white font-semibold text-xs py-2.5 px-5 rounded-md transition whitespace-nowrap shadow-sm text-center cursor-pointer"
                >
                  Download File
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
              <span className="text-4xl">📁</span>
              <p className="text-sm text-slate-500 mt-2">No documents match your search criteria.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}