import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config'; // Import API helper

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [organizations, setOrganizations] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [bulletinText, setBulletinText] = useState('');
  const [bulletinSuccess, setBulletinSuccess] = useState(false);

  const [clubForm, setClubForm] = useState({
    name: '',
    acronym: '',
    org_type: 'Major',
    description: '',
    adviser: ''
  });
  const [clubSuccess, setClubSuccess] = useState(false);

  // New Announcement Form State (Correctly initialized with image_url)
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    category: 'Scholarships',
    summary: '',
    content: '',
    image_url: '' // Added missing state key
  });
  const [announcementSuccess, setAnnouncementSuccess] = useState(false);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin_name');
    navigate('/login');
  }, [navigate]);

  const fetchAdminData = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
      setError(null);
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      handleLogout();
      return;
    }

    try {
      const [apptRes, msgRes, orgRes] = await Promise.all([
        fetch('http://localhost:5000/api/appointments', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/contact', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/api/organizations`) 
      ]);

      if (apptRes.status === 401 || apptRes.status === 403 || msgRes.status === 401 || msgRes.status === 403) {
        handleLogout();
        return;
      }

      if (!apptRes.ok || !msgRes.ok || !orgRes.ok) {
        throw new Error('Failed to load database registries.');
      }

      const apptData = await apptRes.json();
      const msgData = await msgRes.json();
      const orgData = await orgRes.json();

      setAppointments(apptData);
      setMessages(msgData);
      setOrganizations(orgData);
      
      if (orgData.length > 0 && !selectedOrgId) {
        setSelectedOrgId(orgData[0].id); 
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard data. Ensure backend is running.');
    } finally {
      setIsLoading(false);
    }
  }, [handleLogout, selectedOrgId]);

  useEffect(() => {
    fetchAdminData(false); 
  }, [fetchAdminData]);

  const handleStatusChange = async (id, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.status === 401 || response.status === 403) {
        handleLogout();
        return;
      }

      if (response.ok) {
        fetchAdminData(true);
      } else {
        alert('Failed to update appointment status.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server.');
    }
  };

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setAnnouncementSuccess(false);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(announcementForm),
      });

      if (response.status === 401 || response.status === 403) {
        handleLogout();
        return;
      }

      if (response.ok) {
        setAnnouncementSuccess(true);
        // Correctly reset form including image_url
        setAnnouncementForm({ title: '', category: 'Scholarships', summary: '', content: '', image_url: '' });
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to post announcement.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error, could not post announcement.');
    }
  };

  const handleClubSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setClubSuccess(false);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(clubForm),
      });

      if (response.status === 401 || response.status === 403) {
        handleLogout();
        return;
      }

      if (response.ok) {
        setClubSuccess(true);
        setClubForm({ name: '', acronym: '', org_type: 'Major', description: '', adviser: '' });
        fetchAdminData(true);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to register club.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error, could not register organization.');
    }
  };

  const handleBulletinSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setBulletinSuccess(false);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5000/api/organizations/${selectedOrgId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ latest_update: bulletinText }),
      });

      if (response.status === 401 || response.status === 403) {
        handleLogout();
        return;
      }

      if (response.ok) {
        setBulletinSuccess(true);
        setBulletinText('');
        fetchAdminData(true);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to post bulletin.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error, could not update bulletin.');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Banner */}
      <div className="bg-emerald-900 text-white py-12 px-4 text-center relative">
        <h1 className="text-3xl font-extrabold tracking-tight">OSAS Portal Administration</h1>
        <p className="text-emerald-100 mt-2 max-w-xl mx-auto text-sm">
          Logged in as: <span className="font-bold text-white">{localStorage.getItem('admin_name') || 'Admin'}</span>
        </p>
        <button 
          onClick={handleLogout}
          className="absolute right-4 top-4 bg-emerald-950 hover:bg-rose-950 text-white font-bold text-xs py-1.5 px-3 rounded transition cursor-pointer"
        >
          Sign Out
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white rounded-t-lg border-t border-x overflow-hidden">
          <button 
            onClick={() => setActiveTab('appointments')}
            className={`flex-1 py-4 text-center text-sm font-semibold transition cursor-pointer ${
              activeTab === 'appointments' ? 'bg-emerald-50 text-emerald-900 border-b-2 border-emerald-800' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            📋 Appointments ({appointments.length})
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`flex-1 py-4 text-center text-sm font-semibold transition cursor-pointer ${
              activeTab === 'messages' ? 'bg-emerald-50 text-emerald-900 border-b-2 border-emerald-800' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            ✉️ Contact Submissions ({messages.length})
          </button>
          <button 
            onClick={() => setActiveTab('org-manager')}
            className={`flex-1 py-4 text-center text-sm font-semibold transition cursor-pointer ${
              activeTab === 'org-manager' ? 'bg-emerald-50 text-emerald-900 border-b-2 border-emerald-800' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            👥 Organizations Coordinator ({organizations.length})
          </button>
          <button 
            onClick={() => setActiveTab('post-announcement')}
            className={`flex-1 py-4 text-center text-sm font-semibold transition cursor-pointer ${
              activeTab === 'post-announcement' ? 'bg-emerald-50 text-emerald-900 border-b-2 border-emerald-800' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            📢 Post Announcement
          </button>
        </div>

        {/* Dynamic Display Area */}
        <div className="bg-white border-b border-x border-slate-200 rounded-b-lg p-6 min-h-[400px]">
          
          {isLoading && activeTab !== 'post-announcement' && activeTab !== 'org-manager' ? (
            <div className="text-center py-20 text-slate-500 text-sm">Loading registries...</div>
          ) : error && activeTab !== 'post-announcement' && activeTab !== 'org-manager' ? (
            <div className="bg-rose-50 border border-rose-200 text-rose-850 p-4 rounded text-sm text-center">⚠️ {error}</div>
          ) : (
            
            <>
              {activeTab === 'appointments' && (
                <div className="overflow-x-auto">
                  {appointments.length > 0 ? (
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                          <th className="p-3">Student Details</th>
                          <th className="p-3">Counselor</th>
                          <th className="p-3">Schedule</th>
                          <th className="p-3">Reason</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((appt) => (
                          <tr key={appt.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="p-3">
                              <p className="font-bold text-slate-900">{appt.student_name}</p>
                              <p className="text-[11px] text-slate-500">ID: {appt.student_id_num}</p>
                              <p className="text-[11px] text-slate-500">{appt.student_email}</p>
                            </td>
                            <td className="p-3 text-slate-700 text-xs font-medium">{appt.counselor_name}</td>
                            <td className="p-3">
                              <p className="font-semibold text-slate-800">{new Date(appt.appointment_date).toLocaleDateString()}</p>
                              <p className="text-[11px] text-slate-500">{appt.appointment_time}</p>
                            </td>
                            <td className="p-3 text-slate-600 max-w-xs text-xs">{appt.reason}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                                appt.status === 'Approved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' :
                                appt.status === 'Cancelled' ? 'bg-rose-50 text-rose-800 border border-rose-100' :
                                'bg-amber-50 text-amber-800 border border-amber-100'
                              }`}>
                                {appt.status}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-2 whitespace-nowrap">
                              {appt.status === 'Pending' && (
                                <>
                                  <button 
                                    onClick={() => handleStatusChange(appt.id, 'Approved')}
                                    className="bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-semibold py-1 px-3 rounded shadow-sm cursor-pointer"
                                  >
                                    Approve
                                  </button>
                                  <button 
                                    onClick={() => handleStatusChange(appt.id, 'Cancelled')}
                                    className="bg-rose-800 hover:bg-rose-900 text-white text-[11px] font-semibold py-1 px-3 rounded shadow-sm cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                              {appt.status !== 'Pending' && (
                                <span className="text-xs text-slate-400 italic">Action Completed</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-20 text-slate-500">No appointments logged in the database.</div>
                  )}
                </div>
              )}

              {activeTab === 'messages' && (
                <div className="space-y-4">
                  {messages.length > 0 ? (
                    messages.map((msg) => (
                      <div key={msg.id} className="p-5 border border-slate-200 rounded-lg hover:border-emerald-200 transition">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-2 mb-3">
                          <div>
                            <h4 className="font-bold text-slate-900 text-base">{msg.name}</h4>
                            <p className="text-xs text-slate-400">{msg.email} • {new Date(msg.created_at).toLocaleString()}</p>
                          </div>
                          <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 px-3 py-1 rounded">
                            {msg.department}
                          </span>
                        </div>
                        <p className="text-slate-600 text-xs leading-relaxed">{msg.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 text-slate-500">No contact submissions found in the database.</div>
                  )}
                </div>
              )}

              {/* --- TAB 3: ORGANIZATIONS MANAGER --- */}
              {activeTab === 'org-manager' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  
                  <form onSubmit={handleClubSubmit} className="space-y-4 bg-slate-50 p-6 rounded-lg border border-slate-200">
                    <h3 className="font-bold text-slate-800 text-base border-b pb-2">Register New Accredited Org</h3>
                    
                    {clubSuccess && <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 p-2 rounded text-xs">✅ Club accredited and listed successfully!</div>}

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Organization Name</label>
                      <input 
                        type="text" required value={clubForm.name}
                        onChange={(e) => setClubForm({...clubForm, name: e.target.value})}
                        placeholder="e.g. Young Educators Society"
                        className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Acronym</label>
                        <input 
                          type="text" required value={clubForm.acronym}
                          onChange={(e) => setClubForm({...clubForm, acronym: e.target.value})}
                          placeholder="e.g. YES"
                          className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Classification Type</label>
                        <select 
                          value={clubForm.org_type}
                          onChange={(e) => setClubForm({...clubForm, org_type: e.target.value})}
                          className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                        >
                          <option value="Major">Major Org</option>
                          <option value="Program-Limited">Program-Limited Org</option>
                          <option value="College">College Org</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Official Faculty Adviser</label>
                      <input 
                        type="text" required value={clubForm.adviser}
                        onChange={(e) => setClubForm({...clubForm, adviser: e.target.value})}
                        placeholder="e.g. Dr. Jane Smith"
                        className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Description</label>
                      <textarea 
                        required rows="2" value={clubForm.description}
                        onChange={(e) => setClubForm({...clubForm, description: e.target.value})}
                        placeholder="Core focus of the student organization..."
                        className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                      ></textarea>
                    </div>

                    <button type="submit" className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-2 rounded text-xs transition">
                      Accredit and Publish Club
                    </button>
                  </form>

                  <form onSubmit={handleBulletinSubmit} className="space-y-4 bg-slate-50 p-6 rounded-lg border border-slate-200">
                    <h3 className="font-bold text-slate-800 text-base border-b pb-2">Update Public Org Bulletin</h3>

                    {bulletinSuccess && <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 p-2 rounded text-xs">✅ Bulletin updated successfully on the public portal!</div>}

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Select Organization</label>
                      <select 
                        value={selectedOrgId}
                        onChange={(e) => setSelectedOrgId(e.target.value)}
                        className="w-full border border-slate-300 bg-white rounded px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        {organizations.map((org) => (
                          <option key={org.id} value={org.id}>
                            {org.name} ({org.acronym})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Latest Bulletin Update (Will display publicly on club card)</label>
                      <textarea 
                        required rows="5" value={bulletinText}
                        onChange={(e) => setBulletinText(e.target.value)}
                        placeholder="e.g. General Assembly post-poned to next Monday due to faculty meetings. Stay tuned."
                        className="w-full border border-slate-300 rounded px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                      ></textarea>
                    </div>

                    <button type="submit" className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-2 rounded text-xs transition">
                      Publish Update to Public Portal
                    </button>
                  </form>

                </div>
              )}

              {/* --- TAB 4: POST ANNOUNCEMENT --- */}
              {activeTab === 'post-announcement' && (
                <form onSubmit={handleAnnouncementSubmit} className="max-w-2xl mx-auto space-y-6">
                  <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Publish Campus Announcement</h3>

                  {error && <div className="bg-rose-50 border border-rose-200 text-rose-850 p-3 rounded text-xs">⚠️ {error}</div>}
                  {announcementSuccess && <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded text-xs font-semibold">📢 Announcement published successfully! Check the home page.</div>}

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Bulletin Title</label>
                    <input 
                      type="text" 
                      required
                      value={announcementForm.title}
                      onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})}
                      placeholder="e.g. Guidance Counseling Holiday Schedule"
                      className="w-full border border-slate-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Category</label>
                      <select 
                        value={announcementForm.category}
                        onChange={(e) => setAnnouncementForm({...announcementForm, category: e.target.value})}
                        className="w-full border border-slate-300 bg-white rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option>Scholarships</option>
                        <option>Activities</option>
                        <option>Guidance</option>
                        <option>General</option>
                      </select>
                    </div>
                    {/* Added Cover Image URL Input Field */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Cover Image URL</label>
                      <input 
                        type="text" 
                        value={announcementForm.image_url}
                        onChange={(e) => setAnnouncementForm({...announcementForm, image_url: e.target.value})}
                        placeholder="e.g. https://images.unsplash.com/... (or leave blank)"
                        className="w-full border border-slate-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    {/* Added Cover Image URL Input Field */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Cover Image URL</label>
                      <input 
                        type="text" 
                        value={announcementForm.image_url}
                        onChange={(e) => setAnnouncementForm({...announcementForm, image_url: e.target.value})}
                        placeholder="e.g. https://images.unsplash.com/... (or leave blank)"
                        className="w-full border border-slate-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Brief Summary (Will appear on homepage card)</label>
                    <textarea 
                      required
                      rows="2"
                      value={announcementForm.summary}
                      onChange={(e) => setAnnouncementForm({...announcementForm, summary: e.target.value})}
                      placeholder="e.g. Please note that the guidance office will be closed on June 12 for Independence Day..."
                      className="w-full border border-slate-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Detailed Content (Optional)</label>
                    <textarea 
                      rows="4"
                      value={announcementForm.content}
                      onChange={(e) => setAnnouncementForm({...announcementForm, content: e.target.value})}
                      placeholder="Detailed content description here..."
                      className="w-full border border-slate-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 rounded transition shadow-sm cursor-pointer"
                  >
                    Publish Bulletin to Home Page
                  </button>
                </form>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
}