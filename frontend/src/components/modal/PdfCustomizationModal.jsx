import { IoClose } from "react-icons/io5";
import PDFCustomizationEditor from "../../screens/app/PDFCustomizationEditor";
import { useEffect, useRef, useState } from "react";
import Button from "../Button";
import axios from "axios";
import useUser from "../../hooks/auth/useUser";
import toast from "react-hot-toast";
import { Oval } from "react-loader-spinner";
import { HiArrowUpTray, HiPhoto, HiXMark } from "react-icons/hi2";

const IMAGE_FLAG_MAP = {
  leftLogo: "IsLeftLogo",
  rightLogo: "IsRightLogo",
  leftLogoFooter: "IsFooterLogo",
};

const PdfCustomizationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  title = "Delete Recording",
  message = "Are you sure you want to delete this recording? This action cannot be undone.",
}) => {
  const { pdfData, setPdfData } = useUser();
  const [loading, setloading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [uploadingState, setUploadingState] = useState({
    leftLogo: false,
    rightLogo: false,
    leftLogoFooter: false,
  });

  const fileInputRef = useRef({
    leftLogo: null,
    rightLogo: null,
    leftLogoFooter: null,
  });

  // ✅ Save new customization data
  const handleSavePdfJson = async () => {
    if (!validateSidebarSections()) return;
    setSaveLoading(true);
    try {
      await axios.put("/v1/api/auth/customize-pdf", pdfData); // or use PUT
      toast.success("PDF customization saved successfully.");
      onClose();
    } catch (error) {
      console.error("Error saving PDF customization:", error);
    } finally {
      setSaveLoading(false);
    }
  };

  const MAX_FILE_SIZE = 3 * 1024 * 1024;

  const handleImageUpload = async (event, key) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image is too large. Maximum size is 3 MB.");
      return;
    }

    setUploadingState((prev) => ({ ...prev, [key]: true }));

    try {
      if (pdfData?.[key]?.url) {
        const urlParts = pdfData?.[key]?.url?.split("/");
        const fileName = urlParts[urlParts.length - 1];
        await axios.delete(`/v1/api/image/${fileName}`);
      }

      const formData = new FormData();
      formData.append("image", file);

      const uploadResponse = await axios.post(
        "/v1/api/upload-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const { url, id } = uploadResponse.data;
      const flagField = IMAGE_FLAG_MAP[key];
      const updatedData = {
        ...pdfData,
        [key]: { url, id },
        [flagField]: pdfData[flagField] || true,
      };
      setPdfData(updatedData);

      await axios.put("/v1/api/auth/customize-pdf", updatedData);
      toast.success(`Logo updated successfully.`);
    } catch (error) {
      console.error(`Error uploading ${key}:`, error);
      toast.error(`Failed to upload ${key}`);
    } finally {
      setUploadingState((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleImageRemove = async (key) => {
    try {
      if (pdfData?.[key]?.url) {
        const urlParts = pdfData?.[key]?.url?.split("/");
        const fileName = urlParts[urlParts.length - 1];
        await axios.delete(`/v1/api/image/${fileName}`);
      }

      const flagField = IMAGE_FLAG_MAP[key];
      const updatedData = { ...pdfData, [key]: null, [flagField]: false };
      setPdfData(updatedData);

      if (fileInputRef.current[key]) {
        fileInputRef.current[key].value = "";
      }

      await axios.put("/v1/api/auth/customize-pdf", updatedData);
      toast.success(`${key} removed successfully.`);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      toast.error(`Failed to remove ${key}`);
    }
  };

  const validateSidebarSections = () => {
    const sidebar = pdfData?.sidebar;

    if (!sidebar || Object.keys(sidebar).length === 0) {
      return true; // No sidebar — valid
    }

    for (const [section, items] of Object.entries(sidebar)) {
      const isValid = items.some(
        (item) => item.label.trim() !== "" && item.value.trim() !== ""
      );

      if (!isValid) {
        toast.error(
          `Section "${section}" must have at least one label and value.`
        );
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    setloading(true);
    const fetchPdfCustomization = async () => {
      try {
        const response = await axios.get("/v1/api/auth/customize-pdf");
        const output = response.data.data;
        setPdfData(output);
        setloading(false);
      } catch (error) {
        setloading(false);
        console.error("Error fetching PDF customization:", error);
      }
    };

    if (isOpen) {
      fetchPdfCustomization();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const LogoPlaceholder = () => (
    <div className="w-full h-full bg-[#f9fafb] border-2 border-[#d1d5db] rounded-lg flex flex-col items-center justify-center">
      <HiPhoto className="w-8 h-8 text-[#9ca3af] mb-2" />
      <span className="text-xs text-[#6b7280] text-center px-2">
        Upload Logo
      </span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden transform rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-100"
        >
          <IoClose className="h-5 w-5 text-gray-500" />
        </button>

        <div className="mt-6 h-[75vh] overflow-y-auto pr-2">
          {loading ? (
            <div className="p-4 flex items-center justify-center h-full">
              <Oval
                visible={true}
                height="24"
                width="24"
                color="#002366"
                secondaryColor="#fff"
                ariaLabel="oval-loading"
              />
            </div>
          ) : (
            <div>
              <div className="bg-[#f3f4f6] rounded-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-8 mx-6">
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-[#e5e7eb] bg-white shadow-sm hover:shadow-md transition-shadow">
                      {pdfData?.leftLogo?.url ? (
                        <>
                          <img
                            className="w-full h-full object-contain p-2"
                            src={pdfData.leftLogo.url || "/placeholder.svg"}
                            alt="Left Logo"
                          />
                          <button
                            onClick={() => handleImageRemove("leftLogo")}
                            className="absolute -top-2 -right-2 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-full p-1 shadow-md transition-colors"
                            title="Remove logo"
                          >
                            <HiXMark className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <LogoPlaceholder />
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-[#374151] mb-2">
                      Header Left Logo
                    </p>
                    <input
                      type="file"
                      ref={(el) => (fileInputRef.current.leftLogo = el)}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "leftLogo")}
                    />
                    <div className="w-[140px]">
                      <Button
                        label="Upload Logo"
                        IconLeft={() => <HiArrowUpTray />}
                        onClick={() => fileInputRef?.current?.leftLogo?.click()}
                        disabled={uploadingState.leftLogo}
                        outline={true}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-3">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-[#e5e7eb] bg-white shadow-sm hover:shadow-md transition-shadow">
                      {pdfData?.rightLogo?.url ? (
                        <>
                          <img
                            className="w-full h-full object-contain p-2"
                            src={pdfData.rightLogo.url || "/placeholder.svg"}
                            alt="Right Logo"
                          />
                          <button
                            onClick={() => handleImageRemove("rightLogo")}
                            className="absolute -top-2 -right-2 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-full p-1 shadow-md transition-colors"
                            title="Remove logo"
                          >
                            <HiXMark className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <LogoPlaceholder />
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-[#374151] mb-2">
                      Header Right Logo
                    </p>
                    <input
                      type="file"
                      ref={(el) => (fileInputRef.current.rightLogo = el)}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "rightLogo")}
                    />
                    <div className="w-[140px]">
                      <Button
                        label="Upload Logo"
                        IconLeft={() => <HiArrowUpTray />}
                        onClick={() =>
                          fileInputRef?.current?.rightLogo?.click()
                        }
                        disabled={uploadingState.rightLogo}
                        outline={true}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-3">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-[#e5e7eb] bg-white shadow-sm hover:shadow-md transition-shadow">
                      {pdfData?.leftLogoFooter?.url ? (
                        <>
                          <img
                            className="w-full h-full object-contain p-2"
                            src={
                              pdfData.leftLogoFooter.url || "/placeholder.svg"
                            }
                            alt="Footer Logo"
                          />
                          <button
                            onClick={() => handleImageRemove("leftLogoFooter")}
                            className="absolute -top-2 -right-2 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-full p-1 shadow-md transition-colors"
                            title="Remove logo"
                          >
                            <HiXMark className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <LogoPlaceholder />
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-[#374151] mb-2">
                      Footer Logo
                    </p>
                    <input
                      type="file"
                      ref={(el) => (fileInputRef.current.leftLogoFooter = el)}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "leftLogoFooter")}
                    />
                    <div className="w-[140px]">
                      <Button
                        label="Upload Logo"
                        IconLeft={() => <HiArrowUpTray />}
                        onClick={() =>
                          fileInputRef.current.leftLogoFooter?.click()
                        }
                        disabled={uploadingState.leftLogoFooter}
                        outline={true}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full">
                <PDFCustomizationEditor data={pdfData} setData={setPdfData} />
              </div>

              <div className="flex items-center justify-end w-full">
                <div className="w-[100px] my-3">
                  <Button
                    onClick={handleSavePdfJson}
                    outline={true}
                    label="Save"
                    disabled={saveLoading}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfCustomizationModal;
