import axios from "axios";

const axiosConfig = {
  baseURL: process.env.VUE_APP_ROOT_API,
  timeout: 30000,
};

const Axios = axios.create(axiosConfig);

export default Axios;
