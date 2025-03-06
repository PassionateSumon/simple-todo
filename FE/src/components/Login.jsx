import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [data, formData] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login({ email: data.email, password: data.password });
    console.log(res);
    if (res) navigate("/");
  }

  const handleChange = (e, key) => {
    formData({ ...data, [key]: e.target.value });
  }
  return (
    <div className='flex flex-col items-center justify-center w-full h-[94.5vh]'>
      <form onSubmit={handleLogin} className='flex flex-col cursor-pointer items-center justify-center bg-red-400 px-10 py-10 space-y-4 rounded-2xl text-xl '>
        <h2 className='text-2xl font-bold'>Login</h2>
        <input className="border p-1.5 rounded-md" type="email" value={data.email} placeholder='Enter your email' onChange={(e) => handleChange(e, "email")} required />
        <input className="border p-1.5 rounded-md" type="password" value={data.password} placeholder='Enter your password' onChange={(e) => handleChange(e, "password")} required />
        <button type='submit' className='cursor-pointer outline-1 text-[17px] mt-5 rounded-lg px-4 py-1.5 text-center hover:bg-orange-400 transition-all duration-200 font-medium '>Submit</button>
      </form>
      <div>Didn't signed up? Go to <Link to="/signup" className='text-blue-800 font-medium'>Signup</Link> </div>
    </div>
  )
}

export default Login