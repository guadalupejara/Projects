import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import Background from "components/common/Background";
import Avatar from "components/common/Avatar";
import gallery from "assets/img/gallery/2.jpg";
import PropTypes from "prop-types";
import Flex from "components/common/Flex";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import VerifiedBadge from "components/common/VerifiedBadge";
import educationDetailService from "services/educationDetailService";
import toastr from "toastr";
import debug from "sabio-debug";

const _logger = debug.extend("StudentB");

function ProfileBanner({ student }) {
  const [eduDetails, setEduDetails] = useState({
    eduData: [],
  });
  _logger("student", student);
  useEffect(() => {
    educationDetailService
      .selectByUserIdV2(student.id)
      .then(onDetailsSuccess)
      .catch(onDetailsError);
  }, []);

  const onDetailsSuccess = (data) => {
    let newArr = data.item;
    setEduDetails((prevState) => {
      const newState = { ...prevState };
      newState.eduData = newArr;
      return newState;
    });
  };

  const onDetailsError = (err) => {
    toastr.error("Unable to retrieve data", err);
  };

  return (
    <Container fluid>
      <Row>
        <Col lg={12}>
          <Card>
            <CardHeader className="position-relative min-vh-25 mb-7">
              <Background
                image={gallery}
                className="rounded-3 rounded-bottom-0"
              />
              <Avatar
                size="5xl"
                className="avatar-profile"
                src={student.avatarUrl}
                mediaClass="img-thumbnail shadow-sm"
              />
            </CardHeader>
            <CardBody>
              <Row>
                <Col md={8}>
                  <h4>
                    {student.firstName} {student.lastName} <VerifiedBadge />
                  </h4>
                  <h5 className="fs-0 fw-normal">{student.role}</h5>

                  <Button variant="falcon-primary" size="sm" className="px-3">
                    Following
                  </Button>
                </Col>

                <Col md={4} className="mt-2">
                  <Flex alignItems="center">
                    <FontAwesomeIcon
                      icon="user-circle"
                      className="me-2 text-700 font-awesome-icon"
                    />
                    <div className="flex-1">
                      <h3 className="mb-0">
                        Current GPA: {eduDetails.eduData.gpa}
                      </h3>
                    </div>
                  </Flex>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

ProfileBanner.propTypes = {
  User: PropTypes.shape({
    avatarUrl: PropTypes.string,
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    mi: PropTypes.string,
    lastName: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
  }).isRequired,
}.isRequired;

export default ProfileBanner;
