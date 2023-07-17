import { TopBar } from "./../Layout/TopBar";
import { useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { ImSpinner11 } from "react-icons/im";
import TextInputSimple from "../../Components/Input/TextInputSimple";
import Button from "./../../Components/Button/Button";
import TextAreaSimple from "./../../Components/Input/TextAreaSimple";
import { useNavigate } from "react-router-dom";
import NumberInput from "../../Components/Input/NumberInput";
import { isEmpty, isNil, pickBy, remove, toNumber } from "lodash";
import FileInput from "../../Components/Input/FileInput";
import ToastError from "./../../Components/Alert/ToastError";
import projectApi from "./../../API/Project/projectApi";
import ToastSuccess from "./../../Components/Alert/ToastSuccess";
import ProgressModal from "../../Components/Modal/ProgressModal";
import { useEffect } from "react";
import memberApi from "../../API/Member/memberApi";
import { useSelector } from "react-redux";
import SelectSimple from "../../Components/Select/SelectSimple";
import Loading from "../../Components/Loading/Loading";
import { BsCheckSquareFill } from "react-icons/bs";

const CreateProject = () => {
  const currentMember = useSelector((state) => state.auth.member);

  const [project, setProject] = useState({
    name: "",
    short: "",
    budget: 0,
    manager: "",
    description: "",
    file: "",
    sendEmailToPM: true,
  });
  const [projectFile, setProjectFile] = useState();

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");

  const [pmLoading, setPmLoading] = useState(false);
  const [pmList, setPmList] = useState([]);

  const [error, setError] = useState({
    name: "",
    short: "",
    description: "",
    file: "",
  });

  const navigate = useNavigate();

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
      description: "",
    });
  };

  const getFile = (e) => {
    const path = e.target.value;
    setProject((prev) => {
      return {
        ...prev,
        file: path,
      };
    });
    setError((prev) => {
      return {
        ...prev,
        file: "",
      };
    });
    setProjectFile(e.target.files[0]);
  };

  const removeFile = () => {
    setProject((prev) => {
      return {
        ...prev,
        file: "",
      };
    });
    setError((prev) => {
      return {
        ...prev,
        file: "",
      };
    });
    setProjectFile(null);
  };

  const getProjectData = (e) => {
    const { name, value } = e.target;
    if ((name === "budget" && isNaN(+value)) || +value > 1000000000) {
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
  };

  const getManagerFromSelect = (data) => {
    setProject((prev) => {
      return {
        ...prev,
        manager: data.value,
      };
    });
  };

  const increaseStep = () => {
    if (project.budget >= 50000) {
      return;
    }
    setProject((prev) => {
      return {
        ...prev,
        budget: toNumber(project.budget) + 1000,
      };
    });
  };

  const createProject = async () => {
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
    setProgressText("Đang tạo thông tin dự án");
    try {
      const response = await projectApi.create({
        projectName: project.name,
        projectShortName: project.short,
        projectDescription: project.description,
        projectManagerEmail: project.manager,
        budget: project.budget,
        sendEmailToPM: project.sendEmailToPM,
      });
      if (response.success) {
        const projectId = response.data.message;
        if (projectFile) {
          setProgress(50);
          setProgressText("Đang thêm tập tin cho dự án");
          const formData = new FormData();
          formData.append("file", projectFile);
          const responseFile = await projectApi.createProjectFile(
            projectId,
            formData
          );
          if (responseFile.success) {
            setProgress(100);
            navigate(`/projects/${projectId}`);
            ToastSuccess({ text: "Tạo thành công" });
          }
        } else {
          setProgress(100);
          setProgressText("Hoàn thành");
          ToastSuccess({ text: "Tạo thành công" });
          navigate(`/projects/${projectId}`);
        }
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
    setLoading(false);
  };

  useEffect(() => {
    const getUsers = async () => {
      setPmLoading(true);
      try {
        const response = await memberApi.get({
          "page-size": 100,
        });
        if (response.success) {
          const membersList = remove(
            response.data.message,
            (member) =>
              member.memberId !== currentMember.memberId &&
              member.role.roleId !== "ADMIN"
          );
          const selectList = [];
          membersList.forEach((member) => {
            selectList.push({
              value: member.emailAddress,
              label: (
                <div className="flex items-center gap-1">
                  <div>
                    <img
                      className="w-5 h-5 rounded-full shadow-md"
                      src={
                        member.imageUrl
                          ? member.imageUrl
                          : `https://ui-avatars.com/api/?name=${member.fullName}&length=1&background=30BC97&color=FFFFFF`
                      }
                      alt="avatar"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>{member.emailAddress}</div>
                </div>
              ),
            });
          });
          setProject((prev) => {
            return {
              ...prev,
              manager: selectList[0].value,
            };
          });
          setPmList(selectList);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setPmLoading(false);
    };

    getUsers();
  }, [currentMember.memberId]);

  return (
    <>
      <TopBar />
      {loading && <ProgressModal value={progress} text={progressText} />}
      <div className="pl-10 pr-5 mb-10 select-none">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex justify-between items-center mb-10">
            <div className="flex gap-4 items-center font-bold ">
              <h1 className="text-3xl">Dự án mới</h1>
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
              <div className="w-full">
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
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mb-8 flex gap-10">
            <div className="w-1/2">
              <div className="mb-2 font-bold text-gray">Quản lý dự án</div>
              {pmLoading ? (
                <Loading />
              ) : (
                <>
                  <div className="mb-2">
                    <SelectSimple
                      options={pmList}
                      placeholder="Chọn quản lý dự án"
                      onChange={getManagerFromSelect}
                    />
                  </div>
                  <div>
                    <div
                      className="flex gap-2 items-center justify-end cursor-pointer"
                      onClick={() =>
                        setProject((prev) => {
                          return {
                            ...prev,
                            sendEmailToPM: !project.sendEmailToPM,
                          };
                        })
                      }
                    >
                      <div className="text-green">
                        {!project.sendEmailToPM ? (
                          <div
                            className="w-3 h-3 border border-black rounded-sm"
                            onClick={() =>
                              setProject((prev) => {
                                return {
                                  ...prev,
                                  sendEmailToPM: true,
                                };
                              })
                            }
                          ></div>
                        ) : (
                          <BsCheckSquareFill
                            className="animate-custom-ping"
                            onClick={() =>
                              setProject((prev) => {
                                return {
                                  ...prev,
                                  sendEmailToPM: false,
                                };
                              })
                            }
                          />
                        )}
                      </div>
                      <span className="select-none">Gửi mail thông báo</span>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="w-1/2">
              <div className="mb-2 font-bold text-gray">Tài liệu đính kèm</div>
              <FileInput
                placeholder="FinalProjectPitchDeck.pptx"
                name="file"
                value={project.file}
                onChange={getFile}
                removeFile={removeFile}
                error={error.file}
              />
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
              <Button text="Tạo dự án mới" onClick={createProject} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateProject;
