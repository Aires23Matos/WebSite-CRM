import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import FlagIcon from "@mui/icons-material/Flag";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const menuItems = [
        {
            section: "MAIN",
            items: [
                { icon: DashboardIcon, label: "Dashboard", path: "/dashboard" }
            ]
        },
        {
            section: "Listas",
            items: [
                { icon: PeopleIcon, label: "Lista Usuários", path: "/users" },
                { icon: PersonIcon, label: "Lista Clientes", path: "/clients" }
            ]
        },
        {
            section: "Sistema",
            items: [
                { icon: NotificationsIcon, label: "Notificações", path: "/notifications" }
            ]
        },
        {
            section: "Registro",
            items: [
                { icon: PersonIcon, label: "Clientes", path: "/register-client" },
                { icon: BusinessIcon, label: "Endereço", path: "/address" },
                { icon: ContactPhoneIcon, label: "Contacto", path: "/contacts" },
                { icon: CardMembershipIcon, label: "Dados da Licença", path: "/license" },
                { icon: AssignmentIndIcon, label: "Responsável", path: "/responsible" }
            ]
        },
        {
            section: "Serviço",
            items: [
                { icon: SettingsIcon, label: "Settings", path: "/settings" }
            ]
        },
        {
            section: "Utilizador",
            items: [
                { icon: AccountCircleIcon, label: "Perfil", path: "/profile" },
                { icon: BusinessIcon, label: "Empresa", path: "/company" }
            ]
        }
    ];

    const handleNavigation = (path) => {
        navigate(path);
        setIsMobileOpen(false);
    };

    const isActiveRoute = (path) => {
        return location.pathname === path;
    };

    const toggleMobileMenu = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button 
                onClick={toggleMobileMenu}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
            >
                {isMobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

            {/* Overlay for Mobile */}
            {isMobileOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed lg:static inset-y-0 left-0 z-40
                w-64 bg-gradient-to-b from-blue-600 to-blue-700
                transform transition-transform duration-300 ease-in-out
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                shadow-xl lg:shadow-none
            `}>
                {/* Top Section */}
                <div className='h-16 flex items-center justify-center border-b border-blue-500'>
                    <span className='text-xl font-bold text-white'>ZenCRM</span>
                </div>

                {/* Center Section */}
                <div className='p-4 overflow-y-auto h-[calc(100vh-8rem)]'>
                    <ul className='space-y-1'>
                        {menuItems.map((section, sectionIndex) => (
                            <div key={sectionIndex}>
                                {/* Section Title */}
                                <li className='px-3 pt-6 pb-2'>
                                    <p className='text-xs font-bold text-blue-200 uppercase tracking-wide'>
                                        {section.section}
                                    </p>
                                </li>
                                
                                {/* Section Items */}
                                {section.items.map((item, itemIndex) => {
                                    const IconComponent = item.icon;
                                    const isActive = isActiveRoute(item.path);
                                    
                                    return (
                                        <li 
                                            key={itemIndex}
                                            onClick={() => handleNavigation(item.path)}
                                            className={`
                                                flex items-center p-3 rounded-lg cursor-pointer 
                                                transition-all duration-200 group
                                                ${isActive 
                                                    ? 'bg-white bg-opacity-20 text-white' 
                                                    : 'text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-white'
                                                }
                                            `}
                                        >
                                            <IconComponent className={`
                                                text-lg transition-colors duration-200
                                                ${isActive ? 'text-blue-700' : 'text-blue-200 group-hover:text-blue-700'}
                                            `} />
                                            <span className={`
                                                text-sm font-semibold ml-3 transition-colors duration-200
                                                ${isActive ? 'text-blue-700' : 'text-blue-100 group-hover:text-blue-700'}
                                            `}>
                                                {item.label}
                                            </span>
                                            
                                            {/* Active Indicator */}
                                            {isActive && (
                                                <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                                            )}
                                        </li>
                                    );
                                })}
                            </div>
                        ))}
                    </ul>
                </div>

                {/* Bottom Section */}
                <div className='absolute bottom-4 left-0 right-0 px-4'>
                    <div className='flex justify-center space-x-2'>
                        <div className='w-5 h-5 rounded border border-blue-400 bg-white cursor-pointer hover:scale-110 transition-transform shadow-sm'></div>
                        <div className='w-5 h-5 rounded border border-blue-400 bg-gray-800 cursor-pointer hover:scale-110 transition-transform shadow-sm'></div>
                        <div className='w-5 h-5 rounded border border-blue-400 bg-blue-900 cursor-pointer hover:scale-110 transition-transform shadow-sm'></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;