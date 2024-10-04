import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import axios from "axios";
import axiosInstance from "../../authentication/axiosInstance";
import { useSnackbar } from "notistack";
import Select from 'react-select';
import { number } from "yup";
import { Link } from "react-router-dom";


export const SessionSelectorMarkAttn: React.FC = () => {
  
  const [sessionId, setSessionId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const checkSessionID = async () => {
    setError(null);  // Clear previous errors
    try {
      const response = await axios.get(`/api/sessions/${sessionId}`);
      console.log("API Response:", response.status);
      if (response.status === 200) {
        // Session ID exists, navigate to the next page
        navigate(`/sessions/markattendance/${sessionId}`);
      } else {
        // setError("Session ID not found.");
        navigate(`/sessions`);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setError("Session ID not found.");
      } else {
        setError("Error checking Session ID.");
      }
    }
  };

  return (
    <div className="p-6">
      <BackButton destination={`/sessions`} />
      <h1 className="text-3xl font-bold text-gray-800 my-4">Select Training Session for Attendance Marking</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full p-6 mx-auto max-w-lg">
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Session ID</label>
          <input
            type="string"
            value={sessionId}   // Add the value attribute
            onChange={(e) => setSessionId(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
          />
        </div>
        <div className="text-right">
          {/* <Link to={`/sessions/${sessionID}`} className="mt-4"> */}
              <button 
              onClick={checkSessionID}
              className="bg-indigo-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-indigo-700">
                Next
              </button>
          {/* </Link> */}
        </div>
      </div>
    </div>
  )
}


interface Employee {
    employee_id: string;
    employee_name: string;
}

interface TrainingSession {
  session_id : number;
  start_date : string;
  end_date : string;
  expiry_date : string;
  training_title : string;
  training_id : number;
  employees : Employee[];
}

export const MarkAttendance : React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]); // For populating the multiselect list
  // const [sessionId, setSessionId] = useState<string>();
  const { sessionId } = useParams<{ sessionId: string }>();
  const [employeeIds, setEmployeeIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  // const location = useLocation();
  const token = localStorage.getItem('token');

  useEffect(() => {
    setLoading(true);

    axiosInstance
    .get(`http://localhost:3000/api/sessions/employees/${sessionId}`)
    .then((response) => {
        setEmployees(response.data);
        setLoading(false);
    })
    .catch((error) => {
        console.log(error);
        setLoading(false);
    });

    // axiosInstance
    // .get("/trainings")
    // .then((response) => {
    //     setTrainings(response.data);
    //     setLoading(false);
    // })
    // .catch((error) => {
    //     console.log(error);
    //     setLoading(false);
    // });

    }, []);

  const handleMarkAttendance = () => {
    const data = {
        session_id: sessionId,
        employee_ids: employeeIds,
      };
    // console.log(data); // Log the data being sent

    // Validate fields
    // if (!sessionId || !employeeIds) {
    //   enqueueSnackbar("Please fill out all fields", { variant: "warning" });
    //   return;
    // }

    setLoading(true);

    axios
    .post(`http://localhost:3000/api/sessions/attendance/`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization':`Bearer ` + token
      },
    })
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Attendance Marked", {
          variant: "success",
        });
        navigate(`/sessions`);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error", { variant: "error" });
        console.log(error.response.data);  // Log the server response
      });
  };

  return (
    <div className="p-6">
      <BackButton destination={`/sessions`} />

      <h1 className="text-3xl font-bold text-gray-800 my-4">Mark Attendance</h1>
      {loading ? <Spinner /> : null}


      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full p-6 mx-auto max-w-lg">


        <div className="my-4">
            {/* <label className="text-xl mr-4 text-gray-500">Session ID</label>
            <input
                type="text"
                value={sessionId}
                onInput={(e) => setSessionId(e.currentTarget.value)}
                className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
            /> */}
            </div>

            <div className="my-4">
            <label className="text-xl mr-4 text-gray-500">Employee</label>
            <Select
                isMulti
                onChange={(newValue: any) => {
                    if (newValue !== null) {
                        setEmployeeIds(newValue.map((employee: any) => employee.value)); // Set to empty string or any default value as need
                    }
                }}
                options={employees.map((employee : Employee) => ({
                    value: employee.employee_id,
                    label: employee.employee_name,
                }))}
            />
            </div>

            {/* <div className="my-4">
            <label className="text-xl mr-4 text-gray-500">Training</label>
            <select
                value={trainingId}
                onChange={(e) => setTrainingId(e.target.value)}
                className="border-2 border-gray-500 px-4 py-2 w-full rounded-md">
            </select>
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
            </div> */}

            <div className="text-right pt-48">
            <button
                className="bg-indigo-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-indigo-700"
                onClick={handleMarkAttendance}
            >
                Save
            </button>
            </div>
        </div>
    </div>
  );

};

export default MarkAttendance;
