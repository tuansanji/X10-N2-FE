import axiosClient from "../axiosClient";

const taskApi = {
  addTask(task: any) {
    const url = `/task/new`;
    return axiosClient.post(url, task);
  },
  getTask(taskId: string) {
    const url = `/task/details/${taskId}`;
    return axiosClient.get(url);
  },
  editTask(taskId: string, task: any) {
    const url = `/task/update/${taskId}`;
    return axiosClient.post(url, task);
  },
  getAllTask(stageId: string, params?: any) {
    const url = `/stage/tasks/${stageId}`;
    return axiosClient.get(url, { params });
  },
  getTasksByUser() {
    const url = `/task/related`;
    return axiosClient.get(url);
  },
};
export default taskApi;
