import axios from "axios";
import React from "react";
import { useRef } from "react";
import { useState } from "react";
import "./SearchBox.css";
const SearchBox = ({ onClose, visible, data, headers, shared }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const typingTimeoutRef = useRef(null);

  const handleOnClose = (e) => {
    if (e.target.id === "SearchBox") {
      onClose();
    }
  };
  if (!visible) return null;

  const handleTaskName = (id) => {
    const task = data.filter((e) => e.id === id)[0];
    return task.name === undefined ? "null" : task.name;
  };
  console.log(data);
  const handleSubmit = async (obj) => {
    console.log(obj.searchTerm);
    const res = await axios.get(
      `https://dev.thanqminh.com:3000/search/${obj.searchTerm}`,
      { headers: headers }
    );
    console.log(res.data);
    const tempArray = [];
    res.data.map((item) => {
      if (data.filter((e) => e.id === item.task_list_id).length > 0) {
        const tempValue = data.filter((e) => e.id === item.task_list_id)[0];
        if (!shared) tempArray.push(item);
        else {
          // tempArray.push(item + tempValue.is_write ? "/edit" : "");
          tempArray.push({
            ...item,
            permission: tempValue.is_write ? true : false,
          });
        }
        console.log(tempArray);
      }
    });
    setSearchResult(tempArray);
  };

  const handleSearch = (e) => {
    const tempValue = e.target.value;
    setSearchTerm(tempValue);

    // if (!handleSubmit) return;
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      const formValues = {
        searchTerm: tempValue,
      };

      handleSubmit(formValues);
    }, 1000);
  };

  return (
    <div className="modal__searchBox" id="SearchBox" onClick={handleOnClose}>
      <div className="modal__searchBox-box">
        <div className="modal__searchBox-header">
          <h1>Let's search something!</h1>
          <p
            className="btn__close"
            onClick={() => {
              setSearchResult([]);
              onClose();
            }}
            type=""
          >
            x
          </p>
        </div>
        <div className="searchBox__container">
          <input
            className="searchBox__input"
            type={"text"}
            onChange={handleSearch}
          />
          {searchResult.map((result, idx) => (
            <div className="searchBox__singleResult">
              <div className="searchBox__singleResult-todo">
                <input
                  type={"checkbox"}
                  defaultChecked={result.done == null ? false : result.done}
                />
                <p className="searchBox__singleResult-name">{result.name}</p>
              </div>
              <a
                href={
                  shared
                    ? result.permission
                      ? `/task/${result.task_list_id}/shared/edit`
                      : `/task/${result.task_list_id}/shared`
                    : `/task/${result.task_list_id}`
                }
              >
                {handleTaskName(result.task_list_id)}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
