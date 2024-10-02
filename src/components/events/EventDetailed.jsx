import React, { useState, useEffect ,useRef } from "react";
import { useLocation, useParams  } from "react-router-dom";
import TimeComponent from "../admin/Event/EditTimeFormat";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Calendar, User, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ImageScroller from "./EventImages";
import DOMPurify from "dompurify";
import "react-quill/dist/quill.snow.css"; // Or another theme of your choice
import axios from "axios";


const EventDetails = () => {
  const location = useLocation();
  const { eventId: event_id } = useParams();
  const [eventDetails, setEventDetails] = useState(location.state?.event || {});
  
  const fetchedRef = useRef(false);  // To track if data has been fetched

  useEffect(() => {
    // If eventDetails is empty and not previously fetched, fetch the event data
    if (!eventDetails.event_id && !fetchedRef.current) {
      const fetchEventDetails = async () => {
        fetchedRef.current = true; // Mark as fetched
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/events/${event_id}`
          );
          setEventDetails(response.data);
        } catch (error) {
          console.error("Error fetching the event details:", error);
        }
      };
      fetchEventDetails();
    }
  }, [event_id]); // Remove eventDetails from dependencies


  const sanitizedDescription = DOMPurify.sanitize(eventDetails.description);

  const countPOCs = () => {
    let count = 0;
    if (eventDetails.name_poc_1 && eventDetails.phone_poc_1) count++;
    if (eventDetails.name_poc_2 && eventDetails.phone_poc_2) count++;
    if (eventDetails.name_poc_3 && eventDetails.phone_poc_3) count++;
    return count;
  };

  const pocCount = countPOCs();

  const [isSm, setIsSm] = useState(window.innerWidth >= 640);
  const gridStyles = isSm
    ? {
        display: "grid",
        gridTemplateColumns: `repeat(${pocCount}, 1fr)`,
      }
    : {};

  useEffect(() => {
    const handleResize = () => {
      setIsSm(window.innerWidth >= 640);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [openTab, setOpenTab] = React.useState(1);

  return (
    <div className=" p-8 sm:p-16 md:px-24 lg:36 xl:px-72 ">
      <h1 className=" font-extrabold font-raleway  text-center pb-4 tracking-tight text-3xl  sm:text-5xl">
        EVENTS
      </h1>

      <div className="w-full border  ">
        {/* Profile Image with Event details */}
        <div className="flex rounded-bl sm:border flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
          {/* Profile Image */}
          <div className=" sm:flex-none  sm:max-h-64 rounded items-center justify-center">
            <ImageScroller
              imageLinks={[
                eventDetails.banner_url_1 ||
                  "https://storage.googleapis.com/nsutthon/default_image.jpg",
                eventDetails.banner_url_2,
                eventDetails.banner_url_3,
              ]}
            />
          </div>

          <div className="  relative w-full">
            <div>
              {/* Event details below the image in mobile and beside the image in larger views */}
              <div className="w-full items-center sm:items-start   flex flex-col  ">
                <div className=" py-2 sm:py-4">
                  <h1 className="font-raleway flex justify-center sm:justify-normal font-extrabold text-4xl  md:text-5xl ">
                    {eventDetails.event_name}
                  </h1>
                  <p className="font-raleway flex justify-center sm:justify-normal opacity-70 text-xl sm:text-2xl ">
                    {eventDetails.society_name}
                  </p>
                </div>
                {/* {eventDetails.venue && (
                    <div className=" font-raleway hidden xl:flex sm:w-auto items-center sm:gap-2">
                      <MapPin className="h-auto" />
                      <span className="text-lg sm:text-2xl uppercase">
                        {eventDetails.venue}
                      </span>
                    </div>
                  )} */}
                <div className="flex justify-center sm:justify-normal font-raleway gap-x-4 sm:gap-x-6 gap-y-1 flex-wrap ">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Calendar className="h-auto" />
                    <span className="text-lg  sm:text-2xl">
                      Day {eventDetails.day_number}
                    </span>
                  </div>
                  <div className="flex  gap-1  md:gap-12">
                    <Clock className="h-auto" />
                    <span className="text-lg sm:text-2xl  ">
                      <TimeComponent timeValue={eventDetails.time} />
                    </span>
                  </div>
                  {eventDetails.venue && (
                    <div className="flex font-raleway sm:w-auto items-center sm:gap-2">
                      <MapPin className="h-auto" />
                      <span className="text-lg sm:text-2xl uppercase">
                        {eventDetails.venue}
                      </span>
                    </div>
                  )}
                  </div>
                  
                
              </div>
            
            </div>
            {/* Registration button */}
            <div className=" pr-4 py-1 xl:pr-0  mt-3 xl:absolute top-1/3  align-middle right-10 sm:flex hidden  items-center justify-center">
              <Button
                className="w-full md:p-5  opacity-90 font-raleway "
              >
                <a
                  href={eventDetails.registration_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" md:text-xl font-raleway"
                >
                  REGISTER
                </a>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center ">
          <Button
            className="w-2/4  sm:hidden font-raleway sm:text-lg "
          >
            <a
              href={eventDetails.registration_link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-raleway text-lg"
            >
              REGISTER
            </a>
          </Button>
        </div>
        <div className="  sm:hidden flex mt-4 sm:mt-0 justify-center ">
          <Separator className="  w-11/12" />
        </div>

        {/* Description */}
        <h1 className=" justify-center underline mt-4 flex font-raleway text-lg sm:text-xl">
          ABOUT THE EVENT
        </h1>


        <div
          className="mb-4 py-2 px-4 overflow-hidden sm:px-8 text-md sm:text-xl"
          dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
        ></div>

        {pocCount > 0 && (
          <div className=" px-4 pb-4 sm:pt-2">
            <h1 className="text-center font-raleway text-lg sm:text-xl">
              EVENT POCs
            </h1>
            <div className=" w-full justify-center sm:flex ">
              <div
                style={gridStyles}
                className="mt-4   sm:w-3/4 grid-cols-1  grid gap-4"
              >
                {eventDetails.name_poc_1 && eventDetails.phone_poc_1 && (
                  <a
                    href={`https://api.whatsapp.com/send?phone=91${eventDetails.phone_poc_1}`}
                    target="_blank"
                    className="sm:pb-0"
                    rel="noopener noreferrer"
                  >
                    <div className="border p-2 rounded-md shadow cursor-pointer hover:opacity-90">
                      <p className="font-bold mb-1 flex gap-2 uppercase">
                        <User /> {eventDetails.name_poc_1}
                      </p>
                      <p className=" gap-2 flex">
                        <Phone /> {eventDetails.phone_poc_1}
                      </p>
                    </div>
                  </a>
                )}
                {eventDetails.name_poc_2 && eventDetails.phone_poc_2 && (
                  <a
                    href={`https://api.whatsapp.com/send?phone=91${eventDetails.phone_poc_2}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="border p-2 rounded-md shadow cursor-pointer hover:opacity-90">
                      <p className="font-bold mb-1 flex gap-2 uppercase">
                        <User /> {eventDetails.name_poc_2}
                      </p>
                      <p className=" gap-2 flex">
                        <Phone /> {eventDetails.phone_poc_2}
                      </p>
                    </div>
                  </a>
                )}
                {eventDetails.name_poc_3 && eventDetails.phone_poc_3 && (
                  <a
                    href={`https://api.whatsapp.com/send?phone=91${eventDetails.phone_poc_3}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="border p-2 rounded-md shadow cursor-pointer hover:opacity-90">
                      <p className="font-bold mb-1 flex gap-2 uppercase">
                        <User /> {eventDetails.name_poc_3}
                      </p>
                      <p className=" gap-2 flex">
                        <Phone /> {eventDetails.phone_poc_3}
                      </p>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
