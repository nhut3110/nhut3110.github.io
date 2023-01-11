import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import Select from "react-select";
import "./AddList.css";
export default function AddList({
  onClose,
  visible,
  type,
  url,
  edit,
  data,
  share,
  setTasks,
  setTodos,
  getSharedUsers,
}) {
  const listName = useRef();
  const listDes = useRef();
  const listEmail = useRef();
  const [users, setUsers] = useState([]);
  const [path, setPath] = useState("");
  const [errors, setErrors] = useState("");
  const [editData, setEditData] = useState({});
  const [permission, setPermission] = useState("");
  const user = JSON.parse(localStorage.getItem("task-user"));
  // prettier-ignore
  // console.log(user)
  const headers = {
    "access-token": user.access_token,
    uid: user.uid,
    client: user.client,
  };
  // console.log(url);

  const options = [
    { value: "false", label: "View" },
    { value: "true", label: "Edit" },
  ];

  const getTasks = async () => {
    await axios
      .get("https://dev.thanqminh.com:3000/task_lists", { headers: headers })
      .then((resp) => {
        setTasks(resp.data);
        console.log(resp.data);
      });
  };

  useEffect(() => {
    getUsers();
    if (!share) {
      if (type === "task" && !edit)
        setPath("https://dev.thanqminh.com:3000/task_lists");
      if (type === "todo" || (type == "task" && edit)) setPath(url);
    } else {
      setPath(url);
    }
  }, []);

  const getUsers = async () => {
    const res = await axios.get("https://dev.thanqminh.com:3000/users", {
      headers: headers,
    });
    // console.log(res.data);
    setUsers(res.data);
  };

  const handleOnClose = (e) => {
    if (e.target.id === "NewList") {
      setErrors("");
      onClose();
    }
  };
  if (!visible) return null;

  const handleEdit = async (e) => {
    const editName =
      listName.current.value === "" ? data.name : listName.current.value;
    const editDescription =
      listDes.current.value === "" ? data.description : listDes.current.value;
    try {
      const res = await axios.put(
        path,
        {
          name: editName,
          description: editDescription,
        },
        {
          headers: headers,
        }
      );
      // console.log(res);
      // console.log(path);
      onClose();
      if (type == "todo") setTodos();
      if (type == "task") getTasks();
      // setTimeout(() => {
      //   window.location.reload();
      // }, 100);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreate = async (e) => {
    // e.preventDefault();
    try {
      const res = await axios.post(
        path,
        {
          name: listName.current.value,
          description: listDes.current.value,
        },
        {
          headers: headers,
        }
      );
      // console.log(res);
      onClose();
      if (type == "todo") setTodos();
      if (type == "task") getTasks();
      // const timeout = setTimeout(() => {
      //   window.location.reload();
      // }, 100);
      // clearTimeout(timeout);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (selectedOption) => {
    setPermission(selectedOption.value);
    console.log(permission);
  };

  const handleShare = async (e) => {
    const id = url.split("/")[4];
    console.log(id);
    const inviteUser = users.filter(
      (e) => e.email === listEmail.current.value
    )[0];
    console.log(inviteUser);
    if (inviteUser !== undefined) {
      if (permission !== "") {
        setErrors("");
        console.log("success");
        try {
          const res = await axios.post(
            url,
            {
              user_id: inviteUser.id,
              task_list_id: id,
              is_write: permission,
            },
            {
              headers: headers,
            }
          );
          console.log(res);
          if (getSharedUsers) getSharedUsers();
          onClose();
        } catch (error) {
          console.log(error);
        }
      } else {
        setErrors("Please choose the permission*");
      }
    } else {
      setErrors("Invalid email*");
    }
  };

  const handleEditShare = async (e) => {
    e.preventDefault();
    const id = url.split("/")[4];
    console.log(id);
    const inviteUser = users.filter((e) => e.email === data.email)[0];
    console.log(inviteUser);
    try {
      const res = await axios.delete(url + "/" + data.id, {
        headers: headers,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
    if (inviteUser !== undefined) {
      if (permission !== "") {
        setErrors("");
        console.log("success");
        try {
          const res = await axios.post(
            url,
            {
              user_id: inviteUser.id,
              task_list_id: id,
              is_write: permission,
            },
            {
              headers: headers,
            }
          );
          console.log(res);
          if (getSharedUsers) getSharedUsers();
          onClose();
        } catch (error) {
          console.log(error);
        }
      } else {
        setErrors("Please choose the permission*");
      }
    } else {
      setErrors("Invalid email*");
    }
  };
  console.log(data);

  return (
    <div className="modal__createList" id="NewList" onClick={handleOnClose}>
      <div className="modal__createList-box">
        <div className="modal__createList-header">
          <h1>
            {" "}
            {share
              ? "Sharing with everyone"
              : edit
              ? "Let's edit something"
              : "Create something new!"}
          </h1>
          <p className="btn__close" onClick={onClose} type="">
            x
          </p>
        </div>
        {!share ? (
          <div>
            <input
              className="List__name"
              placeholder={edit ? data.name : "Type new name here"}
              ref={listName}
              required
            />
            <input
              className="List__name"
              placeholder={
                edit ? data.description : "Give me some new description"
              }
              ref={listDes}
            />
          </div>
        ) : (
          <div>
            <input
              className="List__name"
              placeholder={edit ? data.email : "Enter Email to invite"}
              ref={listEmail}
              disabled={edit ? true : false}
            />
            {errors !== "" ? <p className="List__error">{errors}</p> : null}
            <div className="List__permission">
              <p className="List__info">Permission:</p>
              {/* <input type="checkbox" className="List__checkbox" /> */}
              <Select
                options={options}
                className="List__seclect"
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        <button
          className="btn__create"
          onClick={
            share
              ? edit
                ? handleEditShare
                : handleShare
              : edit
              ? handleEdit
              : handleCreate
          }
        >
          {share ? "Share" : edit ? "Edit" : "Create"}
        </button>
      </div>
    </div>
  );
}
