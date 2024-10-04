import pool from "./database.js";

export async function getEmployeeDetails() {
    const result = await pool.query(`
        SELECT
            e.id AS employee_id,
            e.name AS employee_name,
            e.designation as designation
        FROM employees e
    `);

    if (!result || result.length === 0) {
      throw new Error('No employee details found');
    }

    const [rows] = result;

    return rows;
}

export async function getRelevantCourses() {
    const result = await pool.query(`
        SELECT
            rt.employee_id,
            rt.training_id,
            rt.validity,
            t.title
        FROM trainings t
        JOIN relevant_trainings rt ON t.id = rt.training_id
        ORDER BY rt.employee_id;
    `);

    if (!result || result.length === 0) {
      throw new Error('No relevant courses found');
    }

    const [rows] = result;
    
    return rows;
}

export async function getTrainingDates() {
    const result = await pool.query(`
        SELECT
            et.employee_id,
            et.training_id,
            t.title,
            MAX(IF(et.status = 'Completed', et.end_date, NULL)) AS latest_end_date,
            MAX(IF(et.status = 'Completed', et.expiry_date, NULL)) AS expiry_date,
            MAX(IF(et.status = 'Scheduled', et.start_date, NULL)) AS scheduled_date
        FROM employees_trainings et
        JOIN trainings t ON et.training_id = t.id
        GROUP BY et.employee_id, et.training_id
        ORDER BY et.employee_id, et.training_id;
    `);

    if (!result || result.length === 0) {
      throw new Error('No training dates found');
    }

    const [rows] = result;

    return rows;
}

export async function getCombinedEmployeeTrainingDetails() {
    const [employeeDetails, relevantTrainings, trainingDates] = await Promise.all([
        getEmployeeDetails(),
        getRelevantCourses(),
        getTrainingDates()
    ]);

    const combined = employeeDetails.map((employee) => {
        const employeeTrainings = relevantTrainings.filter(training => training.employee_id === employee.employee_id);
        const relevantDates = trainingDates.filter(training => training.employee_id === employee.employee_id);
      
        employee.relevantTrainings = employeeTrainings.map(training => {
            const matchingDate = relevantDates.find(date => date.title === training.title);
            return {
                validity: training.validity,
                title: training.title,
                latest_end_date: matchingDate ? matchingDate.latest_end_date : null,
                expiry_date: matchingDate ? matchingDate.expiry_date : null,
                scheduled_date: matchingDate ? matchingDate.scheduled_date : null
            }
        })
      
        return employee;
    });

    return combined;
}

export async function getPercentageValidEmployees() {
    const [employeeDetails, relevantTrainings] = await Promise.all([
        getEmployeeDetails(),
        getRelevantCourses()
      ]);
    
      const combined = employeeDetails.map((employee) => {
        const employeeTrainings = relevantTrainings.filter(training => training.employee_id === employee.employee_id);
    
        employee.relevantTrainings = employeeTrainings.length > 0 ? employeeTrainings.map(training => ({
          validity: training.validity,
          title: training.title
        })) : [{ validity: null, title: null }];
    
        return employee;
      });
    
      const totalEmployees = combined.length;
      const validEmployees = combined.filter(employee =>
        employee.relevantTrainings.every(training => training.validity === "Valid")
      ).length;
    
      const percentageValidEmployees = (validEmployees / totalEmployees) * 100;

      return percentageValidEmployees.toFixed(2);
}

export async function getTrainingStats() {
    const [relevantTrainings] = await Promise.all([
        getRelevantCourses(),
      ]);
    
      const trainingStats = relevantTrainings.reduce((acc, training) => {
        if (!acc[training.title]) {
          acc[training.title] = { valid: 0, total: 0 };
        }
        acc[training.title].total += 1;
        if (training.validity === "Valid") {
          acc[training.title].valid += 1;
        }
        return acc;
      }, {});
    
      const trainingStatsJson = Object.keys(trainingStats).reduce((result, title) => {
        result[title] = {
          numberOfEmployeesWithValid: trainingStats[title].valid.toString(),
          numberOfEmployeesWithTraining: trainingStats[title].total.toString()
        };
        return result;
      }, {});

      return trainingStatsJson;
}
