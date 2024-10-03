import React, { useState, useEffect } from "react";
import RegisterBlock from "./RegisterBlock";
import { Button } from "@/components/ui/button";
import "../styles/transition.css";
import { useToast } from "@/components/ui/use-toast";
import { PopupDialog } from "./Popup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Transition } from "@headlessui/react";
import ReCAPTCHA from "react-google-recaptcha"; // Import reCAPTCHA

function RegisterForm({ numberOfMembers, teamName }) {
  const { toast } = useToast();
  const [showPopup, setShowPopup] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null); // CAPTCHA state
  const [copyMember, setCopyMember] = useState({});
  const navigate = useNavigate();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const rollNumberPattern = /^2024U[A-Z]{2}\d{4}$/;
  const phoneNumberPattern = /^\d{10}$/; // Validates 10-digit phone number

  const getInitialMembers = () => {
    const savedMembers = localStorage.getItem('members');
    return savedMembers ? JSON.parse(savedMembers) : Array(numberOfMembers).fill({});
  };

  const [members, setMembers] = useState(getInitialMembers());

  // Save members to localStorage whenever the members state changes
  useEffect(() => {
    localStorage.setItem('members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    setMembers((prevMembers) => {
      if (numberOfMembers > prevMembers.length) {
        return [
          ...prevMembers,
          ...Array(numberOfMembers - prevMembers.length).fill({}),
        ];
      } else if (numberOfMembers < prevMembers.length) {
        return prevMembers.slice(0, numberOfMembers);
      } else {
        return prevMembers;
      }
    });
  }, [numberOfMembers]);

  console.log(members)

  const saveMemberDetails = (index, newMember) => {
    const updatedMembers = [...members];
    updatedMembers[index] = newMember;
    setMembers(updatedMembers);
  };

  const submitDetails = () => {

    // Check for team name
    if (!teamName) {
      toast({
        variant: "destructive",
        title: "Missing details",
        description: "Enter team name",
      });
      return;
    }

    // Check for any empty member fields
    if (
      members.some(
        (member) =>
          !member.name ||
          !member.email ||
          !member.phone ||
          !member.rollno ||
          !member.branch
      )
    ) {
      toast({
        variant: "destructive",
        title: "Missing details",
        description: "All fields are required. Please fill in missing fields.",
      });
      return;
    }

    const invalidEmailMembers = members.filter(
      (member) => !emailPattern.test(member.email)
    );

    const invalidRollNumberMembers = members.filter(
      (member) => !rollNumberPattern.test(member.rollno)
    );

    const invalidPhoneNumberMembers = members.filter(
      (member) => !phoneNumberPattern.test(member.phone)
    );

    if (invalidEmailMembers.length > 0) {
      const invalidNames = invalidEmailMembers.map((m) => m.name).join(", ");
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: `Ensure the email addresses for ${invalidNames} are valid.`,
      });
      return;
    }

    if (invalidRollNumberMembers.length > 0) {
      const invalidNames = invalidRollNumberMembers
        .map((m) => m.name)
        .join(", ");
      toast({
        variant: "destructive",
        title: "Invalid Roll Number",
        description: `Ensure the roll numbers for ${invalidNames} are valid.`,
      });
      return;
    }

    if (invalidPhoneNumberMembers.length > 0) {
      const invalidNames = invalidPhoneNumberMembers
        .map((m) => m.name)
        .join(", ");
      toast({
        variant: "destructive",
        title: "Invalid Phone Number",
        description: `Ensure the phone numbers for ${invalidNames} are valid.`,
      });
      return;
    }

    // If all checks pass, proceed
    setShowPopup(true);
    const teamDetails = { teamName, members };
    console.log(JSON.stringify(teamDetails, null, 2));
  };

  const handlePopupResponse = (response) => {
    if (response) {
      const teamDetails = {
        teamName: teamName,
        members: members,
        recaptchaToken: captchaToken,
      };

      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/register`, teamDetails)
        .then((res) => {
          if (res.status === 201) {
            const { teamId: receivedTeamId } = res.data;
            navigate("/success", {
              state: { teamId: receivedTeamId, teamName },
            });
            setShowPopup(false);
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Something went wrong.",
            });
          }
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.response
              ? error.response.data.error
              : "Server error",
          });
          console.error("Error while registering:", error);
        });
    } else {
      setShowPopup(false);
    }
  };

  // Callback for reCAPTCHA
  const onCaptchaChange = (token) => {
    if (token) {
      setCaptchaToken(token);
    }
  };

  return (
    <div>
      {members.map((member, index) => (
        <Transition
          as={React.Fragment}
          key={index}
          appear={true}
          show={true}
          enter="transform transition ease-in-out duration-500"
          enterFrom="translate-x-full opacity-0"
          enterTo="translate-x-0 opacity-100"
        >
          <div style={{ transitionDelay: `${index * 100}ms` }}>
            <RegisterBlock
              member={member}
              saveMemberDetails={(newMember) =>
                saveMemberDetails(index, newMember)
              }
              index={index + 1}
              copyMember={copyMember}
              setCopyMember={(member) => setCopyMember(member)}
            />
          </div>
        </Transition>
      ))}

      {/* CAPTCHA Integration */}
      <div className="py-4">
        <ReCAPTCHA sitekey={import.meta.env.VITE_CAPTCHA_KEY} onChange={onCaptchaChange} />
      </div>

      <Button
        className="w-full font-bold font-raleway text-xl py-6"
        onClick={submitDetails}
      >
        SUBMIT
      </Button>

      {showPopup && (
        <PopupDialog
          teamName={teamName}
          members={members}
          onResponse={handlePopupResponse}
        />
      )}
    </div>
  );
}

export default RegisterForm;
