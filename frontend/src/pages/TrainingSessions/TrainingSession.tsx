import React from "react";
import axiosInstance from "../../authentication/axiosInstance.tsx";
import { useEffect, useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar";
import { Link } from "react-router-dom";
// import "./Dashboard.css"; // Import the CSS file

//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";

//Material UI Imports
import { Box } from "@mui/material";

// Define the Employee and Training interfaces
// interface Training {
//   validity: string;
//   title: string;
//   latest_end_date: string;
//   expiry_date: string | null;
//   scheduled_date: string | null;
// }

// interface Employee {
//   employee_id: string;
//   employee_name: string;
//   designation: string;
//   // department_name: string;
//   // job_name: string;
//   relevantTrainings: Training[];
// }

interface Employee {
    employee_id : number;
    employee_name : string;
    designation : string;
    status : string;
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

const Example: React.FC = () => {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axiosInstance.get<{[key: string]: TrainingSession}>("/sessions");
        const data = response.data;
        const sessionsArray: TrainingSession[] = Object.values(data);
        setSessions(sessionsArray);
      } catch (error) {
        console.error("Error fetching training sessions: ", error);
      }
    };

    fetchSessions();
  }, []);

  // Define columns
  const columns = useMemo<MRT_ColumnDef<TrainingSession>[]>(
    () => [
    {
        // id: "session_id",
        accessorKey: "session_id",
        header: "Session ID"
    },
      {
        id: "employee",
        header: "Employee Details",
        columns: [
          {
            accessorFn: (session) => session.employees.map(employee => employee.employee_id).join(", "),
            id: "employee_id",
            header: "Employee ID",
            sortDescFirst: true,
            Cell: ({row}) => (
              <Box>
                {row.original.employees.map((employee, index) => (
                  <div 
                    key = {index}
                    style={{
                      backgroundColor:
                        index % 2 === 0
                          ? "transparent"
                          : "rgba(227,227,227,0.8)",
                      padding: "4px",
                      margin: "2px 0",
                    }}
                  >
                    {employee.employee_id}
                  </div>
                ))}
              </Box>
            )
          },
          {
            accessorFn: (session) => session.employees.map(employee => employee.employee_name).join(", "),
            id: "employee_name",
            header: "Employee Name",
            Cell: ({row}) => (
              <Box>
                {row.original.employees.map((employee, index) => (
                  <div 
                    key = {index}
                    style={{
                      backgroundColor:
                        index % 2 === 0
                          ? "transparent"
                          : "rgba(227,227,227,0.8)",
                      padding: "4px",
                      margin: "2px 0",
                    }}
                  >
                    {employee.employee_name}
                  </div>
                ))}
              </Box>
            )
          },
        ],
      },
      {
        id: "session_details",
        header: "Session Details",
        columns : [
          {
            accessorFn: (session) => session.employees.map(employee => employee.status).join(", "),
            id: "status",
            header: "Status",
            Cell: ({row}) => (
              <Box>
                {row.original.employees.map((employee, index) => (
                  <div 
                    key = {index}
                    style={{
                      backgroundColor:
                        index % 2 === 0
                          ? "transparent"
                          : "rgba(227,227,227,0.8)",
                      padding: "4px",
                      margin: "2px 0",
                    }}
                  >
                    {employee.status}
                  </div>
                ))}
              </Box>
            )
          },
            {
                accessorKey: "training_title",
                header: "Training"
            },
            {
            // accessorKey: "start_date",
            accessorFn: (session) =>
                session.start_date ? new Date(session.start_date).toLocaleDateString() : "",
            header: "Start Date"
            },
            {
            // accessorKey: "end_date",
            accessorFn: (session) =>
                session.end_date ? new Date(session.end_date).toLocaleDateString() : "",
            header: "End Date"
            },
            {
            // accessorKey: "expiry_date",
            accessorFn: (session) =>
                session.expiry_date ? new Date(session.expiry_date).toLocaleDateString() : "",
            header: "Expiry Date"
            }
        ]
      }
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: sessions, // data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
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
      sorting: [
        {
          id: "session_id",
          desc: true,
        }
      ],
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
    <div className="dashboard-container">
      <Sidebar activeItem="Training Sessions" />
      <div className="dashboard-content">
        <h2 className="text-3xl my-8">Training Sessions Page</h2>
        <Link to={`/sessions/create`} className="mt-4">
            <button className="bg-indigo-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-indigo-700" data-test="create-session-button">
              Create Session
            </button>
        </Link>
        <Link to={`/sessions/edit`} className="mt-4">
            <button className="bg-indigo-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-indigo-700" data-test="edit-session-button">
              Edit Session
            </button>
        </Link>
        <Link to={`/sessions/delete`} className="mt-4">
            <button className="bg-indigo-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-indigo-700" data-test="delete-session-button">
              Delete Session
            </button>
        </Link>
        <Link to={`/sessions/select`} className="mt-4">
            <button className="bg-indigo-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-indigo-700" data-test="mark-attendance-button">
              Mark Attendance
            </button>
        </Link>
        <div id="dashboard-table" data-test="session-table">
          <MaterialReactTable table={table} />
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
