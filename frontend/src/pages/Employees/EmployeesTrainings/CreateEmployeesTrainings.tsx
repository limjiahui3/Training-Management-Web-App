import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation to get query params
import BackButton from "../../../components/BackButton";
import Spinner from "../../../components/Spinner";
import axios from "axios";
import { useSnackbar } from "notistack";

const CreateEmployeesTrainings = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [trainingId, setTrainingId] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const employeeIdFromURL = params.get("employeeId");
    if (employeeIdFromURL) {
      setEmployeeId(employeeIdFromURL);
    }
  }, [location]);
  
  const handleSaveEmployeeTraining = () => {
    // Validate fields
    if (!employeeId || !trainingId || !status || !startDate || !endDate) {
      enqueueSnackbar("Please fill out all fields", { variant: "warning" });
      return;
    }

    const data = {
      employee_id: employeeId,
      training_id: trainingId,
      status,
      start_date: startDate,
      end_date: endDate,
    };

    console.log(data); // Log the data being sent

    setLoading(true);

    axios
      .post(`http://localhost:3000/api/employeesTrainings`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization':`Bearer ` + token
        },
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Employee training created successfully", {
          variant: "success",
        });
        navigate(`/employees/details/${employeeId}`);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error creating employee training", { variant: "error" });
        console.log(error.response.data);  // Log the server response
      });
  };

  return (
    <div className="p-6">
      <BackButton destination={`/employees/details/${employeeId}`} />
      <h1 className="text-3xl font-bold text-gray-800 my-4">Create Training Session</h1>
      {loading ? <Spinner /> : null}
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full p-6 mx-auto max-w-lg">
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Employee ID</label>
          <input
            type="text"
            value={employeeId}
            // onChange={(e) => setEmployeeId(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Training ID</label>
          <input
            type="text"
            value={trainingId}
            onChange={(e) => setTrainingId(e.target.value)}
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
        <div className="text-right">
          <button
            className="bg-indigo-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-indigo-700"
            onClick={handleSaveEmployeeTraining}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployeesTrainings;
