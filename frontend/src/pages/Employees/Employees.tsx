import { useEffect, useState } from "react";
// import axios from "axios";
import axiosInstance from "../../authentication/axiosInstance.tsx";
import Spinner from "../../components/Spinner";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineDelete } from "react-icons/md";
import Sidebar from "../../components/Sidebar";

interface Employee {
  id: string;
  name: string;
  email: string;
  designation: string;
}

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/employees")
      .then((response) => {
        setEmployees(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex">
      <Sidebar activeItem="Employees" />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-col">
            <h1 className="text-3xl font-bold text-gray-800">Employees</h1>
            <h2 className="text-lg text-gray-600">List of all employees</h2>
          </div>
          <Link to="/employees/create">
            <div
              data-test="add-employee-button"
              className="bg-indigo-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-indigo-700"
            >
              Add Employee
            </div>
          </Link>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full bg-white" data-test="employees-table">
              <thead>
                <tr>
                  <th className="py-2 px-4 bg-gray-100 border-b">No</th>
                  <th className="py-2 px-4 bg-gray-100 border-b">ID</th>
                  <th className="py-2 px-4 bg-gray-100 border-b">Name</th>
                  <th className="py-2 px-4 bg-gray-100 border-b max-md:hidden">
                    Email
                  </th>
                  <th className="py-2 px-4 bg-gray-100 border-b max-md:hidden">
                    Designation
                  </th>
                  <th className="py-2 px-4 bg-gray-100 border-b">Operations</th>
                </tr>
              </thead>

              <tbody>
                {employees.map((employee, index) => (
                  <tr
                    key={employee.id}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="py-2 px-4 border-b">{index + 1}</td>
                    <td className="py-2 px-4 border-b">{employee.id}</td>
                    <td className="py-2 px-4 border-b">{employee.name}</td>
                    <td className="py-2 px-4 border-b max-md:hidden">
                      {employee.email}
                    </td>
                    <td className="py-2 px-4 border-b max-md:hidden">
                      {employee.designation}
                    </td>

                    <td className="py-2 px-4 border-b">
                      <div className="flex justify-center gap-x-4">
                        <Link
                          to={`/employees/details/${employee.id}`}
                          className="bg-green-100 p-1 rounded-full hover:bg-green-200"
                          data-test={`view-employee-${employee.id}`}
                        >
                          <BsInfoCircle className="text-green-600 text-lg cursor-pointer" />
                        </Link>

                        <Link
                          to={`/employees/edit/${employee.id}`}
                          className="bg-yellow-100 p-1 rounded-full hover:bg-yellow-200"
                          data-test={`edit-employee-${employee.id}`}
                        >
                          <AiOutlineEdit className="text-yellow-600 text-lg cursor-pointer" />
                        </Link>

                        <Link
                          to={`/employees/delete/${employee.id}`}
                          className="bg-red-100 p-1 rounded-full hover:bg-red-200"
                          data-test={`delete-employee-${employee.id}`}
                        >
                          <MdOutlineDelete className="text-red-600 text-lg cursor-pointer" />
                        </Link>
                      </div>
                    </td>
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

export default Employees;
