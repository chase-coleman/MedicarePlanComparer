import "../App.css";
import ButtonComponent from "../components/ButtonComponent";
import EmployeeCard from "../components/EmployeeCard";
import { BROKERS } from "../data/brokers";
import { openModal } from "../features/modal/ShowContactFormSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const dispatch = useDispatch();

  return (
    <>
      <div className="landing-page-container w-[100vw]">
        <div className="headline-container w-[90vw]">
          <span className="eyebrow">Medicare Annual Enrollment begins October 15</span>
          <h1 className="page-title">
            Explore Medicare plans in your area today
          </h1>
          <p className="lede">
            Find the coverage that fits you — simplified.
          </p>
          <ButtonComponent
            styling="bg-accent px-6 h-11 text-base"
            text="Request a call"
            onPress={() => dispatch(openModal())}
          />
          <Link as={Link} to="/find-meeting" className="meeting-cta">
            Find a Medicare meeting <span>near you</span>
          </Link>
          <div className="office-hours">
            <p className="office-hours-title">
              Find us during the Annual Enrollment Period
            </p>
            <div className="office-hours-row">
              <span>Astoria Walmart Kiosk</span>
              <span>Mon – Sat</span>
            </div>
            <div className="office-hours-row">
              <span>Newport Walmart Kiosk</span>
              <span>Mon – Thu</span>
            </div>
            <div className="office-hours-row">
              <span>Lebanon Walmart Kiosk</span>
              <span>Mon – Wed, Fri, Sat</span>
            </div>
            <div className="office-hours-row">
              <span>Albany Walmart Kiosk</span>
              <span>Friday</span>
            </div>
            <div className="office-hours-row">
              <span>McMinnville Walmart Kiosk</span>
              <span>Wed - Sun</span>
            </div>
          </div>
        </div>
        <div className="company-images-container block w-[90vw]">
          {BROKERS.map((broker) => (
            <EmployeeCard
              key={broker.broker}
              imgSource={broker.imgSource}
              broker={broker.broker}
              phone={broker.phone}
              email={broker.email}
              npn={broker.npn}
            />
          ))}
        </div>
        <div className="company-text-container w-[90vw]">
          <span className="about-heading">About JMCole Group</span>
          <span className="about-body">
            If you are going to work with a company to partner with you in your
            healthcare needs, you want to know a little about them. As we would
            want to know about you, we want you to know about us as well. As a
            company, JMCole Group is a part of the Medicare Plans Resource
            Center located in Eugene, Oregon. We have partnered with hundreds of
            individuals throughout the state or Oregon to get them the very best
            Medicare coverage that fits their needs.
          </span>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
