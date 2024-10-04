import { useState } from "react";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

const DeleteEmployee = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem('token');
  
  const handleDeleteEmployee = () => {
    setLoading(true);
    axios
      .delete(`http://localhost:3000/api/employees/${id}`, {
        headers: {
          'Authorization':`Bearer ` + token,
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Employee Deleted successfully", {
          variant: "success",
        });
        navigate("/employees");
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error", { variant: "error" });
        console.log(error);
      });
  };

  return (
    <div className="p-6">
      <BackButton destination="/employees" />
      <h1 className="text-3xl font-bold text-gray-800 my-4">Delete Employee</h1>
      {loading ? <Spinner /> : null}
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full p-8 mx-auto max-w-lg text-center">
        <h3 className="text-2xl mb-4">
          Are you sure you want to delete this employee?
        </h3>
        <button
          className="bg-red-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-red-700"
          onClick={handleDeleteEmployee}
        >
          Yes, Delete it
        </button>
      </div>
    </div>
  );
};

export default DeleteEmployee;
