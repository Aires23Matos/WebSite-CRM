import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            // Obter o token do localStorage
            const token = localStorage.getItem('token');
            
            // Fazer requisição para o logout na API
            await axios.post('http://localhost:3000/api/v1/auth/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
        } catch (err) {
            console.error('Erro ao fazer logout na API:', err);
            // Mesmo se a API falhar, fazemos o logout localmente
        } finally {
            // Sempre limpa os dados locais
            localStorage.removeItem('token');
            setUser(null);
            setIsLoggingOut(false);
            setIsMenuOpen(false);
            navigate('/');
        }
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    const closeMenu = () => {
        setIsMenuOpen(false);
    }

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-xl' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg'
        }`}>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-16'>
                    {/* Logo */}
                    <Link 
                        to="/" 
                        className='flex items-center space-x-2 text-white hover:text-blue-100 transition-colors'
                        onClick={closeMenu}
                    >
                        <div className='bg-white/20 p-2 rounded-lg'>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <span className='text-xl font-bold hidden sm:block'>
                            ZenCRM
                        </span>
                        <span className='text-xl font-bold sm:hidden'>
                            SGC
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className='hidden md:flex items-center space-x-4'>
                        {user ? (
                            <div className='flex items-center space-x-4'>
                                <span className='text-white/90 text-sm bg-white/10 px-3 py-1 rounded-full'>
                                    Olá, {user.firstName || user.firstname || user.email}
                                </span>
                                <button 
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className={`bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                                        isLoggingOut 
                                            ? 'opacity-50 cursor-not-allowed' 
                                            : 'hover:bg-white/30'
                                    }`}
                                >
                                    {isLoggingOut ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>A Sair...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <span>Sair</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className='flex items-center space-x-3'>
                                <Link 
                                    to="/login"
                                    className='text-white/90 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200'
                                >
                                    Entrar
                                </Link>
                                <Link 
                                    to="/register"
                                    className='bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium transition-all duration-200 shadow-sm'
                                >
                                    Criar Conta
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        onClick={toggleMenu}
                        className='md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors'
                    >
                        {isMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className='md:hidden py-4 border-t border-white/20'>
                        {user ? (
                            <div className='flex flex-col space-y-3'>
                                <div className='text-white/80 text-center py-2 bg-white/10 rounded-lg'>
                                    Olá, {user.firstName || user.firstname || user.email}
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className={`flex items-center justify-center space-x-2 text-white bg-white/20 py-3 rounded-lg transition-all duration-200 ${
                                        isLoggingOut 
                                            ? 'opacity-50 cursor-not-allowed' 
                                            : 'hover:bg-white/30'
                                    }`}
                                >
                                    {isLoggingOut ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>A Sair...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <span>Sair da Conta</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className='flex flex-col space-y-3'>
                                <Link 
                                    to="/login"
                                    onClick={closeMenu}
                                    className='text-white text-center py-3 rounded-lg hover:bg-white/10 transition-all duration-200 border border-white/20'
                                >
                                    Entrar
                                </Link>
                                <Link 
                                    to="/register"
                                    onClick={closeMenu}
                                    className='bg-white text-blue-600 text-center py-3 rounded-lg font-medium hover:bg-blue-50 transition-all duration-200'
                                >
                                    Criar Conta
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;