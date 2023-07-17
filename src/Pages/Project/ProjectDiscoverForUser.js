import { TopBar } from "../Layout/TopBar";
import { useState, useEffect } from "react";
import DateInput from "../../Components/Input/DateInput";
import CardProjectStatistic from "../../Components/Card/CardProjectStatistic";
import ToastError from "../../Components/Alert/ToastError";
import projectApi from "../../API/Project/projectApi";
import { concat, isEmpty } from "lodash";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../../Components/Loading/Loading";

const ProjectDiscoverForUser = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(false);

  const [pageSize] = useState(5);
  const [createdPage, setCreatedPage] = useState(2);
  const [startedPage, setStartedPage] = useState(2);
  const [endedPage, setEndedPage] = useState(2);
  const [cancelPage, setCancelPage] = useState(2);

  const [createdMore, setCreatedMore] = useState(true);
  const [startedMore, setstartedMore] = useState(true);
  const [endedMore, setEndedMore] = useState(true);
  const [cancelMore, setCancelMore] = useState(true);

  const [createdProjects, setCreatedProjects] = useState([]);
  const [startedProjects, setStartedProjects] = useState([]);
  const [endedProjects, setEndedProjects] = useState([]);
  const [cancelProjects, setCancelProjects] = useState([]);

  const [totalCreated, setTotalCreated] = useState(0);
  const [totalStarted, setTotalStarted] = useState(0);
  const [totalEnded, setTotalEnded] = useState(0);
  const [totalCancel, setTotalCancel] = useState(0);

  document.title = "Dự án | UniCare";

  const getStartDate = (date) => {
    setStartDate(date);
  };

  const getEndDate = (date) => {
    setEndDate(date);
  };

  const getCreatedProjects = async () => {
    try {
      const response = await projectApi.get({
        page: createdPage,
        "page-size": pageSize,
        Status: "created",
        OrderBy: "dateDesc",
        StartAfter: startDate.startDate,
        EndBefore: endDate.endDate,
      });
      if (response.success) {
        const pagination = JSON.parse(response.headers.pagination);
        if (createdPage < pagination.totalPages) {
          setCreatedPage(createdPage + 1);
        } else {
          setCreatedMore(false);
        }
        setCreatedProjects(concat(createdProjects, response.data.message));
      } 
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
  };

  const getStartedProjects = async () => {
    try {
      const response = await projectApi.get({
        page: startedPage,
        "page-size": pageSize,
        Status: "started",
        OrderBy: "dateDesc",
        StartAfter: startDate.startDate,
        EndBefore: endDate.endDate,
      });
      if (response.success) {
        const pagination = JSON.parse(response.headers.pagination);
        if (startedPage < pagination.totalPages) {
          setStartedPage(startedPage + 1);
        } else {
          setstartedMore(false);
        }
        setStartedProjects(concat(startedProjects, response.data.message));
      } 
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
  };

  const getEndedProjects = async () => {
    try {
      const response = await projectApi.get({
        page: endedPage,
        "page-size": pageSize,
        Status: "ended",
        OrderBy: "dateDesc",
        StartAfter: startDate.startDate,
        EndBefore: endDate.endDate,
      });
      if (response.success) {
        const pagination = JSON.parse(response.headers.pagination);
        if (endedPage < pagination.totalPages) {
          setEndedPage(endedPage + 1);
        } else {
          setEndedMore(false);
        }
        setEndedProjects(concat(endedProjects, response.data.message));
      } 
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
  };

  const getCancelProjects = async () => {
    try {
      const response = await projectApi.get({
        page: cancelPage,
        "page-size": pageSize,
        Status: "cancelled",
        OrderBy: "dateDesc",
        StartAfter: startDate.startDate,
        EndBefore: endDate.endDate,
      });
      if (response.success) {
        const pagination = JSON.parse(response.headers.pagination);
        if (cancelPage < pagination.totalPages) {
          setCancelPage(cancelPage + 1);
        } else {
          setCancelMore(false);
        }
        setCancelProjects(concat(cancelProjects, response.data.message));
      } 
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
  };

  useEffect(() => {
    const getCreatedProjects = async () => {
      setLoading(true);
      try {
        const response = await projectApi.get({
          page: 1,
          "page-size": pageSize,
          Status: "created",
          OrderBy: "dateDesc",
          StartAfter: startDate.startDate,
          EndBefore: endDate.endDate,
        });
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          setTotalCreated(pagination.totalItems);
          if (pagination.totalPages <= 1) {
            setCreatedMore(false);
          } else {
            setCreatedMore(true);
          }
          setCreatedProjects(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setCreatedPage(2);
      setLoading(false);
    };

    const getStartedProjects = async () => {
      setLoading(true);
      try {
        const response = await projectApi.get({
          page: 1,
          "page-size": pageSize,
          Status: "started",
          OrderBy: "dateDesc",
          StartAfter: startDate.startDate,
          EndBefore: endDate.endDate,
        });
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          setTotalStarted(pagination.totalItems);
          if (pagination.totalPages <= 1) {
            setstartedMore(false);
          } else {
            setstartedMore(true);
          }
          setStartedProjects(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setStartedPage(2);
      setLoading(false);
    };

    const getEndedProjects = async () => {
      setLoading(true);
      try {
        const response = await projectApi.get({
          page: 1,
          "page-size": pageSize,
          Status: "ended",
          OrderBy: "dateDesc",
          StartAfter: startDate.startDate,
          EndBefore: endDate.endDate,
        });
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          setTotalEnded(pagination.totalItems);
          if (pagination.totalPages <= 1) {
            setEndedMore(false);
          } else {
            setEndedMore(true);
          }
          setEndedProjects(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setEndedPage(2);
      setLoading(false);
    };

    const getCancelProjects = async () => {
      setLoading(true);
      try {
        const response = await projectApi.get({
          page: 1,
          "page-size": pageSize,
          Status: "cancelled",
          OrderBy: "dateDesc",
          StartAfter: startDate.startDate,
          EndBefore: endDate.endDate,
        });
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          setTotalCancel(pagination.totalItems);
          if (pagination.totalPages <= 1) {
            setCancelMore(false);
          } else {
            setCancelMore(true);
          }
          setCancelProjects(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setCancelPage(2);
      setLoading(false);
    };

    const getAllProjects = () => {
      getCreatedProjects();
      getStartedProjects();
      getEndedProjects();
      getCancelProjects();
    };

    getAllProjects();
  }, [pageSize, startDate, endDate]);

  return (
    <>
      <TopBar />
      <div className="pl-10 pr-5 mb-10">
        <div className=" bg-white rounded-lg shadow-md p-5">
          <h1 className="mb-8 font-bold text-3xl">Thống kê dự án</h1>

          <div className="grid grid-cols-2 gap-10 mb-8">
            <div className="grid grid-cols-2 gap-10">
              <div>
                <DateInput
                  placeholder="Từ"
                  value={startDate}
                  onChange={getStartDate}
                  useRange={false}
                  asSingle={true}
                  displayFormat={"DD/MM/YYYY"}
                />
              </div>
              <div>
                <DateInput
                  placeholder="Đến"
                  value={endDate}
                  onChange={getEndDate}
                  useRange={false}
                  asSingle={true}
                  displayFormat={"DD/MM/YYYY"}
                />
              </div>
            </div>
          </div>
          <div>
            {loading ? (
              <Loading />
            ) : (
              <div className="grid grid-cols-4 gap-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-per-25"></div>
                    <div className="font-bold">Khởi tạo</div>
                    <div className="p-2 bg-slate-300 w-2 h-2 flex items-center justify-center text-xs rounded-full">
                      {totalCreated}
                    </div>
                  </div>
                  <div className="w-full rounded-md h-1 bg-per-25"></div>
                  <div>
                    <InfiniteScroll
                      dataLength={createdProjects.length}
                      next={getCreatedProjects}
                      hasMore={createdMore}
                      loader={<Loading />}
                    >
                      {isEmpty(createdProjects) && (
                        <div className="text-center mt-3 font-bold text-sm">
                          Không có dự án nào
                        </div>
                      )}
                      {createdProjects.map((project) => {
                        return (
                          <div key={project.projectId} className="mt-5 mb-10">
                            <CardProjectStatistic
                              progress={25}
                              project={project}
                            />
                          </div>
                        );
                      })}
                    </InfiniteScroll>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-per-50"></div>
                    <div className="font-bold">Hiện thực - sửa đổi</div>
                    <div className="p-2 bg-slate-300 w-2 h-2 flex items-center justify-center text-xs rounded-full">
                      {totalStarted}
                    </div>
                  </div>
                  <div className="w-full rounded-md h-1 bg-per-50"></div>
                  <div>
                    <InfiniteScroll
                      dataLength={startedProjects.length}
                      next={getStartedProjects}
                      hasMore={startedMore}
                      loader={<Loading />}
                    >
                      {isEmpty(startedProjects) && (
                        <div className="text-center mt-3 font-bold text-sm">
                          Không có dự án nào
                        </div>
                      )}
                      {startedProjects.map((project) => {
                        return (
                          <div key={project.projectId} className="mt-5 mb-10">
                            <CardProjectStatistic
                              progress={50}
                              project={project}
                            />
                          </div>
                        );
                      })}
                    </InfiniteScroll>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green"></div>
                    <div className="font-bold">Hoàn thiện</div>
                    <div className="p-2 bg-slate-300 w-2 h-2 flex items-center justify-center text-xs rounded-full">
                      {totalEnded}
                    </div>
                  </div>
                  <div className="w-full rounded-md h-1 bg-green"></div>
                  <div>
                    <InfiniteScroll
                      dataLength={endedProjects.length}
                      next={getEndedProjects}
                      hasMore={endedMore}
                      loader={<Loading />}
                    >
                      {isEmpty(endedProjects) && (
                        <div className="text-center mt-3 font-bold text-sm">
                          Không có dự án nào
                        </div>
                      )}
                      {endedProjects.map((project) => {
                        return (
                          <div key={project.projectId} className="mt-5 mb-10">
                            <CardProjectStatistic
                              progress={100}
                              project={project}
                            />
                          </div>
                        );
                      })}
                    </InfiniteScroll>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="font-bold">Hủy bỏ</div>
                    <div className="p-2 bg-slate-300 w-2 h-2 flex items-center justify-center text-xs rounded-full">
                      {totalCancel}
                    </div>
                  </div>
                  <div className="w-full rounded-md h-1 bg-red-500"></div>
                  <div>
                    <InfiniteScroll
                      dataLength={cancelProjects.length}
                      next={getCancelProjects}
                      hasMore={cancelMore}
                      loader={<Loading />}
                    >
                      {isEmpty(cancelProjects) && (
                        <div className="text-center mt-3 font-bold text-sm">
                          Không có dự án nào
                        </div>
                      )}
                      {cancelProjects.map((project) => {
                        return (
                          <div key={project.projectId} className="mt-5 mb-10">
                            <CardProjectStatistic
                              progress={50}
                              project={project}
                            />
                          </div>
                        );
                      })}
                    </InfiniteScroll>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDiscoverForUser;
