import { useEffect, useState } from "react";
import ToastError from "../../../Components/Alert/ToastError";
import projectApi from "../../../API/Project/projectApi";
import TextInputSimple from "../../../Components/Input/TextInputSimple";
import { BiSearch } from "react-icons/bi";
import Loading from "../../../Components/Loading/Loading";
import MemberRequestCard from "../../../Components/Card/MemberRequestCard";
import { find, isEmpty, pull } from "lodash";
import { BsCheckSquareFill } from "react-icons/bs";
import ToastSuccess from "../../../Components/Alert/ToastSuccess";

const MemberRequests = (props) => {
  const [requests, setRequests] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedRequests, setSelectedRequests] = useState(
    props.selectedRequests
  );
  const [requestCount, setRequestCount] = useState(
    props.selectedRequests.length
  );
  const [activeReload, setActiveReload] = useState(false);

  const [loading, setLoading] = useState(false);

  const getSearch = (e) => {
    setSearch(e.target.value);
  };

  const getSelectedRequest = (request) => {
    const exRequest = find(selectedRequests, request);
    if (exRequest) {
      const newRequests = pull(selectedRequests, exRequest);
      setRequestCount(newRequests.length);
      setSelectedRequests(newRequests);
      props.getSelectedRequests(newRequests);
    } else {
      const newRequests = [...selectedRequests, request];
      setRequestCount(newRequests.length);
      setSelectedRequests(newRequests);
      props.getSelectedRequests(newRequests);
    }
  };

  const getOneRequest = (request) => {
    setRequestCount(1);
    setSelectedRequests([request]);
    props.getSelectedRequests([request]);
  };

  const rejectRequest = async (request) => {
    setLoading(true);
    try {
      const response = await projectApi.updateJoinRequest({
        requestId: request.requestId,
        status: "rejected",
      });
      if (response.success) {
        ToastSuccess({ text: "Từ chối yêu cầu thành công" });
        setActiveReload(!activeReload);
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
    setLoading(false);
  };

  useEffect(() => {
    const getRequests = async () => {
      setLoading(true);
      try {
        const response = await projectApi.getProjectJoinRequest(
          props.projectId,
          {
            status: "created",
            MemberEmail: search,
          }
        );
        if (response.success) {
          setRequests(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setLoading(false);
    };
    if (search && search !== "") {
      const timer = setTimeout(() => {
        getRequests();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      getRequests();
    }
  }, [props.projectId, search, activeReload]);

  return (
    <div className="border border-slate-200">
      <div className="flex items-center justify-between px-5 py-3 bg-green/10">
        <div className="font-bold text-black/70">
          Duyệt yêu cầu xin tham gia
        </div>
        {!isEmpty(selectedRequests) && (
          <div className="w-1/3 grid grid-cols-2 gap-5">
            <div></div>
            <div
              className="flex items-center gap-2 justify-end text-green cursor-pointer"
              onClick={() => props.getStep(2)}
            >
              <div>
                <BsCheckSquareFill />
              </div>
              <div>Chấp nhận tất cả</div>
            </div>
            {/* <div className="flex items-center gap-2 justify-end text-orange-700 cursor-pointer">
              <div className="text-lg">
                <AiFillCloseSquare />
              </div>
              <div>Từ chối tất cả</div>
            </div> */}
          </div>
        )}
      </div>
      <div className="p-5">
        <div
          className={`grid grid-cols-2 ${
            !isEmpty(selectedRequests) ? "mb-5" : "mb-10"
          }`}
        >
          <div>
            <div className="font-bold text-xl mb-2">Danh sách yêu cầu</div>
            <div className="text-sm text-orange-600 font-bold">
              Số yêu cầu tham gia: {requests.length}
            </div>
          </div>
          <div className="flex justify-end items-center">
            <div className="w-3/4">
              <TextInputSimple
                icon={<BiSearch />}
                value={search}
                name="search"
                onChange={getSearch}
                label="Tìm kiếm"
                placeholder="Tìm kiếm"
              />
            </div>
          </div>
        </div>
        {!isEmpty(selectedRequests) && (
          <div className="mb-5">
            <div className="flex items-center gap-2 text-green font-bold">
              <div>
                <BsCheckSquareFill />
              </div>
              <div>Đã chọn {requestCount} thành viên</div>
            </div>
          </div>
        )}
        <div>
          {loading ? (
            <Loading />
          ) : (
            <>
              <div className="grid grid-cols-3 gap-5">
                {!isEmpty(requests) ? (
                  requests.map((request) => {
                    return (
                      <MemberRequestCard
                        key={request.requestId}
                        request={request}
                        getSelectedRequest={() => getSelectedRequest(request)}
                        confirm={() => {
                          getOneRequest(request);
                          props.getStep(2);
                        }}
                        cancel={() => {
                          rejectRequest(request);
                        }}
                        isSelected={
                          find(props.selectedRequests, request) ? true : false
                        }
                      />
                    );
                  })
                ) : (
                  <div className="font-bold text-center col-span-3">
                    Không có yêu cầu tham gia nào
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberRequests;
