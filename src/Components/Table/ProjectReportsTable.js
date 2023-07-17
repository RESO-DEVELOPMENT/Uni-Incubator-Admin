import { isEmpty } from "lodash";
import Loading from "../Loading/Loading";
import Paginate from "../Paginate/Paginate";
import { BsArrowRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { toDate } from "../../Ultilities/Date";
import { textToColorReport, toVNReport } from "../../Ultilities/String";
import { GiTwoCoins } from "react-icons/gi";

const ProjectReportsTable = (props) => {
  const navigate = useNavigate();
  const getPage = (page) => {
    props.getPage(page);
  };
  return (
    <div>
      <table className="table-fixed w-full border border-slate-200">
        <thead className="bg-green/10 py-2 text-black/70">
          <tr>
            <th className="py-3 w-1/6">Kỳ lương báo cáo</th>
            <th className="py-3 w-1/6">Thời gian bắt đầu</th>
            <th className="py-3 w-1/6">Thời gian kết thúc</th>
            <th className="py-3 w-1/6">Trạng thái</th>
            <th className="py-3 w-1/6">Tổng point chi trả</th>
            {(props.currentMember.role === "ADMIN" || props.isMember) && (
              <th className="py-3 w-1/6">Chi tiết</th>
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
                        <div className="text-center font-bold text-black/70 text-sm">
                          {report.salaryCycle.name
                            ? report.salaryCycle.name
                            : toDate(report.salaryCycle.startedAt)}
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="text-center text-primary text-sm">
                          {toDate(report.createdAt)}
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="text-center text-primary text-sm">
                          {toDate(report.reviewedAt)}
                        </div>
                      </td>
                      <td className="py-2">
                        <div
                          className={`text-center text-${textToColorReport(
                            report.status
                          )}`}
                        >
                          {toVNReport(report.status)}
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
                      {(props.currentMember.role === "ADMIN" ||
                        props.isMember) && (
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
                  <td colSpan={10}>
                    <div className="text-center py-3 font-bold text-black/70">
                      Không có báo cáo nào
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

export default ProjectReportsTable;
