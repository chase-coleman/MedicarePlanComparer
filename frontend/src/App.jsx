import { AFFILIATION_DISCLAIMER, CURRENT_INFO_DISCLAIMER, JMCOLE_DISCLAIMER, LINCOLN_CO_DISCLAIMER, LINN_CO_DISCLAIMER, PLAN_OFFERING_DISCLAIMER, TILLAMOOK_CO_DISCLAIMER, TRADEMARK_NOTICE } from "./data/constants";
import { Outlet } from "react-router-dom";
import "./App.css";
import NavbarComponent from "./components/NavbarComponent";
import { useSelector, useDispatch } from "react-redux";
import Modal from "./components/Modal";
import RequestContactForm from "./components/RequestContactForm";
import RsvpForm from "./components/RsvpForm";
import ComparisonNoticeModal from "./components/ComparisonNoticeModal";
import { clearNotice } from "./features/plans/comparedPlansSlice";

function App() {
  const showContactForm = useSelector((state) => state.showContactForm.value);
  const county = useSelector((state) => state.county.value); // selected county value
  const showRsvpForm = useSelector((state) => state.showRsvpForm.value);
  const meeting = useSelector((state) => state.meetingRsvp.value);
  const comparisonNotice = useSelector((state) => state.comparedPlans.notice);
  const dispatch = useDispatch();

  return (
    <>
      <NavbarComponent />
      <Outlet />
      <footer className="disclaimer-footer">
        <div className="disclaimer-inner">
          <span className="disclaimer-label">Disclaimers</span>
          <p>
            {AFFILIATION_DISCLAIMER}
          </p>
          <p>
            {CURRENT_INFO_DISCLAIMER}
          </p>
          {county === "Linn" ? (
            <p>
              {LINN_CO_DISCLAIMER}
            </p>
          ) : county === "Lincoln" ? (
            <p>
              {LINCOLN_CO_DISCLAIMER}
            </p>
          ) : county === "Tillamook" ? (
            <p>
              {TILLAMOOK_CO_DISCLAIMER}
            </p>
          ) : (
            <p>
              {PLAN_OFFERING_DISCLAIMER}
            </p>
          )}
          <p>
            {JMCOLE_DISCLAIMER}
          </p>
          <p className="trademark-notice">{TRADEMARK_NOTICE}</p>
        </div>
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
      {comparisonNotice && (
        <Modal onBackdropClick={() => dispatch(clearNotice())}>
          <ComparisonNoticeModal />
        </Modal>
      )}
    </>
  );
}

export default App;
