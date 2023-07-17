import { toDate } from "../../Ultilities/Date";
import { BsArrowRight } from "react-icons/bs";
import Loading from "../Loading/Loading";
import { isEmpty } from "lodash";
import Paginate from "../Paginate/Paginate";

const MileStonesTable = (props) => {
  const getPage = (page) => {
    props.getPage(page);
  };
  
  return (
    <div>
      <table className="w-full border border-slate-200">
        <thead className="bg-green/10 py-2 text-black/70">
          <tr>
            <th className="py-3 w-1/6">Hạng mục</th>
            <th className="py-3 w-1/6">Thời gian tạo</th>
            <th className="py-3 w-3/6">Mô tả</th>
            <th className="py-3 w-1/6">Chi tiết</th>
          </tr>
        </thead>
        <tbody className="relative">
          {!isEmpty(props.mileStones) ? (
            <>
              {props.mileStones.map((item) => {
                return (
                  <tr key={item.projectMilestoneId}>
                    <td className="py-2 w-1/6">
                      <div className="text-center font-bold text-black/70 text-sm">
                        {item.title}
                      </div>
                    </td>
                    <td className="py-2 w-1/6">
                      <div className="text-center text-primary font-bold text-sm">
                        {toDate(item.createdAt)}
                      </div>
                    </td>
                    <td className="py-2 w-3/6">
                      <div className="grid">
                        <div className="text-center text-primary text-sm truncate">
                          {item.content}
                        </div>
                      </div>
                    </td>
                    <td className="py-2 w-1/6">
                      <div className="flex justify-center items-center">
                        <div
                          className="p-2 rounded-full hover:bg-green/10 text-green flex items-center justify-center cursor-pointer"
                          onClick={() => props.toMileStone(item)}
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
                  Không có hạng mục nào
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {!isEmpty(props.mileStones) && (
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

export default MileStonesTable;
