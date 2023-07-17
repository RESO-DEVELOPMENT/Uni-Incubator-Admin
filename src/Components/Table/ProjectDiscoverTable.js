import DataTable from "react-data-table-component";
import { BsNewspaper, BsThreeDots } from "react-icons/bs";
import Dropdown from "rc-dropdown";
import Loading from "../Loading/Loading";
import Paginate from "../Paginate/Paginate";
import { useNavigate } from "react-router-dom";
import { textToColor, toVN } from "../../Ultilities/String";
import { find } from "lodash";
import { toDate } from "../../Ultilities/Date";
import { GiTwoCoins } from "react-icons/gi";
import { IoIosWarning } from "react-icons/io";

const ProjectDiscoverTable = (props) => {
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
    project,
    row,
    status,
    textColor,
    icon,
    manager,
    currency,
    textLeft,
    haveEndReq,
  }) => (
    <div
      className={`hover:cursor-pointer h-full w-full flex items-center ${
        textLeft ? "justify-left" : "justify-center"
      } gap-2 ${textColor ? textColor : "text-primary"} pr-2`}
      onClick={() => {
        navigate(`/projects/${project.projectId}`);
      }}
    >
      {icon && <div>{icon}</div>}
      {manager ? (
        <div className="w-full text-left pl-2">
          <div className="font-bold">{row.fullName}</div>
          <div className="text-xs">{row.emailAddress}</div>
        </div>
      ) : currency ? (
        <div className="flex gap-2 items-center text-yellow-500">
          <div>{row}</div>
          <div>
            <GiTwoCoins />
          </div>
        </div>
      ) : (
        <div
          className={status ? "px-5 py-1 rounded-full font-bold" : ""}
          style={{
            color: status && textToColor(row),
            backgroundColor: status && `${textToColor(row)}26`,
          }}
        >
          {haveEndReq ? (
            <div className="flex gap-2 items-center">
              <div>{toVN(row)}</div>
              <div className="relative text-red-500">
                <div className="peer">
                  <IoIosWarning />
                </div>
                <div className="absolute bg-white rounded-lg shadow-lg p-2 text-xs text-center w-40 left-1/2 -translate-x-1/2 -translate-y-full top-0 border hover:block border-slate-300 hidden peer-hover:block hover:underline">
                  Có yêu cầu kết thúc sớm!
                </div>
              </div>
            </div>
          ) : (
            toVN(row)
          )}
        </div>
      )}
    </div>
  );
  const CustomHeader = ({ title }) => (
    <div className="font-bold h-full w-full flex items-center justify-center text-sm">
      <div>{title}</div>
    </div>
  );

  const CustomMenuDropdown = ({ project }) => (
    <div className="absolute left-0 -top-4 rounded-lg bg-white shadow-xl cursor-pointer font-bold text-sm w-32 z-50 p-1">
      <div className="hover:bg-purple/20 hover:text-purple p-2 flex items-center gap-2 relative text-purple rounded-lg text-sm">
        <BsNewspaper />
        <div>Chi tiết</div>
        <div
          className="absolute w-full h-full"
          onClick={() => navigate(`/projects/${project.projectId}`)}
        ></div>
      </div>
    </div>
  );

  const CustomDropdown = ({ row }) => (
    <Dropdown
      className="w-full h-full"
      trigger={["click"]}
      overlay={<CustomMenuDropdown project={row} />}
    >
      <div className="flex items-center justify-center cursor-pointer">
        <BsThreeDots />
      </div>
    </Dropdown>
  );

  const columns = [
    {
      name: <CustomHeader title="Tên viết tắt" />,
      selector: (project) => project.projectShortName,
      sortable: true,
      width: "10%",
      cell: (project) => (
        <CustomCell project={project} row={project.projectShortName} />
      ),
    },
    {
      name: <CustomHeader title="Tên dự án" />,
      selector: (project) => project.projectName,
      sortable: true,
      width: "20%",
      cell: (project) => (
        <CustomCell
          project={project}
          row={project.projectName}
          textLeft={true}
          haveEndReq={project.haveEndReq}
        />
      ),
    },
    {
      name: <CustomHeader title="Ngày bắt đầu" />,
      selector: (project) => project.startedAt,
      sortable: true,
      // width: "20%",
      cell: (project) => (
        <CustomCell project={project} row={toDate(project.startedAt)} />
      ),
    },
    {
      name: <CustomHeader title="Trạng thái" />,
      selector: (project) => project.projectStatus,
      sortable: true,
      //   width: "20%",
      cell: (project) => (
        <CustomCell
          project={project}
          row={project.projectStatus}
          status={true}
        />
      ),
    },
    {
      name: <CustomHeader title="Quản lý dự án" />,
      selector: (project) =>
        find(project.members, { role: "manager" }).member.fullName,
      sortable: true,
      //   width: "20%",
      cell: (project) => (
        <CustomCell
          project={project}
          manager={true}
          row={find(project.members, { role: "manager" }).member}
        />
      ),
    },
    {
      name: <CustomHeader title="Quỹ dự án" />,
      selector: (project) => project.budget,
      sortable: true,
      //   width: "20%",
      cell: (project) => (
        <CustomCell
          project={project}
          row={project.budget.toLocaleString()}
          currency={true}
        />
      ),
    },
    {
      button: true,
      width: "5%",
      cell: (project) => <CustomDropdown row={project} />,
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

export default ProjectDiscoverTable;
