import { createRoot } from "react-dom/client";
import { Suspense } from "react";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./store/store.ts";
// import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import ErrorBoundary from "./components/common/ErrorBoundary";


// axios.interceptors.request.use((request: InternalAxiosRequestConfig) => {
//   console.log("Request :" ,request);
//   return request;
// })

// axios.interceptors.response.use((response : AxiosResponse) => {
//   console.log("Response :" ,response);
//   return response;
// })

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <Provider store={store}>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>}>
        <App />
      </Suspense>
    </Provider>
  </ErrorBoundary>
);
