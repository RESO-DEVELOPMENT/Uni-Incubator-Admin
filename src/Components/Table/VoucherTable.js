import { isEmpty } from "lodash";
import Loading from "../Loading/Loading";
import Paginate from "../Paginate/Paginate";
import { BsArrowRight } from "react-icons/bs";
import { toDate } from "../../Ultilities/Date";
import { GiTwoCoins } from "react-icons/gi";
import { toVN } from "../../Ultilities/String";

const VoucherTable = (props) => {
  const getPage = (page) => {
    props.getPage(page);
  };
  return (
    <div>
      <table className="w-full border border-slate-200">
        <thead className="bg-green/10 py-2 text-black/70">
          <tr>
            <th className="py-3 w-1/6">Tên</th>
            <th className="py-3 w-1/6">Mô tả</th>
            <th className="py-3">Giá</th>
            <th className="py-3">Số lượng</th>
            <th className="py-3">Nhà cung cấp</th>
            <th className="py-3">Loại</th>
            <th className="py-3">Ngày tạo</th>
            <th className="py-3">Chi tiết</th>
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
                              src={item.imageUrl}
                              alt="img"
                            />
                          </div>
                          <div className="font-bold text-black/70 text-sm col-span-3 flex items-center word-break">
                            {item.voucherName}
                          </div>
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="grid">
                          <div className="text-center text-primary text-sm truncate">
                            {item.voucherDescription}
                          </div>
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="flex gap-2 items-center justify-center text-yellow-500 text-sm font-bold">
                          <div>{item.voucherCost.toLocaleString()}</div>
                          <div>
                            <GiTwoCoins />
                          </div>
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="text-center font-bold text-primary">
                          {item.voucherAmount.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="text-center font-bold text-primary">
                          {item.supplier.name}
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="text-center font-bold text-primary">
                          {toVN(item.voucherType)}
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="text-center text-primary font-bold">
                          {toDate(item.createdAt)}
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="flex justify-center items-center">
                          <div
                            className="p-2 rounded-full hover:bg-green/10 text-green flex items-center justify-center cursor-pointer"
                            onClick={() => props.getVoucher(item)}
                          >
                            <BsArrowRight />
                          </div>
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

export default VoucherTable;
