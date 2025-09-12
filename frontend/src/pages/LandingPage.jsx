import React from "react";
import "../App.css";
import ButtonComponent from "../components/ButtonComponent";
import EmployeeCard from "../components/EmployeeCard";
import { openModal } from "../features/modal/ShowContactFormSlice";
import { useDispatch } from "react-redux";

const LandingPage = () => {
  const dispatch = useDispatch();

  return (
    <>
      <div className="landing-page-container w-[100vw] mt-2 m-2">
        <div className="headline-container border-red-500 w-[90vw] h-25 gap-4">
          <span className="text-black font-bold text-xl">
            Explore Medicare Plans in Your Area Today — Find the Coverage That
            Fits You, Even if Your Insurance Company is Leaving Your County.
          </span>
          <ButtonComponent
            styling="bg-red border-[#A4161A] text-[#FFFFFF]"
            text="Request a call!"
            onPress={() => dispatch(openModal())}
          />
        </div>
        <div className="company-images-container block w-[90vw]">
          <EmployeeCard
            imgSource="../public/john-main.jpg"
            broker="John Coleman"
            phone="541-554-8382"
            email="john@mprc.info"
            npn="18136647"
          />
          <EmployeeCard
            imgSource="../public/matt-main.jpg"
            broker="Matt Buck"
            phone="541-285-8998"
            email="matt22buck@gmail.com"
            npn="21435734"
          />
          <EmployeeCard
            imgSource="../public/garin-main.jpg"
            broker="Garin Coleman"
            phone="541-510-9685"
            email="garin@mprc.info"
            npn="21248588"
          />
          <EmployeeCard
            imgSource="../public/chase-main.jpg"
            broker="Chase Coleman"
            phone="541-554-9621"
            email="chase@mprc.info"
            npn="20318912"
          />
        </div>
        <div className="company-text-container w-[90vw] bg-main">
          <span className="font-bold text-lg text-[#FFFFFF]">
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
