import { BiMessageSquareAdd } from "react-icons/bi";
import { TopBar } from "../Layout/TopBar";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import ToastError from "../../Components/Alert/ToastError";
import supplierApi from "../../API/Supplier/supplierApi";
import { isEmpty, isNil, omitBy, pickBy, size, values } from "lodash";
import ToastSuccess from "../../Components/Alert/ToastSuccess";
import SupplierTable from "../../Components/Table/SupplierTable";
import SupplierDetailModal from "./Components/SupplierDetailModal";
import SupplierAddModal from "./Components/SupplierAddModal";
import { BsListStars } from "react-icons/bs";
import TextInputSimple from "../../Components/Input/TextInputSimple";
import SelectSimpleDot from "../../Components/Select/SelectSimpleDot";

const Supplier = () => {
  document.title = "Nhà cung cấp | UniCare";

  const [suppliers, setSuppliers] = useState([]);

  const [supplier, setSupplier] = useState({});

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, settotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [statusOptions] = useState([
    {
      value: "available",
      label: "Còn hoạt động",
      color: "#30BC97",
    },
    {
      value: "unavailable",
      label: "Ngưng hoạt động",
      color: "red",
    },
  ]);
  const [supName, setSupName] = useState("");
  const [supStatus, setSupStatus] = useState("");
  const [openFilter, setOpenFilter] = useState(false);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const [reload, setReload] = useState(false);

  let { supplierId } = useParams();
  const navigate = useNavigate();

  const getPage = (page) => {
    setCurrentPage(page);
    setPage(page);
  };

  const goToSupplier = (supplier) => {
    navigate(`/suppliers/${supplier.supplierId}`);
  };

  const closeAddModal = () => {
    setOpenAddModal(false);
    setSupplier({});
  };

  const closeDetailModal = () => {
    setOpenDetailModal(false);
    setSupplier({});
    navigate(`/suppliers`);
  };

  const getSupplierStatusFromSelect = (data) => {
    setSupplier((prev) => ({ ...prev, status: data?.value }));
  };

  const getSupplierData = (e) => {
    const { name, value } = e.target;
    setSupplier((prev) => ({ ...prev, [name]: value }));
  };

  const createSupplier = async () => {
    setModalLoading(true);
    try {
      const response = await supplierApi.createSupplier({
        ...supplier,
        status: "available",
      });
      if (response.success) {
        ToastSuccess({ text: "Tạo thành công" });
        closeAddModal();
        setPage(-1);
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
    setModalLoading(false);
  };

  const updateSupplier = async () => {
    setModalLoading(true);
    try {
      const response = await supplierApi.updateSupplier(supplier);
      if (response.success) {
        ToastSuccess({ text: "Cập nhật thành công" });
        setReload(!reload);
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
    setModalLoading(false);
  };

  const updateSupplierStatus = async (supplier, status) => {
    try {
      const response = await supplierApi.updateSupplier({
        ...supplier,
        status: status,
      });
      if (response.success) {
        ToastSuccess({ text: "Cập nhật thành công" });
        setReload(!reload);
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
  };

  useEffect(() => {
    const getSupplierById = async () => {
      setModalLoading(true);
      try {
        const response = await supplierApi.getSupplierById(supplierId);
        if (response.success) {
          setSupplier(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setModalLoading(false);
    };

    if (supplierId) {
      getSupplierById();
      setOpenDetailModal(true);
    }
  }, [supplierId]);

  useEffect(() => {
    if (page === -1) {
      setPage(1);
      return;
    }
    const getSuppliers = async () => {
      setLoading(true);
      try {
        const response = await supplierApi.get(
          omitBy(
            {
              page: page,
              "page-size": pageSize,
              Status: supStatus,
              Name: supName,
            },
            isEmpty
          )
        );
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          settotalPages(pagination.totalPages);
          setCurrentPage(pagination.currentPage);
          setSuppliers(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setLoading(false);
    };

    if (!isEmpty(supName)) {
      const timer = setTimeout(() => {
        getSuppliers();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      getSuppliers();
    }
  }, [page, pageSize, supName, supStatus, reload]);

  return (
    <>
      <TopBar />
      <div className="pl-10 pr-14 mb-10">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="grid grid-cols-2 mb-10">
            <div className="font-bold text-2xl">Quản lý nhà cung cấp</div>
            <div className="flex justify-between items-center">
              <div className="select-none flex items-center">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setOpenFilter(!openFilter)}
                >
                  <div className="p-2 rounded-full bg-purple/10 text-purple text-lg">
                    <BsListStars />
                  </div>
                  <div className="font-bold text-purple text-sm">
                    Lọc kết quả
                  </div>
                  <div className="border border-purple w-5 h-5 bg-purple/10 text-purple rounded-sm text-sm flex items-center justify-center font-bold">
                    {size(
                      values(
                        pickBy(
                          {
                            supStatus,
                            supName,
                          },
                          (value) => !isEmpty(value)
                        )
                      )
                    )}
                  </div>
                </div>
              </div>
              <div
                className="flex items-center gap-2 text-green font-bold cursor-pointer select-none"
                onClick={() => setOpenAddModal(true)}
              >
                <BiMessageSquareAdd />
                <div>Thêm nhà cung cấp</div>
              </div>
            </div>
          </div>
          <div
            className={`grid grid-cols-5 gap-5 ${
              openFilter ? "mb-5" : "h-0 overflow-hidden"
            }`}
          >
            <div>
              <TextInputSimple
                label="Tên nhà cung cấp"
                placeholder="Tìm kiếm"
                value={supName}
                onChange={(e) => setSupName(e.target.value)}
              />
            </div>
            <div className="col-span-2"></div>
            <div className="col-span-2 flex justify-end">
              <SelectSimpleDot
                label="Trạng thái"
                options={statusOptions}
                onChange={(data) =>
                  !isNil(data) ? setSupStatus(data.value) : setSupStatus("")
                }
              />
            </div>
          </div>
          <div>
            <SupplierTable
              data={suppliers}
              getSelectedSupplier={goToSupplier}
              loading={loading}
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              currentPage={currentPage}
              getPage={getPage}
              updateSupplierStatus={updateSupplierStatus}
            />
          </div>
        </div>
        {openDetailModal && (
          <SupplierDetailModal
            supplier={supplier}
            onCloseModal={closeDetailModal}
            getSupplierData={getSupplierData}
            updateSupplier={updateSupplier}
            getSupplierStatusFromSelect={getSupplierStatusFromSelect}
            statusOptions={statusOptions}
            loading={modalLoading}
          />
        )}
        {openAddModal && (
          <SupplierAddModal
            supplier={supplier}
            onCloseModal={closeAddModal}
            getSupplierData={getSupplierData}
            createSupplier={createSupplier}
            loading={modalLoading}
          />
        )}
      </div>
    </>
  );
};

export default Supplier;
