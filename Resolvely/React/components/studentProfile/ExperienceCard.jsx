import VerifiedBadge from "components/common/VerifiedBadge";
import Flex from "components/common/Flex";
import React from "react";
import PropTypes from "prop-types";


function ExperienceCard(props) {
  
        
const work= props.Workexp;


 function formatDateTime(datetimeString) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const formattedDate = new Date(datetimeString).toLocaleDateString(
      undefined,
      options
    );
    if (formattedDate === "01/01/1") {
      return "Current";
    }
    return formattedDate;
  }
  
    return (
        <React.Fragment>
           <Flex>
       <div className="flex-1 position-relative ps-3">
          <h6 className="fs-0 mb-0">{work.jobTitle}</h6>
          <p className="mb-1">{work.companyName}<VerifiedBadge/></p>
          <p className="text-1000 mb-0">{formatDateTime(work.startDate)}-{formatDateTime(work.endDate)}</p>
          <p className="text-1000 mb-0">{work.city},{work.state}</p>
          {!props.isLast && <div className="border-dashed border-bottom my-3" />}
          </div>
      </Flex>
        </React.Fragment>
    );
}

ExperienceCard.propTypes = {
    Workexp: PropTypes.shape({
      id: PropTypes.number.isRequired,
      experienceType: PropTypes.string.isRequired,
      isCurrent: PropTypes.number.isRequired,
      startDate: PropTypes.instanceOf(Date).isRequired,
      endDate: PropTypes.instanceOf(Date),
      jobTitle: PropTypes.string.isRequired,
      companyName: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }).isRequired,
   
  }.isRequired;

export default ExperienceCard;
