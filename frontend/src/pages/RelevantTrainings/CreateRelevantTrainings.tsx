import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import axios from "axios";
import axiosInstance from "../../authentication/axiosInstance";
import { useSnackbar } from "notistack";
import Select from 'react-select';

interface Training {
  id: string;
  title: string;
  description: string;
  validity_period: string;
  training_provider: string | null;
}


const CreateRelevantTrainings: React.FC = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [trainingId, setTrainingId] = useState("");
  const [trainings, setTrainings] = useState<Training[]>([]);
  // const [validity, setValidity] = useState("NA");
  const validity = "NA";
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const employeeIdFromURL = params.get("employeeId");
    if (employeeIdFromURL) {
      setEmployeeId(employeeIdFromURL);
    }

    axiosInstance
      .get("http://localhost:3000/api/trainings")
      .then((response) => {
        const trainings = response.data;
        setTrainings(trainings);
      })
      .catch((error) => {
        console.log(error.response.data);  // Log the server response
      });

  }, [location]);
  
  const handleSaveRelevantTraining = () => {
    // Validate fields
    if (!employeeId || !trainingId || !validity) {
      enqueueSnackbar("Please fill out all fields", { variant: "warning" });
      return;
    }

    const data = {
      employee_id: employeeId,
      training_id: trainingId,
      validity,
    };

    console.log(data); // Log the data being sent

    setLoading(true);

    axios
      .post(`http://localhost:3000/api/relevantTrainings`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Relevant training created successfully", {
          variant: "success",
        });
        navigate(`/employees/details/${employeeId}`);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error creating relevant training", { variant: "error" });
        console.log(error.response.data);  // Log the server response
      });
  };

  return (
    <div className="p-6">
      <BackButton destination={`/employees/details/${employeeId}`} />
      <h1 className="text-3xl font-bold text-gray-800 my-4">Create Relevant Training</h1>
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
          <label className="text-xl mr-4 text-gray-500">Training</label>
          <Select
            onChange={(newValue) => {
              if (newValue !== null) {
                setTrainingId(newValue.value); // Set to empty string or any default value as need
              }
            }}
            options={trainings.map((training) => ({
              value: training.id,
              label: training.title,
            }))}
          />
        </div>

        {/* <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Training ID</label>
          <input
            type="text"
            value={trainingId}
            onChange={(e) => setTrainingId(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
          />
        </div> */}
        {/* <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Validity</label>
          <select
            value={validity}
            onChange={(e) => setValidity(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
          >
            <option value="">Select a validity</option>
            <option value="Valid">Valid</option>
            <option value="Expire">Expire</option>
            <option value="NA">NA</option>
          </select>
        </div> */}
        <div className="text-right pt-48">
          <button
            className="bg-indigo-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-indigo-700"
            onClick={handleSaveRelevantTraining}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRelevantTrainings;
