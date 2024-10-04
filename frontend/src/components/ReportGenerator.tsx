import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Sidebar from './Sidebar'; // Assuming Sidebar is a separate component
import './ReportGenerator.css';  // Adjust the import based on your directory structure

interface SkillReport {
  employee_id: number;
  employee_name: string;
  training_course: string;
  validity: string;
}

interface Training {
  id: number;
  title: string;
  description: string;
  training_provider: string;
}

const ReportGenerator: React.FC = () => {
  const [skillsReport, setSkillsReport] = useState<SkillReport[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [selectedTraining, setSelectedTraining] = useState<string>(''); // State for selected training
  const [selectedValidity, setSelectedValidity] = useState<string>(''); // State for selected validity
  const [dataFetched, setDataFetched] = useState<boolean>(false); // State to track if data is fetched
  const token = localStorage.getItem('token');
  
  const fetchSkillsReport = async () => {
    try {
      const response = await axios.get<SkillReport[]>('http://localhost:3000/api/skillsReport',{
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setSkillsReport(response.data);
      setDataFetched(true); // Update state to indicate data is fetched
    } catch (error) {
      console.error('Error fetching skills report', error);
    }
  };

  const fetchTrainings = async () => {
    try {
      const response = await axios.get<Training[]>('http://localhost:3000/api/trainings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setTrainings(response.data);
    } catch (error) {
      console.error('Error fetching trainings', error);
    }
  };

  const handleTrainingChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedTraining(event.target.value);
  };

  const handleValidityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedValidity(event.target.value);
  };

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const generatePDF = () => {
    const doc = new jsPDF('landscape');
    const margin = 10;
    const lineHeight = 7;
    const fontSize = 12;
    let y = margin;
  
    doc.setFontSize(fontSize);
    doc.text('Skills Report', margin, y);
    y += lineHeight;
  
    const filteredReports = skillsReport.filter(report => 
      (selectedTraining ? report.training_course === selectedTraining : true) &&
      (selectedValidity ? report.validity === selectedValidity : true)
    );
  
    const rows = filteredReports.map(report => [
      report.employee_id,
      report.employee_name,
      report.training_course,
      report.validity,
    ]);
  
    autoTable(doc, {
      head: [['ID', 'Name', 'Training', 'Validity']],
      body: rows,
      startY: y,
    });
  
    const pdfBlob = doc.output('blob');
    const pdfBlobUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(pdfBlobUrl);
    doc.save('skills_report.pdf');
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  // Filter skills report based on selected criteria
  const filteredReports = skillsReport.filter(report => 
    (selectedTraining ? report.training_course === selectedTraining : true) &&
    (selectedValidity ? report.validity === selectedValidity : true)
  );

  return (
    <div className="flex">
      <Sidebar activeItem="Report" />
      <div className="flex-1">
        <h2 data-test="report-generator-header" className="text-3xl my-8">Skills Report Generator</h2>
        <div className="button-container">
          <div className="select-container">
            <select data-test="training-select" value={selectedTraining} onChange={handleTrainingChange}>
              <option value="">All Trainings</option>
              {trainings.map((training, index) => (
                <option key={index} value={training.title}>{training.title}</option>
              ))}
            </select>
  
            <select data-test="validity-select" value={selectedValidity} onChange={handleValidityChange}>
              <option value="">All Validities</option>
              <option value="Valid">Valid</option>
              <option value="Expired">Expired</option>
              <option value="NA">NA</option>
            </select>
          </div>
          <div className="buttons flex items-center space-x-4 mt-4">
            <button data-test="fetch-report-button" onClick={fetchSkillsReport} className="bg-indigo-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-indigo-700">Fetch Skills Report</button>
            <button data-test="generate-report-button" onClick={generatePDF} className="bg-indigo-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-indigo-700">Download Skills Report PDF</button>
          </div>
        </div>
  
        {dataFetched && (
          <>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 bg-gray-100 border-b">ID</th>
                  <th className="py-2 px-4 bg-gray-100 border-b">Name</th>
                  <th className="py-2 px-4 bg-gray-100 border-b">Training</th>
                  <th className="py-2 px-4 bg-gray-100 border-b">Validity</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report, index) => (
                  <tr 
                    key={index} 
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="py-2 px-4 border-b">
                      {report.employee_id}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {report.employee_name}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {report.training_course}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {report.validity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportGenerator;