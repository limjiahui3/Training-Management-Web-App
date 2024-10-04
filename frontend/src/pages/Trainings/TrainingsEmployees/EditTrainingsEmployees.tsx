import { useState, useEffect } from "react";
import BackButton from "../../../components/BackButton";
import Spinner from "../../../components/Spinner";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";

const EditTrainingsEmployees = () => {
  const [employeeId, setEmployeeId] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const location = useLocation();

  const [trainingId, setTrainingId] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const trainingIdFromURL = params.get("trainingId");
    if (trainingIdFromURL) {
      setTrainingId(trainingIdFromURL);
    }

    setLoading(true);
    axios
      .get(`http://localhost:3000/api/employeesTrainings/${id}`)
      .then((response) => {
        const data = response.data;
        setEmployeeId(data.employee_id);
        setStatus(data.status);
        setStartDate(data.start_date.split('T')[0] || "");
        setEndDate(data.end_date.split('T')[0] || "");
        setExpiryDate(data.expiry_date.split('T')[0] || "");
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("An error occurred. Please check the console.", {
          variant: "error",
        });
        console.log(error);
      });
  }, [id, location, enqueueSnackbar]);

  const handleEditTrainingEmployee = () => {
    if (!employeeId || !status || !startDate || !endDate || !expiryDate) {
      enqueueSnackbar("Please fill up all fields", { variant: "warning" });
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

    setLoading(true);
    axios
      .put(`http://localhost:3000/api/employeesTrainings/${id}`, data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Training Employee edited successfully", { variant: "success" });
        navigate(`/trainings/details/${trainingId}`);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error editing training employee", { variant: "error" });
        console.log(error);
      });
  };

  return (
    <div className="p-6">
      <BackButton destination={`/trainings/details/${trainingId}`} />
      <h1 className="text-3xl font-bold text-gray-800 my-4">Edit Training Session</h1>
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
            onClick={handleEditTrainingEmployee}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTrainingsEmployees;
