import React, { useState } from "react";
import UnapprovedCommentSection from "./UnapprovedCommentSection";
import debug from "sabio-debug";
import "./sharestoriesCSS.css";
import PropTypes from "prop-types";
const _logger = debug.extend("StoriesModuleCard");

function ShareStoriesModal(props) {
  _logger(props);
  const userData = props.story;
  const [showPopup, setPopup] = useState(false);
  const showApprovalStatus = (userData) => {
    if (userData.isApproved === true) {
      return "Approved";
    } else if (userData.isApproved === false) {
      return "Unapproved";
    } else {
      return "Pending";
    }
  };
  const showApproverName = (userData) => {
    if (userData.isApproved === null) {
      return "Pending";
    } else {
      return `${userData.userDataJson.firstName} ${userData.userDataJson.lastName}`;
    }
  };
  let toggleBtnActive = (buttonState) => {
    if (buttonState === false) {
      var button = document.getElementById("approve");
      button.setAttribute("class", "btn btn-secondary");
      button.disabled = true;
      var button2 = document.getElementById("unapprove");
      button2.setAttribute("class", "btn btn-secondary");
      button2.disabled = true;
      var button3 = document.getElementById("close");
      button3.setAttribute("class", "btn btn-secondary");
      button3.disabled = true;
    } else {
      var defaultBtn = document.getElementById("approve");
      defaultBtn.setAttribute("class", "btn btn-primary");
      defaultBtn.disabled = false;
      var defaultBtn2 = document.getElementById("unapprove");
      defaultBtn2.setAttribute("class", "btn btn-warning unapproveColor-Btn");
      defaultBtn2.disabled = false;
      var defaultBtn3 = document.getElementById("close");
      defaultBtn3.setAttribute("class", "btn btn-danger cancelColor-Btn");
      defaultBtn3.disabled = false;
    }
  };
  const popupCancel = () => {
    toggleBtnActive(true);
    setPopup(false);
  };
  const cancelClick = () => {
    props.cancelRequest();
  };
  const unapproveClick = () => {
    setPopup(true);
    toggleBtnActive(false);
  };
  const approveClick = () => {
    props.approvedRequest(userData);
  };
  return (
    <React.Fragment>
      <div className="modal" tabIndex="-1" style={{ display: "block" }}>
        {" "}
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Approve Story?</h5>
            </div>
            <div className="modal-body">
              <h4>Title: {userData.name}</h4>
              <h4>Email: {userData.email}</h4>
              <p
                dangerouslySetInnerHTML={{ __html: "Story:" + userData.story }}
              ></p>
              <b>Approval Status: {showApprovalStatus(userData)}</b>
              <p>Approver Name: {showApproverName(userData)} </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                id="approve"
                disabled={false}
                className="btn btn-primary"
                onClick={approveClick}
              >
                Approve
              </button>
              <button
                type="button"
                id="unapprove"
                disabled={false}
                className="btn btn-warning unapproveColor-Btn"
                onClick={unapproveClick}
              >
                Unapprove
              </button>
              <button
                type="button"
                id="close"
                disabled={false}
                className="btn btn-danger cancelColor-Btn "
                data-bs-dismiss="modal"
                onClick={cancelClick}
              >
                Close
              </button>
            </div>
            <div>
              {showPopup && (
                <UnapprovedCommentSection
                  cancel={popupCancel}
                  data={userData}
                  submit={(email) => props.unapprovedRequest(email)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
ShareStoriesModal.propTypes = {
  cancelRequest: PropTypes.func.isRequired,
  unapprovedRequest: PropTypes.func.isRequired,
  approvedRequest: PropTypes.func.isRequired,
  story: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    story: PropTypes.string.isRequired,
    createdBy: PropTypes.number.isRequired,
    approvedBy: PropTypes.number,
    userDataJson: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ).isRequired,
    isApproved: PropTypes.oneOf([null, false, true]),
  }),
};
export default ShareStoriesModal;
