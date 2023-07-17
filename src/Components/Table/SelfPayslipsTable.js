import Paginate from "../Paginate/Paginate";
import Loading from "../Loading/Loading";
import { isEmpty } from "lodash";
import { GiTwoCoins } from "react-icons/gi";
import { BsArrowRight } from "react-icons/bs";
import { toDate } from "../../Ultilities/Date";
import { FaPaperPlane } from "react-icons/fa";
import { BiEditAlt } from "react-icons/bi";
import SelectSimple from "../Select/SelectSimple";
import { useNavigate } from "react-router-dom";
import { FixText, textToColor, toVN } from "../../Ultilities/String";

const SelfPayslipsTable = (props) => {
  const navigate = useNavigate();

  const getPage = (page) => {
    props.getPage(page);
  };

  return (
    <div>
      <div className="border border-slate-200">
        <div className=" py-3 px-5 bg-green/10 flex items-center justify-between">
          <div className="font-bold text-lg">Thông tin các phiếu lương</div>
          <div className="min-w-64">
            <SelectSimple
              options={props.cycles}
              onChange={props.getCurrentCycle}
            />
          </div>
        </div>
        <div className="px-5">
          <table className="w-full">
            <thead className="text-black/70">
              <tr>
                <th className="py-3 w-1/5 border-b border-slate-200">
                  Chú thích
                </th>
                <th className="py-3 w-1/5 border-b border-slate-200">
                  Ngày tạo phiếu lương
                </th>
                <th className="py-3 border-b border-slate-200">Tổng point</th>
                <th className="py-3 border-b border-slate-200">Tổng XP</th>
                <th className="py-3 border-b border-slate-200">Trạng thái</th>
                <th className="py-3 border-b border-slate-200">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="relative">
              {!props.loading ? (
                <>
                  {!isEmpty(props.payslips) ? (
                    props.payslips.map((item) => {
                      return (
                        <tr key={item.payslipId}>
                          <td className="py-2 border-b border-slate-200">
                            <div className="grid grid-cols-4">
                              <div className="text-green text-xl flex items-center justify-center">
                                <BiEditAlt />
                              </div>
                              <div className="truncate text-primary col-span-3">
                                {item.note ? FixText(item.note) : "N/A"}
                              </div>
                            </div>
                          </td>
                          <td className="w-1/5 py-2 border-b border-slate-200">
                            <div className="text-center font-bold text-black/70">
                              {toDate(item.createdAt)}
                            </div>
                          </td>
                          <td className="py-2 border-b border-slate-200">
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
                          <td className="py-2 border-b border-slate-200">
                            <div className="flex items-center gap-2 text-per-75 justify-center font-bold tracking-wider">
                              <div>{item.totalXP}</div>
                              <div>
                                <FaPaperPlane />
                              </div>
                            </div>
                          </td>
                          <td className="py-2 border-b border-slate-200">
                            <div
                              className="font-bold text-center tracking-wider"
                              style={{ color: textToColor(item.status) }}
                            >
                              {toVN(item.status)}
                            </div>
                          </td>
                          <td className="py-2 border-b border-slate-200">
                            <div className="flex justify-center items-center">
                              <div
                                className="p-2 rounded-full hover:bg-green/10 text-green flex items-center justify-center cursor-pointer"
                                onClick={() => {
                                  props.getCurrentPaySlip(item);
                                  navigate(`${item.payslipId}`);
                                }}
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
      {!isEmpty(props.payslips) && (
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

export default SelfPayslipsTable;
