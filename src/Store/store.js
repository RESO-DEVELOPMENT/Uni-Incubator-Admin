import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slice/userSlice";
import signalrMiddleware from "./Middlewares/signalr";

const store = configureStore({
  reducer: {
    auth: userReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat([signalrMiddleware])
  },
});

export default store;