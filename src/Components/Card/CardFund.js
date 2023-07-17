import { BsArrowRight } from "react-icons/bs";
import { GiTwoCoins } from "react-icons/gi";

const CardFund = (props) => {
  return (
    <div className="bg-white rounded-lg shadow-md w-full p-5 font-bold content-middle text-xl flex flex-col justify-center">
      <div className="flex gap-5 items-center mb-5">
        <div>{props.title}</div>
        <div className="text-2xl">
          <BsArrowRight />
        </div>
      </div>
      <div className="text-sm">Tổng point</div>
      <div className="text-yellow-500 text-2xl mt-1 flex items-center gap-2">
        <div>{props.coin}</div>
        <div>
          <GiTwoCoins />
        </div>
      </div>
      <div className="mt-10 bg-green rounded-lg h-32">
        <div className="w-full h-full rounded-lg hover:bg-white/30 hover:backdrop-blur-sm hover:rotate-25 transition-all p-2 text-white font-bold">
          <div className="mb-2">UniFund</div>
          <div className="mb-2">Quỹ point phúc lợi</div>
          <div className="text-xs font-normal">Một sản phẩm của</div>
          <div className="text-sm">Uni Incubator</div>
        </div>
      </div>
    </div>
  );
};

export default CardFund;
