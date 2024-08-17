import { Link, useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import {login} from "../services/AuthApi";
const Login = () => {
   const [credentials, setCredentials] = useState({ email: "", password: "" });
   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(false);
     const navigate = useNavigate();


   const handleChange = useCallback(e => {
     const { name, value } = e.target;
     setCredentials(prev => ({ ...prev, [name]: value }));
   }, []);

     const handleSubmit = useCallback(
       async e => {
         e.preventDefault();
         setError(null);
         setIsLoading(true);

         try {
           const userData = await login(credentials);
           console.log("Login successful:", userData);
           // Handle successful login (e.g., store user data, redirect)
           navigate("/");
         } catch (err) {
           setError(err.message || "An error occurred during login");
         } finally {
           setIsLoading(false);
         }
       },
       [credentials, navigate]
     );

  return (
    <div className="grid place-content-center w-full h-screen">
      <div className="grid place-items-center p-6 bg-white border-2 border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <form onSubmit={handleSubmit} aria-label="Login form">
          <h2 className="mb-8 text-2xl font-bold">Login</h2>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              id="floating_email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              aria-label="Email address"
            />
            <label
              htmlFor="floating_email"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email address
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              id="floating_password"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              aria-label="Password"
            />
            <label
              htmlFor="floating_password"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Password
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
          {error && (
            <p
              className="mt-2 text-sm text-red-600 dark:text-red-500"
              role="alert"
            >
              {error}
            </p>
          )}
        </form>

        <div className="mt-4">
          <span>Don't have an account?</span>
          <Link
            to="/register"
            className="pl-4 underline text-blue-600 hover:text-blue-800"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;