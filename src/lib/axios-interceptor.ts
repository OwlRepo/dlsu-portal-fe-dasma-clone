import axios from "axios";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";

// Add a response interceptor
axios.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx causes this function to trigger
    return response;
  },
  (error) => {
    // Any status codes outside the range of 2xx cause this function to trigger
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Clear user data from cookies/localStorage
      Cookies.remove("user");

      redirect("/login");
    }

    // Return the error so it can still be handled by the calling code if needed
    return Promise.reject(error);
  }
);

export default axios;
