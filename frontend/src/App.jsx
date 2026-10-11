import {
  AFFILIATION_DISCLAIMER,
  CURRENT_INFO_DISCLAIMER,
  countyDisclaimer,
  JMCOLE_DISCLAIMER,
  TRADEMARK_NOTICE,
} from "./data/constants/disclaimers";
import { JMCOLE_SITE_URL } from "./data/constants/links";
import { Outlet } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { useScrollToTopOnNavigate } from "./functions/scrollRestoration";
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
  useScrollToTopOnNavigate();

  return (
    <>
      <NavbarComponent />
      <Outlet />
      <footer className="disclaimer-footer">
        <div className="disclaimer-inner">
          {/* Leaves this site, so it opens in a new tab and says so. */}
          <a
            href={JMCOLE_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Visit our brokerage website
            <ExternalLink size={14} strokeWidth={2.25} aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <span className="disclaimer-label">Disclaimers</span>
          <p>
            {AFFILIATION_DISCLAIMER}
          </p>
          <p>
            {CURRENT_INFO_DISCLAIMER}
          </p>
          {/* Counties without their own disclaimer fall back to the generic
              plan-offering language, so adding a county never leaves the
              footer without a CMS-required notice. */}
          <p>
            {countyDisclaimer(county)}
          </p>
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
