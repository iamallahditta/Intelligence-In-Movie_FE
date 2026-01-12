import React from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";

function SelectInput({
  id,
  label,
  required,
  register,
  errors,
  disabled,
  LeftIcon,
  placeholder,
  options = [],
  value,
  onChange,
  classNames,
  ...other
}) {
  return (
    <div className="flex flex-col">
      <div
        className={clsx(
          "p-2 py-3 flex flex-row items-center form-input w-full border-soft_gray border-b-[1.5px] transition-colors duration-200 relative",
          errors?.[id]
            ? "border-rose-500 focus-within:border-rose-500"
            : "border-slate_blue focus-within:border-text_black",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {LeftIcon && <LeftIcon />}
        <select
          {...other}
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...(register && register(id, { required }))}
          className={clsx(
            "w-full outline-none bg-transparent mx-2 cursor-pointer appearance-none pr-8",
            "text-text_black",
            !value && "text-[#9CA3AF]",
            classNames
          )}
        >
          {placeholder && (
            <option value="" disabled className="text-text_black">
              {placeholder}
            </option>
          )}
          {options.map((option) => {
            const optionValue = typeof option === "string" ? option : option.value;
            const optionLabel = typeof option === "string" ? option : option.label;
            return (
              <option
                key={optionValue}
                value={optionValue}
                className="text-text_black bg-white"
              >
                {optionLabel}
              </option>
            );
          })}
        </select>
        <ChevronDown
          size={20}
          className={clsx(
            "pointer-events-none flex-shrink-0 absolute right-4 transition-colors",
            disabled ? "text-[#9CA3AF]" : "text-navy_blue",
            !value && "text-[#9CA3AF]"
          )}
        />
      </div>
      <p
        className={clsx(
          "text-sm leading-[14px] h-[10px] transition-all duration-200 my-[0.2rem]",
          errors?.[id] ? "text-rose-500 opacity-100" : "opacity-0"
        )}
      >
        {errors?.[id]?.message || " "}
      </p>
    </div>
  );
}

export default SelectInput;
