import Modal from "./Modal";
import { CircularProgressbar } from "react-circular-progressbar";

const ProgressModal = (props) => {
  return (
    <Modal>
      <div className="w-80 text-center rounded-lg shadow-md bg-white p-5">
        <div className="font-bold mb-5">
          {props.text} <span className="animate-pulse">...</span>
        </div>
        <div className="w-full flex justify-center mb-5">
          <CircularProgressbar
            className="w-20 h-20"
            value={props.value}
            maxValue={100}
            text={`${props.value}%`}
            styles={{
              path: {
                stroke: "#30BC97",
              },
              text: {
                fill: `black`,
                fontWeight: `bold`,
              },
            }}
          />
        </div>
        <div className="font-bold animate-pulse">Vui lòng đợi một chút</div>
      </div>
    </Modal>
  );
};

export default ProgressModal;
