"use client";

import Profile from "./Profile";
import Notification from "./Notification";
import { IoSearch } from "react-icons/io5";
import { debounce } from "@/hooks/general";
import { useEffect, useState } from "react";
import DarkLightToggle from "./DarkLightToggle";
import { useAuth } from "../context/AuthContext";
import FullScreenButton from "./FullScreenButton";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { sendMail } from "@/app/lib/config/cron";

const Navbar: React.FC = () => {
  const { token } = useAuth();
  const [stateReady, setStateReady] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  
  const sendMailToday =async () => {
    // Implement your search logic here
    await sendMail()
    
  };
  useEffect(() => {
    setStateReady(true);
    sendMailToday();
  }, []);

  return (
    <>
      {stateReady && token && (
        <nav
          className={`fixed bg-whiteBg w-[83%] ml-[17%] z-50 px-4 py-2 text-black`}
        >
          <div className="flex justify-between items-center">
            <div className="flex w-1/3 justify-start items-center gap-5">
              <HiOutlineMenuAlt1
                size={25}
                className="text-iconBlack font-black"
              />
              {/* <div className="flex w-full items-center">
                <input
                  type="text"
                  value={searchTerm ?? ""}
                  placeholder="Search for Results..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-y border-l bg-infobg border-primary px-4 placeholder:text-gray-500 text-sm py-2.5 rounded-l-full outline-none text-gray-500 w-full"
                />
                <button
                  type="button"
                  className="border-y border-r bg-infobg border-primary text-gray-400 rounded-r-full py-[11px] pr-4 text-lg"
                  onClick={debounce(() => fetchFilteredData(), 500)}
                >
                  <IoSearch />
                </button>
              </div> */}
            </div>
            <div className="flex w-1/3 text-iconBlack justify-end items-center gap-2">
              <DarkLightToggle />
              {/* <Notification /> */}
              <FullScreenButton />
              <Profile />
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
