import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom"; // Import Link from react-router-dom
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import EmployeesTrainings from "./EmployeesTrainings/EmployeesTrainings";
import RelevantTrainings from "../RelevantTrainings/RelevantTrainings";

interface Employee {
  id: string;
  name: string;
  email: string;
  hire_date: string | null;
  // division: string;
  designation: string;
}

const ShowEmployee = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(`http://localhost:3000/api/employees/${id}`, {
          headers: {
            'Authorization':`Bearer ` + token,
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          setEmployee(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  }, [id]);

  return (
    <div className="p-6">
      <BackButton destination="/employees" />
      <h1 className="text-3xl font-bold text-gray-800 my-4">Employee Details</h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden w-full p-6">
          {employee ? (
            <div className="flex flex-col space-y-4">
              <div className="flex">
                <span className="text-xl font-semibold text-gray-500 w-1/3">ID</span>
                <span className="text-xl text-gray-800">{employee.id}</span>
              </div>
              <div className="flex">
                <span className="text-xl font-semibold text-gray-500 w-1/3">Name</span>
                <span className="text-xl text-gray-800">{employee.name}</span>
              </div>
              <div className="flex">
                <span className="text-xl font-semibold text-gray-500 w-1/3">Email</span>
                <span className="text-xl text-gray-800">{employee.email}</span>
              </div>
              <div className="flex">
                <span className="text-xl font-semibold text-gray-500 w-1/3">Hire Date</span>
                <span className="text-xl text-gray-800">
                  {employee.hire_date ? employee.hire_date : "N/A"}
                </span>
              </div>
              {/* <div className="flex">
                <span className="text-xl font-semibold text-gray-500 w-1/3">Division</span>
                <span className="text-xl text-gray-800">{employee.division}</span>
              </div> */}
              <div className="flex">
                <span className="text-xl font-semibold text-gray-500 w-1/3">Designation</span>
                <span className="text-xl text-gray-800">{employee.designation}</span>
              </div>
              {/* <Link to={`/employeestrainings/create?employeeId=${employee.id}`} className="mt-4">
                <button className="bg-indigo-600 text-white w-full py-2 px-4 rounded-md cursor-pointer hover:bg-indigo-700">
                  Assign Training
                </button>
              </Link> */}
            </div>
          ) : (
            <div className="text-xl text-gray-500">Employee not found</div>
          )}
        </div>
      )}
      {employee && <RelevantTrainings employeeId={employee.id} />}
      {employee && <EmployeesTrainings employeeId={employee.id} />}
    </div>
  );
};

export default ShowEmployee;
