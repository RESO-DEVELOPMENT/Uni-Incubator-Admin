import { TopBar } from "./../Layout/TopBar";
import { useState, useEffect } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { ImSpinner11 } from "react-icons/im";
import TextInputSimple from "../../Components/Input/TextInputSimple";
import Button from "./../../Components/Button/Button";
import TextAreaSimple from "./../../Components/Input/TextAreaSimple";
import { useNavigate, useParams } from "react-router-dom";
import NumberInput from "../../Components/Input/NumberInput";
import { find, isEmpty, isNil, last, pickBy, split, toNumber } from "lodash";
import ToastError from "./../../Components/Alert/ToastError";
import projectApi from "./../../API/Project/projectApi";
import ProgressModal from "../../Components/Modal/ProgressModal";
import { textToColor, toVN } from "../../Ultilities/String";
import ToastSuccess from "../../Components/Alert/ToastSuccess";
import { BsArrowBarRight } from "react-icons/bs";
import Loading from "../../Components/Loading/Loading";
import CancelProjectModal from "./Components/CancelProjectModal";
import { useSelector } from "react-redux";
import SelectSimple from "../../Components/Select/SelectSimple";

const CreateProject = () => {
  const currentMember = useSelector((state) => state.auth.member);
  const [pmList, setPmList] = useState([]);

  const [project, setProject] = useState({
    name: "",
    short: "",
    budget: 0,
    manager: "",
    description: "",
    file: "",
    status: "",
  });

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");

  const [disabled, setDisabled] = useState(true);

  const [editPM, setEditPM] = useState(false);
  const [selectPm, setSelectPm] = useState("");

  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const navigate = useNavigate();

  const { projectId } = useParams();

  const [error, setError] = useState({
    name: "",
    short: "",
    budget: "",
    description: "",
    status: "",
  });

  const clearAllField = () => {
    setProject((prev) => {
      return {
        ...prev,
        name: "",
        short: "",
        description: "",
      };
    });
    setError({
      name: "",
      short: "",
      budget: 0,
      description: "",
    });
    setDisabled(false);
  };

  const getPmFromSelect = (data) => {
    setSelectPm(data.value);
    setDisabled(false);
  };

  const getProjectData = (e) => {
    const { name, value } = e.target;
    if (
      (name === "budget" && isNaN(toNumber(value))) ||
      (name === "budget" && +value > 50000)
    ) {
      return;
    }
    if (name === "short" && value.length > 7) {
      return;
    }
    setProject((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
    setError((prev) => {
      return {
        ...prev,
        [name]: "",
      };
    });
    setDisabled(false);
  };

  const increaseStep = () => {
    setProject((prev) => {
      return {
        ...prev,
        budget: toNumber(project.budget) + 1000,
      };
    });
    setError((prev) => {
      return {
        ...prev,
        budget: "",
      };
    });
    setDisabled(false);
  };

  const updateProjectStatus = async (status) => {
    try {
      const statusRes = await projectApi.updateProjectStatus({
        projectId: projectId,
        projectStatus: status,
      });
      if (statusRes.success) {
        ToastSuccess({ text: "Cập nhật thành công" });
        navigate(`/projects/${projectId}`);
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
  };

  const updateProject = async () => {
    const nullUndefinedEmpty = pickBy(
      {
        name: project.name.trim(),
        short: project.short.trim(),
        description: project.description.trim(),
      },
      (value) => {
        return isNil(project) || isEmpty(value);
      }
    );
    if (!isEmpty(nullUndefinedEmpty)) {
      for (const key in nullUndefinedEmpty) {
        setError((prev) => {
          return {
            ...prev,
            [key]: "*",
          };
        });
      }
      return;
    }
    setLoading(true);
    setProgressText("Đang cập nhật thông tin dự án");
    try {
      if (project.manager !== selectPm) {
        await projectApi.changeProjectPm(projectId, {
          email: selectPm,
        });
      }
      const response = await projectApi.updateProject({
        projectId: projectId,
        projectName: project.name,
        projectShortName: project.short,
        projectDescription: project.description,
        budget: project.budget,
      });
      if (response.success) {
        setProgress(100);
        navigate(`/projects/${projectId}`);
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
    setLoading(false);
  };

  useEffect(() => {
    const getProjectById = async () => {
      setLoading(true);
      setProgressText("Đang lấy thông tin dự án");
      try {
        const response = await projectApi.getById(projectId);
        if (response.success) {
          const data = response.data.message;
          setProject({
            name: data.projectName,
            short: data.projectShortName,
            budget: +data.budget,
            manager: find(data.members, { role: "manager" }).member
              .emailAddress,
            description: data.projectLongDescription,
            file: !isEmpty(data.projectFiles)
              ? data.projectFiles[0].file.directUrl
              : "",
            status: data.projectStatus,
          });
          setSelectPm(
            find(data.members, { role: "manager" }).member.emailAddress
          );
          console.log(data.members);
          const selectList = [];
          data.members.forEach((member) => {
            selectList.push({
              value: member.member.emailAddress,
              label: (
                <div className="flex items-center gap-1">
                  <div>
                    <img
                      className="w-5 h-5 rounded-full shadow-md"
                      src={
                        member.member.imageUrl
                          ? member.member.imageUrl
                          : `https://ui-avatars.com/api/?name=${member.member.fullName}&length=1&background=30BC97&color=FFFFFF`
                      }
                      alt="avatar"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>{member.member.emailAddress}</div>
                </div>
              ),
            });
          });
          setPmList(selectList);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setLoading(false);
    };

    getProjectById();
  }, [projectId, currentMember.memberId]);

  return (
    <>
      <TopBar />
      {loading && <ProgressModal value={progress} text={progressText} />}
      <div className="pl-10 pr-5 mb-10 select-none">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex justify-between items-center mb-2">
            <div className="flex gap-4 items-center font-bold ">
              <h1 className="text-3xl">Cập nhật dự án</h1>
              <div className="flex items-center justify-center h-5 w-5 rounded-md text-green bg-green/30">
                <AiOutlineCheck />
              </div>
            </div>
            <div className="relative flex items-center gap-3 text-sm font-bold cursor-pointer text-violet-700">
              <ImSpinner11 />
              <div>Nhập lại</div>
              <div
                className="absolute w-full h-full"
                onClick={clearAllField}
              ></div>
            </div>
          </div>
          <div
            className="mb-10 text-red-500 cursor-pointer hover:underline w-fit"
            onClick={() => setOpenConfirmModal(true)}
          >
            Hủy dự án
          </div>

          <div className="mb-10">
            <div className="mb-2 font-bold text-gray">Tên dự án</div>
            <TextInputSimple
              placeholder="Nhập tên dự án"
              name="name"
              value={project.name}
              onChange={getProjectData}
              error={error.name}
            />
          </div>
          <div className="mb-10 flex gap-10">
            <div className="w-1/2">
              <div className="mb-2 font-bold text-gray">Tên viết tắt</div>
              <TextInputSimple
                placeholder="Ví dụ: UniCare"
                name="short"
                value={project.short}
                onChange={getProjectData}
                error={error.short}
              />
            </div>
            <div className="flex w-1/2 gap-10">
              <div className="w-1/2">
                <div className="mb-2 font-bold text-gray">
                  Quỹ dự kiến (Point)
                </div>
                <div>
                  <NumberInput
                    placeholder="Ví dụ: 2,000"
                    name="budget"
                    value={project.budget}
                    onChange={getProjectData}
                    increaseButton={true}
                    increaseStep={increaseStep}
                    error={error.budget}
                  />
                </div>
              </div>
              <div className="w-1/2">
                <div className="mb-2 flex gap-2 justify-between items-center">
                  <div className="font-bold text-gray">Trạng thái</div>
                  {loading ? (
                    <Loading />
                  ) : (
                    <>
                      {project.status === "created" && (
                        <div className="flex items-center gap-1">
                          <div
                            onClick={() =>
                              updateProjectStatus(
                                project.status === "created" && "started"
                              )
                            }
                            className="text-green text-xs cursor-pointer flex items-center gap-2 h-fit font-bold hover:underline"
                          >
                            <div>
                              {project.status === "created" && "Bắt đầu dự án"}
                            </div>
                            <div>
                              <BsArrowBarRight />
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div
                  className={`px-5 py-3 font-bold`}
                  style={{ color: textToColor(project.status) }}
                >
                  {toVN(project.status)}
                </div>
              </div>
            </div>
          </div>
          <div className="mb-10 flex gap-10">
            <div className="w-1/2">
              <div className="mb-2 flex gap-2 font-bold text-gray items-center">
                <div>Quản lý dự án</div>
                {editPM ? (
                  <div
                    className="text-xs text-red-500 cursor-pointer hover:underline"
                    onClick={() => {
                      setEditPM(false);
                      setSelectPm(project.manager);
                    }}
                  >
                    Huỷ bỏ
                  </div>
                ) : (
                  <div
                    className="text-xs text-green cursor-pointer hover:underline"
                    onClick={() => setEditPM(true)}
                  >
                    Chỉnh sửa
                  </div>
                )}
              </div>
              {editPM ? (
                <div className="mb-2">
                  <SelectSimple
                    options={pmList}
                    placeholder="Chọn quản lý dự án"
                    defaultValue={find(pmList, { value: selectPm })}
                    onChange={getPmFromSelect}
                  />
                </div>
              ) : (
                <div className="px-5 py-3 font-bold text-primary">
                  {project.manager}
                </div>
              )}
            </div>
            <div className="w-1/2">
              <div className="font-bold text-gray mb-2">Tài liệu đính kèm</div>
              {!isEmpty(project.file) ? (
                <div
                  className="px-5 py-3 font-bold text-primary cursor-pointer hover:underline"
                  onClick={() =>
                    window.open(project.file, { target: "_blank" })
                  }
                >
                  {last(split(project.file, "/"))}
                </div>
              ) : (
                <div className="px-5 py-3 font-bold text-primary">
                  Không có tệp đính kèm
                </div>
              )}
            </div>
          </div>
          <div className="w-full mb-10">
            <div className="mb-2 font-bold text-gray">Mô tả</div>
            <div>
              <TextAreaSimple
                name="description"
                value={project.description}
                placeholder="Đây là mô tả dự án"
                onChange={getProjectData}
                rows={10}
                error={error.description}
              />
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <Button
                type="trans"
                text="Quay lại"
                onClick={() => navigate(-1)}
              />
            </div>
            <div>
              <Button
                text="Cập nhật dự án"
                onClick={updateProject}
                disabled={disabled}
              />
            </div>
          </div>
        </div>
        {openConfirmModal && (
          <CancelProjectModal
            text="Bạn có chắc chắn muốn hủy dự án "
            closeModal={() => setOpenConfirmModal(false)}
            project={project}
            removeProject={() => updateProjectStatus("cancelled")}
          />
        )}
      </div>
    </>
  );
};

export default CreateProject;
