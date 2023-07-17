import { useEffect, useState } from "react";
import { toDate } from "../../../Ultilities/Date";
import { useNavigate } from "react-router-dom";
import _, { isEmpty, last, split, sumBy } from "lodash";
import {
  FixText,
  textToColor,
  textToVNEquation,
  toVN,
} from "../../../Ultilities/String";
import ToastError from "../../../Components/Alert/ToastError";
import salaryApi from "../../../API/Salary/salaryApi";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import memberApi from "../../../API/Member/memberApi";
import { useSelector } from "react-redux";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { TbReport } from "react-icons/tb";
import PayslipTaskTable from "../../../Components/Table/PayslipTaskTable";
import systemApi from "../../../API/Statistic/systemApi";

const PayslipDetail = (props) => {
  const currentMember = useSelector((state) => state.auth.member);
  const navigate = useNavigate();

  const [cycle, setCycle] = useState({});

  const [tab, setTab] = useState(1);

  const [tasks, setTasks] = useState([]);
  const [p2Data, setP2Data] = useState([]);
  const [p3Data, setP3Data] = useState([]);
  const [bonusData, setBonusData] = useState([]);

  const [expandP1, setExpandP1] = useState(false);
  const [expandP2, setExpandP2] = useState(false);
  const [expandP3, setExpandP3] = useState(false);
  const [expandBonus, setExpandBonus] = useState(false);

  const [showFullCode, setShowFullCode] = useState(false);

  const [equation, setEquation] = useState({});

  const nonActiveClassname =
    "text-black/70 p-3 cursor-pointer hover:border-b-2 hover:border-green hover:text-green";
  const activeClassname =
    "text-green p-3 cursor-pointer border-b-2 border-green";

  useEffect(() => {
    const getEquation = async () => {
      try {
        const response = await systemApi.getConfig();
        if (response.success) {
          setEquation(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
    };

    getEquation();
  }, []);

  useEffect(() => {
    const getP2Data = () => {
      const data = props.payslip.items;
      const itemsP2ByProject = _(data)
        .filter({ type: "p2" })
        .groupBy("project.projectName")
        .map((value, key) => ({
          attributes: value[0].attributes,
          projectName: key,
          totalPoint: sumBy(value, "amount"),
        }))
        .value();
      setP2Data(itemsP2ByProject);
    };

    const getP3Data = () => {
      const data = props.payslip.items;
      const itemsP2ByProject = _(data)
        .filter({ type: "p3" })
        .groupBy("project.projectName")
        .map((value, key) => ({
          projectName: key,
          totalPoint: sumBy(value, "amount"),
        }))
        .value();
      setP3Data(itemsP2ByProject);
    };

    const getBonusData = () => {
      const data = props.payslip.items;
      const itemsBonusByProject = _(data)
        .filter({ type: "bonus" })
        .groupBy("project.projectName")
        .map((value, key) => ({
          projectName: key,
          totalPoint: sumBy(value, "amount"),
        }))
        .value();
      setBonusData(itemsBonusByProject);
    };

    getP2Data();
    getP3Data();
    getBonusData();
  }, [props.payslip.items]);

  useEffect(() => {
    const getCycle = async () => {
      try {
        const response = await salaryApi.getById(
          last(split(FixText(props.payslip.note), " "))
        );
        if (response.success) {
          setCycle(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
    };

    const getTasks = async () => {
      try {
        if (currentMember.memberId === props.payslip.member.memberId) {
          const response = await memberApi.getSelfTasks({
            SalaryCycleId: last(split(FixText(props.payslip.note), " ")),
          });
          if (response.success) {
            const data = response.data.message;
            if (!isEmpty(data)) {
              const newTasks = _(data)
                .groupBy("project.projectName")
                .map((value) => ({
                  projectName: `${value[0].project.projectName} - [${value[0].project.projectShortName}]`,
                  totalPoint: sumBy(value, "taskPoint"),
                  totalBonus: sumBy(value, "taskBonus"),
                  totalRealHour: sumBy(value, "taskRealHour"),
                  totalHour: sumBy(value, "taskHour"),
                  tasks: value,
                }))
                .value();
              setTasks(newTasks);
            }
          }
        } else if (currentMember.role === "ADMIN") {
          const response = await memberApi.getMemberTasks(
            props.payslip.member.memberId,
            {
              SalaryCycleId: last(split(FixText(props.payslip.note), " ")),
            }
          );
          if (response.success) {
            const data = response.data.message;
            if (!isEmpty(data)) {
              const newTasks = _(data)
                .groupBy("project.projectName")
                .map((value) => ({
                  projectName: `${value[0].project.projectName} - [${value[0].project.projectShortName}]`,
                  totalPoint: sumBy(value, "taskPoint"),
                  totalBonus: sumBy(value, "taskBonus"),
                  totalRealHour: sumBy(value, "taskRealHour"),
                  totalHour: sumBy(value, "taskHour"),
                  tasks: value,
                }))
                .value();
              setTasks(newTasks);
            }
          }
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
    };

    if (isEmpty(props.payslip)) {
      props.admin
        ? navigate(props.adminNavigate)
        : navigate("/profile/payslips");
    } else {
      getCycle();
      getTasks();
    }
  }, [
    navigate,
    props.payslip,
    props.admin,
    props.adminNavigate,
    currentMember,
  ]);

  return (
    <div className="rounded-lg border border-slate-300 overflow-hidden">
      {!isEmpty(props.payslip) && (
        <>
          <div className="bg-green/10 py-3 px-5 flex justify-between items-center">
            <div className="font-bold text-lg">Phiếu lương</div>
            <div
              className={`${
                showFullCode ? "w-fit" : "w-12 truncate"
              } text-black/60 text-sm cursor-pointer hover:underline`}
              onClick={() => setShowFullCode(!showFullCode)}
            >
              {props.payslip.payslipId}
            </div>
          </div>
          <div className="p-5">
            <div className="font-bold mb-3">Thông tin chi tiết phiếu lương</div>
            <div className="grid grid-cols-2 mb-5">
              <div>
                <div>
                  <div className="text-black/60 text-sm font-bold mb-2">
                    Ngày tạo: {toDate(props.payslip.createdAt)}
                  </div>
                  <div className="mb-2 text-black/70 text-sm">
                    Kỳ lương: {cycle.name}
                  </div>
                  <div className="mb-2 text-black/70 text-sm">
                    Ngày bắt đầu:{" "}
                    <span className="font-bold">{toDate(cycle.startedAt)}</span>
                  </div>
                  <div className="mb-2 text-black/70 text-sm">
                    Ngày kết thúc:{" "}
                    <span className="font-bold">{toDate(cycle.endedAt)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm mb-2">
                  {props.payslip.member.fullName}
                </div>
                <div className="text-black/60 text-sm mb-2">
                  {props.payslip.member.emailAddress}
                </div>
                {props.payslip.note && (
                  <div className="text-black/60 text-sm mb-2">
                    Chú thích:{" "}
                    {!isEmpty(cycle) && (
                      <span>Phiếu lương cho {cycle.name}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="px-5 bg-green/10 flex gap-5 mb-5">
              <div
                className={`flex items-center gap-2 ${
                  tab === 1 ? activeClassname : nonActiveClassname
                }`}
                onClick={() => setTab(1)}
              >
                <div>
                  <TbReport />
                </div>
                <div>Phiếu lương</div>
              </div>
              <div
                className={`flex items-center gap-2 ${
                  tab === 2 ? activeClassname : nonActiveClassname
                }`}
                onClick={() => setTab(2)}
              >
                <div>
                  <AiOutlineUnorderedList />
                </div>
                <div>Công việc</div>
              </div>
            </div>
            {tab === 1 ? (
              <div className="flex flex-col items-center">
                <div className="rounded-lg border border-slate-300 w-3/4 font-bold mb-5">
                  <div className="grid grid-cols-2 font-bold border-b border-slate-300">
                    <div className="py-3 text-center border-r border-slate-300">
                      Lương từng thành phần
                    </div>
                    <div className="py-3 text-center">Tổng</div>
                  </div>
                  <div className="px-3">
                    <div className="">
                      <div className="grid grid-cols-2">
                        <div
                          className="flex items-center gap-1 cursor-pointer border-r border-slate-300 py-2"
                          onClick={() => setExpandP1(!expandP1)}
                        >
                          <div className="select-none">P1 - Vị trí (level)</div>
                          {!expandP1 ? (
                            <div
                              className="text-lg text-green"
                              onClick={() => setExpandP1(false)}
                            >
                              <BiChevronDown />
                            </div>
                          ) : (
                            <div
                              className="text-lg text-green"
                              onClick={() => setExpandP1(true)}
                            >
                              <BiChevronUp />
                            </div>
                          )}
                        </div>
                        <div className="tracking-wider text-center text-yellow-500 py-2">
                          {props.payslip.totalP1.toLocaleString()}
                        </div>
                      </div>
                      {expandP1 && (
                        <>
                          <div className="grid grid-cols-2">
                            <div className="text-sm text-primary px-5 border-b border-r border-slate-300 py-2">
                              Lương cơ bản:
                            </div>
                            <div className="text-center text-yellow-500 border-b border-slate-300 py-2">
                              {props.payslip.attributes.BASE_POINT}
                            </div>
                          </div>
                          <div className="grid grid-cols-2">
                            <div className="text-sm text-primary px-5 border-b border-r border-slate-300 py-2">
                              Lương theo giờ:
                            </div>
                            <div className="text-center text-yellow-500 border-b border-slate-300 py-2">
                              {props.payslip.attributes.POINT_PER_HOURS}
                            </div>
                          </div>
                          {!isEmpty(tasks) && (
                            <>
                              <div className="grid grid-cols-2">
                                <div className="text-sm px-5 border-b border-r border-slate-300 py-2">
                                  Dự án
                                </div>
                                <div className="text-center border-b border-slate-300 py-2">
                                  Tổng giờ làm thực tế
                                </div>
                              </div>
                              {tasks.map((task, index) => {
                                return (
                                  <div key={index} className="grid grid-cols-2">
                                    <div className="text-sm text-primary px-5 border-b border-r border-slate-300 py-2">
                                      {index + 1}. {task.projectName}
                                    </div>
                                    <div className="text-center text-green border-b border-slate-300 py-2">
                                      {task.totalRealHour}
                                    </div>
                                  </div>
                                );
                              })}
                            </>
                          )}
                        </>
                      )}
                    </div>

                    <div className="">
                      <div className="grid grid-cols-2">
                        <div
                          className="flex items-center gap-1 cursor-pointer border-r border-slate-300 py-2"
                          onClick={() => setExpandP2(!expandP2)}
                        >
                          <div className="select-none">P2 - Năng lực</div>
                          {props.payslip.totalP2 > 0 ? (
                            !expandP2 ? (
                              <div
                                className="text-lg text-green"
                                onClick={() => setExpandP2(false)}
                              >
                                <BiChevronDown />
                              </div>
                            ) : (
                              <div
                                className="text-lg text-green"
                                onClick={() => setExpandP2(true)}
                              >
                                <BiChevronUp />
                              </div>
                            )
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="tracking-wider text-center text-yellow-500 py-2">
                          {props.payslip.totalP2.toLocaleString()}
                        </div>
                      </div>
                      {expandP2 && (
                        <div>
                          {p2Data?.map((item, index) => (
                            <div
                              key={item.totalPoint + index}
                              className="grid grid-cols-2 text-primary text-sm"
                            >
                              <div className="px-5 border-b border-r border-slate-300 py-2">
                                <div>
                                  {index + 1}. {item.projectName}
                                </div>
                                <div className="text-xs text-purple mt-1">
                                  * Kỹ năng chuyên môn:{" "}
                                  {item.attributes.HARD_SKILL}
                                </div>
                                <div className="text-xs text-purple mt-1">
                                  * Kỹ năng mềm: {item.attributes.SOFT_SKILL}
                                </div>
                              </div>
                              <div className="text-center text-yellow-500 border-b border-slate-300 py-2">
                                <div>{item.totalPoint.toLocaleString()}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="">
                      <div className="grid grid-cols-2">
                        <div
                          className="flex items-center gap-1 cursor-pointer border-r border-slate-300 py-2"
                          onClick={() => setExpandP3(!expandP3)}
                        >
                          <div className="select-none">P3 - Đóng góp</div>
                          {props.payslip.totalP3 > 0 ? (
                            !expandP3 ? (
                              <div
                                className="text-lg text-green"
                                onClick={() => setExpandP3(false)}
                              >
                                <BiChevronDown />
                              </div>
                            ) : (
                              <div
                                className="text-lg text-green"
                                onClick={() => setExpandP3(true)}
                              >
                                <BiChevronUp />
                              </div>
                            )
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="tracking-wider text-center text-yellow-500 py-2">
                          {props.payslip.totalP3.toLocaleString()}
                        </div>
                      </div>
                      {expandP3 && (
                        <div>
                          {p3Data?.map((item, index) => (
                            <div
                              key={item.totalPoint}
                              className="grid grid-cols-2 text-primary mb-1 text-sm"
                            >
                              <div className="px-5 border-b border-r border-slate-300 py-2">
                                {index + 1}. {item.projectName}
                              </div>
                              <div className="text-center text-yellow-500 border-b  border-slate-300 py-2">
                                <div>{item.totalPoint.toLocaleString()}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="grid grid-cols-2">
                        <div
                          className="flex items-center gap-1 cursor-pointer border-r border-slate-300 py-2"
                          onClick={() => setExpandBonus(!expandBonus)}
                        >
                          <div className="select-none">Bonus - Thưởng</div>
                          {props.payslip.totalBonus > 0 ? (
                            !expandBonus ? (
                              <div
                                className="text-lg text-green"
                                onClick={() => setExpandBonus(false)}
                              >
                                <BiChevronDown />
                              </div>
                            ) : (
                              <div
                                className="text-lg text-green"
                                onClick={() => setExpandBonus(true)}
                              >
                                <BiChevronUp />
                              </div>
                            )
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="tracking-wider text-center text-yellow-500 py-2">
                          {props.payslip.totalBonus.toLocaleString()}
                        </div>
                      </div>
                      {expandBonus && (
                        <div>
                          {bonusData?.map((item, index) => (
                            <div
                              key={item.totalPoint}
                              className="grid grid-cols-2 text-primary mb-1 text-sm"
                            >
                              <div className="px-5 border-b border-r border-slate-300 py-2">
                                {index + 1}. {item.projectName}
                              </div>
                              <div className="text-center text-yellow-500 border-b  border-slate-300 py-2">
                                <div>{item.totalPoint.toLocaleString()}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 w-3/4">
                  {!isEmpty(equation) && (
                    <div className="italic text-primary ">
                      <div>
                        <span className="font-bold">*P1:</span>{" "}
                        {textToVNEquation(equation.p1Equation)}
                      </div>
                      <div>
                        <span className="font-bold">*P2:</span>{" "}
                        {textToVNEquation(equation.p2Equation)}
                      </div>
                      <div>
                        <span className="font-bold">*P3:</span> (
                        {textToVNEquation(equation.p3Equation)}) + Point sau
                        đánh giá
                      </div>
                      <div>
                        <span className="font-bold">*XP:</span>{" "}
                        {textToVNEquation(equation.xpEquation)}
                      </div>
                    </div>
                  )}
                  <div className="font-bold">
                    <div className="flex text-right justify-end gap-5 mb-3">
                      <div>
                        <div>Tổng point:</div>
                        <div className="mb-2">Tổng XP:</div>
                      </div>
                      <div>
                        <div className="text-yellow-500">
                          {(
                            props.payslip.totalP1 +
                            props.payslip.totalP2 +
                            props.payslip.totalP3 +
                            props.payslip.totalBonus
                          ).toLocaleString()}
                        </div>
                        <div className="mb-2 text-per-75">
                          {props.payslip.totalXP.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex text-right flex-col items-end">
                      <div className="h-px w-32 bg-black mb-2" />
                      <div className="flex gap-2">
                        <div>Trạng thái:</div>
                        <div
                          style={{ color: textToColor(props.payslip.status) }}
                        >
                          {toVN(props.payslip.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              tab === 2 && (
                <PayslipTaskTable
                  tasks={tasks}
                  totalP3={props.payslip.totalP3}
                />
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PayslipDetail;
