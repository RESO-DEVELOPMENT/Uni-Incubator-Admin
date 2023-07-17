import Modal from "../../../Components/Modal/Modal";
import TextInputSimple from "../../../Components/Input/TextInputSimple";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import {
  find,
  isEmpty,
  isNil,
  isString,
  last,
  omitBy,
  split,
  toNumber,
} from "lodash";
import NumberInput from "../../../Components/Input/NumberInput";
import TextAreaSimple from "../../../Components/Input/TextAreaSimple";
import Button from "../../../Components/Button/Button";
import ButtonCancel from "../../../Components/Button/ButtonCancel";
import ImageInput from "../../../Components/Input/ImageInput";
import ToastError from "../../../Components/Alert/ToastError";
import voucherApi from "../../../API/Voucher/voucherApi";
import ToastSuccess from "../../../Components/Alert/ToastSuccess";
import Loading from "../../../Components/Loading/Loading";
import SelectSimple from "../../../Components/Select/SelectSimple";

const VoucherUpdateModal = (props) => {
  const [voucher, setVoucher] = useState({
    voucherId: props.voucher.voucherId,
    voucherName: props.voucher.voucherName,
    voucherDescription: props.voucher.voucherDescription,
    voucherCost: props.voucher.voucherCost,
    voucherAmount: props.voucher.voucherAmount,
    supplierId: props.voucher.supplier.supplierId,
    voucherType: props.voucher.voucherType,
    imageAsBase64: "",
  });
  const [base64Image, setBase64Image] = useState(props.voucher.imageUrl);

  const [loading, setLoading] = useState(false);

  const getVoucher = (e) => {
    const { name, value } = e.target;
    if (name === "voucherCost" && isNaN(toNumber(value))) {
      return;
    }
    if (name === "voucherAmount" && isNaN(toNumber(value))) {
      return;
    }
    setVoucher((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const getVoucherSupplier = (data) => {
    setVoucher((prev) => ({ ...prev, supplierId: data.value }));
  };

  const getVoucherType = (data) => {
    setVoucher((prev) => ({ ...prev, voucherType: data.value }));
  };

  const increaseStepCost = () => {
    setVoucher((prev) => {
      return {
        ...prev,
        voucherCost: toNumber(voucher.voucherCost) + 100,
      };
    });
  };

  const increaseStepAmount = () => {
    setVoucher((prev) => {
      return {
        ...prev,
        voucherAmount: toNumber(voucher.voucherAmount) + 1,
      };
    });
  };

  const getImageUrl = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setBase64Image(reader.result);
      setVoucher((prev) => {
        return {
          ...prev,
          imageAsBase64: last(split(reader.result, ",")),
        };
      });
    };

    reader.readAsDataURL(file);
  };

  const updateVoucher = async () => {
    setLoading(true);
    if (voucher.voucherAmount === 0) {
      ToastError({ text: "Số lượng phải >= 1" });
      return;
    }
    if (voucher.voucherCost === 0) {
      ToastError({ text: "Giá phải >= 1" });
      return;
    }
    try {
      const response = await voucherApi.updateVoucher(
        omitBy(
          voucher,
          (value) => isNil(value) || (isString(value) && isEmpty(value.trim()))
        )
      );
      if (response.success) {
        ToastSuccess({ text: "Cập nhật voucher thành công" });
        props.updateSuccess(response.data.message);
        props.activeReload();
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
    setLoading(false);
  };

  return (
    <Modal overflow={loading ? false : true}>
      <div className="w-96 p-5 bg-white rounded-lg">
        <div className="flex justify-between mb-5">
          <div className="font-bold text-xl">Thông tin voucher</div>
          <div
            className="text-red-500 hover:bg-red-500/10 cursor-pointer p-1 rounded-full"
            onClick={props.closeModal}
          >
            <AiOutlineClose />
          </div>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <div>
            <div className="mb-5 flex justify-center">
              <ImageInput
                imageUrl={
                  base64Image
                    ? base64Image
                    : `https://ui-avatars.com/api/?name=${voucher.voucherName}&length=1&background=30BC97&color=FFFFFF`
                }
                imageClassName="w-24 h-24 rounded-full"
                onChange={getImageUrl}
              />
            </div>
            <div className="mb-5">
              <div className="font-bold mb-2">Tên voucher</div>
              <div>
                <TextInputSimple
                  placeholder="Ví dụ: [Passio] Giảm giá 5%"
                  name="voucherName"
                  value={voucher.voucherName}
                  onChange={getVoucher}
                />
              </div>
            </div>
            <div className="mb-5 grid grid-cols-2 gap-5">
              <div>
                <div className="font-bold mb-2">Giá</div>
                <div>
                  <NumberInput
                    placeholder="Ví dụ: 1,000"
                    name="voucherCost"
                    value={voucher.voucherCost}
                    onChange={getVoucher}
                    increaseButton={true}
                    increaseStep={increaseStepCost}
                  />
                </div>
              </div>
              <div>
                <div className="font-bold mb-2">Số lượng</div>
                <div>
                  <NumberInput
                    placeholder="Ví dụ: 1,000"
                    name="voucherAmount"
                    value={voucher.voucherAmount}
                    onChange={getVoucher}
                    increaseButton={true}
                    increaseStep={increaseStepAmount}
                  />
                </div>
              </div>
            </div>
            <div className="mb-5">
              <div className="font-bold mb-2">Nhà cung cấp</div>
              <div>
                <SelectSimple
                  options={props.suppliers}
                  defaultValue={find(props.suppliers, {
                    value: voucher.supplierId,
                  })}
                  onChange={getVoucherSupplier}
                />
              </div>
            </div>
            <div className="mb-5">
              <div className="font-bold mb-2">Loại</div>
              <div>
                <SelectSimple
                  options={props.types}
                  defaultValue={find(props.types, {
                    value: voucher.voucherType,
                  })}
                  onChange={getVoucherType}
                />
              </div>
            </div>
            <div className="w-full mb-10">
              <div className="mb-2 font-bold text-gray">Mô tả</div>
              <div>
                <TextAreaSimple
                  name="voucherDescription"
                  value={voucher.voucherDescription}
                  placeholder="Đây là mô tả voucher"
                  onChange={getVoucher}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                <ButtonCancel
                  text="Hủy bỏ"
                  type="trans"
                  onClick={props.closeModal}
                />
              </div>
              <div>
                <Button text="Hoàn tất" onClick={updateVoucher} />
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default VoucherUpdateModal;
