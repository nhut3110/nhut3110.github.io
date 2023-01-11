import React from "react";
import ReactLoading from "react-loading";
import "./Loading.css";
const Loading = ({ type, color }) => {
  return (
    <div>
      <ReactLoading type={type} color={color} className="Loading" />
    </div>
  );
};

export default Loading;
