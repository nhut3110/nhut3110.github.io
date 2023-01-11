import React from "react";
import { Header } from "../../components";
import { NavBar } from "../../components";
import { NavBarLogin } from "../../components";
import Footer from "../../components/Footer/Footer";
const Home = () => {
  return (
    <div>
      {localStorage.getItem("task-user") ? <NavBarLogin /> : <NavBar />}
      <Header />
      <Footer />
    </div>
  );
};

export default Home;
