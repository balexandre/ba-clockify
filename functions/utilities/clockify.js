const axios = require('axios');
const logger = require('./logger');

const CLOCKIFY = {
  APIKEY: process.env.CLOCKIFY_APIKEY,
  USER: process.env.CLOCKIFY_USER,
  WORKSPACE: process.env.CLOCKIFY_WORKSPACE,
  BASE_URL: 'https://api.clockify.me/api/v1',
};

const callApi = url => {
  logger.log(url);
  return axios({
    method: 'get',
    url,
    headers: {
      'X-Api-Key': CLOCKIFY.APIKEY,
      'content-type': 'application/json',
    },
  });
};

const getAllClients = () => {
  const url = `${CLOCKIFY.BASE_URL}/workspaces/${CLOCKIFY.WORKSPACE}/projects`;
  return callApi(url);
};

const getAllProjects = () => {
  const url = `${CLOCKIFY.BASE_URL}/workspaces/${CLOCKIFY.WORKSPACE}/projects`;
  return callApi(url);
};

const getTimeEntries = (project, start, end) => {
  const url = `${CLOCKIFY.BASE_URL}/workspaces/${CLOCKIFY.WORKSPACE}/user/${CLOCKIFY.USER}/time-entries?project=${project}&start=${start}&end=${end}&consider-duration-format=true`;
  return callApi(url);
};

exports.getProjects = getAllProjects;
exports.getTimeEntries = getTimeEntries;
