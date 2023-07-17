import DataTable from "react-data-table-component";
import { AiOutlineEdit } from "react-icons/ai";
import { BsNewspaper, BsThreeDots } from "react-icons/bs";
import Dropdown from "rc-dropdown";
import Loading from "../Loading/Loading";
import Paginate from "../Paginate/Paginate";
import { useNavigate } from "react-router-dom";
import { toVN } from "../../Ultilities/String";

const LevelTable = (props) => {
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

  const CustomCell = ({ level, row, avatar, ping, textColor, icon }) => (
    <div
      className={`hover:cursor-pointer h-full w-full flex items-center justify-center gap-2 ${
        textColor ? textColor : "text-primary"
      } pr-2`}
      onClick={() => {
        props.getLevelInformation(level);
      }}
    >
      {avatar &&
        (level.imageUrl ? (
          <div>
            <img
              className="w-6 h-6 rounded-full"
              src={level.imageUrl}
              alt="avatar"
            />
          </div>
        ) : (
          <div>
            <img
              className="w-6 h-6 rounded-full"
              alt="avatar"
              src={`https://ui-avatars.com/api/?name=${level.levelName}&length=1&background=30BC97&color=FFFFFF`}
            />
          </div>
        ))}
      {ping && (
        <div
          className={`w-3 h-3 rounded-full`}
          style={{ backgroundColor: level.levelColor }}
        ></div>
      )}
      {icon && <div>{icon}</div>}
      <div style={{ color: level.levelColor }}>
        {toVN(row)}
      </div>
    </div>
  );
  const CustomHeader = ({ title }) => (
    <div className="font-bold h-full w-full flex items-center justify-center text-sm">
      <div>{title}</div>
    </div>
  );

  const CustomMenuDropdown = ({ level }) => (
    <div className="absolute left-0 -top-4 rounded-lg bg-white shadow-xl cursor-pointer font-bold text-sm w-32 z-50 p-1">
      <div className="hover:bg-purple/20 hover:text-purple p-2 flex items-center gap-2 relative text-purple rounded-lg text-sm">
        <BsNewspaper />
        <div>Chi tiết</div>
        <div
          className="absolute w-full h-full"
          onClick={() => navigate(`/levels/${level.levelId}`)}
        ></div>
      </div>
      <div className="hover:bg-green/20 hover:text-green p-2 flex items-center gap-2 relative text-green rounded-lg text-sm">
        <AiOutlineEdit />
        <div>Chỉnh sửa</div>
        <div
          className="absolute w-full h-full"
          onClick={() => navigate(`/levels/${level.levelId}`)}
        ></div>
      </div>
    </div>
  );

  const CustomDropdown = ({ row }) => (
    <Dropdown
      className="w-full h-full"
      trigger={["click"]}
      overlay={<CustomMenuDropdown level={row} />}
    >
      <div className="flex items-center justify-center cursor-pointer">
        <BsThreeDots />
      </div>
    </Dropdown>
  );

  const columns = [
    {
      name: <CustomHeader title="STT" />,
      selector: (level) => level.levelId,
      sortable: true,
      width: "5%",
      cell: (level) => <CustomCell level={level} row={level.levelId} />,
    },
    {
      name: <CustomHeader title="Tên level" />,
      selector: (level) => level.levelName,
      sortable: true,
      width: "15%",
      cell: (level) => (
        <CustomCell level={level} row={level.levelName} ping={true} />
      ),
    },
    {
      name: <CustomHeader title="XP cần có" />,
      selector: (level) => level.xpNeeded,
      sortable: true,
      // width: "20%",
      cell: (level) => (
        <CustomCell
          level={level}
          row={level.xpNeeded.toLocaleString()}
          textColor="text-per-75"
        />
      ),
    },
    {
      name: <CustomHeader title="Lương cơ bản" />,
      selector: (level) => level.basePoint,
      sortable: true,
      //   width: "20%",
      cell: (level) => (
        <CustomCell level={level} row={level.basePoint.toLocaleString()} />
      ),
    },
    {
      name: <CustomHeader title="Lương theo giờ" />,
      selector: (level) => level.basePointPerHour,
      sortable: true,
      //   width: "20%",
      cell: (level) => (
        <CustomCell
          level={level}
          row={level.basePointPerHour.toLocaleString()}
        />
      ),
    },
    {
      name: <CustomHeader title="Giờ làm tối thiểu" />,
      selector: (level) => level.minWorkHour,
      sortable: true,
      //   width: "20%",
      cell: (level) => (
        <CustomCell level={level} row={level.minWorkHour.toLocaleString()} />
      ),
    },
    {
      name: <CustomHeader title="Giờ làm tối đa" />,
      selector: (level) => level.maxWorkHour,
      sortable: true,
      //   width: "20%",
      cell: (level) => (
        <CustomCell level={level} row={level.maxWorkHour.toLocaleString()} />
      ),
    },
    {
      button: true,
      width: "5%",
      cell: (level) => <CustomDropdown row={level} />,
    },
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={props.data}
        customStyles={customStyles}
        progressPending={props.loading}
        progressComponent={<Loading />}
      />

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

export default LevelTable;
