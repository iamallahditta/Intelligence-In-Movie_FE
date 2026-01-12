import { useEffect, useCallback, useState } from "react";
import { IoClose, IoAdd, IoEye, IoSyncOutline } from "react-icons/io5";
import AddTemplate from "./AddTemplate";
import ViewTemplate from "./ViewTemplate";

export default function TemplateModal({ isModal, setIsModal }) {
  const [animate, setAnimate] = useState(false);
  const [activeTab, setActiveTab] = useState("add");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    if (isModal) {
      const timer = setTimeout(() => setAnimate(true), 10);
      return () => clearTimeout(timer);
    }

    setAnimate(false);
  }, [isModal]);

  const closeHandler = useCallback(() => {
    setAnimate(false);
    setActiveTab("add");
    setSelectedTemplate(null);
    setTimeout(() => setIsModal(false), 300);
  }, [setIsModal]);

  if (!isModal) return null;

  return (
    <div className="fixed inset-0 bg-neutral-800/70 flex items-center justify-center z-[100]">
      <div
        className={`
          w-full max-w-2xl h-[575px] mx-2 bg-white rounded-lg shadow-lg overflow-hidden
          transform transition-all duration-300 ease-in-out
          ${
            animate ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }
        `}
      >
        <button
          onClick={closeHandler}
          className="absolute top-4 right-4 w-8 h-8 bg-light_blue rounded-full flex items-center justify-center hover:opacity-80 transition"
        >
          <IoClose className="w-6 h-6" />
        </button>

        <div className="p-7">
          <h1 className="text-2xl font-bold mb-4">Template Management</h1>

          <div className="relative mb-4">
            <div className="flex border-b">
              <TabButton
                id="add"
                label={selectedTemplate ? "Update Template" : "Add Template"}
                icon={selectedTemplate ? IoSyncOutline : IoAdd}
                isActive={activeTab === "add"}
                onClick={setActiveTab}
              />
              <TabButton
                id="view"
                label="View Templates"
                icon={IoEye}
                isActive={activeTab === "view"}
                onClick={setActiveTab}
              />
            </div>
          </div>

          <div>
            {activeTab === "add" && (
              <AddTemplate
                onSuccess={() => setActiveTab("view")}
                defaultValues={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
              />
            )}
            {activeTab === "view" && (
              <ViewTemplate
                onEdit={(template) => {
                  setSelectedTemplate(template);
                  setActiveTab("add");
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`
      flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2.5 font-medium relative
      border-b-2 -mb-px text-sm sm:text-base
      transition-all duration-300 ease-in-out
      ${
        isActive
          ? "text-navy_blue border-navy_blue bg-light_blue"
          : "border-transparent"
      }
    `}
  >
    <Icon className="w-4 h-4 flex-shrink-0" />
    <span className="whitespace-nowrap">{label}</span>
  </button>
);
