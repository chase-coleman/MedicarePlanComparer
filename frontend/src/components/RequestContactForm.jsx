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
        `${API_URL}api/request-call`,
        contactInfo,
      );
      if (response.status === 202) {
        setSubmittedSuccessfully(true);
      } else {
        console.warn(
          "There was an issue submitting your request. Please refresh and try again. If the error persists, please call us directly!",
        );
      }
    } catch (error) {
      dispatch(setErrorMsg(parseAxiosError(error)));
    }
  };

  return (
    <div className="contact-form-container w-full">
      {submittedSuccessfully ? (
        <div className="submit-success p-8 gap-4">
          <div className="submit-success-icon">
            <CircleCheckBig size={32} strokeWidth={2.25} />
          </div>
          <p className="submit-success-title">Request submitted successfully</p>
          <p className="submit-success-body">
            Someone will be contacting you soon.
          </p>
        </div>
      ) : (
        <form
          className="contact-form p-6 gap-4"
          onSubmit={(e) => handleSubmit(e)}
        >
          <div className="form-header">
            <div>
              <h2 className="form-title">Request a call</h2>
              <p className="form-subtitle">
                Tell us how to reach you and a licensed agent will follow up.
              </p>
            </div>
            <ButtonComponent
              styling="form-close"
              text="✕"
              aria-label="Close"
              onPress={() => dispatch(closeModal())}
            />
          </div>
          <Input
            name="firstName"
            label="First Name"
            type="text"
            variant="bordered"
            isRequired
            value={fName}
            onChange={(e) => setFname(e.target.value)}
            classNames={{
              errorMessage: "field-error",
              label: "field-label",
              inputWrapper: "field-wrapper",
              input: "field-input",
            }}
          />

          <Input
            name="lastName"
            label="Last Name"
            type="text"
            variant="bordered"
            isRequired
            value={lName}
            onChange={(e) => setLname(e.target.value)}
            classNames={{
              errorMessage: "field-error",
              label: "field-label",
              inputWrapper: "field-wrapper",
              input: "field-input",
            }}
          />

          <Input
            name="email"
            label="Email"
            type="email"
            variant="bordered"
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
              errorMessage: "field-error",
              label: "field-label",
              inputWrapper: "field-wrapper",
              input: "field-input",
            }}
          />

          <Input
            name="phone"
            label="Phone Number"
            type="tel"
            variant="bordered"
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
              errorMessage: "field-error",
              label: "field-label",
              inputWrapper: "field-wrapper",
              input: "field-input",
            }}
          />
          <Textarea
            label="Message"
            classNames={{
              inputWrapper: "field-wrapper",
              input: "field-input",
              label: "field-label",
              description: "field-description",
              errorMessage: "field-error",
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
            <ButtonComponent styling="bg-accent h-11 w-full">
              <Ring size={25} stroke="3" speed="2" color="#1a0f05" />
            </ButtonComponent>
          ) : (
            <ButtonComponent
              text="Submit"
              styling="bg-accent h-11 w-full"
              type="submit"
            />
          )}
          <span className="form-consent">
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
