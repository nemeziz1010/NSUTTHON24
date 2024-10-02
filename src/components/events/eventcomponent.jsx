import axios from "axios";
import React, { useEffect, useState } from "react";
import TimeComponent from "../admin/Event/EditTimeFormat2";
import EventDetails from "./EventDetailed"; // Assuming it's in the same directory
import { useNavigate } from "react-router-dom";

const EventGrid = ({ openTab }) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // <-- New state

  const fetchEvents = async (forceUpdate = false) => {
    try {
      if (!forceUpdate) {
        // Check for cached data
        const cachedEvents = localStorage.getItem("eventsData");
        if (cachedEvents) {
          return JSON.parse(cachedEvents);
        }
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/events`
      );

      localStorage.setItem("eventsData", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error("Error fetching the events:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // Fetch data from cache
      const data = await fetchEvents();
      setEvents(data);

      // Fetch updated data from server in the background
      const updatedData = await fetchEvents(true);
      setEvents(updatedData);
    };

    fetchData();
  }, []);
  const filteredEvents = events.filter((event) => event.day_number === openTab);

  // ... [rest of the component]

  return (
    <div className="grid grid-cols-2  md:grid-cols-4 gap-4 xl:gap-7">
      {filteredEvents.map((event) => (
        <div
          key={event.event_id}
          className="relative overflow-hidden rounded transition-transform hover:scale-105"
          // className="relative overflow-hidden rounded transition-transform sm:hover:scale-105"

          onClick={() =>
            navigate(`/events/${event.event_id}`, { state: { event } })
          }
        >
          <div className="relative w-full overflow-hidden">
            <div style={{ paddingBottom: "100%" }}></div>

            <img
              src={
                event.banner_url_1_compressed
                  ? event.banner_url_1_compressed
                  : event.banner_url_1
                  ? event.banner_url_1
                  : "https://storage.googleapis.com/nsutthon/default_image-x2XbUUFkfAWKHiYyrZpNko-compressed.jpg"
              }
              alt={event.event_name}
              className="absolute top-0 left-0 w-full dark:border dark:border-white h-full object-cover rounded"
            />

            {/* Time component positioned over the image */}
            <div className="absolute top-0 right-2 sm:right-4 dark:mt-[1px] bg-white dark:border-b-1 dark:border-white   border dark:bg-[#03050a] px-1 sm:px-2 py-0.5 sm:py-1 rounded-b-md">
              <TimeComponent timeValue={event.time} className="" />
            </div>
          </div>

          <div className="flex justify-between mt-2">
            <div className="space-y-1 text-base">
              <h3 className="font-medium leading-none">{event.event_name}</h3>
              <p className="text-sm text-muted-foreground">
                {event.society_name}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventGrid;
