import { Outlet } from "react-router-dom";
import Sidebar from "./../../Components/Navigate/Sidebar";

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
