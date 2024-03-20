import axios from "axios";
import * as helper from "./serviceHelpers";

const usersService = {
  endpoint: `${helper.API_HOST_PREFIX}/api/users`,
};

const login = (payload) => {
  const config = {
    method: "POST",
    url: `${usersService.endpoint}/login`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const register = (payload) => {
  const config = {
    method: "POST",
    url: `${usersService.endpoint}/register`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const logOut = () => {
  const config = {
    method: "GET",
    url: `${usersService.endpoint}/logout`,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const getCurrentUser = () => {
  const config = {
    method: "GET",
    url: `${usersService.endpoint}/current`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const confirmUser = (tokenId) => {
  const config = {
    method: "PUT",
    url: `${usersService.endpoint}/confirm?tokenId=${tokenId}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const forgotPassword = (email) => {
  const config = {
    method: "POST",
    url: `${usersService.endpoint}/forgot?email=${email}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const changePassword = (payload) => {
  const config = {
    method: "PUT",
    url: `${usersService.endpoint}/changepassword`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const updateUserProfile = (payload) => {
  const config = {
    method: "PUT",
    url: `${usersService.endpoint}/update?avatarUrl=${payload.avatarUrl}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const getAllUsers = () => {
  const config = {
    method: "GET",
    url: `${usersService.endpoint}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const getStudentById = (id) => {
  const config = {
    method: "GET",
    url: `${usersService.endpoint}/student/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const updateStatus = (id) => {
  const config = {
    method: "PUT",
    url: `${usersService.endpoint}/admin/dashboard/userStatus/deactivate/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const updateBasicUserProfile = (payload) => {
  const config = {
    method: "PUT",
    url: `${usersService.endpoint}/profileupdate`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const parentStudentAdd = (parentData, studentEmail) => {
  const config = {
    method: "POST",
    url: `${usersService.endpoint}/parentstudents/${studentEmail}`,
    data: parentData,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const parentStudentConfirmation = (payload) => {
  const config = {
    method: "PUT",
    url: `${usersService.endpoint}/parentstudenttoken/${payload}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const selectByParentId = (id) => {
  const config = {
    method: "GET",
    url: `${usersService.endpoint}/parentstudent/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
  
}

export  {
  register,
  login,
  getCurrentUser,
  logOut,
  confirmUser,
  forgotPassword,
  changePassword,
  getAllUsers,
  getStudentById,
  updateStatus,
  updateUserProfile,
  updateBasicUserProfile,
  parentStudentAdd,
  parentStudentConfirmation,
  selectByParentId
};
