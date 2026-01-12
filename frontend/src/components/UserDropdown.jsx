import { LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useToken from "../hooks/auth/useToken";
import useRecordings from "../hooks/useRecordings";
import DeleteConfirmationModal from "./modal/DeleteConfirmationModal";

const UserDropdown = ({ user, menuItems = [] }) => {
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef(null);
  const { setActiveRecording } = useRecordings();
  const { setToken } = useToken();

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle click on a menu item
  const handleMenuClick = (item) => {
    if (item.onClick) item.onClick();
    setOpen(false); // ✅ close the dropdown
  };

  const handleLogout = () => {
    setActiveRecording(null);
    setToken(null);
    setShowLogoutModal(false);
    localStorage.removeItem("lastActivity");

  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex flex-row items-center gap-2 px-4 cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <img
          src={
            user?.imageUrl ||
            "https://www.londondentalsmiles.co.uk/wp-content/uploads/2017/06/person-dummy.jpg"
          }
          className="h-9 w-9 rounded-full object-cover"
        />
        <h1 className="ml-3 mr-2 text-gray-700">
          {user?.username || "User Name"}
        </h1>
      </div>

      {open && (
        <div className="absolute mt-7 py-4 right-0 bg-white shadow-[2px_2px_10px_0px_#00000029] rounded-xl w-48 z-50">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return item.to ? (
              <Link
                key={index}
                to={item.to}
                onClick={() => {
                  setOpen(false); // ✅ close on link click
                }}
                className="flex items-center gap-2 px-4 py-2 hover:bg-[#FAFAFA]"
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            ) : (
              <button
                key={index}
                onClick={() => handleMenuClick(item)}
                className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
          <div
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 px-4 py-2 hover:bg-[#FAFAFA] cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <h1 className=" ">Logout</h1>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will need to login again to access your account."
      />
    </div>
  );
};

export default UserDropdown;
