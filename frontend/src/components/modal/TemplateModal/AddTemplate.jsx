import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AiFillPlusSquare } from "react-icons/ai";
import { IoInformationCircleOutline } from "react-icons/io5";
import { FiTrash2 } from "react-icons/fi";

import templateSchema from "../../../utils/formSchema/template";
import Button from "../../Button";
import { useMemo, useState } from "react";
import FormInput from "../../FormInput";
import toast from "react-hot-toast";
import axios from "axios";
import useRecordings from "../../../hooks/useRecordings";

export default function AddTemplate({
  onSuccess,
  defaultValues,
  setSelectedTemplate,
}) {
  const { templateOption, setTemplateOption } = useRecordings();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      templateName: defaultValues?.templateName || "",
      medicalNotes: defaultValues?.notes || [{ title: "", description: "" }],
    },
    resolver: zodResolver(templateSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicalNotes",
  });

  const addMedicalNote = () => append({ title: "", description: "" });
  const removeMedicalNote = (i) => fields.length > 1 && remove(i);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const url = defaultValues
        ? `/v1/api/templates/update/${defaultValues?.id}`
        : `/v1/api/templates/insert`;

      const method = defaultValues ? "put" : "post";

      const response = await axios[method](url, data);
      if (response?.data?.success) {
        const newTemplate = response.data.data;
        const formattedTemplate = {
          id: newTemplate.id,
          userId: newTemplate.userId,
          templateName: newTemplate.templateName,
        };

        let updatedTemplates = [];
        if (defaultValues) {
          updatedTemplates = templateOption.map((template) =>
            template.id === formattedTemplate.id ? formattedTemplate : template
          );
        } else {
          updatedTemplates = [...templateOption, formattedTemplate];
        }
        setTemplateOption(updatedTemplates);

        reset();
        setIsLoading(false);
        toast.success(response?.data?.message);
        setSelectedTemplate(null);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const flatErrors = useMemo(() => {
    const fe = {};
    if (errors.medicalNotes && Array.isArray(errors.medicalNotes)) {
      errors.medicalNotes.forEach((noteErr, idx) => {
        if (noteErr?.title) {
          fe[`medicalNotes.${idx}.title`] = noteErr.title;
        }
        if (noteErr?.description) {
          fe[`medicalNotes.${idx}.description`] = noteErr.description;
        }
      });
    }
    return fe;
  }, [errors]);

  return (
    <div className="space-y-6">
      <FormInput
        id="templateName"
        register={register}
        placeholder="Template Name"
        errors={errors}
        required={true}
      />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">Medical Notes</h3>
            <div className="relative group">
              <IoInformationCircleOutline className="w-4 h-4 text-[#6b7280] hover:text-black cursor-pointer transition-colors" />

              <div className="hidden sm:block absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-4 py-3 bg-[#ffffff] border border-soft_gray text-[#374151] text-sm rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-72 z-50">
                <div className="text-left">
                  <div className="font-semibold text-black mb-1.5">
                    Medical Notes Guide:
                  </div>
                  <div className="mb-1">
                    <span className="font-medium text-black">Title:</span>{" "}
                    <span className="text-[#4b5563]">
                      Meaningful label (e.g., "Respiratory Symptoms", "Follow-up
                      Instructions")
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-black">Description:</span>{" "}
                    <span className="text-[#4b5563]">
                      Brief, clear template that aligns with patient scenarios
                    </span>
                  </div>
                </div>
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-8 border-transparent border-r-[#b0b0b0]"></div>
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-px border-8 border-transparent border-r-[#b0b0b0]"></div>
              </div>

              <div className="sm:hidden absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-[#ffffff] border border-gray-300 text-[#374151] text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-64 z-50">
                <div className="text-left">
                  <div className="font-semibold text-black mb-1">
                    Medical Notes Guide:
                  </div>
                  <div className="mb-1">
                    <span className="font-medium text-black">Title:</span>{" "}
                    <span className="text-[#4b5563]">
                      Meaningful label (e.g., "Respiratory Symptoms")
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-black">Description:</span>{" "}
                    <span className="text-[#4b5563]">
                      Brief, clear template
                    </span>
                  </div>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-[#b0b0b0]"></div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-px border-4 border-transparent border-t-[#b0b0b0]"></div>
              </div>
            </div>
          </div>

          <div className="w-32">
            <Button
              label="Add More"
              onClick={addMedicalNote}
              outline={true}
              small={true}
              IconLeft={() => (
                <AiFillPlusSquare className="w-4 h-4 text-navy_blue mr-1" />
              )}
            />
          </div>
        </div>

        <div className="h-48 overflow-y-auto space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4 relative">
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMedicalNote(index)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-[#ef4444] hover:bg-[#fee2e2] active:scale-95 transition-all"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                <FormInput
                  id={`medicalNotes.${index}.title`}
                  register={register}
                  placeholder="Title"
                  errors={flatErrors}
                  required={true}
                />

                <FormInput
                  id={`medicalNotes.${index}.description`}
                  register={register}
                  placeholder="Description"
                  errors={flatErrors}
                  required={true}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t">
        <div className="w-[120px]">
          {defaultValues ? (
            <Button
              label="Cancel"
              onClick={() => {
                setSelectedTemplate(null);
                onSuccess?.();
              }}
              outline={true}
            />
          ) : (
            <Button label="Clear" onClick={() => reset()} outline={true} />
          )}
        </div>
        <div className="w-[150px]">
          <Button
            label={defaultValues ? "Update Template" : "Save Template"}
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
