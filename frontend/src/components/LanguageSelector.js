import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe, ChevronDown } from "lucide-react";

const languages = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "zh-CN", label: "Mandarin" },
];

const LanguageSelector = ({ setlang, className = "" }) => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
      const selectRef = useRef(null);

  const currentLanguage = languages.find(
    (lang) => lang.code === i18n.language
  ) || { label: "Language" };

  const changeLanguage = (selectedLang) => {
    i18n.changeLanguage(selectedLang);
    setlang(selectedLang);
    setOpen(false);
  };

  useEffect(() => {
    setlang(i18n.language);
  }, []);

  
  
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
    <div ref={selectRef} className={`relative w-full max-w-xs ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full border border-navy_blue rounded-lg px-4 py-2 text-navy_blue hover:bg-navy_blue/5 focus:outline-none"
      >
        <div className="flex items-center space-x-2">
          <Globe size={18} className="text-navy_blue" />
          <span>{currentLanguage.label}</span>
        </div>
        <ChevronDown size={18} className="text-navy_blue" />
      </button>

      {open && (
        <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
          {languages.map((lang) => (
            <div
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`px-4 py-2 cursor-pointer transition-colors ${
                i18n.language === lang.code
                  ? "bg-navy_blue/10 text-navy_blue"
                  : "hover:bg-navy_blue/5"
              }`}
            >
              {lang.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
