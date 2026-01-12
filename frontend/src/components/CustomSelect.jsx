import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

const CustomSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "Select option",
  disabled = false,
  className = "",
  triggerClassName = "",
  contentClassName = "",
  itemClassName = "",
  chevronClassName = "",
  showChevron = true,
  errors,
  id,
  LeftIcon,
  required,
  register,
}) => {
  const [open, setOpen] = useState(false);
  const selectRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const selectedOption = options.find(
    (opt) => (typeof opt === "string" ? opt : opt.value) === value
  );
  const displayText = selectedOption
    ? typeof selectedOption === "string"
      ? selectedOption
      : selectedOption.label
    : placeholder;

  const handleSelect = (optionValue) => {
    onChange({ target: { value: optionValue } });
    setOpen(false);
  };

  const hasError = errors?.[id];

  return (
    <div className={clsx("flex flex-col relative", className)} ref={selectRef}>
      <div
        className={clsx(
          "p-2 py-3 flex flex-row items-center form-input w-full border-soft_gray border-b-[1.5px] transition-colors duration-200 cursor-pointer",
          hasError
            ? "border-rose-500 focus-within:border-rose-500"
            : "border-slate_blue focus-within:border-text_black",
          disabled && "opacity-50 cursor-not-allowed",
          triggerClassName
        )}
        onClick={() => !disabled && setOpen(!open)}
      >
        {LeftIcon && <LeftIcon />}
        <span
          className={clsx(
            "w-full mx-2 text-text_black",
            !value && "text-[#9CA3AF]"
          )}
        >
          {displayText}
        </span>
        {showChevron && (
          <ChevronDown
            size={20}
            className={clsx(
              "pointer-events-none flex-shrink-0 absolute right-4 transition-transform duration-200",
              open && "rotate-180",
              disabled ? "text-[#9CA3AF]" : "text-navy_blue",
              chevronClassName
            )}
          />
        )}
      </div>

      {/* Dropdown Menu */}
      {open && !disabled && (
        <div
          className={clsx(
            "absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-md z-50 max-h-60 overflow-y-auto",
            contentClassName
          )}
          style={{
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
          }}
        >
          {options.length === 0 ? (
            <div className="px-4 py-2 text-gray-400 text-sm">
              No options available
            </div>
          ) : (
            options.map((option, index) => {
              const optionValue =
                typeof option === "string" ? option : option.value;
              const optionLabel =
                typeof option === "string" ? option : option.label;
              const isSelected = value === optionValue;

              return (
                <div
                  key={optionValue || index}
                  onClick={() => handleSelect(optionValue)}
                  className={clsx(
                    "px-4 py-2 cursor-pointer text-sm text-text_black hover:bg-navy_blue/10 transition-colors",
                    isSelected && "bg-light_blue text-navy_blue font-semibold",
                    itemClassName
                  )}
                >
                  {optionLabel}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Error Message */}
      <p
        className={clsx(
          "text-sm leading-[14px] h-[10px] transition-all duration-200 my-[0.2rem]",
          hasError ? "text-rose-500 opacity-100" : "opacity-0"
        )}
      >
        {hasError?.message || " "}
      </p>

      {/* Hidden select for form registration */}
      {register && (
        <select
          {...register(id, { required })}
          value={value || ""}
          onChange={() => {}} // Controlled by our custom dropdown
          className="hidden"
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => {
            const optionValue =
              typeof option === "string" ? option : option.value;
            const optionLabel =
              typeof option === "string" ? option : option.label;
            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>
      )}
    </div>
  );
};

export default CustomSelect;
