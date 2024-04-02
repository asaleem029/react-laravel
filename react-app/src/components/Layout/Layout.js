import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import SideBar from "../Sidebar/Sidebar";
import Footer from "../Footer/Footer";

const Layout = () => {
  return (
    <>
      <div className="header">
        <Header />
      </div>

      <div className="main-container">
        <SideBar />

        <main className="main">
          <Outlet />
        </main>
      </div>

      <div className="footer">
        <Footer />
      </div>
    </>
  );
};

export default Layout;
