const PdfSidebar = ({
  pdfSidebarStyle,
  sidebarData
}) => {
  return (
    <div style={pdfSidebarStyle}>
      {sidebarData &&
        Object.entries(sidebarData).map(([sectionTitle, items], index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <h2 style={{ color: '#0BBBA1', fontSize: '14px', marginBottom: '10px', fontWeight:"bold" }}>
              {sectionTitle}
            </h2>
            {items.map((item, idx) => (
              <p key={idx} style={{ margin: 0, paddingBottom: '4px' ,fontSize:"11px" }}>
                <strong>{item.label}:</strong> {item.value}
              </p>
            ))}
          </div>
        ))}
    </div>
  );
};

export default PdfSidebar;
