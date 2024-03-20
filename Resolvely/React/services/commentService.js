import axios from "axios";
import * as helper from "./serviceHelpers"

const commentService = {
    endpoint: `${helper.API_HOST_PREFIX}/api/comments`
};

commentService.createComment = (payload) => {
    const config = {
        method: "POST",
        url: commentService.endpoint,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { "Content-Type": "application/json" } 
      };
      return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
}


commentService.createReply = (payload, parentId) => {
    const config = {
        method: "POST",
        url: `${commentService.endpoint}/${parentId}`,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { "Content-Type": "application/json" } 
      };
      return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
}

commentService.getByEntityId = (entityTypeId, entityId) => {
    const config = {
        method: "GET",
        url: `${commentService.endpoint}/${entityTypeId}/${entityId}`,
        withCredentials: true,
        crossdomain: true,
        headers: { "Content-Type": "application/json" },
      };
      return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
}

export default commentService;