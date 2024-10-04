import { useState, useEffect } from "react";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

const EditEmployee = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hireDate, setHireDate] = useState("");
  // const [division, setDivision] = useState("");
  const [designation, setDesignation] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const token = localStorage.getItem('token');

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/api/employees/${id}`, {
        headers: {
          'Authorization':`Bearer ` + token,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        const data = response.data;
        setName(data.name);
        setEmail(data.email);
        setHireDate(formatDate(data.hire_date)); 
        // setDivision(data.division);
        setDesignation(data.designation);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("An error occurred. Please check the console.", {
          variant: "error",
        });
        console.log(error);
      });
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const handleEditEmployee = () => {
    if (!name || !email || !hireDate || !designation) {
      enqueueSnackbar("Please fill up all fields", { variant: "warning" });
      return;
    }

    const data = {
      name: name,
      email: email,
      hire_date: hireDate,
      // division,
      designation: designation,
    };
    setLoading(true);
    axios
      .put(`http://localhost:3000/api/employees/${id}`, data, {
        headers: {
          'Authorization':`Bearer ` + token,
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Employee edited successfully", { variant: "success" });
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
      <h1 className="text-3xl font-bold text-gray-800 my-4">Edit Employee</h1>
      {loading ? <Spinner /> : null}
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full p-6 mx-auto max-w-lg">
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Hire Date</label>
          <input
            type="date"
            value={hireDate}
            onChange={(e) => setHireDate(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
          />
        </div>
        {/* <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Division</label>
          <input
            type="text"
            value={division}
            onChange={(e) => setDivision(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
          />
        </div> */}
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Designation</label>
          <input
            type="text"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
          />
        </div>
        <div className="text-right">
          <button
            className="bg-indigo-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-indigo-700"
            onClick={handleEditEmployee}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;
