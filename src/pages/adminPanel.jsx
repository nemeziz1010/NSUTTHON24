import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AdminTeamTable } from "../components/admin/AdminTeamTable";
import { EventsInputForm } from "../components/admin/EventForm";
import { AdminEventsTable } from "../components/admin/AdminEventsTable";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const openTab = Number(searchParams.get("tab")) || 1; // default to 1 if no parameter

  const handleTabChange = (tabNumber) => {
    setSearchParams({ tab: tabNumber });
    navigate({ search: `?tab=${tabNumber}` });
  };

  return (
    <div className=" p-8 md:p-16 lg:px-48 ">
      <ul className="flex w-full list-none flex-wrap border-b-4 border-black dark:border-slate-100 m-0 p-0 text-end space-x-0 items-end">
        <li
          className={` ${
            openTab === 1 ? "md:border-b-4 text-3xl" : "text-slate-500 text-2xl"
          } border-black   dark:border-slate-100 m-0 p-0`}
        >
          <div
            onClick={(e) => {
              e.preventDefault();
              handleTabChange(1);
            }}
          >
            <h1
              className={`${
                openTab === 1
                  ? "md:text-3xl transition-all text-3xl"
                  : "md:text-2xl transition-all hover:text-3xl text-2xl"
              } md:pb-4 pb-2 font-extrabold tracking-tight  px-4`}
            >
              USERS
            </h1>
          </div>
        </li>

        <li
          className={`  ${
            openTab === 2 ? "md:border-b-4 text-3xl" : "text-slate-500 text-2xl"
          } border-black dark:border-slate-100 m-0 p-0`}
        >
          <div
            onClick={(e) => {
              e.preventDefault();
              handleTabChange(2);
            }}
          >
            <h1
              className={`${
                openTab === 2
                  ? "md:text-3xl transition-all text-3xl"
                  : "md:text-2xl  transition-all hover:text-3xl text-2xl"
              } md:pb-4 pb-2 font-extrabold tracking-tight  px-4`}
            >
              ADD EVENTS
            </h1>
          </div>
        </li>
        <li
          className={` flex-1   md:flex-none ${
            openTab === 3 ? "md:border-b-4 text-3xl" : "text-slate-500 text-2xl"
          } border-black dark:border-slate-100 m-0 p-0`}
        >
          <div
            onClick={(e) => {
              e.preventDefault();
              handleTabChange(3);
            }}
          >
            <h1
              className={`${
                openTab === 3
                  ? "md:text-3xl transition-all text-3xl"
                  : "md:text-2xl transition-all hover:text-3xl text-2xl"
              } md:pb-4 pb-2 text-left font-extrabold  px-4 tracking-tightpx-8 `}
            >
              MANAGE EVENTS
            </h1>
          </div>
        </li>
      </ul>

      <div className="pt-4 md:pt-8">
        {openTab === 1 ? (
          <div className="flex  items-center justify-center">
            <AdminTeamTable />
          </div>
        ) : openTab === 2 ? (
          <div className="flex  items-center justify-center">
            <EventsInputForm />
          </div>
        ) : openTab === 3 ? (
          <div className="flex  items-center justify-center">
            <AdminEventsTable />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AdminPanel;
