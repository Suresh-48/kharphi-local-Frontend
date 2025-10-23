import React, { Component, Suspense, useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";

// routes config
import routes from "../../routes";
import HeaderNavbar from "../../components/core/HeaderNavbar";
import DashboardSidebar from "../../components/core/DashboardSidebar";
import ChatBotConversation from "../../components/ChatBotConversation/ChatBotConversation";
import { OpenInBrowserOutlined } from "@mui/icons-material";
import NavbarLoginBefore from "./navbar";

const PublicFooter = React.lazy(() => import("./PublicFooter"));

const DefaultLayout = (props) => {
  const LandingPage = props?.name;
  const sideClose = props?.location?.state?.sidebar;
  const [role, setrole] = useState("");
  const [open, setopen] = useState(false);
  const loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>;

  const value = () => {
    setopen(!open);
  };

  useEffect(() => {
    let role = localStorage.getItem("role");
    setrole(role);
  }, [sideClose]);

  let showNav = "";

  return (
    <div className="app">
      <div className="app-body">
        <div>
          {role ? <DashboardSidebar onClick={value} open={open} sidebar={sideClose} /> : null}
          {role ? <HeaderNavbar sidebar={sideClose} open={open} /> : <NavbarLoginBefore />}

          {/* <div className={`${open ? "site-maincontent home-content" : "site-maincontent active home-content"}`}> */}
          <div
            className={`${
              role
                ? open
                  ? "site-maincontent home-content"
                  : "site-maincontent active home-content"
                : LandingPage === "LandingPage"
                ? " home-content-login"
                : "home-page-landing-navbar"
            }`}
          >
            <div className="footer-min-height">
              <Suspense>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={(props) => <route.component {...props} />}
                      />
                    ) : (
                      ""
                    );
                  })}
                </Switch>
              </Suspense>
            </div>
            <ChatBotConversation />
            {LandingPage === "LandingPage" ? null : (
              <footer className={`footer footer-content ${showNav}`}>
                <Suspense fallback={loading()}>
                  <PublicFooter sidebar={sideClose} />
                </Suspense>
              </footer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
// {
//   role ? (
//     <div className={`${open ? "site-maincontent home-content" : "site-maincontent active home-content"}`}>
//       <div>
//         <Suspense>
//           <Switch>
//             {routes.map((route, idx) => {
//               return route.component ? (
//                 <Route
//                   key={idx}
//                   path={route.path}
//                   exact={route.exact}
//                   name={route.name}
//                   render={(props) => <route.component {...props} />}
//                 />
//               ) : (
//                 ""
//               );
//             })}
//           </Switch>
//         </Suspense>
//         <ChatBotConversation />
//       </div>
//       <footer className={`footer footer-content ${showNav}`}>
//         <Suspense fallback={loading()}>
//           <PublicFooter sidebar={sideClose} />
//         </Suspense>
//       </footer>
//     </div>
//   ) : (
//     <div className={`${open ? "home-content-login" : "active home-content-login"}`}>
//       <div style={{ minHeight: "calc(100vh - 200px)" }}>
//         <Suspense>
//           <Switch>
//             {routes.map((route, idx) => {
//               return route.component ? (
//                 <Route
//                   key={idx}
//                   path={route.path}
//                   exact={route.exact}
//                   name={route.name}
//                   render={(props) => <route.component {...props} />}
//                 />
//               ) : (
//                 ""
//               );
//             })}
//           </Switch>
//         </Suspense>
//         <ChatBotConversation />
//       </div>
//       <footer className={`footer footer-content ${showNav}`}>
//         <Suspense fallback={loading()}>
//           <PublicFooter sidebar={sideClose} />
//         </Suspense>
//       </footer>
//     </div>
//   );
// }
