export default function About() {
  const staff = [
    {
      name: "Laurence M. Lachica, MPA",
      role: "Head, OSAS",
      initials: "LL",
      color: "bg-emerald-800"
    },
    {
      name: "Doreen R. Bandiez, PhD",
      role: "Head Guidance Counselor",
      initials: "DB",
      color: "bg-emerald-700"
    },
    {
      name: "Lenbert M. Frias",
      role: "OSAS Staff",
      initials: "LF",
      color: "bg-emerald-600"
    },
    {
      name: "Sean David J. Calumbiran, LPT",
      role: "OSAS Coordinator",
      initials: "SC",
      color: "bg-emerald-500"
    }
  ];

  const functionalAreas = [
    {
      title: "Guidance & Counseling Office",
      description: "Dedicated to promoting mental wellness, personal development, and academic success through professional counseling, personality testing, and seminars.",
      focusPoints: ["Individual & Group Counseling", "Psychological Appraisal", "Orientation & Mental Health Seminars"]
    },
    {
      title: "Student Discipline Unit",
      description: "Enforces the policies laid out in the Student Handbook fairly and transparently. This unit handles student grievances, conducts inquiries, and monitors campus order.",
      focusPoints: ["Handbook Policy Enforcement", "Grievance Redressal Processes", "Conflict Mediation"]
    },
    {
      title: "Student Publications",
      description: "Ensures the development of independent, responsible student journalism on campus. Overviews and coordinates the printing and distribution of official student-led media.",
      focusPoints: ["Journalism Workshops", "School Newspaper Moderation", "Content Advisory Support"]
    },
    {
      title: "Student Government (Supreme Student Council)",
      description: "Serves as the primary link between the student body and university administrators. Empowers democratic student leadership and coordinates university-wide non-academic events.",
      focusPoints: ["Student Advocacy", "Event Management Coordination", "Clubs & Organizations Accreditation"]
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Page Header */}
      <div className="bg-emerald-900 text-white py-12 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">About OSAS</h1>
        <p className="text-emerald-100 mt-2 max-w-xl mx-auto">
          The core team dedicated to managing and supporting all aspects of your non-academic college experience.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        
        {/* Mission & Vision (Corrected from bg-emerald-850 to bg-emerald-800) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4 border-b border-emerald-100 pb-2 text-emerald-900">Our Vision</h2>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              To be a premier student-centric support hub that fosters a vibrant, inclusive, and empowering campus ecosystem, shaping students into balanced, value-oriented leaders who contribute positively to society.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4 border-b border-emerald-100 pb-2 text-emerald-900">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              To design and implement quality, non-academic services that safeguard student welfare, promote mental health, advocate for student rights, and nurture diverse student talents through dynamic community building and organizational activities.
            </p>
          </div>
        </section>

        {/* Functional Areas */}
        <section>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-8 border-b pb-3">
            Functional Areas Under OSAS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {functionalAreas.map((area, index) => (
              <div key={index} className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-200 transition">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{area.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">{area.description}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">Key Operations</h4>
                  <ul className="text-sm space-y-1.5 text-slate-700">
                    {area.focusPoints.map((point, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="text-emerald-700 mr-2">✓</span> {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Staff Directory */}
        <section>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-8 border-b pb-3">
            Our Administrative Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {staff.map((person, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm text-center">
                <div className={`w-16 h-16 ${person.color} text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4`}>
                  {person.initials}
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{person.name}</h3>
                <p className="text-[11px] text-slate-500 mt-1">{person.role}</p>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <a href={`mailto:${person.name.toLowerCase().replace(/\s+/g, '')}@school.edu.ph`} className="text-xs text-emerald-800 font-semibold hover:underline">
                    Contact Staff &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}