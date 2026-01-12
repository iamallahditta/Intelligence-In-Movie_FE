import React from "react";

const TextArea = ({
  id,
  register,
  errors,
  required,
  placeholder,
  disabled,
}) => {
  return (
    <div className="w-full relative">
      <textarea
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        placeholder={placeholder}
        className={`
          peer
          w-full
          p-4
          pt-6
          font-light
          bg-white
          border-2
          rounded-md
          outline-none
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          min-h-[100px]
          ${errors[id] ? 'border-rose-500' : 'border-neutral-300'}
          ${errors[id] ? 'focus:border-rose-500' : 'focus:border-black'}
        `}
      />
      {errors[id] && (
        <p className="text-rose-500 text-sm mt-1">{errors[id]?.message}</p>
      )}
    </div>
  );
};

export default TextArea; 