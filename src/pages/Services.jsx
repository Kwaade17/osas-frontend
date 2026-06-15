import { useState } from 'react';
import { API_BASE_URL } from '../config';
import Table from '../components/PendingRequestTable';

export default function Services() {
    const [selectedTab, setSelectedTab] = useState('id-process');

    const [idRequestForm, setIdRequestForm] = useState({
        requestType: "New",
        programs: "Bachelor of Agriculture Major in Agronomy (BS - Agric.)",
        lastName: "",
        firstName: "",
        middleName: "",
        yearLevel: "1st Year",
    });

    const [gmcForm, setGmcForm] = useState({
        gmcType: "Graduate",
        lastName: "",
        firstName: "",
        middleName: "",
        programs: "",
        dateGraduated: "2026-06-23",
        schoolYear: "2025 - 2026",
        yearLevel: "1st Year", // Initialized default
        semester: "First Semester", // Initialized default
        dateGranted: new Date().toLocaleDateString()
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isGmcSubmitted, setIsGmcSubmitted] = useState(false); // Track GMC success separately
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // 1. Submit ID Process Request
    const handleIDProcessSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const payload = {
            request_type: idRequestForm.requestType,
            programs: idRequestForm.programs,
            first_name: idRequestForm.firstName,
            middle_name: idRequestForm.middleName,
            last_name: idRequestForm.lastName,
            year_level: idRequestForm.yearLevel
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/id_request_process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                setIsSubmitted(true);
            } else {
                setError(data.error || 'Failed to submit ID request.');
            }
        } catch (err) {
            console.error('Error submitting form:', err);
            setError('Unable to connect to the server. Please check if the backend is running.');
        } finally {
            setIsLoading(false);
        }
    };

    // 2. Submit Good Moral Request (Now Fully Functional) [1]
    const handleGMCRequestSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Validation for Graduate school years [1]
        if (gmcForm.gmcType === 'Graduate') {
            const years = gmcForm.schoolYear.split('-').map(year => parseInt(year.trim(), 10));
            const startYear = years[0];
            const endYear = years[1];

            if (isNaN(startYear) || isNaN(endYear) || startYear >= endYear) {
                setError("Invalid School Year: The starting year must be earlier than the graduating year (e.g., 2025 - 2026).");
                setIsLoading(false);
                return; 
            }

            if (endYear - startYear !== 1) {
                setError("Invalid School Year: An academic school year must span exactly one year (e.g., 2025 - 2026).");
                setIsLoading(false);
                return;
            }
        }

        const payload = {
            gmc_type: gmcForm.gmcType,
            last_name: gmcForm.lastName,
            first_name: gmcForm.firstName,
            middle_name: gmcForm.middleName,
            programs: gmcForm.programs,
            date_graduated: gmcForm.gmcType === 'Graduate' ? gmcForm.dateGraduated : null,
            school_year: gmcForm.gmcType === 'Graduate' ? gmcForm.schoolYear : null,
            year_level: gmcForm.gmcType === 'Undergraduate' ? gmcForm.yearLevel : null,
            semester: gmcForm.gmcType === 'Undergraduate' ? gmcForm.semester : null
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/gmc_request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                setIsGmcSubmitted(true);
            } else {
                setError(data.error || 'Failed to submit Good Moral request.');
            }
        } catch (err) {
            console.error('Error submitting GMC:', err);
            setError('Unable to reach the database server. Check if your backend is running.');
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <div className="bg-slate-50 min-h-screen pb-16">

            {/* Page Header */}
            <div className="bg-emerald-900 text-white py-12 px-4 text-center">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Services</h1>
                <p className="text-emerald-100 mt-2 max-w-xl mx-auto text-sm">
                    Access and apply for LCCC student services including ID processing and Certificates of Good Moral Character.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 gap-8">
                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 shadow-sm space-y-4 rounded-xl overflow-hidden">
                        <div className="max-w-7xl mx-auto">
          
                            {/* Navigation Tabs */}
                            <div className="flex overflow-x-auto no-scrollbar border-b border-slate-200 bg-white rounded-t-xl">
                                <button 
                                    className={`flex-1 py-4 text-center text-sm font-semibold transition cursor-pointer ${selectedTab === 'id-process' ? 'bg-emerald-900 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
                                    onClick={() => setSelectedTab('id-process')}
                                >
                                    ID PROCESS
                                </button>
                                <button 
                                    className={`flex-1 py-4 text-center text-sm font-semibold transition cursor-pointer ${selectedTab === 'registrar' ? 'bg-emerald-900 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
                                    onClick={() => setSelectedTab('registrar')}
                                >   
                                    REGISTRAR QUEUE
                                </button>
                                <button 
                                    className={`flex-1 py-4 text-center text-sm font-semibold transition cursor-pointer ${selectedTab === 'good-moral' ? 'bg-emerald-900 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
                                    onClick={() => setSelectedTab('good-moral')}
                                >
                                    GOOD MORAL
                                </button>
                            </div>

                            {/* --- TAB 1: ID PROCESS --- */}
                            <div className={`p-6 min-h-full ${selectedTab === 'id-process' ? 'block' : 'hidden'}`}>
                                {!isSubmitted ? (
                                    <form onSubmit={handleIDProcessSubmit} className="min-h-full flex flex-col gap-6">
                                        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] items-center">
                                            <div>
                                                <h2 className="text-xl font-semibold text-slate-900">ID Process Request</h2>
                                                <p className="text-sm text-slate-600 mt-1">Fill out the form below to request a new student ID or schedule a re-print.</p>
                                            </div>
                                            <span className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800">
                                                Available for enrolled students
                                            </span>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-emerald-50/50 px-4 py-3 text-slate-700 shadow-sm cursor-pointer hover:bg-emerald-50 transition">
                                                <input
                                                    type="radio"
                                                    name="requestType"
                                                    value="New"
                                                    checked={idRequestForm.requestType === 'New'}
                                                    onChange={(e) => setIdRequestForm({...idRequestForm, requestType: e.target.value})}
                                                    className="h-4 w-4 accent-emerald-600"
                                                />
                                                <span className="text-sm font-medium">New</span>
                                            </label>
                                            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-emerald-50/50 px-4 py-3 text-slate-700 shadow-sm cursor-pointer hover:bg-emerald-50 transition">
                                                <input
                                                    type="radio"
                                                    name="requestType"
                                                    value="Re-print"
                                                    checked={idRequestForm.requestType === 'Re-print'}
                                                    onChange={(e) => setIdRequestForm({...idRequestForm, requestType: e.target.value})}
                                                    className="h-4 w-4 accent-emerald-600"
                                                />
                                                <span className="text-sm font-medium">Re-print</span>
                                            </label>
                                        </div>

                                        <div className="grid gap-6">
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="program" className="text-sm font-medium text-slate-700">Programs</label>
                                                <select id="program"
                                                    value={idRequestForm.programs}
                                                    onChange={(e) => setIdRequestForm({...idRequestForm, programs: e.target.value})}
                                                    className="w-full border border-slate-300 rounded-2xl bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                >
                                                    <option>Bachelor of Agriculture Major in Agronomy (BS - Agric.)</option>
                                                    <option>Bachelor of Science in Business Administration Major in Financial Management (BSBA - FM)</option>
                                                    <option>Bachelor of Science in Business Administration Major in Management Accounting (BSBA - MA)</option>
                                                    <option>Bachelor of Science in Office Administration (BSOA)</option>
                                                    <option>Bachelor of Public Administration (BPA)</option>
                                                    <option>Bachelor of Science in Criminology (BS - Crim.)</option>
                                                    <option>Bachelor of Elementary Education (BEEd)</option>
                                                    <option>Bachelor of Early Childhood Education (BECEd)</option>
                                                    <option>Bachelor of Physical Education (BPEd)</option>
                                                    <option>Bachelor of Secondary Education Major in English (BSEd - English)</option>
                                                    <option>Bachelor of Secondary Education Major in Math (BSEd - Math)</option>
                                                    <option>Bachelor of Secondary Education Major in Filipino (BSEd - Filipino)</option>
                                                    <option>Bachelor of Arts - English Language Studies (BA - ELS)</option>
                                                </select>
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor="last-name" className="text-sm font-medium text-slate-700">Last Name</label>
                                                    {/* Resolved: Cleaned up duplicate className property [1] */}
                                                    <input 
                                                        id="last-name" 
                                                        type="text" 
                                                        required 
                                                        value={idRequestForm.lastName}
                                                        onChange={(e) => setIdRequestForm({...idRequestForm, lastName: e.target.value})}
                                                        className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-900"
                                                        placeholder="Dela Cruz"
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor="first-name" className="text-sm font-medium text-slate-700">First Name</label>
                                                    {/* Resolved: Cleaned up duplicate className property [1] */}
                                                    <input 
                                                        id="first-name" 
                                                        type="text" 
                                                        required 
                                                        value={idRequestForm.firstName}
                                                        onChange={(e) => setIdRequestForm({...idRequestForm, firstName: e.target.value})}
                                                        className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-900"
                                                        placeholder="Juan"
                                                        disabled={isLoading} 
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor="middle-name" className="text-sm font-medium text-slate-700">Middle Name</label>
                                                    {/* Resolved: Cleaned up duplicate className property [1] */}
                                                    <input 
                                                        id="middle-name" 
                                                        type="text" 
                                                        required 
                                                        value={idRequestForm.middleName}
                                                        onChange={(e) => setIdRequestForm({...idRequestForm, middleName: e.target.value})}
                                                        className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-900"
                                                        placeholder="Santos"
                                                        disabled={isLoading} 
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor="year-level" className="text-sm font-medium text-slate-700">Year Level</label>
                                                    <select id="year-level"
                                                        value={idRequestForm.yearLevel}
                                                        onChange={(e) => setIdRequestForm({...idRequestForm, yearLevel: e.target.value})}
                                                        className="w-full border border-slate-300 rounded-2xl bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    >
                                                        <option>1st Year</option>
                                                        <option>2nd Year</option>
                                                        <option>3rd Year</option>
                                                        <option>4th Year</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-md text-sm">
                                                ⚠️ {error}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="inline-flex items-center justify-center rounded-full bg-emerald-800 hover:bg-emerald-950 px-6 py-3 text-sm font-semibold text-white transition duration-300"
                                        >
                                            Submit ID Request
                                        </button>

                                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 text-slate-700 shadow-sm">
                                            <h4 className="text-lg font-semibold text-emerald-950">Requirements</h4>
                                            <ul className="mt-4 space-y-3 text-sm leading-6">
                                                <li className="flex items-center gap-3">
                                                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-700"></span>
                                                    <span>2x2 ID Picture (colored with white background)</span>
                                                </li>
                                                <li className="flex items-center gap-3">
                                                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-700"></span>
                                                    <span>Photocopy of Birth Certificate (PSA)</span>
                                                </li>
                                                <li className="flex items-center gap-3">
                                                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-700"></span>
                                                    <span>Photocopy of Enrollment Assessment Form</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="min-h-full flex flex-col items-center justify-center text-center gap-4 py-12 px-6 rounded-3xl border border-emerald-100 bg-emerald-50/50">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-3xl">
                                            ✓
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900">Request Submitted!</h2>
                                            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                                                Your ID process request has been saved successfully. Please prepare the listed requirements below and wait for further instructions from the OSAS office.
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setIsSubmitted(false);
                                                setIdRequestForm({
                                                    requestType: "New",
                                                    programs: "Bachelor of Agriculture Major in Agronomy (BS - Agric.)",
                                                    lastName: "",
                                                    firstName: "",
                                                    middleName: "",
                                                    yearLevel: "1st Year",
                                                });
                                            }}
                                            className="mt-4 inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
                                        >
                                            Submit Another Request
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* --- TAB 2: REGISTRAR QUEUE --- */}
                            <div className={`p-6 min-h-full overflow-auto ${selectedTab === 'registrar' ? 'block' : 'hidden'}`}>
                                <div className="grid gap-6">
                                    <div>
                                        <h2 className="text-xl font-semibold text-slate-900">Pending Request Queue</h2>
                                        <p className="text-sm text-slate-600 mt-1">Monitor your pending status for claiming your request in the registrar.</p>
                                    </div>
                                    <div className="w-full overflow-x-auto rounded-xl shadow-sm border border-slate-200">
                                        <Table />
                                    </div>
                                </div>
                            </div>

                            {/* --- TAB 3: GOOD MORAL --- */}
                            <div className={`p-6 min-h-full ${selectedTab === 'good-moral' ? 'block' : 'hidden'}`}>
                                {!isGmcSubmitted ? (
                                    <form onSubmit={handleGMCRequestSubmit} className="space-y-6">
                                        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] items-center">
                                            <div>
                                                <h2 className="text-xl font-semibold text-slate-900">Certificate of Good Moral Request</h2>
                                                <p className="text-sm text-slate-600 mt-1">Provide your details below to request a formal certification. Select the appropriate request type and complete the required fields.</p>
                                            </div>
                                            <div className="inline-flex rounded-full bg-slate-100 p-1 shadow-sm">
                                                <button
                                                    type="button"
                                                    onClick={() => setGmcForm({...gmcForm, gmcType: 'Graduate'})}
                                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition cursor-pointer ${gmcForm.gmcType === 'Graduate' ? 'bg-emerald-800 text-white' : 'text-slate-700 hover:bg-slate-200'}`}
                                                >
                                                    Graduate
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setGmcForm({...gmcForm, gmcType: 'Undergraduate'})}
                                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition cursor-pointer ${gmcForm.gmcType === 'Undergraduate' ? 'bg-emerald-800 text-white' : 'text-slate-700 hover:bg-slate-200'}`}
                                                >
                                                    Undergraduate
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="gmc-last-name" className="text-sm font-medium text-slate-700">Last Name</label>
                                                <input
                                                    id="gmc-last-name"
                                                    type="text"
                                                    required
                                                    value={gmcForm.lastName}
                                                    onChange={(e) => setGmcForm({...gmcForm, lastName: e.target.value})}
                                                    placeholder="Dela Cruz"
                                                    disabled={isLoading}
                                                    className="w-full px-4 py-3 border border-slate-300 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="gmc-first-name" className="text-sm font-medium text-slate-700">First Name</label>
                                                <input
                                                    id="gmc-first-name"
                                                    type="text"
                                                    required
                                                    value={gmcForm.firstName}
                                                    onChange={(e) => setGmcForm({...gmcForm, firstName: e.target.value})}
                                                    placeholder="Juan"
                                                    disabled={isLoading}
                                                    className="w-full px-4 py-3 border border-slate-300 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="gmc-middle-name" className="text-sm font-medium text-slate-700">Middle Name</label>
                                                <input
                                                    id="gmc-middle-name"
                                                    type="text"
                                                    required
                                                    value={gmcForm.middleName}
                                                    onChange={(e) => setGmcForm({...gmcForm, middleName: e.target.value})}
                                                    placeholder="Santos"
                                                    disabled={isLoading}
                                                    className="w-full px-4 py-3 border border-slate-300 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="gmc-programs" className="text-sm font-medium text-slate-700">Program of Study</label>
                                                <input
                                                    id="gmc-programs"
                                                    type="text"
                                                    required
                                                    value={gmcForm.programs}
                                                    onChange={(e) => setGmcForm({...gmcForm, programs: e.target.value})}
                                                    placeholder="Bachelor of Elementary Education"
                                                    disabled={isLoading}
                                                    className="w-full px-4 py-3 border border-slate-300 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                                />
                                            </div>
                                        </div>

                                        {gmcForm.gmcType === 'Undergraduate' ? (
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor="gmc-year-level" className="text-sm font-medium text-slate-700">Year Level</label>
                                                    <select
                                                        id="gmc-year-level"
                                                        value={gmcForm.yearLevel}
                                                        onChange={(e) => setGmcForm({...gmcForm, yearLevel: e.target.value})}
                                                        required
                                                        disabled={isLoading}
                                                        className="w-full px-4 py-3 border border-slate-300 rounded-2xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                                    >
                                                        <option>1st Year</option>
                                                        <option>2nd Year</option>
                                                        <option>3rd Year</option>
                                                        <option>4th Year</option>
                                                    </select>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor="gmc-semester" className="text-sm font-medium text-slate-700">Semester</label>
                                                    <select
                                                        id="gmc-semester"
                                                        value={gmcForm.semester}
                                                        onChange={(e) => setGmcForm({...gmcForm, semester: e.target.value})}
                                                        required
                                                        disabled={isLoading}
                                                        className="w-full px-4 py-3 border border-slate-300 rounded-2xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                                    >
                                                        <option>First Semester</option>
                                                        <option>Second Semester</option>
                                                        <option>Summer</option>
                                                    </select>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor="gmc-year-graduated" className="text-sm font-medium text-slate-700">Graduation Date</label>
                                                    <input
                                                        id="gmc-year-graduated"
                                                        type="date"
                                                        required
                                                        value={gmcForm.dateGraduated}
                                                        onChange={(e) => setGmcForm({...gmcForm, dateGraduated: e.target.value})}
                                                        disabled={isLoading}
                                                        className="w-full px-4 py-3 border border-slate-300 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor="gmc-school-year" className="text-sm font-medium text-slate-700">School Year</label>
                                                    <input
                                                        id="gmc-school-year"
                                                        type="text"
                                                        required
                                                        maxLength={11}
                                                        pattern="\d{4}\s*-\s*\d{4}"
                                                        value={gmcForm.schoolYear}
                                                        onChange={(e) => setGmcForm({...gmcForm, schoolYear: e.target.value})}
                                                        placeholder="2025 - 2026"
                                                        disabled={isLoading}
                                                        className="w-full px-4 py-3 border border-slate-300 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {error && (
                                            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-md text-sm">
                                                ⚠️ {error}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-emerald-800 hover:bg-emerald-950 text-white font-bold py-3 rounded-2xl transition duration-300 cursor-pointer"
                                        >
                                            Submit Good Moral Request
                                        </button>
                                    </form>
                                ) : (
                                    <div className="min-h-full flex flex-col items-center justify-center text-center gap-4 py-12 px-6 rounded-3xl border border-emerald-100 bg-emerald-50/50">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-3xl">
                                            ✓
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900">GMC Request Submitted!</h2>
                                            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                                                Your Certificate of Good Moral Character request has been saved successfully. Please wait for the registrar clearance check and monitor the registrar queue.
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setIsGmcSubmitted(false);
                                                setGmcForm({
                                                    gmcType: "Graduate",
                                                    lastName: "",
                                                    firstName: "",
                                                    middleName: "",
                                                    programs: "",
                                                    dateGraduated: "2026-06-23",
                                                    schoolYear: "2025 - 2026",
                                                    yearLevel: "1st Year",
                                                    semester: "First Semester",
                                                    dateGranted: new Date().toLocaleDateString()
                                                });
                                            }}
                                            className="mt-4 inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
                                        >
                                            Request Another Certification
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}