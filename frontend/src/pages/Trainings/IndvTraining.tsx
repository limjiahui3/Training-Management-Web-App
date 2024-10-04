import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import TrainingsEmployees from "./TrainingsEmployees/TrainingsEmployees";

interface Training {
  id: string;
  title: string;
  description: string;
  validity_period: string;
  training_provider: string | null;
}

const ShowTraining = () => {
  const [training, setTraining] = useState<Training | null>(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(`http://localhost:3000/api/trainings/${id}`,{
          headers: {
            'Authorization':`Bearer ` + token,
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          setTraining(response.data);
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
      <BackButton destination="/trainings" />
      <h1 className="text-3xl font-bold text-gray-800 my-4">
        Training Details
      </h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden w-full p-6">
          {training ? (
            <div className="flex flex-col space-y-4">
              <div className="flex">
                <span className="text-xl font-semibold text-gray-500 w-1/3">
                  ID
                </span>
                <span className="text-xl text-gray-800">{training.id}</span>
              </div>
              <div className="flex">
                <span className="text-xl font-semibold text-gray-500 w-1/3">
                  Title
                </span>
                <span className="text-xl text-gray-800">{training.title}</span>
              </div>
              <div className="flex">
                <span className="text-xl font-semibold text-gray-500 w-1/3">
                  Description
                </span>
                <span className="text-xl text-gray-800">
                  {training.description}
                </span>
              </div>
              <div className="flex">
                <span className="text-xl font-semibold text-gray-500 w-1/3">
                  Validity Period
                </span>
                <span className="text-xl text-gray-800">
                  {training.validity_period}
                </span>
              </div>
              <div className="flex">
                <span className="text-xl font-semibold text-gray-500 w-1/3">
                  Training Provider
                </span>
                <span className="text-xl text-gray-800">
                  {training.training_provider || "N/A"}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xl text-gray-500">Training not found</div>
          )}
        </div>
      )}
       {/* <TrainingsEmployees/> */}
       {training && <TrainingsEmployees trainingId={training.id} />}
    </div>
  );
};

export default ShowTraining;
