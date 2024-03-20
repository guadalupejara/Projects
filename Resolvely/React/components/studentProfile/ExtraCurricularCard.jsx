import React from "react";
import PropTypes from "prop-types";


function ExtraCurricularCard (props) {

        
const extraCurrExp= props.experience;


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
         <div>
        <h5>{extraCurrExp.jobTitle}</h5>
        <h6>{extraCurrExp.companyName}</h6>
        <h6>{formatDateTime(extraCurrExp.startDate)} - {formatDateTime(extraCurrExp.endDate)}</h6>
        <p>
          {extraCurrExp.description}
        </p>
        </div>
        </React.Fragment>
    );
}

ExtraCurricularCard.propTypes = {
    experience: PropTypes.shape({
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

export default ExtraCurricularCard;