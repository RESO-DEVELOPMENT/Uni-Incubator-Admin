export const toVN = (text) => {
  if (typeof text === "string") {
    switch (text.toLowerCase()) {
      case "administrator":
        return "Quản trị viên";
      case "admin":
        return "Quản trị viên";
      case "user":
        return "Thành viên";
      case "member":
        return "Thành viên";
      case "manager":
        return "Quản lý";
      case "organization":
        return "Tổ chức";
      case "personal":
        return "Cá nhân";
      case "bussiness":
        return "Doanh nghiệp";
      case "active":
        return "Còn hoạt động";
      case "inactive":
        return "Ngưng hoạt động";
      case "created":
        return "Khởi tạo";
      case "started":
        return "Hiện thực";
      case "ended":
        return "Hoàn thành";
      case "cancelled":
        return "Hủy bỏ";
      case "available":
        return "Còn hoạt động";
      case "unavailable":
        return "Ngưng hoạt động";
      case "drafted":
        return "Nháp";
      case "accepted":
        return "Hoàn tất";
      case "rejected":
        return "Bị từ chối";
      case "paid":
        return "Hoàn tất";
      case "ongoing":
        return "Chờ báo cáo";
      case "locked":
        return "Duyệt báo cáo";
      case "review":
        return "Xem xét";
      case "processed":
        return "Đã xử lý";
      case "systemdeposittoproject":
        return "Hệ thống chuyển tiền";
      case "sponsordeposittoproject":
        return "Tài trợ chuyển tiền";
      case "projectsalary":
        return "Lương dự án";
      case "systemsalary":
        return "Lương";
      case "buyvoucher":
        return "Mua voucher";
      case "membertomember":
        return "Chuyển tiền";
      case "projectreturntosystem":
        return "Trả về hệ thống";
      case "fnb":
        return "F&B";
      case "telecom":
        return "Viễn thông";
      case "shopping":
        return "Mua sắm";
      case "services":
        return "Dịch vụ";
      case "educational":
        return "Giáo dục";
      case "beauty":
        return "Làm đẹp";
      case "entertainment":
        return "Giải trí";
      case "others":
        return "Khác";
      case "pointreturnedtosystem":
        return "Trả về point hệ thống";
      case "pointsplittomembers":
        return "Tạo báo cáo chia point cho thành viên";
      case "stopped":
        return "Dừng";
      case "disabled":
        return "Vô hiệu hóa";
      default:
        return text;
    }
  }
  return text;
};

export const textToColor = (text) => {
  if (typeof text === "string") {
    switch (text.toLowerCase()) {
      case "organization":
        return "orange-500";
      case "personal":
        return "yellow-500";
      case "bussiness":
        return "purple";
      case "active":
        return "green";
      case "inactive":
        return "red-500";
      case "created":
        return "#FF5D9E";
      case "started":
        return "#5B48CC";
      case "ended":
        return "#30BC97";
      case "cancelled":
        return "rgb(239 68 68)";
      case "available":
        return "#30BC97";
      case "unavailable":
        return "rgb(239 68 68)";
      case "drafted":
        return "primary";
      case "accepted":
        return "green";
      case "rejected":
        return "red-500";
      case "paid":
        return "green";
      case "processed":
        return "green";
      case "ongoing":
        return "#5B48CC";
      case "locked":
        return "red";
      case "stopped":
        return "#EF4444";
      case "disabled":
        return "#EF4444";
      default:
        return "black";
    }
  }
  return "black";
};

export const textToColorReport = (text) => {
  if (typeof text === "string") {
    switch (text.toLowerCase()) {
      case "drafted":
        return "primary";
      case "created":
        return "per-25";
      case "accepted":
        return "green";
      case "rejected":
        return "red-500";
      case "cancelled":
        return "red-500";
      case "processed":
        return "green";
      default:
        return "black";
    }
  }
  return "black";
};

export const toVNReport = (text) => {
  if (typeof text === "string") {
    switch (text.toLowerCase()) {
      case "drafted":
        return "Nháp";
      case "created":
        return "Chờ duyệt";
      case "accepted":
        return "Đã duyệt";
      case "rejected":
        return "Bị từ chối";
      case "cancelled":
        return "Bị hủy";
      case "processed":
        return "Đã xử lý";
      default:
        return text;
    }
  }
  return text;
};

export const toVNVoucher = (text) => {
  if (typeof text === "string") {
    switch (text.toLowerCase()) {
      case "created":
        return "Chưa dùng";
      case "used":
        return "Đã dùng";
      case "expired":
        return "Hết hạn";
      default:
        return text;
    }
  }
  return text;
};

export const textToColorVoucher = (text) => {
  if (typeof text === "string") {
    switch (text.toLowerCase()) {
      case "used":
        return "green";
      case "created":
        return "per-25";
      case "expired":
        return "red-500";
      default:
        return "black";
    }
  }
  return "black";
};

export const textToVNEquation = (text) => {
  if (typeof text === "string") {
    switch (text) {
      case "{basePoint} * {workRealHour}":
        return "Lương cơ bản * Giờ làm thực tế";
      case "({softSkill} * {hardSkill} * {workRealHour}) / 10":
        return "(Kỹ năng mềm * Kỹ năng chuyên môn * Giờ làm thực tế) / 10";
      case "{pointPerHour} * {workRealHour}":
        return "Lương theo giờ * Giờ làm thực tế";
      case "{workHour} * 2":
        return "Giờ làm dự kiến * 2";
      default:
        return text;
    }
  }
  return text;
};

export const FixText = (str) => {
  const regex = /(<@([A-Za-z]+):([a-z0-9-]+)>)/g;
  var newStr = str.replace(regex, "$3");
  return newStr;
};

export const FixTextNoId = (str) => {
  const regex = /(<@([A-Za-z]+):([a-z0-9-]+)>)/g;
  var newStr = str.replace(regex, "$2");
  return newStr;
};
