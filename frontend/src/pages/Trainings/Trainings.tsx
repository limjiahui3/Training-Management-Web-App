import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Spinner from "../../components/Spinner";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineDelete } from "react-icons/md";

interface Training {
  id: string;
  title: string;
  description: string;
  validity_period: string;
  training_provider: string | null;
}

const Trainings = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3000/api/trainings", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        setTrainings(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [token]);

  return (
    <div className="flex">
      <Sidebar activeItem="Trainings" />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Training List</h1>
          <Link to="/trainings/create">
            <div className="bg-indigo-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-indigo-700">
              Create Training
            </div>
          </Link>
        </div>
        
        {loading ? (
          <Spinner />
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 bg-gray-100 border-b">No</th>
                  <th className="py-2 px-4 bg-gray-100 border-b">ID</th>
                  <th className="py-2 px-4 bg-gray-100 border-b">Title</th>
                  <th className="py-2 px-4 bg-gray-100 border-b">Description</th>
                  <th className="py-2 px-4 bg-gray-100 border-b text-center">
                    Validity Period (Month)
                  </th>
                  <th className="py-2 px-4 bg-gray-100 border-b">Provider</th>
                  <th className="py-2 px-4 bg-gray-100 border-b">Operations</th>
                </tr>
              </thead>
              <tbody>
                {trainings.map((training, index) => (
                  <tr
                    key={training.id}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="py-2 px-4 border-b">{index + 1}</td>
                    <td className="py-2 px-4 border-b">{training.id}</td>
                    <td className="py-2 px-4 border-b">{training.title}</td>
                    <td className="py-2 px-4 border-b">{training.description}</td>
                    <td className="py-2 px-4 border-b text-center">
                      {training.validity_period}
                    </td>
                    <td className="py-2 px-4 border-b">{training.training_provider}</td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex justify-center gap-x-4">
                        <Link
                          to={`/trainings/details/${training.id}`}
                          className="bg-green-100 p-1 rounded-full hover:bg-green-200"
                          data-test={`view-training`}
                        >
                          <BsInfoCircle className="text-green-600 text-lg cursor-pointer" />
                        </Link>
                        <Link
                          to={`/trainings/edit/${training.id}`}
                          className="bg-yellow-100 p-1 rounded-full hover:bg-yellow-200"
                          data-test={`edit-training`}
                        >
                          <AiOutlineEdit className="text-yellow-600 text-lg cursor-pointer" />
                        </Link>
                        <Link
                          to={`/trainings/delete/${training.id}`}
                          className="bg-red-100 p-1 rounded-full hover:bg-red-200"
                          data-test={`delete-training`}
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

export default Trainings;
