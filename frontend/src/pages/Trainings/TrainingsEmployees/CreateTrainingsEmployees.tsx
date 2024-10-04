import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../../../components/BackButton";
import Spinner from "../../../components/Spinner";
import axios from "axios";
import { useSnackbar } from "notistack";

const CreateTrainingsEmployees: React.FC = () => {
  const [employeeId, setEmployeeId] = useState<string>("");
  const [trainingId, setTrainingId] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const trainingIdFromURL = params.get("trainingId") || "";
    setTrainingId(trainingIdFromURL);
  }, [location]);
  
  const handleSaveTrainingEmployee = () => {
    // Validate fields
    if (!employeeId || !trainingId || !status || !startDate || !endDate || !expiryDate) {
      enqueueSnackbar("Please fill out all fields", { variant: "warning" });
      return;
    }

    const data = {
      employee_id: employeeId,
      training_id: trainingId,
      status,
      start_date: startDate,
      end_date: endDate,
      expiry_date: expiryDate,
    };

    console.log(data); // Log the data being sent

    setLoading(true);

    axios
      .post(`http://localhost:3000/api/employeesTrainings`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Employee training created successfully", {
          variant: "success",
        });
        navigate(`/trainings/details/${trainingId}`);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error creating employee training", { variant: "error" });
        console.log(error.response.data);  // Log the server response
      });
  };

  return (
    <div className="p-6">
      <BackButton destination={`/trainings/details/${trainingId}`} />
      <h1 className="text-3xl font-bold text-gray-800 my-4">Create Training Session</h1>
      {loading ? <Spinner /> : null}
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full p-6 mx-auto max-w-lg">
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Employee ID</label>
          <input
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Training ID</label>
          <input
            type="text"
            value={trainingId}
            readOnly
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
          >
            <option value="">Select a status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Expiry Date</label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
          />
        </div>
        <div className="text-right">
          <button
            className="bg-indigo-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-indigo-700"
            onClick={handleSaveTrainingEmployee}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTrainingsEmployees;
