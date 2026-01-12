import { Upload } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function FileUpload({
  accept = "audio/*", // Accept types, default is audio
  label = "Drag & drop your file here",
  heading = "Upload File",
  subLabel = "or click to browse",
  buttonText = "Upload File",
  iconColor = "#0057FF",
  uploading = false,
  statusMessage = "",
  onFileSelect, // Callback to handle file selection
}) {
  const [dragActive, setDragActive] = useState(false);
   const { t } = useTranslation();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      console.log("file", file);
      // if (!file.type.match(accept.replace("*", ".*"))) {
      //   toast.error("Invalid file type selected.");
      //   return;
      // }
      const event = { target: { files: [file] } };
      onFileSelect(event);
    }
  };

  const triggerFileInput = () =>
    document.getElementById("custom-upload").click();

  return (
    <div className="flex flex-col items-center gap-7">
      {!uploading && <h2 className="text-[28px] font-semibold">{heading}</h2>}
      {!uploading && (
        <div
          className={`border-2 border-dashed px-20 ${
            dragActive ? "border-blue-700 bg-blue-50" : "border-navy_blue"
          } rounded-2xl  h-60 flex flex-col items-center justify-center text-center cursor-pointer transition`}
          onClick={triggerFileInput}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <img
            src="/assets/clouldUpload.svg"
            alt="upload"
            width={60}
            height={60}
          />
          <p className="font-medium text-lg mt-3">{label}</p>
          <p className="text-sm text-[#696969] mt-1">{subLabel}</p>
        </div>
      )}

      <input
        type="file"
        accept={accept}
        id="custom-upload"
        onChange={onFileSelect}
        className="hidden"
      />

      {!uploading ? (
        <button
          onClick={triggerFileInput}
          className="flex items-center gap-2 px-6 py-2 bg-navy_blue text-white rounded-lg hover:bg-hover_effect transition-transform active:scale-95 shadow-[0_12px_20px_0_#0057FF14]"
        >
          <Upload size={18} />
          {buttonText}
        </button>
      ) : (
        <div className="mt-4 text-gray-600">⏳ {t("please_wait")}</div>
      )}

      <h1
        className={`font-light text-gray-700 transition-opacity duration-300 ${
          statusMessage ? "opacity-100" : "opacity-0"
        }`}
      >
        {statusMessage}
      </h1>
    </div>
  );
}
