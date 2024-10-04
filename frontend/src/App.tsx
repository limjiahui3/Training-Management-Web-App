import {Routes, Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./pages/Login/Login.tsx";
import { AuthProvider } from "./authentication/authContext.tsx";
// import Home from "./pages/Employees/Employees.tsx";
// import ProtectedRoute from './components/ProtectedRoute.tsx' 

import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import ReportGenerator from "./components/ReportGenerator";

import Employees from "./pages/Employees/Employees.tsx";
import CreateEmployee from "./pages/Employees/CreateEmployee.tsx";
import ShowEmployee from "./pages/Employees/IndvEmployee.tsx";
import EditEmployee from "./pages/Employees/EditEmployee.tsx";
import DeleteEmployee from "./pages/Employees/DeleteEmployee.tsx";

import Trainings from "./pages/Trainings/Trainings.tsx";
import CreateTraining from "./pages/Trainings/CreateTraining.tsx";
import ShowTraining from "./pages/Trainings/IndvTraining.tsx";
import EditTraining from "./pages/Trainings/EditTraining.tsx";
import DeleteTraining from "./pages/Trainings/DeleteTraining.tsx";

import TrainingSession from "./pages/TrainingSessions/TrainingSession.tsx";
import CreateTrainingSession from "./pages/TrainingSessions/CreateTrainingSession.tsx";
import { SessionSelector, EditTrainingSession } from "./pages/TrainingSessions/EditTrainingSession.tsx";
import DeleteTrainingSession from "./pages/TrainingSessions/DeleteTrainingSession.tsx";
import { SessionSelectorMarkAttn, MarkAttendance} from "./pages/TrainingSessions/MarkAttendance.tsx";

import CreateRelevantTrainings from "./pages/RelevantTrainings/CreateRelevantTrainings.tsx";
import DeleteRelevantTraining from "./pages/RelevantTrainings/DeleteRelevantTrainings.tsx";
import EditRelevantTrainings from "./pages/RelevantTrainings/EditRelevantTrainings.tsx";

// import CreateEmployeesTrainings from "./pages/Employees/EmployeesTrainings/CreateEmployeesTrainings.tsx";
// import DeleteEmployeesTrainings from "./pages/Employees/EmployeesTrainings/DeleteEmployeesTrainings.tsx";
// import EditEmployeesTrainings from "./pages/Employees/EmployeesTrainings/EditEmployeesTrainings.tsx";

// import CreateTrainingsEmployees from "./pages/Trainings/TrainingsEmployees/CreateTrainingsEmployees.tsx";
// import EditTrainingsEmployees from "./pages/Trainings/TrainingsEmployees/EditTrainingsEmployees.tsx";
// import DeleteTrainingsEmployees from "./pages/Trainings/TrainingsEmployees/DeleteTrainingsEmployees.tsx";

const App: React.FC = () => {
  return (
  <AuthProvider>
    
    <Routes>
      {/* <Route path="/" element={<ProtectedRoute />}/> */}

      <Route path="/login" element={<Login />} />

      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/report" element={<ReportGenerator />} />

      <Route path="/sessions" element={<TrainingSession />} />
      <Route path="/sessions/create" element={<CreateTrainingSession/>} />
      <Route path="/sessions/edit" element={<SessionSelector/>} />
      <Route path="/sessions/:id" element={<EditTrainingSession />} />
      <Route path="/sessions/delete/" element={<DeleteTrainingSession />} />
      <Route path="/sessions/select" element={<SessionSelectorMarkAttn />} />
      <Route path="/sessions/markattendance/:sessionId" element={<MarkAttendance />} />

      <Route path="/employees" element={<Employees />} />
      <Route path="/employees/create" element={<CreateEmployee />} />
      <Route path="/employees/details/:id" element={<ShowEmployee />} />
      <Route path="/employees/edit/:id" element={<EditEmployee />} />
      <Route path="/employees/delete/:id" element={<DeleteEmployee />} />

      <Route path="/trainings" element={<Trainings />} />
      <Route path="/trainings/create" element={<CreateTraining />} />
      <Route path="/trainings/details/:id" element={<ShowTraining />} />
      <Route path="/trainings/edit/:id" element={<EditTraining />} />
      <Route path="/trainings/delete/:id" element={<DeleteTraining />} />

      {/* <Route path="/employeestrainings/create" element={<CreateEmployeesTrainings />} />
      <Route path="/employeestrainings/delete/:id" element={<DeleteEmployeesTrainings />} />
      <Route path="/employeestrainings/edit/:id" element={<EditEmployeesTrainings />} /> */}

      <Route path="/relevanttrainings/create/" element={<CreateRelevantTrainings />} />
      <Route path="/relevanttrainings/delete/:trainingId" element={<DeleteRelevantTraining />} />
      <Route path="/relevanttrainings/edit/:trainingId" element={<EditRelevantTrainings />} />

      {/* <Route path="/trainingsemployees/create" element={<CreateTrainingsEmployees />} />
      <Route path="/trainingsemployees/edit/:id" element={<EditTrainingsEmployees />} />
      <Route path="/trainingsemployees/delete/:sessionId" element={<DeleteTrainingsEmployees />} /> */}
      
    </Routes>
    
  </AuthProvider>
  );
};

export default App;
