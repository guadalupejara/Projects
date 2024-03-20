import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import debug from "sabio-debug";
import commentSchema from "../../schemas/commentSchema";
import { Button, Col } from "react-bootstrap";
import commentService from "../../services/commentService";
import CommentsAndReplies from "./CommentsAndReplies";
import PropTypes from "prop-types";
const _logger = debug.extend("CommentsForm");
const ENTITY_TYPE_ID = 2;

function CommentForm({ event }) {
  const ENTITY_ID = event;
  const [comments, setComments] = useState([]);
  const [updatedReply, setupdatedReply] = useState(false);

  const formData = {
    subject: "",
    text: "",
    parentId: 0,
    entityTypeId: ENTITY_TYPE_ID,
    entityId: ENTITY_ID,
    createdBy: {},
  };

  const toggleReply = () => {
    setupdatedReply(!updatedReply);
  };

  const onFetchCommentsSuccess = (response) => {
    _logger("Fetching comments", response.item);
    setComments(response.item);
  };

  const onFetchCommentsError = (error) => {
    _logger("Fetching comments failed", error);
  };

  useEffect(() => {
    commentService
      .getByEntityId(ENTITY_TYPE_ID, ENTITY_ID)
      .then(onFetchCommentsSuccess)
      .catch(onFetchCommentsError);
  }, [updatedReply]);

  const onSubmitForm = (values, { resetForm, setSubmitting }) => {
    _logger("Submit values", values);
    commentService
      .createComment(values)
      .then((response) => {
        _logger("Comment submitted successfully", response);
        resetForm();
        return commentService.getByEntityId(ENTITY_TYPE_ID, ENTITY_ID);
      })
      .then(onFetchCommentsSuccess)
      .catch(onFetchCommentsError);
    setSubmitting(false);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <Formik
            enableReinitialize={true}
            validationSchema={commentSchema}
            onSubmit={onSubmitForm}
            initialValues={formData}
          >
            <Form>
              <div className="form-group">
                <Col>
                  <Field
                    component="textarea"
                    className="form-control comment-text"
                    name="text"
                    placeholder="Leave a comment..."
                  />
                  <ErrorMessage
                    name="text"
                    component="div"
                    className="text-danger"
                  />
                </Col>
              </div>
              <Button className="mt-3" type="submit">
                Add Comment
              </Button>
            </Form>
          </Formik>
          <hr />
          <br />
          <CommentsAndReplies
            entityTypeId={ENTITY_TYPE_ID}
            entityId={ENTITY_ID}
            comments={comments}
            reply={toggleReply}
          />
        </div>
      </div>
    </div>
  );
}
CommentForm.propTypes = {
  event: PropTypes.number,
};
export default CommentForm;
