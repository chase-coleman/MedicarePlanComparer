import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import NavbarComponent from "./components/NavbarComponent";
import { useSelector } from "react-redux";
import Modal from "./components/Modal";
import RequestContactForm from "./components/RequestContactForm";
import RsvpForm from "./components/RsvpForm";

function App() {
  const showContactForm = useSelector((state) => state.showContactForm.value);
  const county = useSelector((state) => state.county.value); // selected county value
  const showRsvpForm = useSelector((state) => state.showRsvpForm.value);
  const meeting = useSelector((state) => state.meetingRsvp.value);

  return (
    <>
      <NavbarComponent />
      <Outlet />
      <footer className="disclaimer-footer p-1">
        <span className="text-gray-500 text-[.75em]">DISCLAIMERS:</span> <br />
        <span className="text-gray-500 text-[.75em]">
          Not connected with or endorsed by the United States government or the
          federal Medicare program.
        </span>{" "}
        <br />
        <span className="text-gray-500 text-[.75em]">
          Plan availability, benefits, premiums, and costs may change on January
          1 of each year. Information provided here is current as of 09/2025,
          but is subject to change.
        </span>{" "}
        <br />
        {county === "Linn" ? (
          <span className="text-gray-500 text-[.75em]">
            We do not offer every plan available in your area. In Linn County,
            we represent 5 organizations which offer 21 products in the county.
            Please contact Medicare.gov, 1-800-MEDICARE, or your local State
            Health Insurance Assistance Program (SHIP) to get information on all
            of your options.
          </span>
        ) : county === "Lincoln" ? (
          <span className="text-gray-500 text-[.75em]">
            We do not offer every plan available in your area. In Lincoln
            County, we represent 1 organization which offer 4 products in the
            county. Please contact Medicare.gov, 1-800-MEDICARE, or your local
            State Health Insurance Assistance Program (SHIP) to get information
            on all of your options.
          </span>
        ) : county === "Tillamook" ? (
          <span className="text-gray-500 text-[.75em]">
            We do not offer every plan available in your area. In Tillamook
            County, we represent 1 organization which offer 4 products in the
            county. Please contact Medicare.gov, 1-800-MEDICARE, or your local
            State Health Insurance Assistance Program (SHIP) to get information
            on all of your options.
          </span>
        ) : (
          <span className="text-gray-500 text-[.75em]">
            We do not offer every plan available in your area. Please contact
            Medicare.gov, 1-800-MEDICARE, or your local State Health Insurance
            Assistance Program (SHIP) to get information on all of your options.
          </span>
        )}{" "}
        <br />
        <span className="text-gray-500 text-[.75em]">
          JMColegroup complies with applicable Federal civil rights laws and
          does not discriminate on the basis of race, color, national origin,
          age, disability, or sex. ATTENTION: If you speak a language other than
          English, language assistance services, free of charge, are available
          to you. Call 1-800-MEDICARE (TTY: 1-877-486-2048).
        </span>
      </footer>
      {showContactForm && (
        <Modal>
          <RequestContactForm />
        </Modal>
      )}
      {showRsvpForm && (
        <Modal>
          <RsvpForm />
        </Modal>
      )}
    </>
  );
}

export default App;
