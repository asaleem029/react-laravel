import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import Clock from "react-live-clock";
import { BiLogOut } from "react-icons/bi";
import { IoMdClock } from "react-icons/io";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Button, Container } from "react-bootstrap";

const Header = () => {
  const navigate = useNavigate();

  function handleLogout() {
    const MySwal = withReactContent(Swal);

    MySwal.fire({
      title: "Are you sure?",
      icon: "warning",
      text: "You want to logout?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/login");
      }
    });
  }

  return (
    <Container fluid>
      <div className="header clock-header">
        <span className="title">My React App</span>

        <div className="clock">
          <b>
            <IoMdClock className="icon-margin clock-icon" />
            <Clock
              format={"MMM-DD-YYYY hh:mm:ss A"}
              ticking={true}
              timezone={"Asia/Karachi"}
            />
          </b>
        </div>

        <div className="logout-div">
          <Button variant="link" size="sm" onClick={handleLogout}>
            <BiLogOut className="icon-margin logout-icon" />
          </Button>
        </div>
      </div>
    </Container>
  );
};
export default Header;
