import { AiOutlineClose } from "react-icons/ai";
import Modal from "../../../Components/Modal/Modal";
import TaskTable from "../../../Components/Table/TaskTable";
import { IoMdAdd } from "react-icons/io";
import { useState } from "react";
import { isEmpty, size } from "lodash";
import { BsCheckSquareFill } from "react-icons/bs";

const TaskDetailModal = (props) => {
  const [edit, setEdit] = useState(false);

  return (
    <Modal
      overflow={size(props.tasks) >= 10 || (edit && size(props.tasks) > 7)}
    >
      <div className="w-3/4 bg-white p-5 rounded-lg">
        <div className="flex justify-between items-center mb-10">
          <div className="text-xl font-bold">Thông tin công việc</div>
          <div
            className="text-red-500 p-1 rounded-full hover:bg-red-500/10 cursor-pointer"
            onClick={props.closeModal}
          >
            <AiOutlineClose />
          </div>
        </div>
        <div>
          <div className={props.report.status === "drafted" ? "mb-10" : ""}>
            {props.allowEdit && !isEmpty(props.tasks) && props.report.status === "drafted" && (
              <div
                className="flex items-center gap-2 text-green font-bold cursor-pointer select-none w-fit mb-2"
                onClick={() => setEdit(!edit)}
              >
                {!edit ? (
                  <div
                    className="w-3 h-3 border border-green rounded-sm"
                    onClick={() => setEdit(true)}
                  ></div>
                ) : (
                  <BsCheckSquareFill
                    className="animate-custom-ping"
                    onClick={() => setEdit(false)}
                  />
                )}
                <div>Chỉnh sửa</div>
              </div>
            )}
            <TaskTable
              tasks={props.tasks}
              onChange={props.getChangeData}
              getTaskEffort={props.getTaskEffort}
              increasePoint={props.increasePoint}
              increaseHour={props.increaseHour}
              removeRow={props.removeRow}
              edit={edit}
              error={props.error}
              closeTask={() => {
                setEdit(false);
              }}
            />
            {props.allowEdit && props.report.status === "drafted" && (
              <div className="mt-5 flex justify-center cursor-pointer">
                <div
                  className="w-fit flex items-center gap-2 text-green font-bold"
                  onClick={() => {
                    setEdit(true);
                    props.addMoreRow();
                  }}
                >
                  <div className="p-1 rounded-md cursor-pointer bg-green/20 hover:shadow-md">
                    <IoMdAdd />
                  </div>
                  <div className="hover:underline">Thêm dòng mới</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetailModal;
