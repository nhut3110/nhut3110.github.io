import "./SingleTask.css";
import editIcon from "../../assets/img/editOpts.svg";
import cloneIcon from "../../assets/img/clone.svg";
import trashIcon from "../../assets/img/trash.svg";
import AddList from "../AddList/AddList";
import axios from "axios";
import { useState } from "react";
import { ConfirmDialog } from "../Comfirm Dialog/ConfirmDialog";

export default function SingleTask({ setTodos, todo, url, share }) {
  const [showAddList, setShowAddList] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [done, setDone] = useState(todo.done);
  const user = JSON.parse(localStorage.getItem("task-user"));
  const path = url + "/" + todo.id;
  // prettier-ignore
  const headers = {
    "access-token": user.access_token,
    'uid': user.uid,
    'client': user.client,
  };
  //   console.log(todo);
  const handleAddList = () => {
    setShowAddList(!showAddList);
  };

  const handleDeleteBox = async () => {
    setShowDialog(true);
  };

  const handleShowDialog = () => {
    setShowDialog(!showDialog);
  };

  const handleDelete = async (e) => {
    try {
      await axios.delete(path, {
        headers: headers,
      });
      setTodos();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDuplicate = async (e) => {
    try {
      await axios.post(
        url,
        {
          name: todo.name,
          description: todo.description,
        },
        {
          headers: headers,
        }
      );
      setTodos();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckboxChange = async (e) => {
    await axios.patch(
      path,
      {
        done: !todo.done,
      },
      {
        headers: headers,
      }
    );
    setDone(!done);
    setTodos();
  };
  return (
    <div className="task__container">
      <div className="task__container-name">
        <input
          id="task__checkbox"
          type="checkbox"
          defaultChecked={todo.done}
          onChange={handleCheckboxChange}
          disabled={share === null || share === true ? false : true}
        />

        <p
          id="task__name"
          style={{
            ...(done
              ? {
                  textDecorationLine: "line-through",
                  fontStyle: "italic",
                }
              : {}),
          }}
        >
          {todo.name}
        </p>
        {/* <p>hehe</p> */}
      </div>
      {share === null || share === true ? (
        <div>
          <img src={editIcon} alt="" onClick={() => setShowAddList(true)} />
          <img src={cloneIcon} alt="" onClick={handleDuplicate} />
          <img src={trashIcon} alt="" onClick={handleDeleteBox} />
        </div>
      ) : null}

      <AddList
        onClose={handleAddList}
        visible={showAddList}
        type={"todo"}
        edit={true}
        url={path}
        setTodos={setTodos}
        data={{ name: todo.name, description: todo.description }}
      />
      <ConfirmDialog
        onClose={handleShowDialog}
        visible={showDialog}
        handleDelete={handleDelete}
      />
    </div>
  );
}
