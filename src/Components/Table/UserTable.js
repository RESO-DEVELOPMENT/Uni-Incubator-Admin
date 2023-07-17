import DataTable from "react-data-table-component";
import { forwardRef } from "react";
import Paginate from "./../Paginate/Paginate";
import Dropdown from "rc-dropdown";
import "rc-dropdown/assets/index.css";
import { BsThreeDots, BsFillTrashFill } from "react-icons/bs";
import { AiFillCheckSquare, AiFillStar, AiOutlineEdit } from "react-icons/ai";
import { BsCheckSquareFill } from "react-icons/bs";
import { format } from "date-fns";
import Loading from "./../Loading/Loading";
import { isEmpty } from "lodash";
import { useNavigate } from "react-router-dom";
import { textToColor, toVN } from "../../Ultilities/String";
import { FaUserAlt } from "react-icons/fa";
import { VscDebugRestart } from "react-icons/vsc";
import { HiOutlineUserRemove } from "react-icons/hi";

const UserTable = (props) => {
  const getPage = (page) => {
    props.getPage(page);
  };
  const navigate = useNavigate();
  const customStyles = {
    rows: {
      style: {
        padding: "0px",
        "&:hover": {
          backgroundColor: "#eaf8f4",
        },
      },
    },
    headCells: {
      style: {
        padding: "0px",
        // fontSize: "14px",
      },
    },
    cells: {
      style: {
        padding: "0px",
      },
    },
  };

  const CustomCell = ({
    user,
    row,
    avatar,
    textColor,
    icon,
    ping,
    paddingBg,
  }) => (
    <div
      className={`hover:cursor-pointer h-full w-full flex items-center gap-2 text-primary pr-2`}
      onClick={() => {
        props.getUserInformation(user);
      }}
    >
      {avatar ? (
        user.imageUrl ? (
          <div>
            <img
              className="w-6 h-6 rounded-full"
              src={user.imageUrl}
              alt="avatar"
            />
          </div>
        ) : (
          <div>
            <img
              className="w-6 h-6 rounded-full"
              alt="avatar"
              src={`https://ui-avatars.com/api/?name=${user.fullName}&length=1&background=30BC97&color=FFFFFF`}
            />
          </div>
        )
      ) : (
        <></>
      )}
      {ping && (
        <div
          className={`w-3 h-3 rounded-full`}
          style={{ background: textToColor(user.memberStatus) }}
        ></div>
      )}
      <div
        className={`flex gap-2 items-center ${
          paddingBg && `py-1 px-5 rounded-lg font-bold bg-opacity-10`
        }`}
        style={{
          color: textColor,
          backgroundColor:
            paddingBg && `${user.memberLevels.level.levelColor}26`,
        }}
      >
        <div>{row}</div>
        {icon && <div>{icon}</div>}
      </div>
    </div>
  );
  const CustomHeader = ({ name }) => (
    <div className="font-bold h-full flex items-center text-sm">{name}</div>
  );

  const CustomMenuDropdown = ({ user }) => (
    <div className="absolute left-0 -top-4 rounded-lg bg-white shadow-xl cursor-pointer font-bold text-sm w-32 z-50 p-1">
      <div className="hover:bg-green/20 hover:text-green p-2 flex items-center gap-2 relative text-green rounded-lg text-sm">
        <AiOutlineEdit />
        <div>Chi tiết</div>
        <div
          className="absolute w-full h-full"
          onClick={() => navigate(`/users/${user.memberId}`)}
        ></div>
      </div>
      {user.memberStatus !== "disabled" && (
        <div className="hover:bg-red-500/20 hover:text-red-500 p-2 flex items-center gap-2 relative text-red-500 rounded-lg text-sm">
          <HiOutlineUserRemove />
          <div>Vô hiệu hóa</div>
          <div
            className="absolute w-full h-full"
            onClick={() => props.disabledUser(user)}
          ></div>
        </div>
      )}
      {user.memberStatus !== "disabled" && user.memberStatus === "available" ? (
        <div className="hover:bg-red-500/20 hover:text-red-500 p-2 flex items-center gap-2 relative text-red-500 rounded-lg text-sm">
          <BsFillTrashFill />
          <div>Xóa</div>
          <div
            className="absolute w-full h-full"
            onClick={() => props.removeUser(user.memberId)}
          ></div>
        </div>
      ) : (
        user.memberStatus !== "disabled" &&
        user.memberStatus === "unavailable" && (
          <div className="hover:bg-purple/20 hover:text-purple p-2 flex items-center gap-2 relative text-purple rounded-lg text-sm">
            <VscDebugRestart />
            <div>Khôi phục</div>
            <div
              className="absolute w-full h-full"
              onClick={() => props.activeUser(user.memberId)}
            ></div>
          </div>
        )
      )}
    </div>
  );

  const CustomDropdown = ({ row }) => (
    <Dropdown
      className="w-full h-full"
      trigger={["click"]}
      overlay={<CustomMenuDropdown user={row} />}
    >
      <div className="flex items-center justify-center cursor-pointer">
        <BsThreeDots />
      </div>
    </Dropdown>
  );

  const columns = [
    {
      name: <CustomHeader name="Họ và tên" />,
      selector: (row) => row.fullName,
      // sortable: true,
      width: "20%",
      cell: (row) => <CustomCell user={row} row={row.fullName} avatar={true} />,
    },
    {
      name: <CustomHeader name="Email / Tên đăng nhập" />,
      selector: (row) => row.emailAddress,
      width: "20%",
      cell: (row) => <CustomCell user={row} row={row.emailAddress} />,
    },
    {
      name: <CustomHeader name="Level hiện tại" />,
      selector: (row) => row.memberLevels.level.levelName,
      // sortable: true,
      // width: "15%",
      cell: (row) => (
        <CustomCell
          user={row}
          row={row.memberLevels.level.levelName}
          textColor={row.memberLevels.level.levelColor}
          paddingBg={true}
        />
      ),
    },
    {
      name: <CustomHeader name="Vai trò" />,
      selector: (row) => row.role.roleName,
      // sortable: true,
      width: "15%",
      cell: (row) => (
        <CustomCell
          user={row}
          row={toVN(row.role.roleName)}
          icon={
            row.role.roleName === "Administrator" ? (
              <AiFillStar />
            ) : (
              <FaUserAlt className="text-xs" />
            )
          }
        />
      ),
    },
    {
      name: <CustomHeader name="Trạng thái" />,
      selector: (row) => row.memberLevels.createdAt,
      // sortable: true,
      width: "15%",
      cell: (row) => (
        <CustomCell
          user={row}
          row={toVN(row.memberStatus)}
          ping={true}
          textColor={textToColor(row.memberStatus)}
        />
      ),
    },
    {
      name: <CustomHeader name="Thời gian thay đổi" />,
      selector: (row) => row.memberLevels.createdAt,
      sortable: true,
      // width: "15%",
      cell: (row) => (
        <CustomCell
          user={row}
          row={format(new Date(row.memberLevels.createdAt), "dd/MM/yyyy")}
        />
      ),
    },
    {
      button: true,
      width: "5%",
      cell: (row) => <CustomDropdown row={row} />,
    },
  ];

  const CustomCheckBox = forwardRef(({ onClick, ...rest }, ref) => {
    return (
      <div className="relative">
        <BsCheckSquareFill className="absolute cursor-pointer text-green w-3 h-3 -translate-x-1/2 -translate-y-1/2  peer-checked:opacity-100" />
        <input
          type="checkbox"
          className="absolute -translate-x-1/2 -translate-y-1/2 peer cursor-pointer w-3 h-3 checked:opacity-0"
          ref={ref}
          onClick={onClick}
          {...rest}
        />
      </div>
    );
  });

  const handleSort = (columns, sortDirection) => {
    props.handleSort(columns, sortDirection);
  };

  return (
    <div>
      <DataTable
        columns={columns}
        data={props.data}
        // selectableRows
        customStyles={customStyles}
        selectableRowsComponent={CustomCheckBox}
        onSelectedRowsChange={props.getSelectedUsers}
        progressPending={props.loading}
        progressComponent={<Loading />}
        onSort={handleSort}
        sortServer
      />
      {!isEmpty(props.selectedUsers) && (
        <div className="mt-5 flex justify-between items-center font-bold px-4">
          <div className="text-green flex items-center gap-4">
            <AiFillCheckSquare />
            <div>Đã chọn {props.selectedUsers.length} thành viên</div>
          </div>
          <div className="relative flex items-center gap-4 text-red-600">
            <div>Xóa tất cả lựa chọn</div>
            <BsFillTrashFill />
            <div className="absolute w-full h-full cursor-pointer"></div>
          </div>
        </div>
      )}

      <div className="mt-5">
        <Paginate
          page={props.page}
          pageSize={props.pageSize}
          totalPages={props.totalPages}
          currentPage={props.currentPage}
          getPage={getPage}
        />
      </div>
    </div>
  );
};

export default UserTable;
