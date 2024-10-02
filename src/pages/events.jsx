import React, { useEffect } from "react";
import EventGrid from "../components/events/eventcomponent";
import { useLocation, useNavigate } from "react-router-dom";
import { CalendarDays  } from "lucide-react"; 
export const Events = () => {
  // const [openTab, setOpenTab] = React.useState(1);
  const location = useLocation();
  const navigate = useNavigate();

  // Default to tab 1 if there's no tab query param
  const initialTab = new URLSearchParams(location.search).get("day") || "1";
  const [openTab, setOpenTab] = React.useState(parseInt(initialTab));

  // useEffect(() => {
  //   // Set the tab query parameter in the URL when openTab changes
  //   navigate(`?day=${openTab}`);
  // }, [openTab, navigate]);

  useEffect(() => {
    // Replace the current entry in history without adding a new one
    navigate(`?day=${openTab}`, { replace: true });
  }, [openTab, navigate]);

  
  const handleTabClick = (tabNumber) => {
    setOpenTab(tabNumber);
  };
  return (
      <div className=" md:px-[8vw] lg:px-[10vw] xl:px-[13vw] px-[8vw] pt-8 md:pt-16">
      <h1 className=" font-extrabold font-raleway  text-center pb-4 tracking-tight text-3xl  md:text-5xl">
        EVENTS
      </h1>
      <ul className="flex w-full list-none flex-wrap border-b-4 border-black dark:border-slate-100 m-0 p-0 text-end space-x-0 items-end">
        <li
          className={` ${
            openTab === 1 ? "border-b-4 text-3xl" : "text-slate-500 text-2xl"
          } border-black   dark:border-slate-100 m-0 p-0`}
        >
          <div
            onClick={(e) => {
              e.preventDefault();
              handleTabClick(1);
            }}
          >
            <h1
              className={`${
                openTab === 1
                  ? "md:text-4xl sm:transition-all text-3xl"
                  : "md:text-2xl sm:transition-all sm:hover:text-3xl text-2xl"
              } md:pb-4 pb-2 font-extrabold tracking-tight  px-3 sm:px-4`}
            >
              DAY 1
            </h1>
          </div>
        </li>

        <li
          className={`  ${
            openTab === 2 ? "border-b-4 text-3xl" : "text-slate-500 text-2xl"
          } border-black dark:border-slate-100 m-0 p-0`}
        >
          <div
            onClick={(e) => {
              e.preventDefault();
              handleTabClick(2);
            }}
          >
            <h1
              className={`${
                openTab === 2
                  ? "md:text-4xl sm:transition-all text-3xl"
                  : "md:text-2xl  sm:transition-all sm:hover:text-3xl text-2xl"
              } md:pb-4 pb-2 font-extrabold tracking-tight   px-3 sm:px-4`}
            >
              DAY 2
            </h1>
          </div>
        </li>
        <li
          className={` flex-1   md:flex-none ${
            openTab === 3 ? "border-b-4 text-3xl" : "text-slate-500 text-2xl"
          } border-black dark:border-slate-100 m-0 p-0`}
        >
          <div
            onClick={(e) => {
              e.preventDefault();
              handleTabClick(3);
            }}
          >
            <h1
              className={`${
                openTab === 3
                  ? "md:text-4xl sm:transition-all text-3xl"
                  : "md:text-2xl sm:transition-all sm:hover:text-3xl text-2xl"
              } md:pb-4 pb-2 text-left font-extrabold   px-3 sm:px-4  `}
            >
              DAY 3
            </h1>
          </div>
        </li>
      </ul>

      <div className="pt-4 h-[60vh]  md:pt-8">
       
      <EventGrid openTab={openTab} />
      </div>
    </div>
  );
};
