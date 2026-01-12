import React, { useState } from "react";

import { Controller } from "react-hook-form";
import clsx from "clsx";

function Select({
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
  options,
  setValue,
  value,
  control,
  open,
  setOpen,
  ...other
}) {
  return (
    <div className="relative cursor-pointer" >
        <Controller
            name={id}
            control={control}
            render={({ field }) => ( 
      <div
      
        className={clsx(
          `
          p-2
            mt-0
            flex 
            flex-row
             items-center 
        form-input
        w-full
        rounded-md
        py-3
        text-lightblack
        bg-skygray
        border-[2px]
        `,
          !errors[id] && "focus:ring-rose-500 ",
          errors[id] ? " border-rose-500 " : "border-gray-200",
          disabled && "opacity-50 cursor-default"
        )}

        onClick={(e)=>{
            e.stopPropagation()
            setOpen(!open)}}
      >
        {LeftIcon && <LeftIcon />}

        <input
          {...other}
          id={id}
          placeholder={placeholder}
          type={type}
          autoComplete={id}
        
        //   disabled={true}
          {...register(id, { required })}
         

          className={clsx(
            `
            w-full
                  outline-none
                  bg-transparent
                  text-gray-600
                  mx-2
                  placeholder:text-gray-400
                  cursor-pointer
                  
              `
          )}
        />

        {RightIcon && <RightIcon />}
      </div>)}/>

      <div className={`${open ? 'scale-y-100':'scale-y-0'} origin-top w-full max-h-[200px] overflow-y-scroll shadow-xl rounded-2xl duration-300  bg-white absolute top-14 z-20 p-2 px-4`}
     
        style={{boxShadow:'0px 1px 9px 0px rgba(0,0,0,0.4)'}}
     
      >
      {
        options?.map(option=><div
            onClick={()=>{
                setOpen(false)
                setValue(id,option.label)}}
            className="my-1 p-2 rounded-lg hover:bg-gray-200 cursor-pointer">{option.label}</div>)
      }

      </div>
    </div>
  );
}

export default Select;
