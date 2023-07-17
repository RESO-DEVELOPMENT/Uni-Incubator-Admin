import { authAction } from "../Slice/userSlice";
import { onHubMessageReceivedWithNoti } from "./signalrConnection";

const signalrMiddleware = (store) => (next) => (action) => {
  if (!authAction.loginAgain.match(action)) {
    return next(action);
  }
  onHubMessageReceivedWithNoti();
  next(action);
};

export default signalrMiddleware;
