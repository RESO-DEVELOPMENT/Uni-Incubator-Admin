import { AiOutlineClose } from "react-icons/ai";
import Modal from "../../../Components/Modal/Modal";
import { useState } from "react";
import TextInputSimple from "./../../../Components/Input/TextInputSimple";
import Button from "./../../../Components/Button/Button";
import ButtonCancel from "./../../../Components/Button/ButtonCancel";
import SelectSimpleDot from "../../../Components/Select/SelectSimpleDot";
import TextAreaSimple from "../../../Components/Input/TextAreaSimple";
import ImageInput from "../../../Components/Input/ImageInput";
import { isEmpty, last, pickBy, split } from "lodash";
import Loading from "../../../Components/Loading/Loading";

const AddSponsorModal = (props) => {
  const [disabled, setDisabled] = useState(true);
  const [types] = useState([
    { value: "personal", label: "Cá nhân", color: "#eab308" },
    { value: "organization", label: "Tổ chức", color: "#f97316" },
    { value: "bussiness ", label: "Doanh nghiệp", color: "#a855f7" },
  ]);

  const [sponsor, setSponsor] = useState({
    sponsorName: "",
    sponsorDescription: "",
    type: undefined,
    imageAsBase64: "",
  });
  const [base64Image, setBase64Image] = useState("");
  const [error, setError] = useState({
    sponsorName: "",
    sponsorDescription: "",
    type: "",
  });

  const getSponsorData = (e) => {
    const { name, value } = e.target;
    setSponsor((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
    setError((prev) => {
      return {
        ...prev,
        [name]: "",
      };
    });
    setDisabled(false);
  };

  const getImageUrl = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setBase64Image(reader.result);
      setSponsor((prev) => {
        return {
          ...prev,
          imageAsBase64: last(split(reader.result, ",")),
        };
      });
    };

    reader.readAsDataURL(file);
  };

  const getTypeFilter = (type) => {
    if (type) {
      setSponsor((prev) => {
        return {
          ...prev,
          type: type.value,
        };
      });
      setError((prev) => {
        return {
          ...prev,
          type: "",
        };
      });
      setDisabled(false);
    } else {
      setSponsor((prev) => {
        return {
          ...prev,
          type: undefined,
        };
      });
      setError((prev) => {
        return {
          ...prev,
          type: "*",
        };
      });
      setDisabled(true);
    }
  };

  const createSponsor = () => {
    const nullUndefinedEmpty = pickBy(
      {
        sponsorDescription: sponsor.sponsorDescription,
        sponsorName: sponsor.sponsorName,
        type: sponsor.type,
      },
      (value) => {
        return isEmpty(value);
      }
    );
    if (!isEmpty(nullUndefinedEmpty)) {
      for (const key in nullUndefinedEmpty) {
        setError((prev) => {
          return {
            ...prev,
            [key]: "*",
          };
        });
      }
      setDisabled(true);
      return;
    }
    props.addSponsor(sponsor);
  };

  return (
    <Modal>
      <div className="rounded-lg shadow-md bg-white p-5">
        <div className="flex justify-between items-center w-80 mb-5">
          <div className="font-bold text-lg">Tạo nhà tài trợ mới</div>
          <div
            className="text-red-500 font-bold text-lg cursor-pointer rounded-full hover:bg-red-500/20 p-1"
            onClick={props.onCloseAddModal}
          >
            <AiOutlineClose />
          </div>
        </div>
        {props.loading ? (
          <Loading />
        ) : (
          <div>
            <div className="mb-5 flex flex-col items-center">
              <div className="mb-3">
                <ImageInput
                  imageUrl={
                    base64Image
                      ? base64Image
                      : `https://ui-avatars.com/api/?name=${sponsor.sponsorName}&length=1&background=30BC97&color=FFFFFF`
                  }
                  imageClassName="w-24 h-24 rounded-full"
                  onChange={getImageUrl}
                />
              </div>
              <div className="font-bold text-lg text-center">
                {sponsor.sponsorName ? sponsor.sponsorName : "Họ và tên"}
              </div>
            </div>
            <div className="mb-5">
              <div className="mb-3 text-primary font-bold text-sm">
                Tên nhà tài trợ
              </div>
              <TextInputSimple
                value={sponsor.sponsorName}
                name="sponsorName"
                onChange={getSponsorData}
                placeholder="Nhập họ và tên"
                error={error.sponsorName}
              />
            </div>
            <div className="mb-5">
              <div className="mb-3 text-primary font-bold text-sm">
                Loại tài trợ
              </div>
              <SelectSimpleDot
                placeholder="Chọn loại tài trợ"
                options={types}
                onChange={getTypeFilter}
                error={error.type}
              />
            </div>
            <div className="mb-10">
              <div className="mb-3 text-primary font-bold text-sm">Mô tả</div>
              <TextAreaSimple
                name="sponsorDescription"
                value={sponsor.sponsorDescription}
                placeholder="Thêm mô tả cho nhà tài trợ"
                rows={5}
                onChange={getSponsorData}
                error={error.sponsorDescription}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <ButtonCancel
                  type="trans"
                  text="Hủy bỏ"
                  font="font-normal"
                  onClick={props.onCloseAddModal}
                />
              </div>
              <div>
                <Button
                  text="Hoàn tất"
                  font="font-normal"
                  onClick={createSponsor}
                  disabled={disabled}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AddSponsorModal;
