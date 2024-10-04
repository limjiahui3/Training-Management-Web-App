import React from 'react';
import axiosInstance from '../src/authentication/axiosInstance';
import { AxiosResponse } from 'axios';
import { render, screen, waitFor } from '@testing-library/react';
import Numbers from '../src/pages/Dashboard/Numbers';

// Type casting axiosInstance
const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;

// Mock axiosInstance methods
jest.mock('../src/authentication/axiosInstance', () => ({
  interceptors: {
    request: {
      use: jest.fn(),
    },
    response: {
      use: jest.fn(),
    },
  },
  get: jest.fn(),
  post: jest.fn(),
}));

beforeAll(() => {
  global.localStorage = {
    getItem: jest.fn().mockReturnValue('mockToken'),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  } as unknown as Storage;
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Numbers Component', () => {
  test('renders table with data from API', async () => {
    // Mock the API response
    (mockedAxios.get as jest.MockedFunction<typeof axiosInstance.get>).mockResolvedValueOnce({
      data: {
        'Course A': {
          numberOfEmployeesWithValid: '1',
          numberOfEmployeesWithTraining: '1',
        },
        'Course B': {
          numberOfEmployeesWithValid: '1',
          numberOfEmployeesWithTraining: '2',
        },
      },
    } as AxiosResponse);

    render(<Numbers />);

    // Assert that the loading indicator is shown
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for the table to be rendered
    await waitFor(() => {
      // Assert that table headers are rendered
      expect(screen.getByText('Training')).toBeInTheDocument();
      expect(screen.getByText('Certified Employees')).toBeInTheDocument();
      expect(screen.getByText('Total Employees')).toBeInTheDocument();

      // Assert that table rows are rendered with correct data
      expect(screen.getByText('Course A')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();

      expect(screen.getByText('Course B')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('7')).toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    // Mock the API response to throw an error
    (mockedAxios.get as jest.MockedFunction<typeof axiosInstance.get>).mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<Numbers />);

    // Wait for the error message to be rendered
    await waitFor(() => {
      expect(screen.getByText('Error fetching trainings: Error: Failed to fetch')).toBeInTheDocument();
    });
  });
});
