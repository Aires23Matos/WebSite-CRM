import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  alpha,
  Container,
  Skeleton,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  People as PeopleIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalClients: 0,
    totalUsers: 0,
    activeLicenses: 0,
    expiringLicenses: 0
  });
  
  const [recentClients, setRecentClients] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      // Fetch clients data
      const clientsResponse = await axios.get('http://localhost:3000/api/v1/client/clients');
      const clients = clientsResponse.data.data.clients || [];
      
      // Fetch users data
      const usersResponse = await axios.get('http://localhost:3000/api/v1/users/');
      const users = usersResponse.data.users || [];

      // Calculate statistics
      const totalClients = clients.length;
      const totalUsers = users.length;
      
      // Calculate license statistics
      let activeLicenses = 0;
      let expiringLicenses = 0;
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      clients.forEach(client => {
        client.licenseData?.forEach(license => {
          const expirationDate = new Date(license.data_da_expiracao);
          if (license.estado === 'ativa') {
            activeLicenses++;
            if (expirationDate <= thirtyDaysFromNow && expirationDate > now) {
              expiringLicenses++;
            }
          }
        });
      });

      // Get recent clients (last 5)
      const sortedClients = [...clients]
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        .slice(0, 5);

      // Mock recent activities
      const mockActivities = [
        { id: 1, type: 'client', action: 'created', name: 'Novo cliente cadastrado', time: '2 horas atrás' },
        { id: 2, type: 'license', action: 'updated', name: 'Licença atualizada', time: '5 horas atrás' },
        { id: 3, type: 'user', action: 'created', name: 'Novo usuário registrado', time: '1 dia atrás' },
        { id: 4, type: 'client', action: 'updated', name: 'Dados do cliente modificados', time: '2 dias atrás' }
      ];

      setStats({
        totalClients,
        totalUsers,
        activeLicenses,
        expiringLicenses
      });

      setRecentClients(sortedClients);
      setRecentActivities(mockActivities);
      setError('');

    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
      setError('Conta Usuário não permitido visualizar essas informações');
       showSnackbar('Erro ao carregar usuários', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  // Show snackbar notification
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };
  const StatCard = ({ title, value, subtitle, icon, color, progress, onClick }) => (
    <Card 
      sx={{ 
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease-in-out',
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(color, 0.05)} 100%)`,
        border: `1px solid ${alpha(color, 0.1)}`,
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: onClick ? 'translateY(-8px)' : 'none',
          boxShadow: onClick ? 6 : 2,
          border: onClick ? `1px solid ${alpha(color, 0.3)}` : `1px solid ${alpha(color, 0.1)}`
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.7)})`,
        }
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            <Typography 
              color="text.secondary" 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                fontWeight: 500
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h3" 
              component="div" 
              fontWeight="bold" 
              sx={{ 
                fontSize: { xs: '1.75rem', sm: '2.5rem', lg: '3rem' },
                background: `linear-gradient(135deg, ${color}, ${alpha(color, 0.7)})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 1
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.8rem' }}>
                {subtitle}
              </Typography>
            )}
            {progress !== undefined && (
              <Box sx={{ mt: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="caption" color="text.secondary">
                    Progresso
                  </Typography>
                  <Typography variant="caption" fontWeight="bold" color={color}>
                    {progress.toFixed(0)}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: alpha(color, 0.2),
                    '& .MuiLinearProgress-bar': {
                      background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.7)})`,
                      borderRadius: 4,
                    }
                  }} 
                />
              </Box>
            )}
          </Box>
          <Box
            sx={{
              p: { xs: 1, sm: 1.5 },
              borderRadius: 3,
              background: `linear-gradient(135deg, ${color}, ${alpha(color, 0.8)})`,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 12px ${alpha(color, 0.3)}`,
              ml: 2
            }}
          >
            {React.cloneElement(icon, { 
              fontSize: isMobile ? "medium" : "large",
              sx: { fontSize: { xs: '1.25rem', sm: '1.5rem' } }
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const QuickAction = ({ icon, label, description, color, onClick }) => (
    <Paper
      sx={{
        p: { xs: 1.5, sm: 2 },
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(color, 0.05)} 100%)`,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${alpha(color, 0.15)}`,
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(color, 0.1)} 100%)`,
          border: `1px solid ${alpha(color, 0.3)}`
        }
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          width: { xs: 45, sm: 60 },
          height: { xs: 45, sm: 60 },
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${color}, ${alpha(color, 0.8)})`,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px auto',
          boxShadow: `0 4px 12px ${alpha(color, 0.3)}`
        }}
      >
        {React.cloneElement(icon, { 
          fontSize: isMobile ? "small" : "medium",
          sx: { fontSize: { xs: '1.25rem', sm: '1.5rem' } }
        })}
      </Box>
      <Typography 
        variant="h6" 
        component="div" 
        gutterBottom 
        fontWeight="600"
        sx={{ 
          fontSize: { xs: '0.8rem', sm: '0.9rem' },
          lineHeight: 1.2
        }}
      >
        {label}
      </Typography>
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ 
          fontSize: { xs: '0.7rem', sm: '0.75rem' },
          lineHeight: 1.3
        }}
      >
        {description}
      </Typography>
    </Paper>
  );

  const LoadingSkeleton = () => (
    <Box>
      {/* Header Skeleton */}
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={2} mb={4}>
        <Box flex={1}>
          <Skeleton variant="text" width="60%" height={48} />
          <Skeleton variant="text" width="40%" height={32} />
        </Box>
        <Skeleton variant="rounded" width={120} height={40} />
      </Box>

      {/* Stats Grid Skeleton */}
      <Grid container spacing={3} mb={4}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} lg={3} key={item}>
            <Skeleton variant="rounded" height={140} />
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions Skeleton */}
      <Box mb={4}>
        <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {[1, 2, 3, 4, 5].map((item) => (
            <Grid item xs={6} sm={4} md={2.4} key={item}>
              <Skeleton variant="rounded" height={120} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Content Skeleton */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Skeleton variant="rounded" height={300} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Skeleton variant="rounded" height={300} />
        </Grid>
      </Grid>
    </Box>
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 } }}>
        <LoadingSkeleton />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 } }}>
        <Box 
          textAlign="center" 
          py={8}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
            borderRadius: 4,
            border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`
          }}
        >
          <WarningIcon 
            sx={{ 
              fontSize: 64, 
              color: 'error.main',
              mb: 2
            }} 
          />
          <Typography color="error" variant="h5" gutterBottom fontWeight="bold">
            {error}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Não foi possível carregar os dados do dashboard
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => fetchDashboardData()}
            startIcon={<RefreshIcon />}
            sx={{ 
              mt: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
            }}
          >
            Tentar Novamente
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box 
        display="flex" 
        flexDirection={{ xs: 'column', sm: 'row' }} 
        justifyContent="space-between" 
        alignItems={{ xs: 'flex-start', sm: 'center' }} 
        gap={2} 
        mb={4}
      >
        <Box>
          <Typography 
            variant="h3" 
            component="h1" 
            fontWeight="bold" 
            gutterBottom 
            sx={{ 
              fontSize: { xs: '1.75rem', sm: '2.25rem', lg: '2.75rem' },
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}
          >
            Bem-vindo ao Sistema
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              fontSize: { xs: '0.9rem', sm: '1.1rem' },
              fontWeight: 400
            }}
          >
            Visão geral da sua gestão de clientes e licenças
          </Typography>
        </Box>
        <Tooltip title="Atualizar dados">
          <IconButton
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: 'white',
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                transform: 'rotate(180deg)'
              },
              transition: 'all 0.3s ease-in-out'
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Statistics Grid */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total de Clientes"
            value={stats.totalClients}
            subtitle="Clientes cadastrados"
            icon={<PeopleIcon />}
            color={theme.palette.primary.main}
            onClick={() => navigate('/clients')}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total de Usuários"
            value={stats.totalUsers}
            subtitle="Usuários do sistema"
            icon={<PersonIcon />}
            color={theme.palette.secondary.main}
            onClick={() => navigate('/users')}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            onClick={() => navigate('/license')}
            title="Licenças Ativas"
            value={stats.activeLicenses}
            subtitle="Licenças em vigor"
            icon={<CheckCircleIcon />}
            color={theme.palette.success.main}
            progress={(stats.activeLicenses / Math.max(stats.totalClients, 1)) * 100}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Licenças a Expirar"
            onClick={() => navigate('/notifications')}
            value={stats.expiringLicenses}
            subtitle="Próximos 30 dias"
            icon={<WarningIcon />}
            color={theme.palette.warning.main}
            progress={(stats.expiringLicenses / Math.max(stats.activeLicenses, 1)) * 100}
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box mb={4}>
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom 
          fontWeight="bold"
          sx={{ 
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            mb: 3
          }}
        >
          Ações Rápidas
        </Typography>
        <Grid container spacing={2}>
          {[
            { icon: <AddIcon />, label: "Novo Cliente", description: "Cadastrar novo cliente", color: theme.palette.primary.main, path: '/register-client' },
            { icon: <PersonIcon />, label: "Novo Usuário", description: "Adicionar usuário", color: theme.palette.secondary.main, path: '/users/new' },
            { icon: <LocationIcon />, label: "Endereços", description: "Gerir endereços", color: theme.palette.info.main, path: '/address' },
            { icon: <EmailIcon />, label: "Contactos", description: "Ver contactos", color: theme.palette.success.main, path: '/contacts' },
            { icon: <TrendingUpIcon />, label: "Relatórios", description: "Ver estatísticas", color: theme.palette.warning.main, path: '/reports' }
          ].map((action, index) => (
            <Grid item xs={6} sm={4} md={2.4} key={index}>
              <QuickAction
                icon={action.icon}
                label={action.label}
                description={action.description}
                color={action.color}
                onClick={() => navigate(action.path)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Recent Content */}
      <Grid container spacing={3}>
        {/* Recent Clients */}
        <Grid item xs={12} lg={6}>
          <Card 
            sx={{ 
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" component="h3" fontWeight="bold">
                  Clientes Recentes
                </Typography>
                <Button 
                  size="small" 
                  onClick={() => navigate('/clients')}
                  endIcon={<VisibilityIcon />}
                  sx={{ 
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}
                >
                  Ver Todos
                </Button>
              </Box>
              
              {recentClients.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <PeopleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography color="text.secondary">
                    Nenhum cliente cadastrado
                  </Typography>
                </Box>
              ) : (
                <List sx={{ py: 0 }}>
                  {recentClients.map((client, index) => (
                    <React.Fragment key={client._id}>
                      <ListItem 
                        sx={{ 
                          py: 1.5,
                          px: 1,
                          cursor: 'pointer',
                          borderRadius: 2,
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.04),
                            transform: 'translateX(4px)'
                          }
                        }}
                        onClick={() => navigate(`/clients/${client._id}`)}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white'
                            }}
                          >
                            <PeopleIcon sx={{ fontSize: 16 }} />
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" fontWeight="600">
                              {client.clientName}
                            </Typography>
                          }
                          secondary={
                            <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={{ xs: 0.5, sm: 2 }} alignItems={{ xs: 'flex-start', sm: 'center' }} mt={0.5}>
                              <Typography variant="caption" color="text.secondary">
                                NIF: {client.nif}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(client.publishedAt).toLocaleDateString('pt-BR')}
                              </Typography>
                            </Box>
                          }
                        />
                        <Chip 
                          label={`${client.contact?.length || 0} contatos`} 
                          size="small" 
                          variant="outlined"
                          sx={{ 
                            ml: 1,
                            fontWeight: 500
                          }}
                        />
                      </ListItem>
                      {index < recentClients.length - 1 && (
                        <Divider 
                          variant="inset" 
                          component="li" 
                          sx={{ 
                            mx: 1,
                            backgroundColor: alpha(theme.palette.divider, 0.3)
                          }} 
                        />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} lg={6}>
          <Card
            sx={{ 
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" component="h3" fontWeight="bold">
                  Atividades Recentes
                </Typography>
                <Button 
                  size="small" 
                  endIcon={<VisibilityIcon />}
                  sx={{ 
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}
                >
                  Ver Todas
                </Button>
              </Box>

              <List sx={{ py: 0 }}>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem 
                      sx={{ 
                        py: 1.5,
                        px: 1,
                        borderRadius: 2,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.secondary.main, 0.04),
                          transform: 'translateX(4px)'
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${
                              activity.type === 'client' ? theme.palette.primary.main :
                              activity.type === 'user' ? theme.palette.secondary.main :
                              theme.palette.success.main
                            }, ${
                              activity.type === 'client' ? theme.palette.primary.light :
                              activity.type === 'user' ? theme.palette.secondary.light :
                              theme.palette.success.light
                            })`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                          }}
                        >
                          {activity.type === 'client' && <PeopleIcon sx={{ fontSize: 16 }} />}
                          {activity.type === 'user' && <PersonIcon sx={{ fontSize: 16 }} />}
                          {activity.type === 'license' && <CheckCircleIcon sx={{ fontSize: 16 }} />}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" fontWeight="600">
                            {activity.name}
                          </Typography>
                        }
                        secondary={
                          <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                            <Chip 
                              label={activity.action} 
                              size="small" 
                              color={
                                activity.action === 'created' ? 'success' :
                                activity.action === 'updated' ? 'info' :
                                'default'
                              }
                              variant="filled"
                              sx={{ 
                                fontWeight: 500,
                                fontSize: '0.7rem'
                              }}
                            />
                            <Typography variant="caption" color="text.secondary" fontWeight="500">
                              {activity.time}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && (
                      <Divider 
                        variant="inset" 
                        component="li" 
                        sx={{ 
                          mx: 1,
                          backgroundColor: alpha(theme.palette.divider, 0.3)
                        }} 
                      />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* System Status */}
      <Grid container spacing={3} mt={1}>
        <Grid item xs={12}>
          <Card
            sx={{ 
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" component="h3" gutterBottom fontWeight="bold" mb={3}>
                Status do Sistema
              </Typography>
              <Grid container spacing={3}>
                {[
                  { icon: <CheckCircleIcon />, title: "Sistema Online", description: "Todos os serviços operacionais", color: "success" },
                  { icon: <ScheduleIcon />, title: "Última Atualização", description: new Date().toLocaleString('pt-BR'), color: "info" },
                  { icon: <TrendingUpIcon />, title: "Performance", description: "Sistema estável", color: "primary" },
                  { icon: <PhoneIcon />, title: "Suporte", description: "Disponibilidade 24/7", color: "secondary" }
                ].map((status, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 3,
                          background: `linear-gradient(135deg, ${theme.palette[status.color].main}, ${theme.palette[status.color].light})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          boxShadow: `0 4px 12px ${alpha(theme.palette[status.color].main, 0.3)}`
                        }}
                      >
                        {status.icon}
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight="600">
                          {status.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                          {status.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;