import { AiOutlineClose } from "react-icons/ai";
import Modal from "../../../Components/Modal/Modal";
import { useState } from "react";
import { useEffect } from "react";
import ToastError from "../../../Components/Alert/ToastError";
import sponsorApi from "../../../API/Sponsor/sponsorApi";
import { find, isEmpty } from "lodash";
import SelectSimple from "../../../Components/Select/SelectSimple";
import ButtonCancel from "../../../Components/Button/ButtonCancel";
import Button from "../../../Components/Button/Button";
import { toVN } from "../../../Ultilities/String";
import Loading from "../../../Components/Loading/Loading";
import { GiTwoCoins } from "react-icons/gi";
import projectApi from "../../../API/Project/projectApi";
import ToastSuccess from "../../../Components/Alert/ToastSuccess";

const AddSponsorModal = (props) => {
  const [sponsors, setSponsors] = useState([]);
  const [sponsor, setSponsor] = useState("");

  const [loading, setLoading] = useState(false);

  const getSponsor = (data) => {
    setSponsor(data.value);
  };

  const addSponsor = async () => {
    setLoading(true);
    try {
      const response = await projectApi.addSponsorToProject(props.projectId, {
        sponsorId: sponsor,
      });
      if (response.success) {
        ToastSuccess({ text: "Thêm nhà tài trợ thành công" });
        props.goToSponsorDetail(response.data.message);
        props.closeModal();
        props.reload();
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
    setLoading(false);
  };

  useEffect(() => {
    const getSponsors = async () => {
      setLoading(true);
      try {
        const response = await sponsorApi.get();
        if (response.success) {
          const data = response.data.message.filter(
            (item) => item.sponsorStatus === "active"
          );
          const currentSponsors = [];
          const selectList = [];
          props.projectSponsors.forEach((item) => {
            currentSponsors.push(item.sponsor);
          });
          data.forEach((item) => {
            if (!find(currentSponsors, { sponsorId: item.sponsorId })) {
              selectList.push({
                label: (
                  <div className="flex items-center gap-2">
                    <div>
                      <img
                        className="w-5 h-5 rounded-full"
                        src={
                          item.imageUrl
                            ? item.imageUrl
                            : `https://ui-avatars.com/api/?name=${item.fullName}&length=1&background=30BC97&color=FFFFFF`
                        }
                        alt="avatar"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <div>{item.sponsorName}</div>
                      <div>-</div>
                      <div>{toVN(item.type)}</div>
                      <div>-</div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <div>{item.totalPoint.toLocaleString()}</div>
                        <div>
                          <GiTwoCoins />
                        </div>
                      </div>
                    </div>
                  </div>
                ),
                value: item.sponsorId,
              });
            }
          });
          if (!isEmpty(selectList)) {
            setSponsor(selectList[0].value);
          }
          setSponsors(selectList);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setLoading(false);
    };

    getSponsors();
  }, [props.projectSponsors]);

  return (
    <Modal>
      <div className="p-5 bg-white w-1/3 rounded-lg">
        <div className="flex items-center justify-between font-bold text-xl mb-10">
          <div>Thêm nhà tài trợ</div>
          <div
            className="text-red-500 p-1 hover:bg-red-500/10 cursor-pointer rounded-full"
            onClick={props.closeModal}
          >
            <AiOutlineClose />
          </div>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="mb-10">
              <div className="mb-2 font-bold text-gray">Chọn nhà tài trợ</div>
              <div>
                <SelectSimple
                  options={sponsors}
                  palceholder="Tìm kiếm"
                  onChange={getSponsor}
                />
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
                <Button text="Hoàn tất" onClick={addSponsor} />
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default AddSponsorModal;
