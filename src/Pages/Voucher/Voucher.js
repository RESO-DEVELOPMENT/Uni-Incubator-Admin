import { TopBar } from "../Layout/TopBar";
import voucher_pic from "../../Pictures/voucher.png";
import ButtonIcon from "../../Components/Button/ButtonIcon";
import { MdOutlineAddCircle } from "react-icons/md";
import { useState } from "react";
import { useEffect } from "react";
import ToastError from "../../Components/Alert/ToastError";
import voucherApi from "../../API/Voucher/voucherApi";
import { AiFillGift } from "react-icons/ai";
import VoucherTable from "../../Components/Table/VoucherTable";
import VoucherAddModal from "./Components/VoucherAddModal";
import VoucherDetailModal from "./Components/VoucherDetailModal";
import VoucherUpdateModal from "./Components/VoucherUpdateModal";
import supplierApi from "../../API/Supplier/supplierApi";
import SelectSimple from "../../Components/Select/SelectSimple";
import { voucherType } from "../../Config/config";
import TextInputSimple from "../../Components/Input/TextInputSimple";
import { identity, isEmpty, pickBy } from "lodash";

const Voucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [types] = useState(voucherType);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [openModal, setOpenModal] = useState(false);

  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState({});

  const [supplierOptions, setSupplierOptions] = useState([
    { value: "", label: "Tất cả" },
  ]);
  const [supplierFilter, setSupplierFilter] = useState("");
  const [voucherName, setVoucherName] = useState("");
  const [voucherTypeFilter, setVoucherTypeFilter] = useState("");

  const [modalLoading, setModalLoading] = useState(false);

  const [reload, setReload] = useState(false);

  document.title = "Voucher | UniCare";

  const activeReload = () => {
    setReload(!reload);
  };

  const getPage = (page) => {
    setPage(page);
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  const getVoucher = (voucher) => {
    setOpenDetailModal(true);
    setSelectedVoucher(voucher);
  };

  const closeDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedVoucher({});
  };

  const updateVoucher = () => {
    setOpenDetailModal(false);
    setOpenUpdateModal(true);
  };

  const updateSuccess = async (voucher) => {
    setModalLoading(true);
    try {
      const response = await voucherApi.getById(voucher.voucherId);
      if (response.success) {
        setSelectedVoucher(response.data.message);
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
    setModalLoading(false);
    setOpenUpdateModal(false);
    setOpenDetailModal(true);
  };

  useEffect(() => {
    if (page === -1) {
      setPage(1);
      return;
    }
    const getVoucher = async () => {
      setLoading(true);
      try {
        const response = await voucherApi.get(
          pickBy(
            {
              OrderBy: "createdAtDesc",
              page: page,
              "page-size": pageSize,
              supplierId: supplierFilter,
              Name: voucherName,
              Type: voucherTypeFilter,
            },
            identity
          )
        );
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          setTotalItems(pagination.totalItems);
          setTotalPages(pagination.totalPages);
          setCurrentPage(pagination.currentPage);
          setVouchers(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setLoading(false);
    };

    if (!isEmpty(voucherName)) {
      const timer = setTimeout(() => {
        getVoucher();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      getVoucher();
    }
  }, [page, pageSize, supplierFilter, voucherName, voucherTypeFilter, reload]);

  useEffect(() => {
    const getSuppliers = async () => {
      try {
        const response = await supplierApi.get();
        if (response.success) {
          const data = [];
          response.data.message.forEach((item) => {
            data.push({
              value: item.supplierId,
              label: item.name,
            });
          });
          setSuppliers(data);
          setSupplierOptions([{ label: "Tất cả", value: "" }, ...data]);
        }
      } catch (error) {
        ToastError({ text: "Không thể lấy thông tin những nhà cung cấp" });
      }
    };
    getSuppliers();
  }, []);

  return (
    <div>
      <TopBar />
      <div className="pl-10 pr-5 mb-10">
        <div className="grid grid-cols-7 gap-10 mb-10">
          <div className="bg-white flex py-2 px-16 rounded-lg gap-5 h-64 col-span-5 shadow-md">
            <img className="w-60 h-60" src={voucher_pic} alt="voucher_pic" />
            <div className="font-bold w-full grid grid-rows-3 py-5">
              <div className="mt-3 text-3xl mb-3 self-start">
                Quản lý phần thưởng
              </div>
              <div className="mb-3 self-center">
                Quản lý, chỉnh sửa, phần thưởng , voucher dành cho thành viên
                của Uni Incubator
              </div>
              <div className="w-fit self-end">
                <ButtonIcon
                  text="Tạo voucher"
                  icon={<MdOutlineAddCircle className="text-white text-lg" />}
                  onClick={() => setOpenModal(true)}
                />
              </div>
            </div>
          </div>
          <div className="col-span-2 bg-white rounded-lg shadow-md flex flex-col justify-center items-center">
            <div className="text-xl mb-5 font-bold text-per-75">
              Tổng số voucher
            </div>
            <div className="flex gap-2 items-center text-3xl font-bold text-yellow-500">
              <div>{totalItems}</div>
              <div>
                <AiFillGift />
              </div>
            </div>
          </div>
        </div>
        <div className="shadow-md rounded-lg p-5 bg-white">
          <div className="mb-5">
            <div className="text-xl font-bold">
              Phần thưởng - voucher quy đổi
            </div>
          </div>
          <div className="grid grid-cols-4 gap-5 mb-5">
            <div>
              <TextInputSimple
                value={voucherName}
                onChange={(e) => setVoucherName(e.target.value)}
                label="Tên voucher"
                placeholder="Tìm kiếm"
              />
            </div>
            <div></div>
            <div>
              <SelectSimple
                label="Loại"
                options={[{ label: "Tất cả", vale: "" }, ...types]}
                onChange={(e) => {
                  setPage(-1);
                  setVoucherTypeFilter(e.value);
                }}
              />
            </div>
            <div>
              <SelectSimple
                label="Nhà cung cấp"
                options={supplierOptions}
                onChange={(e) => {
                  setPage(-1);
                  setSupplierFilter(e.value);
                }}
              />
            </div>
          </div>
          <div>
            <VoucherTable
              vouchers={vouchers}
              loading={loading}
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              currentPage={currentPage}
              getPage={getPage}
              getVoucher={getVoucher}
            />
          </div>
        </div>
        {openModal && (
          <VoucherAddModal
            activeReload={activeReload}
            closeModal={closeModal}
            suppliers={suppliers}
            types={types}
          />
        )}
        {openDetailModal && (
          <VoucherDetailModal
            closeModal={closeDetailModal}
            voucher={selectedVoucher}
            updateVoucher={updateVoucher}
            loading={modalLoading}
          />
        )}
        {openUpdateModal && (
          <VoucherUpdateModal
            voucher={selectedVoucher}
            closeModal={() => setOpenUpdateModal(false)}
            activeReload={() => setReload(!reload)}
            updateSuccess={updateSuccess}
            suppliers={suppliers}
            types={types}
          />
        )}
      </div>
    </div>
  );
};

export default Voucher;
