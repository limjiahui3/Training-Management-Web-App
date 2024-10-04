import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom"; // Import Link from react-router-dom
import BackButton from "../../../components/BackButton";
import Spinner from "../../../components/Spinner";

interface EmployeeTraining {
  id: string;
  training_id: string;
  status: string;
  start_date: string;
  end_date: string;
  expiry_date: string;
}

const formatDate = (dateString: string) => {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const ShowEmployeeTrainings = () => {
  const [employeeTrainings, setEmployeeTrainings] = useState<EmployeeTraining[]>([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(`http://localhost:3000/api/employeestrainings/employee/${id}`, {
          headers: {
            'Authorization':`Bearer ` + token,
          },
        })
        .then((response) => {
          setEmployeeTrainings(response.data);
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
      <h1 className="text-3xl font-bold text-gray-800 my-4">Employee Trainings</h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex-col">
              <h2 className="text-lg text-gray-600">List of trainings for employee ID: {id}</h2>
            </div>
            <Link to={`/employeestrainings/create?employeeId=${id}`} className="mt-4">
              <button className="bg-indigo-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-indigo-700">
                Assign Training
              </button>
            </Link>
          </div>
          {employeeTrainings.length === 0 ? (
            <div className="text-xl text-gray-500">No trainings found for this employee</div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden w-full">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 bg-gray-100 border-b">No</th>
                    <th className="py-2 px-4 bg-gray-100 border-b">Training ID</th>
                    <th className="py-2 px-4 bg-gray-100 border-b">Status</th>
                    <th className="py-2 px-4 bg-gray-100 border-b">Start Date</th>
                    <th className="py-2 px-4 bg-gray-100 border-b">End Date</th>
                    <th className="py-2 px-4 bg-gray-100 border-b">Expiry Date</th>
                    <th className="py-2 px-4 bg-gray-100 border-b">Operations</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeTrainings.map((training, index) => (
                    <tr key={training.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="py-2 px-4 border-b">{index + 1}</td>
                      <td className="py-2 px-4 border-b text-center">{training.training_id}</td>
                      <td className="py-2 px-4 border-b">{training.status}</td>
                      <td className="py-2 px-4 border-b">{formatDate(training.start_date)}</td>
                      <td className="py-2 px-4 border-b">{formatDate(training.end_date)}</td>
                      <td className="py-2 px-4 border-b">{formatDate(training.expiry_date)}</td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex justify-center gap-x-4">
                          <Link
                            to={`/employeestrainings/details/${training.id}`}
                            className="bg-green-100 p-1 rounded-full hover:bg-green-200"
                          >
                            <BsInfoCircle className="text-green-600 text-lg cursor-pointer" />
                          </Link>
                          <Link
                            to={`/employeestrainings/edit/${training.id}`}
                            className="bg-yellow-100 p-1 rounded-full hover:bg-yellow-200"
                          >
                            <AiOutlineEdit className="text-yellow-600 text-lg cursor-pointer" />
                          </Link>
                          <Link
                            to={`/employeestrainings/delete/${training.id}?employeeId=${id}`}
                            className="bg-red-100 p-1 rounded-full hover:bg-red-200"
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
      )}
    </div>
  );
};

export default ShowEmployeeTrainings;
