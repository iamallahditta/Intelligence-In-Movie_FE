import { useEffect, useRef, useState } from "react";
import { UserRound, ChevronDown } from "lucide-react";

const OutlineSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "Select",
  icon: Icon = UserRound,
}) => {
  const [open, setOpen] = useState(false);
    const selectRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  return (
    <div ref={selectRef} className="relative w-full max-w-xs">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full border border-navy_blue rounded-lg px-4 py-2 text-navy_blue hover:bg-navy_blue/5 focus:outline-none"
      >
        <div className="flex items-center space-x-2 overflow-hidden">
          {Icon && <Icon size={18} className="text-navy_blue flex-shrink-0" />}
          <span className="block truncate whitespace-nowrap">
            {value?.label || placeholder}
          </span>
        </div>
        <ChevronDown size={18} className="text-navy_blue flex-shrink-0" />
      </button>

      {open && (
        <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
          {options.length === 0 ? (
            <div className="px-4 py-2 text-gray-500">No options</div>
          ) : (
            options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt); // 👈 pass full object
                  setOpen(false);
                }}
                className={`px-4 py-2 cursor-pointer transition-colors ${
                  value?.value === opt.value
                    ? "bg-navy_blue/10 text-navy_blue"
                    : "hover:bg-navy_blue/5"
                }`}
              >
                {opt.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default OutlineSelect;
