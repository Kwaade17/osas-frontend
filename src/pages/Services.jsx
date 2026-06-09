import { useState } from 'react';

function Services() {
    const [selectedTab, setSelectedTab] = useState('id-process');

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
                    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
                            {/* Tabs */}
                            <div className="flex border-b border-slate-200 bg-white rounded-t-lg border-t border-x overflow-hidden">
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
                            <div className={`bg-white border-b border-x border-slate-200 rounded-b-lg p-6 min-h-full ${selectedTab === 'id-process' ? 'block' : 'hidden'}`}>
                                <form className="min-h-full flex flex-col gap-6">
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
                                            <input type="radio" name="type" className="h-4 w-4 accent-emerald-600" id="New" defaultChecked />
                                            <span className="text-sm font-medium">New</span>
                                        </label>
                                        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-emerald-50 px-4 py-3 text-slate-700 shadow-sm">
                                            <input type="radio" name="type" className="h-4 w-4 accent-emerald-600" id="Re-print" />
                                            <span className="text-sm font-medium">Re-print</span>
                                        </label>
                                    </div>

                                    <div className="grid gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="program" className="text-sm font-medium text-slate-700">Programs</label>
                                            <select id="program" className="w-full min-w-0 border border-slate-300 rounded-2xl bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500">
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
                                                <input id="last-name" type="text" className="w-full border border-slate-300 rounded-2xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="first-name" className="text-sm font-medium text-slate-700">First Name</label>
                                                <input id="first-name" type="text" className="w-full border border-slate-300 rounded-2xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                                            </div>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="middle-name" className="text-sm font-medium text-slate-700">Middle Name</label>
                                                <input id="middle-name" type="text" className="w-full border border-slate-300 rounded-2xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="year-level" className="text-sm font-medium text-slate-700">Year Level</label>
                                                <select id="year-level" className="w-full border border-slate-300 rounded-2xl bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                                    <option>1st Year</option>
                                                    <option>2nd Year</option>
                                                    <option>3rd Year</option>
                                                    <option>4th Year</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="inline-flex items-center justify-center rounded-full bg-emerald-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            alert('Form submitted!');
                                        }}>
                                        Submit
                                    </button>

                                    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-slate-700 shadow-sm">
                                        <h4 className="text-lg font-semibold text-emerald-900">Requirements</h4>
                                        <ul className="mt-4 space-y-3 text-sm leading-6">
                                            <li className="flex items-center gap-3">
                                                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-700"></span>
                                                <span className="sm:w-md md:w-full">2x2 ID Picture (colored with white background)</span>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-700"></span>
                                                <span className="sm:w-md md:w-full">Photocopy of Birth Certificate (PSA)</span>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-700"></span>
                                                <span className="sm:w-md md:w-full">Photocopy of Form 137 (for incoming 1st year students) or Form 138 (for transferees and current students)</span>
                                            </li>
                                        </ul>
                                    </div>
                                </form>
                            </div>

                            <div className={`bg-white border-b border-x border-slate-200 rounded-b-lg p-6 min-h-full ${selectedTab === 'registrar' ? 'block' : 'hidden'}`}>
                                <p className="text-sm text-slate-700">
                                    For inquiries regarding the Registrar's services, please contact us at <a href="mailto:registrar@university.edu" className="text-emerald-600 hover:underline">
                                        registrar@university.edu
                                    </a>
                                </p>
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