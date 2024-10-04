import pool from "../models/database.js";
import {
  trainingIdExists,
  getTrainings,
  getTrainingByID,
  createTraining,
  deleteTraining,
  updateTraining,
} from "../models/trainingModel.js";

jest.mock('../models/database.js', () => ({
  query: jest.fn(),
}));

describe('Unit Test: Training Database Functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('trainingIdExists - should return true if training ID exists', async () => {
    pool.query.mockResolvedValueOnce([[{ count: 1 }]]);
    const result = await trainingIdExists(1);
    expect(result).toBe(true);
  });

  test('trainingIdExists - should return false if training ID does not exist', async () => {
    pool.query.mockResolvedValueOnce([[{ count: 0 }]]);
    const result = await trainingIdExists(1);
    expect(result).toBe(false);
  });

  test('getTrainings - should return all trainings', async () => {
    const mockTrainings = [
      { id: 1, title: 'Safety Training' },
      { id: 2, title: 'Leadership Training' },
    ];
    pool.query.mockResolvedValueOnce([mockTrainings]);
    const result = await getTrainings();
    expect(result).toEqual(mockTrainings);
  });

  test('getTrainingByID - should return a training by ID', async () => {
    const mockTraining = { id: 1, title: 'Safety Training' };
    pool.query.mockResolvedValueOnce([[mockTraining]]);
    const result = await getTrainingByID(1);
    expect(result).toEqual(mockTraining);
  });

  test('createTraining - should create a new training', async () => {
    pool.query.mockResolvedValueOnce([{ insertId: 1 }]);
    const mockTraining = { id: 1, title: 'Safety Training', description: 'Safety procedures', validity_period: 365, training_provider: 'Provider A' };
    pool.query.mockResolvedValueOnce([[mockTraining]]);
    const result = await createTraining('Safety Training', 'Safety procedures', 365, 'Provider A');
    expect(pool.query).toHaveBeenCalledWith(
      "INSERT INTO trainings (title, description, validity_period, training_provider) VALUES (?, ?, ?, ?)",
      ['Safety Training', 'Safety procedures', 365, 'Provider A']
    );
    expect(result).toEqual(mockTraining);
  });

  test('deleteTraining - should delete a training and return success message', async () => {
    pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const result = await deleteTraining(1);
    expect(result).toBe('Delete Successful');
  });

  test('deleteTraining - should return not found message if training does not exist', async () => {
    pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const result = await deleteTraining(1);
    expect(result).toBe('Training not found');
  });

  test('updateTraining - should throw an error if training ID does not exist', async () => {
    pool.query.mockResolvedValueOnce([[{ count: 0 }]]);
    await expect(updateTraining(1, 'Safety Training', 'Safety procedures', 365, 'Provider A'))
      .rejects
      .toThrow('Training with id 1 does not exist');
  });

  test('updateTraining - should update an existing training', async () => {
    pool.query.mockResolvedValueOnce([[{ count: 1 }]]);
    pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const mockTraining = { id: 1, title: 'Safety Training', description: 'Safety procedures', validity_period: 365, training_provider: 'Provider A' };
    pool.query.mockResolvedValueOnce([[mockTraining]]);
    const result = await updateTraining(1, 'Safety Training', 'Safety procedures', 365, 'Provider A');
    expect(result).toEqual(mockTraining);
  });
});
