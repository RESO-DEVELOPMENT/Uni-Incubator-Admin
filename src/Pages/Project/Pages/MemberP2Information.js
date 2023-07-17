import { useEffect, useState } from "react";
import memberApi from "../../../API/Member/memberApi";
import ToastError from "../../../Components/Alert/ToastError";
import { HiNewspaper } from "react-icons/hi";
import { BsFacebook, BsFillBriefcaseFill } from "react-icons/bs";
import { TbReport } from "react-icons/tb";
import Loading from "../../../Components/Loading/Loading";
import TextInputSimple from "../../../Components/Input/TextInputSimple";
import { FaUserAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { AiFillCalendar, AiFillClockCircle, AiFillPhone } from "react-icons/ai";
import { isEmpty } from "lodash";
import { useNavigate } from "react-router-dom";
import { toDate } from "../../../Ultilities/Date";
import Button from "../../../Components/Button/Button";
import ButtonCancel from "../../../Components/Button/ButtonCancel";
import { BiTimer } from "react-icons/bi";
import { GiTwoCoins } from "react-icons/gi";
import { GoDatabase } from "react-icons/go";
import { SiGumtree } from "react-icons/si";
import projectApi from "../../../API/Project/projectApi";
import NumberInput from "../../../Components/Input/NumberInput";
import ToastSuccess from "../../../Components/Alert/ToastSuccess";
import salaryApi from "../../../API/Salary/salaryApi";

const MemberP2Information = (props) => {
  const [page, setPage] = useState(3);
  const [loading, setLoading] = useState(false);
  const [projectLoading, setProjectLoading] = useState(false);

  const [allowEdit, setAllowEdit] = useState(false);

  const [memberP2Value, setMemberP2Value] = useState({
    projectMemberId: "",
    graduated: true,
    yearOfExp: 10,
    haveEnghlishCert: true,
    leadershipSkill: 10,
    creativitySkill: 10,
    problemSolvingSkill: 10,
    positiveAttitude: 10,
    teamworkSkill: 10,
    commnicationSkill: 10,
  });

  const [memberProjects, setMemberProjects] = useState([]);

  const navigate = useNavigate();

  const activeClassname =
    "flex gap-2 items-center text-green cursor-pointer py-3 border-b border-b-2 border-green";
  const nonActiveClassname =
    "flex gap-2 items-center text-black/70 hover:text-green cursor-pointer py-3";

  const getP2Value = (e) => {
    const { name, value } = e.target;
    if (!isNaN(value)) {
      setMemberP2Value((prev) => {
        return {
          ...prev,
          [name]: +value,
        };
      });
      if (value.trim() === "" || +value <= 0 || +value > 10) {
        setMemberP2Value((prev) => {
          return {
            ...prev,
            [name]: 1,
          };
        });
      }
    }
  };

  const getEnglishCert = () => {
    if (allowEdit) {
      setMemberP2Value((prev) => {
        return {
          ...prev,
          haveEnghlishCert: !memberP2Value.haveEnghlishCert,
        };
      });
    }
  };

  const getGraduated = () => {
    if (allowEdit) {
      setMemberP2Value((prev) => {
        return {
          ...prev,
          graduated: !memberP2Value.graduated,
        };
      });
    }
  };

  const increaseStep = (name) => {
    setMemberP2Value((prev) => {
      return {
        ...prev,
        [name]: +memberP2Value[name] === 10 ? 1 : +memberP2Value[name] + 1,
      };
    });
  };

  const updateP2Value = async () => {
    setLoading(true);
    try {
      const response = await projectApi.updateMemberAttributes(memberP2Value);
      if (response.success) {
        ToastSuccess({ text: "Cập nhật thành công" });
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
    setLoading(false);
  };

  useEffect(() => {
    const getMemberProjectCount = async () => {
      setProjectLoading(true);
      try {
        const response = await memberApi.getMemberProjects(
          props.user.member.memberId
        );
        if (response.success) {
          setMemberProjects(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setProjectLoading(false);
    };

    const getMemberP2 = async () => {
      setLoading(true);
      try {
        const response = await projectApi.getProjecMemberId(
          props.user.projectMemberId
        );
        if (response.success) {
          const data = response.data.message.attributes;
          console.log(data);
          const attributes = {
            projectMemberId: props.user.projectMemberId,
            commnicationSkill: +data.COMMUNICATION_SKILL,
            creativitySkill: +data.CREATIVITY_SKILL,
            haveEnghlishCert:
              data.HAD_ENGLISH_CERTIFICATE.toLowerCase() === "true"
                ? true
                : false,
            graduated:
              data.IS_GRADUATED.toLowerCase() === "true" ? true : false,
            leadershipSkill: +data.LEADERSHIP_SKILL,
            positiveAttitude: +data.POSITIVE_ATTITUDE,
            problemSolvingSkill: +data.PROBLEM_SOLVING_SKILL,
            teamworkSkill: +data.TEAMWORK_SKILL,
            yearOfExp: +data.YEARS_OF_EXPERIENCE,
          };
          setMemberP2Value(attributes);

          const updatedAt = response.data.message.updatedAt;
          console.log(updatedAt);

          const cyRes = await salaryApi.getMostRecent();
          if (cyRes.success) {
            const cycles = cyRes.data.message;
            if (!isEmpty(cycles)) {
              const cycle = cycles[0];
              if (cycle.status === "paid" || cycle.status === "cancelled") {
                setAllowEdit(true);
              } else {
                setAllowEdit(false);
              }
            }
          }
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setLoading(false);
    };

    getMemberP2();
    getMemberProjectCount();
  }, [props.user]);

  return (
    <div>
      <div className="flex items-center gap-5 px-5 bg-green/10">
        <div
          className={page === 1 ? activeClassname : nonActiveClassname}
          onClick={() => setPage(1)}
        >
          <div className="text-lg">
            <HiNewspaper />
          </div>
          <div>Thông tin cá nhân</div>
        </div>
        <div
          className={page === 2 ? activeClassname : nonActiveClassname}
          onClick={() => setPage(2)}
        >
          <div className="text-lg">
            <BsFillBriefcaseFill />
          </div>
          <div>Thông tin P1 - Vị trí</div>
        </div>
        <div
          className={page === 3 ? activeClassname : nonActiveClassname}
          onClick={() => setPage(3)}
        >
          <div className="text-lg">
            <TbReport />
          </div>
          <div>Thông tin P2 - Năng lực</div>
        </div>
      </div>
      {loading ? (
        <div className="h-80">
          <Loading />
        </div>
      ) : (
        <>
          {page === 1 ? (
            <div className="grid grid-cols-5 py-5">
              <div className="flex flex-col justify-center items-center h-fit">
                <img
                  className="w-20 h-20 rounded-full mb-2"
                  src={
                    props.user.member.imageUrl
                      ? props.user.member.imageUrl
                      : `https://ui-avatars.com/api/?name=${props.user.member.fullName}&length=1&background=30BC97&color=FFFFFF`
                  }
                  alt="avatar"
                  referrerPolicy="no-referrer"
                />
                <div className="font-bold">{props.user.member.fullName}</div>
                <div className="text-black/70 text-xs">
                  {props.user.member.emailAddress}
                </div>
              </div>
              <div className="col-span-4 grid grid-cols-2 gap-10">
                <div>
                  <div className="mb-2 font-bold text-black/70">Họ và tên</div>
                  <div className="bg-green/10">
                    <TextInputSimple
                      icon={<FaUserAlt />}
                      value={props.user.member.fullName}
                      disabled={true}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 font-bold text-black/70">Email</div>
                  <div className="bg-green/10">
                    <TextInputSimple
                      icon={<MdEmail />}
                      value={props.user.member.emailAddress}
                      disabled={true}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 font-bold text-black/70">
                    Điện thoại liên hệ
                  </div>
                  <div className="bg-green/10">
                    <TextInputSimple
                      icon={<AiFillPhone />}
                      value={
                        props.user.member.phoneNumber
                          ? props.user.member.phoneNumber
                          : "N/A"
                      }
                      disabled={true}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 font-bold text-black/70">Facebook</div>
                  <div className="bg-green/10">
                    <TextInputSimple
                      icon={<BsFacebook />}
                      value={
                        props.user.member.facebookUrl
                          ? props.user.member.facebookUrl
                          : "N/A"
                      }
                      disabled={true}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 font-bold text-black/70">
                    Ngày tham gia
                  </div>
                  <div className="bg-green/10">
                    <TextInputSimple
                      icon={<AiFillCalendar />}
                      value={
                        props.user.member.memberLevels.createdAt
                          ? toDate(props.user.member.memberLevels.createdAt)
                          : "N/A"
                      }
                      disabled={true}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 font-bold text-black/70">
                    Số dự án tham gia:{" "}
                    <span className="text-green">
                      {!isEmpty(memberProjects) ? memberProjects.length : "0"}
                    </span>
                  </div>
                  <div>
                    {projectLoading ? (
                      <Loading />
                    ) : (
                      <div className="grid grid-cols-4 gap-5">
                        {memberProjects.map((project) => {
                          return (
                            <div
                              key={project.projectId}
                              onClick={() =>
                                navigate(`/projects/${project.projectId}`)
                              }
                              className="flex justify-center rounded-full bg-green/30 text-green text-sm px-2 py-1 w-24"
                            >
                              <div className="cursor-pointer hover:underline w-fit truncate">
                                {project.projectName}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : page === 2 ? (
            <div className="grid grid-cols-5 py-5">
              <div className="flex flex-col justify-center mb-2 items-center h-fit">
                <img
                  className="w-20 h-20 rounded-full"
                  src={
                    props.user.member.imageUrl
                      ? props.user.member.imageUrl
                      : `https://ui-avatars.com/api/?name=${props.user.member.fullName}&length=1&background=30BC97&color=FFFFFF`
                  }
                  alt="avatar"
                  referrerPolicy="no-referrer"
                />
                <div className="font-bold">{props.user.member.fullName}</div>
                <div className="text-black/70 text-xs">
                  {props.user.member.emailAddress}
                </div>
              </div>
              <div className="col-span-4 grid grid-cols-2 gap-10">
                <div>
                  <div className="mb-2 font-bold text-black/70">Cấp độ</div>
                  <div className="bg-green/10">
                    <TextInputSimple
                      inputTextColor="text-green"
                      icon={<SiGumtree className="text-green text-lg" />}
                      value={props.user.member.memberLevels.level.levelName}
                      disabled={true}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 font-bold text-black/70">
                    Giờ làm tối thiểu
                  </div>
                  <div className="bg-green/10">
                    <TextInputSimple
                      inputTextColor="text-purple"
                      icon={<BiTimer className="text-purple text-xl" />}
                      value={props.user.member.memberLevels.level.minWorkHour}
                      disabled={true}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 font-bold text-black/70">
                    Mức lương theo giờ
                  </div>
                  <div className="bg-green/10">
                    <TextInputSimple
                      inputTextColor="text-yellow-500"
                      icon={<GiTwoCoins className="text-yellow-500 text-xl" />}
                      value={
                        props.user.member.memberLevels.level.basePointPerHour
                      }
                      disabled={true}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 font-bold text-black/70">
                    Giờ làm tối đa
                  </div>
                  <div className="bg-green/10">
                    <TextInputSimple
                      inputTextColor="text-orange-700"
                      icon={
                        <AiFillClockCircle className="text-orange-700 text-xl" />
                      }
                      value={props.user.member.memberLevels.level.maxWorkHour}
                      disabled={true}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 font-bold text-black/70">Bậc lương</div>
                  <div className="bg-green/10">
                    <TextInputSimple
                      inputTextColor="text-green"
                      icon={<GoDatabase className="text-green text-xl" />}
                      value={props.user.member.memberLevels.level.basePoint}
                      disabled={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            page === 3 && (
              <div className="grid grid-cols-5 py-5 select-none">
                <div className="flex flex-col justify-center items-center h-fit">
                  <img
                    className="w-20 h-20 rounded-full mb-2"
                    src={
                      props.user.member.imageUrl
                        ? props.user.member.imageUrl
                        : `https://ui-avatars.com/api/?name=${props.user.member.fullName}&length=1&background=30BC97&color=FFFFFF`
                    }
                    alt="avatar"
                    referrerPolicy="no-referrer"
                  />
                  <div className="font-bold">{props.user.member.fullName}</div>
                  <div className="text-black/70 text-xs">
                    {props.user.member.emailAddress}
                  </div>
                </div>
                <div className="col-span-4 grid grid-cols-3 gap-10 p-5">
                  <div>
                    <div className="mb-2 font-bold text-black/70">
                      Giao tiếp
                    </div>
                    <div className="bg-green/10">
                      {allowEdit ? (
                        <NumberInput
                          name="commnicationSkill"
                          value={memberP2Value.commnicationSkill}
                          onChange={getP2Value}
                          increaseButton={true}
                          increaseStep={() => increaseStep("commnicationSkill")}
                        />
                      ) : (
                        <TextInputSimple
                          value={memberP2Value.commnicationSkill}
                          disabled={true}
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 font-bold text-black/70">
                      Làm việc nhóm
                    </div>
                    <div className="bg-green/10">
                      {allowEdit ? (
                        <NumberInput
                          name="teamworkSkill"
                          value={memberP2Value.teamworkSkill}
                          onChange={getP2Value}
                          increaseButton={true}
                          increaseStep={() => increaseStep("teamworkSkill")}
                        />
                      ) : (
                        <TextInputSimple
                          value={memberP2Value.teamworkSkill}
                          disabled={true}
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 font-bold text-black/70">
                      Giải quyết vấn đề
                    </div>
                    <div className="bg-green/10">
                      {allowEdit ? (
                        <NumberInput
                          name="problemSolvingSkill"
                          value={memberP2Value.problemSolvingSkill}
                          onChange={getP2Value}
                          increaseButton={true}
                          increaseStep={() =>
                            increaseStep("problemSolvingSkill")
                          }
                        />
                      ) : (
                        <TextInputSimple
                          value={memberP2Value.problemSolvingSkill}
                          disabled={true}
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 font-bold text-black/70">Thái độ</div>
                    <div className="bg-green/10">
                      {allowEdit ? (
                        <NumberInput
                          name="positiveAttitude"
                          value={memberP2Value.positiveAttitude}
                          onChange={getP2Value}
                          increaseButton={true}
                          increaseStep={() => increaseStep("positiveAttitude")}
                        />
                      ) : (
                        <TextInputSimple
                          value={memberP2Value.positiveAttitude}
                          disabled={true}
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 font-bold text-black/70">Sáng tạo</div>
                    <div className="bg-green/10">
                      {allowEdit ? (
                        <NumberInput
                          name="creativitySkill"
                          value={memberP2Value.creativitySkill}
                          onChange={getP2Value}
                          increaseButton={true}
                          increaseStep={() => increaseStep("creativitySkill")}
                        />
                      ) : (
                        <TextInputSimple
                          value={memberP2Value.creativitySkill}
                          disabled={true}
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 font-bold text-black/70">Lãnh đạo</div>
                    <div className="bg-green/10">
                      {allowEdit ? (
                        <NumberInput
                          name="leadershipSkill"
                          value={memberP2Value.leadershipSkill}
                          onChange={getP2Value}
                          increaseButton={true}
                          increaseStep={() => increaseStep("leadershipSkill")}
                        />
                      ) : (
                        <TextInputSimple
                          value={memberP2Value.leadershipSkill}
                          disabled={true}
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 font-bold text-black/70">
                      Năm kinh nghiệm
                    </div>
                    <div className="bg-green/10">
                      {allowEdit ? (
                        <NumberInput
                          name="yearOfExp"
                          value={memberP2Value.yearOfExp}
                          onChange={getP2Value}
                          increaseButton={true}
                          increaseStep={() => increaseStep("yearOfExp")}
                        />
                      ) : (
                        <TextInputSimple
                          value={memberP2Value.yearOfExp}
                          disabled={true}
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 font-bold text-black/70">
                      Chứng chỉ tiếng anh
                    </div>
                    <div
                      className={`${
                        memberP2Value.haveEnghlishCert
                          ? "bg-green justify-end"
                          : "bg-orange-700 justify-start"
                      } h-5 w-12 rounded-full cursor-pointer flex items-center border border-slate-300 ease-in-out duration-300`}
                      onClick={getEnglishCert}
                    >
                      <div
                        className={`bg-white top-0 h-4 w-4 rounded-full`}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 font-bold text-black/70">
                      Tốt nghiệp
                    </div>
                    <div
                      className={`${
                        memberP2Value.graduated
                          ? "bg-green justify-end"
                          : "bg-orange-700 justify-start"
                      } h-5 w-12 rounded-full cursor-pointer flex items-center border border-slate-300 ease-in-out duration-300`}
                      onClick={getGraduated}
                    >
                      <div
                        className={`bg-white top-0 h-4 w-4 rounded-full`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
          {allowEdit && (
            <div className="col-span-4 flex justify-between p-5">
              <div className="w-32">
                <ButtonCancel
                  type="trans"
                  text="Quay lại"
                  onClick={props.closeModal}
                  disabled={loading}
                />
              </div>
              <div className="w-32">
                <Button
                  text={page < 3 ? "Kế tiếp" : "Hoàn tất"}
                  onClick={() => {
                    if (page < 3) {
                      setPage(page + 1);
                    } else if (page === 3) {
                      updateP2Value();
                    }
                  }}
                  disabled={loading}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MemberP2Information;
