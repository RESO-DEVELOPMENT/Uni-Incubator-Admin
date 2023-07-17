import Loading from "../Loading/Loading";
import { toDateWithTime } from "../../Ultilities/Date";
import { isEmpty } from "lodash";
import { GiTwoCoins } from "react-icons/gi";
import { textToColor } from "../../Ultilities/String";

const TransactionTable = (props) => {
  return (
    <div>
      <table className="w-full border border-slate-200">
        <thead className="bg-green/10 py-2 text-black/70">
          <tr>
            <th className="py-3 w-1/6">ID giao dịch</th>
            <th className="py-3 w-1/6">Ngày tạo giao dịch</th>
            <th className="py-3 w-1/6">Tổng point tài trợ</th>
            <th className="py-3 w-1/6">Ngày nhận point</th>
            <th className="py-3 w-1/6">Trạng thái giao dịch</th>
          </tr>
        </thead>
        <tbody className="relative">
          {!isEmpty(props.transactions) ? (
            <>
              {props.transactions.map((item) => {
                return (
                  <tr key={item.projectSponsonTracsactionId}>
                    <td className="py-2 w-1/6">
                      <div className="text-black/60 font-bold px-2 tracking-wider">
                        {item.projectSponsonTracsactionId}
                      </div>
                    </td>
                    <td className="py-2 w-1/6">
                      <div className="text-primary font-bold text-center tracking-wider">
                        {toDateWithTime(item.createdAt)}
                      </div>
                    </td>
                    <td className="py-2 w-1/6">
                      <div className={`flex items-center gap-2 text-green justify-center font-bold tracking-wider`}>
                        <div>+{item.amount.toLocaleString()}</div>
                        <div>
                          <GiTwoCoins />
                        </div>
                      </div>
                    </td>
                    <td className="py-2 w-1/6">
                      <div className="text-primary font-bold text-center tracking-wider">
                        {toDateWithTime(item.paidAt)}
                      </div>
                    </td>
                    <td className="py-2 w-1/6">
                      <div className="text-primary font-bold text-center tracking-wider">
                        <div
                          className={`text-${textToColor(
                            item.status
                          )} font-bold text-center tracking-wider`}
                        >
                          {item.status ? "Đã chuyển" : "Chưa hoàn tất"}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {props.loading && (
                <div className="absolute text-center w-full h-full left-0 top-0 bg-black/10 min-h-10">
                  <Loading />
                </div>
              )}
            </>
          ) : (
            <tr>
              <td colSpan={10}>
                <div className="text-center py-3 font-bold text-black/70">
                  Không có giao dịch nào
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
