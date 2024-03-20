import { Card, CardBody, CardHeader} from "react-bootstrap";
import React, { useEffect, useState } from "react";
import experienceService from "services/experienceService";
import debug from 'sabio-debug'
import ExtraCurricularCard from "./ExtraCurricularCard";

function ExtraCurricular() {

    const _logger = debug.extend("ExtraCurr.")

const [experienceData, setExperienceData] = useState({
    experiences: [],
    mappedExperiences: [],
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
  });

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
      (experience) => experience.experienceType.id === 2
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
    return (
      <ExtraCurricularCard experience={oneExperience} key={index} isLast={index === oneExperience.length - 1} />

    );
  };
    
    return (
        <React.Fragment>
            <Card className="mt-4 ms-3 ">
              <CardHeader className="bg-body-tertiary"><h4>ExtraCurricular</h4></CardHeader> 
            
                <CardBody className="mb-3">
                    
                {experienceData.mappedExperiences}
              
                </CardBody>
            </Card>
        </React.Fragment>
    );
}

export default ExtraCurricular;
