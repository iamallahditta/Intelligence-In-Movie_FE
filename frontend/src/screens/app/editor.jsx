import {
  CharacterMetadata,
  ContentBlock,
  ContentState,
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import { List, OrderedSet, Repeat } from "immutable";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { FaFilePdf } from "react-icons/fa6";
import { TbFileTypeDocx } from "react-icons/tb";

import {
  FaBold,
  FaCaretDown,
  FaCaretUp,
  FaItalic,
  FaListOl,
  FaListUl,
  FaUnderline,
} from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useLocation } from "react-router-dom";
import PDFHeader from "../../components/PDFHeader";
import useUser from "../../hooks/auth/useUser";
import PdfSidebar from "../../components/PdfSidebar";
import PDFFooter from "../../components/PDFFooter";
import { useTranslation } from "react-i18next";
import PdfCustomizationModal from "../../components/modal/PdfCustomizationModal";
import Button from "../../components/Button";
import axios from "axios";

const EditorPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const activeRecording = location.state?.activeRecording;
  const [isPreviewPdf, SetIsPreviewPdf] = useState(true);
  const { user, pdfData, setPdfData } = useUser();
  console.log("user are : ",user)

  console.log("pdfdd",pdfData)

  const [showPdfCustomizationModal, setshowPdfCustomizationModal] =
    useState(false);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const fontSizeRef = useRef(null);
  const colorPickerRef = useRef(null);
  const [fontSize, setFontSize] = useState(16);

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const toggleInlineStyle = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (blockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  // Function to check if a style is currently active
  const isStyleActive = (style) => {
    const currentStyle = editorState.getCurrentInlineStyle();
    return currentStyle.has(style);
  };

  const isBlockActive = (blockType) => {
    const selection = editorState.getSelection();
    const blockKey = selection.getStartKey();
    const block = editorState.getCurrentContent().getBlockForKey(blockKey);
    return block.getType() === blockType;
  };

  // useEffect(() => {
  //   if (activeRecording) {
  //     const contentState = convertToDraftContent(activeRecording);
  //     setEditorState(EditorState.createWithContent(contentState));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [activeRecording]);

  useEffect(() => {
  if (pdfData && activeRecording) {
    const contentState = convertToDraftContent(activeRecording);
    setEditorState(EditorState.createWithContent(contentState));
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [pdfData]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fontSizeRef.current && !fontSizeRef.current.contains(event.target)) {
        setShowFontSize(false);
      }
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target)
      ) {
        setShowColors(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const convertToDraftContent = (recording) => {
    console.log(recording);
    const blocks = [];
    const generateKey = () => Math.random().toString(36).substring(2, 15);

    // Add Visit Note header
    blocks.push(
      new ContentBlock({
        key: generateKey(),
        type: "header-one",
        text: "Visit Notes",
        characterList: List(
          Repeat(
            CharacterMetadata.create({
              style: OrderedSet.of("BOLD", "FONT_SIZE_24","COLOR_BLACK"),
            }),
            "Visit Notes".length
          )
        ),
      })
    );

    // Add empty block for spacing
    blocks.push(
      new ContentBlock({
        key: generateKey(),
        type: "unstyled",
        text: "",
      })
    );

    blocks.push(
      new ContentBlock({
        key: generateKey(),
        type: "header-one",
        text: "Patient Info",
        characterList: List(
          Repeat(
            CharacterMetadata.create({
              style: OrderedSet.of("BOLD", "FONT_SIZE_18", "COLOR_BLACK"),
            }),
            "Patient Info".length
          )
        ),
      })
    );

    // Format patient name and required fields
    const patientName = `Patient Name: ${
      recording?.patient?.firstName || "d"
    }, ${recording?.patient?.lastName}`;
    const dob = `Date of Birth: ${new Date(
      recording?.patient?.dateOfBirth
    ).toLocaleDateString("en-US")}`;
    const visitDate = `Visit Date: ${moment(recording?.createdAt).format(
      "MM/DD/YYYY"
    )}`;

    // Add required fields
    [patientName, dob, visitDate].forEach((text) => {
      const colonIndex = text.indexOf(":") + 1;
      blocks.push(
        new ContentBlock({
          key: generateKey(),
          type: "unstyled",
          text: text,
          characterList: List(
            Repeat(
              CharacterMetadata.create({
                style: OrderedSet.of("BOLD", "FONT_SIZE_14"),
              }),
              colonIndex
            ).concat(
              Repeat(
                CharacterMetadata.create({
                  style: OrderedSet.of("COLOR_GRAY"),
                }),
                text.length - colonIndex
              )
            )
          ),
        })
      );
    });

    // Add empty block for spacing
    blocks.push(
      new ContentBlock({
        key: generateKey(),
        type: "unstyled",
        text: "",
      })
    );

    // Add patient info header with bold and blue color

    

    // Add empty block for spacing
    blocks.push(
      new ContentBlock({
        key: generateKey(),
        type: "unstyled",
        text: "",
      })
    );

    // Add Visit Notes section
    if (recording.visitNotes && recording.visitNotes.length > 0) {
      recording.visitNotes
        .filter((note) => {
          if (
            !note.title.includes("Telehealth") &&
            !note.title.includes("Disclosure")
          ) {
            return note;
          }
        })
        .forEach((note) => {
          // Add note title
          blocks.push(
            new ContentBlock({
              key: generateKey(),
              type: "header-two",
              text: note.title,
              characterList: List(
                Repeat(
                  CharacterMetadata.create({
                    style: OrderedSet.of("BOLD", "FONT_SIZE_16","COLOR_BLACK"),
                    
                  }),
                  note.title.length
                )
              ),
            })
          );

          // Add note description
          if (note.description) {
            blocks.push(
              new ContentBlock({
                key: generateKey(),
                type: "unstyled",
                text: note.description !== "false" ? note.description : "",
                characterList: List(
                  Repeat(
                    CharacterMetadata.create({
                      style: OrderedSet.of("COLOR_GRAY"),
                    }),
                    note.description.length
                  )
                ),
              })
            );
          }

          // Add others if they exist
          if (note.others && note.others.length > 0) {
            note.others.forEach((other) => {
              const text = `${other.title}: ${
                other.description !== "false" ? other.description : ""
              }`;
              const keyLength = other.title.length + 1;

              blocks.push(
                new ContentBlock({
                  key: generateKey(),
                  type: "unstyled",
                  text: text,
                  characterList: List(
                    Repeat(
                      CharacterMetadata.create({
                        style: OrderedSet.of("BOLD", "FONT_SIZE_14"),
                      }),
                      keyLength
                    ).concat(
                      Repeat(
                        CharacterMetadata.create({
                          style: OrderedSet.of("COLOR_GRAY"),
                        }),
                        text.length - keyLength
                      )
                    )
                  ),
                })
              );
            });
          }

          // Add empty block for spacing between notes
          blocks.push(
            new ContentBlock({
              key: generateKey(),
              type: "unstyled",
              text: "",
            })
          );
          blocks.push(
            new ContentBlock({
              key: generateKey(),
              type: "unstyled",
              text: "",
            })
          );
        });
    }

    // Add empty block for spacing
    blocks.push(
      new ContentBlock({
        key: generateKey(),
        type: "unstyled",
        text: "",
      })
    );

    // Add hardcoded disclosure notice
    blocks.push(
      new ContentBlock({
        key: generateKey(),
        type: "unstyled",
        text: `${t("disclosure_notice")}:`,
        characterList: List(
          Repeat(
            CharacterMetadata.create({
              style: OrderedSet.of("BOLD", "FONT_SIZE_14"),
            }),
            `${"disclosure_notice"}:`.length
          )
        ),
      })
    );

    // Get disclosure text with proper fallback
    const disclosureText = (pdfData?.disclosure && typeof pdfData.disclosure === 'string' && pdfData.disclosure.trim() !== "") 
      ? pdfData.disclosure 
      : t("legal_disclaimer");
    
    blocks.push(
      new ContentBlock({
        key: generateKey(),
        type: "unstyled",
        // text: t("legal_disclaimer"),
        text: disclosureText,
        characterList: List(
          Repeat(
            CharacterMetadata.create({
              style: OrderedSet.of("ITALIC", "COLOR_GRAY"),
            }),
            disclosureText.length
          )
        ),
      })
    );

    // Add empty blocks for spacing before closing section
    blocks.push(
      new ContentBlock({
        key: generateKey(),
        type: "unstyled",
        text: "",
      })
    );
    blocks.push(
      new ContentBlock({
        key: generateKey(),
        type: "unstyled",
        text: "",
      })
    );

    // Add "Thank You Note:" header
    blocks.push(
      new ContentBlock({
        key: generateKey(),
        type: "unstyled",
        text: `${t("thank_you_note")}:`,
        characterList: List(
          Repeat(
            CharacterMetadata.create({
              style: OrderedSet.of("BOLD", "FONT_SIZE_14"),
            }),
            `${t("thank_you_note")}:`.length
          )
        ),
      })
    );

    // Add thank you message in italics
    // Get thank you note text with proper fallback
    const thankYouNoteText = (pdfData?.thankYouNote && typeof pdfData.thankYouNote === 'string' && pdfData.thankYouNote.trim() !== "") 
      ? pdfData.thankYouNote 
      : t("thank_you_participation");
    
    blocks.push(
      new ContentBlock({
        key: generateKey(),
        type: "unstyled",
        // text: t("thank_you_participation"),
        text: thankYouNoteText,
        characterList: List(
          Repeat(
            CharacterMetadata.create({
              style: OrderedSet.of("ITALIC", "FONT_SIZE_14", "COLOR_GRAY"),
            }),
            thankYouNoteText.length
          )
        ),
      })
    );

    // Add empty block for spacing
    blocks.push(
      new ContentBlock({
        key: generateKey(),
        type: "unstyled",
        text: "",
      })
    );

    // Add empty block for spacing
    blocks.push(
      new ContentBlock({
        key: generateKey(),
        type: "unstyled",
        text: "",
      })
    );

    // Add empty block for spacing
    blocks.push(
      new ContentBlock({
        key: generateKey(),
        type: "unstyled",
        text: "",
      })
    );

    // Add Sincerely
    blocks.push(
      new ContentBlock({
        key: generateKey(),
        type: "unstyled",
        text: "Sincerely,",
        characterList: List(
          Repeat(
            CharacterMetadata.create({
              style: OrderedSet.of("FONT_SIZE_14"),
            }),
            "Sincerely,".length
          )
        ),
      })
    );

    // Add Doctor's name and credentials
    blocks.push(
      new ContentBlock({
        key: generateKey(),
        type: "unstyled",
        text: `Dr. ${user?.username}`,
        characterList: List(
          Repeat(
            CharacterMetadata.create({
              style: OrderedSet.of("BOLD", "FONT_SIZE_16"),
            }),
            `Dr. ${user?.username}`.length
          )
        ),
      })
    );

    // Add empty block for spacing
    blocks.push(
      new ContentBlock({
        key: generateKey(),
        type: "unstyled",
        text: "",
      })
    );

    return ContentState.createFromBlockArray(blocks);
  };

  // Add custom style map for font sizes and colors
  const styleMap = {
    ...Object.fromEntries(
      Array.from({ length: 100 }, (_, i) => [
        `FONT_SIZE_${i + 1}`,
        { fontSize: `${i + 1}px` },
      ])
    ),
    COLOR_RED: { color: "#ff0000" },
    COLOR_PRIMARY: { color: "#000000" },
    COLOR_GREEN: { color: "#00ff00" },
    COLOR_ORANGE: { color: "#ffa500" },
    COLOR_BLACK: { color: "#000000" },
    COLOR_GRAY: { color: "#666666" },
    FONT_SIZE_18: { fontSize: "18px" },
    FONT_SIZE_24: { fontSize: "24px" },
  };

  // Add dropdown state
  const [showFontSize, setShowFontSize] = useState(false);
  const [showColors, setShowColors] = useState(false);

  const handleFontSizeChange = (increment) => {
    const newSize = fontSize + increment;
    setFontSize(newSize);
    toggleInlineStyle(`FONT_SIZE_${newSize}`);
  };

  // Add blockStyleFn to handle block styling
  const blockStyleFn = (contentBlock) => {
    const type = contentBlock.getType();
    if (type === "unordered-list-item") {
      return "list-disc ml-4";
    }
    if (type === "ordered-list-item") {
      return "list-decimal ml-4";
    }
  };

  // Get doctor name with proper fallback - only use user.username if user is a valid object
  // user can be "loading" (string), null, or user object
  const doctorName = useMemo(() => {
    // First priority: user.username if user is a valid object with username
    if (user && typeof user === 'object' && user?.username) {
      return user.username;
    }
    // Second priority: pdfData.doctorName if it exists and is not empty
    if (pdfData?.doctorName && typeof pdfData.doctorName === 'string' && pdfData.doctorName.trim() !== "") {
      return pdfData.doctorName;
    }
    // Last resort: "Unknown" - but this should only happen if user is null (not loading)
    return "Unknown";
  }, [user, pdfData?.doctorName]);

  const headerHTML = useMemo(() => {
    // Only calculate if we have the necessary data
    if (!pdfData || Object.keys(pdfData).length === 0) {
      return "";
    }
    return ReactDOMServer.renderToStaticMarkup(
      <PDFHeader
        doctorName={doctorName}
        websiteName={pdfData?.websiteName || ""}
        websiteDescription={pdfData?.websiteDescription || ""}
        leftLogo={pdfData?.IsLeftLogo ? pdfData?.leftLogo?.url : ""}
        rightLogo={pdfData?.IsRightLogo ? pdfData?.rightLogo?.url : ""}
      />
    );
  }, [doctorName, pdfData]);

  const footerHtml = ReactDOMServer.renderToStaticMarkup(
    <PDFFooter
      leftLogoFooter={pdfData?.IsFooterLogo ? pdfData?.leftLogoFooter?.url : ""}
      address={pdfData.address}
      date={pdfData?.date}
      email={pdfData.email}
      phone={pdfData.phone}
      website={pdfData.website}
      websiteName={pdfData.websiteName}
    />
  );

  const sidebarHtml = ReactDOMServer.renderToStaticMarkup(
    pdfData?.IsSideBar ? <PdfSidebar sidebarData={pdfData.sidebar} /> : ""
  );

  const [isExporting, setIsExporting] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);

  const handleExport = async (format) => {
    if (!pdfData) {
      console.warn("pdfData not available yet");
      return;
    }

    const footerData = {
      websiteName: pdfData?.websiteName,
      address: pdfData?.address,
      phone: pdfData?.phone,
      email: pdfData?.email,
      website: pdfData?.website,
      footerImageUrl: pdfData?.IsFooterLogo
        ? pdfData?.leftLogoFooter?.url
        : "",
    };

    console.log("Footer Data for PDF:", footerData);

    SetIsPreviewPdf(false);
    if (format === "pdf") {
      setIsExporting(true);
    } else {
      // toast.error("Currently not support Docx")
      setIsExportingDocx(true);
    }
    const htmlContent = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );

    console.log(pdfData);

    // Create signature HTML for both PDF and DOCX
    const signatureHtml = user?.signature
      ? `
        <div class="signature">
          <img src="${user.signature}" alt="Doctor's Signature" />
          <div class="signature-line"></div>
          <div style="font-size: 13px; color: #666;">Doctor's Signature</div>
        </div>
      `
      : "";

    // Create full content for DOCX (includes signature)
    const docxContent = `
      ${htmlContent.replace(
        /<h([1-6])>/g,
        '<h$1 style="page-break-after: avoid;">'
      )}
      ${signatureHtml}
    `;

    const fullContent = `
<html>
<head>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      font-family: 'Arial', sans-serif;
      font-size: 14px;
      color: #333;
      line-height: 1.6;
    }

    .page {
      // padding: 40px 30px;
      box-sizing: border-box;
      page-break-after: auto;
       width: 794px;
    }

    .img{
    width:200px;
    height:100px;
    }
    .layout {
      display: flex;
      flex-direction: row;
      gap: 30px;
    }

    .sidebar {
      width: 180px !important;
      background-color: #E0F7F4 !important;
      padding: 10px !important;
      border-right: 3px solid #000000 !important;
      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05) !important;
      font-size: 12px !important;
      color: #444 !important;
    }

    .sidebar h4 {
      margin-top: 0;
      font-size: 16px;
      color: #000000;
      border-bottom: 1px solid #ddd;
      padding-bottom: 6px;
      margin-bottom: 10px;
    }

    .content {
      flex: 1;
      padding-right: 10px;
    }

    h1 {
      font-size: 18px;
      color: #000000;
      margin: 25px 0 15px 0;
    }

    h2 {
      font-size: 16px;
      color: #000000;
      margin: 20px 0 12px 0;
    }

    h3 {
      font-size: 15px;
      color: #000000;
      margin: 18px 0 10px 0;
    }

    h4, h5, h6 {
      font-size: 14px;
      color: #000000;
      margin: 16px 0 8px 0;
    }

    p {
      margin: 10px 0;
    }

    .signature {
      margin-top: 50px;
      text-align: left;
      page-break-inside: avoid;
    }

    .signature img {
      max-width: 180px;
      height: auto;
    }

    .signature-line {
      border-top: 1px solid #000;
      width: 200px;
      margin: 15px 0;
    }

    .divider {
      border: none;
      border-top: 2px solid #000000;
      margin: 30px 0;
    }
  </style>
</head>
<body>
  <div class="page">
    ${headerHTML}

    <hr class="divider" />

    <div class="layout">
     ${pdfData?.IsSideBar ? `<div class="sidebar">${sidebarHtml}</div>` : ""}

      <div class="content">
        ${htmlContent.replace(
          /<h([1-6])>/g,
          '<h$1 style="page-break-after: avoid;">'
        )}

        ${signatureHtml}
      </div>
    </div>
  </div>
</body>
</html>
`;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/generate-pdf`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            html: fullContent,
            footerHtml,
            format,
            pdfData,
            docContent: docxContent, // Include signature in DOCX content
            footerData,
            signatureImage: user?.signature || null, // Send signature URL separately for backend
            doctorName: doctorName, // Send doctor name for "Examined by:" in DOCX
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = format === "pdf" ? `${activeRecording?.patient?.firstName}.pdf` : `${activeRecording?.patient?.firstName}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setIsExporting(false);
      setIsExportingDocx(false);
      SetIsPreviewPdf(true);
    } catch (error) {
      setIsExporting(false);
      setIsExportingDocx(false);
      console.error("Error exporting PDF:", error);
    }
  };

  useEffect(() => {
    const fetchPdfCustomization = async () => {
      try {
        const response = await axios.get("/v1/api/auth/customize-pdf");
        const output = response.data.data;
        setPdfData(output);
      } catch (error) {
        console.error("Error fetching PDF customization:", error);
      }
    };
    fetchPdfCustomization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full flex flex-col h-full overflow-y-scroll  mx-auto p-6 relative">
      <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-10 w-12 h-12 cursor-pointer flex items-center justify-center bg-navy_blue text-white rounded-full z-10 shadow-lg">
        <button
          onClick={() => {
            handleExport("pdf");
          }}
          disabled={isExporting}
          className="export-button"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          {isExporting ? (
            <>
              <ThreeDots
                height="20"
                width="20"
                radius="9"
                color="#ffffff"
                ariaLabel="loading"
                visible={true}
              />
            </>
          ) : (
            <FaFilePdf className="text-white text-2xl" />
          )}
        </button>
      </div>
      <div className="fixed bottom-6 sm:bottom-10 right-4 sm:right-10 w-12 h-12 cursor-pointer flex items-center justify-center bg-navy_blue text-white rounded-full z-10 shadow-lg">
        <button
          onClick={() => {
            handleExport("docx");
          }}
          disabled={isExportingDocx}
          className="export-button"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          {isExportingDocx ? (
            <>
              <ThreeDots
                height="20"
                width="20"
                radius="9"
                color="#ffffff"
                ariaLabel="loading"
                visible={true}
              />
            </>
          ) : (
            <TbFileTypeDocx className="text-white text-2xl" />
          )}
        </button>
      </div>
      <div className="border-none border-gray-200 rounded-lg  flex flex-col">
        <div className="sticky top-0 bg-white rounded-full border border-gray mx-auto shadow-lg overflow-x-auto max-w-full">
          <div className="flex items-center justify-center gap-2 p-2 rounded-full bg-white mx-auto min-w-max">
            <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
              <button
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                  isStyleActive("BOLD")
                    ? "bg-gray-200 text-blue-600"
                    : "text-gray-700"
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  toggleInlineStyle("BOLD");
                }}
                title="Bold"
              >
                <FaBold className="w-4 h-4" />
              </button>
              <button
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                  isStyleActive("ITALIC")
                    ? "bg-gray-200 text-blue-600"
                    : "text-gray-700"
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  toggleInlineStyle("ITALIC");
                }}
                title="Italic"
              >
                <FaItalic className="w-4 h-4" />
              </button>
              <button
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                  isStyleActive("UNDERLINE")
                    ? "bg-gray-200 text-blue-600"
                    : "text-gray-700"
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  toggleInlineStyle("UNDERLINE");
                }}
                title="Underline"
              >
                <FaUnderline className="w-4 h-4" />
              </button>
            </div>

            {/* Font Size Dropdown */}
            <div className="flex items-center gap-1">
              <div className="flex flex-col">
                <button
                  className="p-1 rounded hover:bg-gray-200 transition-colors text-gray-700"
                  onClick={() => handleFontSizeChange(1)}
                  title="Increase Font Size"
                >
                  <FaCaretUp className="w-4 h-4" />
                </button>
                <button
                  className="p-1 rounded hover:bg-gray-200 transition-colors text-gray-700"
                  onClick={() => handleFontSizeChange(-1)}
                  title="Decrease Font Size"
                >
                  <FaCaretDown className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm text-gray-600">{fontSize}px</span>
            </div>

            {/* Color Picker Dropdown */}
            {/* <div className="relative" ref={colorPickerRef}>
            <button
              className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
              onClick={() => setShowColors(!showColors)}
              title="Text Color"
            >
              <FaPalette className="w-4 h-4" />
            </button>
            {showColors && (
              <div className="absolute w-[100px] top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 p-2">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { color: '#ff0000', name: 'RED' },
                    { color: '#0000ff', name: 'BLUE' },
                    { color: '#00ff00', name: 'GREEN' },
                    { color: '#800080', name: 'PURPLE' },
                    { color: '#ffa500', name: 'ORANGE' },
                    { color: '#000000', name: 'BLACK' },
                  ].map(({ color, name }) => (
                    <button
                      key={name}
                      className="w-6 h-6  border-none border-gray-200 hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: color }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        toggleInlineStyle(`COLOR_${name}`);
                        setShowColors(false);
                      }}
                      title={name.toLowerCase()}
                    />
                  ))}
                </div>
              </div>
            )}
          </div> */}

            {/* Block Style Controls */}
            {/* <div className="flex items-center gap-1 border-l border-gray-200 pl-2">
              <button
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                  isBlockActive("unordered-list-item")
                    ? "bg-gray-200 text-blue-600"
                    : "text-gray-700"
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  toggleBlockType("unordered-list-item");
                }}
                title="Bullet List"
              >
                <FaListUl className="w-4 h-4" />
              </button>
              <button
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                  isBlockActive("ordered-list-item")
                    ? "bg-gray-200 text-blue-600"
                    : "text-gray-700"
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  toggleBlockType("ordered-list-item");
                }}
                title="Numbered List"
              >
                <FaListOl className="w-4 h-4" />
              </button>
            </div> */}
          </div>
        </div>

        {/* Editor */}
        <div className="p-4 min-h-[300px] md:max-w-4xl mx-auto">
          <div className="flex items-center justify-end">
            <div className="max-w-fit my-3 ">
              <Button
                onClick={() => setshowPdfCustomizationModal(true)}
                outline={true}
                label={"Customize PDF"}
                cl
                // IconLeft={() => (
                //   <AiFillPlusSquare className="text-xl text-navy_blue mr-2" />
                // )}
              />
            </div>
          </div>
          <PDFHeader
            doctorName={doctorName}
            websiteName={pdfData?.websiteName}
            websiteDescription={pdfData?.websiteDescription}
            leftLogo={pdfData?.IsLeftLogo ? pdfData?.leftLogo?.url : ""}
            rightLogo={pdfData?.IsRightLogo ? pdfData?.rightLogo?.url : ""}
          />
          <div className="flex gap-2">
            {pdfData?.IsSideBar && (
              <PdfSidebar
                pdfSidebarStyle={{
                  backgroundColor: "#E0F7F4",
                  padding: "10px",
                  width: "100%",
                  maxWidth: "250px",
                  borderRight: "2px solid #000000",
                  fontSize: "12px",
                  lineHeight: "1.6",
                  pageBreakInside: "avoid",
                }}
                sidebarData={pdfData.sidebar}
              />
            )}

            <div className="px-4 flex-1">
              <Editor
                editorState={editorState}
                onChange={setEditorState}
                handleKeyCommand={handleKeyCommand}
                customStyleMap={styleMap}
                blockStyleFn={blockStyleFn}
                placeholder="Start typing..."
              />
              
              {/* Signature Section - Display in Editor View */}
              {user?.signature && (
                <div className="mt-12 mb-4" style={{ marginTop: '50px', textAlign: 'left' }}>
                  <div className="signature-container">
                    <img 
                      src={user.signature} 
                      alt="Doctor's Signature" 
                      style={{ maxWidth: '180px', height: 'auto' }}
                    />
                    <div 
                      className="signature-line" 
                      style={{ 
                        borderTop: '1px solid #000', 
                        width: '200px', 
                        margin: '15px 0' 
                      }}
                    ></div>
                    <div style={{ fontSize: '13px', color: '#666' }}>Doctor's Signature</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <PDFFooter
            leftLogoFooter={
              pdfData?.IsFooterLogo ? pdfData?.leftLogoFooter?.url : ""
            }
            address={pdfData.address}
            date={pdfData?.date}
            email={pdfData.email}
            phone={pdfData.phone}
            website={pdfData.website}
            websiteName={pdfData.websiteName}
          />
        </div>
      </div>

      <PdfCustomizationModal
        isOpen={showPdfCustomizationModal}
        onClose={() => setshowPdfCustomizationModal(false)}
        // onConfirm={handleLogout}
        title="Customize  Pdf"
        message=""
      />
    </div>
  );
};

export default EditorPage;
