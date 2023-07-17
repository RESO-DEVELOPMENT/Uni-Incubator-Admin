import { toDateWithTime } from "../../Ultilities/Date";
import { isEmpty } from "lodash";
import Loading from "../Loading/Loading";
import Paginate from "../Paginate/Paginate";
import { FixTextNoId, toVN } from "../../Ultilities/String";
import { GiTwoCoins } from "react-icons/gi";
import { BiDonateHeart } from "react-icons/bi";
import { BsBook, BsCashCoin, BsGear } from "react-icons/bs";

const ProjectTransactionsTable = (props) => {
  const getPage = (page) => {
    props.getPage(page);
  };
  return (
    <div>
      <table className="w-full border border-slate-200">
        <thead className="bg-green/10 py-2 text-black/70">
          <tr>
            <th className="py-3 w-1/6">ID giao dịch</th>
            <th className="py-3 w-1/6">Mô tả</th>
            <th className="py-3 w-1/6">Biến động</th>
            <th className="py-3 w-1/6">Số dư khả dụng</th>
            <th className="py-3 w-1/6">Loại giao dịch</th>
            <th className="py-3 w-1/6">Thời gian thực hiện</th>
          </tr>
        </thead>
        <tbody className="relative">
          {!props.loading ? (
            <>
              {!isEmpty(props.transactions) ? (
                props.transactions.map((transaction) => {
                  return (
                    <tr key={transaction.transactionId}>
                      <td className="py-2">
                        <div className="font-bold text-black/70 text-sm px-2">
                          {transaction.transactionId}
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="text-primary text-sm">
                          {transaction.note
                            ? FixTextNoId(transaction.note)
                            : "N/A"}
                        </div>
                      </td>
                      <td className="py-2">
                        <div
                          className={`flex items-center gap-2 justify-center font-bold tracking-wider ${
                            !transaction.isReceived
                              ? "text-red-500"
                              : "text-green"
                          }`}
                        >
                          <div>{`${
                            !transaction.isReceived ? "-" : "+"
                          }${transaction.amount.toLocaleString()}`}</div>
                          <div>
                            <GiTwoCoins />
                          </div>
                        </div>
                      </td>
                      <td className="py-2">
                        <div
                          className={`flex items-center gap-2 justify-center font-bold tracking-wider text-yellow-500`}
                        >
                          <div>{transaction.amountLeft.toLocaleString()}</div>
                          <div>
                            <GiTwoCoins />
                          </div>
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="flex items-center gap-2 text-primary justify-center font-bold tracking-wider">
                          {transaction.transactionType
                            ?.toLowerCase()
                            .includes("sponsor") ? (
                            <div className="text-lg text-green">
                              <BiDonateHeart />
                            </div>
                          ) : transaction.transactionType
                              ?.toLowerCase()
                              .includes("system") ? (
                            <div className="text-lg text-green">
                              <BsGear />
                            </div>
                          ) : transaction.transactionType
                              ?.toLowerCase()
                              .includes("voucher") ? (
                            <div className="text-lg text-green">
                              <BsCashCoin />
                            </div>
                          ) : transaction.transactionType
                              ?.toLowerCase()
                              .includes("project") ? (
                            <div className="text-lg text-green">
                              <BsBook />
                            </div>
                          ) : (
                            <div className="text-lg text-green">
                              <GiTwoCoins />
                            </div>
                          )}
                          <div>{toVN(transaction.transactionType)}</div>
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="text-center text-primary font-bold text-sm">
                          {toDateWithTime(transaction.createdAt)}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10}>
                    <div className="text-center py-3 font-bold text-black/70">
                      Không có giao dịch nào
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
      {!isEmpty(props.transactions) && (
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

export default ProjectTransactionsTable;
