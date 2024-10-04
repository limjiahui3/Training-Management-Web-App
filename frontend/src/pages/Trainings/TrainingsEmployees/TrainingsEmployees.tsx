import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";

interface SessionDetails {
  session_id: string; // ID from employees_trainings table
  employee_id: string;
  training_id: string;
  training_title: string;
  employee_name: string;
  employee_email: string;
  employee_designation: string;
  status: string;
  start_date: string;
  end_date: string;
  expiry_date: string;
}

// interface Employee {
//   name: string;
//   email: string;
//   division: string;
//   designation: string;
// }

// interface EmployeeTrainingWithDetails extends EmployeeTraining, Employee {}

interface TrainingsEmployeesProps {
  trainingId: string;
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const TrainingsEmployees: React.FC<TrainingsEmployeesProps> = ({ trainingId }) => {
  const [sessionDetails, setSessionDetails] = useState<SessionDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // const fetchEmployeeDetails = async (training: EmployeeTraining) => {
    //   try {
    //     const response = await axios.get(`http://localhost:3000/api/employees/${training.employee_id}`);
    //     return { ...training, ...response.data };
    //   } catch (error) {
    //     console.log(error);
    //     return { ...training, name: "N/A", email: "N/A", division: "N/A", designation: "N/A" };
    //   }
    // };

    // const fetchEmployeeTrainings = async () => {
    //   setLoading(true);
    //   try {
    //     const response = await axios.get(`http://localhost:3000/api/employeestrainings/training/${trainingId}`);
    //     if (Array.isArray(response.data)) {
    //       const employeeTrainingsWithDetails = await Promise.all(response.data.map(fetchEmployeeDetails));
    //       setEmployeeTrainings(employeeTrainingsWithDetails);
    //     } else {
    //       console.error("Unexpected response format:", response.data);
    //       setEmployeeTrainings([]);
    //     }
    //     setLoading(false);
    //   } catch (error) {
    //     console.log(error);
    //     setLoading(false);
    //   }
    // };

    // if (trainingId) {
    //   fetchEmployeeTrainings();
    // }

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/api/employeestrainings/training/${trainingId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setSessionDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    fetchDetails();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 my-4">Training Sessions</h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex-col">
              <h2 className="text-lg text-gray-600">List of training sessions for training ID: {trainingId}</h2>
            </div>
            {/* <Link to={`/trainingsemployees/create?trainingId=${trainingId}`} className="mt-4">
              <button className="bg-indigo-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-indigo-700">
                Add Sessions
              </button>
            </Link> */}
          </div>
          {sessionDetails.length === 0 ? (
            <div className="text-xl text-gray-500">No employees found for this training</div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden w-full">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 bg-gray-100 border-b">No</th>
                    <th className="py-2 px-4 bg-gray-100 border-b">Session ID</th>
                    <th className="py-2 px-4 bg-gray-100 border-b">Employee ID</th>
                    <th className="py-2 px-4 bg-gray-100 border-b">Name</th>
                    <th className="py-2 px-4 bg-gray-100 border-b">Email</th>
                    <th className="py-2 px-4 bg-gray-100 border-b">Designation</th>
                    <th className="py-2 px-4 bg-gray-100 border-b">Status</th>
                    <th className="py-2 px-4 bg-gray-100 border-b">Start Date</th>
                    <th className="py-2 px-4 bg-gray-100 border-b">End Date</th>
                    <th className="py-2 px-4 bg-gray-100 border-b">Expiry Date</th>
                    {/* <th className="py-2 px-4 bg-gray-100 border-b">Operations</th> */}
                  </tr>
                </thead>
                <tbody>
                  {sessionDetails.map((session, index) => (
                    <tr key={session.session_id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="py-2 px-4 border-b">{index + 1}</td>
                      <td className="py-2 px-4 border-b text-center">{session.session_id}</td>
                      <td className="py-2 px-4 border-b text-center">{session.employee_id}</td>
                      <td className="py-2 px-4 border-b">{session.employee_name}</td>
                      <td className="py-2 px-4 border-b">{session.employee_email}</td>
                      <td className="py-2 px-4 border-b">{session.employee_designation}</td>
                      <td className="py-2 px-4 border-b">{session.status}</td>
                      <td className="py-2 px-4 border-b">{formatDate(session.start_date)}</td>
                      <td className="py-2 px-4 border-b">{formatDate(session.end_date)}</td>
                      <td className="py-2 px-4 border-b">{formatDate(session.expiry_date)}</td>
                      {/* <td className="py-2 px-4 border-b">
                        <div className="flex justify-center gap-x-4">
                          <Link
                            to={`/trainingsemployees/edit/1?trainingId=${session.training_id}`}
                            className="bg-yellow-100 p-1 rounded-full hover:bg-yellow-200"
                          >
                            <AiOutlineEdit className="text-yellow-600 text-lg cursor-pointer" />
                          </Link>

                          <Link
                            to={`/trainingsemployees/delete/${session.session_id}?trainingId=${session.training_id}`}
                            className="bg-red-100 p-1 rounded-full hover:bg-red-200"
                          >
                            <MdOutlineDelete className="text-red-600 text-lg cursor-pointer" />
                          </Link>

                        </div>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrainingsEmployees;
