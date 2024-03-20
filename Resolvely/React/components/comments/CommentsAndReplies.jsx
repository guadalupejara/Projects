import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Col, Row } from "react-bootstrap";
import "./comment.css";
import debug from "sabio-debug";
import ReplyForm from "./ReplyForm";

const _logger = debug.extend("CommentsAndReplies");

function CommentsAndReplies(props) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [parentId, setParentId] = useState(null);
  const handleReplyClick = (parentId) => {
    _logger(`Reply to ${parentId}`);
    setParentId(parentId);
    setShowReplyForm(true);
  };
  return (
    <div>
      {props.comments.map((comment) => (
        <div key={comment.id} className="comment-container">
          <Row>
            <Col className="mb-2">
              <div>
                <p className="comment-text col-12">{comment.text}</p>
                <div className="ms-10">
                  <Button
                    className="reply-button btn-info"
                    size="sm"
                    onClick={() => handleReplyClick(comment.id)}
                  >
                    Reply
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
          {comment.replies && comment.replies.length > 0 && (
            <div>
              {comment.replies.map((reply) => (
                <Row key={reply.id} className="reply-container">
                  <Col className="mb-2">
                    <div>
                      <p className="comment-text col-12">{reply.text}</p>
                      <div>
                        <Button
                          className="reply-button btn-info"
                          size="sm"
                          onClick={() => handleReplyClick(comment.id)}
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              ))}
            </div>
          )}
        </div>
      ))}
      {showReplyForm && (
        <ReplyForm
          parentId={parentId}
          entityTypeId={props.entityTypeId}
          reply={props.reply}
          entityId={props.entityId}
          setShowReplyForm={setShowReplyForm}
        />
      )}
    </div>
  );
}

CommentsAndReplies.propTypes = {
  entityId: PropTypes.number,
  entityTypeId: PropTypes.number,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      replies: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          text: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
  reply: PropTypes.func,
};

export default CommentsAndReplies;
