import axiosInstance from './axiosInstance';

const getProjects = async () => {
  const response = await axiosInstance.get('/projects');
  return response.data;
};

const createProject = async (projectData) => {
  const response = await axiosInstance.post('/projects', projectData);
  return response.data;
};

const getProject = async (id) => {
  const response = await axiosInstance.get(`/projects/${id}`);
  return response.data;
};

const updateProject = async (id, projectData) => {
  const response = await axiosInstance.put(`/projects/${id}`, projectData);
  return response.data;
};

const deleteProject = async (id) => {
  const response = await axiosInstance.delete(`/projects/${id}`);
  return response.data;
};

const getIngestionKey = async (id) => {
  const response = await axiosInstance.get(
    `/projects/${id}/ingestion-key`
  );

  return response.data;
};

const rotateIngestionKey = async (id) => {
  const response = await axiosInstance.post(
    `/projects/${id}/ingestion-key/rotate`
  );

  return response.data;
};

export { getProjects, createProject, getProject, updateProject, deleteProject, getIngestionKey, rotateIngestionKey };