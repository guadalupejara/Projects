import React from "react";
import debug from 'sabio-debug';
import "./sharestoriesCSS.css";
import PropTypes from "prop-types";
const _logger = debug.extend("StoriesTableCard");

function ShareStoriesTableCard (story){
  _logger(story)
const showApprovalStatus = (status) => {
    if (status.isApproved === true) {
      return 'Yes'
    } else if (status.isApproved === false) {
      return 'No'
    }
   else
   {return 'Pending'}
  }
function formatDateTime(dateTimeString) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const formattedDate = new Date(dateTimeString).toLocaleDateString(
      undefined,
      options
    );
    if (formattedDate === "01/01/1") {
      return "Current";
    }
    return formattedDate;
  }
  function deleteClick () {
    story.deleteRequest(story.id)
  }
  function detailClick(){
    story.detailRequest(story)
  }
    return(
        <React.Fragment>
    <tr key={story.id} className="table-with-border">
    <td>{story.name}</td>
    <td dangerouslySetInnerHTML={{ __html: story.story.length > 400 ? `${story.story.substring(0, 400)}...` : story.story}}>
    </td>
    <td>{showApprovalStatus(story)}</td>
    <td>{formatDateTime(story.dateCreated)}</td>
    <td >
    <div className="d-flex button-container">
      <button  className="btn btn-danger" data-toggle="button" aria-pressed="false" autoComplete="off" onClick={deleteClick}>Delete</button>
     <button type="button"className="btn btn-primary"  data-bs-toggle="modal" data-bs-target="#myModal" onClick={detailClick}>Details</button>
     </div>
    </td>
  </tr>
        </React.Fragment>
    )}
    ShareStoriesTableCard.propTypes = {
      deleteRequest:PropTypes.func,
      detailRequest:PropTypes.func,
        id: PropTypes.number,
        name: PropTypes.string,
        story: PropTypes.string,
       dateCreated: PropTypes.string,
        isApproved: PropTypes.oneOf([null, false, true]),
      }; 
export default ShareStoriesTableCard