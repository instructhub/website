const BASE_URL = (() => {
  if (typeof window === "undefined") {
    if (process.env.NEXT_PUBLIC_API_BASE_URL?.startsWith("http://localhost")) {
      return "http://nginx:80/api/v1";
    }
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  } else {
    return process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com";
  }
})();

export const API_URLS = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    SIGNUP: `${BASE_URL}/auth/signup`,
    LOGOUT: `${BASE_URL}/auth/logout`,
    OAUTH: (oauthProvider: string) => `${BASE_URL}/auth/oauth/${oauthProvider}`,
    CHECK_EMAIL_VERIFY: (userID: string) =>
      `${BASE_URL}/auth/email/verify/check/${userID}`,
    RESEND_VERIFY_EMAIL: `${BASE_URL}/auth/email/verify/resend`,
    REFRESH: `${BASE_URL}/auth/refresh`,
  },
  USER: {
    CHECK_LOGIN: `${BASE_URL}/users/check/login`,
    GET_DATA: `${BASE_URL}/users/personal/profile`,
  },
  COURSES: {
    CREATE: `${BASE_URL}/courses/new`,
    GET: (courseID: string) => `${BASE_URL}/courses/${courseID}`,
    GET_ITEM: (courseID: string, itemID: string) =>
      `${BASE_URL}/courses/${courseID}/${itemID}`,
    CREATE_REVISION: (courseID: string) => `${BASE_URL}/courses/revision/${courseID}`
  },
};

export default API_URLS;
