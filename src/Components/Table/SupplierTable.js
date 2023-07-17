import DataTable from "react-data-table-component";
import { AiOutlineEdit } from "react-icons/ai";
import { BsFillTrashFill, BsThreeDots } from "react-icons/bs";
import Dropdown from "rc-dropdown";
import Loading from "../Loading/Loading";
import Paginate from "../Paginate/Paginate";
import { useNavigate } from "react-router-dom";
import { textToColor, toVN } from "../../Ultilities/String";
import { VscDebugRestart } from "react-icons/vsc";
import { toDate } from "../../Ultilities/Date";

const SupplierTable = (props) => {
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

  const CustomCell = ({ supplier, row, ping, textColor, icon }) => (
    <div
      className={`hover:cursor-pointer h-full w-full flex items-center gap-2 ${
        textColor ? textColor : "text-primary"
      } pr-2`}
      onClick={() => {
        props.getSelectedSupplier(supplier);
      }}
    >
      {ping && (
        <div
          className={`w-3 h-3 rounded-full`}
          style={{ background: textToColor(row) }}
        ></div>
      )}
      {icon && <div>{icon}</div>}
      <div>{toVN(row)}</div>
    </div>
  );
  const CustomHeader = ({ title }) => (
    <div className="font-bold h-full flex items-center text-sm">{title}</div>
  );

  const CustomMenuDropdown = ({ supplier }) => (
    <div className="absolute left-0 -top-4 rounded-lg bg-white shadow-xl cursor-pointer font-bold text-sm w-32 z-50 p-1">
      <div className="hover:bg-green/20 hover:text-green p-2 flex items-center gap-2 relative text-green rounded-lg text-sm">
        <AiOutlineEdit />
        <div>Chỉnh sửa</div>
        <div
          className="absolute w-full h-full"
          onClick={() => navigate(`/suppliers/${supplier.supplierId}`)}
        ></div>
      </div>
      {supplier.status === "unavailable" ? (
        <div className="hover:bg-purple/20 hover:text-purple p-2 flex items-center gap-2 relative text-purple rounded-lg text-sm">
          <VscDebugRestart />
          <div>Khôi phục</div>
          <div
            className="absolute w-full h-full"
            onClick={() => props.updateSupplierStatus(supplier, "available")}
          ></div>
        </div>
      ) : (
        <div className="hover:bg-red-500/20 hover:text-red-500 p-2 flex items-center gap-2 relative text-red-500 rounded-lg text-sm">
          <BsFillTrashFill />
          <div>Xóa</div>
          <div
            className="absolute w-full h-full"
            onClick={() => props.updateSupplierStatus(supplier, "unavailable")}
          ></div>
        </div>
      )}
    </div>
  );

  const CustomDropdown = ({ row }) => (
    <Dropdown
      className="w-full h-full"
      trigger={["click"]}
      overlay={<CustomMenuDropdown supplier={row} />}
    >
      <div className="flex items-center justify-center cursor-pointer">
        <BsThreeDots />
      </div>
    </Dropdown>
  );

  const columns = [
    {
      name: <CustomHeader title="Nhà cung cấp" />,
      selector: (supplier) => supplier.name,
      sortable: true,
      //   width: "20%",
      cell: (supplier) => (
        <CustomCell supplier={supplier} row={supplier.name} />
      ),
    },
    {
      name: <CustomHeader title="Mô tả" />,
      selector: (supplier) => supplier.description,
      //   sortable: true,
      //   width: "20%",
      cell: (supplier) => (
        <CustomCell supplier={supplier} row={supplier.description} />
      ),
    },
    {
      name: <CustomHeader title="Ngày tạo" />,
      selector: (supplier) => supplier.createdAt,
      //   sortable: true,
      //   width: "20%",
      cell: (supplier) => (
        <CustomCell supplier={supplier} row={toDate(supplier.createdAt)} />
      ),
    },
    {
      name: <CustomHeader title="Trạng thái" />,
      selector: (supplier) => supplier.totalPoint,
      //   sortable: true,
      // width: "20%",
      cell: (supplier) => (
        <CustomCell supplier={supplier} row={supplier.status} ping={true} />
      ),
    },
    {
      name: <CustomHeader title="Lần cập nhật cuối" />,
      selector: (supplier) => supplier.updatedAt,
      //   sortable: true,
      //   width: "20%",
      cell: (supplier) => (
        <CustomCell
          supplier={supplier}
          row={toDate(
            supplier.updatedAt ? supplier.updatedAt : supplier.createdAt
          )}
        />
      ),
    },
    {
      button: true,
      width: "5%",
      cell: (supplier) => <CustomDropdown row={supplier} />,
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

export default SupplierTable;
