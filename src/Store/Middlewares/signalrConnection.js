import { HubConnectionBuilder } from "@microsoft/signalr";
import ToastNotification from "../../Components/Alert/ToastNotification";

let connection;

const getSignalRConnection = () => {
  if (connection) {
    return connection;
  }

  connection = new HubConnectionBuilder()
    .withUrl("https://api.uniinc-cnb.com/userhub", {
      accessTokenFactory: () => localStorage.getItem("TOKEN"),
    })
    .withAutomaticReconnect()
    .build();

  connection.start().catch((error) => console.log(error));

  return connection;
};

const onHubMessageReceived = (callback) => {
  const connection = getSignalRConnection();
  
  connection.on("NewNotification", () => {
    callback();
  });
};

const onHubMessageReceivedWithNoti = (callback) => {
  const connection = getSignalRConnection();

  connection.on("NewNotification", (data) => {
    ToastNotification({ data: data });
    callback();
  });
};

const closeSignalRConnection = () => {
  if (connection) {
    connection.stop();
    connection = null;
  }
};

export { onHubMessageReceivedWithNoti, onHubMessageReceived, closeSignalRConnection  };
