import { useNavigate } from "react-router-dom";
import LoginIll from "../../Components/Svgs/loginIll";
import Button from "../../Components/Button/Button";

const Policy = () => {
  document.title = "Điều khoản và dịch vụ | UniCare";

  const navigate = useNavigate();

  return (
    <div className="h-screen flex items-center relative">
      <div className="flex gap-2 absolute top-5 left-5">
        <div>
          <Button text="Đăng nhập" onClick={() => navigate("/login")} />
        </div>
        <div>
          <Button
            type="trans"
            text="Trợ giúp"
            onClick={() =>
              window.open(
                "https://www.facebook.com/Uni.IncubatorVietnam",
                "_blank"
              )
            }
          />
        </div>
      </div>
      <div className="w-1/2">
        <LoginIll />
      </div>
      <div className="h-screen w-1/2 overflow-y-auto p-5">
        <div className="bg-white p-5 leading-10 rounded-lg shadow-md">
          <h1 className="font-bold">I. Giới thiệu về CnB:</h1>
          <p className="font-bold">
            C&B là viết tắt của Compensation and Benefit, tạm dịch: Quản lý
            lương thưởng và phúc lợi.
          </p>
          <p>
            Như vậy, C&B là bộ phận chuyên quản lý và giám sát các quyền lợi của
            người tham gia hệ thống. Các khoản này bao gồm: Tiền lương, tiền
            thưởng, phụ cấp và các chế độ đãi ngộ, khen thưởng, thăng tiến.{" "}
          </p>
          <p>
            C&B kết hợp chặt chẽ với bộ phận nhân sự của công ty để xem xét và
            cập nhật các chính sách liên quan đến phúc lợi và lương thưởng hiện
            có, đồng thời đảm bảo các chính sách này tuân thủ pháp luật hiện
            hành.
          </p>
          <h2 className="font-bold">Công việc của hệ thống C&B</h2>
          <ol>
            <li>
              <p className="font-bold">1. Tính lương</p>
              <p>
                Tính lương là việc đầu tiên cũng là quan trọng nhất với hệ thống
                C&B. Công việc này bao gồm: Tổng hợp đóng góp, tính lương,
                chuyển lương và giải đáp thắc mắc của người tham gia liên quan
                đến vấn đề lương thưởng.
              </p>
              <p>
                Mỗi doanh nghiệp và mỗi ngành nghề sẽ có những cách tính lương
                khác nhau. Ở đây chúng tôi là phân hệ quản lý cho các dự án phần
                mềm, do đó sẽ được tính toán dựa trên sự đóng góp vào các dự án
                thông qua các task.
              </p>
            </li>
            <li className="font-bold">2. Xây dựng cấu trúc phúc lợi</li>
            <li className="font-bold">3. Xây dựng lộ trình thăng tiến</li>
            <li className="font-bold">
              4. Hỗ trợ xây dựng hệ thống chuyển đổi, đảm bảo giá trị các lợi
              ích, phúc lợi của công ty
            </li>
          </ol>
          <h2 className="font-bold">II. Hệ thống UniCnB</h2>
          <p>
            Hệ thống UniCnB là hệ thống CnB được xây dựng trên cơ sở hoạt động
            của vườn ươm Uni Incubator. Đây là hệ thống có thể hỗ trợ, đánh giá
            các thành viên làm việc trên các dự án và để ghi nhận các điểm số,
            các đóng góp theo kỳ của từng thành viên. Hệ thống sẽ tự động tính
            toán tiền trợ cấp và chuyển về ví của mỗi thành viên, cũng như việc
            thăng tiến được thực hiện hoàn toàn tự động theo kiểu Bottom-Up
            (tích lũy đủ sẽ được thăng tiến)
          </p>
          <p>
            Hệ thống của chúng tôi là hệ thống CnB - quản lý dự án - phúc lợi
            thành viên. Chúng tôi cung cấp các công cụ quản lý:
          </p>
          <ul>
            <li>
              <span className="font-bold">1. Quản lý nhân sự:</span> Quản lý các
              thành viên tham gia vào các dự án khởi nghiệp của vườn ươm.
            </li>
            <li>
              <span className="font-bold">2. Quản lý dự án:</span> Quản lý tất
              cả các dự án khởi nghiệp trong khuôn viên vườn ươm Uni Incubator,
              theo đó các dự án từ lúc khởi tạo đến lúc xét duyệt thực hiện sẽ
              được quản lý một cách cụ thể, có hệ thống.
            </li>
            <li>
              <span className="font-bold">
                3. Quản lý phúc lợi - trợ cấp - thăng tiến cho thành viên:
              </span>{" "}
              Dựa trên đóng góp, năng lực của thành viên tích góp được qua các
              dự án tham gia, hệ thống sẽ tính toán các khoảng trợ cấp, phúc lợi
              cho thành viên theo từng kỳ (tính bằng Point). Qua đó các kinh
              nghiệm tích lũy được trong các dự án (tính bằng XP) sẽ cộng dồn và
              tự động thăng cấp cho thành viên tham gia.
            </li>
            <li>
              <span className="font-bold">
                4. Quản lý nhà tài trợ, nhà cung cấp các phúc lợi:
              </span>{" "}
              Dựa trên tính triển vọng của dự án, các nhà tài trợ sẽ tham gia
              tài trợ cho dự án bằng point. Ngoài ra còn có nhà cung cấp, đây là
              đơn vị đối tác cung cấp các dịch vụ quy đổi giá rị của point dưới
              dạng voucher các dịch vụ nằm trong hệ sinh thái của Uni Incubator.
            </li>
          </ul>
          <p className="font-bold">
            Vì vậy, tại Uni CnB, chúng tôi cung cấp các giải pháp quản lý về mặt
            tính toán phúc lợi cho thành viên tham gia, không hỗ trợ quản lý
            task và các vấn đề liên quan đến chấm công.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Policy;
