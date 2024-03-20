import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import FileUpload from "components/Files/FileUpload";
import debug from "sabio-debug";
import { ToastContainer, toast } from "react-toastify";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import PropTypes from "prop-types";
import sharedStorySchema from "schemas/sharedStoryFormSchema";
import { useNavigate } from "react-router-dom";
import shareStoryServices from "services/shareStoryServices";

const _logger = debug.extend("StoryForm");
_logger("logging errors");

function SharedStoriesForm({ currentUser }) {
  const [formData, setStoryData] = useState({
    name: "",
    email: "",
    story: "",
    createdBy: "",
    isApproved: null,
    approvedBy: null,
    batchShareFiles: [],
  });
  const [imageURL, setImageURL] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setStoryData((prevState) => ({
      ...prevState,
      createdBy: currentUser.id,
      email: currentUser.email,
    }));
  }, []);

  const uploadComplete = (response, setFieldValue) => {
    _logger("fileUploaded", response);
    const uploadedURL = response.items[0].url;
    setImageURL(uploadedURL);
    setFieldValue("batchShareFiles", [response.items[0].id]);
    toast.success("Image uploaded successfully!", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const submitBtn = (values) => {
    _logger("This is your data", values);
    shareStoryServices.addStory(values).then(onAddSuccess).catch(onAddError);
  };
  const onAddSuccess = (data) => {
    _logger("Story Created!", data);
    toast.success("Story uploaded successfully!", {
      position: toast.POSITION.TOP_RIGHT,
    });
    navigate("/dashboard");
  };

  const onAddError = () => {
    toast.error("Story upload error", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const updateCharCount = (data) => {
    const tempDiv = document.createElement("div");
    tempDiv.dangerouslySetInnerHTML = data;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  return (
    <React.Fragment>
      <Formik
        enableReinitialize={true}
        initialValues={formData}
        onSubmit={submitBtn}
        validationSchema={sharedStorySchema}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <div className="story Container">
            <div className="row">
              <ToastContainer />
              <Form className="col-md-6 card p-2 bg-light">
                <h5 className="text-center">Story Form</h5>
                <div className="form-group" id="name">
                  <label>Story Title</label>
                  <Field
                    type="text"
                    className="form-control  form-control-lg"
                    id="name"
                    name="name"
                  />
                  <ErrorMessage name="name" component="div" />
                </div>
                <div className="form-group">
                  <label>Image Upload</label>
                  <div className="border border-dotted border-secondary p-2 rounded">
                    <FileUpload
                      isMultiple={false}
                      name="batchShareFiles"
                      uploadComplete={(response) =>
                        uploadComplete(response, setFieldValue)
                      }
                    />
                  </div>
                  <ErrorMessage name="imageUrl" component="div" />
                </div>

                <div className="form-group">
                  <label>Story Content</label>
                  <CKEditor
                    name="story"
                    editor={ClassicEditor}
                    config={{ placeholder: "Hello, this is my content!" }}
                    data={values.story}
                    onReady={(editor) => {
                      _logger("Editor is ready to use!", editor);
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setFieldValue("story", data);
                      updateCharCount(data);
                    }}
                  />
                </div>
                <ErrorMessage name="story" component="div" />
                <button
                  type="submit"
                  id="submit"
                  className="btn btn-primary mt-2"
                  disabled={isSubmitting}
                >
                  Submit
                </button>
              </Form>
              <div className="blog-preview col-md-6">
                <div className="card p-2 bg-light">
                  {imageURL ? (
                    <img
                      src={imageURL}
                      className="card-img-top object-fit-cover sharedStories-img"
                      alt="card-img"
                    />
                  ) : (
                    <></>
                  )}

                  <div className="card-body text-center">
                    <h3 className="card-title">{values.name}</h3>
                    <p
                      className="card-text"
                      id="story"
                      dangerouslySetInnerHTML={{ __html: values.story }}
                    ></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Formik>
    </React.Fragment>
  );
}
SharedStoriesForm.propTypes = {
  currentUser: PropTypes.shape({
    avatarUrl: PropTypes.string,
    email: PropTypes.string,
    firstName: PropTypes.string,
    mi: PropTypes.string,
    lastName: PropTypes.string,
    role: PropTypes.string,
    id: PropTypes.number,
    isLoggedIn: PropTypes.bool.isRequired,
  }),
};

export default SharedStoriesForm;
