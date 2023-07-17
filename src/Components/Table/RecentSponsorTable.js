import { isEmpty } from "lodash";
import Loading from "../Loading/Loading";
import { textToColor, toVN } from "../../Ultilities/String";
import { toDate } from "../../Ultilities/Date";
import { GiTwoCoins } from "react-icons/gi";

const RecentSponsorTable = (props) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <div className="font-bold">
        <div className="text-xl">Tài trợ nhận được gần đây</div>
      </div>
      <div>
        {props.loading ? (
          <>
            <div className="mb-5">
              <Loading />
            </div>
          </>
        ) : (
          <>
            {!isEmpty(props.sponsors) ? (
              <table className="table-auto w-full text-left text-gray-700 border-separate border-spacing-y-5">
                <thead>
                  <tr>
                    <th className="w-1/4 text-center">Thông tin tài trợ</th>
                    <th className="w-1/4 text-center">Loại tài trợ</th>
                    <th className="w-1/4 text-center">Tổng point</th>
                    <th className="w-1/4 text-center">Thời gian tài trợ</th>
                  </tr>
                </thead>
                <tbody>
                  {props.sponsors?.map((sponsor) => {
                    return (
                      <tr key={sponsor.projectSponsonTracsactionId}>
                        <td className="py-2">
                          <div className="grid grid-cols-3 gap-1 px-5 font-bold">
                            <div>
                              <img
                                className="w-10 h-10 rounded-full"
                                src={
                                  sponsor.projectSponsor.sponsor.imageUrl
                                    ? sponsor.projectSponsor.sponsor.imageUrl
                                    : `https://ui-avatars.com/api/?name=${sponsor.projectSponsor.sponsor.sponsorName}&length=1&background=30BC97&color=FFFFFF`
                                }
                                alt="avatar"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="col-span-2">
                              <div className="truncate text-black/70">
                                {sponsor.projectSponsor.sponsor.sponsorName}
                              </div>
                              <div className="truncate text-sm text-primary/70">
                                {
                                  sponsor.projectSponsor.sponsor
                                    .sponsorDescription
                                }
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-2">
                          <div className="flex items-center gap-2 justify-center font-bold">
                            <div
                              className={`w-3 h-3 rounded-full bg-${textToColor(
                                sponsor.projectSponsor.sponsor.type
                              )}`}
                            ></div>
                            <div>
                              {toVN(sponsor.projectSponsor.sponsor.type)}
                            </div>
                          </div>
                        </td>
                        <td className="py-2 text-center">
                          <div className="flex items-center gap-2 text-green justify-center font-bold tracking-wider">
                            <div>+{sponsor.amount.toLocaleString()}</div>
                            <div>
                              <GiTwoCoins />
                            </div>
                          </div>
                        </td>
                        <td className="py-2 text-center">
                          <div className="text-primary font-bold text-center tracking-wider">
                            {toDate(sponsor.paidAt)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-center font-bold text-lg mb-5">
                Không có dự án
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RecentSponsorTable;
