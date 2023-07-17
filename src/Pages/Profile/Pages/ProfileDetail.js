import {
  BsArrowReturnLeft,
  BsFillBriefcaseFill,
  BsFillPinFill,
} from "react-icons/bs";
import { FaClipboardList } from "react-icons/fa";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import MemberInformation from "./MemberInformation";
import MemberPayslips from "./MemberPayslips";
import { useSelector } from "react-redux";

const ProfileDetail = () => {
  const currentMember = useSelector((state) => state.auth.member);
  const activeClassName = "flex items-center gap-2 text-green font-bold";
  const nonActiveClassName = "flex items-center gap-2 hover:text-green";

  let { page } = useParams();

  const navigate = useNavigate();

  document.title = "Thông tin | UniCare";

  return (
    <div className="pl-10 pr-5 my-10">
      <div className="bg-white rounded-md py-5 px-10 shadow-md">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold mb-10">
            {page === "information" ? "Hồ sơ cá nhân" : ""}
          </h1>
          <div
            className="flex gap-2 items-center cursor-pointer hover:text-green"
            onClick={() =>
              navigate(
                currentMember?.role !== "ADMIN" ? "/profile" : "/dashboard"
              )
            }
          >
            <div>
              <BsArrowReturnLeft />
            </div>
            <div>Quay về</div>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-5">
          <div className="col-span-2 text-black/60">
            <div className="flex items-center gap-2 font-bold">
              <BsFillPinFill />
              <div>PHÂN LOẠI</div>
            </div>
            <hr className="border-none h-px bg-slate-300 my-3" />
            <div className="pl-5">
              <div className="mb-5">
                <NavLink
                  to="/profile/information"
                  className={({ isActive }) =>
                    isActive ? activeClassName : nonActiveClassName
                  }
                >
                  <div>
                    <FaClipboardList />
                  </div>
                  <div>Thông tin cá nhân</div>
                </NavLink>
              </div>
              {currentMember?.role !== "ADMIN" && (
                <div className="mb-5">
                  <NavLink
                    to="/profile/payslips"
                    className={({ isActive }) =>
                      isActive ? activeClassName : nonActiveClassName
                    }
                  >
                    <div>
                      <BsFillBriefcaseFill />
                    </div>
                    <div>Phiếu lương</div>
                  </NavLink>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-5">
            {page === "information" ? (
              <MemberInformation />
            ) : page === "payslips" ? (
              <MemberPayslips />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
