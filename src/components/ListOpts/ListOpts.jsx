import editIcon from "../../assets/img/editOpts.svg";
import moveIcon from "../../assets/img/upMove.svg";
import cloneIcon from "../../assets/img/clone.svg";
import trashIcon from "../../assets/img/trash.svg";
import AddList from "../AddList/AddList";
import { useEffect, useState } from "react";
import { ConfirmDialog } from "../Comfirm Dialog/ConfirmDialog";

import "./ListOpts.css";
import axios from "axios";

export default function ListOpts({ url, data, headers, setTasks, show }) {
  const [showAddList, setShowAddList] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleShowDialog = () => {
    setShowDialog(!showDialog);
  };
  const getTasks = async () => {
    await axios
      .get("https://dev.thanqminh.com:3000/task_lists", { headers: headers })
      .then((resp) => {
        setTasks(resp.data);
        console.log(resp.data);
      });
  };

  const handleDeleteBox = async () => {
    setShowDialog(true);
  };

  const handleAddList = () => {
    setShowAddList(!showAddList);
  };

  const handleEdit = async (e) => {
    setShowAddList(true);
  };

  const handleDuplicate = async (e) => {
    try {
      const res = await axios.post(
        "https://dev.thanqminh.com:3000/task_lists",
        {
          name: data.name,
          description: data.description,
        },
        {
          headers: headers,
        }
      );
      console.log(res);
      const getTodos = await axios.get(
        "https://dev.thanqminh.com:3000/task_lists/" + data.id + "/todos",
        { headers: headers }
      );
      const todos = getTodos.data;
      console.log(todos);
      todos.map(async (todo) => {
        await axios.post(
          "https://dev.thanqminh.com:3000/task_lists/" + res.data.id + "/todos",
          {
            name: todo.name,
            description: todo.description,
          },
          {
            headers: headers,
          }
        );
      });
      getTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (e) => {
    try {
      const res = await axios.delete(url, {
        headers: headers,
      });
      console.log(res);
      show(false);
      getTasks();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div id="ListOpts" class="ListOpts__box">
      <div className="ListOpts__func" onClick={handleEdit}>
        <img src={editIcon} alt="" />
        <p>Edit</p>
      </div>
      <hr />
      <div className="ListOpts__func" onClick={handleDuplicate}>
        <img src={cloneIcon} alt="" />
        <p>Duplicate</p>
      </div>
      <hr />
      <div className="ListOpts__func" onClick={handleDeleteBox}>
        <img src={trashIcon} alt="" />
        <p>Delete</p>
      </div>
      <AddList
        onClose={handleAddList}
        visible={showAddList}
        type={"task"}
        edit={true}
        data={data}
        url={url}
        setTasks={setTasks}
      />
      <ConfirmDialog
        onClose={handleShowDialog}
        visible={showDialog}
        handleDelete={handleDelete}
      />
    </div>
  );
}
