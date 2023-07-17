import { toDate } from "../../Ultilities/Date";
import Loading from "../Loading/Loading";
import { isEmpty } from "lodash";
import Paginate from "../Paginate/Paginate";
import { textToColorReport, toVN, toVNReport } from "../../Ultilities/String";
import { BsArrowRight } from "react-icons/bs";

const endRequestsTable = (props) => {
  const getPage = (page) => {
    props.getPage(page);
  };
  return (
    <div>
      <table className="w-full border border-slate-200">
        <thead className="bg-green/10 py-2 text-black/70">
          <tr>
            <th className="py-3">Ghi chú</th>
            <th className="py-3">Dùng point</th>
            <th className="py-3">Ngày tạo</th>
            <th className="py-3">Ngày duyệt</th>
            <th className="py-3">Trạng thái</th>
            <th className="py-3 w-1/6">Chi tiết</th>
          </tr>
        </thead>
        <tbody className="relative">
          {!isEmpty(props.endRequests) ? (
            <>
              {props.endRequests.map((item) => {
                return (
                  <tr key={item.requestId}>
                    <td className="py-2">
                      <div className="grid">
                        <div className="text-center text-primary text-sm truncate">
                          {item.note ? item.note : "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="py-2">
                      <div className="text-center text-primary font-bold text-sm">
                        {toVN(item.pointAction)}
                      </div>
                    </td>
                    <td className="py-2">
                      <div className="text-center text-primary font-bold text-sm">
                        {toDate(item.createdAt)}
                      </div>
                    </td>
                    <td className="py-2">
                      <div className="text-center text-primary font-bold text-sm">
                        {toDate(item.reviewedAt)}
                      </div>
                    </td>
                    <td className="py-2">
                      <div
                        className={`text-${textToColorReport(
                          item.status
                        )} text-center font-bold text-sm`}
                      >
                        {toVNReport(item.status)}
                      </div>
                    </td>
                    <td className="py-2">
                      <div className="flex justify-center items-center">
                        <div
                          className="p-2 rounded-full hover:bg-green/10 text-green flex items-center justify-center cursor-pointer"
                          onClick={() => props.goToRequestDetail(item)}
                        >
                          <BsArrowRight />
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
                  Không có yêu cầu nào
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {!isEmpty(props.endRequests) && (
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

export default endRequestsTable;
