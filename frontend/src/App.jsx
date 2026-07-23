import { BrowserRouter, Routes, Route } from 'react-router'
import { AuthProvider } from '@/contexts/AuthContext'
import ProtectedRoute from '@/routes/ProtectedRoute'
import { Toaster } from 'sonner'

// Import page anchors
import Home from "@/views/Home";
import Login from "@/views/auth/Login";
import Register from "@/views/auth/Register";
import VerifyEmail from "@/views/auth/VerifyEmail";
import ResendVerification from "@/views/auth/ResendVerification";
import ForgotPassword from "@/views/auth/ForgotPassword";
import GoogleCallback from "@/views/auth/GoogleCallback";
import Courses from "@/views/Courses";
import Profile from "@/views/UserProfile";
import CreatorHome from "@/views/creator/Home";
import CreatorCourses from "@/views/creator/Courses";
import CreatorCourseDetail from "@/views/creator/CourseDetail";
import CreatorCourseBuilder from "@/views/creator/CourseBuilder";
import CreatorAnalytics from "@/views/creator/Analytics";
import CreatorMentorApplications from "@/views/creator/MentorApplications";
import AdminDashboard from "@/views/admin/Dashboard";
import AdminRequests from "@/views/admin/Requests";
import AdminCourses from "@/views/admin/Courses";
import Error from "@/views/Error";
import LearningArea from "@/views/learning/LearningArea";
import ProgressDashboard from "@/views/learning/ProgressDashboard";
import MyLearning from "@/views/learning/MyLearning";
import MyIncidents from "@/views/learning/MyIncidents";
import LearnerCourseDetail from "@/views/LearnerCourseDetail";
import ClassView from "@/views/learning/ClassView";
import Assignment from "@/views/learning/Assignment";
import MentorDashboard from "@/views/mentor/Dashboard";
import MentorIncidents from "@/views/mentor/Incidents";
import MentorIncidentDetail from "@/views/mentor/IncidentDetailView";
import MentorPairDetail from "@/views/mentor/PairDetailView";
import MentorClasses from "@/views/mentor/Classes";
import MentorClassDetail from "@/views/mentor/ClassDetailView";
import MentorTeachingConfig from "@/views/mentor/TeachingConfig";
import CreatorWithdrawRequests from "@/views/creator/WithdrawRequests";
import CreatorWaitlists from "@/views/creator/Waitlists";
import CertificateView from "@/views/learning/CertificateView";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <Toaster
          position="bottom-right"
          richColors
        />
        <Routes>
          {/* public route */}
          <Route path="/" element={<Home />}></Route>
          <Route path="/signup" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/verify-email" element={<VerifyEmail />}></Route>
          <Route path="/resend-verification" element={<ResendVerification />}></Route>
          <Route path="/forgot-password" element={<ForgotPassword />}></Route>
          <Route
            path="/oauth2/redirect"
            element={<GoogleCallback />}
          ></Route>
          <Route
            path="/courses"
            element={<Courses />}
          ></Route>
          <Route element={<ProtectedRoute allowGuest={true} />}>
            <Route
              path="/courses/:id"
              element={<LearnerCourseDetail />}
            ></Route>
          </Route>

          <Route element={<ProtectedRoute />}>
          {/* Authenticated user routes */}
            <Route
              path="/courses/:courseId/learn"
              element={<LearningArea />}
            ></Route>
            <Route
              path="/courses/:courseId/dashboard"
              element={<ProgressDashboard />}
            ></Route>
            <Route
              path="/profile"
              element={<Profile />}
            ></Route>
            <Route
            path="/my-learning"
            element={<MyLearning />}
          ></Route>
            <Route
              path="/my-incidents"
              element={<MyIncidents />}
            ></Route>
            <Route
              path="/classes/:classId"
              element={<ClassView />}
            ></Route>
            <Route
              path="/classes/:classId/assignments/:assignmentId"
              element={<Assignment />}
            ></Route>
            <Route
              path="/classes/:classId/certificate"
              element={<CertificateView />}
            ></Route>
          </Route>

          {/* admin route */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route
              path="/admin"
              element={<AdminDashboard />}
            ></Route>
            <Route
              path="/admin/creator-requests"
              element={<AdminRequests />}
            ></Route>
            <Route
              path="/admin/courses-management"
              element={<AdminCourses />}
            ></Route>
          </Route>

          {/* creator route */}
          <Route element={<ProtectedRoute allowedRoles={['CREATOR']} />}>
            <Route
              path="/creator"
              element={<CreatorHome />}
            ></Route>
            <Route
              path="/creator/courses"
              element={<CreatorCourses />}
            ></Route>
            <Route
              path="/creator/mentor-applications"
              element={<CreatorMentorApplications />}
            ></Route>
            <Route
              path="/creator/withdraw-requests"
              element={<CreatorWithdrawRequests />}
            ></Route>
            {/* <Route
              path="/creator/courses/:id"
              element={<CreatorCourseDetail />}
            ></Route> */}
            <Route
              path="/creator/courses/:id/edit"
              element={<CreatorCourseBuilder mode="EDIT" />}
            ></Route>
            <Route
              path="/creator/courses/:id/view"
              element={<CreatorCourseBuilder mode="VIEW" />}
            ></Route>
            <Route
              path="/creator/analytics"
              element={<CreatorAnalytics />}
            ></Route>
            <Route
              path="/creator/waitlist"
              element={<CreatorWaitlists />}
            ></Route>
            <Route
              path="/creator/create-course"
              element={<CreatorCourseBuilder mode="CREATE" />}
            ></Route>
          </Route>

          {/* mentor route */}
          <Route element={<ProtectedRoute requireMentorMode={true} />}>
            <Route
              path="/mentor"
              element={<MentorDashboard />}
            ></Route>
            <Route
              path="/mentor/incidents"
              element={<MentorIncidents />}
            ></Route>
            <Route
              path="/mentor/incidents/:id"
              element={<MentorIncidentDetail />}
            ></Route>
            <Route
              path="/mentor/pairs/:id"
              element={<MentorPairDetail />}
            ></Route>

            <Route
              path="/mentor/classes"
              element={<MentorClasses />}
            ></Route>
            <Route
              path="/mentor/classes/:classId"
              element={<MentorClassDetail />}
            ></Route>
            <Route
              path="/mentor/teaching-config"
              element={<MentorTeachingConfig />}
            ></Route>
          </Route>

          <Route
            path="*"
            element={<Error />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
