import { AiOutlineClose } from "react-icons/ai";
import Modal from "../../../Components/Modal/Modal";
import { useState } from "react";
import { useEffect } from "react";
import ToastError from "../../../Components/Alert/ToastError";
import memberApi from "../../../API/Member/memberApi";
import salaryApi from "../../../API/Salary/salaryApi";
import SelectSimple from "../../../Components/Select/SelectSimple";
import Loading from "../../../Components/Loading/Loading";
import { toDate } from "../../../Ultilities/Date";
import { first, isEmpty, split } from "lodash";
import { textToColor, toVN } from "../../../Ultilities/String";
import ButtonCancel from "../../../Components/Button/ButtonCancel";
import Button from "../../../Components/Button/Button";
import projectApi from "../../../API/Project/projectApi";
import { useNavigate } from "react-router-dom";

const AddReportModal = (props) => {
  const [projects, setProjects] = useState([]);
  const [cycle, setCycle] = useState({});

  const [project, setProject] = useState("");

  const [loading, setLoading] = useState(false);

  const [disabled, setDisabled] = useState(false);

  const navigate = useNavigate();

  const getProject = (data) => {
    setProject(first(split(data.value, "/")));
  };

  const createReport = async () => {
    try {
      const response = await projectApi.createReport(project, {
        salaryCycleId: cycle.salaryCycleId,
      });
      if (response.success) {
        navigate(`/reports/${response.data.message}`);
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
  };

  useEffect(() => {
    const getProjects = async () => {
      setLoading(true);
      try {
        const response = await memberApi.getSelfProjects({
          isManager: true,
        });
        if (response.success) {
          const data = response.data.message.filter(
            (item) =>
              item.projectStatus === "started" ||
              item.projectStatus === "stopped"
          );
          const selectList = [];
          data.forEach((item) => {
            selectList.push({
              value: `${item.projectId}/${item.projectName}`,
              label: (
                <div>
                  {item.projectName} -{" "}
                  <span
                    className="font-bold"
                    style={{ color: textToColor(item.projectStatus) }}
                  >
                    [{item.projectShortName}]
                  </span>
                </div>
              ),
            });
          });
          if (!isEmpty(selectList)) {
            setProject(first(split(selectList[0].value, "/")));
          } else {
            setDisabled(true);
          }
          setProjects(selectList);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setLoading(false);
    };

    const getCycle = async () => {
      try {
        const response = await salaryApi.getMostRecent();
        if (response.success) {
          const data = response.data.message;
          if (!isEmpty(data)) {
            setCycle(data[0]);
            if (data[0].status !== "ongoing") {
              setDisabled(true);
            }
          }
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
    };

    getCycle();
    getProjects();
  }, []);

  return (
    <Modal>
      <div className="p-5 bg-white rounded-lg w-1/3">
        <div className="flex justify-between items-center mb-10">
          <div className="text-xl font-bold">Tạo báo cáo lương mới</div>
          <div
            className="text-red-500 p-1 rounded-full hover:bg-red-500/10 cursor-pointer"
            onClick={props.closeModal}
          >
            <AiOutlineClose />
          </div>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="mb-10">
              <div className="mb-5">
                <div className="mb-3 text-primary font-bold text-sm">
                  Tên dự án
                </div>
                {!isEmpty(projects) ? (
                  <div>
                    <SelectSimple options={projects} onChange={getProject} />
                  </div>
                ) : (
                  <>
                    <div className="text-sm px-3 text-purple font-bold">
                      Không có dự án quản lý
                    </div>
                  </>
                )}
              </div>
              <div className="mb-5">
                <div className="mb-3 text-primary font-bold text-sm">
                  Chu kỳ lương hiện tại
                </div>
                <div className="p-3 font-bold text-purple">
                  {!isEmpty(cycle) ? (
                    <>
                      {toDate(cycle.startedAt)} -{" "}
                      <span style={{ color: textToColor(cycle.status) }}>
                        {toVN(cycle.status)}
                      </span>
                    </>
                  ) : (
                    <div className="text-sm">
                      Hiện tại không có kỳ lương nào
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                <ButtonCancel
                  type="trans"
                  text="Hủy bỏ"
                  onClick={props.closeModal}
                />
              </div>
              <div>
                <Button
                  text="Tiếp theo"
                  onClick={createReport}
                  disabled={disabled}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default AddReportModal;
