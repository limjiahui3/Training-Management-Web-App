import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import axios from "axios";
import axiosInstance from "../../authentication/axiosInstance";
import { useSnackbar } from "notistack";
import Select from 'react-select';

interface Employee {
    id: string;
    name: string;
    email: string;
    designation: string;
}

interface Training {
    id: string;
    title: string;
    description: string;
    validity_period: string;
    training_provider: string | null;
}

const CreateTrainingSession: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]); // For populating the multiselect list
    const [trainings, setTrainings] = useState<Training[]>([]);
  // States which employees (by their ids) the training is being created for
  const [employeeIds, setEmployeeIds] = useState<string[]>([]); 
  const [trainingId, setTrainingId] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  // const [expiryDate, setExpiryDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  // const location = useLocation();
  const token = localStorage.getItem('token');

    useEffect(() => {
        setLoading(true);

        axiosInstance
        .get("/employees")
        .then((response) => {
            setEmployees(response.data);
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
            setLoading(false);
        });

        axiosInstance
        .get("/trainings")
        .then((response) => {
            setTrainings(response.data);
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
            setLoading(false);
        });

    }, []);
  
  const handleSaveTrainingSessions = () => {

    const data = {
        employee_ids: employeeIds,
        training_id: trainingId,
        status,
        start_date: startDate,
        end_date: endDate,
      };
    console.log(data); // Log the data being sent


    // Validate fields
    if (!employeeIds || !trainingId || !status || !startDate || !endDate) {
      enqueueSnackbar("Please fill out all fields", { variant: "warning" });
      return;
    }

    setLoading(true);

    axios
    .post(`http://localhost:3000/api/sessions/`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization':`Bearer ` + token
      },
    })
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Training Session created", {
          variant: "success",
        });
        navigate(`/sessions`);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error creating training session", { variant: "error" });
        console.log(error.response.data);  // Log the server response
      });
  };

  return (
    <div className="p-6">
      <BackButton destination={`/sessions`} />
      <h1 className="text-3xl font-bold text-gray-800 my-4">Create Training Session</h1>
      {loading ? <Spinner /> : null}
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full p-6 mx-auto max-w-lg">
        <div className="my-4">
            <label className="text-xl mr-4 text-gray-500">Employee</label>
            <Select
                // onChange={setEmployeeId}
                isMulti
                onChange={(newValue) => {
                    if (newValue !== null) {
                      setEmployeeIds(newValue.map((employee) => employee.value)); // Set to empty string or any default value as need
                    }
                  }}
                options={employees.map((employee) => ({
                    value: employee.id,
                    label: employee.name,
                }))}
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
            onClick={handleSaveTrainingSessions}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTrainingSession;
