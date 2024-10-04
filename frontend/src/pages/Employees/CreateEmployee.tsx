import { useState } from "react";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const CreateEmployee = () => {
  const [id, setID] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [hireDate, setHireDate] = useState<string>("");
  const [designation, setDesignation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem('token');

  const handleSaveEmployee = () => {
    const data = {
      id,
      name,
      email,
      hire_date: formatDate(hireDate),
      designation,
    };
    setLoading(true);
    axios
      .post(`http://localhost:3000/api/employees`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Employee created successfully", {
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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2); // Add leading zero
    const day = (`0${date.getDate()}`).slice(-2); // Add leading zero
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="p-6">
      <BackButton destination="/employees" />
      <h1 className="text-3xl font-bold text-gray-800 my-4">Create Employee</h1>
      {loading ? <Spinner /> : null}
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full p-6 mx-auto max-w-lg">
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">ID</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setID(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
            data-test="input-id"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
              data-test="input-name"
            />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
            data-test="input-email"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Designation</label>
          <input
            type="text"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
            data-test="input-designation"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Hire Date</label>
          <input
            type="date"
            value={hireDate}
            onChange={(e) => setHireDate(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
            data-test="input-hire-date"
          />
        </div>
        <div className="text-right">
          <button
            className="bg-indigo-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-indigo-700"
            onClick={handleSaveEmployee}
            data-test="save-button"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployee;
