import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import Avatar from "components/common/Avatar";
import { logOut } from "services/usersService";
import { toast } from "react-toastify";

const ProfileDropdown = ({ currentUser }) => {
  const navigate = useNavigate();

  const logOutClickHandler = () => {
    logOut().then(logOutSuccesHandler).catch(logOutErrorHandler);
  };

  const logOutSuccesHandler = () => {
    toast.success("Logged Out!");
    navigate("/login");
  };

  const logOutErrorHandler = () => {
    toast.error("Error Occurred!", "Please try to logout again.");
  };

  const redirectByRoleDashboard = () => {
    let redirectByRoleUrl = "";

    if (currentUser.role === "Student") {
      return (redirectByRoleUrl = "/dashboard");
    } else if (currentUser.role === "Admin") {
      return (redirectByRoleUrl = "/dashboard");
    } else if (currentUser.role === "Parent") {
      redirectByRoleUrl = "/dashboard";
    }

    return redirectByRoleUrl;
  };

      const redirectByRoleProfile = () => {
    let redirectByRoleUrl = "";

    if (currentUser.role === "Student") {
      return (redirectByRoleUrl = `/user/details/${currentUser.id}`);
    } else if (currentUser.role === "Admin") {
      return (redirectByRoleUrl = "/dashboard");
    } else if (currentUser.role === "Parent") {
      redirectByRoleUrl = "/dashboard";
    }

    return redirectByRoleUrl;
  };

  return (
    <Dropdown navbar={true} as="li">
      <Dropdown.Toggle
        bsPrefix="toggle"
        // as={Link}
        // to=""
        className="pe-0 ps-2 nav-link border-0"
      
      >
        <Avatar src={currentUser.avatarUrl} />
      </Dropdown.Toggle>
      {currentUser.role === "Student" ?
      <Dropdown.Menu className="dropdown-caret dropdown-menu-card dropdown-menu-end">
        <div className="bg-white rounded-2 py-2 dark__bg-1000">
          <Dropdown.Item className="fw-bold text-warning">
            <FontAwesomeIcon icon="fa-user" className="me-1" />
            <span>Hello, {currentUser.firstName}!</span>
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item as={Link} to={redirectByRoleDashboard()}>
            Dashboard
          </Dropdown.Item>
          <Dropdown.Divider />
           <Dropdown.Item as={Link} to={redirectByRoleProfile()}>
            Profile
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={logOutClickHandler}>Logout</Dropdown.Item>
        </div>
      </Dropdown.Menu> : <Dropdown.Menu className="dropdown-caret dropdown-menu-card dropdown-menu-end">
        <div className="bg-white rounded-2 py-2 dark__bg-1000">
          <Dropdown.Item className="fw-bold text-warning">
            <FontAwesomeIcon icon="fa-user" className="me-1" />
            <span>Hello, {currentUser.firstName}!</span>
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item as={Link} to={redirectByRoleDashboard()}>
            Dashboard
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={logOutClickHandler}>Logout</Dropdown.Item>
        </div> 
        </Dropdown.Menu>}
    </Dropdown>
  );
};

ProfileDropdown.propTypes = {
  currentUser: PropTypes.shape({
    avatarUrl: PropTypes.string,
    email: PropTypes.string,
    firstName: PropTypes.string,
    mi: PropTypes.string,
    lastName: PropTypes.string,
    role: PropTypes.string,
    id: PropTypes.number,
    isLoggedIn: PropTypes.bool.isRequired,
  }),
};

export default ProfileDropdown;
