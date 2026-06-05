import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

export default function AdminDashboard() {
  // ==========================================
  // 1. STATE DECLARATIONS
  // ==========================================
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [organizations, setOrganizations] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userRole = localStorage.getItem('role') || 'admin';

  // Developer Dashboard Tabs & State
  const [devTab, setDevTab] = useState('about');
  const [aboutData, setAboutData] = useState({
    content: { heading: '', subheading: '', vision: '', mission: '' },
    functionalAreas: [],
    staff: []
  });
  const [devSuccessMessage, setDevSuccessMessage] = useState(null);

  const [selectedAreaId, setSelectedAreaId] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');

  const [areaForm, setAreaForm] = useState({ title: '', description: '', key_operations: '' });
  const [staffForm, setStaffForm] = useState({ name: '', role: '', initials: '', color: 'bg-emerald-800' });

  // Developer Tab: Home Editor State
  const [homeForm, setHomeForm] = useState({
    hero_title: '',
    hero_subtitle: '',
    hero_bg_image: ''
  });

  // Developer Tab: Home Grid (Site Services & Programs) State [1]
  const [allServices, setAllServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    icon_class: 'fa-solid fa-brain',
    service_type: 'service'
  });

  // Developer Tab: Services Page CMS State (New) [1]
  const [pageServices, setPageServices] = useState([]);
  const [selectedPageServiceId, setSelectedPageServiceId] = useState('');
  const [pageServiceForm, setPageServiceForm] = useState({
    title: '',
    icon_emoji: '🧠',
    description: '',
    feature_one_title: '',
    feature_one_desc: '',
    feature_two_title: '',
    feature_two_desc: '',
    feature_three_title: '',
    feature_three_desc: '',
    instructions: '',
    sidebar_title: '',
    sidebar_text: '',
    btn_primary_text: '',
    btn_secondary_text: ''
  });

  // Admin Dashboard State
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [bulletinText, setBulletinText] = useState('');
  const [bulletinSuccess, setBulletinSuccess] = useState(false);

  const [clubForm, setClubForm] = useState({ name: '', acronym: '', org_type: 'Major', description: '', adviser: '' });
  const [clubSuccess, setClubSuccess] = useState(false);

  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    category: 'Scholarships',
    summary: '',
    content: '',
    image_url: '' 
  });
  const [announcementSuccess, setAnnouncementSuccess] = useState(false);

  // ==========================================
  // 2. LOGOUT & FETCH HELPERS
  // ==========================================
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin_name');
    localStorage.removeItem('role');
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
      if (userRole === 'developer') {
        const [aboutRes, srvRes, homeRes, pgSrvRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/about`),
          fetch(`${API_BASE_URL}/api/site-services`),
          fetch(`${API_BASE_URL}/api/home`),
          fetch(`${API_BASE_URL}/api/services-page`) // Fetch dynamic services page [1]
        ]);

        if (!aboutRes.ok || !srvRes.ok || !homeRes.ok || !pgSrvRes.ok) throw new Error('Failed to load portal databases.');

        const abtData = await aboutRes.json();
        const srvData = await srvRes.json();
        const hData = await homeRes.json();
        const pgSrvData = await pgSrvRes.json();

        setAboutData(abtData);
        setAllServices(srvData);
        setPageServices(pgSrvData);
        
        // Prepopulate Home Editor Form
        if (hData.hero_title) {
          setHomeForm({
            hero_title: hData.hero_title || '',
            hero_subtitle: hData.hero_subtitle || '',
            hero_bg_image: hData.hero_bg_image || ''
          });
        }

        // Prepopulate functional area selectors (About Page)
        if (abtData.functionalAreas.length > 0 && !selectedAreaId) {
          const firstArea = abtData.functionalAreas[0];
          setSelectedAreaId(firstArea.id);
          setAreaForm({
            title: firstArea.title,
            description: firstArea.description,
            key_operations: firstArea.key_operations.join(', ')
          });
        } else if (abtData.functionalAreas.length === 0 && !selectedAreaId) {
          setSelectedAreaId('new');
        }

        // Prepopulate staff selectors (About Page)
        if (abtData.staff.length > 0 && !selectedStaffId) {
          const firstStaff = abtData.staff[0];
          setSelectedStaffId(firstStaff.id);
          setStaffForm({
            name: firstStaff.name,
            role: firstStaff.role,
            initials: firstStaff.initials,
            color: firstStaff.color || 'bg-emerald-800'
          });
        } else if (abtData.staff.length === 0 && !selectedStaffId) {
          setSelectedStaffId('new');
        }

        // Prepopulate home-grid services selectors (Home Page)
        if (srvData.length > 0 && !selectedServiceId) {
          const firstSrv = srvData[0];
          setSelectedServiceId(firstSrv.id);
          setServiceForm({
            title: firstSrv.title,
            description: firstSrv.description,
            icon_class: firstSrv.icon_class,
            service_type: firstSrv.service_type
          });
        } else if (srvData.length === 0 && !selectedServiceId) {
          setSelectedServiceId('new');
        }

        // Prepopulate actual Services Page selectors (Services Page) [1]
        if (pgSrvData.length > 0 && !selectedPageServiceId) {
          const firstPageSrv = pgSrvData[0];
          setSelectedPageServiceId(firstPageSrv.id);
          setPageServiceForm({
            title: firstPageSrv.title,
            icon_emoji: firstPageSrv.icon_emoji,
            description: firstPageSrv.description,
            feature_one_title: firstPageSrv.feature_one_title,
            feature_one_desc: firstPageSrv.feature_one_desc,
            feature_two_title: firstPageSrv.feature_two_title,
            feature_two_desc: firstPageSrv.feature_two_desc,
            feature_three_title: firstPageSrv.feature_three_title || '',
            feature_three_desc: firstPageSrv.feature_three_desc || '',
            instructions: firstPageSrv.instructions || '',
            sidebar_title: firstPageSrv.sidebar_title,
            sidebar_text: pgSrvData[0].sidebar_text,
            btn_primary_text: firstPageSrv.btn_primary_text,
            btn_secondary_text: firstPageSrv.btn_secondary_text
          });
        }

      } else {
        const [apptRes, msgRes, orgRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/appointments`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${API_BASE_URL}/api/contact`, {
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
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard data. Ensure backend is running.');
    } finally {
      setIsLoading(false);
    }
  }, [handleLogout, userRole, selectedAreaId, selectedStaffId, selectedServiceId, selectedPageServiceId, selectedOrgId]);

  // ==========================================
  // 3. ACTION HANDLERS (Properly Scoped at Top) [1]
  // ==========================================

  const handleAreaSelectChange = (id) => {
    setSelectedAreaId(id);
    if (id === 'new') {
      setAreaForm({ title: '', description: '', key_operations: '' });
    } else {
      const area = aboutData.functionalAreas.find(a => a.id === parseInt(id));
      if (area) {
        setAreaForm({
          title: area.title,
          description: area.description,
          key_operations: area.key_operations.join(', ')
        });
      }
    }
  };

  const handleStaffSelectChange = (id) => {
    setSelectedStaffId(id);
    if (id === 'new') {
      setStaffForm({ name: '', role: '', initials: '', color: 'bg-emerald-800' });
    } else {
      const person = aboutData.staff.find(s => s.id === parseInt(id));
      if (person) {
        setStaffForm({
          name: person.name,
          role: person.role,
          initials: person.initials,
          color: person.color || 'bg-emerald-800'
        });
      }
    }
  };

  const handleServiceSelectChange = (id) => {
    setSelectedServiceId(id);
    if (id === 'new') {
      setServiceForm({ title: '', description: '', icon_class: 'fa-solid fa-brain', service_type: 'service' });
    } else {
      const srv = allServices.find(item => item.id === parseInt(id));
      if (srv) {
        setServiceForm({
          title: srv.title,
          description: srv.description,
          icon_class: srv.icon_class,
          service_type: srv.service_type
        });
      }
    }
  };

  // Selector dropdown change for the actual Services Page [1]
  const handlePageServiceSelectChange = (id) => {
    setSelectedPageServiceId(id);
    const srv = pageServices.find(item => item.id === parseInt(id));
    if (srv) {
      setPageServiceForm({
        title: srv.title,
        icon_emoji: srv.icon_emoji,
        description: srv.description,
        feature_one_title: srv.feature_one_title,
        feature_one_desc: srv.feature_one_desc,
        feature_two_title: srv.feature_two_title,
        feature_two_desc: srv.feature_two_desc,
        feature_three_title: srv.feature_three_title || '',
        feature_three_desc: srv.feature_three_desc || '',
        instructions: srv.instructions || '',
        sidebar_title: srv.sidebar_title,
        sidebar_text: srv.sidebar_text,
        btn_primary_text: srv.btn_primary_text,
        btn_secondary_text: srv.btn_secondary_text
      });
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size is too large. Please select an image smaller than 2MB.');
        e.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAnnouncementForm({ ...announcementForm, image_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHomeImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size is too large. Please select an image smaller than 2MB.');
        e.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setHomeForm({ ...homeForm, hero_bg_image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Re-added handleStatusChange handler before returns (Fixes undefined error) [1]
  const handleStatusChange = async (id, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments/${id}`, {
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

  const handleHomeSubmit = async (e) => {
    e.preventDefault();
    setDevSuccessMessage(null);
    setError(null);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_BASE_URL}/api/home`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(homeForm)
      });

      if (response.status === 401 || response.status === 403) {
        handleLogout();
        return;
      }

      if (response.ok) {
        setDevSuccessMessage('Homepage Hero landing details updated successfully!');
        fetchAdminData(true);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update Home content.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error, could not save updates.');
    }
  };

  const handleAboutContentSubmit = async (e) => {
    e.preventDefault();
    setDevSuccessMessage(null);
    setError(null);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_BASE_URL}/api/about/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(aboutData.content)
      });

      if (response.status === 401 || response.status === 403) {
        handleLogout();
        return;
      }

      if (response.ok) {
        setDevSuccessMessage('Page Headers, Vision, and Mission updated successfully!');
        fetchAdminData(true);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update content.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error, could not save updates.');
    }
  };

  const handleAreaSubmit = async (e) => {
    e.preventDefault();
    setDevSuccessMessage(null);
    setError(null);
    const token = localStorage.getItem('token');

    const operationsArray = areaForm.key_operations
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const isNew = selectedAreaId === 'new';
    const url = isNew 
      ? `${API_BASE_URL}/api/about/functional-areas` 
      : `${API_BASE_URL}/api/about/functional-areas/${selectedAreaId}`;
    
    try {
      const response = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: areaForm.title,
          description: areaForm.description,
          key_operations: operationsArray
        })
      });

      if (response.status === 401 || response.status === 403) {
        handleLogout();
        return;
      }

      if (response.ok) {
        setDevSuccessMessage(isNew ? 'New Functional Area registered successfully!' : 'Functional Area updated successfully!');
        setSelectedAreaId(''); 
        fetchAdminData(true);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save card updates.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error, could not save card updates.');
    }
  };

  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    setDevSuccessMessage(null);
    setError(null);
    const token = localStorage.getItem('token');

    const isNew = selectedStaffId === 'new';
    const url = isNew 
      ? `${API_BASE_URL}/api/about/staff` 
      : `${API_BASE_URL}/api/about/staff/${selectedStaffId}`;

    try {
      const response = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(staffForm)
      });

      if (response.status === 401 || response.status === 403) {
        handleLogout();
        return;
      }

      if (response.ok) {
        setDevSuccessMessage(isNew ? 'New staff profile added successfully!' : 'Staff profile updated successfully!');
        setSelectedStaffId(''); 
        fetchAdminData(true);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save staff updates.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error, could not save staff updates.');
    }
  };

  // Submit Home Grid items: POST (Add New) or PUT (Edit) [1]
  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setDevSuccessMessage(null);
    setError(null);
    const token = localStorage.getItem('token');

    const isNew = selectedServiceId === 'new';
    const url = isNew 
      ? `${API_BASE_URL}/api/site-services` 
      : `${API_BASE_URL}/api/site-services/${selectedServiceId}`;

    try {
      const response = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(serviceForm)
      });

      if (response.status === 401 || response.status === 403) {
        handleLogout();
        return;
      }

      if (response.ok) {
        setDevSuccessMessage(isNew ? 'New service/program registered successfully!' : 'Service/program updated successfully!');
        setSelectedServiceId(''); 
        fetchAdminData(true);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save service/program updates.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error, could not save updates.');
    }
  };

  // Submit Services Page edits (Row 1, 2, or 3) [1]
  const handlePageServiceSubmit = async (e) => {
    e.preventDefault();
    setDevSuccessMessage(null);
    setError(null);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_BASE_URL}/api/services-page/${selectedPageServiceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pageServiceForm)
      });

      if (response.status === 401 || response.status === 403) {
        handleLogout();
        return;
      }

      if (response.ok) {
        setDevSuccessMessage('Services Page details updated successfully!');
        fetchAdminData(true);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update Services page content.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error, could not save updates.');
    }
  };

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setAnnouncementSuccess(false);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_BASE_URL}/api/announcements`, {
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
        setAnnouncementForm({ title: '', category: 'Scholarships', summary: '', content: '', image_url: '' });
        const fileInput = document.getElementById('announcement-image');
        if (fileInput) fileInput.value = "";
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
      const response = await fetch(`${API_BASE_URL}/api/organizations`, {
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
      const response = await fetch(`${API_BASE_URL}/api/organizations/${selectedOrgId}`, {
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

  // ==========================================
  // 4. SECURE DECOUPLED EFFECT (Wrapped in Timeout)
  // ==========================================
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAdminData(false); 
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchAdminData]);

  // ==========================================
  // 5. DEVELOPER DASHBOARD RENDER [1]
  // ==========================================
  if (userRole === 'developer') {
    return (
      <div className="bg-slate-50 min-h-screen pb-16">
        
        {/* Banner */}
        <div className="bg-emerald-900 text-white py-12 px-4 text-center relative">
          <h1 className="text-3xl font-extrabold tracking-tight">Developer Editor</h1>
          <p className="text-emerald-100 mt-2 max-w-xl mx-auto text-sm">
            Content Management Panel • Logged in as: <span className="font-bold text-white">{localStorage.getItem('admin_name') || 'Developer'}</span>
          </p>
          <button 
            onClick={handleLogout}
            className="absolute right-4 top-4 bg-emerald-950 hover:bg-rose-950 text-white font-bold text-xs py-1.5 px-3 rounded transition cursor-pointer"
          >
            Sign Out
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          
          {/* Tabs */}
          <div className="flex border-b border-slate-200 bg-white rounded-t-lg border-t border-x overflow-hidden">
            <button 
              onClick={() => setDevTab('home')}
              className={`flex-1 py-4 text-center text-sm font-semibold transition cursor-pointer ${
                devTab === 'home' ? 'bg-emerald-50 text-emerald-900 border-b-2 border-emerald-800' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              🏠 Home
            </button>
            <button 
              onClick={() => setDevTab('about')}
              className={`flex-1 py-4 text-center text-sm font-semibold transition cursor-pointer ${
                devTab === 'about' ? 'bg-emerald-50 text-emerald-900 border-b-2 border-emerald-800' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              ℹ️ About OSAS
            </button>
            <button 
              onClick={() => setDevTab('services')}
              className={`flex-1 py-4 text-center text-sm font-semibold transition cursor-pointer ${
                devTab === 'services' ? 'bg-emerald-50 text-emerald-900 border-b-2 border-emerald-800' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              🧠 Services
            </button>
          </div>

          {/* Display panel */}
          <div className="bg-white border-b border-x border-slate-200 rounded-b-lg p-6 min-h-[400px]">
            
            {error && <div className="bg-rose-50 border border-rose-200 text-rose-850 p-3 rounded text-xs mb-6">⚠️ {error}</div>}
            {devSuccessMessage && <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded text-xs font-semibold mb-6">✅ {devSuccessMessage}</div>}

            {/* --- TAB 1: HOME (Fully Functional Home Page Landing & Grid CMS) [1] --- */}
            {devTab === 'home' && (
              <div className="space-y-12">
                
                {/* Section A: Banner */}
                <form onSubmit={handleHomeSubmit} className="space-y-4 p-6 bg-slate-50 border border-slate-200 rounded-lg">
                  <h3 className="font-extrabold text-slate-800 text-base border-b pb-2">Section A: Configure Homepage Landing Details</h3>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Hero Landing Title</label>
                    <input 
                      type="text" required
                      value={homeForm.hero_title}
                      onChange={(e) => setHomeForm({ ...homeForm, hero_title: e.target.value })}
                      className="w-full border border-slate-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Hero Subtitle/Description</label>
                    <textarea 
                      required rows="3"
                      value={homeForm.hero_subtitle}
                      onChange={(e) => setHomeForm({ ...homeForm, hero_subtitle: e.target.value })}
                      className="w-full border border-slate-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Upload Landing Background Image</label>
                      <input 
                        id="home-bg-image"
                        type="file" 
                        accept="image/*"
                        onChange={handleHomeImageChange}
                        className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    {homeForm.hero_bg_image && (
                      <div className="border border-slate-200 rounded p-3 bg-slate-50 flex items-center space-x-4">
                        <div className="w-16 h-16 bg-slate-100 rounded border overflow-hidden">
                          <img 
                            src={homeForm.hero_bg_image} 
                            alt="Landing Backdrop Preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <p className="text-[10px] font-bold text-slate-800 leading-snug">Landing Backdrop Preview Loaded</p>
                          <button 
                            type="button"
                            onClick={() => setHomeForm({...homeForm, hero_bg_image: '/school-bg.jpg'})}
                            className="text-[10px] text-rose-700 hover:underline mt-1 font-semibold block cursor-pointer"
                          >
                            Reset to default
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <button 
                    type="submit"
                    className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2 px-6 rounded text-xs transition cursor-pointer"
                  >
                    Save Homepage Hero Revisions
                  </button>
                </form>

                {/* Section B: Grid Services & Programs (The 6 home cards) [1] */}
                <form onSubmit={handleServiceSubmit} className="space-y-4 p-6 bg-slate-50 border border-slate-200 rounded-lg">
                  <h3 className="font-extrabold text-slate-800 text-base border-b pb-2">Section B: Configure Home Services & Programs Grid</h3>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Select Grid Item to Edit (Or select Register New)</label>
                    <select 
                      value={selectedServiceId}
                      onChange={(e) => handleServiceSelectChange(e.target.value)}
                      className="w-full border border-slate-300 bg-white rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="new">+ Register New Grid Item</option>
                      {allServices.map((item) => (
                        <option key={item.id} value={item.id}>
                          [{item.service_type.toUpperCase()}] {item.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Title</label>
                    <input 
                      type="text" required
                      value={serviceForm.title}
                      onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                      placeholder="e.g. Guidance & Counseling"
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Classification Type</label>
                      <select 
                        value={serviceForm.service_type}
                        onChange={(e) => setServiceForm({ ...serviceForm, service_type: e.target.value })}
                        className="w-full border border-slate-300 bg-white rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="service">Service (Guidance, Discipline, etc.)</option>
                        <option value="program">Program (Invictus, CORE, etc.)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Font Awesome Icon Class</label>
                      <select 
                        value={serviceForm.icon_class}
                        onChange={(e) => setServiceForm({ ...serviceForm, icon_class: e.target.value })}
                        className="w-full border border-slate-300 bg-white rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="fa-solid fa-brain">🧠 fa-brain (Mental Wellness)</option>
                        <option value="fa-solid fa-scale-balanced">⚖️ fa-scale-balanced (Discipline/Justice)</option>
                        <option value="fa-solid fa-graduation-cap">🎓 fa-graduation-cap (Scholarships)</option>
                        <option value="fa-solid fa-certificate">📜 fa-certificate (Character Certification)</option>
                        <option value="fa-solid fa-trophy">🏆 fa-trophy (Awards/Excellence)</option>
                        <option value="fa-solid fa-users-gear">⚙️ fa-users-gear (Organizations Coordination)</option>
                        <option value="fa-solid fa-school">🏫 fa-school (Campus/Classroom)</option>
                        <option value="fa-solid fa-award">🎗️ fa-award (Merits)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Description</label>
                    <textarea 
                      required rows="3"
                      value={serviceForm.description}
                      onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                      placeholder="Core focus details..."
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    ></textarea>
                  </div>

                  <button type="submit" className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2 px-6 rounded text-xs transition cursor-pointer">
                    {selectedServiceId === 'new' ? 'Register and Publish Grid Item' : 'Save Section B Grid Revisions'}
                  </button>
                </form>

              </div>
            )}

            {/* --- TAB 2: SERVICES (The actual Services Page editor) [1] --- */}
            {devTab === 'services' && (
              <form onSubmit={handlePageServiceSubmit} className="max-w-2xl mx-auto space-y-6">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Configure Services Page Layout</h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Select Service to Edit</label>
                  <select 
                    value={selectedPageServiceId}
                    onChange={(e) => handlePageServiceSelectChange(e.target.value)}
                    className="w-full border border-slate-300 bg-white rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {pageServices.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Service Title</label>
                  <input 
                    type="text" required
                    value={pageServiceForm.title}
                    onChange={(e) => setPageServiceForm({ ...pageServiceForm, title: e.target.value })}
                    className="w-full border border-slate-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Description</label>
                  <textarea 
                    required rows="4"
                    value={pageServiceForm.description}
                    onChange={(e) => setPageServiceForm({ ...pageServiceForm, description: e.target.value })}
                    className="w-full border border-slate-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Feature One Title</label>
                    <input 
                      type="text" required
                      value={pageServiceForm.feature_one_title}
                      onChange={(e) => setPageServiceForm({ ...pageServiceForm, feature_one_title: e.target.value })}
                      className="w-full border border-slate-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Feature One Description / List (Use newlines for lists)</label>
                    <textarea 
                      required rows="3"
                      value={pageServiceForm.feature_one_desc}
                      onChange={(e) => setPageServiceForm({ ...pageServiceForm, feature_one_desc: e.target.value })}
                      className="w-full border border-slate-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                    ></textarea>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Feature Two Title</label>
                    <input 
                      type="text" required
                      value={pageServiceForm.feature_two_title}
                      onChange={(e) => setPageServiceForm({ ...pageServiceForm, feature_two_title: e.target.value })}
                      className="w-full border border-slate-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Feature Two Description / List (Use newlines for lists)</label>
                    <textarea 
                      required rows="3"
                      value={pageServiceForm.feature_two_desc}
                      onChange={(e) => setPageServiceForm({ ...pageServiceForm, feature_two_desc: e.target.value })}
                      className="w-full border border-slate-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                    ></textarea>
                  </div>
                </div>

                {selectedPageServiceId === '2' && ( // Career-specific fields
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-slate-100 p-4 rounded-lg bg-slate-50">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Feature Three Title</label>
                      <input 
                        type="text"
                        value={pageServiceForm.feature_three_title}
                        onChange={(e) => setPageServiceForm({ ...pageServiceForm, feature_three_title: e.target.value })}
                        className="w-full border border-slate-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Feature Three Description</label>
                      <textarea 
                        rows="2"
                        value={pageServiceForm.feature_three_desc}
                        onChange={(e) => setPageServiceForm({ ...pageServiceForm, feature_three_desc: e.target.value })}
                        className="w-full border border-slate-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                      ></textarea>
                    </div>
                  </div>
                )}

                {selectedPageServiceId === '1' && ( // Guidance-specific fields
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Booking Instructions (Separate each step with a new line)</label>
                    <textarea 
                      rows="4"
                      value={pageServiceForm.instructions}
                      onChange={(e) => setPageServiceForm({ ...pageServiceForm, instructions: e.target.value })}
                      placeholder="e.g. 1. Click the booking button...&#10;2. Fill in details...&#10;3. Confirm..."
                      className="w-full border border-slate-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                    ></textarea>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200 pt-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Sidebar Card Title</label>
                    <input 
                      type="text" required
                      value={pageServiceForm.sidebar_title}
                      onChange={(e) => setPageServiceForm({ ...pageServiceForm, sidebar_title: e.target.value })}
                      className="w-full border border-slate-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Sidebar Card Text Description</label>
                    <textarea 
                      required rows="2"
                      value={pageServiceForm.sidebar_text}
                      onChange={(e) => setPageServiceForm({ ...pageServiceForm, sidebar_text: e.target.value })}
                      className="w-full border border-slate-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                    ></textarea>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Primary Button Text Label</label>
                    <input 
                      type="text" required
                      value={pageServiceForm.btn_primary_text}
                      onChange={(e) => setPageServiceForm({ ...pageServiceForm, btn_primary_text: e.target.value })}
                      className="w-full border border-slate-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Secondary Button Text Label</label>
                    <input 
                      type="text" required
                      value={pageServiceForm.btn_secondary_text}
                      onChange={(e) => setPageServiceForm({ ...pageServiceForm, btn_secondary_text: e.target.value })}
                      className="w-full border border-slate-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-emerald-800 hover:bg-emerald-950 text-white font-bold py-3 rounded transition shadow-sm cursor-pointer"
                >
                  Save Services Page Revisions
                </button>
              </form>
            )}

            {/* --- TAB 3: ABOUT OSAS EDITOR --- */}
            {devTab === 'about' && (
              <div className="space-y-12">
                
                {/* Section A */}
                <form onSubmit={handleAboutContentSubmit} className="space-y-4 p-6 bg-slate-50 border border-slate-200 rounded-lg">
                  <h3 className="font-extrabold text-slate-800 text-base border-b pb-2">Section A: General Page Content</h3>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Page Title Heading</label>
                    <input 
                      type="text" required
                      value={aboutData.content.heading || ''}
                      onChange={(e) => setAboutData({
                        ...aboutData, 
                        content: { ...aboutData.content, heading: e.target.value }
                      })}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Subheading Description</label>
                    <textarea 
                      required rows="2"
                      value={aboutData.content.subheading || ''}
                      onChange={(e) => setAboutData({
                        ...aboutData, 
                        content: { ...aboutData.content, subheading: e.target.value }
                      })}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Vision Statement</label>
                      <textarea 
                        required rows="4"
                        value={aboutData.content.vision || ''}
                        onChange={(e) => setAboutData({
                          ...aboutData, 
                          content: { ...aboutData.content, vision: e.target.value }
                        })}
                        className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Mission Statement</label>
                      <textarea 
                        required rows="4"
                        value={aboutData.content.mission || ''}
                        onChange={(e) => setAboutData({
                          ...aboutData, 
                          content: { ...aboutData.content, mission: e.target.value }
                        })}
                        className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      ></textarea>
                    </div>
                  </div>

                  <button type="submit" className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2 px-6 rounded text-xs transition cursor-pointer">
                    Save Section A Revisions
                  </button>
                </form>

                {/* Section B */}
                <form onSubmit={handleAreaSubmit} className="space-y-4 p-6 bg-slate-50 border border-slate-200 rounded-lg">
                  <h3 className="font-extrabold text-slate-800 text-base border-b pb-2">Section B: Edit/Add Functional Areas</h3>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Select Card to Edit (Or select Register New Card)</label>
                    <select 
                      value={selectedAreaId}
                      onChange={(e) => handleAreaSelectChange(e.target.value)}
                      className="w-full max-w-md border border-slate-300 bg-white rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="new">+ Register New Card</option>
                      {aboutData.functionalAreas.map((area) => (
                        <option key={area.id} value={area.id}>{area.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Card Title</label>
                    <input 
                      type="text" required
                      value={areaForm.title}
                      onChange={(e) => setAreaForm({ ...areaForm, title: e.target.value })}
                      placeholder="e.g. Guidance & Counseling Office"
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Card Description</label>
                    <textarea 
                      required rows="3"
                      value={areaForm.description}
                      onChange={(e) => setAreaForm({ ...areaForm, description: e.target.value })}
                      placeholder="Details of the functional unit..."
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Key Operations (Comma separated list)</label>
                    <input 
                      type="text" required
                      value={areaForm.key_operations}
                      onChange={(e) => setAreaForm({ ...areaForm, key_operations: e.target.value })}
                      placeholder="e.g. Operation 1, Operation 2, Operation 3"
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Separate each operational bullet point with a comma (,)</p>
                  </div>

                  <button type="submit" className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2 px-6 rounded text-xs transition cursor-pointer">
                    {selectedAreaId === 'new' ? 'Register and Publish Card' : 'Save Section B Card Revisions'}
                  </button>
                </form>

                {/* Section C */}
                <form onSubmit={handleStaffSubmit} className="space-y-4 p-6 bg-slate-50 border border-slate-200 rounded-lg">
                  <h3 className="font-extrabold text-slate-800 text-base border-b pb-2">Section C: Edit/Add Administrative Team</h3>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Select Staff Member (Or select Add New Staff Profile)</label>
                    <select 
                      value={selectedStaffId}
                      onChange={(e) => handleStaffSelectChange(e.target.value)}
                      className="w-full max-w-md border border-slate-300 bg-white rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="new">+ Register New Staff Profile</option>
                      {aboutData.staff.map((person) => (
                        <option key={person.id} value={person.id}>{person.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Staff Full Name</label>
                      <input 
                        type="text" required
                        value={staffForm.name}
                        onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                        placeholder="e.g. Maria Clara"
                        className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Avatar Initials</label>
                      <input 
                        type="text" required maxLength="3"
                        value={staffForm.initials}
                        onChange={(e) => setStaffForm({ ...staffForm, initials: e.target.value })}
                        placeholder="e.g. MC"
                        className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-center"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Official Role/Designation</label>
                      <input 
                        type="text" required
                        value={staffForm.role}
                        onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                        placeholder="e.g. OSAS Staff"
                        className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Avatar Accent Color</label>
                      <select 
                        value={staffForm.color}
                        onChange={(e) => setStaffForm({ ...staffForm, color: e.target.value })}
                        className="w-full border border-slate-300 bg-white rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="bg-emerald-800">Emerald Forest (Primary)</option>
                        <option value="bg-emerald-700">Sage Accent</option>
                        <option value="bg-emerald-600">Soft Olive</option>
                        <option value="bg-emerald-500">Mint Highlight</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2 px-6 rounded text-xs transition cursor-pointer">
                    {selectedStaffId === 'new' ? 'Register and Publish Staff' : 'Save Section C Staff Revisions'}
                  </button>
                </form>

              </div>
            )}

          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // 6. STANDARD ADMIN PANEL RETURN
  // ==========================================
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
              {/* --- TAB 1: APPOINTMENTS --- */}
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

              {/* --- TAB 2: CONTACT MESSAGES --- */}
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
                    {/* Cover Image Upload */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Cover Image Upload</label>
                      <input 
                        id="announcement-image"
                        type="file" 
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Optional Image Preview Box */}
                  {announcementForm.image_url && (
                    <div className="border border-slate-200 rounded p-4 bg-slate-50 flex items-center space-x-4 max-w-sm">
                      <div className="w-16 h-16 bg-slate-100 rounded border overflow-hidden">
                        <img 
                          src={announcementForm.image_url} 
                          alt="Uploaded preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <p className="text-xs font-bold text-slate-800">Cover Image Preview Loaded</p>
                        <button 
                          type="button"
                          onClick={() => setAnnouncementForm({...announcementForm, image_url: ''})}
                          className="text-[10px] text-rose-700 hover:underline mt-1 font-semibold"
                        >
                          Remove Image
                        </button>
                      </div>
                    </div>
                  )}

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