import * as Yup from "yup";

const commentSchema = Yup.object().shape({
    text: Yup.string().min(2).max(3000).required("Comment must be within 2 - 3000 letters"),
    entityId: Yup.number().required("Required"),
    entityTypeId: Yup.number().required("Required"),
  });
export default commentSchema;