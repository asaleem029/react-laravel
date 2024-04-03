import { NavLink } from "react-router-dom";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "./SideBar.css";
import { AiFillDashboard } from "react-icons/ai";
import { FaUsers, FaBars } from "react-icons/fa";
import { AiOutlineOrderedList, AiOutlineUserAdd } from "react-icons/ai";
import { useState } from "react";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const [toggled, setToggled] = useState(false);

  const handleCollapsedChange = () => {
    setCollapsed(!collapsed);
  };
  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  return (
    <Sidebar
      className={`app ${toggled ? "toggled" : ""}`}
      style={{ height: "100%" }}
      collapsed={collapsed}
      toggled={toggled}
      handleToggleSidebar={handleToggleSidebar}
      handleCollapsedChange={handleCollapsedChange}
    >
      <Menu
        menuItemStyles={{
          button: {
            [`&.active`]: {
              backgroundColor: "darkgray",
              color: "black",
            },
          },
        }}
      >
        {collapsed ? (
          <MenuItem onClick={handleCollapsedChange}>
            <FaBars />
          </MenuItem>
        ) : (
          <MenuItem onClick={handleCollapsedChange}>
            <div
              style={{
                padding: "9px",
                fontWeight: "bold",
                fontSize: 14,
                letterSpacing: "1px",
              }}
            >
              <FaBars />
            </div>
          </MenuItem>
        )}
        <hr />

        <MenuItem component={<NavLink to="/" />}>
          <AiFillDashboard className="icon" />
          Dashboard
        </MenuItem>

        <MenuItem component={<NavLink to="/users" />}>
          <FaUsers className="icon" /> Users
        </MenuItem>

        <MenuItem component={<NavLink to="/feedbacks" />}>
          <AiOutlineOrderedList className="icon" /> Feebacks
        </MenuItem>

      </Menu>
    </Sidebar>
  );
};

export default SideBar;
