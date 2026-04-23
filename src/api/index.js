import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

// ── Auth ──
export const signupUser = (data) => API.post('/api/signup', data);
export const loginUser = (data) => API.post('/api/login', data);

// ── Jobs ──
export const fetchAllJobs = () => API.get('/api/jobs');
export const fetchRecruiterJobs = (recruiterId) =>
  API.get(`/api/recruiter-jobs/${recruiterId}`);
export const createJob = (data) => API.post('/api/jobs', data);

// ── Resume Upload (S3 pre-signed URL) ──
export const getUploadUrl = (candidateId, jobId) =>
  API.post('/api/upload-url', { candidateId, jobId });

export const getDownloadUrl = (resumeS3Key) =>
  API.post('/api/download-url', { resumeS3Key });

export const uploadResumeToS3 = async (presignedUrl, file) => {
  await axios.put(presignedUrl, file, {
    headers: { 'Content-Type': 'application/pdf' },
  });
};

// ── Applications ──
export const submitApplication = (data) => API.post('/api/apply', data);
export const fetchApplicants = (jobId) => API.get(`/api/applicants/${jobId}`);

export default API;
