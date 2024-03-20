import * as Yup from "yup";

const sharedStorySchema = Yup.object().shape({
  name: Yup.string().required("Title is required").min(2).max(100),
  batchShareFiles: Yup.array().required("ImageUrl is required").min(1),
  story: Yup.string().required("Content is required").min(2).max(3000)
});


export default sharedStorySchema;