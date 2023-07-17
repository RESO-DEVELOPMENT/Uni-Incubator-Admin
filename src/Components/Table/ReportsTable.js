import { isEmpty } from "lodash";
import Loading from "../Loading/Loading";
import Paginate from "../Paginate/Paginate";
import { BsArrowRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { toDate } from "../../Ultilities/Date";
import { textToColorReport, toVNReport } from "../../Ultilities/String";
import { GiTwoCoins } from "react-icons/gi";

const ReportsTable = (props) => {
  const navigate = useNavigate();
  const getPage = (page) => {
    props.getPage(page);
  };
  return (
    <div>
      <table className="table-fixed w-full border border-slate-200">
        <thead className="bg-green/10 py-2 text-black/70">
          <tr>
            <th className="py-3">Báo cáo dự án</th>
            <th className="py-3">Tên dự án</th>
            <th className="py-3">Tổng point công việc</th>
            <th className="py-3">Tổng thưởng</th>
            <th className="py-3">Tổng point báo cáo</th>
            <th className="py-3">Kỳ lương</th>
            <th className="py-3">Trạng thái</th>
            {(props.currentMember.role === "ADMIN" || props.isManager) && (
              <th className="py-3">Chi tiết</th>
            )}
          </tr>
        </thead>
        <tbody className="relative">
          {!props.loading ? (
            <>
              {!isEmpty(props.reports) ? (
                props.reports.map((report) => {
                  return (
                    <tr key={report.reportId}>
                      <td className="py-2">
                        <div className="text-center font-bold text-primary">
                          [{report.project.projectShortName}]
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="text-center text-primary">
                          {report.project.projectName}
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="text-center flex gap-2 items-center justify-center text-yellow-500">
                          <div>{report.taskPointNeeded.toLocaleString()}</div>
                          <div>
                            <GiTwoCoins />
                          </div>
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="text-center flex gap-2 items-center justify-center text-green">
                          <div>{report.bonusPointNeeded.toLocaleString()}</div>
                          <div>
                            <GiTwoCoins />
                          </div>
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="text-center flex gap-2 items-center justify-center text-yellow-500">
                          <div>
                            {(
                              report.taskPointNeeded + report.bonusPointNeeded
                            ).toLocaleString()}
                          </div>
                          <div>
                            <GiTwoCoins />
                          </div>
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="text-center text-primary text-sm">
                          {toDate(report.salaryCycle.startedAt)}
                        </div>
                      </td>
                      <td className="py-2">
                        <div
                          className={`text-center font-bold text-${textToColorReport(
                            report.status
                          )}`}
                        >
                          {toVNReport(report.status)}
                        </div>
                      </td>
                      {(props.currentMember.role === "ADMIN" ||
                        props.isManager) && (
                        <td className="py-2">
                          <div className="flex justify-center items-center">
                            <div
                              className="p-2 rounded-full hover:bg-green/10 text-green flex items-center justify-center cursor-pointer"
                              onClick={() =>
                                navigate(`/reports/${report.reportId}`)
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
                  <td colSpan={8}>
                    <div className="text-center py-3 font-bold text-black/70">
                      Không có báo cáo nào
                    </div>
                  </td>
                </tr>
              )}
            </>
          ) : (
            <tr>
              <td colSpan={8}>
                <Loading />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {!isEmpty(props.reports) && (
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

export default ReportsTable;
