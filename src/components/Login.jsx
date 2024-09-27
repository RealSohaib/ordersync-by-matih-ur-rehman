import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useUser } from "../Contaxt/contaxt";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const { user,setUser } = useUser();
  const [toggle, setToggle] = useState(true);
  const navigate = useNavigate();

  const Toggle = () => {
    setToggle(!toggle);
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:3001/login", data);

      if (response.data) {
        setUser(response.data);
        console.log("User:", response.data);

        // Navigate based on user role
        if (user.role === "admin") {
          navigate("/admin");
        } else if (user.role === "employee") {
          navigate("/employee");
        }
      } else {
        console.error("Login failed: No data returned");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="flex flex-col gap-6 items-center justify-center m-4 sm:m-10">
      <div className="bg-blue-500 p-8 sm:px-10 sm:py-20 text-center text-white shadow-xl rounded-3xl w-full max-w-md">
        <h1 className="font-bold text-2xl capitalize mb-8">Login Form</h1>
        <form
          className="bg-blue-400 p-6 border-2 rounded-lg transition-all hover:shadow-2xl"
          onSubmit={handleSubmit(onSubmit)}
          method="POST"
        >
          <div className="my-4 flex flex-col gap-3">
            <label htmlFor="username" className="text-lg">
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Enter your username"
              className="w-full border border-slate-200 text-white placeholder-white rounded-lg py-3 px-5 outline-none bg-transparent focus:shadow-xl focus:outline-dashed"
              {...register("username", { required: "Username is required" })}
            />
          </div>
          <div className="my-4 flex flex-col gap-3">
            <label htmlFor="password" className="text-lg">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={toggle ? "password" : "text"}
                name="password"
                placeholder="Enter your password"
                className="w-full border border-slate-200 text-white placeholder-white rounded-lg py-3 px-5 outline-none bg-transparent transition-all focus:shadow-xl focus:outline-double"
                {...register("password", { required: "Password is required" })}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-white"
                onClick={Toggle}
              >
                {toggle ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>
          <div className="my-4 flex flex-col gap-3">
            <label htmlFor="role" className="text-lg">
              Role
            </label>
            <select
              id="role"
              name="role"
              className="w-full border border-slate-200 hover:text-black text-white bg-blue-500 rounded-lg py-3 px-5 outline-none hover:bg-blue-500 transition-all focus:shadow-xl focus:outline-dashed"
              {...register("role", { required: "Role is required" })}
            >
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>
          </div>
          <div className="flex items-center justify-between gap-4 mt-6">
            <button
              type="button"
              className="flex-1 px-4 py-3 font-bold tracking-wide text-white bg-gray-500 rounded-lg transition-all hover:bg-gray-700"
              onClick={handleLogout}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 font-semibold tracking-wide text-white bg-blue-500 rounded-lg transition-all hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;