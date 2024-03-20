import axios from "axios";
import * as helper from "./serviceHelpers"

const endpoint = `${helper.API_HOST_PREFIX}/api/sharestory`


const getStories = () => {
    const config = {
        method: "GET",
        url: endpoint,
        crossdomain: true,
        headers: { "Content-Type": "application/json" },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError)
};

const getStoryFiles = () => {
    const config = {
        method: "GET",
        url: `${endpoint}/files`,
        crossdomain: true,
        headers: { "Content-Type": "application/json" },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError)
}

const deleteStories = (id) => {
    const config = {
        method: "DELETE",
        url: `${endpoint}/${id}`,
        crossdomain: true,
        headers: { "Content-Type": "application/json" },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError)
};

const updateApprovalStatus = (id, payload) =>{
    const config = {
        method: "Put",
        url: `${endpoint}/isApproved/${id}`,
        data: payload,
        crossdomain: true,
        headers: { "Content-Type": "application/json" },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError)

}

const addStory = (payload) =>{
    const config = {
        method: "Post",
        url: endpoint,
        data: payload,
        crossdomain: true,
        headers: { "Content-Type": "application/json" },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError)

}

const shareStoryServices = {
    getStories,
    deleteStories,
    updateApprovalStatus,
    addStory,
    getStoryFiles
}


export default shareStoryServices;