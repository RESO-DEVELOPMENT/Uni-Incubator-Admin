import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./Pages/Auth/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Layout from "./Pages/Layout/Layout";
import { useState } from "react";
import { useEffect } from "react";
import jwtDecode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { authAction } from "./Store/Slice/userSlice";
import DashboardLoading from "./Components/Loading/DashboardLoading";
import { ToastContainer } from "react-toastify";
import ToastError from "./Components/Alert/ToastError";
import Project from "./Pages/Project/Project";
import CreateProject from "./Pages/Project/CreateProject";
import User from "./Pages/User/User";
import ProjectDetail from "./Pages/Project/ProjectDetail";
import Profile from "./Pages/Profile/Profile";
import ProfileDetail from "./Pages/Profile/Pages/ProfileDetail";
import Sponsor from "./Pages/Sponsor/Sponsor";
import memberApi from "./API/Member/memberApi";
import Funds from "./Pages/Funds/Funds";
import Payslip from "./Pages/Payslip/Payslip";
import MemberPayslips from "./Pages/Profile/Pages/MemberPayslips";
import MemberProfileForAdmin from "./Pages/Profile/Pages/MemberProfileForAdmin";
import Report from "./Pages/Report/Report";
import ReportDetail from "./Pages/Report/ReportDetail";
import Voucher from "./Pages/Voucher/Voucher";
import EditProject from "./Pages/Project/EditProject";
import ProjectDiscoverForUser from "./Pages/Project/ProjectDiscoverForUser";
import Cycle from "./Pages/Cycle/Cycle";
import ReportDetailForAdmin from "./Pages/Report/ReportDetailForAdmin";
import ReportForAdmin from "./Pages/Report/ReportForAdmin";
import VoucherForMember from "./Pages/Voucher/VoucherForMember";
import Wallet from "./Pages/Wallet/Wallet";
import Level from "./Pages/Level/Level";
import ProjectDiscoverForAdmin from "./Pages/Project/ProjectDiscoverForAdmin";
import Error from "./Pages/Error/Error.js";
import Supplier from "./Pages/Supplier/Supplier";
import Policy from "./Pages/Policy/Policy";
import { isNil } from "lodash";
import RecoverPassword from "./Pages/Auth/RecoverPassword";
import ResetPassword from "./Pages/Auth/ResetPassword";
import { closeSignalRConnection } from "./Store/Middlewares/signalrConnection";

function App() {
  const token = localStorage.getItem("TOKEN");
  const member = useSelector((state) => state.auth.member);
  const [isAuth, setIsAuth] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [firstOpenPage, setFirstOpenPage] = useState(true);

  useEffect(() => {
    const handleInvalidToken = (e) => {
      if (isNil(e.key)) {
        navigate("/login");
        dispatch(authAction.logout());
      }
    };
    window.addEventListener("storage", handleInvalidToken);
    return function cleanup() {
      window.removeEventListener("storage", handleInvalidToken);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const checkRecentToken = async () => {
      if (token) {
        const decoded = jwtDecode(token);
        const expiredDate = new Date(decoded.exp * 1000);
        const toDay = new Date();
        if (toDay >= expiredDate) {
          dispatch(authAction.logout());
          navigate("/login");
          ToastError({ text: "Token expired" });
        } else {
          try {
            if (firstOpenPage) {
              const response = await memberApi.getMe();
              if (response.success) {
                const jwtToken = token;
                const member = response.data.message;
                member.role = decoded.role;
                dispatch(
                  authAction.loginAgain({ token: jwtToken, member: member })
                );
                setFirstOpenPage(false);
                setIsAuth(true);
              }
            } else {
              setIsAuth(true);
            }
          } catch (error) {
            navigate("/login");
            dispatch(authAction.logout());
            ToastError({ text: "Xin hãy đăng nhập lại" });
          }
        }
      } else {
        setFirstOpenPage(true);
        closeSignalRConnection();
      }
    };
    checkRecentToken();
    // eslint-disable-next-line
  }, [token]);

  return (
    <div className="App">
      <ToastContainer />
      <Routes>
        {token ? (
          <>
            {isAuth ? (
              <>
                <Route path="/login" element={<Navigate to={"/dashboard"} />} />
                <Route path="/" element={<Navigate to={"/dashboard"} />} />
                <Route path="dashboard" element={<Layout />}>
                  <Route index element={<Dashboard />} />
                </Route>
                <Route path="*" element={<Error />} />
                {member &&
                  (member.role && member.role.toUpperCase() === "ADMIN" ? (
                    <>
                      <Route path="projects" element={<Layout />}>
                        <Route index element={<Project />} />
                        <Route path="create" element={<CreateProject />} />
                        <Route path=":projectId" element={<ProjectDetail />}>
                          <Route path=":page" element={<ProjectDetail />} />
                        </Route>
                        <Route
                          path="discover"
                          element={<ProjectDiscoverForAdmin />}
                        />
                      </Route>
                      <Route
                        path="projects/:projectId/edit"
                        element={<Layout />}
                      >
                        <Route index element={<EditProject />} />
                      </Route>
                      <Route path="sponsors" element={<Layout />}>
                        <Route index element={<Sponsor />} />
                        <Route path=":sponsorId" element={<Sponsor />} />
                      </Route>
                      <Route path="users" element={<Layout />}>
                        <Route index element={<User />} />
                        <Route path=":userId" element={<User />} />
                      </Route>
                      <Route path="/users/:userId/:page" element={<Layout />}>
                        <Route index element={<MemberProfileForAdmin />} />
                        <Route
                          path=":payslipId"
                          element={<MemberProfileForAdmin />}
                        />
                      </Route>
                      <Route path="funds" element={<Layout />}>
                        <Route index element={<Funds />} />
                        <Route path="payslips" element={<Payslip />} />
                      </Route>
                      <Route path="profile" element={<Layout />}>
                        <Route index element={<ProfileDetail />} />
                        <Route path=":page" element={<ProfileDetail />} />
                      </Route>
                      <Route path="reports" element={<Layout />}>
                        <Route index element={<ReportForAdmin />} />
                        <Route
                          path=":reportId"
                          element={<ReportDetailForAdmin />}
                        />
                      </Route>
                      <Route path="vouchers" element={<Layout />}>
                        <Route index element={<Voucher />} />
                      </Route>
                      <Route path="cycles" element={<Layout />}>
                        <Route index element={<Cycle />} />
                        <Route path=":cycleId" element={<Cycle />} />
                      </Route>
                      <Route path="levels" element={<Layout />}>
                        <Route index element={<Level />} />
                        <Route path=":levelId" element={<Level />} />
                      </Route>
                      <Route path="suppliers" element={<Layout />}>
                        <Route index element={<Supplier />} />
                        <Route path=":supplierId" element={<Supplier />} />
                      </Route>
                    </>
                  ) : (
                    <>
                      <Route path="projects" element={<Layout />}>
                        <Route index element={<Project />} />
                        <Route
                          path="discover"
                          element={<ProjectDiscoverForUser />}
                        />
                        <Route path=":projectId" element={<ProjectDetail />}>
                          <Route path=":page" element={<ProjectDetail />} />
                        </Route>
                      </Route>
                      <Route path="profile" element={<Layout />}>
                        <Route index element={<Profile />} />
                        <Route path=":page" element={<ProfileDetail />}>
                          <Route
                            path=":payslipId"
                            element={<MemberPayslips />}
                          />
                        </Route>
                      </Route>
                      <Route path="reports" element={<Layout />}>
                        <Route index element={<Report />} />
                        <Route path=":reportId" element={<ReportDetail />} />
                      </Route>
                      <Route path="vouchers" element={<Layout />}>
                        <Route index element={<VoucherForMember />} />
                      </Route>
                      <Route path="wallets" element={<Layout />}>
                        <Route index element={<Wallet />} />
                      </Route>
                    </>
                  ))}
              </>
            ) : (
              <>
                <Route path="*" element={<DashboardLoading />} />
              </>
            )}
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to={"/login"} />} />
            <Route path="login" element={<Login />} />
            <Route path="policy" element={<Policy />} />
            <Route path="recover-password" element={<RecoverPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="dashboard" element={<Navigate to={"/login"} />} />
            <Route path="projects" element={<Navigate to={"/login"} />} />
            <Route path="users" element={<Navigate to={"/login"} />} />
            <Route path="sponsors" element={<Navigate to={"/login"} />} />
            <Route path="profile" element={<Navigate to={"/login"} />} />
            <Route path="wallets" element={<Navigate to={"/login"} />} />
            <Route path="*" element={<Error />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
