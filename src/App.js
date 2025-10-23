import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-timezone-picker/dist/react-bootstrap-timezone-picker.min.css";

import { ToastContainer } from "react-toastify";

// ReactToastify CSS
import "react-toastify/dist/ReactToastify.min.css";

import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

// History
import history from "./history";

//containers
import PublicLayout from "./container/PublicLayout/PublicLayout";

// Home
import Home from "./components/Home";

// Landing Page
import LandingPage from "./components/LandingPage";

// SetPassword
import SetPassword from "./components/SetPassword";

// Reset Password
import ResetPassword from "./components/ResetPassword";

// Parent Signup
import ParentSignup from "./components/ParentSignup";

// Student Signup
import StudentSignup from "./components/StudentSignup";

// Admin Login
import AdminLogin from "./components/AdminLogin";

// Login
import Login from "./components/Login";

//Parent
import EditParentDetails from "./components/EditParentDetails";

//Student
import EditStudentDetails from "./components/EditStudentDetails";

//Parents List
import ParentsList from "./components/ParentsList";

import ParentDashboard from "./components/Dashboard/ParentDashboard";

import StudentDashboard from "./components/Dashboard/StudentDashboard";

import EditCourses from "./components/EditCourses";

import CourseList from "./components/CourseList";

import Dashboard from "./components/Dashboard";

import StudentList from "./components/StudentList";

import CourseCheckout from "./components/CourseCheckout";

import CourseDetail from "./components/Courses/CourseDetail";

// Page 404
import Page404 from "./components/Page404";

import ParentStudent from "./components/ParentStudent/index";

//All Course List With Filter Option
import AllCourseList from "./components/CourseList/AllCourseList";

// student details
import StudentDetails from "./components/StudentDetails";

// About Us
import AboutUs from "./components/AboutUs";

// Privacy Policy
import PrivacyPolicy from "./components/PrivacyPolicy";

//Terms of use

import TermsOfUse from "./components/TermsOfUse";

//Trainers

import Trainers from "./components/Trainers";

// Help
import Help from "./components/Help";

// Course Category
import CourseCategory from "./components/CourseCategory";

// Course Creation
import CoursesCreation from "./components/Courses/CourseCreation";

//course Lesson
import CourseLesson from "./components/CourseLesson";

import CreateCourseLessons from "./components/CourseLesson/CreateCourseLessons";
import EditCourseLessons from "./components/CourseLesson/EditCourseLessons";
// Course Schedule
import CourseSchedule from "./components/CourseSchedule";

// Create Course Schedule
import CreateCourseSchedule from "./components/CourseSchedule/CreateCourseSchedule";

// Edit Course Schedule
import EditCourseSchedule from "./components/CourseSchedule/EditCourseSchedule";

// Teacher Signup
import TeacherSignup from "./components/TeacherSignup";

// Course Menu
import CourseSideMenu from "./components/CourseSideMenu";

// Parent Upcoming Schedule For All Student  and Student Upcoming List
import UpcomingSchedule from "./components/UpcomingSchedule";

import AdminPaymentList from "./components/AdminPaymentList";

//Edit Teacher Detail
import EditTeacherDetails from "./components/EditTeacherDetails";

import TeacherList from "./components/TeacherList";

import AdminStudentsList from "./components/AdminStudentsList";

// Admin Upcoming Schedule List For Student
import UpcomingScheduleList from "./components/UpcomingScheduleList";

import TeacherPublicProfile from "./components/TeacherPublicProfile";

import UpcomingTeacherScheduleList from "./components/UpcomingTeacherScheduleList";

// Admin Create Quiz
import CreateQuiz from "./components/CreateQuiz";

// Admin Create HomeWork
import CreateHomeWork from "./components/CreateHomeWork";

// Quiz List Page
import ListOfQuiz from "./components/ListOfQuiz";

// HomeWork List Page
import HomeWorkListTable from "./components/HomeWorkListTable";

// Quiz
import Quiz from "./components/Quiz";

//Quiz Preview
import QuizPreview from "./components/QuizPreview";

// HomeWork
import HomeWork from "./components/HomeWork";

//Quiz Review
import TeacherQuizReview from "./components/TeacherQuizReview";

//Homework Review
import TeacherHomeworkReview from "./components/TeacherHomeworkReview";

//HomeWork Preview
import HomeWorkPreview from "./components/HomeWorkPreview";

// Student Can View Home Work Review Answer
import HomeWorkAnswer from "./components/HomeWorkAnswer";

//Teacher Course List
import TeacherCourseList from "./components/TeacherCourseList";

// Admin Quiz
import AdminQuiz from "./components/AdminQuizAndHomework/AdminQuiz";

// Admin Home work
import AdminHomework from "./components/AdminQuizAndHomework/AdminHomework";

// Quiz Review for Teacher
import QuizReview from "./components/QuizReview";

// Admin Can View Teacher Not Availablility List in Calendar View
import CalendarView from "./components/CalendarView";

// Teacher Application
import TeacherApplication from "./components/TeacherApplication";

// Teacher Available
import TeacherAvailable from "./components/TeacherAvailable";

// Student List For Each Class
import EachClassStudentList from "./components/EachClassStudentList";

// Corse History
import CourseHistory from "./components/CourseHistory";

//Student Transcript
import StudentTranscript from "./components/StudentTranscript";

//Admin Can View Student Upcoming Schedule List
import AdminStudentUpcomingScheduleList from "./components/AdminStudentUpcomingScheduleList";

// Edit Quiz
import EditQuizIntegration from "./components/EditQuizIntegration";

// Edit Home Work
import EditHomeWorkIntegration from "./components/EditHomeWorkIntegration";

// Student Public Profile
import StudentPublicProfile from "./components/StudentPublicProfile";

// Student Public Profile
import ParentPublicProfile from "./components/ParentPublicProfile";

//Edit Reviewed Quiz
import EditReviewedQuiz from "./components/EditReviewedQuiz";

//Edit Reviewed HomeWork
import EditReviewedHomeWork from "./components/EditReviewedHomeWork";

// Teacher Application for Admin
import TeacherApplicationForAdmin from "./components/TeacherApplicationForAdmin";

import ScheduleForCalendarFormat from "./components/ScheduleForCalendarFormat";

// Favourite Course
import FavouriteCourse from "./components/FavouriteCourse";

// Active Enroll Course List for parent and student
import ActiveEnrollCourseList from "./components/ActiveEnrollCourseList";

// Complete course list for student
import CompleteCourseList from "./components/CompleteCourseList";

//Change Password
import ChangePassword from "./components/ChangePassword";

//Teacher Application Details for User
import DisplayTeacherApplication from "./components/TeacherApplication/displayTeacherApplication";
//Homw Work Integration
import HomeWorkIntegration from "./components/HomeWorkIntegration";

// Quiz Integration
import QuizIntegration from "./components/QuizIntegration";

// HomeWork Review
import HomeWorkReview from "./components/HomeWorkReview";

//Forum
import Forum from "./components/Forum/ForumConversation";
import ForumSelect from "./components/Forum/forum";
import ForumComments from "./components/Forum/ForumComments";
import AdminForum from "./components/Forum/AdminForum";
import TeacherProfile from "./components/TeacherPublicProfile/TeacherProfile";

// chat Bot Conversation
import ChatBotConversation from "./components/ChatBotConversation/ChatBotConversation";

//FAQ
import FAQ from "./components/FAQ";
import TeacherPayment from "./components/TeacherDetails/teacherPayment";

function App() {
  return (
    <div>
      <ToastContainer
        autoClose={5000}
        hideProgressBar={true}
        pauseOnHover={false}
        toastClassName="toastRequestSuccess"
        bodyClassName="toastBody"
        closeButton={false}
      />
      <Router history={history}>
        <Switch>
          <PublicLayout exact name="LandingPage" path="/kharpi" component={LandingPage} />

          <Route exact path="/" component={Home}>
            <Redirect to="/kharpi" />
          </Route>

          <PublicLayout exact name="Dashboard" path="/dashboard" component={Dashboard} />

          <PublicLayout exact name="Login" path="/login" component={Login} />

          {/* <Route exact path="/dashboard" component={Dashboard} /> */}

          <PublicLayout exact name="ParentDashboard" path="/parent-dashboard" component={ParentDashboard} />

          <PublicLayout exact name="StudentDashboard" path="/student-dashboard" component={StudentDashboard} />

          <PublicLayout exact name="AdminLogin" path="/admin-login" component={AdminLogin} />

          <PublicLayout exact name="Course Creation" path="/course/add" component={CoursesCreation} />

          <PublicLayout exact name="SetPassword" path="/set/password" component={SetPassword} />

          <PublicLayout exact name="ParentSignup" path="/parent/signup" component={ParentSignup} />

          <PublicLayout exact name="StudentSignup" path="/student/signup" component={StudentSignup} />

          <PublicLayout exact name="EditParentDetails" path="/edit-parent-details" component={EditParentDetails} />

          <PublicLayout exact name="TeacherList" path="/teacher/list" component={TeacherList} />

          <PublicLayout
            exact
            name="EditStudentDetails"
            path="/edit/student/details/:id"
            component={EditStudentDetails}
          />

          <PublicLayout exact name="ParentsList" path="/parents/list" component={ParentsList} />

          <PublicLayout exact name="EditCourses" path="/course/edit/:id" component={EditCourses} />

          <PublicLayout exact name="CourseList" path="/course/list" component={CourseList} />

          <PublicLayout exact name="StudentList" path="/student/list/:id" component={StudentList} />

          <PublicLayout exact name="CourseCheckout" path="/course/checkout/:name" component={CourseCheckout} />

          <PublicLayout exact name="CourseCategory" path="/course/category" component={CourseCategory} />

          <PublicLayout exact name="CourseDetail" path="/course/detail/:id" component={CourseDetail} />

          <PublicLayout exact name="AllCourseList" path="/course/search" component={AllCourseList} />

          <PublicLayout exact name="StudentDetails" path="/student/detail/:id" component={StudentDetails} />

          <PublicLayout exact name="Page404" path="/page404" component={Page404} />

          <PublicLayout exact name="ParentStudent" path="/parent/student" component={ParentStudent} />

          <PublicLayout exact name="Help" path="/help" component={Help} />

          <PublicLayout exact name="About Us" path="/about-us" component={AboutUs} />

          <PublicLayout exact name="Privacy Policy" path="/privacy-policy" component={PrivacyPolicy} />

          <PublicLayout exact name="Termsofuse" path="/terms-of-use" component={TermsOfUse} />

          <PublicLayout exact name="Trainers" path="/trainers" component={Trainers} />

          <PublicLayout exact name="Forgot Password" path="/forgot/password" component={ResetPassword} />

          <PublicLayout exact name="CourseLesson" path="/course/lesson" component={CourseLesson} />

          <PublicLayout exact name="CreateCourseLessons" path="/course/lesson/add" component={CreateCourseLessons} />

          <PublicLayout exact name="CourseSchedule" path="/course/schedule" component={CourseSchedule} />

          <PublicLayout exact name="CourseLesson" path="/course/lesson" component={CourseLesson} />

          <PublicLayout exact name="EditCourseLessons" path="/course/lesson/edit/:id" component={EditCourseLessons} />

          <PublicLayout
            exact
            name="CreateCourseSchedule"
            path="/course/schedule/add"
            component={CreateCourseSchedule}
          />

          <PublicLayout exact name="EditCourseSchedule" path="/course/schedule/update" component={EditCourseSchedule} />

          <PublicLayout exact name="TeacherSignup" path="/teacher/signup" component={TeacherSignup} />

          <PublicLayout exact name="CourseSideMenu" path="/courses/edit" component={CourseSideMenu} />

          <PublicLayout exact name="Upcoming Schedule" path="/upcoming/schedule" component={UpcomingSchedule} />

          <PublicLayout exact name="EditTeacherDetails" path="/teacher/edit/:id" component={EditTeacherDetails} />

          <PublicLayout exact name="Admin Payment List" path="/payment/list" component={AdminPaymentList} />

          <PublicLayout exact name="Admin Students List" path="/students/list" component={AdminStudentsList} />

          <PublicLayout
            exact
            name="Upcoming Schedule List"
            path="/upcoming/schedule/:id"
            component={UpcomingScheduleList}
          />
          <PublicLayout
            exact
            name="Teacher Public Profile"
            path="/teacher/profile/view"
            component={TeacherPublicProfile}
          />

          <PublicLayout
            exact
            name="DisplayTeacherApplication"
            path="/teacher/application/details"
            component={DisplayTeacherApplication}
          />

          <PublicLayout
            exact
            name="Upcoming Teacher Schedule List"
            path="/upcoming/teacher/schedule/list"
            component={UpcomingTeacherScheduleList}
          />

          <PublicLayout exact name="CreateQuiz" path="/quiz/add/:id" component={CreateQuiz} />
          <PublicLayout exact name="CreateHomeWork" path="/homework/add/:id" component={CreateHomeWork} />

          <PublicLayout exact name="ListOfQuiz" path="/test/link" component={ListOfQuiz} />

          <PublicLayout exact name="HomeWorkListTable" path="/homework/link" component={HomeWorkListTable} />

          <PublicLayout exact name="Quiz" path="/quiz" component={Quiz} />

          <PublicLayout exact name="TeacherQuizReview" path="/teacher/review/quiz" component={TeacherQuizReview} />

          <PublicLayout
            exact
            name="TeacherApplication"
            path="/teacher/application/form"
            component={TeacherApplication}
          />

          <PublicLayout
            exact
            name="TeacherApplicationForAdmin"
            path="/teacher/application"
            component={TeacherApplicationForAdmin}
          />

          <PublicLayout
            exact
            name="TeacherHomeworkReview"
            path="/teacher/review/homework"
            component={TeacherHomeworkReview}
          />

          <PublicLayout exact name="QuizPreview" path="/quiz/preview" component={QuizPreview} />

          <PublicLayout exact name="HomeWork" path="/homework" component={HomeWork} />

          <PublicLayout exact name="HomeWorkPreview" path="/homework/preview" component={HomeWorkPreview} />

          <PublicLayout exact name="HomeWorkAnswer" path="/homework/review/answers" component={HomeWorkAnswer} />

          <PublicLayout exact name="TeacherCourseList" path="/teacher/schedule/:id" component={TeacherCourseList} />
          <PublicLayout exact name="AdminQuiz" path="/admin/quiz" component={AdminQuiz} />
          <PublicLayout exact name="AdminHomework" path="/admin/homework" component={AdminHomework} />
          <PublicLayout exact name="QuizReview" path="/quiz/review" component={QuizReview} />
          <PublicLayout exact name="CalendarView" path="/teacher/not-available" component={CalendarView} />
          <PublicLayout exact name="TeacherAvailable" path="/not-available/time" component={TeacherAvailable} />
          <PublicLayout
            exact
            name="EachClassStudentList"
            path="/class/student/list/:id"
            component={EachClassStudentList}
          />
          <PublicLayout exact name="CourseHistory" path="/course/history" component={CourseHistory} />
          <PublicLayout exact name="StudentTranscript" path="/student/transcript/:id" component={StudentTranscript} />
          <PublicLayout
            exact
            name="AdminStudentUpcomingScheduleList"
            path="/upcoming/schedule/list/:id"
            component={AdminStudentUpcomingScheduleList}
          />
          <PublicLayout exact name="EditQuizIntegration" path="/quiz/edit" component={EditQuizIntegration} />
          <PublicLayout
            exact
            name="EditHomeWorkIntegration"
            path="/homework/edit"
            component={EditHomeWorkIntegration}
          />
          <PublicLayout
            exact
            name="StudentPublicProfile"
            path="/student/public/profile"
            component={StudentPublicProfile}
          />
          <PublicLayout
            exact
            name="ParentPublicProfile"
            path="/Parent/public/profile"
            component={ParentPublicProfile}
          />
          <PublicLayout exact name="EditReviewedQuiz" path="/quiz/reviewed/edit" component={EditReviewedQuiz} />
          <PublicLayout
            exact
            name="EditReviewedHomeWork"
            path="/homework/reviewed/edit"
            component={EditReviewedHomeWork}
          />
          <PublicLayout exact name="FavouriteCourse" path="/favourite/course" component={FavouriteCourse} />
          <PublicLayout
            exact
            name="ScheduleForCalendarFormat"
            path="/calendar/view/upcoming/schedule"
            component={ScheduleForCalendarFormat}
          />
          <PublicLayout
            exact
            name="ActiveEnrollCourseList"
            path="/active/enroll/course/list"
            component={ActiveEnrollCourseList}
          />
          <PublicLayout exact name="CompleteCourseList" path="/completed/course/list" component={CompleteCourseList} />
          <PublicLayout exact name="ChangePassword" path="/password/change" component={ChangePassword} />
          <PublicLayout exact name="HomeWorkIntegration" path="/homework/create" component={HomeWorkIntegration} />
          <PublicLayout exact name="QuizIntegration" path="/quiz/create" component={QuizIntegration} />

          <PublicLayout exact name="HomeWorkReview" path="/homework/review" component={HomeWorkReview} />
          <PublicLayout exact name="Forum" path="/forum" component={Forum} />
          <PublicLayout exact name="ForumSelect" path="/forum/details" component={ForumSelect} />
          <PublicLayout exact name="ForumComments" path="/forum/conversation" component={ForumComments} />
          <PublicLayout exact name="AdminForum" path="/Admin/Forum" component={AdminForum} />
          <PublicLayout exact name="TeacherProfile" path="/teacher/profile/:id" component={TeacherProfile} />
          <PublicLayout
            exact
            name="ChatBotConversation"
            path="/chat/bot/conversation"
            component={ChatBotConversation}
          />
          <PublicLayout exact name="FAQ" path="/faq" component={FAQ} />
          <PublicLayout exact name="TeacherPayment" path="/teacher/payments" component={TeacherPayment} />

          {/* <Route path="/course/:id" component={Home} />

          <Route path="/course/add" component={Home} />

          <Route path="/course/edit/:id" component={Home} /> */}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
