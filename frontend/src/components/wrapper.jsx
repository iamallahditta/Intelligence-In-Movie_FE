import { Link, useLocation, useNavigate } from "react-router-dom";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { BiMenuAltLeft } from "react-icons/bi";
import { BsPersonLinesFill } from "react-icons/bs";
import { FaCalendar } from "react-icons/fa6";
import { RiFileList3Line } from "react-icons/ri";
import { AiFillPlusSquare } from "react-icons/ai";
import AddPatientModal from "./modal/addPatientModal";
import DeleteConfirmationModal from "./modal/DeleteConfirmationModal";
import { Lock, Pencil, Settings } from "lucide-react";
import moment from "moment";
import useUser from "../hooks/auth/useUser";
import useSelectPatientModal from "../hooks/modal/useSelectPatientModal";
import useFullScreenRecording from "../hooks/useFullScreenRecording";
import useRecordingData from "../hooks/useRecordingData";
import useRecordings from "../hooks/useRecordings";
import { useTemplateNamesQuery } from "../hooks/useTemplatesQuery";
import useSidebar from "../hooks/useSidebar";
import SelectPatientModal from "./modal/selectPatientModal";
import UserDropdown from "./UserDropdown";
import useToken from "../hooks/auth/useToken";
import TemplateModal from "./modal/TemplateModal/TemplateModal";
import toast from "react-hot-toast";
import useSessionTimeout from "../utils/SessionTimeoutHandler";
import axios from "axios";

const MOBILE_BREAKPOINT = "(max-width: 1023px)";

const Wrapper = ({ children }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { subscription, setSubscription } = useUser();
  const toastShown = useRef(false);
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const { user, setUser } = useUser();
  const [isMobile, setIsMobile] = useState(false);

  const { setToken } = useToken();
  const selectPatientModal = useSelectPatientModal();
  const {
    recordings,
    setActiveRecording,
    activeRecording,
    isRecordLoading,
    setTemplateId,
    setRecordings,
    setIsRecordLoading,
  } = useRecordings();
  const { data: templates = [] } = useTemplateNamesQuery();
  const { patient } = useRecordingData();
  const [isModal, setIsModal] = useState(false);
  
  // Pagination state for sidebar
  const [sidebarCurrentPage, setSidebarCurrentPage] = useState(1);
  const [sidebarHasMore, setSidebarHasMore] = useState(false);
  const [isSidebarLoadingMore, setIsSidebarLoadingMore] = useState(false);
  const [sidebarPagination, setSidebarPagination] = useState(null); // Store full pagination object

  console.log(subscription);

  // Check if mobile
  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT);
    
    const handleChange = (e) => {
      setIsMobile(e.matches);
    };
    
    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);



  const getPageName = (path) => {
    const pageMap = {
      "/": "Home",
      "/profile": "Edit Profile",
      "/manage-subscription": "Subscription",
      "/subscription": "Pricing Plans",
      "/security": "Security",
      "/recordings": "Patient History",
      "/patient_recordings": "Patient Session",
      "/editor": "Document Editor",
      "/recording": "New Session",
      "/pre_subscription": "Subscription",
      "/contact": "Contact Us",
    };
    return pageMap[path] || "Dashboard";
  };

  const RecordingComp = ({ recording }) => {
    // eslint-disable-next-line no-unused-vars
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const { setShowFullScreenRecording } = useFullScreenRecording();

    return (
      <>
        <div
          onClick={() => {
            setActiveRecording(recording);
            setShowFullScreenRecording(false);
          }}
          className={`${
            recording?.id === activeRecording?.id ? "bg-light_blue" : ""
          } w-full flex flex-col gap-2 cursor-pointer rounded-xl border-[1px] border-text_gray p-2`}
        >
          <div className="flex flex-row w-full items-center justify-between">
            <h1 className="font-semibold">
              {patient?.firstName} {patient?.lastName}
            </h1>
            {/* <BsFillTrashFill
              onClick={handleDeleteClick}
              className={`hover:text-red-500 transition-colors ${
                isDeleting ? "opacity-50" : ""
              }`}
            /> */}
          </div>
          {recording?.audio?.duration && recording.audio.duration !== "00:00" && (
            <h1 className="text-text_black font-light">
            {recording?.audio?.duration}
          </h1>
          )}
          <div className="flex flex-row items-center justify-between">
            {/* <h1 className="text-gray font-light">{recording?.patient?.id}</h1> */}

            <h1 className="text-gray font-light">
              {moment(recording?.audio?.date).format("MMM DD, YYYY")}
            </h1>
          </div>
        </div>

        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          // onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      </>
    );
  };

  const menuItems = [
    { label: "Edit Profile", to: "/profile", icon: Pencil },
    { label: "Subscription", to: "/manage-subscription", icon: Settings },
    { label: "Security", to: "/security", icon: Lock },
  ];

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const { data } = await axios.post("/v1/api/subscription/details", {
          userId: user.id,
        });
        setSubscription(data);
      } catch (err) {
        console.error("Failed to fetch subscription:", err);
      }
    };

    fetchSubscription();
  }, [user.id, setSubscription]);

  useEffect(() => {
    // Wait until user and subscription are fully loaded
    if (user === undefined || subscription === undefined) return;

    if (!user?.status) {
      setToken(null);
      setUser(null);
      navigate("/");
      return;
    }

    if (!user?.isSubscription) {
      if (subscription?.status === "canceled") {
        if (
          pathname !== "/subscription" &&
          pathname !== "/manage-subscription" &&
          pathname !== "/contact"
        ) {
          navigate("/manage-subscription");
        }
        return;
      }

      // Prevent duplicate toasts
      if (!toastShown.current) {
        toastShown.current = true;
        // Optionally show toast here
      }

      if (pathname !== "/pre_subscription" && pathname !== "/contact") {
        navigate("/pre_subscription");
      }

      return;
    }

    // If already subscribed and on pre_subscription page, redirect to dashboard
    if (pathname === "/pre_subscription") {
      navigate("/");
    }

    // Reset the toastShown guard when everything is okay
    toastShown.current = false;
  }, [user, subscription, pathname, navigate, setToken, setUser]);

  useEffect(() => {
    if (templates.length > 0) {
      const soapNote = templates.find(
        (template) => template.templateName === "SOAP Note"
      );
      if (soapNote) {
        setTemplateId(soapNote.id);
      }
    }
  }, [templates, setTemplateId]);

  // auto loging off

    const handleLogout = () => {
    toast.error("You’ve been logged out due to inactivity.");
    localStorage.removeItem("lastActivity");
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  };

  useEffect(() => {
    // Check session immediately when the app loads
    const lastActivity = parseInt(localStorage.getItem("lastActivity"), 10);
    if (lastActivity && Date.now() - lastActivity > 1 * 60 * 60 * 1000) {
      handleLogout();
    }
  }, []);

  // Start session timeout tracking
  useSessionTimeout(
    handleLogout,
    () => {
      toast("You’ve been inactive. You’ll be logged out soon unless you're active.");
    }
  );

  // Fetch recordings with pagination for sidebar
  const fetchSidebarRecordings = useCallback(
    async (page = 1, append = false) => {
      try {
        if (!patient?.id) {
          return;
        }

        // Set loading state
        if (append) {
          setIsSidebarLoadingMore(true);
        } else {
          setIsRecordLoading(true);
        }

        const { data } = await axios.get(
          `/v1/api/record/patient/${patient.id}?page=${page}&limit=10`
        );

        // Ensure newRecords is always an array
        const newRecords = Array.isArray(data?.data?.records) 
          ? data.data.records 
          : [];
        const pagination = data?.data?.pagination || {};

        // Store full pagination object
        setSidebarPagination(pagination);

        // Update recordings - append if loading more, replace if initial load
        if (append) {
          // Use functional update to append new records to existing ones
          setRecordings((prev) => {
            const prevArray = Array.isArray(prev) ? prev : [];
            // Filter out duplicates by ID to prevent duplicate records
            const existingIds = new Set(prevArray.map(rec => rec.id));
            const uniqueNewRecords = newRecords.filter(rec => !existingIds.has(rec.id));
            return [...prevArray, ...uniqueNewRecords];
          });
        } else {
          // Replace recordings on initial load
          setRecordings(newRecords);
        }

        // Update pagination state
        setSidebarCurrentPage(pagination.page || page);
        // Only set hasMore to true if there are more pages AND we have data
        const hasMorePages = (pagination.hasNextPage) ;
        setSidebarHasMore(hasMorePages);

        setIsRecordLoading(false);
        setIsSidebarLoadingMore(false);
      } catch (error) {
        console.log("Error fetching recordings:", error);
        toast.error("Something went wrong!");
        if (!append) {
          setRecordings([]); // Set empty array on error only for initial load
        }
        setIsRecordLoading(false);
        setIsSidebarLoadingMore(false);
      }
    },
    [patient?.id, setRecordings, setIsRecordLoading]
  );

  // Load more recordings in sidebar
  const handleSidebarLoadMore = () => {
    if (!isSidebarLoadingMore && sidebarHasMore) {
      fetchSidebarRecordings(sidebarCurrentPage + 1, true);
    }
  };

  // Fetch recordings when patient changes or when on patient_recordings page
  useEffect(() => {
    if (pathname === "/patient_recordings" && patient?.id) {
      // Only fetch if recordings array is empty or we need to refresh
      if (!Array.isArray(recordings) || recordings.length === 0) {
        setSidebarCurrentPage(1);
        setSidebarHasMore(false);
        fetchSidebarRecordings(1, false);
      } else {
        // If recordings already exist (loaded from allRecordings page), 
        // calculate pagination state based on current recordings count
        // This ensures the sidebar knows if there are more to load
        const estimatedPages = Math.ceil(recordings.length / 10);
        setSidebarCurrentPage(estimatedPages);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient?.id, pathname]);

  return (
    <div className="flex h-screen flex-col">
      <div className="w-full flex flex-row items-center shadow-md justify-between h-[10%]  bg-light_gray p-4">
        <Link to="/">
        <img
          src="/vocalli-logo.png"
          alt="vocalli-logo"
          className="w-44 h-auto"
        />
        </Link>

        {/* Only show menu button if user is subscribed */}
        {user?.isSubscription && (
        <BiMenuAltLeft
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-3xl cursor-pointer text-black mx-1 lg:hidden block"
        />
        )}

        <div className="hidden md:flex flex-row items-center gap-4  mr-[0px] lg:mr-[200px]">
          <div className="flex flex-row items-center gap-6">
            <h1 className="text-navy_blue font-bold text-lg">
              {getPageName(pathname)}
            </h1>
            <span className="text-soft_gray px-2">|</span>
            <h1 className="text-text_black font-semibold">
              Welcome, {user?.username}
            </h1>
          </div>

          <div className="flex flex-row items-center gap-2 p-2 bg-white rounded-xl">
            <FaCalendar className="text-sm text-soft_gray" />
            <h1 className="font-light text-sm text-soft_gray">
              {moment().format("MMM DD, YYYY")}
            </h1>
          </div>
        </div>

        <UserDropdown user={user} menuItems={menuItems} />
      </div>

      <div className="w-screen h-[90%] flex flex-row relative">
        {/* Backdrop for mobile sidebar */}
        {isSidebarOpen && user?.isSubscription && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Only show sidebar if user is subscribed */}
        {user?.isSubscription && (
        <div
          className={` ${
            isSidebarOpen
              ? "w-64 opacity-100 px-4"
              : "w-0 opacity-0 px-0"
          } duration-300 border-r-[1px] border-soft_gray bg-light_gray pb-4 flex flex-col items-center shrink-0 overflow-y-auto no-scrollbar lg:relative h-full fixed lg:static left-0 top-0 z-50`}
        >
          <h1 className="w-full my-4 text-2xl font-bold tracking-wide">
            Recordings
          </h1>
          <div className="flex flex-col gap-2  bg-white rounded-xl px-2 py-4 w-full ">
            <h1 className="font-semibold text-text_black mb-4">
              Start New Recording
            </h1>
            <div
              onClick={() => {
                if (pathname === "/") {
                  selectPatientModal.onOpen();
                } else {
                  navigate("/recording");
                  if (isMobile) {
                    setIsSidebarOpen(false);
                  }
                }
              }}
              className="w-full cursor-pointer bg-light_blue rounded-xl flex flex-row items-center justify-center p-1"
            >
              <div className="flex items-center justify-center h-10 w-10 bg-white rounded-full shadow-lg">
                <div className="flex items-center justify-center h-3 w-3 bg-red rounded-full" />
              </div>
              <img src="assets/audio.svg" alt="" />
            </div>
          </div>

          <div
            onClick={() => {
              setIsModal(true);
              if (isMobile) {
                setIsSidebarOpen(false);
              }
            }}
            className="w-[255px] cursor-pointer p-3 my-3 bg-white border-r-[2px] border-navy_blue flex items-center justify-start gap-3 hover:bg-light_blue transition px-4"
          >
            <RiFileList3Line className="text-navy_blue text-xl" />
            <h1 className="text-navy_blue font-medium">Template Management</h1>
          </div>

          <div
            onClick={() => {
              navigate("/");
              if (isMobile) {
                setIsSidebarOpen(false);
              }
            }}
            className="w-[255px] cursor-pointer p-3 mb-3 bg-white border-r-[2px] border-navy_blue flex items-center justify-start gap-3 hover:bg-light_blue transition px-4"
          >
            <BsPersonLinesFill className="text-navy_blue text-xl" />
            <h1 className="text-navy_blue font-medium">Patient History</h1>
          </div>

          {pathname === "/patient_recordings" && (
            <div className="flex flex-col bg-white rounded-xl px-2 py-4 w-full mt-5 max-h-[400px] overflow-hidden">
              <h1 className="font-semibold text-text_black mb-4 flex-shrink-0">
                {`Previous Conversations`}{" "}
                {!isRecordLoading && (
                  <span className="text-navy_blue font-medium ml-1">{`(${
                    sidebarPagination?.total ?? (Array.isArray(recordings) ? recordings.length : 0)
                  })`}</span>
                )}
              </h1>
              {isRecordLoading ? (
                <div className="flex items-center justify-center flex-grow">
                  <h1 className="text-gray text-center w-full text-sm font-light">
                    Loading...
                  </h1>
                </div>
              ) : Array.isArray(recordings) && recordings.length > 0 ? (
                <>
                  <div className="flex flex-col gap-2 overflow-y-auto flex-grow min-h-0 pr-1">
                    {recordings.map((recording, index) => {
                      return <RecordingComp key={index} recording={recording} />;
                    })}
                  </div>
                  {/* Load More Button */}
                  {sidebarHasMore && (
                    <div className="flex justify-center mt-4 flex-shrink-0">
                      <button
                        onClick={handleSidebarLoadMore}
                        disabled={isSidebarLoadingMore}
                        className="w-full px-4 py-2 text-sm font-medium text-navy_blue bg-white border border-navy_blue rounded-lg hover:bg-light_blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSidebarLoadingMore ? (
                          <>
                            <div className="w-4 h-4 border-2 border-navy_blue border-t-transparent rounded-full animate-spin"></div>
                            Loading...
                          </>
                        ) : (
                          <>
                            <AiFillPlusSquare className="text-lg" />
                            Load More
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center flex-grow">
                  <h1 className="text-gray text-center w-full text-sm font-light">
                    Your history will appear here once you create a recording.
                  </h1>
                </div>
              )}
            </div>
          )}
        </div>)}

        <div className="flex-grow overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>
      <TemplateModal isModal={isModal} setIsModal={setIsModal} />
      <AddPatientModal />
      <SelectPatientModal />
    </div>
  );
};

export default Wrapper;
