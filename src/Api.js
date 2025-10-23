import axios from "axios";

// Config
import { API_URL } from "./config";
const data = localStorage.getItem("token");
// axios.defaults.headers.common["Authorization"] = TOKEN;
const Token = "1234566";
// {
//   data && data !== "null" && data !== ""
//     ? ((axios.defaults.headers.common["Authorization"] = data),
//     : ((axios.defaults.headers.common["Authorization"] = Token),
// }
if (data && data !== "null" && data !== "") {
  axios.defaults.headers.common["Authorization"] = data;
} else {
  axios.defaults.headers.common["Authorization"] = Token;
}
// const header = {
//   headers: {
//     Authorization: `${TOKEN}`,
//   },
// };

const Api = axios.create({
  baseURL: API_URL,
  // header,
});

export default Api;
