import Button from "../Button/Button";
import Loading from "../Loading/Loading";
import { toDate } from "./../../Ultilities/Date";

const EmployeeLevelTable = (props) => {
  return (
    <div className="bg-white p-5 pb-1 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div className="font-bold">
          <div className="text-xl">Thành viên được lên level trong chu kỳ</div>
          <div className="text-green">Tổng số: {props.members.length}</div>
        </div>
        {props.memebers && (
          <div>
            <Button text="Xem" />
          </div>
        )}
      </div>
      <div className="mt-8">
        {props.loading ? (
          <div className="mb-5">
            <Loading />
          </div>
        ) : (
          <>
            {props.members && props.members.length > 0 ? (
              <table className="table-auto w-full text-left text-gray-700">
                <thead>
                  <tr>
                    <th className="w-1/5 pb-5 text-center">Email</th>
                    <th className="w-auto pb-5 text-center">Tên thành viên</th>
                    <th className="w-1/5 pb-5 text-center">Level mới</th>
                    <th className="w-1/5 pb-5 text-center">
                      Thời gian thay đổi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {props.members.map((member) => {
                    return (
                      <tr key={member.member.memberId}>
                        <td className="pb-5 text-center">
                          <div className="grid truncate">
                            {member.member.emailAddress}
                          </div>
                        </td>
                        <td className="pb-5 text-center">
                          {member.member.fullName}
                        </td>
                        <td className="pb-5 text-center">
                          {member.level.levelName}
                        </td>
                        <td className="pb-5 text-center">
                          {toDate(member.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-center font-bold text-lg mb-5">
                Không có thành viên
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeLevelTable;
