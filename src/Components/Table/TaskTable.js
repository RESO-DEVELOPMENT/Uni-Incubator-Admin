import { find, isEmpty, isNil } from "lodash";
import Loading from "../Loading/Loading";
import TextInputSimple from "../Input/TextInputSimple";
import NumberInput from "../Input/NumberInput";
import { BiErrorCircle } from "react-icons/bi";
import { AiOutlineMinusCircle } from "react-icons/ai";
import { useState } from "react";
import SelectSimple from "../../Components/Select/SelectSimple";

const TaskTable = (props) => {
  const [efforts] = useState([
    {
      label: "A",
      value: 100,
    },
    { label: "B", value: 75 },
    { label: "C", value: 50 },
    { label: "D", value: 25 },
  ]);

  return (
    <div>
      <div className="border border-slate-200">
        <div className=" py-3 px-5 bg-green/10 flex items-center justify-between">
          <div
            className={`${
              props.error?.[props.tasks?.[0]?.mainIndex]?.memberEmail
                ? "text-red-500 flex items-center gap-2"
                : "text-primary"
            } font-bold text-lg`}
          >
            <div>{props.tasks?.[0]?.memberEmail}</div>
            {props.error?.[props.tasks?.[0]?.mainIndex]?.memberEmail && (
              <div className="flex gap-2 items-center">
                <div className="text-red-500 flex justify-center items-center text-xl">
                  <BiErrorCircle />
                </div>
                <div>
                  {props.error[props.tasks[0].mainIndex].memberEmail} -{" "}
                  {props.tasks[0].mainIndex + 8}
                </div>
              </div>
            )}
          </div>
        </div>
        <table
          className={`w-full select-none relative ${
            props.edit ? "table-auto" : "table-fixed"
          }`}
        >
          <thead className="text-black/70 sticky top-0 bg-white z-50">
            <tr>
              <th className="py-3 w-30 px-2 border border-slate-300">Mã</th>
              <th className="py-3 border border-slate-300">Tên công việc</th>
              <th className="py-3 border border-slate-300">Điểm công việc</th>
              <th className="py-3 border border-slate-300">Giờ làm dự kiến</th>
              <th className="py-3 border border-slate-300">Giờ làm thực tế</th>
              <th className="py-3 w-32 border border-slate-300">Hiệu suất</th>
              <th className="py-3 border border-slate-300">Thưởng</th>
              {props.edit && (
                <th className="py-3 px-2 w-fit border border-slate-300">Xóa</th>
              )}
            </tr>
          </thead>
          <tbody className="relative">
            {!isEmpty(props.tasks) ? (
              <>
                {props.tasks.map((item) => {
                  return (
                    <tr key={item.mainIndex}>
                      <td className="p-2 border border-slate-300">
                        <div className="text-black/70 text-center font-bold tracking-wider">
                          {props.edit ? (
                            <TextInputSimple
                              name="taskCode"
                              value={item.taskCode}
                              onChange={(e) =>
                                props.onChange(e, item.mainIndex)
                              }
                              error={props.error?.[item.mainIndex]?.taskCode}
                            />
                          ) : (
                            <>
                              {props.error?.[item.mainIndex]?.taskCode ? (
                                <div className="text-red-500 flex justify-center items-center text-xl">
                                  <BiErrorCircle />
                                </div>
                              ) : (
                                item.taskCode
                              )}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="p-2 border border-slate-300">
                        <div className="text-black/70 font-bold tracking-wider">
                          {props.edit ? (
                            <TextInputSimple
                              name="taskName"
                              value={item.taskName}
                              onChange={(e) =>
                                props.onChange(e, item.mainIndex)
                              }
                              error={props.error?.[item.mainIndex]?.taskName}
                            />
                          ) : (
                            <>
                              {props.error?.[item.mainIndex]?.taskName ? (
                                <div className="text-red-500 flex justify-center items-center text-xl">
                                  <BiErrorCircle />
                                </div>
                              ) : (
                                item.taskName
                              )}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="p-2 border border-slate-300">
                        <div className="text-green font-bold text-center tracking-wider">
                          {props.edit ? (
                            <NumberInput
                              inputTextColor="text-green"
                              name="taskPoint"
                              value={item.taskPoint}
                              onChange={(e) =>
                                props.onChange(e, item.mainIndex)
                              }
                              increaseButton={true}
                              increaseStep={() =>
                                props.increasePoint("taskPoint", item.mainIndex)
                              }
                              error={props.error?.[item.mainIndex]?.taskPoint}
                            />
                          ) : (
                            <>
                              {props.error?.[item.mainIndex]?.taskPoint ? (
                                <div className="text-red-500">
                                  {!isNil(item.taskPoint) &&
                                    item.taskPoint.toLocaleString()}
                                </div>
                              ) : (
                                !isNil(item.taskPoint) &&
                                item.taskPoint.toLocaleString()
                              )}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="p-2 border border-slate-300">
                        <div className="text-primary font-bold text-center tracking-wider">
                          {props.edit ? (
                            <NumberInput
                              name="taskHour"
                              value={item.taskHour}
                              onChange={(e) =>
                                props.onChange(e, item.mainIndex)
                              }
                              increaseButton={true}
                              increaseStep={() =>
                                props.increaseHour("taskHour", item.mainIndex)
                              }
                              error={props.error?.[item.mainIndex]?.taskHour}
                            />
                          ) : (
                            <>
                              {props.error?.[item.mainIndex]?.taskHour ? (
                                <div className="text-red-500">
                                  {item.taskHour}
                                </div>
                              ) : (
                                item.taskHour
                              )}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="p-2 border border-slate-300">
                        <div className="text-primary font-bold text-center tracking-wider">
                          {props.edit ? (
                            <NumberInput
                              name="taskRealHour"
                              value={item.taskRealHour}
                              onChange={(e) =>
                                props.onChange(e, item.mainIndex)
                              }
                              increaseButton={true}
                              increaseStep={() =>
                                props.increaseHour(
                                  "taskRealHour",
                                  item.mainIndex
                                )
                              }
                              error={
                                props.error?.[item.mainIndex]?.taskRealHour
                              }
                            />
                          ) : (
                            <>
                              {props.error?.[item.mainIndex]?.taskRealHour ? (
                                <div className="text-red-500">
                                  {item.taskRealHour}
                                </div>
                              ) : (
                                item.taskRealHour
                              )}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="p-2 border border-slate-300">
                        <div
                          className={`text-primary font-bold text-center tracking-wider`}
                        >
                          {props.edit ? (
                            <>
                              <SelectSimple
                                options={efforts}
                                defaultValue={find(efforts, {
                                  value: item.taskEffort,
                                })}
                                onChange={(e) =>
                                  props.getTaskEffort(e.value, item.mainIndex)
                                }
                              />
                            </>
                          ) : (
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
                          )}
                        </div>
                      </td>
                      <td className="p-2 border border-slate-300">
                        <div className="text-green font-bold text-center tracking-wider">
                          {props.edit ? (
                            <>
                              <NumberInput
                                inputTextColor="text-green"
                                name="taskBonus"
                                value={item.taskBonus}
                                onChange={(e) =>
                                  props.onChange(e, item.mainIndex)
                                }
                                increaseButton={true}
                                increaseStep={() =>
                                  props.increasePoint(
                                    "taskBonus",
                                    item.mainIndex
                                  )
                                }
                                error={props.error?.[item.mainIndex]?.taskBonus}
                              />
                            </>
                          ) : (
                            <>
                              {props.error?.[item.mainIndex]?.taskBonus ? (
                                <div className="text-red-500">
                                  {!isNil(item.taskBonus) &&
                                    item.taskBonus.toLocaleString()}
                                </div>
                              ) : (
                                !isNil(item.taskBonus) &&
                                item.taskBonus.toLocaleString()
                              )}
                            </>
                          )}
                        </div>
                      </td>
                      {props.edit && (
                        <td className="p-2 border border-slate-300">
                          <div
                            className="text-red-500 cursor-pointer flex justify-center"
                            onClick={() => props.removeRow(item.mainIndex)}
                          >
                            <div className="rounded-full hover:bg-red-500/10 text-lg">
                              <AiOutlineMinusCircle />
                            </div>
                          </div>
                        </td>
                      )}
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
    </div>
  );
};

export default TaskTable;
