import React from "react";
import { useDispatch } from "react-redux";
import { hello } from "../../redux/features/homeSlice";

const HomeContainer = () => {
  const dispatch = useDispatch();

  return (
    <div className="">
      {process.env.NEXT_PUBLIC_APIURL}
      <button className="block border hover:text-red-500" onClick={() => dispatch(hello())}>Click Me</button>
    </div>
  );
};

export default HomeContainer;
