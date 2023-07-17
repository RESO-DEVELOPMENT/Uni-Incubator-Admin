import { isEmpty } from "lodash";
import Loading from "../Loading/Loading";

const ReoportDetailTable = (props) => {
  return (
    <table className="w-full border border-slate-200">
      <thead className="bg-green/10 py-2 text-black/70">
        <tr>
          <th className="py-3 w-1/6">ID công việc</th>
          <th className="py-3 w-1/6">Tên công việc</th>
          <th className="py-3">Email thành viên</th>
          <th className="py-3">Giờ làm ước tính</th>
          <th className="py-3">Giờ làm thực tế</th>
          <th className="py-3">Mô tả công việc</th>
        </tr>
      </thead>
      <tbody className="relative">
        {!isEmpty(props.report) ? (
          <>
            {props.report.map((item) => {
              return (
                <tr key={item.reportId}>
                  <td className="py-2">
                    <div className="text-black/70 font-bold text-center tracking-wider">
                      {item.projectReportMemberTaskId}
                    </div>
                  </td>
                  <td className="w-1/6 py-2">
                    <div className="text-green font-bold text-center tracking-wider">
                      {item.taskName}
                    </div>
                  </td>
                  <td className="py-2">
                    <div className="text-primary font-bold text-center tracking-wider">
                      {item.memberEmail}
                    </div>
                  </td>
                  <td className="py-2">
                    <div className="text-green font-bold text-center tracking-wider">
                      {item.taskHour}
                    </div>
                  </td>
                  <td className="py-2">
                    <div className="text-orange-700 font-bold text-center tracking-wider">
                      {item.taskRealHour}
                    </div>
                  </td>
                  <td className="py-2">
                    <div className="text-green font-bold text-center tracking-wider">
                      {item.taskDescription}
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
                Không có dữ liệu nào
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ReoportDetailTable;
