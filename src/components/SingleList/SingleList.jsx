import verticalDots from "../../assets/img/verticalDots.svg";
import { useEffect, useRef, useState } from "react";
import "./SingleList.css";
import { ListOpts } from "../../components";
import { Link } from "react-router-dom";
import React from "react";

function useComponentVisible(initialIsVisible) {
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialIsVisible);
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  return { ref, isComponentVisible, setIsComponentVisible };
}

const SingleList = ({ props, headers, shared, write, setTasks }) => {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  // const [showListOpts, setShowListOpts] = useState(isComponentVisible);

  const handleListOpts = () => {
    // setShowListOpts(!showListOpts);
    setIsComponentVisible(!isComponentVisible);
  };
  // console.log(props.name);

  return (
    <div className="SingleList__container" ref={ref}>
      <div class="SingleList__container-header">
        <Link
          to={
            shared
              ? write
                ? "/task/" + props.id + "/shared/edit"
                : "/task/" + props.id + "/shared"
              : "/task/" + props.id
          }
          className="SingleList__container-link"
        >
          <p>List name: {props.name}</p>
        </Link>
        {shared ? null : (
          <img onClick={handleListOpts} src={verticalDots} alt="options" />
        )}
      </div>
      {isComponentVisible && (
        <ListOpts
          url={"https://dev.thanqminh.com:3000/task_lists/" + props.id}
          data={props}
          headers={headers}
          shared={shared}
          setTasks={setTasks}
          show={setIsComponentVisible}
        />
      )}
      <div className="SingList__desc">
        <p>{props.description}</p>
      </div>
    </div>
  );
};

export default SingleList;
