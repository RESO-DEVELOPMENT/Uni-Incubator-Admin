import { BsThreeDots, BsBook } from "react-icons/bs";
import { MdOutlineFileCopy } from "react-icons/md";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { toDate } from "./../../Ultilities/Date";
import { find, isEmpty, last, split } from "lodash";

const CardProjectStatistic = (props) => {
  const [openMenu, setOpenMenu] = useState(false);

  const ref = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    const onBodyClick = (event) => {
      if (ref.current && ref.current.contains(event.target)) {
        return;
      }
      setOpenMenu(false);
    };

    document.body.addEventListener("click", onBodyClick);

    return () => {
      document.body.removeEventListener("click", onBodyClick);
    };
  }, []);

  return (
    <div className="relative shadow-md rounded-md bg-slate-100 p-5">
      <div
        className={`absolute top-0 left-2 p-1 -translate-y-1/2 font-bold text-white text-sm rounded-md ${
          props.progress === 25
            ? "bg-per-25"
            : props.progress === 50
            ? "bg-per-50"
            : props.progress === 100
            ? "bg-green"
            : "bg-red-500"
        }`}
      >
        {props.project.projectShortName}
      </div>
      <div
        className="absolute top-1 right-2 cursor-pointer hover:bg-slate-200 px-1 rounded-sm"
        onClick={() => setOpenMenu(!openMenu)}
        ref={ref}
      >
        <BsThreeDots />
      </div>
      {openMenu && (
        <div className="absolute top-5 right-2 rounded-lg bg-white shadow-md cursor-pointer font-bold text-sm w-28 p-1">
          <div className="hover:bg-green/20 hover:text-green p-2 flex items-center gap-2 relative rounded-lg">
            <BsBook />
            <div>Chi tiết</div>
            <div
              className="absolute w-full h-full"
              onClick={() => navigate(`/projects/${props.project.projectId}`)}
            ></div>
          </div>
          <div className="hover:bg-green/20 hover:text-green p-2 flex items-center gap-2 relative rounded-lg">
            <AiOutlineEdit />
            <div>Chỉnh sửa</div>
            <div
              className="absolute w-full h-full"
              // onClick={() => navigate("/project/id/edit")}
            ></div>
          </div>
        </div>
      )}
      <div
        className="hover:text-green cursor-pointer w-56"
        onClick={() => navigate(`/projects/${props.project.projectId}`)}
      >
        <div className="text-xl font-bold truncate mt-2">
          {props.project.projectName}
        </div>
        <div className="mb-5 truncate text-sm text-black/70 font-bold">
          Ngày tạo: {toDate(props.project.createdAt)}
        </div>
      </div>
      <div className="flex mb-5 items-center justify-between w-56">
        <div className="px-3 py-1 truncate font-bold bg-green/20 rounded-md text-green text-sm text-center w-2/3">
          {find(props.project.members, { role: "manager" }).member.fullName}
        </div>
        <div className="flex -space-x-4">
          {props.project.members.map((member, index) => {
            if (index < 3) {
              return (
                <img
                  key={member.member.memberId}
                  className="w-7 h-7 rounded-full"
                  src={
                    member.member.imageUrl
                      ? member.member.imageUrl
                      : `https://ui-avatars.com/api/?name=${member.member.fullName}&length=1`
                  }
                  alt="a"
                />
              );
            } else if (index === 3) {
              return (
                <div className="w-7 h-7 rounded-full bg-orange-600 flex items-center justify-center text-xs font-normal text-white">
                  {`+${props.project.members.length - 5}`}
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
      </div>
      <div
        className={`rounded-md bg-orange-300/30 text-xs font-bold flex items-center gap-1 py-1 px-3 w-56 ${
          !isEmpty(props.project.projectFiles) &&
          "cursor-pointer hover:underline"
        }`}
        onClick={() => {
          if (!isEmpty(props.project.projectFiles)) {
            window.open(props.project.projectFiles[0].file.directUrl, "_blank");
          }
        }}
      >
        <div>
          <MdOutlineFileCopy />
        </div>
        <div className="truncate">
          {!isEmpty(props.project.projectFiles)
            ? last(split(props.project.projectFiles[0].file.directUrl, "/"))
            : "Không có tập tin"}
        </div>
      </div>
    </div>
  );
};

export default CardProjectStatistic;
