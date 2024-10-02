import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React, { memo, useCallback } from "react";
import { Transition } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { useInView } from "react-intersection-observer";

export function Faq({ showAll }) {
  
  const allFaqs = useCallback(
    [
      {
        id: "item-1",
        question: "What is NSUTTHON?",
        answer:
          "NSUTTHON is the 3 days long annual flagship event of CROSSLINKS, in which all the student societies of NSUT organize events and competitions for freshers."
      },
      {
        id: "item-2",
        question: "Will classes be conducted during NSUTTHON?",
        answer:
          "Yes, classes will be conducted as per your time table, but we will try our best to avoid any clashes with the events."
      },
      {
        id: "item-3",
        question: "What is the schedule of events?",
        answer:
          "The schedule of the events will be released on the official Instagram handle of CROSSLINKS, NSUT a few days before the event. You are requested to follow our social media handles for all updates."
      },
      {
        id: "item-4",
        question: "What are the types of events?",
        answer:
          "Events range from orientations of a society to competitions like treasure hunts, cryptic hunts, dance face offs and a lot more, for each of which winning teams will be awarded points."
      },
      {
        id: "item-5",
        question: "Are there any prices for the winning teams?",
        answer:
          "The prices for winning a particular society 's event will be decided by the respective society. The top 3 teams which emerge as the winners of NSUTTHON will be awarded by CROSSLINKS."
      },
      {
        id: "item-6",
        question: "Is it an individual or team based event?",
        answer:
          "You need to register in teams of 3 to 5 members. However, you can participate in an event individually to represent your teams."
      },
      {
        id: "item-7",
        question: "What is the platform being used?",
        answer:
          "Every team has to register on NSUTTHON's website to be able to take part in the event."
      },
      {
        id: "item-8",
        question: "How to get a team registered for NSUTTHON?",
        answer:
          "For participating in NSUTTHON you need to register your team by proceeding with the following steps:<br/>" +
          "1)Visit the website of NSUTTHON.<br/>" +
          "2) Start by clicking on REGISTER.<br/>" +
          "3) Select your team size (3/4/5).<br/>" +
          "4)Enter your team name(it can be anything you like).<br/>" +
          "5) Enter name of your team members (The first member has to be your team leader).<br/>" +
          "6)Enter further details asked.<br/>" +
          "7)Once done each team member is required to do the following task:<br/>" +
          "(i)Install PROEDGE app using the given link.<br/>" +
          "(ii)Register on the app and complete the free amplitude test consisting of 120 questions.<br/>" +
          "(iii)Make sure you mention 3rd year as your year of study.<br/>" +
          "8)You will get a team code after being successfully registered, note it down for further use."
      },
      {
        id: "item-9",
        question: "Is it necessary to register our team?",
        answer:
          "Yes, it is mandatory to register your team on NSUTTHON's website to take part in any society's event."
      },
      {
        id: "item-10",
        question: "What is the distribution of scores?",
        answer:
          "The points will be distributed as follows:<br/>" +
          "Winner Team: 40 points<br/>" +
          "1st Runner up Team: 25 points<br/>" +
          "2nd Runner up Team: 15 points<br/>" +
          "The team with the highest cumulative score after all the events will be the winner of NSUTTHON."
      },
      {
        id: "item-11",
        question: "What to do if two events clash?",
        answer:
          "Well, you have to make a choice here by participating in the event you wish to be a part of more eagerly and let your team join the other one.<br/>" +
          "<strong>Pro Tip:</strong> Make a team of 5 members so that your chances of scoring points increases as your team can participate in two or more events at the same time."
      },
      {
        id: "item-12",
        question: "What will be the length of an event?",
        answer:
          "The average length of any event would range from 1-2 hours."
      },
      {
        id: "item-13",
        question: "Do I need to join the society to take part in its event?",
        answer:
          "No, you need not be a part of any society to be able to participate in its event, however, you must register your team on NSUTTHON's website and for the society's event, following the instructions they provide on their respective social media handles."
      },
      {
        id: "item-14",
        question: "How to register for a particular event?",
        answer:
          "Once you register your team on NSUTTHON's website, you can register for individual society events by following the procedure they inform through their social media handles."
      },
      {
        id: "item-15",
        question: "Can a team take part in two events happening at the same time?",
        answer:
          "Yes, a team can take part in two events simultaneously provided they have registered for both."
      }
    ],
    []
  );
  


  const containerClass = clsx("faq-container relative overflow-hidden", {
    "with-gradient": !showAll,
  });
  const hiddenClass =
    "opacity-0 max-h-0 overflow-hidden transition-all duration-500 ease-in-out ";
  const shownClass =
    "opacity-100 max-h-full transition-all duration-1000 ease-in-out";

  return (
    <div
    
      className={`${containerClass} relative pb-3 border-b-4 overflow-hidden`}
    >
      <Accordion type="single" collapsible className="w-full">
        {allFaqs.map((faq, index) => (
          <AccordionItem
            value={faq.id}
            className={showAll || index < 8 ? shownClass : hiddenClass}
            key={faq.id}
          >
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>
  <div dangerouslySetInnerHTML={{ __html: faq.answer }}></div>
</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
