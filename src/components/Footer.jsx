export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-100 pt-12 pb-6 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* About Section */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">LCCC - OSAS</h3>
          <p className="text-sm leading-relaxed text-emerald-200">
            The Office of Student Affairs and Services of La Carlota City College acts as the primary hub for all non-academic aspects of college life, promoting student welfare and holistic development.
          </p>
        </div>

        {/* Contact info */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Contact Information</h3>
          <ul className="text-sm space-y-2 text-emerald-200">
            <li>📍 TETC BUILDING ROOM #105</li>
            {/* <li>✉️ osas@lccc.edu.ph</li>
            <li>📞 (034) 460-XXXX local 104</li> */}
            <li>🕒 Mon - Fri: 8:00 AM - 5:00 PM</li>
          </ul>
        </div>

        {/* Quick Help Links */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Student Resources</h3>
          <ul className="text-sm space-y-2">
            <li><a href="https://lacarlotacitycollege.edu.ph/" className="text-emerald-200 hover:text-white transition">Official La Carlota City College Website</a></li>
            {/* <li><a href="#" className="text-emerald-200 hover:text-white transition">Scholarship Guidelines</a></li>
            <li><a href="#" className="text-emerald-200 hover:text-white transition">Club Accreditation Process</a></li> */}
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-emerald-900 text-center text-xs text-emerald-300">
        © {new Date().getFullYear()} Office of Student Affairs and Services - La Carlota City College. All rights reserved.
      </div>
    </footer>
  );
}