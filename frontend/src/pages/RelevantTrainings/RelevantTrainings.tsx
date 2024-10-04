import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";

interface RelevantTraining {
  training_id: string;     
  title: string;
  validity: string;
  validity_period: string;
}

interface RelevantTrainingsProps {
  employeeId: string;
}

const RelevantTrainings: React.FC<RelevantTrainingsProps> = ({ employeeId }) => {
  const [relevantTrainings, setRelevantTrainings] = useState<RelevantTraining[]>([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  console.log(`Fetching Relevant Training for employe ${employeeId}`);

  useEffect(() => {
    // const fetchTrainingDetails = async (training_id: string) => {
    //   try {
    //     const response = await axios.get(`http://localhost:3000/api/trainings/${training_id}`);
    //     return response.data;
    //   } catch (error) {
    //     console.log(error);
    //     return { title: "N/A", validity_period: "N/A" };
    //   }
    // };

    // const fetchRelevantTrainings = async () => {
    //   setLoading(true);
    //   try {
    //     const response = await axios.get(`http://localhost:3000/api/relevantTrainings/employee/${employeeId}`);
    //     const relevantTrainingsData = await Promise.all(response.data.map(async (training: any) => {
    //       const trainingDetails = await fetchTrainingDetails(training.training_id);
    //       return {
    //         training_id: training.training_id,
    //         title: trainingDetails.title,
    //         validity: training.validity,
    //         validity_period: trainingDetails.validity_period,
    //       };
    //     }));
    //     setRelevantTrainings(relevantTrainingsData);
    //     setLoading(false);
    //   } catch (error) {
    //     console.log(error);
    //     setLoading(false);
    //   }
    // };

    // if (employeeId) {
    //   fetchRelevantTrainings();
    // }

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/api/relevanttrainings/employee/${employeeId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setRelevantTrainings(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    fetchDetails();

  }, []);

  return (
    <div className="flex">
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-col">
            <h1 className="text-3xl font-bold text-gray-800">Relevant Trainings</h1>
            <h2 className="text-lg text-gray-600">List of trainings for employee ID: {employeeId}</h2>
          </div>
          <Link to={`/relevanttrainings/create?employeeId=${employeeId}`} className="mt-4">
            <button className="bg-indigo-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-indigo-700">
              Add Relevant Trainings
            </button>
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
                  <th className="py-2 px-4 bg-gray-100 border-b text-center">Training ID</th>
                  <th className="py-2 px-4 bg-gray-100 border-b text-center">Training Title</th>
                  <th className="py-2 px-4 bg-gray-100 border-b text-center">Validity</th>
                  <th className="py-2 px-4 bg-gray-100 border-b text-center">Validity Period</th>
                  <th className="py-2 px-4 bg-gray-100 border-b text-center">Operations</th>
                </tr>
              </thead>
              <tbody>
                {relevantTrainings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-2 px-4 text-center text-xl text-gray-500">
                      No trainings found for this employee
                    </td>
                  </tr>
                ) : (
                  relevantTrainings.map((training, index) => (
                    <tr key={training.training_id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                      <td className="py-2 px-4 border-b text-center">{training.training_id}</td>
                      <td className="py-2 px-4 border-b">{training.title}</td>
                      <td className="py-2 px-4 border-b text-center">{training.validity}</td>
                      <td className="py-2 px-4 border-b text-center">{training.validity_period}</td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex justify-center gap-x-4">
                          {/* <Link
                            to={`/relevantTrainings/details/${training.training_id}?employeeId=${employeeId}`}
                            className="bg-green-100 p-1 rounded-full hover:bg-green-200"
                          >
                            <BsInfoCircle className="text-green-600 text-lg cursor-pointer" />
                          </Link> */}

                          <Link
                            to={`/relevantTrainings/edit/${training.training_id}?employeeId=${employeeId}`}
                            className="bg-yellow-100 p-1 rounded-full hover:bg-yellow-200"
                          >
                            <AiOutlineEdit className="text-yellow-600 text-lg cursor-pointer" />
                          </Link>

                          <Link
                            to={`/relevantTrainings/delete/${training.training_id}?employeeId=${employeeId}`}
                            className="bg-red-100 p-1 rounded-full hover:bg-red-200"
                          >
                            <MdOutlineDelete className="text-red-600 text-lg cursor-pointer" />
                          </Link>

                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelevantTrainings;
