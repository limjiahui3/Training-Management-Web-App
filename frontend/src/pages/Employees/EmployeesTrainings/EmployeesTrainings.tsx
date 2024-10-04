import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../../components/Spinner";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";

interface EmployeeTraining {
  id: string;
  training_id: string;
  training_title: string;
  status: string;
  start_date: string;
  end_date: string;
  expiry_date: string;
}

interface EmployeesTrainingsProps {
  employeeId: string;
}

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};


const EmployeesTrainings: React.FC<EmployeesTrainingsProps> = ({ employeeId }) => {
  const [employeesTrainings, setEmployeesTrainings] = useState<EmployeeTraining[]>([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/api/employeestrainings/employee/${employeeId}`,{
        headers: {
          'Authorization':`Bearer ` + token,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        setEmployeesTrainings(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [employeeId]);

  return (
    <div className="flex">
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-col">
            <h1 className="text-3xl font-bold text-gray-800">Employee Training Sessions</h1>
            <h2 className="text-lg text-gray-600">List of trainings for employee ID: {employeeId}</h2>
          </div>
          {/* <Link to={`/employeestrainings/create?employeeId=${employeeId}`} className="mt-4">
              <button className="bg-indigo-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-indigo-700">
                Add Training Session
              </button>
          </Link> */}
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 bg-gray-100 border-b">No</th>
                  <th className="py-2 px-4 bg-gray-100 border-b text-center">Training ID</th>
                  <th className="py-2 px-4 bg-gray-100 border-b text-center">Training Name</th>
                  <th className="py-2 px-4 bg-gray-100 border-b text-center">Status</th>
                  <th className="py-2 px-4 bg-gray-100 border-b text-center">Start Date</th>
                  <th className="py-2 px-4 bg-gray-100 border-b text-center">End Date</th>
                  <th className="py-2 px-4 bg-gray-100 border-b text-center">Expiry Date</th>
                  {/* <th className="py-2 px-4 bg-gray-100 border-b text-center">Operations</th> */}
                </tr>
              </thead>

              <tbody>
                {employeesTrainings.map((training, index) => (
                  <tr
                    key={training.id}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="py-2 px-4 border-b">{index + 1}</td>
                    <td className="py-2 px-4 border-b text-center">{training.training_id}</td>
                    <td className="py-2 px-4 border-b text-center">{training.training_title}</td>
                    <td className="py-2 px-4 border-b text-center">{training.status}</td>
                    <td className="py-2 px-4 border-b text-center">{formatDate(training.start_date)}</td>
                    <td className="py-2 px-4 border-b text-center">{formatDate(training.end_date)}</td>
                    <td className="py-2 px-4 border-b text-center">{formatDate(training.expiry_date)}</td>

                    {/* <td className="py-2 px-4 border-b">
                      <div className="flex justify-center gap-x-4">

                        <Link
                          to={`/employeestrainings/edit/${training.id}?employeeId=${employeeId}`}
                          className="bg-yellow-100 p-1 rounded-full hover:bg-yellow-200"
                        >
                          <AiOutlineEdit className="text-yellow-600 text-lg cursor-pointer" />
                        </Link>

                        <Link
                          to={`/employeestrainings/delete/${training.id}?employeeId=${employeeId}`}
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
    </div>
  );
};

export default EmployeesTrainings;
