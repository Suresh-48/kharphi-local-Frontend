import React from "react";

import { Col, Card } from "react-bootstrap";

import CountUp from "react-countup";

import { Link } from "react-router-dom";

// Style
import "../../css/DashBoard.scss";

function DashboardTiles({ label, count, url }) {
  return (
    <>
      <Col xs={12} sm={12} md={4} lg={4} className="mt-3">
        {url ? (
          <Card className="card-style-dashboard mt-3">
            <Link to={url} className="text-decoration">
              <div className="student-count-style">
                <h5 className="">{label}</h5>
                <h4 className="mb-0">
                  <CountUp end={count} duration={1} className="dashboard-card-color" />
                </h4>
              </div>
            </Link>
          </Card>
        ) : (
          <Card className="card-style-dashboard mt-3">
            <div className="student-count-style">
              <h5 className="">{label}</h5>
              <h4 className="mb-0 ">
                <div>
                  <CountUp end={count} duration={1} className="dashboard-card-color" />
                </div>
              </h4>
            </div>
          </Card>
        )}
      </Col>
    </>
  );
}

export default DashboardTiles;
