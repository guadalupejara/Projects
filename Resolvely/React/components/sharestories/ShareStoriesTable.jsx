import React, { useEffect, useState } from "react";
import debug from "sabio-debug";
import shareStoryServices from "services/shareStoryServices";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "./sharestoriesCSS.css";
import PropTypes from "prop-types";
import ShareStoriesTableCard from "./ShareStoriesTableCard";
import SharedStoriesModal from "./SharedStoriesModal";
import { Card } from "react-bootstrap";
const _logger = debug.extend("ActiveStories");

function ShareStoriesTable({ currentUser }) {
  const [storiesS, setStories] = useState({ data: [], components: [] });
  const [showModal, setShowModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState();
  useEffect(() => {
    shareStoryServices
      .getStories()
      .then(onGetStoriesSuccess)
      .catch(onGetStoriesError);
  }, []);
  const onGetStoriesSuccess = (data) => {
    setStories((prevState) => {
      _logger("data", data.items);
      const newState = { ...prevState };
      const stories = data.items;
      newState.data = stories;
      newState.components = stories.map(storiesMapper);
      return newState;
    });
  };
  const onGetStoriesError = (err) => {
    _logger("onGetStoriesError", err);
    toast.error("Getting Stories Error", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };
  const handleDeleteClick = (storyId) => {
    onDelete(storyId);
  };
  const onDelete = (storyId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085D6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        _logger("Delete module with ID:", storyId);
        shareStoryServices
          .deleteStories(storyId)
          .then(onDeleteSuccess(storyId))
          .catch(onDeleteError);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };
  const onDeleteSuccess = (idToBeDeleted) => {
    setStories((prevState) => {
      const newState = { ...prevState };
      newState.data = newState.data.filter(
        (story) => story.id !== idToBeDeleted
      );
      newState.components = newState.data.map(storiesMapper);
      return newState;
    });
  };
  const onDeleteError = (err) => {
    _logger("onDeleteError:", err);
    toast.error("Deletion Error", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };
  const handleCancelClick = () => {
    setShowModal(false);
  };
  const handleDetailClick = (story) => {
    setSelectedStory(story);
    setShowModal(true);
  };
  const handleUnapprovedClick = (story) => {
    const payload = {
      id: story.Story.id,
      isApproved: false,
      createdBy: story.Story.createdBy,
      approvedBy: currentUser.id,
      comment: story.Comment,
    };
    updateApprovalStatus(story.Story.id, payload);
  };
  const handleApprovedClick = (story) => {
    const payload = {
      id: story.id,
      isApproved: true,
      createdBy: story.createdBy,
      approvedBy: currentUser.id,
    };
    updateApprovalStatus(story.id, payload);
  };
  const updateApprovalStatus = (id, payload) => {
    shareStoryServices
      .updateApprovalStatus(id, payload)
      .then(onUpdateSuccess)
      .catch(onUpdateError);
  };
  const onUpdateSuccess = (response) => {
    _logger("new response", response);
    const updatedStory = response.item;
    setStories((prevState) => {
      const newState = { ...prevState };
      newState.data = newState.data.map((story) => {
        if (story.id === updatedStory.id) {
          return { ...updatedStory };
        } else {
          return story;
        }
      });
      newState.components = newState.data.map(storiesMapper);
      return newState;
    });
    setSelectedStory(updatedStory);
    toast.success("Update Successful", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };
  const onUpdateError = (err) => {
    _logger("onUpdateError:", err);
    toast.error("Update Error", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };
  const storiesMapper = (story) => {
    return (
      <ShareStoriesTableCard
        key={story.id}
        id={story.id}
        name={story.name}
        story={story.story}
        isApproved={story.isApproved}
        dateCreated={story.dateCreated}
        deleteRequest={() => handleDeleteClick(story.id)}
        detailRequest={() => handleDetailClick(story)}
      />
    );
  };

  return (
    <React.Fragment>
      <ToastContainer />
      {showModal && (
        <SharedStoriesModal
          story={selectedStory}
          unapprovedRequest={(email, story) =>
            handleUnapprovedClick(email, story)
          }
          approvedRequest={() => handleApprovedClick(selectedStory)}
          cancelRequest={handleCancelClick}
        />
      )}
      <Card>
        <table className="table table-hover table-with-border col-3">
          <thead>
            <tr className="table-with-border">
              <th scope="col" className="single-line">
                Title
              </th>
              <th scope="col" className="single-line">
                Story
              </th>
              <th scope="col" className="single-line">
                Is Approved
              </th>
              <th scope="col" className="single-line">
                Date Created
              </th>
            </tr>
          </thead>
          <tbody>{storiesS.components}</tbody>
        </table>
      </Card>
    </React.Fragment>
  );
}
ShareStoriesTable.propTypes = {
  currentUser: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    mi: PropTypes.string,
    lastName: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
  }),
};
export default ShareStoriesTable;
