// const PdfSidebar = ({
//   patientName = 'John Doe',
//   age = '30',
//   gender = 'Male',
//   appointmentDate = '2025-06-19',
//   contactInfo = 'john@example.com',
//   pdfSidebarStyle
// }) => {
//   return (
//     <div
//       style={pdfSidebarStyle}
//     >
//       <h2 style={{ color: '#004757', fontSize: '18px', marginBottom: '10px' }}>
//         Patient Info
//       </h2>
//       <p><strong>Name:</strong> {patientName}</p>
//       <p><strong>Age:</strong> {age}</p>
//       <p><strong>Gender:</strong> {gender}</p>
//       <p><strong>Appointment:</strong> {appointmentDate}</p>
//       <p><strong>Contact:</strong> {contactInfo}</p>
//     </div>
//   );
// };

// export default PdfSidebar;

const {useSidebarManager} = require("../hooks/useSidebarManager");

const PdfSidebar = () => {
  const { sidebar, addSection, removeSection, upsertItem, removeItem } =
    useSidebarManager({
      "Patient Info": [
        { label: "Patient Name", value: "John Doe" },
        { label: "Age", value: "30" },
        { label: "Gender", value: "Male" },
      ],
      "Appointment Info": [{ label: "Appointment Date", value: "2025-06-19" }],
    });

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Sidebar Editor</h2>

      <button
        className="bg-green-600 text-white px-4 py-1 rounded mb-4"
        onClick={() => addSection("New Section")}
      >
        + Add Section
      </button>

      {Object.entries(sidebar).map(([section, items]) => (
        <div key={section} className="border p-3 mb-4 rounded shadow">
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold">{section}</h3>
            <button
              className="text-red-500 text-sm"
              onClick={() => removeSection(section)}
            >
              Remove Section
            </button>
          </div>

          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between mb-1 text-sm">
              <span>
                {item.label}: {item.value}
              </span>
              <button
                className="text-red-400"
                onClick={() => removeItem(section, item.label)}
              >
                x
              </button>
            </div>
          ))}

          <button
            className="text-blue-600 text-sm mt-2"
            onClick={() =>
              upsertItem(section, {
                label: `New Label ${items.length + 1}`,
                value: "New Value",
              })
            }
          >
            + Add Item
          </button>
        </div>
      ))}

      <pre className="mt-6 bg-gray-100 p-4 text-sm rounded">
        {JSON.stringify(sidebar, null, 2)}
      </pre>
    </div>
  );
};

export default PdfSidebar;
