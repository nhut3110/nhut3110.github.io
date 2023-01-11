import search from "../../assets/img/search.svg";
import "./UserScreen.css";
import { SingleList } from "../../components";
import addBtn from "../../assets/img/add-svgrepo-com-black.svg";
import person from "../../assets/img/person-svgrepo-com.svg";
import people from "../../assets/img/people-svgrepo-com.svg";
import { useEffect, useState } from "react";
import AddList from "../AddList/AddList";
import axios from "axios";
import Loading from "../Loading/Loading";
import SearchBox from "../Search Box/SearchBox";

export default function UserScreen() {
  const [showAddList, setShowAddList] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("My Tasklists");
  const [share, setShare] = useState(false);
  const [loading, setLoading] = useState(true);
  const [icon, setIcon] = useState(person);
  const user = JSON.parse(localStorage.getItem("task-user"));
  // prettier-ignore
  const headers = {
    "access-token": user.access_token,
    'uid': user.uid,
    'client': user.client,
  };
  console.log(user);

  const handleAddList = () => {
    setShowAddList(!showAddList);
  };
  const handleSearchBox = () => {
    setShowSearchBox(!showSearchBox);
  };

  const handleChangeList = async () => {
    if (icon === person) {
      setIcon(people);
      setLoading(true);
      setShare(true);
      setTitle("Shared with me");
      getSharedTasks();
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 500);
      // clearTimeout(timeout);
    } else {
      setIcon(person);
      setLoading(true);
      setShare(false);
      setTitle("My Tasklists");
      getTasks();
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 500);
      // clearTimeout(timeout);
    }
  };

  const getTasks = async () => {
    await axios
      .get("https://dev.thanqminh.com:3000/task_lists", { headers: headers })
      .then((resp) => {
        setTasks(resp.data);
        console.log(resp.data);
      });
  };

  const getSharedTasks = async () => {
    await axios
      .get("https://dev.thanqminh.com:3000/shared", { headers: headers })
      .then((resp) => {
        setTasks(resp.data);
        console.log(resp.data);
      });
  };

  useEffect(() => {
    setLoading(true);
    getTasks();
    console.log(tasks);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div>
      <div class="UserSpace__header">
        <p>{title}</p>
        <div>
          <img
            class="UserSpace__header-search"
            src={search}
            alt="search"
            onClick={() => setShowSearchBox(true)}
          />
          {share ? null : (
            <img
              class="UserSpace__header-search"
              src={addBtn}
              alt="Add list"
              onClick={() => setShowAddList(true)}
            />
          )}

          <img
            class="UserSpace__header-search"
            src={icon}
            alt="change"
            onClick={handleChangeList}
          />
        </div>
      </div>
      <div className="UserSpace__Lists-container">
        {!loading ? (
          <>
            <div class="UserSpace__Lists">
              {tasks.map((item, idx) => (
                <SingleList
                  key={idx}
                  props={item}
                  headers={headers}
                  shared={share}
                  write={share ? item.is_write : null}
                  setTasks={setTasks}
                />
              ))}
            </div>
            <AddList
              onClose={handleAddList}
              visible={showAddList}
              type={"task"}
              setTasks={setTasks}
            />
            <SearchBox
              onClose={handleSearchBox}
              visible={showSearchBox}
              data={tasks}
              headers={headers}
              shared={share}
            />
          </>
        ) : (
          <Loading type={"balls"} color={"#333"} />
        )}
      </div>
    </div>
  );
}
