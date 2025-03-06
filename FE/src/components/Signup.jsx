import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const Signup = () => {
  const { signup } = useAuth();
  const [data, formData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const res = await signup({ name: data.name, email: data.email, password: data.password });
    if (res) navigate("/login");
  }

  const handleChange = (e, key) => {
    formData({ ...data, [key]: e.target.value });
  }

  return (
    <div className='flex flex-col items-center justify-center w-full h-[94.5vh]'>
      <form onSubmit={handleSignup} className='flex flex-col cursor-pointer items-center justify-center bg-red-400 px-10 py-10 space-y-4 rounded-2xl text-xl '>
        <h2 className='text-2xl font-bold'>Signup</h2>
        <input className="border p-1.5 rounded-md" type="text" value={data.name} placeholder='Enter your name' onChange={(e) => handleChange(e, "name")} required />
        <input className="border p-1.5 rounded-md" type="email" value={data.email} placeholder='Enter your email' onChange={(e) => handleChange(e, "email")} required />
        <input className="border p-1.5 rounded-md" type="password" value={data.password} placeholder='Enter your password' onChange={(e) => handleChange(e, "password")} required />
        <button type='submit' className='cursor-pointer outline-1 text-[17px] mt-5 rounded-lg px-4 py-1.5 text-center hover:bg-orange-400 transition-all duration-200 font-medium '>Submit</button>
      </form>
      <div>Already signed up? Go to <Link to="/login" className='text-blue-800 font-medium'>Login</Link> </div>
    </div>
  )
}

export default Signup