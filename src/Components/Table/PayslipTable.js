import { toDate } from "../../Ultilities/Date";
import { textToColor, toVN } from "../../Ultilities/String";
import { GiTwoCoins } from "react-icons/gi";
import { BsArrowRight } from "react-icons/bs";
import Paginate from "../Paginate/Paginate";
import Loading from "../Loading/Loading";
import { isEmpty } from "lodash";
import { useNavigate } from "react-router-dom";

const PayslipTable = (props) => {
  const getPage = (page) => {
    props.getPage(page);
  };

  const navigate = useNavigate();

  return (
    <div>
      <table className="w-full border border-slate-200">
        <thead className="bg-green/10 py-2 text-black/70">
          <tr>
            <th className="py-3 w-1/6">Thông tin thành viên</th>
            <th className="py-3 w-1/6">Ngày bắt đầu kỳ lương</th>
            <th className="py-3">Tổng point</th>
            {props.p1 && <th className="py-3">Point P1</th>}
            <th className="py-3">Point P2</th>
            <th className="py-3">Point P3</th>
            <th className="py-3">Thưởng</th>
            <th className="py-3">Trạng thái</th>
            {props.currentMember.role === "ADMIN" && (
              <th className="py-3">Chi tiết</th>
            )}
          </tr>
        </thead>
        <tbody className="relative">
          {!props.loading ? (
            <>
              {!isEmpty(props.payslips) ? (
                props.payslips.map((item) => {
                  return (
                    <tr key={item.payslipId}>
                      <td className="w-1/6 py-2">
                        <div className="grid grid-cols-3 gap-1 px-5 font-bold py-1">
                          <div className="flex justify-center items-center">
                            <img
                              className="w-10 h-10 rounded-full"
                              src={
                                item.member.imageUrl
                                  ? item.member.imageUrl
                                  : `https://ui-avatars.com/api/?name=${item.member.fullName}&length=1&background=30BC97&color=FFFFFF`
                              }
                              alt="avatar"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="col-span-2">
                            <div className="truncate text-black/70">
                              {item.member.fullName}
                            </div>
                            <div className="truncate text-sm text-primary/70">
                              {item.member.emailAddress}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="w-1/6 py-2">
                        <div className="text-center font-bold text-black/70">
                          {toDate(item.createdAt)}
                        </div>
                      </td>
                      <td className="py-2">
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
                      {props.p1 && (
                        <td className="py-2">
                          <div className="text-primary font-bold text-center tracking-wider">
                            {item.totalP1.toLocaleString()}
                          </div>
                        </td>
                      )}
                      <td className="py-2">
                        <div className="text-primary font-bold text-center tracking-wider">
                          {item.totalP2.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="text-primary font-bold text-center tracking-wider">
                          {item.totalP3.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="text-primary font-bold text-center tracking-wider">
                          {item.totalBonus.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-2">
                        <div
                          className="font-bold text-center tracking-wider"
                          style={{ color: textToColor(item.status) }}
                        >
                          {toVN(item.status)}
                        </div>
                      </td>
                      {props.currentMember.role === "ADMIN" && (
                        <td className="py-2">
                          <div className="flex justify-center items-center">
                            <div
                              className="p-2 rounded-full hover:bg-green/10 text-green flex items-center justify-center cursor-pointer"
                              onClick={() =>
                                navigate(
                                  `/users/${item.member.memberId}/payslips/${item.payslipId}`
                                )
                              }
                            >
                              <BsArrowRight />
                            </div>
                          </div>
                        </td>
                      )}
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
      {!props.disablePaginate && !isEmpty(props.payslips) && (
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

export default PayslipTable;
