export default function FeatureSection({
  title = "Insert Section Title",
  subtitle = "Optional Subtitle Label",
  description = "Insert your main paragraph description here. This section is designed to explain a specific service, objective, or program in detail.",
  imageSrc = "", // Pass an image path (e.g. "/school-bg.jpg")
  iconClass = "fa-solid fa-star", // Or pass a Font Awesome icon if there's no image
  buttonText = "", // Optional: e.g. "Learn More"
  onButtonClick = () => {}, // Optional click handler
  reverse = false, // Set to true to put image/icon on the right [1]
  bgColor = "bg-white" // Can pass "bg-white" or "bg-slate-50"
}) {
  return (
    <section className={`py-16 border-b border-slate-200 ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Responsive 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* 
            IMAGE OR ICON COLUMN
            Uses "md:order-last" to swap positions when 'reverse' is true [1]
          */}
          <div className={`flex justify-center ${reverse ? 'md:order-last' : ''}`}>
            {imageSrc ? (
              /* If an image is provided, render the image */
              <div className="w-full max-w-md h-64 md:h-80 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                <img 
                  src={imageSrc} 
                  alt={title} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              /* If no image is provided, fallback to rendering a large Font Awesome Icon */
              <div className="w-24 h-24 sm:w-32 sm:h-24 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center text-3xl sm:text-4xl shadow-sm border border-emerald-100/50">
                <i className={iconClass}></i>
              </div>
            )}
          </div>

          {/* TEXT CONTENT COLUMN */}
          <div className="space-y-6">
            <div>
              {/* Optional Subtitle */}
              {subtitle && (
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                  {subtitle}
                </span>
              )}
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-4">
                {title}
              </h2>
            </div>
            
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              {description}
            </p>

            {/* Optional Call to Action Button */}
            {buttonText && (
              <div className="pt-2">
                <button 
                  onClick={onButtonClick}
                  className="bg-emerald-800 hover:bg-emerald-950 text-white font-semibold text-xs py-2.5 px-6 rounded shadow-sm transition cursor-pointer"
                >
                  {buttonText}
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}