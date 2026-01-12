import clsx from "clsx";

function FormInput({
  id,
  label,
  type,
  required,
  register,
  errors,
  disabled,
  LeftIcon,
  RightIcon,
  placeholder,
  classNames,
  ...other
}) {
  return (
    <div className="flex flex-col">
      <div
        className={clsx(
          `
        p-2
       py-3
        flex 
        flex-row
        items-center
        form-input
        w-full
        
      
       border-soft_gray
       
        border-b-[1.5px]
        `,

          errors[id]
            ? " border-rose-500  focus-within:border-rose-500"
            : "border-slate_blue focus-within:border-text_black",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {LeftIcon && <LeftIcon />}
        <input
          {...other}
          id={id}
          placeholder={placeholder}
          type={type}
          autoComplete={id}
          disabled={disabled}
          {...register(id, { required })}
          className={clsx(
            `w-full
            outline-none
            bg-transparent
            text-text_black
            mx-2
            placeholder:text-stroke_gray
            ${classNames}
        `
          )}
        />
        {RightIcon && <RightIcon />}
      </div>
      <p
        className={clsx(
          "text-sm mt-[0.15rem] h-[10px] transition-all duration-200",
          errors[id] ? "text-rose-500 opacity-100" : "opacity-0"
        )}
      >
        {errors[id]?.message || " "}
      </p>
    </div>
  );
}

export default FormInput;
