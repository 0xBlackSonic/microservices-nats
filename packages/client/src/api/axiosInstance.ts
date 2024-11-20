import axios from "axios";

const axiosIntance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosIntance;
