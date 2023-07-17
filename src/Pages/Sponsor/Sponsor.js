import {
  isEmpty,
  isNil,
  last,
  omitBy,
  pickBy,
  size,
  split,
  values,
} from "lodash";
import { useEffect } from "react";
import { useState } from "react";
import { BiMessageSquareAdd } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import sponsorApi from "../../API/Sponsor/sponsorApi";
import ToastError from "../../Components/Alert/ToastError";
import ToastSuccess from "../../Components/Alert/ToastSuccess";
import SponsorTable from "../../Components/Table/SponsorTable";
import { TopBar } from "../Layout/TopBar";
import AddSponsorModal from "./Components/AddSponsorModal";
import DetailSponsorModal from "./Components/DetailSponsorModal";
import { BsListStars } from "react-icons/bs";
import TextInputSimple from "../../Components/Input/TextInputSimple";
import SelectSimpleDot from "../../Components/Select/SelectSimpleDot";

const Sponsor = () => {
  let { sponsorId } = useParams();
  const navigate = useNavigate();

  const [sponsors, setSponsors] = useState([]);

  const [sponsor, setSponsor] = useState({
    sponsorId: "",
    sponsorName: "",
    sponsorDescription: "",
    sponsorStatus: undefined,
    type: undefined,
    imageUrl: "",
  });
  const [error, setError] = useState({
    sponsorName: "",
    sponsorDescription: "",
    sponsorStatus: "",
    type: "",
  });
  const [sponsorProjects, setSponsorProjects] = useState([]);
  const [base64Image, setBase64Image] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, settotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedSponsors, setSelectedSponsors] = useState([]);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);

  const [tableLoading, setTableLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [projectLoading, setProjectLoading] = useState(false);

  const [statusOptions] = useState([
    {
      value: "active",
      label: "Còn hoạt động",
      color: "#30BC97",
    },
    {
      value: "inactive",
      label: "Ngưng hoạt động",
      color: "red",
    },
  ]);
  const [openFilter, setOpenFilter] = useState(false);
  const [sponsorName, setSponsorName] = useState("");
  const [status, setStatus] = useState("");

  const [reload, setReload] = useState(false);

  const [disabled, setDisabled] = useState(true);

  document.title = "Tài trợ | UniCare";

  const getSelectedSponsors = (data) => {
    setSelectedSponsors(data.selectedRows);
  };

  const getPage = (page) => {
    setCurrentPage(page);
    setPage(page);
  };

  const getSponsorInformation = (sponsor) => {
    navigate(`/sponsors/${sponsor.sponsorId}`);
  };

  const onCloseAddModal = () => {
    setOpenAddModal(false);
  };

  const onCloseDetailModal = () => {
    navigate("/sponsors");
    setOpenDetailModal(false);
    setSponsor({});
    setBase64Image("");
    setDisabled(true);
  };

  const addSponsor = async (sponsor) => {
    setModalLoading(true);
    try {
      const response = await sponsorApi.create(omitBy(sponsor, isEmpty));
      if (response.success) {
        ToastSuccess({ text: "Tạo nhà tài trợ thành công" });
        onCloseAddModal();
        setPage(-1);
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
    setModalLoading(false);
  };

  const getSponsorDataForUpdate = (e) => {
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

  const getStatusFilter = (status) => {
    if (status) {
      setSponsor((prev) => {
        return {
          ...prev,
          sponsorStatus: status.value,
        };
      });
      setError((prev) => {
        return {
          ...prev,
          sponsorStatus: "",
        };
      });
      setDisabled(false);
    } else {
      setSponsor((prev) => {
        return {
          ...prev,
          sponsorStatus: undefined,
        };
      });
      setError((prev) => {
        return {
          ...prev,
          sponsorStatus: "*",
        };
      });
      setDisabled(true);
    }
  };

  const getImageUrlForUpdate = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setBase64Image(last(split(reader.result, ",")));
      setSponsor((prev) => {
        return {
          ...prev,
          imageUrl: reader.result,
        };
      });
    };

    reader.readAsDataURL(file);
    setDisabled(false);
  };

  const updateSponsor = async () => {
    const nullUndefinedEmpty = pickBy(
      {
        sponsorDescription: sponsor.sponsorDescription,
        sponsorName: sponsor.sponsorName,
        type: sponsor.type,
        sponsorStatus: sponsor.sponsorStatus,
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
    setModalLoading(true);
    try {
      const response = await sponsorApi.update(
        omitBy(
          {
            sponsorId: sponsor.sponsorId,
            sponsorName: sponsor.sponsorName,
            sponsorDescription: sponsor.sponsorDescription,
            imageAsBase64: base64Image,
            sponsorStatus: sponsor.sponsorStatus,
            type: sponsor.type,
          },
          isEmpty
        )
      );
      if (response.success) {
        ToastSuccess({ text: "Cập nhật thông tin thành công" });
        onCloseDetailModal();
        setReload(!reload);
      }
    } catch (error) {
      ToastError({ text: "Cập nhật thông tin thất bại" });
    }
    setModalLoading(false);
  };

  const removeSponsor = async (sponsorId) => {
    try {
      const response = await sponsorApi.update({
        sponsorId: sponsorId,
        sponsorStatus: "inactive",
      });
      if (response.success) {
        ToastSuccess({ text: "Cập nhật thông tin thành công" });
        setReload(!reload);
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
  };

  useEffect(() => {
    if (page === -1) {
      setPage(1);
      return;
    }
    const getSponsors = async () => {
      setTableLoading(true);
      try {
        const response = await sponsorApi.get(
          omitBy(
            {
              page: page,
              "page-size": pageSize,
              Status: status,
              SponsorName: sponsorName,
            },
            isEmpty
          )
        );
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          settotalPages(pagination.totalPages);
          setCurrentPage(pagination.currentPage);
          setSponsors(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setTableLoading(false);
    };

    if (!isEmpty(sponsorName)) {
      const timer = setTimeout(() => {
        getSponsors();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      getSponsors();
    }
  }, [page, pageSize, sponsorName, status, reload]);

  useEffect(() => {
    const getSponsorFromURL = async () => {
      setModalLoading(true);
      try {
        const response = await sponsorApi.getById(sponsorId);
        if (response.success) {
          setSponsor(response.data.message);
        }
      } catch (error) {
        ToastError({ text: "Không thể lấy thông tin nhà tài trợ" });
        setOpenDetailModal(false);
      }
      setModalLoading(false);
    };

    const getSponsorProjects = async () => {
      setProjectLoading(true);
      try {
        const response = await sponsorApi.getAllProjects(sponsorId);
        if (response.success) {
          setSponsorProjects(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setProjectLoading(false);
    };

    if (sponsorId) {
      getSponsorFromURL();
      getSponsorProjects();
      setOpenDetailModal(true);
    }
  }, [sponsorId]);

  return (
    <>
      <TopBar />
      <div className="pl-10 pr-14 mb-10">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="grid grid-cols-5 mb-10">
            <div className="font-bold text-2xl">Quản lý tài trợ</div>
            <div className="col-span-2"></div>
            <div className="select-none flex items-center">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setOpenFilter(!openFilter)}
              >
                <div className="p-2 rounded-full bg-purple/10 text-purple text-lg">
                  <BsListStars />
                </div>
                <div className="font-bold text-purple text-sm">Lọc kết quả</div>
                <div className="border border-purple w-5 h-5 bg-purple/10 text-purple rounded-sm text-sm flex items-center justify-center font-bold">
                  {size(
                    values(
                      pickBy(
                        {
                          status,
                          sponsorName,
                        },
                        (value) => !isEmpty(value)
                      )
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end items-center">
              <div
                className="flex items-center gap-2 text-green font-bold cursor-pointer select-none"
                onClick={() => setOpenAddModal(true)}
              >
                <BiMessageSquareAdd />
                <div>Thêm nhà tài trợ mới</div>
              </div>
            </div>
          </div>
          <div
            className={`grid grid-cols-5 gap-5 ${
              openFilter ? "mb-5" : "h-0 overflow-hidden"
            }`}
          >
            <div>
              <TextInputSimple
                label="Tên nhà tài trợ"
                placeholder="Tìm kiếm"
                value={sponsorName}
                onChange={(e) => setSponsorName(e.target.value)}
              />
            </div>
            <div className="col-span-2"></div>
            <div className="col-span-2 flex justify-end">
              <SelectSimpleDot
                label="Trạng thái"
                options={statusOptions}
                onChange={(data) =>
                  !isNil(data) ? setStatus(data.value) : setStatus("")
                }
              />
            </div>
          </div>
          <div>
            <SponsorTable
              data={sponsors}
              getSelectedSponsors={getSelectedSponsors}
              selectedSponsors={selectedSponsors}
              getSponsorInformation={getSponsorInformation}
              loading={tableLoading}
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              currentPage={currentPage}
              getPage={getPage}
              removeSponsor={removeSponsor}
              //   handleSort={handleSort}
            />
          </div>
        </div>
      </div>
      {openAddModal && (
        <div>
          <AddSponsorModal
            onCloseAddModal={onCloseAddModal}
            addSponsor={addSponsor}
            loading={modalLoading}
          />
        </div>
      )}
      {openDetailModal && (
        <div>
          <DetailSponsorModal
            onCloseDetailModal={onCloseDetailModal}
            sponsor={sponsor}
            updateSponsor={updateSponsor}
            getSponsorData={getSponsorDataForUpdate}
            getTypeFilter={getTypeFilter}
            getStatusFilter={getStatusFilter}
            getImageUrl={getImageUrlForUpdate}
            sponsorProjects={sponsorProjects}
            loading={modalLoading}
            projectLoading={projectLoading}
            disabled={disabled}
            error={error}
          />
        </div>
      )}
    </>
  );
};

export default Sponsor;
