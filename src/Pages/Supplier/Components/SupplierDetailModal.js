import { AiOutlineClose } from "react-icons/ai";
import Modal from "../../../Components/Modal/Modal";
import TextAreaSimple from "../../../Components/Input/TextAreaSimple";
import Loading from "../../../Components/Loading/Loading";
import TextInputSimple from "../../../Components/Input/TextInputSimple";
import SelectSimpleDot from "../../../Components/Select/SelectSimpleDot";
import { find } from "lodash";
import ButtonCancel from "../../../Components/Button/ButtonCancel";
import Button from "../../../Components/Button/Button";

const SupplierDetailModal = (props) => {
  return (
    <Modal>
      <div className="bg-white rounded-lg p-5 w-96">
        <div className="flex justify-between items-center mb-5">
          <div className="font-bold text-lg">Thông tin nhà cung cấp</div>
          <div
            className="text-red-500 font-bold text-lg cursor-pointer rounded-full hover:bg-red-500/20 p-1"
            onClick={props.onCloseModal}
          >
            <AiOutlineClose />
          </div>
        </div>
        {props.loading ? (
          <Loading />
        ) : (
          <div>
            <div className="mb-10">
              <div className="mb-5">
                <div className="mb-3 text-primary font-bold text-sm">
                  Nhà cung cấp
                </div>
                <TextInputSimple
                  value={props.supplier.name}
                  name="name"
                  onChange={props.getSupplierData}
                  placeholder="Nhập tên nhà tài trợ"
                />
              </div>
              <div className="mb-5">
                <div className="mb-3 text-primary font-bold text-sm">
                  Trạng thái
                </div>
                <SelectSimpleDot
                  placeholder="Chọn loại tài trợ"
                  options={props.statusOptions}
                  defaultValue={find(props.statusOptions, {
                    value: props.supplier.status,
                  })}
                  onChange={props.getSupplierStatusFromSelect}
                />
              </div>
              <div className="mb-5">
                <div className="mb-3 text-primary font-bold text-sm">Mô tả</div>
                <TextAreaSimple
                  name="description"
                  value={props.supplier.description}
                  placeholder="Thêm mô tả cho nhà cung cấp"
                  rows={5}
                  onChange={props.getSupplierData}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <ButtonCancel
                  type="trans"
                  text="Hủy bỏ"
                  font="font-normal"
                  onClick={props.onCloseModal}
                />
              </div>
              <div>
                <Button
                  text="Hoàn tất"
                  font="font-normal"
                  onClick={props.updateSupplier}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SupplierDetailModal;
