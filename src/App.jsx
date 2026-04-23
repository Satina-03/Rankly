import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import ForRecruiters from './pages/ForRecruiters'
import ForCandidates from './pages/ForCandidates'
import Login from './pages/Login'
import Signup from './pages/Signup'
import BrowseJobs from './pages/BrowseJobs'
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard'
import ViewApplicants from './pages/recruiter/ViewApplicants'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/for-recruiters" element={<ForRecruiters />} />
        <Route path="/for-candidates" element={<ForCandidates />} />
        <Route path="/jobs" element={<BrowseJobs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/applicants/:jobId" element={<ViewApplicants />} />
      </Routes>
    </Router>
  )
}

export default App
