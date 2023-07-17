import { AiFillGift, AiOutlineClose, AiOutlineFilter } from "react-icons/ai";
import Modal from "../../../Components/Modal/Modal";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BiTimeFive } from "react-icons/bi";
import { toDate } from "../../../Ultilities/Date";
import { GiTwoCoins } from "react-icons/gi";
import ButtonCancel from "../../../Components/Button/ButtonCancel";
import Button from "../../../Components/Button/Button";
import Loading from "../../../Components/Loading/Loading";
import { toVN } from "../../../Ultilities/String";

const VoucherDetailModal = (props) => {
  return (
    <Modal>
      <div className="w-2/5 bg-white rounded-lg p-5">
        <div className="flex justify-between mb-10">
          <div className="font-bold text-xl">Thông tin voucher</div>
          <div
            className="text-red-500 hover:bg-red-500/10 cursor-pointer p-1 rounded-full h-fit"
            onClick={props.closeModal}
          >
            <AiOutlineClose />
          </div>
        </div>
        {props.loading ? (
          <Loading />
        ) : (
          <>
            <div className="relative overflow-hidden mb-10">
              <div className="absolute top-0 left-4 w-fit flex -translate-y-1/2">
                <div className="w-5 h-5 rounded-full border-4 bg-white border-green"></div>
                <div className="w-5 h-5 rounded-full border-4 bg-white border-green"></div>
                <div className="w-5 h-5 rounded-full border-4 bg-white border-green"></div>
                <div className="w-5 h-5 rounded-full border-4 bg-white border-green"></div>
                <div className="w-5 h-5 rounded-full border-4 bg-white border-green"></div>
                <div className="w-5 h-5 rounded-full border-4 bg-white border-green"></div>
                <div className="w-5 h-5 rounded-full border-4 bg-white border-green"></div>
                <div className="w-5 h-5 rounded-full border-4 bg-white border-green"></div>
                <div className="w-5 h-5 rounded-full border-4 bg-white border-green"></div>
                <div className="w-5 h-5 rounded-full border-4 bg-white border-green"></div>
                <div className="w-5 h-5 rounded-full border-4 bg-white border-green"></div>
                <div className="w-5 h-5 rounded-full border-4 bg-white border-green"></div>
                <div className="w-5 h-5 rounded-full border-4 bg-white border-green"></div>
                <div className="w-5 h-5 rounded-full border-4 bg-white border-green"></div>
                <div className="w-5 h-5 rounded-full border-4 bg-white border-green"></div>
              </div>
              <div className="absolute bottom-0 left-4 w-fit flex translate-y-1/2">
                <div className="w-5 h-5 rounded-full border-4 bg-white border-green"></div>
                <div className="w-5 h-5 rounded-full border-4 bg-white border-green"></div>
                <div className="w-5 h-5 rounded-full border-4 bg-white border-green"></div>
                <div className="w-5 h-5 rounded-full border-4 bg-white border-green"></div>
                <div className="w-5 h-5 rounded-full border-4 bg-white border-green"></div>
                <div className="w-5 h-5 rounded-full border-4 bg-white border-green"></div>
                <div className="w-5 h-5 rounded-full border-4 bg-white border-green"></div>
                <div className="w-5 h-5 rounded-full border-4 bg-white border-green"></div>
                <div className="w-5 h-5 rounded-full border-4 bg-white border-green"></div>
                <div className="w-5 h-5 rounded-full border-4 bg-white border-green"></div>
                <div className="w-5 h-5 rounded-full border-4 bg-white border-green"></div>
                <div className="w-5 h-5 rounded-full border-4 bg-white border-green"></div>
                <div className="w-5 h-5 rounded-full border-4 bg-white border-green"></div>
                <div className="w-5 h-5 rounded-full border-4 bg-white border-green"></div>
                <div className="w-5 h-5 rounded-full border-4 bg-white border-green"></div>
              </div>
              <div className="absolute w-20 h-20 right-0 top-1/2 translate-x-1/2 -translate-y-1/2 border-double border-4 border-green rounded-full bg-white"></div>
              <div className="border-4 border-green py-3 px-2 rounded-lg grid grid-cols-5 gap-2">
                <div className="col-span-3 font-bold border-dashed border-r-4 border-green flex flex-col justify-center">
                  <div className="text-green text-center text-lg mb-5">
                    {props.voucher.voucherName}
                  </div>
                  <div className="text-primary text-center px-10 mb-5">
                    {props.voucher.voucherDescription}
                  </div>
                  <div className="flex items-center justify-center text-primary gap-1 mb-1">
                    <div>
                      <HiOutlineLocationMarker />
                    </div>
                    <div>
                      Cung cấp bởi{" "}
                      <span className="text-green">
                        {props.voucher.supplier?.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center text-primary gap-1 mb-1">
                    <div>
                      <AiOutlineFilter />
                    </div>
                    <div>
                      Loại:{" "}
                      <span className="text-green">
                        {toVN(props.voucher.voucherType)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center text-primary gap-1">
                    <div>
                      <BiTimeFive />
                    </div>
                    <div>
                      Ngày tạo:{" "}
                      <span className="text-green">
                        {toDate(props.voucher.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 border-4 border-green rounded-l-lg">
                  <div className="flex justify-between items-center px-2">
                    <div className="flex gap-1 items-center font-bold">
                      <div className="text-green">
                        {props.voucher.voucherAmount}
                      </div>
                      <div className="text-yellow-500 text-lg">
                        <AiFillGift />
                      </div>
                    </div>
                    <div className="flex gap-1 items-center font-bold text-yellow-500">
                      <div>{props.voucher.voucherCost}</div>
                      <div className="text-lg">
                        <GiTwoCoins />
                      </div>
                    </div>
                  </div>
                  <div>
                    <img
                      className="w-full rounded-bl-lg"
                      src={props.voucher.imageUrl}
                      alt="img"
                    />
                  </div>
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
                  type="trans"
                  text="Chỉnh sửa"
                  onClick={props.updateVoucher}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default VoucherDetailModal;
