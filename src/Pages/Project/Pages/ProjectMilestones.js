import { useEffect } from "react";
import { useState } from "react";
import {
  AiFillCalendar,
  AiOutlineClose,
  AiOutlineFieldTime,
  AiOutlineOrderedList,
  AiOutlineStop,
} from "react-icons/ai";
import ToastError from "../../../Components/Alert/ToastError";
import ToastSuccess from "../../../Components/Alert/ToastSuccess";
import projectApi from "../../../API/Project/projectApi";
import { find, isEmpty, isNil } from "lodash";
import {
  BiArrowToLeft,
  BiArrowToRight,
  BiNotepad,
  BiUser,
} from "react-icons/bi";
import Paginate from "../../../Components/Paginate/Paginate";
import Button from "../../../Components/Button/Button";
import { HiNewspaper } from "react-icons/hi";
import { toDate } from "../../../Ultilities/Date";
import Loading from "../../../Components/Loading/Loading";
import milestones_pic from "../../../Pictures/milestones_pic.png";
import Modal from "../../../Components/Modal/Modal";
import TextInputSimple from "../../../Components/Input/TextInputSimple";
import TextAreaSimple from "../../../Components/Input/TextAreaSimple";
import ButtonCancel from "../../../Components/Button/ButtonCancel";
import { MdOutlineAddCircle, MdOutlineKeyboardReturn } from "react-icons/md";
import ButtonIcon from "../../../Components/Button/ButtonIcon";
import MileStonesTable from "../../../Components/Table/MileStonesTable";
import SelectSimple from "../../../Components/Select/SelectSimple";
import { BsCalendarEvent } from "react-icons/bs";
import { roleInProject } from "../../../Config/config";
import EndRequestTable from "../../../Components/Table/EndRequestTable";
import EndRequestModal from "../Components/EndRequestModal";
import DetailEndRequestModal from "../Components/DetailEndRequestModal";

const ProjectMilestones = (props) => {
  const [milestones, setMilestones] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(1);

  const [selectedMilestone, setSelectedMilestone] = useState({});
  const [manager, setManager] = useState({});

  const [loading, setLoading] = useState(false);

  const [majors] = useState(roleInProject);
  const [request, setRequest] = useState({
    major: "CEO",
    note: "Xin chào, tôi đã xem qua thông tin dự án và muốn trở thành thành viên tham gia hiện thực dự án",
  });
  const [openModal, setOpenModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalResult, setModalResult] = useState("");

  const [onUpdate, setOnUpdate] = useState(false);

  const [openManage, setOpenManage] = useState(false);
  const [openAddMilestoneModal, setOpenAddMilestoneModal] = useState(false);
  const [postMilestone, setPostMilestone] = useState({
    title: "Kiểm thử",
    content: "Kiểm thử lần 1",
  });

  const [error, setError] = useState({
    note: "",
    title: "",
    content: "",
  });

  const [tab, setTab] = useState(props.currentMember.role === "ADMIN" ? 2 : 1);

  const [activeReload, setActiveReload] = useState(false);

  const nonActiveClassname =
    "text-black/70 p-3 cursor-pointer hover:border-b-2 hover:border-green hover:text-green";
  const activeClassname =
    "text-green p-3 cursor-pointer border-b-2 border-green";

  const [endRequests, setEndRequests] = useState([]);
  const [endLoading, setEndLoading] = useState(false);

  const [pageEndReq, setPageEndReq] = useState(1);
  const [pageSizeEndReq] = useState(10);
  const [currentPageEndReq, setCurrentPageEndReq] = useState(1);
  const [totalPagesEndReq, setTotalPagesEndReq] = useState(1);

  const [openEndRequestModal, setOpenEndRequestModal] = useState(false);
  const [openEndRequestDetailModal, setOpenEndRequestDetailModal] =
    useState(false);
  const [detailRequest, setDetailRequest] = useState({});

  const getPage = (page) => {
    setPage(page);
  };

  const getPageEndReq = (page) => {
    setPageEndReq(page);
  };

  const closeAddMileStoneModal = () => {
    setOpenAddMilestoneModal(false);
    setPostMilestone({});
    setError({
      note: "",
      title: "",
      content: "",
    });
  };

  const closeModal = () => {
    setOpenModal(false);
    setModalResult("");
    setRequest({
      major: "",
      note: "",
    });
    setError({
      note: "",
      title: "",
      content: "",
    });
  };

  const getMajorFromSelect = (data) => {
    if (isNil(data)) {
      return;
    }
    setRequest((prev) => {
      return {
        ...prev,
        major: data.value,
      };
    });
  };

  const deleteMilestone = async () => {
    try {
      const response = await projectApi.deleteMilestone(
        postMilestone.projectMilestoneId
      );
      if (response.success) {
        setOpenAddMilestoneModal(false);
        ToastSuccess({ text: "Xóa thành công" });
        setActiveReload(!activeReload);
      }
    } catch (error) {
      ToastError({ text: "Xóa thất bại" });
    }
  };

  const addMileStone = async () => {
    if (
      isEmpty(postMilestone.title?.trim()) ||
      isEmpty(postMilestone.content?.trim())
    ) {
      if (isEmpty(postMilestone.title?.trim())) {
        setError((prev) => {
          return {
            ...prev,
            title: "*",
          };
        });
      }
      if (isEmpty(postMilestone.content?.trim())) {
        setError((prev) => {
          return {
            ...prev,
            content: "*",
          };
        });
      }
      return;
    }
    setLoading(true);
    try {
      const response = await projectApi.addMilestone(
        props.projectId,
        postMilestone
      );
      if (response.success) {
        ToastSuccess({ text: "Thêm hạng mục thành công" });
        closeAddMileStoneModal();
        setOpenManage(false);
        setSelectedMilestone(response.data.message);
        setActiveReload(!activeReload);
      }
    } catch (error) {
      ToastError({ text: "Thêm hạng mục thất bại" });
    }
    setLoading(false);
  };

  const updateMileStone = async () => {
    if (
      isEmpty(postMilestone.title.trim()) ||
      isEmpty(postMilestone.content.trim())
    ) {
      if (isEmpty(postMilestone.title.trim())) {
        setError((prev) => {
          return {
            ...prev,
            title: "*",
          };
        });
      }
      if (isEmpty(postMilestone.content.trim())) {
        setError((prev) => {
          return {
            ...prev,
            content: "*",
          };
        });
      }
      return;
    }
    setLoading(true);
    try {
      const response = await projectApi.updateMileStone({
        milestoneId: postMilestone.projectMilestoneId,
        title: postMilestone.title,
        content: postMilestone.content,
      });
      if (response.success) {
        ToastSuccess({ text: "Cập nhật thành công" });
        closeAddMileStoneModal();
        setOpenManage(false);
        setSelectedMilestone(response.data.message);
        setActiveReload(!activeReload);
      }
    } catch (error) {
      ToastError({ text: "Cập nhật thất bại" });
    }
    setLoading(false);
  };

  const getRequestData = (e) => {
    const { name, value } = e.target;
    if (name === "note" && value.length > 220) {
      return;
    }
    setRequest((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
    setError((prev) => {
      return {
        ...prev,
        note: "",
      };
    });
  };

  const getPostMilestone = (e) => {
    const { name, value } = e.target;
    setPostMilestone((prev) => {
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
  };

  const checkForRequest = async () => {
    setOpenModal(true);
    // try {
    //   const response = await projectApi.getProjectJoinRequest(props.projectId);
    //   if (response.success) {
    //     console.log(response.data.message);
    //   }
    // } catch (error) {
    //   ToastError({ text: "Không thể kiểm tra trạng thái yêu cầu" });
    // }
  };

  const createJoinRequest = async () => {
    if (isEmpty(request.note)) {
      setError((prev) => {
        return {
          ...prev,
          note: "*",
        };
      });
      return;
    }
    setModalLoading(true);
    try {
      const response = await projectApi.createJoinRequest(props.projectId, {
        major: request.major,
        note: request.note,
      });
      if (response.success) {
        setModalResult(
          "Bạn đã gửi yêu cầu tham gia thành công, hãy đợi quản lý duyệt"
        );
      }
    } catch (error) {
      setModalResult(
        "Đã có lỗi xảy ra hoặc bạn đã gửi yêu cầu tham gia trước đó, hãy đợi quản lý duyệt"
      );
    }
    setModalLoading(false);
  };

  const getMilestonesFromSelect = (milestone) => {
    setOnUpdate(true);
    setPostMilestone(milestone);
    setOpenAddMilestoneModal(true);
  };

  const goToRequestDetail = (request) => {
    setDetailRequest(request);
    setOpenEndRequestDetailModal(true);
  };

  useEffect(() => {
    const getProjectById = async () => {
      const managerOfThisProject = find(props.project.members, {
        role: "manager",
      });
      if (managerOfThisProject) {
        setManager(managerOfThisProject);
      }
    };
    getProjectById();
  }, [props.project]);

  useEffect(() => {
    const getMilestones = async () => {
      setLoading(true);
      try {
        const response = await projectApi.getProjectMilestones(
          props.projectId,
          {
            page: page,
            "page-size": pageSize,
            OrderBy: "dateDesc",
          }
        );
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          setTotalPages(pagination.totalPages);
          setCurrentPage(pagination.currentPage);
          setTotalItems(pagination.totalItems);
          setMilestones(response.data.message);
        }
      } catch (error) {
        ToastError({ text: "Không thể lấy thông tin các kế hoạch" });
      }
      setLoading(false);
    };

    getMilestones();
  }, [page, pageSize, props.projectId, activeReload]);

  useEffect(() => {
    if (pageEndReq === -1) {
      setPageEndReq(1);
      return;
    }
    const getEndRequest = async () => {
      setEndLoading(true);
      try {
        const response = await projectApi.getProjectEndRequest(
          props.projectId,
          {
            page: pageEndReq,
            "page-size": pageSizeEndReq,
          }
        );
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          setTotalPagesEndReq(pagination.totalPages);
          setCurrentPageEndReq(pagination.currentPage);
          setEndRequests(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setEndLoading(false);
    };

    if (tab === 2) {
      getEndRequest();
    }
  }, [pageEndReq, pageSizeEndReq, props.projectId, tab, activeReload]);

  return (
    <>
      {openManage ? (
        <div>
          <div className="grid grid-cols-4 gap-10 mb-10">
            {tab === 1 ? (
              <>
                <div className="col-span-3">
                  <div className="flex gap-2 items-center mb-5">
                    <div className="text-xl font-bold">
                      Kế hoạch chi tiết của dự án
                    </div>
                    <div
                      className="text-purple cursor-pointer text-xl hover:bg-purple/10 p-1 rounded-full"
                      onClick={() => setOpenManage(false)}
                    >
                      <MdOutlineKeyboardReturn />
                    </div>
                  </div>
                  <div className="mb-3 grid grid-cols-3 gap-10">
                    <div>
                      <ButtonIcon
                        type="trans"
                        text="Thêm hạng mục mới"
                        icon={<MdOutlineAddCircle className="text-lg" />}
                        onClick={() => {
                          setOnUpdate(false);
                          setOpenAddMilestoneModal(true);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="font-bold flex flex-col justify-center gap-3 p-5 border border-slate-400 rounded-lg">
                  <div className="text-xl">Tổng số hạng mục</div>
                  <div className="text-green tracking-wider text-xl">
                    {totalItems}
                  </div>
                </div>
              </>
            ) : (
              tab === 2 && (
                <div className="col-span-3">
                  <div className="flex gap-2 items-center mb-5">
                    <div className="text-xl font-bold">
                      Yêu cầu kết thúc sớm dự án
                    </div>
                    <div
                      className="text-purple cursor-pointer text-xl hover:bg-purple/10 p-1 rounded-full"
                      onClick={() => setOpenManage(false)}
                    >
                      <MdOutlineKeyboardReturn />
                    </div>
                  </div>
                  {props.isManager &&
                    props.project.projectStatus === "started" &&
                    ((!isEmpty(endRequests) &&
                      !find(endRequests, { status: "created" })) ||
                      isEmpty(endRequests)) && (
                      <div className="mb-3 grid grid-cols-3 gap-10">
                        <div>
                          <ButtonIcon
                            type="trans"
                            text="Thêm yêu cầu mới"
                            icon={<MdOutlineAddCircle className="text-lg" />}
                            onClick={() => {
                              setOpenEndRequestModal(true);
                            }}
                          />
                        </div>
                      </div>
                    )}
                </div>
              )
            )}
          </div>
          {openEndRequestModal && (
            <EndRequestModal
              projectId={props.projectId}
              closeModal={() => setOpenEndRequestModal(false)}
              getPage={getPageEndReq}
            />
          )}
          {openEndRequestDetailModal && (
            <DetailEndRequestModal
              request={detailRequest}
              reload={() => setActiveReload(!activeReload)}
              getActiveReload={props.getActiveReload}
              closeModal={() => {
                setOpenEndRequestDetailModal(false);
                setDetailRequest({});
              }}
              isAdmin={props.currentMember.role === "ADMIN"}
            />
          )}
          <div className="mb-2">
            <div className="px-5 flex gap-5 font-bold">
              {props.isManager && (
                <div
                  className={`flex items-center gap-2 ${
                    tab === 1 ? activeClassname : nonActiveClassname
                  }`}
                  onClick={() => setTab(1)}
                >
                  <div>
                    <AiOutlineOrderedList />
                  </div>
                  <div>Kế hoạch</div>
                </div>
              )}
              <div
                className={`flex items-center gap-2 ${
                  tab === 2 ? activeClassname : nonActiveClassname
                }`}
                onClick={() => setTab(2)}
              >
                <div>
                  <AiOutlineStop />
                </div>
                <div>Yêu cầu kết thúc sớm</div>
              </div>
            </div>
          </div>
          {tab === 1 ? (
            <div>
              <MileStonesTable
                mileStones={milestones}
                loading={props.loading}
                toMileStone={getMilestonesFromSelect}
                page={page}
                pageSize={pageSize}
                totalPages={totalPages}
                currentPage={currentPage}
                getPage={getPage}
              />
            </div>
          ) : (
            tab === 2 && (
              <div>
                <EndRequestTable
                  endRequests={endRequests}
                  loading={endLoading}
                  page={pageEndReq}
                  pageSize={pageSizeEndReq}
                  totalPages={totalPagesEndReq}
                  currentPage={currentPageEndReq}
                  getPage={getPageEndReq}
                  goToRequestDetail={goToRequestDetail}
                />
              </div>
            )
          )}
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-3 gap-10 mb-10">
            <div>
              <div className="font-bold text-lg text-black/70 py-3">
                Hạng mục sắp tới
              </div>
              <div>
                {loading ? (
                  <div>
                    <Loading />
                  </div>
                ) : (
                  <>
                    {!isEmpty(milestones) ? (
                      <>
                        {milestones.map((item) => {
                          return (
                            <div
                              key={item.projectMilestoneId}
                              className={`flex items-center justify-between font-bold cursor-pointer text-black/70 hover:text-green py-2 ${
                                selectedMilestone.projectMilestoneId ===
                                  item.projectMilestoneId && "text-green"
                              }`}
                              onClick={() => setSelectedMilestone(item)}
                            >
                              <div className="flex items-center gap-2">
                                <div>
                                  <AiFillCalendar />
                                </div>
                                <div>{item.title}</div>
                              </div>
                              <div>
                                <BiArrowToRight />
                              </div>
                            </div>
                          );
                        })}
                        <div className="mt-5">
                          <Paginate
                            milestones={milestones}
                            page={page}
                            pageSize={pageSize}
                            totalPages={totalPages}
                            currentPage={currentPage}
                            getPage={getPage}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="font-bold text-sm text-black/70">
                        Không có kế hoạch nào
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="col-span-2">
              {isEmpty(selectedMilestone) ? (
                <div className="border border-slate-200">
                  <div className="py-3 px-5 font-bold text-lg bg-green/10">
                    Thông tin chi tiết kế hoạch
                  </div>
                  <div className="p-5">
                    <div className="text-center text-xl font-bold mb-10">
                      Thống kê các hạng mục có trong dự án
                    </div>
                    <div className="grid grid-cols-2 gap-5 px-10">
                      <div>
                        <div className="flex gap-2 text-per-75 font-bold mb-5">
                          <div className="text-4xl">
                            <BiNotepad />
                          </div>
                          <div>
                            <div className="text-black">
                              Tổng số hạng mục của dự án
                            </div>
                            <div>{milestones.length}</div>
                          </div>
                        </div>
                        <div className="flex gap-2 text-blue-700 font-bold mb-5">
                          <div className="text-4xl">
                            <HiNewspaper />
                          </div>
                          <div>
                            <div className="text-black">Tạo bởi</div>
                            <div>
                              {!isEmpty(manager)
                                ? manager.member.fullName
                                : "..."}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 text-green font-bold mb-5">
                          <div className="text-4xl">
                            <AiFillCalendar />
                          </div>
                          <div>
                            <div className="text-black">
                              Hạng mục mới tạo gần đây
                            </div>
                            <div>
                              {!isEmpty(milestones)
                                ? milestones[0].title
                                : "Không có"}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 text-purple font-bold mb-5">
                          <div className="text-4xl">
                            <AiOutlineFieldTime />
                          </div>
                          <div>
                            <div className="text-black">Thời gian tạo</div>
                            <div>
                              {!isEmpty(milestones)
                                ? toDate(milestones[0].createdAt)
                                : "Không có"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <img src={milestones_pic} alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-slate-200">
                  <div className="flex items-center justify-between py-3 px-5 font-bold text-lg bg-green/10">
                    <div>Thông tin chi tiết kế hoạch</div>
                    <div
                      className="text-md hover:text-green cursor-pointer"
                      onClick={() => setSelectedMilestone({})}
                    >
                      <BiArrowToLeft />
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="text-xl font-bold mb-2">
                      {selectedMilestone.title}
                    </div>
                    <div className="flex items-center gap-2 text-black/80 font-bold mb-2">
                      <div className="text-lg">
                        <HiNewspaper />
                      </div>
                      <div>Tạo bởi</div>
                      <div className="text-green">
                        {!isEmpty(manager) ? manager.member.fullName : "..."}
                      </div>
                    </div>
                    <div className="flex gap-2 items-center text-black/70 font-bold">
                      <div className="text-lg">
                        <AiOutlineFieldTime />
                      </div>
                      <div>{toDate(selectedMilestone.createdAt)}</div>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-5 px-5 mb-5">
                    <div className="text-black/70 font-bold text-md">
                      {selectedMilestone.content}
                    </div>
                    <div>
                      <img src={milestones_pic} alt="" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center">
            {props.currentMember.role === "ADMIN" ? (
              <div>
                <Button
                  type="trans"
                  text="Quản lý yêu cầu dự án"
                  onClick={() => setOpenManage(true)}
                />
              </div>
            ) : props.isManager ? (
              <div>
                <Button
                  type="trans"
                  text="Quản lý kế hoạch dự án"
                  onClick={() => setOpenManage(true)}
                />
              </div>
            ) : (
              <>
                {!(props.currentMember.role === "ADMIN") &&
                  !props.isMember &&
                  !props.isManager && (
                    <div>
                      <Button
                        type="trans"
                        text="Tôi muốn tham gia dự án"
                        onClick={checkForRequest}
                      />
                    </div>
                  )}
              </>
            )}
          </div>
          {openModal && (
            <div>
              <Modal>
                <div className="w-96 rounded-lg bg-white p-5">
                  <div className="flex items-center justify-between mb-8">
                    <div className="font-bold text-xl">
                      Yêu cầu tham gia dự án
                    </div>
                    <div
                      className="p-1 text-red-500 hover:bg-red-500/10 cursor-pointer rounded-full w-6 h-6"
                      onClick={closeModal}
                    >
                      <AiOutlineClose />
                    </div>
                  </div>
                  {modalLoading ? (
                    <div>
                      <Loading />
                    </div>
                  ) : (
                    <>
                      {isEmpty(modalResult) ? (
                        <>
                          <div className="flex items-center gap-2 mb-5">
                            <div>
                              <img
                                className="w-10 h-10 rounded-full"
                                src={
                                  props.currentMember.imageUrl
                                    ? props.currentMember.imageUrl
                                    : `https://ui-avatars.com/api/?name=${props.currentMember.fullName}&length=1&background=30BC97&color=FFFFFF`
                                }
                                alt="avatar"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div>
                              <div className="font-bold">
                                {props.currentMember.fullName}
                              </div>
                              <div className="text-black/70">
                                {props.currentMember.emailAddress}
                              </div>
                            </div>
                          </div>
                          <div className="mb-5">
                            <div className="mb-5">
                              <div className="mb-2 font-bold text-gray">
                                Vị trí mong muốn
                              </div>
                              <SelectSimple
                                options={majors}
                                name="major"
                                onChange={getMajorFromSelect}
                              />
                            </div>
                            <div className="mb-5">
                              <div className="flex items-center justify-between mb-2">
                                <div className="font-bold text-gray">Lý do</div>
                                <div className="text-xs font-black/40">
                                  {`${request.note.length} / 220`}
                                </div>
                              </div>
                              <TextAreaSimple
                                placeholder="Xin chào, tôi đã xem qua thông tin dự án và muốn trở thành thành viên tham gia hiện thực dự án"
                                name="note"
                                value={request.note}
                                onChange={getRequestData}
                                rows={6}
                                error={error.note}
                              />
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <div>
                              <ButtonCancel
                                type="trans"
                                text="Hủy bỏ"
                                onClick={closeModal}
                              />
                            </div>
                            <div>
                              <Button
                                text="Hoàn tất"
                                onClick={createJoinRequest}
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-center font-bold text-primary my-10">
                            {modalResult}
                          </div>
                          <div className="flex justify-center">
                            <div>
                              <Button text="Đóng" onClick={closeModal} />
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </Modal>
            </div>
          )}
        </div>
      )}
      {openAddMilestoneModal && (
        <Modal>
          <div className="w-96 bg-white rounded-lg p-5">
            <div className="flex items-center justify-between">
              <div className="font-bold text-xl">Thêm hạng mục mới</div>
              <div
                className="p-1 rounded-full text-red-500 hover:bg-red-500/10 cursor-pointer"
                onClick={closeAddMileStoneModal}
              >
                <AiOutlineClose />
              </div>
            </div>
            {onUpdate && (
              <div
                className="text-red-500 hover:underline cursor-pointer w-fit text-sm"
                onClick={deleteMilestone}
              >
                Xóa hạng mục
              </div>
            )}
            <div className="mb-10 mt-5">
              <div className="flex gap-2 items-center mb-3">
                <div className="p-2 text-xl text-green bg-green/10 rounded-full">
                  <BiUser />
                </div>
                <div>
                  <div className="font-bold">
                    {props.currentMember.fullName}
                  </div>
                  <div className="text-sm text-primary">
                    {props.currentMember.emailAddress}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="p-2 text-xl text-primary">
                  <BsCalendarEvent />
                </div>
                <div>
                  <div className="text-sm text-black/70">Ngày tạo</div>
                  <div className="font-bold text-primary">
                    {toDate(new Date())}
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-10">
              <div className="mb-5">
                <div className="mb-2 font-bold text-gray">Tên hạng mục</div>
                <TextInputSimple
                  placeholder="Ví dụ: Kiểm thử lần 1"
                  name="title"
                  value={postMilestone.title}
                  onChange={getPostMilestone}
                  error={error.title}
                />
              </div>
              <div className="mb-5">
                <div className="mb-2 font-bold text-gray">Nội dung</div>
                <TextAreaSimple
                  placeholder="Đây là lần kiểm thử dự án lần 1"
                  name="content"
                  value={postMilestone.content}
                  onChange={getPostMilestone}
                  rows={10}
                  error={error.content}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                <ButtonCancel
                  type="trans"
                  text="Đóng"
                  onClick={closeAddMileStoneModal}
                />
              </div>
              <div>
                <Button
                  text="Hoàn tất"
                  onClick={onUpdate ? updateMileStone : addMileStone}
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ProjectMilestones;
