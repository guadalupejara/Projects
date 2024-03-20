import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import PropTypes from 'prop-types'; 
import debug from 'sabio-debug';
import commentSchema from '../../schemas/commentSchema';
import { Button, Col } from 'react-bootstrap';
import commentService from '../../services/commentService';

const _logger = debug.extend("ReplyForm");

function ReplyForm(props) {
  const parentId = props.parentId
  const [formData] = useState({
    subject:" ",
    text: "",
    parentId, 
    entityId: props.entityId,
    entityTypeId: props.entityTypeId
  });

  const onSubmitButton = (values, { resetForm, setSubmitting }) => {
    commentService.createReply(values, parentId)
      .then((response) => {
        _logger("Reply submitted successfully", response);
        props.reply(false)
        resetForm();
      })
      .catch((error) => {
        _logger("Error submitting reply", error);
      })
     setSubmitting(false);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-6">
          <Formik
            enableReinitialize={true}
            validationSchema={commentSchema}
            onSubmit={onSubmitButton}
            initialValues={formData}
          >
            <Form>
              <div className="form-group my-2">
                <Col xl={12} lg={12} md={12} sm={12}>
                  <Field
                    component="textarea"
                    className="form-control reply-text"
                    name="text"
                    placeholder="Write your reply..."
                  />
                  <ErrorMessage name="text" component="div" className="text-danger" />
                </Col>
              </div>
            
              <Button type='submit'>Add Reply</Button>
              
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}

ReplyForm.propTypes = {
  parentId: PropTypes.number.isRequired, 
  entityTypeId: PropTypes.number,
  entityId:PropTypes.number,
  reply: PropTypes.func
};

export default ReplyForm;
