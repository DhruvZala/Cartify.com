import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, KeyRound, Eye, EyeOff } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../../styles/login.css";
import { passwordRegex, emailRegex } from "../../utils/constants/constants";
import Cookies from "js-cookie";

const validationSchema = Yup.object({
  email: Yup.string()
    .matches(emailRegex, "Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .matches(
      passwordRegex,
      "Password must contain at least" +
        "- 1 uppercase letter" +
        "- 1 lowercase letter" +
        "- 1 number" +
        "- 1 special character (@$!%*?&)"
    )
    .required("Password is required"),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setLoginError("");

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email.trim(), password: values.password }),
        });

        // Check for empty or non-JSON response
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server returned non-JSON response");
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }

        if (data.isAdmin) {
          sessionStorage.setItem("jwtToken", data.token);
        } else {
          localStorage.setItem("jwtToken", data.token);
          Cookies.set("jwtToken", data.token, { expires: 3 });
        }

        if (data.isAdmin) {
          sessionStorage.setItem("userId", data.user.userId);
          sessionStorage.setItem("email", data.user.email);
          sessionStorage.setItem("name", data.user.name);
          navigate("/admin");
        } else {
          localStorage.setItem("userId", data.user.userId);
          localStorage.setItem("email", data.user.email);
          localStorage.setItem("name", data.user.name);
          navigate("/ProductPage");
        }
      } catch (error) {
        console.error("Login error:", error);
        setLoginError(
          error instanceof Error
            ? error.message
            : "An error occurred during login. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="flex items-center justify-center  px-4 py-12 min-h-screen">
        <form
          onSubmit={formik.handleSubmit}
          className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="mt-2 text-gray-600">Sign in to your account</p>
          </div>

          {loginError && (
            <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg animate-fade-in">
              {loginError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="flex items-center text-sm font-medium text-gray-700"
              >
                <Mail className="w-5 h-5 mr-2 text-indigo-500" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 mt-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="your@email.com"
                disabled={isSubmitting}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm text-red-600 animate-fade-in">
                  {String(formik.errors.email)}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="flex items-center text-sm font-medium text-gray-700"
              >
                <KeyRound className="w-5 h-5 mr-2 text-indigo-500" />
                Password
              </label>
              <div className="relative mt-2">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  disabled={isSubmitting}
                >
                  {passwordVisible ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-sm text-red-600 animate-fade-in">
                  {String(formik.errors.password)}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end">
              <Link
                to="/changePassword"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
              >
                Change password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-4 py-3 text-lg font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 shadow-md hover:shadow-lg ${
                isSubmitting
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/registerPage"
                className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
              >
                Sign up
              </Link>
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Just browsing?{" "}
              <Link
                to="/ProductPage"
                className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
              >
                Continue as guest
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
