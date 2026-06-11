import { useState } from 'react';
import { API_BASE_URL } from '../config';
import Table from '../components/PendingRequestTable'

function Services() {
    const [selectedTab, setSelectedTab] = useState('id-process')

    const [idRequestForm, setIdRequestForm] = useState({
        requestType: "New",
        programs: "Bachelor of Agriculture Major in Agronomy (BS - Agric.)",
        lastName: "",
        firstName: "",
        middleName: "",
        yearLevel: "1st Year",
    })

    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Format the payload to match exactly what your backend destructures
        const payload = {
            request_type: idRequestForm.requestType,
            programs: idRequestForm.programs,
            first_name: idRequestForm.firstName,
            middle_name: idRequestForm.middleName,
            last_name: idRequestForm.lastName,
            year_level: idRequestForm.yearLevel,
            request_at: new Date().toISOString() // Generates the required timestamp
        }

        try {
            // Connect to the running Node.js server endpoint
        const response = await fetch(`${API_BASE_URL}/api/id_request_process`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        console.log(response)

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

    return(
        <div className="bg-slate-50 min-h-screen pb-16">

            {/* Page Header */}
            <div className="bg-emerald-900 text-white py-12 px-4 text-center">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Services</h1>
                <p className="text-emerald-100 mt-2 max-w-xl mx-auto">
                    View and check current bulletins of Major, Program-Limited, and College organizations overseen by our CORE Coordinator.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 gap-8">
                {/* Left/Middle Column: Directory & Filter */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border-slate-200 shadow-sm space-y-4 rounded-xl overflow-hidden">
                        <div className="max-w-7xl mx-auto lg:px-8">
          
                            {/* Tabs */}
                            <div className="flex border-b border-slate-200 bg-white rounded-t-xl border-t border-x overflow-hidden">
                                <button 
                                    className={`flex-1 py-4 text-center text-sm font-semibold transition cursor-pointer ${selectedTab === 'id-process' ? 'bg-emerald-500 text-white' : 'hover:bg-slate-100'}`}
                                    onClick={() => setSelectedTab('id-process')}
                                >
                                    ID PROCESS
                                </button>
                                <button 
                                    className={`flex-1 py-4 text-center text-sm font-semibold transition cursor-pointer ${selectedTab === 'registrar' ? 'bg-emerald-500 text-white' : 'hover:bg-slate-100'}`}
                                    onClick={() => setSelectedTab('registrar')}
                                >   
                                    REGISTRAR
                                </button>
                                <button 
                                    className={`flex-1 py-4 text-center text-sm font-semibold transition cursor-pointer ${selectedTab === 'good-moral' ? 'bg-emerald-500 text-white' : 'hover:bg-slate-100'}`}
                                    onClick={() => setSelectedTab('good-moral')}
                                >
                                    GOOD MORAL
                                </button>
                            </div>

                            {/* ID Process */}
                            <div className={`bg-white rounded-b-xl border-x border-slate-200 p-6 min-h-full ${selectedTab === 'id-process' ? 'block' : 'hidden'}`}>
                                {!isSubmitted ? (
                                    <form onSubmit={handleSubmit} className="min-h-full flex flex-col gap-6">
                                        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] items-center">
                                            <div>
                                                <h2 className="text-xl font-semibold text-slate-900">ID Process Request</h2>
                                                <p className="text-sm text-slate-600 mt-1">Fill out the form below to request a new student ID or schedule a re-print.</p>
                                            </div>
                                            <span className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
                                                Available for enrolled students
                                            </span>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-emerald-50 px-4 py-3 text-slate-700 shadow-sm">
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
                                            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-emerald-50 px-4 py-3 text-slate-700 shadow-sm">
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
                                                    value={idRequestForm.programs} // FIX: changed from .category
                                                    onChange={(e) => setIdRequestForm({...idRequestForm, programs: e.target.value})}
                                                    className="w-full min-w-0 border border-slate-300 rounded-2xl bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                                                    <input id="last-name" type="text" required className="w-full border border-slate-300 rounded-2xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    value={idRequestForm.lastName}
                                                    onChange={(e) => setIdRequestForm({...idRequestForm, lastName: e.target.value})}
                                                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                                    placeholder="Dela Cruz"
                                                    disabled={isLoading}/>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor="first-name" className="text-sm font-medium text-slate-700">First Name</label>
                                                    <input id="first-name" type="text" required className="w-full border border-slate-300 rounded-2xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    value={idRequestForm.firstName}
                                                    onChange={(e) => setIdRequestForm({...idRequestForm, firstName: e.target.value})}
                                                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                                    placeholder="Juan"
                                                    disabled={isLoading} />
                                                </div>
                                            </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="middle-name" className="text-sm font-medium text-slate-700">Middle Name</label>
                                                <input id="middle-name" type="text" required className="w-full border border-slate-300 rounded-2xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                value={idRequestForm.middleName}
                                                onChange={(e) => setIdRequestForm({...idRequestForm, middleName: e.target.value})}
                                                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                                placeholder="Santos"
                                                disabled={isLoading} />
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

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="inline-flex items-center justify-center rounded-full bg-emerald-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900"
                                    >
                                        Submit
                                    </button>

                                    {/* Error Display Alert */}
                                    {error && (
                                        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-md text-sm">
                                        ⚠️ {error}
                                        </div>
                                    )}

                                    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-slate-700 shadow-sm">
                                        <h4 className="text-lg font-semibold text-emerald-900">Requirements</h4>
                                        <ul className="mt-4 space-y-3 text-sm leading-6">
                                            <li className="flex items-center gap-3">
                                                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-700"></span>
                                                <span className="max-w-10/12 md:w-full">2x2 ID Picture (colored with white background)</span>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-700"></span>
                                                <span className="max-w-10/12 md:w-full">Photocopy of Birth Certificate (PSA)</span>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-700"></span>
                                                <span className="max-w-10/12 md:w-full">Photocopy of Form 137 (for incoming 1st year students) or Form 138 (for transferees and current students)</span>
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
                                            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
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
                                            className="mt-4 inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                        >
                                            Submit Another Request
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className={`bg-white border-b border-x border-slate-200 rounded-b-lg p-6 min-h-full overflow-auto ${selectedTab === 'registrar' ? 'block' : 'hidden'}`}>
                                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] items-center">
                                    <div>
                                        <h2 className="text-xl font-semibold text-slate-900">Pending Request</h2>
                                        <p className="text-sm text-slate-600 mt-1">Monitor your pending status for claiming your request in the registrar.</p>
                                    </div>
                                    <span className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
                                        Available for enrolled students
                                    </span>
                                    <div className="w-full md:col-span-2">
                                        <Table />
                                    </div>
                                </div>
                            </div>

                            <div className={`bg-white border-b border-x border-slate-200 rounded-b-lg p-6 min-h-full ${selectedTab === 'good-moral' ? 'block' : 'hidden'}`}>
                                <p className="text-sm text-slate-700">
                                    For inquiries regarding the Good Moral Certificate, please contact us at <a href="mailto:goodmoral@university.edu" className="text-emerald-600 hover:underline">
                                        goodmoral@university.edu
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Services;