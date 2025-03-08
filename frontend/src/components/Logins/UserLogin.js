import React, { useState, useEffect } from "react";
import bg from "../../images/2.jpg";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import WritingAnimation from '../Logins/WritingAnimations';

const Login = () => {
    const [formData, setFormData] = useState({
        registerNo: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [slideIn, setSlideIn] = useState(false);
    const navigate = useNavigate();
    const lines = ["A Learning", "Resources", "Platform", "For Students"];

    useEffect(() => {
        setSlideIn(true);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/auth/login', formData);
            alert(response.data.message);
            localStorage.setItem('token', response.data.token);
            navigate('/Home');
        } catch (err) {
            setError(err.response?.data?.error || 'Error logging in');
        }
    };

    return (
        <div
            className="relative min-h-screen bg-cover lg:bg-contain bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${bg})` }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-50">
            </div>
            <div
                className={`relative z-10 bg-gray-900 bg-opacity-90 p-8 rounded-lg shadow-lg w-96 sm:w-96 md:w-96 lg:mr-10 lg:w-[500px] xl:w-[400px] mx-4 md:mx-auto transform transition-transform duration-700 ${slideIn ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">
                    User Login
                </h1>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <WritingAnimation lines={lines} />

                <form className="space-y-7" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="registerNo" className="block text-sm font-medium text-gray-300">
                            Register No
                        </label>
                        <input
                            type="text"
                            name="registerNo"
                            id="registerNo"
                            value={formData.registerNo}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 bg-transparent border-b border-gray-600 text-white focus:border-indigo-500 focus:ring-0 focus:outline-none"
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                            Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 bg-transparent border-b border-gray-600 text-white focus:border-indigo-500 focus:ring-0 focus:outline-none pr-10"
                        />
                        <div
                            className="absolute inset-y-0 right-3 top-6 flex items-center cursor-pointer"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5 text-gray-500" />
                            ) : (
                                <Eye className="w-5 h-5 text-gray-500" />
                            )}
                        </div>
                    </div>

                    <button className="shadow-[inset_0_0_0_2px_#616467] text-white px-12 py-3  rounded-lg tracking-widest uppercase font-bold bg-transparent lg:ml-24 hover:bg-indigo-500 hover:text-white dark:text-neutral-200 transition duration-200">
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-300">
                    If you are a new user?
                    <span
                        onClick={() => navigate('/userregister')}
                        className="text-indigo-400 cursor-pointer hover:underline"
                    >
                        Register here.
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;

