import { useState, useEffect } from "react";
import BackButton from "../../../components/BackButton";
import Spinner from "../../../components/Spinner";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";

const DeleteTrainingsEmployees = () => {
  const { sessionId } = useParams();
  const [trainingId, setTrainingId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const trainingIdFromURL = params.get("trainingId");
    if (trainingIdFromURL) {
      setTrainingId(trainingIdFromURL);
    }
  }, [location]);

  const handleDeleteTrainingEmployee = () => {
    setLoading(true);
    axios
      .delete(`http://localhost:3000/api/employeesTrainings/${sessionId}`)
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Training Employee deleted successfully", {
          variant: "success",
        });
        navigate(`/trainings/details/${trainingId}`);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error deleting training employee", { variant: "error" });
        console.log(error);
      });
  };

  return (
    <div className="p-6">
      <BackButton destination={`/trainings/details/${trainingId}`} />
      <h1 className="text-3xl font-bold text-gray-800 my-4">Delete Training Employee</h1>
      {loading ? <Spinner /> : null}
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full p-8 mx-auto max-w-lg text-center">
        <h3 className="text-2xl mb-4">
          Are you sure you want to delete this training employee?
        </h3>
        <button
          className="bg-red-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-red-700"
          onClick={handleDeleteTrainingEmployee}
        >
          Yes, Delete it
        </button>
      </div>
    </div>
  );
};

export default DeleteTrainingsEmployees;
