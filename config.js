import dotenv from "dotenv";
dotenv.config({ silent: true });
const { PORT, REACT_APP_URL, NODE_ENV, REACT_APP_API_URL, REACT_APP_DEFAULT_API_KEY } = process.env;

export const port = PORT;
