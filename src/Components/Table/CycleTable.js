import { isEmpty } from "lodash";
import Loading from "../Loading/Loading";
import Paginate from "../Paginate/Paginate";
import { useNavigate } from "react-router-dom";
import { toDate } from "../../Ultilities/Date";
import { textToColor, toVN } from "../../Ultilities/String";
import { AiFillEdit } from "react-icons/ai";

const CycleTable = (props) => {
  const navigate = useNavigate();
  const getPage = (page) => {
    props.getPage(page);
  };
  return (
    <div>
      <table className="w-full border border-slate-200">
        <thead className="bg-green/10 py-2 text-black/70">
          <tr>
            <th className="py-3 w-1/6">Chu kỳ</th>
            <th className="py-3 w-1/6">Ngày tạo</th>
            <th className="py-3 w-1/6">Ngày bắt đầu</th>
            <th className="py-3 w-1/6">Ngày kết thúc</th>
            <th className="py-3 w-1/6">Trạng thái</th>
            <th className="py-3 w-1/6">Chỉnh sửa</th>
          </tr>
        </thead>
        <tbody className="relative">
          {!props.loading ? (
            <>
              {!isEmpty(props.cycles) ? (
                props.cycles.map((cycle) => {
                  return (
                    <tr key={cycle.salaryCycleId}>
                      <td className="py-2">
                        <div className="text-center font-bold text-black/70 text-sm">
                          {cycle.name ? cycle.name : "N/A"}
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="text-center text-primary text-sm font-bold tracking-wider">
                          {toDate(cycle.createdAt)}
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="text-center text-primary text-sm font-bold tracking-wider">
                          {toDate(cycle.startedAt)}
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="text-center text-primary text-sm font-bold tracking-wider">
                          {toDate(cycle.endedAt)}
                        </div>
                      </td>
                      <td className="py-2">
                        <div
                          className="text-center text-sm"
                          style={{ color: textToColor(cycle.status) }}
                        >
                          {toVN(cycle.status)}
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="flex justify-center items-center">
                          <div
                            className="p-2 rounded-full hover:bg-green/10 text-green flex items-center justify-center cursor-pointer"
                            onClick={() =>
                              navigate(`/cycles/${cycle.salaryCycleId}`)
                            }
                          >
                            <AiFillEdit />
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
                      Không có kỳ lương nào
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
      {!isEmpty(props.cycles) && (
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

export default CycleTable;
