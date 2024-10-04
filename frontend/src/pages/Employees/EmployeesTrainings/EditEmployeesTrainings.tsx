import { useState, useEffect } from "react";
import BackButton from "../../../components/BackButton";
import Spinner from "../../../components/Spinner";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";

const EditEmployeesTrainings = () => {
  const { id } = useParams();
  const [trainingId, setTrainingId] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();

  const [employeeId, setEmployeeId] = useState("");
  const token = localStorage.getItem('token');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const employeeIdFromURL = params.get("employeeId");
    if (employeeIdFromURL) {
      setEmployeeId(employeeIdFromURL);
    }

    setLoading(true);
    axios
      .get(`http://localhost:3000/api/employeesTrainings/${id}`, {
        headers: {
          'Authorization':`Bearer ` + token,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        const data = response.data;
        setTrainingId(data.training_id);
        setStatus(data.status);
        setStartDate(data.start_date.split('T')[0] || "");
        setEndDate(data.end_date.split('T')[0] || "");
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("An error occurred. Please check the console.", {
          variant: "error",
        });
        console.log(error);
      });
  }, [id, location]);

  const handleEditEmployeesTraining = () => {
    if (!trainingId || !status || !startDate || !endDate) {
      enqueueSnackbar("Please fill up all fields", { variant: "warning" });
      return;
    }

    const data = {
      training_id: trainingId,
      status: status,
      start_date: startDate,
      end_date: endDate,
    };

    setLoading(true);
    axios
      .put(`http://localhost:3000/api/employeesTrainings/${id}`, data, {
        headers: {
          'Authorization':`Bearer ` + token,
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Employee Training edited successfully", { variant: "success" });
        navigate(`/employees/details/${employeeId}`);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error editing employee training", { variant: "error" });
        console.log(error);
      });
  };

  return (
    <div className="p-6">
      <BackButton destination={`/employees/details/${employeeId}`} />
      <h1 className="text-3xl font-bold text-gray-800 my-4">Edit Employee Training</h1>
      {loading ? <Spinner /> : null}
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full p-6 mx-auto max-w-lg">
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Employee ID</label>
          <input
            type="text"
            value={employeeId}
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
            onClick={handleEditEmployeesTraining}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEmployeesTrainings;
