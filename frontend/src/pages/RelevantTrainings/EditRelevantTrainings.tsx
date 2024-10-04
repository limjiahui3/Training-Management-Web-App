import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useSnackbar } from "notistack";

const EditRelevantTraining: React.FC = () => {
  const { trainingId } = useParams();
  const [employeeId, setEmployeeId] = useState("");
  const [currentTrainingId, setCurrentTrainingId] = useState(trainingId || "");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Extract employeeId from URL params or location
    const params = new URLSearchParams(window.location.search);
    const employeeIdFromURL = params.get("employeeId");

    if (employeeIdFromURL) {
      setEmployeeId(employeeIdFromURL);
    } else {
      enqueueSnackbar("Employee ID is missing", { variant: "error" });
      setLoading(false);
      return;
    }

    if (trainingId) {
      const fetchTrainingDetails = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/relevantTrainings/${employeeIdFromURL}/${trainingId}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          setCurrentTrainingId(response.data.training_id);
        } catch (error) {
          enqueueSnackbar("Error fetching training details", { variant: "error" });
          console.error("Error:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchTrainingDetails();
    }
  }, [trainingId, enqueueSnackbar, token]);

  const handleUpdateTrainingId = async () => {
    if (!currentTrainingId) {
      enqueueSnackbar("Training ID cannot be empty", { variant: "warning" });
      return;
    }

    setLoading(true);

    try {
      await axios.put(
        `http://localhost:3000/api/relevantTrainings/${employeeId}/${trainingId}`, 
        { training_id: currentTrainingId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      enqueueSnackbar("Training ID updated successfully", { variant: "success" });
      navigate(`/employees/details/${employeeId}`);
    } catch (error) {
      enqueueSnackbar("Error updating training ID", { variant: "error" });
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <BackButton destination={`/employees/details/${employeeId}`} />
      <h1 className="text-3xl font-bold text-gray-800 my-4">Edit Relevant Training</h1>
      {loading ? <Spinner /> : null}
        <div className="bg-white shadow-md rounded-lg overflow-hidden w-full p-6 mx-auto max-w-lg">
          <div className="my-4">
            <label className="text-xl mr-4 text-gray-500">Employee ID</label>
            <input
              type="text"
              value={employeeId}
              readOnly
              className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
            />
          </div>
          <div className="my-4">
            <label className="text-xl mr-4 text-gray-500">Training ID</label>
            <input
              type="text"
              value={currentTrainingId}
              onChange={(e) => setCurrentTrainingId(e.target.value)}
              className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
            />
          </div>
          <div className="text-right">
            <button
              className="bg-indigo-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-indigo-700"
              onClick={handleUpdateTrainingId}
            >
              Update
            </button>
          </div>
        </div>

    </div>
  );
};

export default EditRelevantTraining;
