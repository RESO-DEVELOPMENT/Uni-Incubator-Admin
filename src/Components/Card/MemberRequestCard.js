import { BiTime } from "react-icons/bi";
import { BsFillTreeFill, BsCheckSquareFill, BsSquare } from "react-icons/bs";
import { toDateWithTime } from "../../Ultilities/Date";
import { useState } from "react";
import Button from "../Button/Button";
import ButtonCancel from "../Button/ButtonCancel";

const MemberRequestCard = (props) => {
  const [selected, setSelected] = useState(props.isSelected);
  return (
    <div
      className={`relative rounded-lg px-2 py-3 shadow-md border border-slate-100 flex flex-col justify-between select-none ${
        selected ? "bg-green/10" : "bg-white"
      }`}
    >
      <div className="absolute right-1 top-1">
        {selected ? (
          <BsCheckSquareFill
            className="text-green cursor-pointer"
            onClick={() => {
              setSelected(false);
              props.getSelectedRequest();
            }}
          />
        ) : (
          <BsSquare
            className="text-green cursor-pointer"
            onClick={() => {
              setSelected(true);
              props.getSelectedRequest();
            }}
          />
        )}
      </div>
      <div>
        <div className="grid grid-cols-4 mb-5">
          <div className="flex justify-center items-center">
            <img
              className="w-14 h-14 rounded-full"
              src={
                props.request.member.imageUrl
                  ? props.request.member.imageUrl
                  : `https://ui-avatars.com/api/?name=${props.request.member.fullName}&length=1&background=30BC97&color=FFFFFF`
              }
              alt="avatar"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="col-span-3">
            <div className="font-bold">{props.request.member.fullName}</div>
            <div className="text-sm text-primary mb-1">
              {props.request.member.emailAddress}
            </div>
            <div className="text-sm font-bold py-px px-3 bg-orange-200 w-fit rounded-md">
              {props.request.major}
            </div>
          </div>
        </div>
        <div className="mb-5">
          <div className="flex items-center gap-2 text-green">
            <div className="text-xl">
              <BsFillTreeFill />
            </div>
            <div>{props.request.member.memberLevels.level.levelName}</div>
          </div>
        </div>
        <div className="mb-5">
          <div className="font-bold text-lg mb-3">Lý do muốn gia nhập</div>
          <div className="text-sm font-bold text-black/60 tracking-wide mb-3">
            {props.request.note}
          </div>
          <div className="flex items-center gap-2 text-black/60 text-sm">
            <div className="text-xl">
              <BiTime />
            </div>
            <div>
              Yêu cầu gia nhập vào:{" "}
              <span className="text-green">
                {toDateWithTime(props.request.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <ButtonCancel type="trans" text="Từ chối" onClick={props.cancel}/>
        </div>
        <div>
          <Button text="Chấp nhận" onClick={props.confirm} />
        </div>
      </div>
    </div>
  );
};

export default MemberRequestCard;
