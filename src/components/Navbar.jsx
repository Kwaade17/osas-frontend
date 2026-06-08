import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white text-slate-800 sticky top-0 z-50 border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Office Name */}
          <Link to="/" className="flex items-center space-x-3">
            {/* Logo Image */}
            <img 
              src="/osas-logo.png" 
              alt="LCCC OSAS Logo" 
              className="h-14 w-14 object-contain"
              onError={(e) => {
                // Fallback text if the image is missing from the public folder
                e.target.style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-wider text-emerald-900 leading-tight">OSAS</span>
              <span className="hidden sm:block font-semibold text-[11px] uppercase tracking-widest text-emerald-700 leading-none mt-0.5">
                La Carlota City College
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 text-sm font-semibold text-slate-600">
            <Link to="/" className="hover:text-emerald-800 transition">Home</Link>
            <Link to="/about" className="hover:text-emerald-800 transition">About OSAS</Link>
            <Link to="/services" className="hover:text-emerald-800 transition">Services</Link>
            <Link to="/student-orgs" className="hover:text-emerald-800 transition">Student Orgs</Link>
            <Link to="/downloads" className="hover:text-emerald-800 transition">Downloads</Link>
            <Link to="/contact" className="hover:text-emerald-800 transition">Contact</Link>
          </div>

          {/* Portal Button */}
          <div className="hidden md:block">
            <Link to="/login" className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-5 py-2.5 rounded-md transition shadow-sm">
              Portal Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-slate-100 text-slate-600 focus:outline-none"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-2 pt-2 pb-4 space-y-1 font-semibold text-sm">
          <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md hover:bg-slate-50 text-slate-700">Home</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md hover:bg-slate-50 text-slate-700">About OSAS</Link>
          <Link to="/services" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md hover:bg-slate-50 text-slate-700">Services</Link>
          <Link to="/student-orgs" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md hover:bg-slate-50 text-slate-700">Student Orgs</Link>
          <Link to="/downloads" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md hover:bg-slate-50 text-slate-700">Downloads</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md hover:bg-slate-50 text-slate-700">Contact</Link>
          <div className="pt-4 px-3">
          <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-md transition text-center text-xs">
            Portal Login
          </Link>
        </div>
        </div>
      )}
    </nav>
  );
}