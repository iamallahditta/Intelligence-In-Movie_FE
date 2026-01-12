import { FaSearch } from "react-icons/fa";
import { MdOutlineFullscreen } from "react-icons/md";
import React from "react";
import useFullScreenRecording from "../hooks/useFullScreenRecording";
import useRecordings from "../hooks/useRecordings";
import { useTranslation } from "react-i18next";

const ConversationHistory = () => {
  const { activeRecording } = useRecordings();
  const [searchTerm, setSearchTerm] = React.useState("");
  const { setShowFullScreenRecording } = useFullScreenRecording();
  const { t } = useTranslation();

  const filteredMessages = activeRecording?.conversation?.filter((message) =>
    message.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-white rounded-xl flex flex-col p-2 mt-3">
      <div className="flex justify-between items-center">
        <h1 className="text-xl">{t("conversation")}</h1>
        <MdOutlineFullscreen
          onClick={() => setShowFullScreenRecording(true)}
          className="text-xl cursor-pointer"
        />
      </div>

      <div className="w-full border-gray mt-2 border-[1.5px] rounded-xl flex items-center gap-2 p-1">
        <FaSearch className="text-lg" />
        <input
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow outline-none placeholder:text-black"
        />
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {filteredMessages?.length === 0 ? (
          <p className="text-center text-[#6B7280]">
            {t("no_messages_found", "No messages found")}
          </p>
        ) : (
          filteredMessages?.map((message) => {
            return (
              <div
                key={message?.id}
                className={`flex flex-col p-2 relative   max-w-[95%] border-[1px] ${
                  message?.from === "doctor"
                    ? "ml-auto bg-light_blue border-navy_blue"
                    : "mr-auto bg-light_gray border-soft_gray"
                } rounded-xl`}
              >
                <h1 className="font-medium">
                  {message?.from?.charAt(0).toUpperCase() +
                    message?.from?.slice(1)}
                </h1>
                <h1 className="font-light text-sm mt-1">{message.text}</h1>
                <h1 className="font-light text-[10px] ml-auto text-gray">
                  {message?.time}
                </h1>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationHistory;
