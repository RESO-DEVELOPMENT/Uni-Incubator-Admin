import { toDate } from "../../../Ultilities/Date";
import { useState, useEffect } from "react";
import { GiTwoCoins } from "react-icons/gi";
import projectApi from "../../../API/Project/projectApi";
import salaryApi from "../../../API/Salary/salaryApi";
import ToastError from "../../../Components/Alert/ToastError";
import SelectSimple from "../../../Components/Select/SelectSimple";
import ProjectSponsorTable from "../../../Components/Table/ProjectSponsorTable";
import { find, pickBy } from "lodash";
import TextInputSimple from "../../../Components/Input/TextInputSimple";
import { BiSortDown, BiSortUp } from "react-icons/bi";
import SponsorTransactionModal from "../Components/SponsorTransactionModal";
import { IoIosAddCircle } from "react-icons/io";
import AddSponsorModal from "../Components/AddSponsorModal";
import DepositModal from "../../Report/Components/DepositModal";

const ProjectSponsors = (props) => {
  const [cycles, setCycles] = useState([{ label: "Tất cả", value: "" }]);
  const [currentCycle, setCurrentCycles] = useState("");

  const [sponsors, setSponsors] = useState([]);
  const [projectWallets, setProjectWallets] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [sponsorName, setSponsorName] = useState("");
  const [orderBy, setOrderBy] = useState(false);

  const [loading, setLoading] = useState(false);

  const [openTransModal, setOpenTransModal] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState({});

  const [openAddSponsorModal, setOpenAddSponsorModal] = useState(false);
  const [openDepositModal, setOpenDepositModal] = useState(false);

  const [reload, setReload] = useState(false);

  const getCurrentCycle = async (option) => {
    setPage(-1);
    setCurrentCycles(option.value);
  };

  const getPage = (page) => {
    setPage(page);
  };

  const getSponsorName = (e) => {
    setPage(-1);
    setSponsorName(e.target.value);
  };

  const goToSponsorDetail = (sponsor) => {
    setOpenTransModal(true);
    setSelectedSponsor(sponsor);
  };

  const closeTransModal = () => {
    setOpenTransModal(false);
    setSelectedSponsor({});
  };

  useEffect(() => {
    const getAllCycles = async () => {
      try {
        const response = await salaryApi.getAll();
        if (response.success) {
          const cycleList = response.data.message;
          const options = [];
          cycleList.forEach((cycle) => {
            options.push({
              value: cycle.salaryCycleId,
              label: `${toDate(cycle.createdAt)} - ${toDate(cycle.endedAt)}`,
            });
          });
          setCycles([{ label: "Tất cả", value: "" }, ...options]);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
    };
    getAllCycles();
  }, [props.projectId]);

  useEffect(() => {
    const getProjectWallet = async () => {
      try {
        const response = await projectApi.getProjectWallet(props.projectId);
        if (response.success) {
          setProjectWallets(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
    };

    getProjectWallet();
  }, [props.projectId, reload]);

  useEffect(() => {
    if (page === -1) {
      setPage(1);
      return;
    }
    const getSponsors = async () => {
      setLoading(true);
      try {
        const response = await projectApi.getProjectSponsor(
          props.projectId,
          pickBy(
            {
              OrderBy: orderBy ? "dateAsc" : "dateDesc",
              SponsorName: sponsorName,
              page: page,
              "page-size": pageSize,
            },
            (value) => value
          )
        );
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          setTotalPages(pagination.totalPages);
          setCurrentPage(pagination.currentPage);
          setSponsors(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setLoading(false);
    };
    if (sponsorName && sponsorName !== "") {
      const timer = setTimeout(() => {
        getSponsors();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      getSponsors();
    }
  }, [
    page,
    pageSize,
    currentCycle,
    sponsorName,
    orderBy,
    reload,
    props.projectId,
  ]);

  return (
    <div>
      <div className="grid grid-cols-4 gap-5 mb-5">
        <div className="col-span-2">
          <div className="font-bold text-xl mb-5">Ngân sách dự án</div>
          <div className="w-1/2 mb-5">
            <SelectSimple
              label="Kỳ lương"
              options={cycles}
              onChange={getCurrentCycle}
            />
          </div>
          <div className="flex items-center gap-5">
            <div className="w-1/2">
              <TextInputSimple
                name="sponsorName"
                value={sponsorName}
                onChange={getSponsorName}
                label="Tên nhà tài trợ"
                placeholder="Tất cả"
              />
            </div>
            <div
              className="text-green flex items-center gap-2 cursor-pointer font-bold"
              onClick={() => setOrderBy(!orderBy)}
            >
              {orderBy ? (
                <div className="p-1 rounded-full bg-green/10 text-lg">
                  <BiSortUp />
                </div>
              ) : (
                <div className="p-1 rounded-full bg-green/10 text-lg">
                  <BiSortDown />
                </div>
              )}
              <div className="text-sm">Sắp xếp</div>
            </div>
          </div>
        </div>
        <div className=" border border-slate-400 p-5 text-xl font-bold rounded-lg h-fit">
          <div className="mb-3 flex items-center gap-2">
            <div>Ví dự án</div>
            {props.currentMember.role === "ADMIN" &&
              props.project.projectStatus !== "ended" &&
              props.project.projectStatus !== "stopped" &&
              props.project.projectStatus !== "cancelled" && (
                <div
                  className="text-lg text-green cursor-pointer"
                  onClick={() => setOpenDepositModal(true)}
                >
                  <IoIosAddCircle />
                </div>
              )}
          </div>
          <div className="flex items-center gap-2 text-yellow-500">
            <div className="tracking-wider">
              {find(projectWallets, { walletTag: "main" })
                ? find(projectWallets, {
                    walletTag: "main",
                  }).amount.toLocaleString()
                : 0}
            </div>
            <div>
              <GiTwoCoins />
            </div>
          </div>
        </div>
        <div className=" border border-slate-400 p-5 text-xl font-bold rounded-lg h-fit">
          <div className="mb-3">Ví tài trợ</div>
          <div className="flex items-center gap-2 text-yellow-500">
            <div className="tracking-wider">
              {find(projectWallets, { walletTag: "bonus" })
                ? find(projectWallets, {
                    walletTag: "bonus",
                  }).amount.toLocaleString()
                : 0}
            </div>
            <div>
              <GiTwoCoins />
            </div>
          </div>
        </div>
      </div>
      {props.currentMember.role === "ADMIN" &&
        props.project.projectStatus !== "ended" &&
        props.project.projectStatus !== "stopped" &&
        props.project.projectStatus !== "cancelled" && (
          <div className="flex justify-end mb-3">
            <div
              className="text-green cursor-pointer px-3 py-1 rounded-lg gap-1 flex items-center"
              onClick={() => setOpenAddSponsorModal(true)}
            >
              <div className="text-lg">
                <IoIosAddCircle />
              </div>
              <div className="font-bold">Thêm nhà tài trợ cho dự án</div>
            </div>
          </div>
        )}
      <div>
        <ProjectSponsorTable
          sponsors={sponsors}
          loading={loading}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
          currentPage={currentPage}
          getPage={getPage}
          goToSponsorDetail={goToSponsorDetail}
          currentMember={props.currentMember}
        />
      </div>
      {openTransModal && (
        <SponsorTransactionModal
          closeTransModal={closeTransModal}
          sponsor={selectedSponsor}
          project={props.project}
          reload={() => setReload(!reload)}
        />
      )}
      {openAddSponsorModal && (
        <AddSponsorModal
          projectId={props.projectId}
          projectSponsors={sponsors}
          closeModal={() => setOpenAddSponsorModal(false)}
          goToSponsorDetail={goToSponsorDetail}
          reload={() => setReload(!reload)}
        />
      )}
      {openDepositModal && (
        <DepositModal
          closeModal={() => setOpenDepositModal(false)}
          projectId={props.projectId}
          reload={() => setReload(!reload)}
        />
      )}
    </div>
  );
};

export default ProjectSponsors;
