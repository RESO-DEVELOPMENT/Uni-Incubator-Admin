import DataTable from "react-data-table-component";
import { AiFillCheckSquare, AiOutlineEdit, AiOutlineProject } from "react-icons/ai";
import {
  BsCheckSquareFill,
  BsFillTrashFill,
  BsNewspaper,
  BsThreeDots,
} from "react-icons/bs";
import Dropdown from "rc-dropdown";
import Loading from "../Loading/Loading";
import { isEmpty } from "lodash";
import Paginate from "../Paginate/Paginate";
import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { textToColor, toVN } from "../../Ultilities/String";
import { FaCoins } from "react-icons/fa";

const SponsorTable = (props) => {
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

  const CustomCell = ({ sponsor, row, avatar, ping, textColor, icon }) => (
    <div
      className={`hover:cursor-pointer h-full w-full flex items-center gap-2 ${
        textColor ? textColor : "text-primary"
      } pr-2`}
      onClick={() => {
        props.getSponsorInformation(sponsor);
      }}
    >
      {avatar &&
        (sponsor.imageUrl ? (
          <div>
            <img
              className="w-6 h-6 rounded-full"
              src={sponsor.imageUrl}
              alt="avatar"
            />
          </div>
        ) : (
          <div>
            <img
              className="w-6 h-6 rounded-full"
              alt="avatar"
              src={`https://ui-avatars.com/api/?name=${sponsor.sponsorName}&length=1&background=30BC97&color=FFFFFF`}
            />
          </div>
        ))}
      {ping && (
        <div className={`w-3 h-3 rounded-full bg-${textToColor(row)}`}></div>
      )}
      {icon && <div>{icon}</div>}
      <div>{toVN(row)}</div>
    </div>
  );
  const CustomHeader = ({ title }) => (
    <div className="font-bold h-full flex items-center text-sm">{title}</div>
  );

  const CustomMenuDropdown = ({ sponsor }) => (
    <div className="absolute left-0 -top-4 rounded-lg bg-white shadow-xl cursor-pointer font-bold text-sm w-32 z-50 p-1">
      <div className="hover:bg-purple/20 hover:text-purple p-2 flex items-center gap-2 relative text-purple rounded-lg text-sm">
        <BsNewspaper />
        <div>Chi tiết</div>
        <div
          className="absolute w-full h-full"
          onClick={() => navigate(`/sponsors/${sponsor.sponsorId}`)}
        ></div>
      </div>
      <div className="hover:bg-green/20 hover:text-green p-2 flex items-center gap-2 relative text-green rounded-lg text-sm">
        <AiOutlineEdit />
        <div>Chỉnh sửa</div>
        <div
          className="absolute w-full h-full"
          onClick={() => navigate(`/sponsors/${sponsor.sponsorId}`)}
        ></div>
      </div>
      <div className="hover:bg-red-500/20 hover:text-red-500 p-2 flex items-center gap-2 relative text-red-500 rounded-lg text-sm">
        <BsFillTrashFill />
        <div>Xóa</div>
        <div
          className="absolute w-full h-full"
          onClick={() => props.removeSponsor(sponsor.sponsorId)}
        ></div>
      </div>
    </div>
  );

  const CustomDropdown = ({ row }) => (
    <Dropdown
      className="w-full h-full"
      trigger={["click"]}
      overlay={<CustomMenuDropdown sponsor={row} />}
    >
      <div className="flex items-center justify-center cursor-pointer">
        <BsThreeDots />
      </div>
    </Dropdown>
  );

  const columns = [
    {
      name: <CustomHeader title="Họ và tên" />,
      selector: (sponsor) => sponsor.sponsorName,
      sortable: true,
      //   width: "20%",
      cell: (sponsor) => (
        <CustomCell sponsor={sponsor} row={sponsor.sponsorName} avatar={true} />
      ),
    },
    {
      name: <CustomHeader title="Loại tài trợ" />,
      selector: (sponsor) => sponsor.type,
      sortable: true,
      //   width: "20%",
      cell: (sponsor) => (
        <CustomCell sponsor={sponsor} row={sponsor.type} ping={true} />
      ),
    },
    {
      name: <CustomHeader title="Tổng point tài trợ" />,
      selector: (sponsor) => sponsor.totalPoint,
      sortable: true,
      // width: "20%",
      cell: (sponsor) => (
        <CustomCell
          sponsor={sponsor}
          row={sponsor.totalPoint.toLocaleString()}
          textColor="text-yellow-500"
          icon={<FaCoins />}
        />
      ),
    },
    {
      name: <CustomHeader title="Tổng dự án tài trợ" />,
      selector: (sponsor) => sponsor.totalProjects,
      sortable: true,
      //   width: "20%",
      cell: (sponsor) => (
        <CustomCell
          sponsor={sponsor}
          row={sponsor.totalProjects}
          textColor="text-purple"
          icon={<AiOutlineProject />}
        />
      ),
    },
    {
      name: <CustomHeader title="Trạng thái" />,
      selector: (sponsor) => sponsor.type,
      sortable: true,
      //   width: "20%",
      cell: (sponsor) => (
        <CustomCell sponsor={sponsor} row={sponsor.sponsorStatus} ping={true} />
      ),
    },
    {
      button: true,
      width: "5%",
      cell: (sponsor) => <CustomDropdown row={sponsor} />,
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

  return (
    <div>
      <DataTable
        columns={columns}
        data={props.data}
        // selectableRows
        customStyles={customStyles}
        selectableRowsComponent={CustomCheckBox}
        onSelectedRowsChange={props.getSelectedSponsors}
        progressPending={props.loading}
        progressComponent={<Loading />}
        // onSort={handleSort}
        // sortServer
      />
      {!isEmpty(props.selectedSponsors) && (
        <div className="mt-5 flex justify-between items-center font-bold px-4">
          <div className="text-green flex items-center gap-4">
            <AiFillCheckSquare />
            <div>Đã chọn {props.selectedSponsors.length} nhà tài trợ</div>
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

export default SponsorTable;
