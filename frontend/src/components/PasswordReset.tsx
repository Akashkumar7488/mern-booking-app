import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const setVal = (e) => {
    setEmail(e.target.value);
  };

  const sendLink = async (e) => {
    e.preventDefault();

    const res = await fetch("/sendpasswordlink", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    if (data.status == 201) {
      setEmail("");
      setMessage("Reset link sent successfully to your email.");
    } else {
      setMessage("Failed to send reset link. Please try again.");
      toast.error("Failed to send reset link.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full">
        <form className="flex flex-col gap-5">
          <h2 className="text-3xl font-bold text-center">Enter your Email</h2>
          {message && <p style={{ color: message.includes("successfully") ? "green" : "red" }}>{message}</p>}

          <label htmlFor="email" className="text-gray-700 text-sm font-bold">
            Email:
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={setVal} 
              className="border rounded w-full py-1 px-2 mt-1" 
              required 
            />
          </label>
          <button 
            onClick={sendLink} 
            className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl rounded">
            Send
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default PasswordReset;




