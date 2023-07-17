import { isEmpty, sum, sumBy } from "lodash";
import { useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { v4 as uuidv4 } from "uuid";

const PayslipTaskTable = (props) => {
  const [expand, setExpand] = useState(false);
  const [projectToExpand, setProjectToExpand] = useState("");

  const expandProject = (project) => {
    setProjectToExpand(project);
    setExpand(true);
  };

  const closeExpandProject = () => {
    setProjectToExpand("");
    setExpand(false);
  };

  return (
    <div className="border border-slate-300 rounded-lg">
      <div className="p-3 bg-green/10 text-xl font-bold">Công việc</div>
      <table className="w-full table-fixed">
        <thead>
          <tr>
            <th className="py-2 w-20 border-b border-slate-300"></th>
            <th className="py-2 text-left border-b border-slate-300">Dự án</th>
            <th className="py-2 text-center border-b border-slate-300">
              Giờ làm dự kiến
            </th>
            <th className="py-2 text-center border-b border-slate-300">
              Giờ làm thực tế
            </th>
            <th className="py-2 text-center border-b border-slate-300">
              Điểm công việc
            </th>
            <th className="py-2 text-center border-b border-slate-300">
              Điểm thưởng
            </th>
          </tr>
        </thead>
        <tbody>
          {!isEmpty(props.tasks) ? (
            props.tasks.map((task, index) => (
              <>
                <tr key={index}>
                  <td className="border-b border-slate-300 py-2">
                    <div className="flex items-center justify-center cursor-pointer text-xl">
                      {expand && projectToExpand === task.projectName ? (
                        <div
                          className="rounded-full hover:bg-green/10 p-1 text-green"
                          onClick={closeExpandProject}
                        >
                          <BiChevronUp />
                        </div>
                      ) : (
                        <div
                          className="rounded-full hover:bg-green/10 p-1 text-green"
                          onClick={() => {
                            expandProject(task.projectName);
                          }}
                        >
                          <BiChevronDown />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="border-b border-slate-300 py-2 text-primary">
                    <div className="font-bold">{task.projectName}</div>
                  </td>
                  <td className="border-b border-slate-300 py-2">
                    <div className="text-center text-green font-bold">
                      {task.totalHour}
                    </div>
                  </td>
                  <td className="border-b border-slate-300 py-2">
                    <div className="text-center text-green font-bold">
                      {task.totalRealHour}
                    </div>
                  </td>
                  <td className="border-b border-slate-300 py-2">
                    <div className="text-center text-yellow-500 font-bold">
                      {sum(
                        task.tasks.map(
                          (task) => (task.taskPoint * task.taskEffort) / 100
                        )
                      ).toLocaleString()}
                    </div>
                  </td>
                  <td className="border-b border-slate-300 py-2">
                    <div className="text-center text-yellow-500 font-bold">
                      {task.totalBonus.toLocaleString()}
                    </div>
                  </td>
                </tr>
                {expand && projectToExpand === task.projectName && (
                  <tr key={uuidv4()}>
                    <td colSpan={6}>
                      <div>
                        <div className="font-bold text-lg p-2 border-b border-slate-300">
                          Công việc
                        </div>
                        <table key={uuidv4()} className="w-full relative">
                          <thead className="text-black/70 sticky top-0 bg-white z-50">
                            <tr>
                              <th className="py-3 px-2 w-16 border-b border-slate-300">
                                Mã
                              </th>
                              <th className="py-3 text-left border-b border-slate-300">
                                Tên công việc
                              </th>
                              <th className="py-3 border-b border-slate-300">
                                Giờ làm dự kiến
                              </th>
                              <th className="py-3 border-b border-slate-300">
                                Giờ làm thực tế
                              </th>
                              <th className="py-3 w-20 border-b border-slate-300">
                                Đánh giá
                              </th>
                              <th className="py-3 w-28 border-b border-slate-300">
                                Điểm công việc
                              </th>

                              <th className="py-3 w-28 border-b border-slate-300">
                                Thưởng
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {!isEmpty(task.tasks) ? (
                              <>
                                {task.tasks.map((item) => (
                                  <tr key={uuidv4()}>
                                    <td className="py-2 border-b border-slate-300 text-center font-bold text-primary">
                                      <div>{item.taskCode}</div>
                                    </td>
                                    <td className="py-2 border-b border-slate-300 font-bold">
                                      <div>{item.taskName}</div>
                                    </td>
                                    <td className="py-2 border-b border-slate-300 text-primary font-bold text-center">
                                      <div>{item.taskHour}</div>
                                    </td>
                                    <td className="py-2 border-b border-slate-300 text-primary font-bold text-center">
                                      <div>{item.taskRealHour}</div>
                                    </td>
                                    <td className="py-2 border-b border-slate-300 font-bold text-center">
                                      <div
                                        className={`text-${
                                          item.taskEffort === 100
                                            ? "green"
                                            : item.taskEffort === 75
                                            ? "yellow-500"
                                            : item.taskEffort === 50
                                            ? "amber-600"
                                            : "red-500"
                                        }`}
                                      >
                                        {item.taskEffort === 100
                                          ? "A"
                                          : item.taskEffort === 75
                                          ? "B"
                                          : item.taskEffort === 50
                                          ? "C"
                                          : "D"}
                                      </div>
                                    </td>
                                    <td className="py-2 border-b border-slate-300 text-yellow-500 font-bold text-center">
                                      <div>{item.taskPoint}</div>
                                    </td>

                                    <td className="py-2 border-b border-slate-300 text-yellow-500 font-bold text-center">
                                      <div>{item.taskBonus}</div>
                                    </td>
                                  </tr>
                                ))}
                                <tr>
                                  <td
                                    className="p-3 border-b border-slate-300"
                                    colSpan={5}
                                  >
                                    <div className="font-bold">
                                      Tổng dự kiến:
                                    </div>
                                  </td>
                                  <td className="py-3 border-b border-slate-300">
                                    <div className="font-bold text-center text-yellow-500">
                                      {sumBy(
                                        task.tasks,
                                        "taskPoint"
                                      ).toLocaleString()}
                                    </div>
                                  </td>
                                  <td className="py-3 border-b border-slate-300">
                                    <div className="font-bold text-center text-yellow-500">
                                      {sumBy(
                                        task.tasks,
                                        "taskBonus"
                                      ).toLocaleString()}
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    className="p-3 border-b border-slate-300"
                                    colSpan={5}
                                  >
                                    <div className="font-bold">
                                      Tổng sau đánh giá:
                                    </div>
                                  </td>
                                  <td className="py-3 border-b border-slate-300">
                                    <div className="font-bold text-center text-yellow-500">
                                      {sum(
                                        task.tasks.map(
                                          (task) =>
                                            (task.taskPoint * task.taskEffort) /
                                            100
                                        )
                                      ).toLocaleString()}
                                    </div>
                                  </td>
                                  <td className="py-3 border-b border-slate-300">
                                    <div className="font-bold text-center text-yellow-500">
                                      {sumBy(
                                        task.tasks,
                                        "taskBonus"
                                      ).toLocaleString()}
                                    </div>
                                  </td>
                                </tr>
                              </>
                            ) : (
                              <tr>
                                <td colSpan={6}>
                                  <div className="text-center py-3 font-bold text-black/70">
                                    Không có dữ liệu nào
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))
          ) : (
            <tr>
              <td className="py-3" colSpan={6}>
                <div className="text-center font-bold">
                  Không có công việc nào
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PayslipTaskTable;
