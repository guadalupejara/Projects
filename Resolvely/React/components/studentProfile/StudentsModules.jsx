import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import Flex from "components/common/Flex";
import debug from "sabio-debug";
import toastr from "toastr";
import moduleService from "services/moduleService";
import ModuleDetailsApi from "./ModuleDetailsApi";
import PropTypes from "prop-types";

const _logger = debug.extend("StudentM");

function StudentsModules({ User }) {
  const [modules, setModules] = useState({
    completedModule: [],
    incompleteModule: [],
  });
  useEffect(() => {
    moduleService
      .GetByStudentIdPlusMod(User.id)
      .then(onModulesSuccess)
      .catch(onModuleError);
  }, []);

  const onModulesSuccess = (data) => {
    const newArr = data.items;
    setModules((prevState) => {
      let newState = { ...prevState };
      newState.completedModule = newArr
        .filter((item) => item.isCompleted)
        .map(renderModuleCards);
      newState.incompleteModule = newArr
        .filter((item) => !item.isCompleted)
        .map(renderModuleCards);
      return newState;
    });
  };

  const onModuleError = (err) => {
    _logger("onGetModuleErr", err);
    toastr.error("Unable to retrieve data", err);
  };

  const renderModuleCards = (oneModule) => {
    const moduleImage = oneModule.isCompleted
      ? oneModule.module.imageUrl
      : "https://i.pinimg.com/736x/e7/44/29/e744291f2d2ee7f1036d035e7cbf3804.jpg";
    return (
      <ModuleDetailsApi
        key={oneModule.module.id}
        module={{
          ...oneModule,
          module: { ...oneModule.module, imageUrl: moduleImage },
        }}
      />
    );
  };
  return (
    <Container fluid>
      <Row className="justify-content-center mb-4 mt-4">
        <Col md={12}>
          <Card>
            <CardHeader className="bg-body-tertiary">
              <Flex justifyContent="between">
                <h5 className="mb-0">Modules</h5>
              </Flex>
            </CardHeader>
            <CardBody>
              <Row>
                {modules.completedModule}
                {modules.incompleteModule}
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
export default StudentsModules;

StudentsModules.propTypes = {
  User: PropTypes.shape({
    id: PropTypes.number.isRequired,
    avatarUrl: PropTypes.string,
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    mi: PropTypes.string,
    lastName: PropTypes.string.isRequired,
  }),
};
