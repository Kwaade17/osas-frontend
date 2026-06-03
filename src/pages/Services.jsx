import { useState } from 'react';
import { API_BASE_URL } from '../config';

export default function Services() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form State
  const [appointmentData, setAppointmentData] = useState({
    student_name: '',
    student_id_num: '',
    student_email: '',
    counselor_name: 'Doreen R. Bandiez, PhD', // Default counselor from Staff directory
    appointment_date: '',
    appointment_time: '09:00',
    reason: ''
  });

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        setError(data.error || 'Failed to submit booking. Please try again.');
      }
    } catch (err) {
      console.error('Error booking appointment:', err);
      setError('Unable to reach the database server. Please check if your backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsSubmitted(false);
    setError(null);
    setAppointmentData({
      student_name: '',
      student_id_num: '',
      student_email: '',
      counselor_name: 'Doreen R. Bandiez, PhD',
      appointment_date: '',
      appointment_time: '09:00',
      reason: ''
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Page Header */}
      <div className="bg-emerald-900 text-white py-12 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Services & Programs</h1>
        <p className="text-blue-100 mt-2 max-w-xl mx-auto">
          Explore the programs designed to support your personal growth, mental well-being, and career readiness while protecting your student rights.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        
        {/* Service 1: Guidance & Counseling */}
        <section className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-3 hover:border-emerald-200 transition">
          <div className="p-8 lg:p-12 lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-3xl">🧠</span>
              <h2 className="text-2xl font-bold text-slate-900">Guidance & Counseling Services</h2>
            </div>
            <p className="text-slate-600 leading-relaxed mb-6">
              Navigating university life comes with both excitement and challenges. Our registered guidance counselors are available to support your mental wellness, academic adjustments, and personal development in a safe, completely confidential environment.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="border border-slate-100 p-4 rounded-lg bg-slate-50">
                <h3 className="font-bold text-slate-800 text-sm mb-1">Individual Consultation</h3>
                <p className="text-xs text-slate-500">One-on-one sessions addressing anxiety, career confusion, relationships, or academic stress.</p>
              </div>
              <div className="border border-slate-100 p-4 rounded-lg bg-slate-50">
                <h3 className="font-bold text-slate-800 text-sm mb-1">Psychological Appraisal</h3>
                <p className="text-xs text-slate-500">Aptitude, intelligence, and personality testing to help understand your unique strengths.</p>
              </div>
            </div>

            <h3 className="font-semibold text-slate-800 text-sm mb-3 uppercase tracking-wider">How to Book an Appointment:</h3>
            <ol className="list-decimal list-inside text-sm text-slate-600 space-y-1 mb-8">
              <li>Click the booking button to select your preferred date, time slot, and counselor.</li>
              <li>Fill in basic identification details and the general nature of your consult.</li>
              <li>Receive a confirmation email with slot details and location/online link.</li>
            </ol>
          </div>
          
          <div className="bg-slate-50 p-8 lg:p-12 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-center">
            <h3 className="font-bold text-slate-950 text-lg mb-2">Ready to Schedule?</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Sessions are free of charge for enrolled students. Both in-person and online video call appointments are available.
            </p>
            
            {/* Click Trigger: Open Booking Modal */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-3 px-4 rounded-md transition shadow-sm mb-3"
            >
              Book a Counseling Session
            </button>
            <button className="w-full bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold py-3 px-4 rounded-md transition">
              Inquire via Help Desk
            </button>
          </div>
        </section>

        {/* Service 2: Career Services */}
        <section className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-3 hover:border-emerald-200 transition">
          <div className="p-8 lg:p-12 lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-3xl">💼</span>
              <h2 className="text-2xl font-bold text-slate-900">Career Services</h2>
            </div>
            <p className="text-slate-600 leading-relaxed mb-6">
              Preparing for life after graduation starts long before your senior year. Our career services help bridge the gap between academic theory and real-world implementation, matching student capability with employer demands.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <span className="text-emerald-700 font-bold mr-3">✔</span>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Job Placements & Internships</h4>
                  <p className="text-xs text-slate-500">Access to our curated partner portal with active job listings, internships, and entry-level positions.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-emerald-700 font-bold mr-3">✔</span>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Resume & Portfolio Workshops</h4>
                  <p className="text-xs text-slate-500">Get constructive feedback on your resume, CV structure, and LinkedIn profile from HR specialists.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-emerald-700 font-bold mr-3">✔</span>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Mock Interview Practice</h4>
                  <p className="text-xs text-slate-500">Build confidence through recorded mock interviews with instant constructive evaluations.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 p-8 lg:p-12 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-center">
            <h3 className="font-bold text-slate-950 text-lg mb-2">Boost Your Employability</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Register for upcoming campus recruitment days or schedule a consultation to sharpen your application materials.
            </p>
            <button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 px-4 rounded-md transition shadow-sm mb-3">
              Browse Student Job Board
            </button>
            <button className="w-full bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold py-3 px-4 rounded-md transition">
              Request Resume Review
            </button>
          </div>
        </section>

        {/* Service 3: Student Discipline */}
        <section className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-3 hover:border-emerald-200 transition">
          <div className="p-8 lg:p-12 lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-3xl">⚖️</span>
              <h2 className="text-2xl font-bold text-slate-900">Student Discipline</h2>
            </div>
            <p className="text-slate-600 leading-relaxed mb-6">
              Our office aims to preserve a safe, secure, and respectful community conducive to educational growth. We work to protect student rights, ensure due process, and make sure that university handbook policies are enforced consistently and fairly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="border border-slate-100 p-4 rounded-lg bg-slate-50">
                <h4 className="font-bold text-emerald-800 text-xs uppercase tracking-wider mb-2">Your Core Rights</h4>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li>Right to fair inquiry and due process</li>
                  <li>Right to written notice of any charge</li>
                  <li>Right to be accompanied by a representative</li>
                </ul>
              </div>
              <div className="border border-slate-100 p-4 rounded-lg bg-slate-50">
                <h4 className="font-bold text-emerald-800 text-xs uppercase tracking-wider mb-2">Grievance Procedures</h4>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li>Consult with the Discipline Unit</li>
                  <li>Submission of official dispute forms</li>
                  <li>Structured mediation & hearings</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 p-8 lg:p-12 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-center">
            <h3 className="font-bold text-slate-950 text-lg mb-2">Need Guidance?</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Read the handbook rules carefully. If you believe your rights have been violated or need to appeal a decision, contact us.
            </p>
            <button className="w-full bg-emerald-800 hover:bg-emerald-950 text-white font-semibold py-3 px-4 rounded-md transition shadow-sm mb-3">
              Read Student Handbook
            </button>
            <button className="w-full bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold py-3 px-4 rounded-md transition">
              File a Grievance Form
            </button>
          </div>
        </section>

      </div>

      {/* ================= MODAL WINDOW (Interactive Layer) ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-emerald-900 text-white px-6 py-4 flex justify-between items-center sticky top-0">
              <h3 className="font-bold text-lg">Guidance Appointment Scheduling</h3>
              <button 
                onClick={closeModal}
                className="text-white/80 hover:text-white text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {!isSubmitted ? (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-md text-xs">
                      ⚠️ {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={appointmentData.student_name}
                      onChange={(e) => setAppointmentData({...appointmentData, student_name: e.target.value})}
                      placeholder="e.g. Maria Clara"
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Student ID Number</label>
                      <input 
                        type="text" 
                        required
                        value={appointmentData.student_id_num}
                        onChange={(e) => setAppointmentData({...appointmentData, student_id_num: e.target.value})}
                        placeholder="LCCC-2026-XX"
                        className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={appointmentData.student_email}
                        onChange={(e) => setAppointmentData({...appointmentData, student_email: e.target.value})}
                        placeholder="student@school.edu"
                        className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Preferred Date</label>
                      <input 
                        type="date" 
                        required
                        value={appointmentData.appointment_date}
                        onChange={(e) => setAppointmentData({...appointmentData, appointment_date: e.target.value})}
                        className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Preferred Time Slot</label>
                      <select 
                        value={appointmentData.appointment_time}
                        onChange={(e) => setAppointmentData({...appointmentData, appointment_time: e.target.value})}
                        className="w-full border border-slate-300 bg-white rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="09:00">09:00 AM - 10:00 AM</option>
                        <option value="10:30">10:30 AM - 11:30 AM</option>
                        <option value="13:30">01:30 PM - 02:30 PM</option>
                        <option value="15:00">03:00 PM - 04:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Counselor</label>
                    <select 
                      value={appointmentData.counselor_name}
                      onChange={(e) => setAppointmentData({...appointmentData, counselor_name: e.target.value})}
                      className="w-full border border-slate-300 bg-white rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Doreen R. Bandiez, PhD">Doreen R. Bandiez, PhD (Head Counselor)</option>
                      <option value="General Guidance Counselor">General Counselor / Alternative Duty Counselor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Reason for consultation</label>
                    <textarea 
                      required
                      rows="3"
                      value={appointmentData.reason}
                      onChange={(e) => setAppointmentData({...appointmentData, reason: e.target.value})}
                      placeholder="e.g. Academic adjustment support, career consultation..."
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-2.5 px-4 font-semibold text-white rounded text-sm transition ${
                        isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-800 hover:bg-emerald-900 shadow-sm'
                      }`}
                    >
                      {isLoading ? 'Booking Slot...' : 'Submit Appointment Request'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <span className="text-5xl">📅</span>
                  <h3 className="font-bold text-slate-800 text-lg">Appointment Submitted!</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Thank you, <span className="font-semibold text-slate-700">{appointmentData.student_name}</span>. Your booking request for <span className="font-semibold text-slate-700">{appointmentData.appointment_date}</span> has been logged as **Pending**. Check your email for approval updates.
                  </p>
                  <button 
                    onClick={closeModal}
                    className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-600 font-semibold text-xs py-2 px-5 rounded transition"
                  >
                    Close Window
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}