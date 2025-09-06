import React from "react";
import "../App.css"
import ButtonComponent from "../components/ButtonComponent";
import EmployeeCard from "../components/EmployeeCard";
import { openModal } from "../features/modal/ShowContactFormSlice";
import { useDispatch } from "react-redux";

const LandingPage = () => {
  const dispatch = useDispatch();

  return (
    <>
    <div className="landing-page-container bg-main w-[100vw] m-1">
    <div className="headline-container w-[90vw] h-25 border-1 border-red-500">
      <h1 className="text-black">Medicare News!</h1>
      <ButtonComponent text="Request a call!" onPress={() => dispatch(openModal())}/>
    </div>
    <div className="company-images-container block w-[90vw] border-1 border-blue-500">
      <EmployeeCard />
      <EmployeeCard />
      <EmployeeCard />
      <EmployeeCard />
    </div>
    <div className="company-text-container w-[90vw] border-1 border-pink-500">
      <span className="text-black">
        If you are going to work with a company to partner with you in your healthcare needs, you want to know a little about them.  
        As we would want to know about you, we want you to know about us as well.  
        As a company, JMCole Group is a part of the Medicare Plans Resource Center located in Eugene, Oregon.
        We have partnered with hundreds of individuals throughout the state or Oregon to get them the very best Medicare coverage that fits their needs. 
      </span>
      </div>
      <footer className="disclaimer-footer">
      <span className="text-black">Not connected with or endorsed by the United States government or the federal Medicare program.</span>

      </footer>
    </div>
    </>
  )
}

export default LandingPage;