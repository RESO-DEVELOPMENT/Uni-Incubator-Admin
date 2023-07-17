import { AiOutlineClose } from "react-icons/ai";
import Modal from "../../../Components/Modal/Modal";
import { useState } from "react";
import TextInputSimple from "./../../../Components/Input/TextInputSimple";
import Button from "./../../../Components/Button/Button";
import ButtonCancel from "./../../../Components/Button/ButtonCancel";
import SelectSimpleDot from "../../../Components/Select/SelectSimpleDot";
import TextAreaSimple from "../../../Components/Input/TextAreaSimple";
import ImageInput from "../../../Components/Input/ImageInput";
import { find, isEmpty } from "lodash";
import Loading from "../../../Components/Loading/Loading";
import { useNavigate } from "react-router-dom";

const DetailSponsorModal = (props) => {
  const navigate = useNavigate();

  const [types] = useState([
    { value: "personal", label: "Cá nhân", color: "#eab308" },
    { value: "organization", label: "Tổ chức", color: "#f97316" },
    { value: "bussiness", label: "Doanh nghiệp", color: "#a855f7" },
  ]);

  const [status] = useState([
    { value: "active", label: "Còn hoạt động", color: "#30BC97" },
    { value: "inactive", label: "Ngừng hoạt động", color: "#ef4444" },
  ]);
  return (
    <Modal overflow={!props.loading}>
      <div className="rounded-lg shadow-md bg-white p-5 w-1/4">
        <div className="flex justify-between items-center mb-5">
          <div className="font-bold text-lg">Thông tin nhà tài trợ</div>
          <div
            className="text-red-500 font-bold text-lg cursor-pointer rounded-full hover:bg-red-500/20 p-1"
            onClick={props.onCloseDetailModal}
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
                    props.sponsor.imageUrl
                      ? props.sponsor.imageUrl
                      : `https://ui-avatars.com/api/?name=${props.sponsor.sponsorName}&length=1&background=30BC97&color=FFFFFF`
                  }
                  imageClassName="w-20 h-20 rounded-full"
                  onChange={props.getImageUrl}
                />
              </div>
              <div className="font-bold text-lg text-center">
                {props.sponsor.sponsorName
                  ? props.sponsor.sponsorName
                  : "Họ và tên"}
              </div>
            </div>
            <div className="mb-5">
              <div className="mb-3 text-primary font-bold text-sm">
                Tên nhà tài trợ
              </div>
              <TextInputSimple
                value={props.sponsor.sponsorName}
                name="sponsorName"
                onChange={props.getSponsorData}
                placeholder="Nhập họ và tên"
                error={props.error.sponsorName}
              />
            </div>
            <div className="mb-5">
              <div className="mb-3 text-primary font-bold text-sm">
                Loại tài trợ
              </div>
              <SelectSimpleDot
                placeholder="Chọn loại tài trợ"
                options={types}
                defaultValue={find(types, { value: props.sponsor.type })}
                onChange={props.getTypeFilter}
                error={props.error.type}
              />
            </div>
            <div className="mb-5">
              <div className="mb-3 text-primary font-bold text-sm">
                Các dự án tài trợ
              </div>
              {props.projectLoading ? (
                <Loading />
              ) : (
                <div className="grid grid-cols-4 gap-1">
                  {!isEmpty(props.sponsorProjects) ? (
                    props.sponsorProjects.map((item) => {
                      return (
                        <div
                          onClick={() =>
                            navigate(`/projects/${item.projectId}`)
                          }
                          className="rounded-full bg-green/30 text-green text-xs px-2 py-1 w-20 text-center truncate cursor-pointer hover:underline"
                        >
                          {item.projectName}
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-4 text-center text-sm">
                      Không có dự án nào
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="mb-5">
              <div className="mb-3 text-primary font-bold text-sm">
                Trạng thái hoạt động
              </div>
              <SelectSimpleDot
                placeholder="Chọn trạng thái"
                options={status}
                defaultValue={find(status, {
                  value: props.sponsor.sponsorStatus,
                })}
                onChange={props.getStatusFilter}
                error={props.error.sponsorStatus}
              />
            </div>
            <div className="mb-5">
              <div className="mb-3 text-primary font-bold text-sm">Mô tả</div>
              <TextAreaSimple
                name="sponsorDescription"
                value={props.sponsor.sponsorDescription}
                placeholder="Thêm mô tả cho nhà tài trợ"
                rows={5}
                onChange={props.getSponsorData}
                error={props.error.sponsorDescription}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <ButtonCancel
                  type="trans"
                  text="Hủy bỏ"
                  font="font-normal"
                  onClick={props.onCloseDetailModal}
                />
              </div>
              <div>
                <Button
                  text="Hoàn tất"
                  font="font-normal"
                  onClick={props.updateSponsor}
                  disabled={props.disabled}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DetailSponsorModal;
