import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./store/store.ts";
// import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";


// axios.interceptors.request.use((request: InternalAxiosRequestConfig) => {
//   console.log("Request :" ,request);
//   return request;
// })

// axios.interceptors.response.use((response : AxiosResponse) => {
//   console.log("Response :" ,response);
//   return response;
// })

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
