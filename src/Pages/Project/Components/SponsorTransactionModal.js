import { useState } from "react";
import Modal from "../../../Components/Modal/Modal";
import { useEffect } from "react";
import ToastError from "../../../Components/Alert/ToastError";
import projectApi from "../../../API/Project/projectApi";
import { AiOutlineClose } from "react-icons/ai";
import { FaDonate } from "react-icons/fa";
import { BsArrowDown } from "react-icons/bs";
import { CircularProgressbar } from "react-circular-progressbar";
import TransactionTable from "../../../Components/Table/TransactionTable";
import NumberInput from "../../../Components/Input/NumberInput";
import { toNumber } from "lodash";
import Button from "../../../Components/Button/Button";
import ButtonCancel from "../../../Components/Button/ButtonCancel";
import ToastSuccess from "../../../Components/Alert/ToastSuccess";
import Loading from "../../../Components/Loading/Loading";
import { textToColor, toVN } from "../../../Ultilities/String";
import { differenceInDays } from "date-fns";

const SponsorTransactionModal = (props) => {
  const [transactions, setTransactions] = useState([]);
  const [transLoading, setTransLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [amount, setAmount] = useState(0);

  const [activeReload, setActiveReload] = useState(false);
  const [donateLoading, setDonateLoading] = useState(false);

  const getAmount = (e) => {
    const data = e.target.value;
    if (isNaN(toNumber(data))) {
      return;
    }
    setAmount(data);
  };

  const closeDonateModal = () => {
    setAmount(0);
    setOpenModal(0);
  };

  const depositToProject = async () => {
    if (amount <= 0) {
      return;
    }
    setDonateLoading(true);
    try {
      const response = await projectApi.sponsorDepositToProject({
        projectSponsorId: props.sponsor.projectSponsorId,
        amount: amount,
      });
      if (response.success) {
        ToastSuccess({ text: "Giao dịch thành công" });
        setActiveReload(!activeReload);
        closeDonateModal();
        props.reload();
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
    setDonateLoading(false);
  };

  useEffect(() => {
    const getSponsorTransactions = async () => {
      setTransLoading(true);
      try {
        const response = await projectApi.getSponsorTransactions(
          props.sponsor.projectSponsorId
        );
        if (response.success) {
          setTransactions(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setTransLoading(false);
    };

    getSponsorTransactions();
  }, [props.sponsor.projectSponsorId, activeReload]);

  return (
    <Modal overflow={transactions.length >= 10 ? true : false}>
      <div className="bg-white rounded-lg p-5 w-3/4">
        <div className="flex items-center justify-between mb-5">
          <div className="font-bold text-xl">Lịch sử giao dịch</div>
          <div
            className="text-red-500 p-1 hover:bg-red-500/10 cursor-pointer rounded-full"
            onClick={props.closeTransModal}
          >
            <AiOutlineClose />
          </div>
        </div>
        {props.project.projectStatus !== "ended" &&
          props.project.projectStatus !== "stopped" &&
          props.project.projectStatus !== "cancelled" && (
            <div className="mb-1 flex justify-end">
              <div
                className="flex items-center justify-center gap-2 cursor-pointer hover:bg-yellow-500/10 text-yellow-500 px-5 py-1 rounded-lg"
                onClick={() => setOpenModal(true)}
              >
                <div>
                  <FaDonate />
                </div>
                <div>Thêm tài trợ</div>
              </div>
            </div>
          )}
        <div className="grid grid-cols-4 gap-5">
          <div>
            <div className="border border-slate-200 rounded-lg p-5 mb-5">
              <div className="flex justify-center mb-3">
                <img
                  className="w-20 h-20 rounded-full"
                  src={
                    props.sponsor.sponsor.imageUrl
                      ? props.sponsor.sponsor.imageUrl
                      : `https://ui-avatars.com/api/?name=${props.sponsor.sponsor.imageUrl}&length=1&background=30BC97&color=FFFFFF`
                  }
                  alt="avatar"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-center font-bold text-lg">
                {props.sponsor.sponsor.sponsorName}
              </div>
            </div>
            <div className="flex justify-center text-2xl text-black/60 mb-5">
              <BsArrowDown />
            </div>
            <div className="mb-5 flex justify-center text-2xl text-yellow-500">
              <FaDonate />
            </div>
            <div className="flex justify-center text-2xl text-black/60 mb-5">
              <BsArrowDown />
            </div>
            <div className="border border-slate-200 p-3 grid grid-cols-3 gap-3">
              <div>
                <CircularProgressbar
                  className="w-full"
                  value={
                    props.project.projectStatus === "ended" ||
                    props.project.projectStatus === "stopped" ||
                    props.project.projectStatus === "cancelled"
                      ? 100
                      : props.project.startedAt && props.project.endedAt
                      ? (
                          (differenceInDays(
                            new Date(),
                            new Date(props.project.startedAt)
                          ) /
                            differenceInDays(
                              new Date(props.project.endedAt),
                              new Date(props.project.startedAt)
                            )) *
                          100
                        ).toFixed()
                      : 0
                  }
                  maxValue={100}
                  text={`${
                    props.project.projectStatus === "ended" ||
                    props.project.projectStatus === "stopped" ||
                    props.project.projectStatus === "cancelled"
                      ? 100
                      : props.project.startedAt && props.project.endedAt
                      ? (
                          (differenceInDays(
                            new Date(),
                            new Date(props.project.startedAt)
                          ) /
                            differenceInDays(
                              new Date(props.project.endedAt),
                              new Date(props.project.startedAt)
                            )) *
                          100
                        ).toFixed()
                      : 0
                  }%`}
                  styles={{
                    path: {
                      stroke:
                        props.project.projectStatus === "created"
                          ? "#FF5D9E"
                          : props.project.projectStatus === "started"
                          ? "#5B48CC"
                          : props.project.projectStatus === "ended"
                          ? "#30BC97"
                          : "rgb(239 68 68)",
                    },
                    text: {
                      fill:
                        props.project.projectStatus === "created"
                          ? "#FF5D9E"
                          : props.project.projectStatus === "started"
                          ? "#5B48CC"
                          : props.project.projectStatus === "ended"
                          ? "#30BC97"
                          : "rgb(239 68 68)",
                      fontWeight: `bold`,
                    },
                  }}
                />
              </div>
              <div className="col-span-2">
                <div>{props.project.projectShortName}</div>
                <div className="text-xl font-bold w-11/12 truncate">
                  {props.project.projectName}
                </div>
                <div
                  style={{ color: textToColor(props.project.projectStatus) }}
                >
                  {toVN(props.project.projectStatus)}
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-3">
            <TransactionTable
              transactions={transactions}
              Loading={transLoading}
            />
          </div>
        </div>
      </div>
      {openModal && (
        <Modal>
          <div className="w-96 bg-white rounded-lg p-5 select-none">
            <div className="flex justify-between items-center mb-10">
              <div className="text-lg font-bold">Thêm tài trợ cho dự án</div>
              <div
                className="text-red-500 p-1 hover:bg-red-500/10 cursor-pointer rounded-full"
                onClick={closeDonateModal}
              >
                <AiOutlineClose />
              </div>
            </div>
            {donateLoading ? (
              <Loading />
            ) : (
              <>
                <div className="mb-10">
                  <div>
                    <div className="mb-2 font-bold text-gray">
                      Tổng point tài trợ
                    </div>
                    <div>
                      <NumberInput
                        placeholder="Ví dụ: 2,000"
                        name="amount"
                        value={amount}
                        onChange={getAmount}
                        increaseButton={true}
                        increaseStep={() => setAmount(toNumber(amount) + 1000)}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>
                    <ButtonCancel
                      type="trans"
                      text="Hủy bỏ"
                      onClick={closeDonateModal}
                    />
                  </div>
                  <div>
                    <Button text="Hoàn tất" onClick={depositToProject} />
                  </div>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </Modal>
  );
};

export default SponsorTransactionModal;
