import React from "react";
import PropTypes from "prop-types";
import { Container } from "react-bootstrap";
import ProfileBanner from "./ProfileBanner";
import AboutMe from "./AboutMe";
import Education from "./Education";
import StudentsModules from "./StudentsModules";
import Experience from "./Experience";
import ExtraCurricular from "./Extracurricular";
import debug from "sabio-debug";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getStudentById } from "services/usersService";

function StudentProfile() {
  const _logger = debug.extend("StudentProfile");
  const { id } = useParams();
  _logger(id);
  const [student, setStudent] = useState();

  useEffect(() => {
    getStudentById(id)
      .then(onStudentInfoSucess)
      .catch((response) => {
        _logger(response);
      });
  }, []);

  const onStudentInfoSucess = (response) => {
    let sd = response.item;

    setStudent((prevState) => {
      let studData = { ...prevState };
      studData = sd;
      return studData;
    });
  };

  return (
    <React.Fragment>
      <Container className="d-flex flex-column">
        {student && (
          <ProfileBanner key={student.id} student={student}></ProfileBanner>
        )}
        <div className="row">
          <div className="col-md-8">
            <AboutMe></AboutMe>
            <ExtraCurricular></ExtraCurricular>
          </div>

          <div className="col-md-4">
            <Education></Education>
            <Experience></Experience>
          </div>
        </div>

        {student && (
          <StudentsModules key={student.id} User={student}></StudentsModules>
        )}
      </Container>
    </React.Fragment>
  );
}

StudentProfile.propTypes = {
  currentUser: PropTypes.shape({
    avatarUrl: PropTypes.string,
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    mi: PropTypes.string,
    lastName: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
  }),
};

export default StudentProfile;
