// import logo from "../../Pictures/cnb_logo.png";
import Sidebar from "../Navigate/Sidebar";

const DashboardLoading = () => {
  
  return (
    <div className="flex h-screen">
      {/* SIDE BAR */}
      {/* <div className="sticky h-screen shadow-md bg-white p-2 w-64 top-0">
        <div className="flex justify-center py-5">
          <img className="w-52" src={logo} alt="UniCare" />
        </div>
        <div className="py-5"></div>
        <div className="overflow-x-hidden">
          <div className="font-bold rounded-sm mb-4 animate-pulse bg-green/30 w-60 h-12"></div>
          <div className="font-bold rounded-sm mb-4 animate-pulse bg-green/30 w-60 h-12"></div>
          <div className="font-bold rounded-sm mb-4 animate-pulse bg-green/30 w-60 h-12"></div>
          <div className="font-bold rounded-sm mb-4 animate-pulse bg-green/30 w-60 h-12"></div>
          <div className="font-bold rounded-sm mb-4 animate-pulse bg-green/30 w-60 h-12"></div>
          <div className="font-bold rounded-sm mb-4 animate-pulse bg-green/30 w-60 h-12"></div>
        </div>
      </div> */}
      <Sidebar />
      {/* MIDDLE */}
      <div className="flex flex-auto justify-between px-5">
        <div className="grow px-16">
          <div className="my-10 h-12 sticky top-3 bg-green/30 animate-pulse"></div>
          <div className="flex justify-between mb-10">
            <div className="bg-white rounded-lg shadow-md font-bold w-56 h-40 p-5 content-middle text-xl flex flex-col justify-center">
              <div className="bg-green/30 animate-pulse w-36 h-5 rounded-lg mb-3"></div>
              <div className="bg-green/30 animate-pulse w-20 h-5 rounded-lg"></div>
            </div>
            <div className="bg-white rounded-lg shadow-md font-bold w-56 h-40 p-5 content-middle text-xl flex flex-col justify-center">
              <div className="bg-green/30 animate-pulse w-36 h-5 rounded-lg mb-3"></div>
              <div className="bg-green/30 animate-pulse w-20 h-5 rounded-lg"></div>
            </div>
            <div className="bg-white rounded-lg shadow-md font-bold w-56 h-40 p-5 content-middle text-xl flex flex-col justify-center">
              <div className="bg-green/30 animate-pulse w-36 h-5 rounded-lg mb-3"></div>
              <div className="bg-green/30 animate-pulse w-20 h-5 rounded-lg"></div>
            </div>
          </div>
          <div className="mb-10">
            <div className="bg-white p-5 pb-1 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <div className="bg-green/30 animate-pulse h-5 px-60 rounded-lg mb-3"></div>
                  <div className="bg-green/30 animate-pulse h-5 w-24 rounded-lg"></div>
                </div>
                <div>
                  <div className="px-12 h-10 rounded-lg bg-green/30 animate-pulse"></div>
                </div>
              </div>
              <div className="mt-8">
                <table className="table-auto w-full text-left text-gray-700">
                  <thead>
                    <tr>
                      <th className="w-1/5 pb-5">
                        <div className="bg-green/30 animate-pulse w-20 h-5 rounded-lg"></div>
                      </th>
                      <th className="w-auto pb-5">
                        <div className="bg-green/30 animate-pulse w-40 h-5 rounded-lg"></div>
                      </th>
                      <th className="w-1/5 pb-5">
                        <div className="bg-green/30 animate-pulse w-20 h-5 rounded-lg"></div>
                      </th>
                      <th className="w-1/5 pb-5">
                        <div className="bg-green/30 animate-pulse w-20 h-5 rounded-lg"></div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="pb-5">
                        <div className="bg-green/30 animate-pulse w-24 h-5 rounded-lg"></div>
                      </td>
                      <td className="pb-5">
                        <div className="bg-green/30 animate-pulse w-60 h-5 rounded-lg"></div>
                      </td>
                      <td className="pb-5">
                        <div className="bg-green/30 animate-pulse w-24 h-5 rounded-lg"></div>
                      </td>
                      <td className="pb-5">
                        <div className="bg-green/30 animate-pulse w-24 h-5 rounded-lg"></div>
                      </td>
                    </tr>
                    <tr>
                      <td className="pb-5">
                        <div className="bg-green/30 animate-pulse w-24 h-5 rounded-lg"></div>
                      </td>
                      <td className="pb-5">
                        <div className="bg-green/30 animate-pulse w-60 h-5 rounded-lg"></div>
                      </td>
                      <td className="pb-5">
                        <div className="bg-green/30 animate-pulse w-24 h-5 rounded-lg"></div>
                      </td>
                      <td className="pb-5">
                        <div className="bg-green/30 animate-pulse w-24 h-5 rounded-lg"></div>
                      </td>
                    </tr>
                    <tr>
                      <td className="pb-5">
                        <div className="bg-green/30 animate-pulse w-24 h-5 rounded-lg"></div>
                      </td>
                      <td className="pb-5">
                        <div className="bg-green/30 animate-pulse w-60 h-5 rounded-lg"></div>
                      </td>
                      <td className="pb-5">
                        <div className="bg-green/30 animate-pulse w-24 h-5 rounded-lg"></div>
                      </td>
                      <td className="pb-5">
                        <div className="bg-green/30 animate-pulse w-24 h-5 rounded-lg"></div>
                      </td>
                    </tr>
                    <tr>
                      <td className="pb-5">
                        <div className="bg-green/30 animate-pulse w-24 h-5 rounded-lg"></div>
                      </td>
                      <td className="pb-5">
                        <div className="bg-green/30 animate-pulse w-60 h-5 rounded-lg"></div>
                      </td>
                      <td className="pb-5">
                        <div className="bg-green/30 animate-pulse w-24 h-5 rounded-lg"></div>
                      </td>
                      <td className="pb-5">
                        <div className="bg-green/30 animate-pulse w-24 h-5 rounded-lg"></div>
                      </td>
                    </tr>
                    <tr>
                      <td className="pb-5">
                        <div className="bg-green/30 animate-pulse w-24 h-5 rounded-lg"></div>
                      </td>
                      <td className="pb-5">
                        <div className="bg-green/30 animate-pulse w-60 h-5 rounded-lg"></div>
                      </td>
                      <td className="pb-5">
                        <div className="bg-green/30 animate-pulse w-24 h-5 rounded-lg"></div>
                      </td>
                      <td className="pb-5">
                        <div className="bg-green/30 animate-pulse w-24 h-5 rounded-lg"></div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="w-64">
          <div className="my-10 flex items-center gap-2 justify-end">
            <div className="h-5 w-32 bg-green/30 animate-pulse rounded-lg"></div>
            <div>
              <div className="w-12 h-12 rounded-md bg-green/30 animate-pulse"></div>
            </div>
          </div>
          <div className="mb-10">
            <div className="h-40 w-64 bg-white shadow-md rounded-lg flex flex-col justify-center p-5">
              <div className="bg-green/30 animate-pulse w-36 h-6 rounded-lg mb-5"></div>
              <div className="bg-green/30 animate-pulse w-24 h-5 rounded-lg mb-2"></div>
              <div className="bg-green/30 animate-pulse w-20 h-3 rounded-lg"></div>
            </div>
          </div>
          <div className="mb-10">
            <div className="h-80 w-64 bg-white shadow-md rounded-lg p-5">
              <div className="bg-green/30 animate-pulse w-44 h-7 rounded-lg mb-5"></div>
              <div className="bg-green/30 animate-pulse w-20 h-5 rounded-lg mb-3"></div>
              <div className="bg-green/30 animate-pulse w-36 h-4 rounded-lg mb-6"></div>
              <div className="bg-green/30 animate-pulse w-56 h-40 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLoading;
