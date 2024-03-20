import * as Yup from "yup";

const sharedStoriesCommentSchema = Yup.object().shape({
    comment: Yup.string().required("Comment is required").min(2).max(400)
   
  });
  
  
  export default sharedStoriesCommentSchema;