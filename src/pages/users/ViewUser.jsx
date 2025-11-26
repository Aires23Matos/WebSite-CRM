import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
  Grid,
  Paper,
  Avatar,
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  CalendarToday as CalendarIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { urlApi } from '../../../public/url/url';

//const url = 'http://localhost:3000'

const url = urlApi;
const ViewUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${url}/api/v1/users/${id}`);
        setUser(response.data.user);
        setError('');
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
        setError('Conta Usuário não permitido visualizar essas informações');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'user':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getRoleIcon = (role) => {
    return role === 'admin' ? <AdminIcon sx={{ fontSize: 16 }} /> : null;
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
        className="animate-pulse"
      >
        <Box textAlign="center">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            Carregando usuário...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box className="p-4 md:p-6">
        <Card className="shadow-lg border-0">
          <CardContent className="text-center p-8">
            <Box className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PersonIcon className="text-red-500 text-3xl" />
            </Box>
            <Typography variant="h5" color="error" gutterBottom fontWeight="bold">
              {error || 'Usuário não encontrado'}
            </Typography>
            <Typography variant="body1" color="text.secondary" className="mb-6">
              O usuário solicitado não pôde ser carregado.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/users')}
              startIcon={<ArrowBackIcon />}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
              size={isMobile ? "medium" : "large"}
            >
              Voltar para Lista
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <Box 
        display="flex" 
        flexDirection={isMobile ? "column" : "row"} 
        justifyContent="space-between" 
        alignItems={isMobile ? "stretch" : "center"} 
        gap={3}
        className="mb-6 md:mb-8"
      >
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/users')}
            className="border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600"
            size={isMobile ? "medium" : "large"}
          >
            {isSmallMobile ? 'Voltar' : 'Voltar para Lista'}
          </Button>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            component="h1" 
            fontWeight="bold"
            className="text-gray-800"
          >
            Detalhes do Usuário
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/users/edit/${user._id}`)}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
          size={isMobile ? "medium" : "large"}
          fullWidth={isMobile}
        >
          {isSmallMobile ? 'Editar' : 'Editar Usuário'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
            <CardContent className="text-center p-6 md:p-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
              <Avatar
                className="mx-auto mb-4 border-4 border-white border-opacity-20 shadow-2xl"
                sx={{
                  width: isMobile ? 80 : 100,
                  height: isMobile ? 80 : 100,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  fontSize: isMobile ? '1.5rem' : '2rem',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
              </Avatar>
              <Typography 
                variant={isMobile ? "h6" : "h5"} 
                fontWeight="bold" 
                gutterBottom
                className="text-white"
              >
                {user.firstName} {user.lastName}
              </Typography>
              <Chip
                icon={getRoleIcon(user.role)}
                label={user.role.toUpperCase()}
                color={getRoleColor(user.role)}
                className="bg-white bg-opacity-20 text-white border-0 font-semibold"
                size={isMobile ? "small" : "medium"}
              />
              <Typography 
                variant="body2" 
                className="text-blue-100 mt-2 opacity-90"
              >
                {user.username}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Details Card */}
        <Grid item xs={12} md={8}>
          <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <Typography 
                variant={isMobile ? "h6" : "h5"} 
                fontWeight="bold" 
                gutterBottom
                className="text-gray-800 flex items-center gap-2"
              >
                <PersonIcon className="text-blue-600" />
                Informações do Usuário
              </Typography>
              <Divider className="my-4" />

              <Grid container spacing={3}>
                {[
                  { icon: PersonIcon, label: 'Nome Completo', value: `${user.firstName} ${user.lastName}` },
                  { icon: EmailIcon, label: 'Email', value: user.email },
                  { icon: BadgeIcon, label: 'Username', value: user.username },
                  { icon: CalendarIcon, label: 'Data de Criação', value: formatDate(user.createdAt) },
                  { icon: CalendarIcon, label: 'Última Atualização', value: formatDate(user.updatedAt) },
                  { 
                    icon: AdminIcon, 
                    label: 'Tipo de Usuário', 
                    value: user.role === 'admin' ? 'Administrador' : 'Usuário',
                    color: user.role === 'admin' ? '#EF4444' : '#3B82F6'
                  }
                ].map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box 
                      display="flex" 
                      alignItems="center" 
                      gap={2} 
                      className="p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Box
                        className="flex items-center justify-center rounded-lg p-2"
                        sx={{ 
                          backgroundColor: item.color || '#3B82F6',
                          color: 'white'
                        }}
                      >
                        <item.icon sx={{ fontSize: isMobile ? 20 : 24 }} />
                      </Box>
                      <Box flex={1}>
                        <Typography 
                          variant="caption" 
                          className="text-gray-500 font-medium block"
                        >
                          {item.label}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          fontWeight="medium"
                          className="text-gray-800"
                          sx={{ 
                            fontSize: isMobile ? '0.9rem' : '1rem',
                            wordBreak: 'break-word'
                          }}
                        >
                          {item.value}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* ID Card */}
        <Grid item xs={12}>
          <Paper 
            variant="outlined" 
            className="p-4 md:p-6 rounded-2xl border-2 border-dashed border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100"
          >
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              fontWeight="bold" 
              gutterBottom
              className="text-gray-700 flex items-center gap-2"
            >
              <BadgeIcon className="text-blue-600" />
              Identificação do Sistema
            </Typography>
            <Typography 
              variant="body2" 
              className="text-gray-600 font-mono bg-white p-3 rounded-lg border border-gray-200 break-all"
              sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
            >
              {user._id}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewUser;