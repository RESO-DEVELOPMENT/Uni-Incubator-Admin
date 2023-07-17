import { isEmpty } from "lodash";
import Loading from "../Loading/Loading";
import Paginate from "../Paginate/Paginate";
import { toDate } from "../../Ultilities/Date";
import { GiTwoCoins } from "react-icons/gi";
import { textToColorVoucher, toVNVoucher } from "../../Ultilities/String";

const MemberVoucherTable = (props) => {
  const getPage = (page) => {
    props.getPage(page);
  };
  return (
    <div>
      <table className="w-full border border-slate-200">
        <thead className="bg-green/10 py-2 text-black/70">
          <tr>
            <th className="py-3 w-1/6">Tên voucher</th>
            <th className="py-3 w-1/6">Mô tả</th>
            <th className="py-3">Mã voucher</th>
            <th className="py-3">Thời hạn</th>
            <th className="py-3">Ngày mua</th>
            <th className="py-3 w-1/6">Số point quy đổi</th>
            <th className="py-3">Trạng thái</th>
          </tr>
        </thead>
        <tbody className="relative">
          {!props.loading ? (
            <>
              {!isEmpty(props.vouchers) ? (
                props.vouchers.map((item) => {
                  return (
                    <tr key={item.voucherId}>
                      <td className="py-2">
                        <div className="grid grid-cols-4 gap-1">
                          <div>
                            <img
                              className="w-10 h-10 rounded-full"
                              src={item.voucher.imageUrl}
                              alt="img"
                            />
                          </div>
                          <div className="font-bold text-black/70 text-sm col-span-3 word-break">
                            {item.voucher.voucherName}
                          </div>
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="grid">
                          <div className="text-center text-primary text-sm word-break">
                            {item.voucher.voucherDescription}
                          </div>
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="text-center text-primary text-sm font-bold">
                          {item.code}
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="text-center text-primary text-sm font-bold">
                          {toDate(item.expiredAt)}
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="text-center text-primary text-sm font-bold">
                          {toDate(item.createdAt)}
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="flex items-center justify-center gap-2 text-yellow-500 font-bold">
                          <div className="tracking-wider">
                            {item.voucher.voucherAmount.toLocaleString()}
                          </div>
                          <div>
                            <GiTwoCoins />
                          </div>
                        </div>
                      </td>
                      <td className="py-2">
                        <div
                          className={`text-center text-${textToColorVoucher(
                            item.status
                          )} text-sm font-bold`}
                        >
                          {toVNVoucher(item.status)}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10}>
                    <div className="text-center py-3 font-bold text-black/70">
                      Không có voucher nào
                    </div>
                  </td>
                </tr>
              )}
            </>
          ) : (
            <tr>
              <td colSpan={10}>
                <Loading />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {!isEmpty(props.vouchers) && (
        <div className="mt-5">
          <Paginate
            page={props.page}
            pageSize={props.pageSize}
            totalPages={props.totalPages}
            currentPage={props.currentPage}
            getPage={getPage}
          />
        </div>
      )}
    </div>
  );
};

export default MemberVoucherTable;
