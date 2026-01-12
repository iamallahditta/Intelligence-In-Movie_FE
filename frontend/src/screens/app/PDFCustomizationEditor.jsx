import { AiFillPlusSquare } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import Button from "../../components/Button";
import { useState } from "react";
import toast from "react-hot-toast";

export default function PDFCustomizationEditor({ data, setData }) {
  const [newSectionName, setNewSectionName] = useState("");
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSidebarChange = (section, index, field, value) => {
    const updatedSidebar = { ...data.sidebar };
    updatedSidebar[section][index][field] = value;
    setData({ ...data, sidebar: updatedSidebar });
  };

  const addSidebarSection = () => {
    if (!newSectionName.trim()) {
      toast.error("section name is required");
      return;
    }

    setData({
      ...data,
      sidebar: {
        ...data.sidebar,
        [newSectionName]: [{ label: "", value: "" }],
      },
      IsSideBar: true,
    });

    setNewSectionName(""); // Clear input after adding
  };

  const deleteSidebarSection = (section) => {
    const updatedSidebar = { ...data.sidebar };
    delete updatedSidebar[section];

    const updatedData = {
      ...data,
      sidebar: updatedSidebar,
    };
    if (Object.keys(updatedSidebar).length === 0) {
      updatedData.IsSideBar = false;
    }

    setData(updatedData);
  };

  const addSubSection = (section) => {
    const updatedSidebar = { ...data.sidebar };
    updatedSidebar[section].push({ label: "", value: "" });
    setData({ ...data, sidebar: updatedSidebar });
  };

  const deleteSubSection = (section, index) => {
    const updatedSidebar = { ...data.sidebar };
    updatedSidebar[section].splice(index, 1);
    setData({ ...data, sidebar: updatedSidebar });
  };




  return (
    <div className="mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">PDF Customization Editor</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: "doctorName", placeholder: "Doctor Name" },
          { name: "address", placeholder: "Address" },
          { name: "email", placeholder: "Email" },
          { name: "phone", placeholder: "Phone Number" },
       
          { name: "websiteName", placeholder: "Website Name" },
          {
            name: "websiteDescription",
            placeholder: "Website Description",
          },
          { name: "website", placeholder: "Website URL" },
       
            
        ].map(({ name, placeholder }) => (
          <input
            key={name}
            name={name}
            value={data[name]}
            onChange={handleChange}
            placeholder={placeholder}
            className="border p-2 rounded w-full"
          />
        ))}
      </div>
      <div>
           <textarea
            key={"disclosure"}
            name={"disclosure"}
            value={data.disclosure}
            defaultValue={"Legal disclaimer regarding the nature of the visit and medical assessment."}
            onChange={handleChange}
            placeholder={"Disclosure Notice"}
            className="border p-2 rounded w-full"
          />
              <textarea
            key={"thankYouNote"}
            name={"thankYouNote"}
            value={data.thankYouNote}
            onChange={handleChange}
            defaultValue={"Thank you for allowing me to participate in the care of your patient."}
            placeholder={"Thank You Note"}
            className="border p-2 rounded w-full"
          />

      </div>
      <div className="flex md:items-center gap-3 md:flex-row flex-col">
        <div className="flex  items-center gap-2 ">
          <input
            id="IsRightLogo"
            type="checkbox"
            className="w-4 h-4"
            name="IsRightLogo"
            checked={data.IsRightLogo}
            onChange={(e) =>
              setData({ ...data, [e.target.name]: e.target.checked })
            }
          />
          <label htmlFor="IsRightLogo">Is Right Logo</label>
        </div>
        <div className="flex  items-center gap-2 ">
          <input
            id="IsLeftLogo"
            type="checkbox"
            className="w-4 h-4"
            name="IsLeftLogo"
            checked={data?.IsLeftLogo}
            onChange={(e) =>
              setData({ ...data, [e.target.name]: e.target.checked })
            }
          />
          <label htmlFor="IsLeftLogo">Is Left Logo</label>
        </div>
        <div className="flex  items-center gap-2 ">
          <input
            id="IsFooterLogo"
            type="checkbox"
            className="w-4 h-4"
            name="IsFooterLogo"
            checked={data.IsFooterLogo}
            onChange={(e) =>
              setData({ ...data, [e.target.name]: e.target.checked })
            }
          />
          <label htmlFor="IsRightLogo">Is Footer Logo</label>
        </div>
        <div className="flex  items-center gap-2 ">
          <input
            id="IsSideBar"
            type="checkbox"
            className="w-4 h-4"
            name="IsSideBar"
            checked={data.IsSideBar}
            onChange={(e) =>
              setData({ ...data, [e.target.name]: e.target.checked })
            }
          />
          <label htmlFor="IsSideBar">Is Sidebar</label>
        </div>
      </div>

      <div className="flex justify-between items-center md:flex-row flex-col">
        <h2 className="text-xl font-semibold">Sidebar Sections</h2>

        <div className="max-w-fit flex items-center gap-2 md:flex-row flex-col">
          <input
            type="text"
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            placeholder="New section name"
            className="border border-gray-300 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-navy_blue"
          />
          <Button
            onClick={addSidebarSection}
            outline={true}
            label={"Add Section"}
            IconLeft={() => (
              <AiFillPlusSquare className="text-xl text-navy_blue mr-2" />
            )}
          />
        </div>
      </div>

      {Object.entries(data.sidebar || {}).map(([section, items]) => (
        <div key={section} className="border p-4 rounded space-y-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">{section}</h3>
            <button
              onClick={() => deleteSidebarSection(section)}
              className="text-red-500 flex items-center gap-2"
            >
              <RiDeleteBin6Line /> Section
            </button>
          </div>

          {items.map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                className="border p-1 rounded w-1/2"
                value={item.label}
                onChange={(e) =>
                  handleSidebarChange(section, index, "label", e.target.value)
                }
                placeholder="Label"
              />
              <input
                className="border p-1 rounded w-1/2"
                value={item.value}
                onChange={(e) =>
                  handleSidebarChange(section, index, "value", e.target.value)
                }
                placeholder="Value"
              />
              <button
                className="text-red-500"
                onClick={() => deleteSubSection(section, index)}
              >
                ✕
              </button>
            </div>
          ))}

          <button
            onClick={() => addSubSection(section)}
            className="mt-2 text-sm text-blue-500"
          >
            + Add Sub-section
          </button>
        </div>
      ))}
    </div>
  );
}
