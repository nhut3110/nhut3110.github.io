import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import trashIcon from "../../assets/img/trash.svg";
import editIcon from "../../assets/img/editOpts.svg";
import "./SharedTable.css";
import AddList from "../AddList/AddList";
const SharedTable = ({
  onClose,
  visible,
  url,
  headers,
  setSharedUsers,
  sharedUsers,
}) => {
  const [users, setUsers] = useState([]);
  const [ID, setID] = useState("");
  const [email, setEmail] = useState("");
  // const [sharedUsers, setSharedUsers] = useState([]);
  const [showAddList, setShowAddList] = useState(false);
  const handleOnClose = (e) => {
    if (e.target.id === "ShareTable") {
      onClose();
    }
  };

  const handleAddList = () => {
    setShowAddList(!showAddList);
  };

  const handleDelete = async ({ id }) => {};

  const getSharedUsers = async (e) => {
    const res = await axios.get(url, { headers: headers });
    // console.log(res.data);
    setSharedUsers(res.data);
  };

  const getUsers = async (e) => {
    const res = await axios.get("https://dev.thanqminh.com:3000/users", {
      headers: headers,
    });
    // console.log(res.data);
    setUsers(res.data);
  };

  useEffect(() => {
    getSharedUsers();
    getUsers();
  }, []);

  if (!visible) return null;
  return (
    <div className="modal__sharedTable" id="ShareTable" onClick={handleOnClose}>
      <div className="modal__sharedTable-box">
        <div className="modal__sharedTable-header">
          <h1>Collaborators</h1>
          <p className="btn__close" onClick={onClose} type="">
            x
          </p>
        </div>
        <div>
          {sharedUsers.map((item) => (
            <div className="SharedUser__container">
              <p>
                <strong>
                  {users.filter((e) => e.id === item.user_id)[0].email}
                </strong>
                {item.is_write ? " (can write)" : null}
              </p>
              <div className="SharedUser__operation">
                <img
                  src={editIcon}
                  alt=""
                  onClick={() => {
                    setID(item.user_id);
                    setEmail(
                      users.filter((e) => e.id === item.user_id)[0].email
                    );
                    setShowAddList(true);
                    getSharedUsers();
                  }}
                />
                <img
                  src={trashIcon}
                  alt=""
                  onClick={async () => {
                    try {
                      const res = await axios.delete(url + "/" + item.user_id, {
                        headers: headers,
                      });
                      console.log(res);
                      getSharedUsers();
                      console.log(item.user_id);
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <AddList
        onClose={handleAddList}
        visible={showAddList}
        edit={true}
        share={true}
        getSharedUsers={getSharedUsers}
        data={{
          id: ID,
          email: email,
        }}
        url={url}
      />
    </div>
  );
};

export default SharedTable;
