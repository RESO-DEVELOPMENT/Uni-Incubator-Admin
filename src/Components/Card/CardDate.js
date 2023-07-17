import { FaRegCalendarAlt } from "react-icons/fa";
import Loading from "../Loading/Loading";
import { toDate } from "./../../Ultilities/Date";
import { textToColor, toVN } from "../../Ultilities/String";
import { isEmpty } from "lodash";

const CardDate = (props) => {
  return (
    <div className="bg-white rounded-lg shadow-md w-full h-40 p-5 font-bold content-middle text-xl flex flex-col justify-center">
      <div className="flex gap-2 items-center mb-3">
        <div>{props.title}</div>
        <div className="text-2xl">
          <FaRegCalendarAlt />
        </div>
      </div>
      {props.loading ? (
        <Loading />
      ) : (
        <>
          {!isEmpty(props.date) ? (
            <>
              <div className="text-green">{toDate(props.date.createdAt)}</div>
              <div className="text-gray-700 text-sm mb-3">
                Bắt đầu từ ngày {toDate(props.date.startedAt)}
              </div>
              <div className="text-gray-700 text-sm">
                Trạng thái:{" "}
                <span style={{ color: textToColor(props.date.status) }}>
                  {toVN(props.date.status)}
                </span>
              </div>
            </>
          ) : (
            <div className="text-sm text-green">Không có kỳ lương hiện tại</div>
          )}
        </>
      )}
    </div>
  );
};

export default CardDate;
