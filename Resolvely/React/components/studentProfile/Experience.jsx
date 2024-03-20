import { Card, CardBody, CardHeader} from "react-bootstrap";
import debug from 'sabio-debug'
import React, { useEffect, useState } from "react";
import experienceService from "services/experienceService";
import ExperienceCard from "./ExperienceCard";


function Experience() {
  const _logger = debug.extend("Exp")
        

  const [experienceData, setExperienceData] = useState({
    experiences: [],
    mappedExperiences: [],
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
  });

  _logger(experienceData);

  useEffect(() => {
    experienceService
      .getAllExp(experienceData.pageIndex, experienceData.pageSize)
      .then(onGetAllSuccess)
      .catch(onGetAllError);
  }, []);

  const onGetAllSuccess = (response) => {
    _logger("GetAllSuccess response:", response);
    let experienceDetails = response.item.pagedItems;
    const filteredExperiences = experienceDetails.filter(
      (experience) => experience.experienceType.id === 1
    );
    setExperienceData((prevState) => {
      const newState = { ...prevState };
      newState.experiences = filteredExperiences;
      newState.mappedExperiences = filteredExperiences.map(mapExp);
      return newState;
    });
  };

  const onGetAllError = (response) => {
    _logger(
      "There has been an error retrieving the list of experiences:",
      response
    );
  };

  const mapExp = (oneExperience, index) => {
    _logger(oneExperience,"look at me");
    return (
      <ExperienceCard Workexp={oneExperience} key={index} isLast={index === oneExperience.length - 1} />

    );
  };

    return (
        <React.Fragment>
            <Card className=" mt-4 me-3">
              <CardHeader className="bg-body-tertiary"><h4>Experience</h4></CardHeader> 
            
            <CardBody className="fs--1"> 
            {experienceData.mappedExperiences}
            </CardBody>   
            </Card>
        </React.Fragment>
    );
}



export default Experience;
