import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';

const EditTraining = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("INTERNAL"); // Default value
  const [validityPeriod, setValidityPeriod] = useState("");
  const [trainingProvider, setTrainingProvider] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/api/trainings/${id}`,{
        headers: {
          'Authorization':`Bearer ` + token,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        const data = response.data;
        setTitle(data.title || "");
        setDescription(data.description || "INTERNAL");   // default value
        setValidityPeriod(data.validity_period || "");
        setTrainingProvider(data.training_provider || "");
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

  const handleEditTraining = () => {
    if (!title || !description || !validityPeriod || !trainingProvider) {
      enqueueSnackbar("Please fill up all fields", { variant: "warning" });
      return;
    }

    const data = {
      title,
      description,
      validity_period: parseInt(validityPeriod, 10), // Ensure it's a number
      training_provider: trainingProvider,
    };

    console.log(data); // Log the data being sent

    setLoading(true);

    axios
      .put(`http://localhost:3000/api/trainings/${id}`, data, {
        headers: {
          'Authorization':`Bearer ` + token,
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Training edited successfully", { variant: "success" });
        navigate("/trainings");
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error editing training", { variant: "error" });
        console.log(error.response.data);  // Log the server response
      });
  };

  return (
    <div className="p-6">
      <BackButton destination="/trainings" />
      <h1 className="text-3xl font-bold text-gray-800 my-4">Edit Training</h1>
      {loading ? <Spinner /> : null}
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full p-6 mx-auto max-w-lg">
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
            data-test="input-title"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Description</label>
          <select
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
            data-test="input-description"
          >
            <option value="INTERNAL">INTERNAL</option>
            <option value="EXTERNAL">EXTERNAL</option>
            <option value="OTHERS">OTHERS</option>
          </select>
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Validity Period (in months)</label>
          <input
            type="number"
            value={validityPeriod}
            onChange={(e) => setValidityPeriod(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
            data-test="input-validity"
          />
        </div>
        {/* <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Training Provider</label>
          <input
            type="text"
            value={trainingProvider}
            onChange={(e) => setTrainingProvider(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
          />
        </div> */}
        <div className="text-right">
          <button
            className="bg-indigo-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-indigo-700"
            onClick={handleEditTraining}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTraining;
