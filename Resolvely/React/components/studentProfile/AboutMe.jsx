import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Collapse } from "react-bootstrap";

function AboutMe() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Card className="mt-4 ms-3">
      <Card.Header className="bg-body-tertiary">
        <h5 className="mb-0">Intro</h5>
      </Card.Header>

      <Card.Body className="text-1000">
        <p>
          Being a highly academic high schooler with a passion for software
          engineering and baseball, I am committed to excelling both in the
          classroom and on the field. With a relentless pursuit of knowledge and
          problem-solving skills, I have thrived in challenging coursework while
          actively participating in extracurricular activities, including
          leading my coding club. I am determined to pursue a college education
          in software engineering while continuing to pursue my passion for
          baseball through a scholarship. Through dedication, discipline, and a
          love for both academics and athletics, I am prepared to embrace the
          opportunities and challenges that lie ahead, striving to make a
          meaningful impact in both realms.
        </p>
        <Collapse in={collapsed}>
          <div>
            <p>
              In addition to my academic achievements and athletic pursuits, I
              am deeply involved in my community, volunteering for local coding
              workshops and youth baseball clinics. These experiences have not
              only enhanced my leadership and teamwork skills but have also
              instilled in me a sense of responsibility and empathy. As I look
              forward to college, I am eager to further develop my technical
              expertise in software engineering while continuing to contribute
              to the vibrant college community through my passion for baseball.
              With a strong foundation in academics, a dedication to my craft,
              and a commitment to service, I am poised to thrive in both the
              academic and athletic arenas, ready to make a positive impact
              wherever I go.
            </p>
          </div>
        </Collapse>
      </Card.Body>

      <Card.Footer className="bg-body-tertiary p-0 border-top d-grid">
        <Button variant="link" onClick={toggleCollapse}>
          Show {collapsed ? "less" : "more"}
          <FontAwesomeIcon
            icon="chevron-down"
            className="ms-2 fs--2"
            transform={collapsed ? "rotate-180" : ""}
          />
        </Button>
      </Card.Footer>
    </Card>
  );
}

export default AboutMe;
