import React from "react";
import ButtonComponent from "../components/ButtonComponent";

const ExplorePage = () => {

  return (
    <>
        <div className="explore-page-container bg-main w-[100vw] m-1">
    <div className="county-container w-[90vw] h-25 border-1 border-red-500">
      <div><span className="text-black">Select your county:</span></div>
      <div className="county-buttons-container">
      <ButtonComponent text="Linn"/>
      <ButtonComponent text="Tillamook"/>
      <ButtonComponent text="Lincoln"/>
    </div>
    </div>
    <div className="company-container block w-[90vw] border-1 border-blue-500">
    </div>
    <div className="plans-container w-[90vw] border-1 border-pink-500">

      </div>
      <footer className="disclaimer-footer">
      <span className="text-black">Not connected with or endorsed by the United States government or the federal Medicare program.</span>

      </footer>
    </div>
    </>
  )
};

export default ExplorePage;