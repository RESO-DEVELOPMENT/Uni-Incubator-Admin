import { useEffect, useState } from "react";
import { TopBar } from "../Layout/TopBar";
import { BiAddToQueue } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import ToastError from "../../Components/Alert/ToastError";
import levelApi from "../../API/Level/levelApi";
import LevelTable from "../../Components/Table/LevelTable";
import { isEmpty, pickBy, size, values } from "lodash";
import LevelDetailModal from "./Components/LevelDetailModal";
import LevelAddModal from "./Components/LevelAddModal";
import TextInputSimple from "../../Components/Input/TextInputSimple";
import { BsListStars } from "react-icons/bs";
import NumberInput from "../../Components/Input/NumberInput";
import SelectSimple from "../../Components/Select/SelectSimple";

const Level = () => {
  const [levels, setLevels] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, settotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [orderOptions] = useState([
    { value: "createAtDesc", label: "Ngày tạo giảm dần" },
    { value: "createAtAsc", label: "Ngày tạo tăng dần" },
    { value: "requiredXPAsc", label: "XP tăng dần" },
    { value: "requiredXPDesc", label: "XP giảm dần" },
  ]);

  const [openFilter, setOpenFilter] = useState(false);
  const [levelName, setLevelName] = useState("");
  const [minXPNeeded, setMinXPNeeded] = useState(0);
  const [orderBy, setOrderBy] = useState("createAtDesc");

  const [tableLoading, setTableLoading] = useState(false);

  const [selectedLevel, setSelectedLevel] = useState({});
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [reload, setReload] = useState(false);

  const [modalLoading, setModalLoading] = useState(false);

  let { levelId } = useParams();

  document.title = "Cấp độ | UniCare";

  const getPage = (page) => {
    setCurrentPage(page);
    setPage(page);
  };

  const getLevelInformation = (level) => {
    navigate(`/levels/${level.levelId}`);
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelectedLevel({});
    navigate("/levels");
  };

  useEffect(() => {
    if (page === -1) {
      setPage(1);
      return;
    }
    const getLevels = async () => {
      setTableLoading(true);
      try {
        const response = await levelApi.get({
          page: page,
          "page-size": pageSize,
          LevelName: levelName,
          MinXPNeeded: minXPNeeded,
          OrderBy: orderBy,
        });
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          settotalPages(pagination.totalPages);
          setCurrentPage(pagination.currentPage);
          setLevels(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setTableLoading(false);
    };
    if (!isEmpty(levelName) || minXPNeeded > 0) {
      const timer = setTimeout(() => {
        getLevels();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      getLevels();
    }
  }, [page, pageSize, reload, levelName, minXPNeeded, orderBy]);

  useEffect(() => {
    const getLevelById = async () => {
      setModalLoading(true);
      try {
        const response = await levelApi.get({
          LevelID: levelId,
        });
        if (response.success) {
          if (!isEmpty(response.data.message)) {
            setSelectedLevel(response.data.message[0]);
          } else {
            navigate("/levels");
          }
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setModalLoading(false);
    };

    if (levelId) {
      setOpenModal(true);
      getLevelById();
    }
  }, [levelId, navigate]);

  return (
    <div>
      <TopBar />
      <div className="pl-10 pr-14 mb-10">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="grid grid-cols-4 mb-10">
            <div className="col-span-2">
              <div className="text-xl font-bold mb-2">Quản lý level</div>
              <div className="text-orange-600 font-bold">
                Level trong hệ thống: {levels.length}
              </div>
            </div>
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
                          levelName,
                          minXPNeeded,
                          orderBy,
                        },
                        (value) => !isEmpty(value) || value > 0
                      )
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end font-bold text-green">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setOpenAddModal(true)}
              >
                <div className="text-lg">
                  <BiAddToQueue />
                </div>
                <div>Thêm level</div>
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
                label="Tên level"
                placeholder="Tìm kiếm"
                value={levelName}
                onChange={(e) => setLevelName(e.target.value)}
              />
            </div>
            <div>
              <NumberInput
                label="XP cần có"
                value={minXPNeeded}
                onChange={(e) =>
                  setMinXPNeeded(
                    !isNaN(e.target.value) && +e.target.value >= 0
                      ? +e.target.value
                      : 0
                  )
                }
              />
            </div>
            <div className="col-span-2"></div>
            <div>
              <SelectSimple
                label="Sắp xếp"
                options={orderOptions}
                onChange={(data) => setOrderBy(data.value)}
              />
            </div>
          </div>
          <div>
            <LevelTable
              data={levels}
              getLevelInformation={getLevelInformation}
              loading={tableLoading}
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              currentPage={currentPage}
              getPage={getPage}
            />
          </div>
        </div>
        {openModal && (
          <LevelDetailModal
            level={selectedLevel}
            closeModal={closeModal}
            reload={() => setReload(!reload)}
            loading={modalLoading}
          />
        )}
        {openAddModal && (
          <LevelAddModal
            closeModal={() => setOpenAddModal(false)}
            reload={() => setPage(-1)}
          />
        )}
      </div>
    </div>
  );
};

export default Level;
