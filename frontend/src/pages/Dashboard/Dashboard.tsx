import axiosInstance from "../../authentication/axiosInstance.tsx";
import { useEffect, useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar";
import { Link } from "react-router-dom";
import "./Dashboard.css"; // Import the CSS file
import PercentagePieChart from "./Percentage.tsx";
import Numbers from "./Numbers.tsx";

//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";

//Material UI Imports
import { Box } from "@mui/material";

// Define the Employee and Training interfaces
interface Training {
  validity: string;
  title: string;
  latest_end_date: string;
  expiry_date: string | null;
  scheduled_date: string | null;
}

interface Employee {
  employee_id: string;
  employee_name: string;
  designation: string;
  // department_name: string;
  // job_name: string;
  relevantTrainings: Training[];
}

const Example: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axiosInstance.get<Employee[]>("/dashboard");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees: ", error);
      }
    };

    fetchEmployees();
  }, []);

  // Define columns
  const columns = useMemo<MRT_ColumnDef<Employee>[]>(
    () => [
      {
        id: "employee", // id used to define `group` column
        header: "Employee Details",
        columns: [
          {
            accessorKey: "employee_id",
            header: "ID",
            size: 1,
          },
          {
            accessorKey: "employee_name", // Directly use the employee_name from the Employee interface
            header: "Name",
            size: 200,
            Cell: ({ renderedCellValue }) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <span>{renderedCellValue}</span>
              </Box>
            ),
          },
          // {
          //   accessorKey: 'department_name', // Use the department_name field
          //   header: 'Department',
          //   size: 150,
          // },
          {
            accessorKey: "designation", // Use the job_name field
            header: "Designation",
            size: 150,
          },
        ],
      },
      {
        id: "trainings",
        header: "Trainings",
        columns: [
          {
            accessorFn: (row) =>
              row.relevantTrainings.map((training) => training.title).join(", "),
            id: "trainingTitles",
            header: "Relevant Trainings",
            size: 300,
            Cell: ({ row }) => (
              <Box data-test="training-titles">
                {row.original.relevantTrainings.map((training, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor:
                        index % 2 === 0
                          ? "rgba(227,227,227,0.8)"
                          : "transparent",
                      // backgroundColor:
                      //   training.validity === 'valid'
                      //     ? 'rgba(0, 128, 0, 0.8)' // green with 80% opacity
                      //     : training.validity === 'expired'
                      //     ? 'rgba(255, 165, 0, 0.8)' // orange with 80% opacity
                      //     : 'rgba(255, 0, 0, 0.8)', // red with 80% opacity
                      // color: 'white',
                      padding: "4px",
                      margin: "2px 0",
                    }}
                  >
                    {training.title}
                  </div>
                ))}
              </Box>
            ),
          },
          {
            accessorFn: (row) =>
              row.relevantTrainings
                .map((training) => training.latest_end_date)
                .join(", "),
            id: "trainingLatestEndDates",
            header: "Last Completed Date",
            size: 200,
            Cell: ({ row }) => (
              <Box data-test="training-latest-end-dates">
                {row.original.relevantTrainings.map((training, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor:
                        index % 2 === 0
                          ? "rgba(227,227,227,0.8)"
                          : "transparent",
                      // backgroundColor:
                      //   training.validity === 'valid'
                      //     ? 'green'
                      //     : training.validity === 'expired'
                      //     ? 'orange'
                      //     : 'red',
                      // color: 'white',
                      padding: "4px",
                      margin: "2px 0",
                    }}
                  >
                    {training.expiry_date
                      ? new Date(training.latest_end_date).toLocaleDateString()
                      : "N/A"}
                  </div>
                ))}
              </Box>
            ),
          },
          {
            accessorFn: (row) =>
              row.relevantTrainings
                .map((training) => training.expiry_date)
                .join(", "),
            id: "trainingExpiryDates",
            header: "Certification End Date",
            size: 250,
            Cell: ({ row }) => (
              <Box data-test="training-expiry-dates">
                {row.original.relevantTrainings.map((training, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor:
                        training.validity === "Valid"
                          ? "rgb(188,226,158,1)"
                          : training.validity === "Expired"
                          ? "rgb(255,207,150,1)"
                          : "rgb(255,135,135)",
                      // color: 'white',
                      padding: "4px",
                      margin: "2px 0",
                    }}
                  >
                    {training.expiry_date
                      ? new Date(training.expiry_date).toLocaleDateString()
                      : "N/A"}
                  </div>
                ))}
              </Box>
            ),
          },
          {
            accessorFn: (row) =>
              row.relevantTrainings
                .map((training) => training.scheduled_date)
                .join(", "),
            id: "scheduledTrainingDate",
            header: "Next Scheduled Date",
            size: 200,
            Cell: ({ row }) => (
              <Box data-test="scheduled-training-dates">
                {row.original.relevantTrainings.map((training, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor:
                        training.validity === "Valid"
                          ? "rgb(188,226,158,1)"
                          : training.validity === "Expired"
                          ? "rgb(255,207,150,1)"
                          : "rgb(255,135,135)",
                      // color: 'white',
                      padding: "4px",
                      margin: "2px 0",
                    }}
                  >
                    {training.scheduled_date
                      ? new Date(training.scheduled_date).toLocaleDateString()
                      : "N/A"}
                  </div>
                ))}
              </Box>
            ),
          },
        ],
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: employees, // data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: false,
    enableRowSelection: true,
    initialState: {
      showColumnFilters: true,
      showGlobalFilter: false,
      columnPinning: {
        left: ["mrt-row-select"],
        right: ["mrt-row-actions"],
      },
      pagination: {
        pageIndex: 0,
        pageSize: 15, // Set initial rows per page value to 15
      },
    },
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "top",
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [15],
      shape: "rounded",
      variant: "outlined",
    },
  });

  return (
    <div className="dashboard-container" data-test="dashboard-container">
      <Sidebar activeItem="Dashboard" />
      <div className="dashboard-content" data-test="dashboard-content">
        <h2 className="text-3xl my-8" data-test="dashboard-header">Dashboard Page</h2>
        <div id="dashboard-table" data-test="dashboard-table">
          <MaterialReactTable table={table} />
        </div>
        {/* <div className="dashboard-generate-button-container">
          <Link to="/report">
            <button className="dashboard-generate-button" data-test="dashboard-generate-button">
              Generate Skills Report
            </button>
          </Link>
        </div> */}
        <div className="stats-container">
          <PercentagePieChart />
          <Numbers />
        </div>
      </div>
    </div>
  );
};

// Date Picker Imports - these should just be in your Context Provider
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const ExampleWithLocalizationProvider = () => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Example />
  </LocalizationProvider>
);

export default ExampleWithLocalizationProvider;
