import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";
import axios from "axios";
import { useSnackbar } from "notistack";
import DeleteTraining from "../Trainings/DeleteTraining";

const DeleteTrainingSession: React.FC = () => {
  
  const [sessionID, setSessionID] = useState<string>("");
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const deleteSession = () => {
    axios
      .delete(`http://localhost:3000/api/sessions/${sessionID}`, {
        headers: {
          'Authorization':`Bearer ` + token,
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        enqueueSnackbar("Session Deleted successfully", {
          variant: "success",
        });
        navigate("/sessions");
      })
      .catch((error) => {
        enqueueSnackbar("Error", { variant: "error" });
        console.log(error);
      });
  }

  return (
    <div className="p-6">
      <BackButton destination={`/sessions`} />
      <h1 className="text-3xl font-bold text-gray-800 my-4">Delete Training Session</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full p-6 mx-auto max-w-lg">
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Session ID</label>
          <input
            type="string"
            value={sessionID}
            onChange={(e) => setSessionID(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
          />
        </div>
        <div className="text-right">
          <button
            // className="bg-indigo-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-indigo-700"
            className="bg-red-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-red-700"
            onClick={deleteSession}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteTrainingSession;