import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5297/api',
});

export default {
  getTeacherInfo: (teacherId) => api.get(`/teachers/${teacherId}`),
  addTeacher: (teacherData) => api.post('/teachers', teacherData),
};