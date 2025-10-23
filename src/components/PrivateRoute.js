import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ isLoggedIn, ...props }) =>
  isLoggedIn ? <Route {...props} /> : <Redirect to="/kharpi" />;

export default PrivateRoute;
