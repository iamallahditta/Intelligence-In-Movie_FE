

import moment from "moment";

const PDFFooter = ({
  websiteName = "",
  address = "",
  phone = "",
  email = "",
  website = "",
  date = new Date().toLocaleDateString(),
  leftLogoFooter,
}) => {
  const updateddate = moment(date).format("MMMM Do, YYYY, h:mm A");
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        fontSize: "10px",
        color: "#333",
        width: "100%",
        padding: "10px 20px",
        borderTop: "1px solid #ddd",
        textAlign: "center",
        display: "flex",
      }}
    >
      <div>
        {leftLogoFooter && (
          <img
            src={leftLogoFooter}
            alt="Left Logo"
            style={{ height: "50px", objectFit: "contain" }}
          />
        )}
      </div>

      <div style={{ margin: "auto", width: "100%" }}>
        <div style={{ fontWeight: "bold", marginBottom: "5px" ,color: "#000000"}}>
          {websiteName}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            flexWrap: "wrap",
            fontSize: "9px",
          }}
        >
          <div style={{ color: "#000000", textDecoration: "none" }}>{address}</div>
          <div>
            Phone: <strong  style={{ color: "#000000", textDecoration: "none" }}>{phone}</strong>
          </div>
          <div>
            Email:{"support@vocalli.ai"}
            <a
              href={`mailto:${email}`}
              style={{ color: "#000000", textDecoration: "none" }}
            >
              {email}
            </a>
          </div>
          <div>
            Website:{"https://vocalli.ai"}
            <a
              href={`https://${website}`}
              style={{ color: "#000000", textDecoration: "none" }}
            >
              {website}
            </a>
          </div>
        </div>
        <div
          style={{
            marginTop: "5px",
            fontSize: "8px",
            color: "#666",
          }}
        >
          &copy; {new Date().getFullYear()} {websiteName}. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default PDFFooter;
