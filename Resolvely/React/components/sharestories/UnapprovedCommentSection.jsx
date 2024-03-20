import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import debug from 'sabio-debug';
import "./sharestoriesCSS.css";
import sharedStoriesCommentSchema from "schemas/sharedStoriesCommentSchema";
import PropTypes from "prop-types";

const _logger = debug.extend("UnapprovedModal");

function UnapprovedCommentSection(prop) {
    const cancelClick = () => {
        prop.cancel();
    }
    const handleSubmit = (values) => {
      const emailPayload = {
          Comment: values.comment, 
          Story: {
              ...prop.data,
          }
      };
      _logger("email", emailPayload)
      prop.submit(emailPayload);
      prop.cancel();
  }
    return (
        <Formik
            initialValues={{
                comment: ""
            }}
            validationSchema={sharedStoriesCommentSchema}
            onSubmit={handleSubmit}
        >
            {({ errors, touched }) => (
                <Form>
                    <div className='modal-body border'>
                        <h3>Comment</h3>
                        <div className="form-group">
                            <label htmlFor="comment" className="col-form-label">Message:</label>
                            <Field
                                as="textarea"
                                className={`form-control ${errors.comment && touched.comment ? "is-invalid" : ""}`}
                                id="comment"
                                name="comment"
                                placeholder="Student will recieve an email with this comment upon story disapproval."
                            />
                            <ErrorMessage name="comment" component="div" className="invalid-feedback" />
                        </div>
                    </div>
                    <div className='modal-footer'>
                        <button type="submit" className="btn btn-primary">Submit</button>
                        <button type="button" className="btn btn-warning cancelColor-Btn" onClick={cancelClick}>Close</button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}

UnapprovedCommentSection.propTypes = {
    cancel:PropTypes.func,
    submit:PropTypes.func,
    story: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      email: PropTypes.string,
      story: PropTypes.string,
      createdBy: PropTypes.number,
      approvedBy: PropTypes.number,
      userDataJson: PropTypes.arrayOf(PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
        ])),
      isApproved: PropTypes.oneOf([null, false, true]),
    })
};
export default UnapprovedCommentSection;