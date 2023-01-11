import "./TaskScreen.css";
import { SingleTask } from "../../components";
import { useLocation, useNavigate, useNavigation } from "react-router";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import AddList from "../AddList/AddList";
import Loading from "../Loading/Loading";
import SharedTable from "../Shared Table/SharedTable";
export default function TaskScreen() {
  const [showAddList, setShowAddList] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [share, setShare] = useState(false);
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState([]);
  const [sharedUsers, setSharedUsers] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const sharePath =
    "https://dev.thanqminh.com:3000/task_lists/" +
    location.pathname.split("/")[2] +
    "/share";
  const path =
    "https://dev.thanqminh.com:3000/task_lists/" +
    location.pathname.split("/")[2] +
    "/todos";
  const sharedUserPath =
    "https://dev.thanqminh.com:3000/task_lists/" +
    location.pathname.split("/")[2] +
    "/share";
  const locationArray = location.pathname.split("/");
  const permission =
    locationArray[locationArray.length - 1] === "edit" ||
    locationArray[locationArray.length - 1] === "shared"
      ? locationArray[locationArray.length - 1]
      : null;

  const user = JSON.parse(localStorage.getItem("task-user"));
  // prettier-ignore
  const headers = {
    "access-token": user.access_token,
    'uid': user.uid,
    'client': user.client,
  };

  const handleAddList = () => {
    setShowAddList(!showAddList);
  };

  const handleSharedTable = () => {
    setShowTable(!showTable);
  };

  const getSharedUsers = async (e) => {
    const res = await axios.get(sharedUserPath, { headers: headers });
    console.log(res.data);
    setSharedUsers(res.data);
  };

  const getTodos = async () => {
    await axios
      .get(path, {
        headers: headers,
      })
      .then((resp) => {
        setTodos(resp.data);
        console.log(resp.data);
      });
  };

  useEffect(() => {
    setLoading(true);
    getSharedUsers();
    getTodos();
    console.log(todos);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const handleBack = (e) => {
    navigate("/userspace");
  };

  const handleGetUsers = async () => {};
  return (
    <div>
      <div class="UserSpace__header">
        <p>What will we do?</p>
        <div>
          {permission === "edit" || permission === "shared" ? null : (
            <>
              <button
                class="btn__share"
                onClick={() => {
                  setShowAddList(true);
                  setShare(true);
                }}
              >
                Share
              </button>
              <button
                class="btn__share"
                onClick={() => {
                  setShowAddList(true);
                  setShare(false);
                }}
                // onClick={handleCreate}
              >
                Create
              </button>
              <button
                class="btn__share"
                onClick={() => {
                  setShowTable(true);
                  handleGetUsers();
                }}
              >
                Users
              </button>
            </>
          )}
          {permission === "edit" ? (
            <button
              class="btn__share"
              onClick={() => {
                setShowAddList(true);
                setShare(false);
              }}
              // onClick={handleCreate}
            >
              Create
            </button>
          ) : null}

          <button class="btn__share" onClick={handleBack}>
            Back
          </button>
        </div>
      </div>
      <div className="TodosBoard__container">
        {loading ? (
          <Loading type={"balls"} color={"#333"} />
        ) : (
          todos.map((item) => (
            <SingleTask
              todo={item}
              url={path}
              setTodos={getTodos}
              share={
                permission !== null
                  ? permission === "edit"
                    ? true
                    : false
                  : null
              }
            />
          ))
        )}
      </div>

      <AddList
        onClose={handleAddList}
        visible={showAddList}
        type={share ? null : "todo"}
        url={share ? sharePath : path}
        share={share ? true : false}
        setTodos={getTodos}
        getSharedUsers={getSharedUsers}
      />
      <SharedTable
        onClose={handleSharedTable}
        visible={showTable}
        url={sharedUserPath}
        headers={headers}
        sharedUsers={sharedUsers}
        setSharedUsers={setSharedUsers}
      />
    </div>
  );
}
