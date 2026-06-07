import axios from "axios";

/* =====================================================
   AXIOS INSTANCE
===================================================== */

const api = axios.create({

  baseURL: process.env.NEXT_PUBLIC_API_URL,

  timeout: 10000,

  headers: {

    "Content-Type":
      "application/json",
  },
});

/* =====================================================
   DEBUG BASE URL
===================================================== */

console.log(
  "AXIOS BASE URL:",
  api.defaults.baseURL
);

/* =====================================================
   REQUEST INTERCEPTOR
===================================================== */

api.interceptors.request.use(

  (config) => {

    console.log(
      "REQUEST URL:",
      `${config.baseURL}${config.url}`
    );

    if (
      typeof window !== "undefined"
    ) {

      const token =
        localStorage.getItem(
          "token"
        );

      if (token) {

        config.headers.Authorization =
          `Bearer ${token}`;
      }
    }

    return config;
  },

  (error) => {

    console.error(
      "REQUEST ERROR:",
      error
    );

    return Promise.reject(error);
  }
);

/* =====================================================
   RESPONSE INTERCEPTOR
===================================================== */

api.interceptors.response.use(

  (response) => {

    console.log(
      "RESPONSE SUCCESS:",
      response.data
    );

    return response;
  },

  (error) => {

    console.error(
      "AXIOS RESPONSE ERROR:",
      error
    );

    // console.error(
    //   "MESSAGE:",
    //   error.message
    // );

    // console.error(
    //   "STATUS:",
    //   error.response?.status
    // );

    // console.error(
    //   "RESPONSE:",
    //   error.response?.data
    // );

    // console.error(
    //   "CONFIG:",
    //   error.config
    // );

    return Promise.reject(error);
  }
);

export default api;