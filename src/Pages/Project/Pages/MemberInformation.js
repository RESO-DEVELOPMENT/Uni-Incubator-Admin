import { useState } from "react";
import { BsFacebook, BsFillBriefcaseFill } from "react-icons/bs";
import { FaUserAlt } from "react-icons/fa";
import { HiNewspaper } from "react-icons/hi";
import { TbReport } from "react-icons/tb";
import TextInputSimple from "../../../Components/Input/TextInputSimple";
import { AiFillCalendar, AiFillClockCircle, AiFillPhone } from "react-icons/ai";
import { MdEmail } from "react-icons/md";
import { toDate } from "../../../Ultilities/Date";
import { useEffect } from "react";
import ToastError from "../../../Components/Alert/ToastError";
import memberApi from "../../../API/Member/memberApi";
import { find, isEmpty, pull } from "lodash";
import Loading from "../../../Components/Loading/Loading";
import { useNavigate } from "react-router-dom";
import Button from "../../../Components/Button/Button";
import { SiGumtree } from "react-icons/si";
import { BiTimer } from "react-icons/bi";
import { GiTwoCoins } from "react-icons/gi";
import { GoDatabase } from "react-icons/go";
import projectApi from "../../../API/Project/projectApi";
import ToastSuccess from "../../../Components/Alert/ToastSuccess";
import NumberInput from "../../../Components/Input/NumberInput";

const MemberInformation = (props) => {
  const [page, setPage] = useState(3);

  const [requests, setRequests] = useState(props.selectedRequests);
  const [selectedRequest, setSelectedRequest] = useState({
    ...props.selectedRequests[0],
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
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const activeClassname =
    "flex gap-2 items-center text-green cursor-pointer py-3 border-b border-b-2 border-green";
  const nonActiveClassname =
    "flex gap-2 items-center text-black/70 hover:text-green cursor-pointer py-3";

  const navigate = useNavigate();

  const getSelectedMember = (request) => {
    setSelectedRequest({
      ...request,
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
  };

  const getP2Value = (e) => {
    const { name, value } = e.target;
    if (!isNaN(value)) {
      setSelectedRequest((prev) => {
        return {
          ...prev,
          [name]: +value,
        };
      });
      if (value.trim() === "" || +value <= 0 || +value > 10) {
        setSelectedRequest((prev) => {
          return {
            ...prev,
            [name]: 1,
          };
        });
      }
    }
  };

  const getEnglishCert = () => {
    setSelectedRequest((prev) => {
      return {
        ...prev,
        haveEnghlishCert: !selectedRequest.haveEnghlishCert,
      };
    });
  };

  const getGraduated = () => {
    setSelectedRequest((prev) => {
      return {
        ...prev,
        graduated: !selectedRequest.graduated,
      };
    });
  };

  const increaseStep = (name) => {
    setSelectedRequest((prev) => {
      return {
        ...prev,
        [name]: +selectedRequest[name] === 10 ? 1 : +selectedRequest[name] + 1,
      };
    });
  };

  const updateRequest = async () => {
    setUpdateLoading(true);
    try {
      const response = await projectApi.updateJoinRequest({
        requestId: selectedRequest.requestId,
        status: "accepted",
        graduated: selectedRequest.graduated,
        yearOfExp: selectedRequest.yearOfExp,
        haveEnghlishCert: selectedRequest.haveEnghlishCert,
        leadershipSkill: selectedRequest.leadershipSkill,
        creativitySkill: selectedRequest.creativitySkill,
        problemSolvingSkill: selectedRequest.problemSolvingSkill,
        positiveAttitude: selectedRequest.positiveAttitude,
        teamworkSkill: selectedRequest.teamworkSkill,
        commnicationSkill: selectedRequest.commnicationSkill,
      });
      if (response.success) {
        const updatedRequest = find(requests, {
          requestId: selectedRequest.requestId,
        });
        const newRequests = pull(requests, updatedRequest);
        setRequests(newRequests);
        props.getSelectedRequests(newRequests);
        ToastSuccess({
          text: `Thêm thành viên ${selectedRequest.member.fullName} thành công`,
        });
        if (!isEmpty(newRequests)) {
          getSelectedMember(newRequests[0]);
        } else {
          props.getStep(1);
        }
        props.getActiveReload();
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
    setUpdateLoading(false);
  };

  useEffect(() => {
    if (page === 3) {
      props.getStep(3);
    } else {
      props.getStep(2);
    }
  }, [page, props]);

  useEffect(() => {
    const getMemberProjectCount = async () => {
      setLoading(true);
      try {
        const response = await memberApi.getMemberProjects(
          selectedRequest.member.memberId
        );
        if (response.success) {
          setMemberProjects(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setLoading(false);
    };

    getMemberProjectCount();
  }, [selectedRequest.member.memberId]);

  return (
    <div
      className={`border border-slate-200 ${
        requests.length > 1 && "grid grid-cols-4"
      }`}
    >
      {requests.length > 1 && (
        <div className="p-2 h-full overflow-y-auto border-r border-slate-200">
          {requests.map((request) => {
            return (
              <div
                key={request.member.memberId}
                className={`grid grid-cols-4 gap-2 mb-2 p-2 cursor-pointer hover:bg-green/10 border border-slate-200 rounded-lg ${
                  request.requestId === selectedRequest.requestId &&
                  "bg-green/10"
                }`}
                onClick={() => getSelectedMember(request)}
              >
                <div className="flex justify-center items-center">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={
                      request.member.imageUrl
                        ? request.member.imageUrl
                        : `https://ui-avatars.com/api/?name=${request.member.fullName}&length=1&background=30BC97&color=FFFFFF`
                    }
                    alt="avatar"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="col-span-3">
                  <div className="truncate text-sm">
                    {request.member.fullName}
                  </div>
                  <div className="truncate text-xs text-black/70">
                    {request.member.emailAddress}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className={`${requests.length > 1 && "col-span-3"}`}>
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
        {updateLoading ? (
          <div className="h-80">
            <Loading />
          </div>
        ) : (
          <>
            {page === 1 ? (
              <div className="grid grid-cols-5 py-5">
                <div className="flex flex-col justify-center mb-2 items-center h-fit">
                  <img
                    className="w-20 h-20 rounded-full"
                    src={
                      selectedRequest.member.imageUrl
                        ? selectedRequest.member.imageUrl
                        : `https://ui-avatars.com/api/?name=${selectedRequest.member.fullName}&length=1&background=30BC97&color=FFFFFF`
                    }
                    alt="avatar"
                    referrerPolicy="no-referrer"
                  />
                  <div className="font-bold">
                    {selectedRequest.member.fullName}
                  </div>
                  <div className="text-black/70 text-xs">
                    {selectedRequest.member.emailAddress}
                  </div>
                </div>
                <div className="col-span-4 grid grid-cols-2 gap-10">
                  <div>
                    <div className="mb-2 font-bold text-black/70">
                      Họ và tên
                    </div>
                    <div className="bg-green/10">
                      <TextInputSimple
                        icon={<FaUserAlt />}
                        value={selectedRequest.member.fullName}
                        disabled={true}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 font-bold text-black/70">Email</div>
                    <div className="bg-green/10">
                      <TextInputSimple
                        icon={<MdEmail />}
                        value={selectedRequest.member.emailAddress}
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
                          selectedRequest.member.phoneNumber
                            ? selectedRequest.member.phoneNumber
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
                          selectedRequest.member.facebookUrl
                            ? selectedRequest.member.facebookUrl
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
                          selectedRequest.member.memberLevels.createdAt
                            ? toDate(
                                selectedRequest.member.memberLevels.createdAt
                              )
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
                      {loading ? (
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
                      selectedRequest.member.imageUrl
                        ? selectedRequest.member.imageUrl
                        : `https://ui-avatars.com/api/?name=${selectedRequest.member.fullName}&length=1&background=30BC97&color=FFFFFF`
                    }
                    alt="avatar"
                    referrerPolicy="no-referrer"
                  />
                  <div className="font-bold">
                    {selectedRequest.member.fullName}
                  </div>
                  <div className="text-black/70 text-xs">
                    {selectedRequest.member.emailAddress}
                  </div>
                </div>
                <div className="col-span-4 grid grid-cols-2 gap-10">
                  <div>
                    <div className="mb-2 font-bold text-black/70">Cấp độ</div>
                    <div className="bg-green/10">
                      <TextInputSimple
                        inputTextColor="text-green"
                        icon={<SiGumtree className="text-green text-lg" />}
                        value={
                          selectedRequest.member.memberLevels.level.levelName
                        }
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
                        value={
                          selectedRequest.member.memberLevels.level.minWorkHour
                        }
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
                        icon={
                          <GiTwoCoins className="text-yellow-500 text-xl" />
                        }
                        value={
                          selectedRequest.member.memberLevels.level
                            .basePointPerHour
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
                        value={
                          selectedRequest.member.memberLevels.level.maxWorkHour
                        }
                        disabled={true}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 font-bold text-black/70">
                      Bậc lương
                    </div>
                    <div className="bg-green/10">
                      <TextInputSimple
                        inputTextColor="text-green"
                        icon={<GoDatabase className="text-green text-xl" />}
                        value={
                          selectedRequest.member.memberLevels.level.basePoint
                        }
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
                        selectedRequest.member.imageUrl
                          ? selectedRequest.member.imageUrl
                          : `https://ui-avatars.com/api/?name=${selectedRequest.member.fullName}&length=1&background=30BC97&color=FFFFFF`
                      }
                      alt="avatar"
                      referrerPolicy="no-referrer"
                    />
                    <div className="font-bold">
                      {selectedRequest.member.fullName}
                    </div>
                    <div className="text-black/70 text-xs">
                      {selectedRequest.member.emailAddress}
                    </div>
                  </div>
                  <div className="col-span-4 grid grid-cols-3 gap-10 p-5">
                    <div>
                      <div className="mb-2 font-bold text-black/70">
                        Giao tiếp
                      </div>
                      <div className="bg-green/10">
                        <NumberInput
                          name="commnicationSkill"
                          value={selectedRequest.commnicationSkill}
                          onChange={getP2Value}
                          increaseButton={true}
                          increaseStep={() => increaseStep("commnicationSkill")}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 font-bold text-black/70">
                        Làm việc nhóm
                      </div>
                      <div className="bg-green/10">
                        <NumberInput
                          name="teamworkSkill"
                          value={selectedRequest.teamworkSkill}
                          onChange={getP2Value}
                          increaseButton={true}
                          increaseStep={() => increaseStep("teamworkSkill")}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 font-bold text-black/70">
                        Giải quyết vấn đề
                      </div>
                      <div className="bg-green/10">
                        <NumberInput
                          name="problemSolvingSkill"
                          value={selectedRequest.problemSolvingSkill}
                          onChange={getP2Value}
                          increaseButton={true}
                          increaseStep={() =>
                            increaseStep("problemSolvingSkill")
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 font-bold text-black/70">
                        Thái độ
                      </div>
                      <div className="bg-green/10">
                        <NumberInput
                          name="positiveAttitude"
                          value={selectedRequest.positiveAttitude}
                          onChange={getP2Value}
                          increaseButton={true}
                          increaseStep={() => increaseStep("positiveAttitude")}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 font-bold text-black/70">
                        Sáng tạo
                      </div>
                      <div className="bg-green/10">
                        <NumberInput
                          name="creativitySkill"
                          value={selectedRequest.creativitySkill}
                          onChange={getP2Value}
                          increaseButton={true}
                          increaseStep={() => increaseStep("creativitySkill")}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 font-bold text-black/70">
                        Lãnh đạo
                      </div>
                      <div className="bg-green/10">
                        <NumberInput
                          name="leadershipSkill"
                          value={selectedRequest.leadershipSkill}
                          onChange={getP2Value}
                          increaseButton={true}
                          increaseStep={() => increaseStep("leadershipSkill")}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 font-bold text-black/70">
                        Năm kinh nghiệm
                      </div>
                      <div className="bg-green/10">
                        <NumberInput
                          name="yearOfExp"
                          value={selectedRequest.yearOfExp}
                          onChange={getP2Value}
                          increaseButton={true}
                          increaseStep={() => increaseStep("yearOfExp")}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 font-bold text-black/70">
                        Chứng chỉ tiếng anh
                      </div>
                      <div
                        className={`${
                          selectedRequest.haveEnghlishCert
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
                          selectedRequest.graduated
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
          </>
        )}
      </div>
      <div className="col-span-4 flex justify-between p-5">
        <div className="w-32">
          <Button
            type="trans"
            text="Quay lại"
            onClick={() => {
              if (page === 1) {
                props.getStep(1);
              } else {
                setPage(page - 1);
              }
            }}
            disabled={updateLoading}
          />
        </div>
        <div className="w-32">
          <Button
            text={page < 3 ? "Kế tiếp" : "Hoàn tất"}
            onClick={() => {
              if (page < 3) {
                setPage(page + 1);
              } else if (page === 3) {
                updateRequest();
              }
            }}
            disabled={updateLoading}
          />
        </div>
      </div>
    </div>
  );
};
export default MemberInformation;
