import React from "react";
import { Card, CardBody, CardHeader } from "react-bootstrap";
import Avatar from "components/common/Avatar";
import gallery from "assets/img/logos/staten.png";
import Flex from "components/common/Flex";
import VerifiedBadge from "components/common/VerifiedBadge";

function Education() {
  const renderEduCard = (
    image,
    Institution,
    Certification,
    StartDate,
    EndDate,
    Location
  ) => (
    <Flex>
      <Avatar size="3xl" width={56} src={image} />
      <div className="flex-1 position-relative ps-3">
        <h6 className="fs-0 mb-0">
          {Institution} <VerifiedBadge />
        </h6>
        <p className="mb-1">{Certification}</p>
        <p className="text-1000 mb-0">
          {StartDate}-{EndDate}
        </p>
        <p className="text-1000 mb-0">{Location}</p>
      </div>
    </Flex>
  );
  return (
    <React.Fragment>
      <Card className=" mt-4 me-3">
        <CardHeader className="bg-body-tertiary">
          <h4>Education</h4>
        </CardHeader>

        <CardBody className="fs--1">
          {renderEduCard(
            gallery,
            "Staten Island Technical High School",
            "Higher Secondary School Certificate, Science",
            "2020",
            "2024",
            "New York, CA"
          )}
          <div className="border-dashed border-bottom my-3"></div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
}

export default Education;
