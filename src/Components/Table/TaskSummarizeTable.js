import Loading from "../Loading/Loading";
import { isEmpty } from "lodash";
import { GiTwoCoins } from "react-icons/gi";
import { AiFillClockCircle } from "react-icons/ai";
import { BsArrowRight } from "react-icons/bs";
// import { IoMdAdd } from "react-icons/io";

const TaskSummarizeTable = (props) => {
  return (
    <div>
      <div className="border border-slate-200">
        <div className=" py-3 px-5 bg-green/10 flex items-center justify-between">
          <div className="font-bold text-lg">Thông tin các thành viên</div>
          {/* <div className="flex items-center gap-2 cursor-pointer hover:underline text-green">
            <div>Thêm thông tin</div>
            <div className="p-1 rounded-md cursor-pointer bg-green/20 hover:shadow-md">
              <IoMdAdd />
            </div>
          </div> */}
        </div>
        <table className="w-full">
          <thead className="text-black/70">
            <tr>
              <th className="py-3 w-1/6 border-b border-slate-200">
                Thành viên
              </th>
              <th className="py-3 border-b border-slate-200">Tổng công việc</th>
              <th className="py-3 border-b border-slate-200">
                Giờ làm ước tính
              </th>
              <th className="py-3 border-b border-slate-200">
                Giờ làm thực tế
              </th>
              <th className="py-3 border-b border-slate-200">Tổng point</th>
              <th className="py-3 border-b border-slate-200">Tổng thưởng</th>
              <th className="py-3 border-b border-slate-200">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {!props.loading ? (
              <>
                {!isEmpty(props.tasks) ? (
                  props.tasks.map((task) => {
                    return (
                      <tr key={task.member}>
                        <td className="py-3 border-b border-slate-200">
                          <div
                            className={`${
                              !isEmpty(task.error?.memberEmail)
                                ? "text-red-500"
                                : "text-primary"
                            } font-bold px-2`}
                          >
                            {task.member}
                          </div>
                        </td>
                        <td className="py-3 border-b border-slate-200">
                          <div
                            className={`${
                              !isEmpty(task.error?.taskName)
                                ? "text-red-500"
                                : "text-primary"
                            } text-center font-bold`}
                          >
                            {task.task.totalTask.toLocaleString()}
                          </div>
                        </td>
                        <td className="py-3 border-b border-slate-200">
                          <div
                            className={`${
                              !isEmpty(task.error?.taskHour)
                                ? "text-red-500"
                                : "text-purple"
                            } flex gap-2 items-center justify-center font-bold`}
                          >
                            {task.task.totalTaskHour.toLocaleString()}
                            <div>
                              <AiFillClockCircle />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 border-b border-slate-200">
                          <div
                            className={`${
                              !isEmpty(task.error?.taskRealHour)
                                ? "text-red-500"
                                : "text-purple"
                            } flex gap-2 items-center justify-center font-bold`}
                          >
                            <div>
                              {task.task.totalTaskRealHour.toLocaleString()}
                            </div>
                            <div>
                              <AiFillClockCircle />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 border-b border-slate-200">
                          <div
                            className={` ${
                              !isEmpty(task.error?.taskPoint)
                                ? "text-red-500"
                                : "text-yellow-500"
                            } justify-center font-bold flex items-center gap-2`}
                          >
                            <div>
                              {task.task.totalTaskPoint.toLocaleString()}
                            </div>
                            <div>
                              <GiTwoCoins />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 border-b border-slate-200">
                          <div
                            className={` ${
                              !isEmpty(task.error?.taskBonus)
                                ? "text-red-500"
                                : "text-green"
                            } justify-center font-bold flex items-center gap-2`}
                          >
                            <div>
                              {task.task.totalBonusPoint.toLocaleString()}
                            </div>
                            <div>
                              <GiTwoCoins />
                            </div>
                          </div>
                        </td>
                        <td className="py-2 border-b border-slate-200">
                          <div className="flex justify-center items-center">
                            <div
                              className="p-2 rounded-full hover:bg-green/10 text-green flex items-center justify-center cursor-pointer"
                              onClick={() => props.goToMemberTask(task.member)}
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
                    <td colSpan={6}>
                      <div className="text-center py-3 font-bold text-black/70">
                        Không có dữ liệu nào
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ) : (
              <tr>
                <td colSpan={6}>
                  <Loading />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskSummarizeTable;
