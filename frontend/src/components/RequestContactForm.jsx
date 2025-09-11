import { Input } from "@heroui/react";
import { useState } from "react";
import ButtonComponent from "./ButtonComponent";
import { useDispatch } from "react-redux";
import { closeModal } from "../features/modal/ShowContactFormSlice";


const RequestContactForm = () => {
  const [fName, setFname] = useState("");
  const [lName, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const dispatch = useDispatch()


  return (
    <div className="contact-form-container w-full">
      <form
        className="contact-form p-4 gap-4 bg-blue-500"
        // NOTE: If any field is invalid, this handler won't run (native validation blocks submit)
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <ButtonComponent text="Close" onPress={() => dispatch(closeModal())}/>
        <Input
          name="firstName"
          label="First Name"
          type="text"
          isRequired
          value={fName}
          onChange={(e) => setFname(e.target.value)}
        />

        <Input
          name="lastName"
          label="Last Name"
          type="text"
          isRequired
          value={lName}
          onChange={(e) => setLname(e.target.value)}
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
          // dynamically show the right error message for validation fails
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
        />
        <ButtonComponent text="Submit" className="text-black" type="submit"/>
      </form>
    </div>
  );
};

export default RequestContactForm;
