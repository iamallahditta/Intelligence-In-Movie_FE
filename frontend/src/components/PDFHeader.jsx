// const PDFHeader = ({ doctorName = 'Unknown',websiteName="Abc",websiteDescription="xyz" }) => {
//   return (
//     <div
//       style={{
//         backgroundColor: '#004757',
//         color: '#000000',
//         padding: '30px 20px',
//         textAlign: 'center',
//         marginBottom: '30px',
//         pageBreakAfter: 'avoid',
//       }}
//     >
//       <h1 style={{ fontSize: '28px', margin: '0 0 20px 0' }}>
//         {websiteName}
//       </h1>
//       <p
//         style={{
//           fontSize: '14px',
//           margin: '0 0 20px 0',
//           fontStyle: 'italic',
//         }}
//       >
//        {websiteDescription}
//       </p>
//       <h3 style={{ fontSize: '20px', margin: '20px 0' }}>
//         Examined by: Dr. {doctorName}
//       </h3>
//     </div>
//   );
// };

// export default PDFHeader;

const PDFHeader = ({
  doctorName = "Unknown",
  websiteName = "Abc",
  websiteDescription = "xyz",
  leftLogo,
  rightLogo,
}) => {
  console.log("doctorName are : ",doctorName)
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        color: "black",
        padding: "30px 20px",
        marginBottom: "30px",
        pageBreakAfter: "avoid",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        {leftLogo && (
          <img
            src={leftLogo}
            alt="Left Logo"
            style={{ height: "100px", objectFit: "contain", width:"200px" }}
          />
        )}
        <div style={{ textAlign: "center", flex: 1 }}>
          <h1 style={{ fontSize: "28px", margin: "0 0 10px 0", color:"#0000000"}}>
            {websiteName}
          </h1>
          <p
            style={{
              fontSize: "14px",
              margin: "0",
              fontStyle: "italic",
              margin:"auto",
              maxWidth:"500px"
            }}
          >
            {websiteDescription}
          </p>
        </div>
        {rightLogo && (
          <img
            src={rightLogo}
            alt="Right Logo"
           style={{ height: "100px", objectFit: "contain", width:"200px" }}
          />
        )}
      </div>
      <h3 style={{ fontSize: "20px", textAlign: "center", margin: "0",color:"#000000" }}>
        Examined by: Dr. {doctorName}
      </h3>
    </div>
  );
};

export default PDFHeader;
