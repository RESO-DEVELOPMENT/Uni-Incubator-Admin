import Button from "../../Components/Button/Button";
import { TopBar } from "../Layout/TopBar";
import voucher_pic from "../../Pictures/member_voucher_pic.png";
import { AiFillGift } from "react-icons/ai";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import memberApi from "../../API/Member/memberApi";
import ToastError from "../../Components/Alert/ToastError";
import { useEffect } from "react";
import MemberVoucherTable from "../../Components/Table/MemberVoucherTable";

const VoucherForMember = () => {
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const getPage = (page) => {
    setPage(page);
  };

  useEffect(() => {
    const getVoucher = async () => {
      setLoading(true);
      try {
        const response = await memberApi.getSelftVoucher({
          page: page,
          "page-size": pageSize,
        });
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          setTotalPages(pagination.totalPages);
          setCurrentPage(pagination.currentPage);
          setVouchers(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setLoading(false);
    };

    getVoucher();
  }, [page, pageSize]);

  return (
    <div>
      <TopBar />
      <div className="pl-10 pr-5 mb-10">
        <div className="grid grid-cols-7 gap-10 mb-10">
          <div className="bg-white flex py-2 px-16 rounded-lg gap-5 h-64 col-span-5 shadow-md">
            <img className="w-60 h-60" src={voucher_pic} alt="voucher_pic" />
            <div className="font-bold w-full grid grid-rows-3 py-5">
              <div className="mt-3 text-3xl mb-3 self-start">
                Ví voucher của tôi
              </div>
              <div className="mb-3 self-center">
                Quản lý voucher dành cho thành viên của Uni Incubator
              </div>
              <div className="w-fit self-end">
                <Button
                  type="trans"
                  text="Xem lịch sử"
                  onClick={() => navigate("/wallets")}
                />
              </div>
            </div>
          </div>
          <div className="col-span-2 bg-white rounded-lg shadow-md flex flex-col justify-center items-center">
            <div className="text-2xl mb-5 font-bold text-per-75">
              Tổng số voucher
            </div>
            <div className="flex gap-2 items-center text-xl font-bold text-yellow-500">
              <div>{vouchers.length}</div>
              <div>
                <AiFillGift />
              </div>
            </div>
          </div>
        </div>
        <div className="shadow-md rounded-lg p-5 bg-white">
          <div className="text-xl font-bold mb-5">
            Phần thưởng - voucher đã đổi
          </div>
          <div>
            <MemberVoucherTable
              vouchers={vouchers}
              loading={loading}
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              currentPage={currentPage}
              getPage={getPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherForMember;
