import React, { useEffect } from "react";
import ButtonComponent from "../components/ButtonComponent";
import { useSelector, useDispatch } from "react-redux";
import { setCounty } from "../features/county/countySlice";

const ExplorePage = () => {
  const dispatch = useDispatch(); // redux state updater
  const county = useSelector((state) => state.county.value); // current redux state's value

  useEffect(() => {
    console.log("county:", county)
  }, [county])

  return (
    <>
        <div className="explore-page-container bg-main w-[100vw] m-1">
    <div className="county-container w-[90vw] h-25 border-1 border-red-500">
      <div><span className="text-black">Select your county:</span></div>
      <div className="county-buttons-container">
      <ButtonComponent text="Linn" onPress={() => dispatch(setCounty("Linn"))} className={county == `Linn` && `bg-red-500`} />
      <ButtonComponent text="Tillamook" onPress={() => dispatch(setCounty("Tillamook"))} className={county == `Tillamook` && `bg-red-500`}/>
      <ButtonComponent text="Lincoln" onPress={() => dispatch(setCounty("Lincoln"))} className={county == `Lincoln` && `bg-red-500`}/>
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