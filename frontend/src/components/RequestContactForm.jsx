import { Input, Textarea } from "@heroui/react";
import { useState, useEffect } from "react";
import ButtonComponent from "./ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../features/modal/ShowContactFormSlice";
import { setErrorMsg } from "../features/errors/errorSlice";
import { parseAxiosError } from "../functions/axiosError";
import axios from "axios";
import { Ring } from "ldrs/react";
import "ldrs/react/Ring.css";
import { CircleCheckBig } from "lucide-react";

const API_URL = import.meta.env.VITE_API_ENDPOINT;

const RequestContactForm = () => {
  const [fName, setFname] = useState("");
  const [lName, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [msg, setMsg] = useState("");
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!submittedSuccessfully) return;

    const timer = setTimeout(() => {
      setSubmittedSuccessfully(false);
      dispatch(closeModal());
    }, 5000);

    return () => clearTimeout(timer);
  }, [submittedSuccessfully]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const contactInfo = {
      fname: fName,
      lname: lName,
      email: email,
      phone: phoneNum,
      message: msg,
    };
    try {
      const response = await axios.post(
        `${API_URL}/api/request-call`,
        contactInfo
      );
      if (response.status === 202) {
        setSubmittedSuccessfully(true);
      } else {
        console.warn(
          "There was an issue submitting your request. Please refresh and try again. If the error persists, please call us directly!"
        );
      }
    } catch (error) {
      dispatch(setErrorMsg(parseAxiosError(error)));
    }
  };

  return (
    <div className="contact-form-container w-full">
      {submittedSuccessfully ? (
        <div className="submit-success p-4 gap-10 bg-green-500">
          <CircleCheckBig color="black" size={64} />
          <h1 className="text-black text-center">
            Request Submitted Successfully. <br /> Someone will be contacting
            you soon!
          </h1>
        </div>
      ) : (
        <form
          className="contact-form p-4 gap-4 bg-[#0070cc]"
          onSubmit={(e) => handleSubmit(e)}
        >
          <ButtonComponent
            styling="bg-red text-[#FFFFFF]"
            text="Close"
            onPress={() => dispatch(closeModal())}
          />
          <Input
            name="firstName"
            label="First Name"
            type="text"
            isRequired
            value={fName}
            onChange={(e) => setFname(e.target.value)}
            classNames={{
              errorMessage: "text-[#FFFFFF] text-sm font-medium", // 🔹 change error text color
              label: "text-[#1E639A]", // optional: label styling
              inputWrapper: "bg-white", // optional: input bg
            }}
          />

          <Input
            name="lastName"
            label="Last Name"
            type="text"
            isRequired
            value={lName}
            onChange={(e) => setLname(e.target.value)}
            classNames={{
              errorMessage: "text-[#FFFFFF] text-sm font-medium", // 🔹 change error text color
              label: "text-[#1E639A]", // optional: label styling
              inputWrapper: "bg-white", // optional: input bg
            }}
          />

          <Input
            name="email"
            label="Email"
            type="email"
            validationBehavior="native"
            // require a dot after @ and at least 2 chars in the TLD
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
            errorMessage={({ validationDetails }) =>
              validationDetails.valueMissing
                ? "Please enter your email"
                : validationDetails.typeMismatch ||
                  validationDetails.patternMismatch
                ? "Please enter a valid email (e.g., name@example.com)"
                : ""
            }
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            classNames={{
              errorMessage: "text-[#FFFFFF] text-sm font-medium", // 🔹 change error text color
              label: "text-[#1E639A]", // optional: label styling
              inputWrapper: "bg-white", // optional: input bg
            }}
          />

          <Input
            name="phone"
            label="Phone Number"
            type="tel"
            autoComplete="tel"
            inputMode="numeric"
            isRequired
            validationBehavior="native"
            pattern="[0-9]{10}"
            maxLength={10}
            errorMessage={({ validationDetails }) =>
              validationDetails.valueMissing
                ? "Please enter your phone number"
                : validationDetails.patternMismatch
                ? "Enter a valid 10-digit number"
                : ""
            }
            value={phoneNum}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              setPhoneNum(digits.slice(0, 10));
            }}
            classNames={{
              errorMessage: "text-[#FFFFFF] text-sm font-medium", // 🔹 change error text color
              label: "text-[#1E639A]", // optional: label styling
              inputWrapper: "bg-white", // optional: input bg
            }}
          />
          <Textarea
            label="Message"
            classNames={{
              inputWrapper:
                "bg-[#FFFFFF] border-[#FFFFFF] focus-within:border-[#FFFFFF]", // border + focus color
              input: "text-black placeholder:text-black", // text + placeholder
              label: "!text-black font-semibold", // label color
              description: "text-[#FFFFFF]", // counter text
            }}
            placeholder="Enter anything you'd like us to know!"
            variant="bordered"
            value={msg}
            onChange={(e) => setMsg(e.target.value)} // normal handler
            maxLength={250} // prevents typing/paste beyond 1000
            description={`${msg.length}/250`}
            errorMessage={
              msg.length >= 250 && "You’ve reached the 250 character limit"
            }
          />
          {submitting ? (
            <ButtonComponent styling="bg-red text-[#FFFFFF]">
              <Ring size={25} stroke="3" speed="2" color="white" />
            </ButtonComponent>
          ) : (
            <ButtonComponent
              text="Submit"
              styling="bg-red text-[#FFFFFF]"
              type="submit"
            />
          )}
          <span className="text-sm text-center">
            By submitting this form, you agree that a licensed sales agent may
            contact you by phone, text, or email to discuss Medicare Advantage,
            Prescription Drug, and Medicare Supplement Insurance plans.
          </span>
        </form>
      )}
    </div>
  );
};

export default RequestContactForm;
