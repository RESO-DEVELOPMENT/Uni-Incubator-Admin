import { toDate } from "../../Ultilities/Date";
import { GiTwoCoins } from "react-icons/gi";
import { BsArrowRight } from "react-icons/bs";
import Paginate from "../Paginate/Paginate";
import Loading from "../Loading/Loading";
import { isEmpty } from "lodash";
import { textToColor, toVN } from "../../Ultilities/String";

const ProjectSponsorTable = (props) => {
  const getPage = (page) => {
    props.getPage(page);
  };

  return (
    <div>
      <table className="w-full border border-slate-200">
        <thead className="bg-green/10 py-2 text-black/70">
          <tr>
            <th className="py-3 w-1/6">Thông tin nhà tài trợ</th>
            <th className="py-3 w-1/6">Loại tài trợ</th>
            <th className="py-3">Tổng point tài trợ</th>
            <th className="py-3">Point tài trợ gần nhất</th>
            <th className="py-3">Ngày tài trợ gần nhất</th>
            <th className="py-3">Ngày tham gia</th>
            {props.currentMember.role === "ADMIN" && (
              <th className="py-3">Chi tiết</th>
            )}
          </tr>
        </thead>
        <tbody className="relative">
          {!props.loading ? (
            <>
              {!isEmpty(props.sponsors) ? (
                props.sponsors.map((sponsor) => {
                  return (
                    <tr key={sponsor.sponsor.sponsorId}>
                      <td className="w-1/6 py-2">
                        <div className="grid grid-cols-3 gap-1 px-5 font-bold py-1">
                          <div>
                            <img
                              className="w-10 h-10 rounded-full"
                              src={
                                sponsor.sponsor.imageUrl
                                  ? sponsor.sponsor.imageUrl
                                  : `https://ui-avatars.com/api/?name=${sponsor.sponsor.sponsorName}&length=1&background=30BC97&color=FFFFFF`
                              }
                              alt="avatar"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="col-span-2">
                            <div className="truncate text-black/70">
                              {sponsor.sponsor.sponsorName}
                            </div>
                            <div className="truncate text-sm text-primary/70">
                              {sponsor.sponsor.sponsorDescription}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="w-1/6 py-2">
                        <div className="flex items-center gap-2 justify-center font-bold">
                          <div
                            className={`w-3 h-3 rounded-full bg-${textToColor(
                              sponsor.sponsor.type
                            )}`}
                          ></div>
                          <div>{toVN(sponsor.sponsor.type)}</div>
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="flex items-center gap-2 text-yellow-500 justify-center font-bold tracking-wider">
                          <div>{sponsor.sponsor.totalPoint}</div>
                          <div>
                            <GiTwoCoins />
                          </div>
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="text-primary font-bold text-center tracking-wider">
                          {sponsor.lastDepositAmount}
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="text-primary font-bold text-center tracking-wider">
                          {toDate(sponsor.lastDepositDate)}
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="text-primary font-bold text-center tracking-wider">
                          {toDate(sponsor.createdAt)}
                        </div>
                      </td>
                      {props.currentMember.role === "ADMIN" && (
                        <td className="py-2">
                          <div className="flex justify-center items-center">
                            <div
                              className="p-2 rounded-full hover:bg-green/10 text-green flex items-center justify-center cursor-pointer"
                              onClick={() => props.goToSponsorDetail(sponsor)}
                            >
                              <BsArrowRight />
                            </div>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10}>
                    <div className="text-center py-3 font-bold text-black/70">
                      Không có nhà tài trợ nào
                    </div>
                  </td>
                </tr>
              )}
            </>
          ) : (
            <tr>
              <td colSpan={10}>
                <Loading />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {!isEmpty(props.sponsors) && (
        <div className="mt-5">
          <Paginate
            page={props.page}
            pageSize={props.pageSize}
            totalPages={props.totalPages}
            currentPage={props.currentPage}
            getPage={getPage}
          />
        </div>
      )}
    </div>
  );
};

export default ProjectSponsorTable;
