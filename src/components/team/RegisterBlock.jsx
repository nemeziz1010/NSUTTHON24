import React, { useState, useEffect , forwardRef } from "react";
import { CSSTransition } from "react-transition-group";
import { BranchSelect } from "./BranchSelect";
import { Plus } from "lucide-react";
import {Input} from "@/components/ui/input";
import "../styles/transition.css";
import clsx from "clsx";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import {

  FormDescription,

} from "@/components/ui/form"


import { ScrollArea } from "@/components/ui/scroll-area";

const RegisterBlock = forwardRef(({ className, member, saveMemberDetails, index }, ref) => {
  const options = [
    {
      label: "Main Campus",
      options: [
        { label: "CSE", value: "CSE" },
        { label: "CSDS", value: "CSDS" },
        { label: "CSAI", value: "CSAI" },
        { label: "IT", value: "IT" },
        { label: "ITNS", value: "ITNS" },
        { label: "MAC", value: "MAC" },
        { label: "ECE", value: "ECE" },
        { label: "EIOT", value: "EIOT" },
        { label: "EE", value: "EE" },
        { label: "ICE", value: "ICE" },
        { label: "ME", value: "ME" },
        { label: "BT", value: "BT" },
        { label: "B.Design", value: "B.Design" },
        { label: "B.FTech", value: "B.FTech" },
        { label: "BBA", value: "BBA" },

      ],
    },
    {
      label: "East Campus",
      options: [
        { label: "CSDA", value: "CSDA" },
        { label: "CIOT", value: "CIOT" },
        { label: "ECAM", value: "ECAM" },
      ],
    },
    {
      label: "West Campus",
      options: [
        { label: "MEEV", value: "MEEV" },
        { label: "CE", value: "CE" },
        { label: "GI", value: "GI" },
        { label: "B.Arch", value: "B.Arch" },
      ],
    },
    {
      options: [
        { label: "Others", value: "Others" },

      ],
    },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [isLeader, setIsLeader] = useState(false);
  const [name, setName] = useState(member.name || "");
  const [email, setEmail] = useState(member.email || "");
  const [phone, setPhone] = useState(member.phone || "");
  const [branch, setBranch] = useState(member.branch || undefined);
  const [rollno, setRollno] = useState(member.rollno || "");
  const [emailError, setEmailError] = useState("");
  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setEmailError(
        "Please enter a valid email format e.g. john.doe@example.com"
      );
    } else {
      setEmailError("");
    }
  };

  useEffect(() => {
    saveMemberDetails({
      name,
      email,
      phone,
      branch,
      rollno,
    });
  }, [name, email, phone, branch, rollno]);

  return (
    <div ref={ref} className={clsx("flex flex-col my-5 rounded-md p-3 sm:p-5 border space-x-4", className)}>
    <div className="flex  w-full">
        <button
          className={` p-2  active:scale-95 rounded-full flex justify-center items-center  h-10 w-10 md:h-12 md:w-12 bg-black  dark:bg-white  transition-transform transform ${
            isOpen ? "rotate-45" : ""
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Plus className="  h-8 w-8 md:h-9  stroke-[2.5px] md:w-9  text-white dark:text-black" />
        </button>
        <div className="flex w-full font-mont  items-center  ">
          <input
            type="text"
            placeholder={`TEAM MEMBER ${index}`}
            onClick={() => setIsOpen(true)}
            value={name}
            required
            maxLength="30"
            onChange={(e) => setName(e.target.value.toUpperCase())}
            className=" outline-none font-mont w-full bg-transparent  ml-2 md:ml-6 p-1 font-bold text-lg md:text-xl "
          />
          {index === 1 ? (
            <button
              className={`sm:w-56 w-36 rounded-lg h-7 sm:h-9 sm:text-2xl font-black bg-black text-white dark:bg-white dark:text-black flex items-center justify-center break-words overflow-hidden`}
            >
              <span
                style={{ transform: "scaleX(1.1) scaleY(0.7)" }}
                className="font-akira"
              >
                LEADER
              </span>
            </button>
          ) : null}
        </div>
      </div>

      <CSSTransition
        in={isOpen}
        timeout={300}
        classNames="expand"
        unmountOnExit
      >
        {
          <div className="flex ">
            <div className="w-full pl-9 md:pl-14  space-y-2 md:mt-2 md:space-y-4 ">
              <input
                required
                type="email"
                maxLength="40"
                placeholder="EMAIL"
                className="outline-none bg-transparent font-mont  p-1 mt-2  font-bold text-lg md:text-xl w-full"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value.toUpperCase());
                  // validateEmail(e.target.value.toUpperCase());
                }}
                // onBlur={(e) => {
                //   validateEmail(e.target.value.toUpperCase());
                // }}
              />

              {/* {emailError && <p className="error-text -mt-10 -mb-10 text-sm text-red-600 opacity-60 mt-0">{emailError}</p>} */}
            
              <input
                type="tel"
                maxLength="10"
                placeholder="PHONE NO"
                className="outline-none bg-transparent p-1  font-bold w-full text-lg md:text-xl"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} // Remove non-numeric characters
                required
              />

              <Select onValueChange={setBranch} value={branch}>
                <SelectTrigger className="w-[180px] ">
                  <h1 className="font-bold  text-lg  dark:text-slate-100 text-black md:text-xl">
                    <SelectValue
                      placeholder={
                        <h1 className=" text-slate-400 ">{"BRANCH"}</h1>
                      }
                    />{" "}
                  </h1>
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-56 md:h-72 ">
                    {options.map((group) => (
                      <React.Fragment key={group.label}>
                        <SelectGroup>
                          <SelectLabel>{group.label}</SelectLabel>
                          {group.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </React.Fragment>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>

              {/* <BranchSelect /> */}
              <input
                type="text"
                placeholder="ROLL NO"
                value={rollno}
                required
                maxLength="16"
                onChange={(e) => setRollno(e.target.value.toUpperCase())}
                className="outline-none bg-transparent p-1   font-bold w-full  text-lg md:text-xl"
              />
            </div>
          </div>
        }
      </CSSTransition>
    </div>
 );
});

export default RegisterBlock;
