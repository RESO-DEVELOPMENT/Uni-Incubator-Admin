import Loading from "../Loading/Loading";
import { isEmpty } from "lodash";
import { GiTwoCoins } from "react-icons/gi";
import { toDate } from "../../Ultilities/Date";
import { FaPaperPlane } from "react-icons/fa";
import { BiEditAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { FixText, textToColor, toVN } from "../../Ultilities/String";

const PayslipSimpleTable = (props) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg">
      <div className="border border-slate-200 rounded-lg">
        <div className="flex justify-between items-center p-3">
          <div>
            <div className="text-xl font-bold mb-2">Phiếu lương gần đây</div>
            <div className="text-sm font-bold text-orange-600">
              Tổng số phiếu lương: {props.totalItems}
            </div>
          </div>
          <div
            className="font-bold text-green hover:underline cursor-pointer text-sm"
            onClick={() => navigate("/profile/payslips")}
          >
            Xem tất cả
          </div>
        </div>
        <div className="px-5">
          <table className="w-full">
            <thead className="text-black/70">
              <tr>
                <th className="py-4 w-1/5 border-b border-slate-200">
                  Chú thích
                </th>
                <th className="py-4 w-1/5 border-b border-slate-200">
                  Ngày tạo phiếu lương
                </th>
                <th className="py-4 border-b border-slate-200">Tổng point</th>
                <th className="py-4 border-b border-slate-200">Tổng XP</th>
                <th className="py-4 border-b border-slate-200">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="relative">
              {!props.loading ? (
                <>
                  {!isEmpty(props.payslips) ? (
                    props.payslips.map((item) => {
                      return (
                        <tr key={item.payslipId}>
                          <td className="py-4 ">
                            <div className="grid grid-cols-4">
                              <div className="text-green text-xl flex items-center justify-center">
                                <BiEditAlt />
                              </div>
                              <div className="truncate text-primary col-span-3">
                                {item.note ? FixText(item.note) : "N/A"}
                              </div>
                            </div>
                          </td>
                          <td className="w-1/5 py-4 ">
                            <div className="text-center font-bold text-black/70">
                              {toDate(item.createdAt)}
                            </div>
                          </td>
                          <td className="py-4 ">
                            <div className="flex items-center gap-2 text-yellow-500 justify-center font-bold tracking-wider">
                              <div>
                                {(
                                  item.totalP1 +
                                  item.totalP2 +
                                  item.totalP3 +
                                  item.totalBonus
                                ).toLocaleString()}
                              </div>
                              <div>
                                <GiTwoCoins />
                              </div>
                            </div>
                          </td>
                          <td className="py-4 ">
                            <div className="flex items-center gap-2 text-per-75 justify-center font-bold tracking-wider">
                              <div>{item.totalXP}</div>
                              <div>
                                <FaPaperPlane />
                              </div>
                            </div>
                          </td>
                          <td className="py-4 ">
                            <div
                              className="font-bold text-center tracking-wider"
                              style={{ color: textToColor(item.status) }}
                            >
                              {toVN(item.status)}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={10}>
                        <div className="text-center py-4 font-bold text-black/70">
                          Không có phiếu lương nào
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
        </div>
      </div>
    </div>
  );
};

export default PayslipSimpleTable;
