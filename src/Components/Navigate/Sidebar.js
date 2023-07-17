import logo from "../../Pictures/cnb_logo.png";
import logoAdmin from "../../Pictures/cnb_logo_admin.png";
import { NavLink, useNavigate } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { AiOutlineCalendar, AiOutlineUser } from "react-icons/ai";
import { BiStore, BiWallet } from "react-icons/bi";
import { BsBook, BsCashCoin } from "react-icons/bs";
import { useSelector } from "react-redux";
import { CiWallet } from "react-icons/ci";
import { TbReport } from "react-icons/tb";

const Sidebar = () => {
  const member = useSelector((state) => state.auth.member);
  const navigate = useNavigate();

  const activeClassName = "flex items-center gap-3 px-8 py-3 text-green";

  const nonActiveClassName =
    "flex items-center gap-3 px-8 py-3 text-dark-gray hover:text-green";

  return (
    <div className="sticky h-screen shadow-md bg-white p-2 min-w-64 top-0">
      <div
        className="flex justify-center py-5 cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        <img
          className="w-52"
          src={member && member.role === "ADMIN" ? logoAdmin : logo}
          alt="UniCare"
        />
      </div>
      <div className="py-5"></div>
      <div>
        <div className="font-bold rounded-sm mb-4 hover:bg-green/10">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? activeClassName : nonActiveClassName
            }
          >
            <div>
              <MdOutlineDashboard className="w-6 h-6" />
            </div>
            <div>Tổng quan</div>
          </NavLink>
        </div>
        <div className="font-bold rounded-sm mb-4 hover:bg-green/10">
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive ? activeClassName : nonActiveClassName
            }
          >
            <div>
              <BsBook className="w-6 h-6" />
            </div>
            <div>Dự án</div>
          </NavLink>
        </div>
        {member && member.role === "ADMIN" ? (
          <>
            <div className="font-bold rounded-sm mb-4 hover:bg-green/10">
              <NavLink
                to="/sponsors"
                className={({ isActive }) =>
                  isActive ? activeClassName : nonActiveClassName
                }
              >
                <div>
                  <FiUsers className="w-6 h-6" />
                </div>
                <div>Nhà tài trợ</div>
              </NavLink>
            </div>
            <div className="font-bold rounded-sm mb-4 hover:bg-green/10">
              <NavLink
                to="/suppliers"
                className={({ isActive }) =>
                  isActive ? activeClassName : nonActiveClassName
                }
              >
                <div>
                  <BiStore className="w-6 h-6" />
                </div>
                <div>Nhà cung cấp</div>
              </NavLink>
            </div>
            <div className="font-bold rounded-sm mb-4 hover:bg-green/10">
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  isActive ? activeClassName : nonActiveClassName
                }
              >
                <div>
                  <AiOutlineUser className="w-6 h-6" />
                </div>
                <div>Nhân sự</div>
              </NavLink>
            </div>
            <div className="font-bold rounded-sm mb-4 hover:bg-green/10">
              <NavLink
                to="/cycles"
                className={({ isActive }) =>
                  isActive ? activeClassName : nonActiveClassName
                }
              >
                <div>
                  <AiOutlineCalendar className="w-6 h-6" />
                </div>
                <div>Kỳ lương</div>
              </NavLink>
            </div>
            <div className="font-bold rounded-sm mb-4 hover:bg-green/10">
              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  isActive ? activeClassName : nonActiveClassName
                }
              >
                <div>
                  <TbReport className="w-6 h-6" />
                </div>
                <div>Báo cáo</div>
              </NavLink>
            </div>
            <div className="font-bold rounded-sm mb-4 hover:bg-green/10">
              <NavLink
                to="/funds"
                className={({ isActive }) =>
                  isActive ? activeClassName : nonActiveClassName
                }
              >
                <div>
                  <BiWallet className="w-6 h-6" />
                </div>
                <div>Quỹ</div>
              </NavLink>
            </div>
            <div className="font-bold rounded-sm mb-4 hover:bg-green/10">
              <NavLink
                to="/vouchers"
                className={({ isActive }) =>
                  isActive ? activeClassName : nonActiveClassName
                }
              >
                <div>
                  <BsCashCoin className="w-6 h-6" />
                </div>
                <div>Voucher</div>
              </NavLink>
            </div>
          </>
        ) : (
          member &&
          member.role === "USER" && (
            <>
              <div className="font-bold rounded-sm mb-4 hover:bg-green/10">
                <NavLink
                  to="/reports"
                  className={({ isActive }) =>
                    isActive ? activeClassName : nonActiveClassName
                  }
                >
                  <div>
                    <TbReport className="w-6 h-6" />
                  </div>
                  <div>Báo cáo</div>
                </NavLink>
              </div>
              <div className="font-bold rounded-sm mb-4 hover:bg-green/10">
                <NavLink
                  to="/wallets"
                  className={({ isActive }) =>
                    isActive ? activeClassName : nonActiveClassName
                  }
                >
                  <div>
                    <CiWallet className="w-6 h-6" />
                  </div>
                  <div>Ví của tôi</div>
                </NavLink>
              </div>
              <div className="font-bold rounded-sm mb-4 hover:bg-green/10">
                <NavLink
                  to="/vouchers"
                  className={({ isActive }) =>
                    isActive ? activeClassName : nonActiveClassName
                  }
                >
                  <div>
                    <BsCashCoin className="w-6 h-6" />
                  </div>
                  <div>Đổi point</div>
                </NavLink>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default Sidebar;
