import React from "react";
import debug from "sabio-debug";
import PropTypes from "prop-types";
import { Col } from "react-bootstrap";
import Flex from "components/common/Flex";
import Avatar from "components/common/Avatar";

const _logger = debug.extend("ModuleCard");

function ModuleCard(props) {
  _logger("Props to card", props);
  let moduleData = props.module;
  _logger("Props to use", moduleData);
  return (
    <>
      <Col md={3} className="mb-4">
        <Flex direction="column" alignItems="center">
          <Avatar size="4xl" width={56} src={moduleData.module.imageUrl} />
          <div className="text-center mt-2">
            <p className="text-xl mb-0">{moduleData.module.title}</p>
            <p className="text-muted mb-0">{moduleData.module.description}</p>
          </div>
        </Flex>
      </Col>
    </>
  );
}

ModuleCard.propTypes = {
  module: PropTypes.shape({
    module: PropTypes.shape({
      isCompleted: PropTypes.bool.isRequired,
      description: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      imageUrl: PropTypes.string,
      title: PropTypes.string.isRequired,
    }).isRequired,
    student: PropTypes.shape({
      avatarUrl: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      lastName: PropTypes.string.isRequired,
      mi: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default ModuleCard;
