import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = ({ setUser }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (error) setError('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await axios.post("http://localhost:3000/api/v1/auth/login", formData);
            localStorage.setItem("token", res.data.accessToken); // Corrigido para accessToken
            setUser(res.data.user); // Corrigido para res.data.user
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Falha ao iniciar sessão');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 pt-20">
            <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-2xl p-8 sm:p-10 border border-gray-100">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Bem-vindo de volta
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Entre na sua conta para continuar
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-700 text-sm font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="appearance-none relative block w-full px-4 py-3 pl-11 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 transition-all duration-200"
                                    placeholder="seu@email.com"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Palavra-passe
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="appearance-none relative block w-full px-4 py-3 pl-11 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 transition-all duration-200"
                                    placeholder="Sua palavra-passe"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white transition-all duration-200 ${
                                isLoading 
                                    ? 'bg-blue-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl'
                            }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    A Entrar...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Entrar na Conta
                                </div>
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Não tem uma conta?{' '}
                            <Link 
                                to="/register" 
                                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                            >
                                Criar conta
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;