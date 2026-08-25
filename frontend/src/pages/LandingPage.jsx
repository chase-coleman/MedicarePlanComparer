import React from "react";
import "../App.css";
import ButtonComponent from "../components/ButtonComponent";
import EmployeeCard from "../components/EmployeeCard";
import { openModal } from "../features/modal/ShowContactFormSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const dispatch = useDispatch();

  return (
    <>
      <div className="landing-page-container w-[100vw]">
        <div className="headline-container w-[90vw]">
          <span className="eyebrow">Medicare Annual Enrollment</span>
          <h1 className="page-title">
            Explore Medicare plans in your area today
          </h1>
          <p className="lede">
            Find the coverage that fits you — even if your insurance company is
            leaving your county.
          </p>
          <ButtonComponent
            styling="bg-accent text-white px-6 h-11 text-base"
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
              <span>Tillamook Office</span>
              <span>Mon – Sat</span>
            </div>
            <div className="office-hours-row">
              <span>Newport Walmart Kiosk</span>
              <span>Mon – Thu</span>
            </div>
            <div className="office-hours-row">
              <span>Lebanon Walmart Kiosk</span>
              <span>Mon – Fri</span>
            </div>
            <p className="broker-email mt-3">
              2018 Henson Plaza, Hwy 101, Tillamook
            </p>
          </div>
        </div>
        <div className="company-images-container block w-[90vw]">
          <EmployeeCard
            imgSource="/john-main.jpg"
            broker="John Coleman"
            phone="541-554-8382"
            email="john@mprc.info"
            npn="18136647"
          />
          <EmployeeCard
            imgSource="/matt-main.jpg"
            broker="Matt Buck"
            phone="541-285-8998"
            email="matt22buck@gmail.com"
            npn="21435734"
          />
          <EmployeeCard
            imgSource="/garin-main.jpg"
            broker="Garin Coleman"
            phone="541-510-9685"
            email="garin@mprc.info"
            npn="21248588"
          />
          <EmployeeCard
            imgSource="/chase-main.jpg"
            broker="Chase Coleman"
            phone="541-554-5916"
            email="chase@mprc.info"
            npn="20318912"
          />
        </div>
        <div className="company-text-container w-[90vw] bg-brand">
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
