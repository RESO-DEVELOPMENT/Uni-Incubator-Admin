import { AiOutlineBarChart, AiOutlineCheck } from "react-icons/ai";
import Loading from "../Loading/Loading";

const CardProjectCount = (props) => {
  return (
    <div className="bg-white rounded-lg shadow-md w-full p-5 font-bold content-middle text-xl flex flex-col justify-center h-64">
      <div className="text-center mb-3">
        <div>{props.title}</div>
      </div>
      {props.loading ? (
        <Loading />
      ) : (
        <div>
          <div className="flex p-3 bg-purple/20 rounded-md gap-3">
            <div className="p-3 rounded-md flex items-center justify-center text-2xl bg-purple text-white">
              <AiOutlineBarChart />
            </div>
            <div>
              <div className="text-lg">Tổng cộng</div>
              <div className="font-normal text-sm">{props.total}</div>
            </div>
          </div>
          <div className="py-2"></div>
          <div className="flex p-3 bg-green/20 rounded-md gap-3">
            <div className="p-3 rounded-md flex items-center justify-center text-2xl bg-green text-white">
              <AiOutlineCheck />
            </div>
            <div>
              <div className="text-lg">Đã hoàn thành</div>
              <div className="font-normal text-sm">{props.ended}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardProjectCount;
