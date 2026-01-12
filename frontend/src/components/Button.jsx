import { Oval } from "react-loader-spinner";
import React from "react";

function Button({
  label,
  onClick,
  disabled,
  outline,
  small,
  rounded,
  IconRight,
  IconLeft,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
              relative
              
              disabled:cursor-not-allowed
              
              shadow-md
              transition
              w-full
              flex
              justify-center
              items-center
              cursor-poitner
              hover:translate-y-[1px]
              px-2
            ${rounded ? "rounded-full" : "rounded-xl"}
            ${outline ? "bg-transparent" : "bg-navy_blue"}
            ${outline ? "border-navy_blue" : "border-navy_blue"}
            ${outline ? "text-navy_blue" : "text-white"}
            ${small ? "py-1" : "py-2"}
            ${small ? "text-sm" : "text-md"}
            ${small ? "font-light" : "font-semibold"}
            
            ${
              outline
                ? small
                  ? "border-[1px]"
                  : "border-[1px]"
                : "border-none"
            }


          `}
    >
      {!disabled ? (
        <div className="h-[24px] flex flex-row items-center gap-1">
          {IconLeft && <IconLeft />}
          {label}
          {IconRight && <IconRight />}
        </div>
      ) : (
        <Oval
          visible={true}
          height="24"
          width="24"
          color={outline ? "#1e2a78" : "#fff"}
          secondaryColor={outline ? "#1e2a78" : "#b3b5db"}
          ariaLabel="oval-loading"
        />
      )}
    </button>
  );
}

export default Button;
