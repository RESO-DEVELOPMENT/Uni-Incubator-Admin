import {
  BsFillBriefcaseFill,
  BsFillPinFill,
} from "react-icons/bs";
import { NavLink, useParams } from "react-router-dom";
import MemberPayslipForAdmin from "./MemberPayslipForAdmin";

const MemberProfileForAdmin = () => {
  let { userId } = useParams();
  let { page } = useParams();
  let { payslipId } = useParams();

  const activeClassName = "flex items-center gap-2 text-green font-bold";
  const nonActiveClassName = "flex items-center gap-2 hover:text-green";


  return (
    <div className="pl-10 pr-5 my-10">
      <div className="bg-white rounded-md py-5 px-10">
        <h1 className="text-3xl font-bold mb-10">
          {page === "information"
            ? "Hồ sơ cá nhân"
            : page === "payslips"
            ? "Phiếu lương"
            : page === "projects"
            ? "Dự án tham gia"
            : ""}
        </h1>
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
                  to={`/users/${userId}/payslips`}
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
              {/* <div>
                <NavLink
                  to={`/users/${userId}/projects`}
                  className={({ isActive }) =>
                    isActive ? activeClassName : nonActiveClassName
                  }
                >
                  <div>
                    <BsBook />
                  </div>
                  <div>Dự án tham gia</div>
                </NavLink>
              </div> */}
            </div>
          </div>

          <div className="col-span-5">
            {page === "payslips" ? (
              <MemberPayslipForAdmin memberId={userId} payslipId={payslipId} />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfileForAdmin;
