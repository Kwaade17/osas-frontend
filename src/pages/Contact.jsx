import { useState } from 'react';
import { API_BASE_URL } from '../config';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'General Inquiry',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New: track server response wait time
  const [error, setError] = useState(null); // New: catch and display backend errors

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Connect to the running Node.js server endpoint
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        // Handle validation errors sent back by the backend
        setError(data.error || 'Failed to submit message. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Unable to connect to the server. Please check if the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Page Header */}
      <div className="bg-emerald-900 text-white py-12 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Contact OSAS</h1>
        <p className="text-emerald-100 mt-2 max-w-xl mx-auto">
          Have questions or need assistance? Reach out to our team using the form below, or contact a specific unit directly.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Column: Form */}
        <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-center">
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800 border-b pb-3">Send Us a Message</h2>
              
              {/* Error Display Alert */}
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-md text-sm">
                  ⚠️ {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Your Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  placeholder="Juan dela Cruz"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  placeholder="juan.delacruz@student.edu.ph"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Inquiry Department</label>
                <select 
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
                  disabled={isLoading}
                >
                  <option>General Inquiry</option>
                  <option>Guidance & Counseling</option>
                  <option>Student Discipline & Grievances</option>
                  <option>Student Government & Orgs</option>
                  <option>Scholarships & Financial Aid</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Message</label>
                <textarea 
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  placeholder="Type your questions or concerns here..."
                  disabled={isLoading}
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className={`w-full text-white font-semibold py-3 px-4 rounded-md transition shadow-sm ${
                  isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-800 hover:bg-emerald-950'
                }`}
              >
                {isLoading ? 'Submitting Form Message...' : 'Submit Form Message'}
              </button>
            </form>
          ) : (
            <div className="text-center py-12 space-y-4">
              <span className="text-5xl">✉️</span>
              <h2 className="text-2xl font-bold text-slate-800">Message Submitted!</h2>
              <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                Thank you, <span className="font-semibold text-slate-800">{formData.name}</span>. Your message has been saved to our server and directed to the <span className="font-semibold text-slate-800">{formData.department}</span> unit.
              </p>
              <button 
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({ name: '', email: '', department: 'General Inquiry', message: '' });
                }}
                className="inline-block bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs py-2 px-4 rounded-md border border-slate-300 transition"
              >
                Send Another Message
              </button>
            </div>
          )}

        </div>

        {/* Right Column: Office Directory */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Office Headquarters</h2>
            <div className="space-y-3 text-sm text-slate-600">
              <p>📍 <span className="font-semibold text-slate-800">Location:</span> TETC BUILDING - ROOM #5</p>
              <p>🕒 <span className="font-semibold text-slate-800">Working Hours:</span> Monday to Friday, 8:00 AM - 5:00 PM</p>
              {/* <p>✉️ <span className="font-semibold text-slate-800">Direct Email Address:</span> osas@school.edu.ph</p>
              <p>📞 <span className="font-semibold text-slate-800">Main Telephone Line:</span> (02) 8123-4567 local 104</p> */}
            </div>
          </div>

          {/* <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Unit Directory & Hotlines</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-sm py-1 border-b border-slate-100">
                <span className="font-medium text-slate-700">Guidance & Counseling</span>
                <span className="text-xs text-slate-500">local 108 • guidance@school.edu.ph</span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b border-slate-100">
                <span className="font-medium text-slate-700">Student Discipline Unit</span>
                <span className="text-xs text-slate-500">local 110 • discipline@school.edu.ph</span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b border-slate-100">
                <span className="font-medium text-slate-700">Supreme Student Council</span>
                <span className="text-xs text-slate-500">local 112 • ssc@student.edu.ph</span>
              </div>
              <div className="flex justify-between text-sm py-1">
                <span className="font-medium text-slate-700">Student Publications</span>
                <span className="text-xs text-slate-500">local 115 • chronicle@student.edu.ph</span>
              </div>
            </div>
          </div> */}
        </div>

      </div>
    </div>
  );
}