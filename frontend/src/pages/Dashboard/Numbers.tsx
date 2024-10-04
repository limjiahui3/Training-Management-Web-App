import { useEffect, useState, useMemo } from "react";
// import axios from "axios";
import axiosInstance from "../../authentication/axiosInstance.tsx";

//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';

interface Training {
  title: string;
  numberOfEmployeesWithValid: string;
  numberOfEmployeesWithTraining: string;
}

const Example: React.FC = () => {
    const [trainings, setTrainings] = useState<Training[]>([]);
  
    useEffect(() => {
      const fetchTrainings = async () => {
        try {
          const response = await axiosInstance.get<Record<string, Training>>('http://localhost:3000/api/dashboard/numbers');
          // Convert the response into an array of Training objects
          const trainingArray = Object.keys(response.data).map(title => ({
            title,
            ...response.data[title]
          }));
          setTrainings(trainingArray);
        } catch (error) {
          console.error('Error fetching trainings:', error);
        }
      };
  
      fetchTrainings();
    }, []);
  
    // Define columns for MaterialReactTable
    const columns = useMemo<MRT_ColumnDef<Training>[]>(
      () => [
        {
          accessorKey: 'title',
          header: 'Training',
          size: 300,
        },
        {
            accessorKey: 'numberOfEmployeesWithValid',
            header: 'Certified Employees',
            size: 100,
          },
        {
          accessorKey: 'numberOfEmployeesWithTraining',
          header: 'Relevant Employees',
          size: 100,
        },
      ],
      []
    );

  const table = useMaterialReactTable({
    columns,
    data: trainings, // data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: false,
    enableColumnPinning: false,
    enableFacetedValues: false,
    enableRowActions: false,
    enableRowSelection: false,
    initialState: {
      showColumnFilters: true,
      showGlobalFilter: false,
    },
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'top',
    muiPaginationProps: {
      color: 'secondary',
      rowsPerPageOptions: [15],
      shape: 'rounded',
      variant: 'outlined',
    },
  });

  return (
      <MaterialReactTable table={table} />
  );
};

// Date Picker Imports - these should just be in your Context Provider
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const Numbers = () => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Example />
  </LocalizationProvider>
);

export default Numbers;