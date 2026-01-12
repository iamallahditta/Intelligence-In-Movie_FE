import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoCreate, IoTrash, IoShield, IoEye } from "react-icons/io5";
import useRecordings from "../../../hooks/useRecordings";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function ViewTemplate({ onEdit }) {
  const { templateOption, setTemplateOption, setTemplateId, setTemplateName } =
    useRecordings();

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDelete = async (templateId) => {
    try {
      setIsDeleting(true);
      const response = await axios.delete(
        `/v1/api/templates/delete/${templateId}`
      );

      if (response?.data?.success) {
        setData((prevData) =>
          prevData.filter((template) => template.id !== templateId)
        );
        const updatedTemplates = templateOption.filter(
          (template) => template.id !== templateId
        );
        setTemplateOption(updatedTemplates);
        setTemplateId(null);
        setTemplateName("");
        toast.success("Template deleted successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete template");
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get("/v1/api/templates/fetch");
        if (response?.data?.success) {
          setData(response?.data?.data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error(err);
        setIsLoading(false);
        toast.error(err.response?.data?.message || "Failed to fetch templates");
      }
    };

    fetchTemplates();
  }, []);

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="h-[400px] flex flex-col items-center justify-center space-y-2">
          <div className="animate-spin w-10 h-10 border-4 border-navy_blue border-t-transparent rounded-full" />
          <p className="text-lg font-medium text-text_black">Loading…</p>
          <p className="text-sm text-gray">
            Please wait while we process your request
          </p>
        </div>
      ) : data?.length <= 0 ? (
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-center">
            <IoEye className="w-12 h-12 mx-auto mb-4" />
            <p>No templates found</p>
          </div>
        </div>
      ) : (
        <div className="h-[400px] overflow-y-auto space-y-3 pr-2">
          {data?.map((template) => (
            <div key={template?.id} className="border rounded-lg p-4 relative">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{template?.templateName}</h3>

                    {!template?.userId && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <IoShield className="w-3 h-3" />
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm">
                    Created: {formatDate(template?.createdAt)}
                  </p>
                </div>

                {template?.userId && (
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => onEdit?.(template)}
                      className="w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
                      title="Update Template"
                      disabled={isDeleting}
                    >
                      <IoCreate className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(template?.id)}
                      className="w-8 h-8 bg-[#fee2e2] hover:bg-[#fecaca] rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
                      title="Delete Template"
                      disabled={isDeleting}
                    >
                      <IoTrash className="w-4 h-4 text-[#dc2626]" />
                    </button>
                  </div>
                )}
              </div>

              {deleteConfirm === template?.id && (
                <div className="mt-3 p-3 bg-[#fef2f2] border border-[#fecaca] rounded-lg">
                  <p className="text-sm text-[#991b1b] mb-3">
                    <strong>
                      Are you sure you want to delete this template?
                    </strong>{" "}
                    This action cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <button
                      disabled={isDeleting}
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1 text-sm bg-[#e5e7eb] hover:bg-[#d1d5db] text-[#374151] rounded-md transition-colors disabled:opacity-50 w-[85px] text-center"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={isDeleting}
                      onClick={() => handleDelete(template?.id)}
                      className="px-3 py-1 text-sm bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-md transition-colors disabled:opacity-50 w-[85px] text-center"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
