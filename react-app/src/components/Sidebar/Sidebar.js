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

        <SubMenu label="Users" icon={<FaUsers className="icon" />}>
          <MenuItem component={<NavLink to="/users" />}>
            <AiOutlineOrderedList className="icon" /> Users List
          </MenuItem>
          <MenuItem component={<NavLink to="/new-user" />}>
            <AiOutlineUserAdd className="icon" /> Create New User
          </MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
  );
};

export default SideBar;
