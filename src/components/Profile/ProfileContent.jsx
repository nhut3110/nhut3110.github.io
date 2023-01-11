import "./ProfileContent.css";
// import "../style.css";
import editIcon from "../../assets/img/edit.svg";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function ProfileContent() {
  const navigate = useNavigate();
  // const user = JSON.parse(localStorage.getItem("task-user"));
  const [isEdit, setEdit] = useState(false);
  const [buttonText, setButtonText] = useState("Edit Profile");

  const userEmail = useRef();
  const userName = useRef();

  const [tasks, setTasks] = useState([]);
  const user = JSON.parse(localStorage.getItem("task-user"));
  const [name, setName] = useState(user.dataUser.data.name);
  // prettier-ignore
  const headers = {
    "access-token": user.access_token,
    'uid': user.uid,
    'client': user.client,
  };

  const getTasks = async () => {
    await axios
      .get("https://dev.thanqminh.com:3000/task_lists", { headers: headers })
      .then((resp) => {
        setTasks(resp.data.sort((a, b) => b.id - a.id).slice(0, 10));
        // console.log(resp.data);
      });
  };

  useEffect(() => {
    getTasks();
    // console.log(tasks);
  }, []);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      if (!isEdit) {
        // document.getElementById("user-email-input").disabled = false;
        document.getElementById("user-name-input").disabled = false;
        setEdit(!isEdit);
        setButtonText("Save");
        alert.show("You can change Address and Phone");
      } else {
        const updatedEmail =
          userEmail.current.value === ""
            ? user.dataUser.data.email
            : userEmail.current.value;
        const updatedName =
          userName.current.value === ""
            ? user.dataUser.data.name
            : userName.current.value;
        const updatedData = await axios.patch(
          `https://dev.thanqminh.com:3000/auth`,
          {
            // email: updatedEmail,
            name: updatedName,
          },
          {
            headers: headers,
          }
        );
        // console.log(updatedData.data);
        // user.dataUser.data.email =
        //   updatedEmail === "" ? user.dataUser.data.email : updatedEmail;
        user.dataUser.data.name =
          updatedName === "" ? user.dataUser.data.name : updatedName;
        // console.log(user);
        // localStorage.removeItem("task-user");
        localStorage.setItem("task-user", JSON.stringify(user));
        console.log(JSON.parse(localStorage.getItem("task-user")));
        setName(updatedName);
        // document.getElementById("user-email-input").disabled = true;
        document.getElementById("user-name-input").disabled = true;
        setEdit(!isEdit);
        setButtonText("Edit Profile");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div class="UserProfile__container">
      <div class="Friend">
        <div class="Friend__header">
          <h2>Friends</h2>
          {/* <img
            src={require("../../assets/img/add-user-svgrepo-com.svg").default}
            alt=""
          /> */}
        </div>
        <div class="Friend__list">
          <div class="SingleFriend__container">
            <img src={require("../../assets/img/man.svg").default} alt="ava" />
            <h5>The Dumb</h5>"
          </div>
          <div class="SingleFriend__container">
            <img src={require("../../assets/img/man.svg").default} alt="ava" />
            <h5>Cuong Xuan</h5>
          </div>
          <div class="SingleFriend__container">
            <img src={require("../../assets/img/man.svg").default} alt="ava" />
            <h5>Bao Ngu</h5>
          </div>
          <div class="SingleFriend__container">
            <img src={require("../../assets/img/man.svg").default} alt="ava" />
            <h5>Truong Ngu</h5>
          </div>
          <div class="SingleFriend__container">
            <img src={require("../../assets/img/man.svg").default} alt="ava" />
            <h5>Vu Ngu</h5>
          </div>
          <div class="SingleFriend__container">
            <img
              src={require("../../assets/img/woman.svg").default}
              alt="ava"
            />
            <h5>Dang Phuc</h5>
          </div>
        </div>
      </div>
      <div class="Profile">
        <div class="Profile__header">
          <img
            src="https://s.memehay.com/files/posts/20200915/cheems-cho-vang-dua-hai-ban-tay-ra-dau-vjp-rat-vip-49528c40332aafc321ee556b0412ec67.jpg"
            alt="background img"
          />
        </div>
        <div class="Profile__info">
          <img
            class="Profile__info-photo"
            src="https://play-lh.googleusercontent.com/xlnwmXFvzc9Avfl1ppJVURc7f3WynHvlA749D1lPjT-_bxycZIj3mODkNV_GfIKOYJmG"
            alt="img"
          />
          <div class="Profile__info-nameUser">
            <h1>{name}</h1>
            <button class="btn__edit" type="" onClick={handleEdit}>
              <img
                src={require("../../assets/img/edit.svg").default}
                alt="edit profile"
              />
              <p>{buttonText}</p>
            </button>
          </div>
        </div>
        <div class="Profile__container-content">
          <div class="Profile__details">
            <div class="input__info">
              <p class="text__bold">user info</p>
              <p class="text__bold text__width">details</p>
            </div>
            <div class="input__info">
              <p>Full name:</p>
              <input
                id="user-name-input"
                type="text"
                placeholder={name}
                disabled
                ref={userName}
              ></input>
            </div>
            <div class="input__info">
              <p>Email:</p>
              <input
                id="user-email-input"
                type="email"
                placeholder={user.dataUser.data.email}
                disabled
                ref={userEmail}
              ></input>
            </div>
            <div class="input__info">
              <p>Password:</p>
              <a type="button" href="/changepassword">
                Reset Password
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="TaskList">
        <div class="TaskList__header">
          <h2>Recent Tasklists</h2>
        </div>
        <div class="TaskList__list">
          {tasks.map((task) => (
            <Link
              to={`/task/${task.id}`}
              style={{ color: "black", textDecoration: "none" }}
            >
              <div class="SingleFriend__container">
                <img
                  src={
                    require("../../assets/img/landscape-svgrepo-com.svg")
                      .default
                  }
                  alt="ava"
                />{" "}
                <h5>{task.name}</h5>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
