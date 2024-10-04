import { FC, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Formik, Field, FormikProps, FormikHelpers } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useAuth } from "../../authentication/authContext";

interface formValues {
  username: string;
  password: string;
}

const Login: FC = () => {
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (
    values: formValues,
    { setSubmitting }: FormikHelpers<formValues>
  ) => {
    try {
      console.log("Form submit called, values:", values);
      const response = await axios.post(
        "http://localhost:3000/api/login",
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.data;
      console.log("Response from server:", data);
      login(data.token);
      setErrorMessage(null); // Clear previous error message
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error response from server:", error.response?.data);
        if (error.response?.status === 401) {
          setErrorMessage("Invalid username or password");
        } else {
          setErrorMessage("An error occurred. Please try again.");
        }

      } else {
        console.error("Login failed", error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold" data-test="header">Login</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your details to view dashboard.
        </p>
      </div>
      {errorMessage && (
        <Alert variant="danger" data-test="error-message">
          {errorMessage}
        </Alert>
      )}
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit }: FormikProps<formValues>) => (
          <Form className="space-y-4" onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Field type="username" name="username" as={Form.Control} data-test="username" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Field type="password" name="password" as={Form.Control} data-test="password" />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="w-full bg-indigo-500"
              data-test="submit"
            >
              Sign In
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
