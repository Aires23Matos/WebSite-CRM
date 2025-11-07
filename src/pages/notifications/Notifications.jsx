import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Paper,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  Badge,
  IconButton,
  Tooltip,
  Container,
  alpha,
  Fade,
  LinearProgress,
  Skeleton,
  CardActionArea
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Paid as PaidIcon,
  Engineering as EngineeringIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Notifications = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [licenses, setLicenses] = useState([]);
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [detailDialog, setDetailDialog] = useState(false);

  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const response = await axios.get('http://localhost:3000/api/v1/licenses/licenses');
      setLicenses(response.data.data.licenses || []);
      setError('');
    } catch (err) {
      console.error('Erro ao carregar licenças:', err);
      setError('Erro ao carregar lista de licenças');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const calculateDaysUntilExpiration = (expirationDate) => {
    const today = new Date();
    const expiration = new Date(expirationDate);
    const diffTime = expiration - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

const getExpirationStatus = (license) => {
  const daysUntilExpiration = calculateDaysUntilExpiration(license.data_da_expiracao);
  
  // Primeiro verifica se a licença não está ativa
  if (license.estado !== 'ativa') {
    let inactiveColor = 'default';
    let inactiveIcon = <ErrorIcon />;
    let inactiveLabel = 'Inativa';
    
    // Define cores e ícones específicos para cada estado inativo
    switch (license.estado) {
      case 'pendente':
        inactiveColor = 'warning';
        inactiveIcon = <WarningIcon />;
        inactiveLabel = 'Pendente';
        break;
      case 'cancelada':
        inactiveColor = 'error';
        inactiveIcon = <ErrorIcon />;
        inactiveLabel = 'Cancelada';
        break;
      case 'suspensa':
        inactiveColor = 'secondary';
        inactiveIcon = <InfoIcon />;
        inactiveLabel = 'Suspensa';
        break;
      default:
        inactiveColor = 'default';
        inactiveIcon = <ErrorIcon />;
        inactiveLabel = 'Inativa';
    }
    
    return { 
      status: 'inactive', 
      label: inactiveLabel, 
      color: inactiveColor, 
      icon: inactiveIcon,
      days: daysUntilExpiration 
    };
  }
  
  // Para licenças ativas, calcula o status baseado na data de expiração
  if (daysUntilExpiration < 0) {
    return { 
      status: 'expired', 
      label: 'Expirada', 
      color: 'error', 
      icon: <ErrorIcon />,
      days: daysUntilExpiration 
    };
  } else if (daysUntilExpiration <= 7) {
    return { 
      status: 'critical', 
      label: 'Crítica', 
      color: 'error', 
      icon: <WarningIcon />,
      days: daysUntilExpiration 
    };
  } else if (daysUntilExpiration <= 30) {
    return { 
      status: 'warning', 
      label: 'Atenção', 
      color: 'warning', 
      icon: <WarningIcon />,
      days: daysUntilExpiration 
    };
  } else {
    return { 
      status: 'ok', 
      label: 'Normal', 
      color: 'success', 
      icon: <CheckCircleIcon />,
      days: daysUntilExpiration 
    };
  }
};

  const getExpiringLicenses = () => {
    return licenses.filter(license => {
      const status = getExpirationStatus(license);
      return status.status === 'critical' || status.status === 'warning';
    });
  };

  const getExpiredLicenses = () => {
    return licenses.filter(license => getExpirationStatus(license).status === 'expired');
  };

  const getActiveLicenses = () => {
    return licenses.filter(license => getExpirationStatus(license).status === 'ok');
  };

  const getInactiveLicenses = () => {
    return licenses.filter(license => 
      license.estado === 'pendente' || 
      license.estado === 'cancelada' || 
      license.estado === 'suspensa'
    );
  };

  const getNotificationCount = () => {
    return getExpiringLicenses().length + getExpiredLicenses().length;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleViewLicense = (license) => {
    setSelectedLicense(license);
    setDetailDialog(true);
  };

  const StatCard = ({ title, value, subtitle, icon, color, onClick }) => (
    <Card 
      sx={{ 
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease-in-out',
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette[color].main, 0.05)} 100%)`,
        border: `1px solid ${alpha(theme.palette[color].main, 0.1)}`,
        '&:hover': {
          transform: onClick ? 'translateY(-4px)' : 'none',
          boxShadow: onClick ? 4 : 1
        }
      }}
      onClick={onClick}
    >
      <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.palette[color].main}, ${theme.palette[color].dark})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            margin: '0 auto 12px auto',
            boxShadow: `0 4px 12px ${alpha(theme.palette[color].main, 0.3)}`
          }}
        >
          {icon}
        </Box>
        <Typography 
          variant="h3" 
          component="div" 
          fontWeight="bold"
          sx={{
            background: `linear-gradient(135deg, ${theme.palette[color].main}, ${theme.palette[color].dark})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 1
          }}
        >
          {value}
        </Typography>
        <Typography variant="h6" component="div" fontWeight="600" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );

  const LicenseCard = ({ license }) => {
    const status = getExpirationStatus(license);
    const isUrgent = status.status === 'critical' || status.status === 'expired';

    return (
      <Card 
        sx={{ 
          mb: 2,
          borderLeft: `4px solid ${theme.palette[status.color].main}`,
          transition: 'all 0.3s ease-in-out',
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette[status.color].main, 0.03)} 100%)`,
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4
          }
        }}
      >
        <CardActionArea onClick={() => handleViewLicense(license)}>
          <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box flex={1}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}
                  >
                    <PersonIcon fontSize="small" />
                  </Box>
                  <Box flex={1}>
                    <Typography variant="h6" component="h3" fontWeight="bold" noWrap>
                      {license.cliente.clientName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      NIF: {license.cliente.nif}
                    </Typography>
                  </Box>
                  <Chip
                    icon={status.icon}
                    label={status.label}
                    color={status.color}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <CalendarIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        <strong>Expira em:</strong> {formatDate(license.data_da_expiracao)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <AccessTimeIcon color="action" fontSize="small" />
                      <Typography 
                        variant="body2" 
                        color={status.color}
                        fontWeight="bold"
                      >
                        {status.days > 0 ? `${status.days} dias restantes` : 'Expirada'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Licença:</strong> {license.numeroLicenca}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Técnico:</strong> {license.tecnico}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  };

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`notifications-tabpanel-${index}`}
      aria-labelledby={`notifications-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  // Loading skeleton
  const LoadingSkeleton = () => (
    <Box>
      {/* Stats Skeleton */}
      <Grid container spacing={3} mb={4}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item}>
            <Skeleton variant="rounded" height={140} />
          </Grid>
        ))}
      </Grid>
      
      {/* Content Skeleton */}
      <Skeleton variant="rounded" height={400} />
    </Box>
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 } }}>
        <LoadingSkeleton />
      </Container>
    );
  }

  const expiringLicenses = getExpiringLicenses();
  const expiredLicenses = getExpiredLicenses();
  const activeLicenses = getActiveLicenses();
  const inactiveLicenses = getInactiveLicenses();
  const notificationCount = getNotificationCount();

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
        <Box display="flex" alignItems="center" gap={2}>
          <Badge badgeContent={notificationCount} color="error" overlap="circular">
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.error.main})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: `0 4px 12px ${alpha(theme.palette.warning.main, 0.3)}`
              }}
            >
              {notificationCount > 0 ? (
                <NotificationsActiveIcon sx={{ fontSize: 32 }} />
              ) : (
                <NotificationsIcon sx={{ fontSize: 32 }} />
              )}
            </Box>
          </Badge>
          <Box>
            <Typography 
              variant="h3" 
              component="h1" 
              fontWeight="bold"
              sx={{ 
                fontSize: { xs: '1.75rem', sm: '2.25rem', lg: '2.75rem' },
                background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.error.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Alertas de Licenças
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.9rem', sm: '1.1rem' },
                fontWeight: 400
              }}
            >
              Monitorize o estado das licenças dos clientes
            </Typography>
          </Box>
        </Box>
        
        <Tooltip title="Atualizar lista">
          <IconButton
            onClick={() => fetchLicenses(true)}
            disabled={refreshing}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: 'white',
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                transform: 'rotate(180deg)'
              },
              transition: 'all 0.3s ease-in-out',
              width: 48,
              height: 48
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {refreshing && (
        <LinearProgress 
          sx={{ 
            mb: 3,
            height: 3,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            '& .MuiLinearProgress-bar': {
              background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`
            }
          }} 
        />
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="A Expirar"
            value={expiringLicenses.length}
            subtitle="Próximos 30 dias"
            icon={<WarningIcon />}
            color="warning"
            onClick={() => setActiveTab(1)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Expiradas"
            value={expiredLicenses.length}
            subtitle="Necessitam renovação"
            icon={<ErrorIcon />}
            color="error"
            onClick={() => setActiveTab(2)}
          />
        </Grid>
         <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pendentes"
            value={inactiveLicenses.length}
            subtitle="Em estado normal"
            icon={<CheckCircleIcon />}
            color="warning"
            onClick={() => setActiveTab(3)}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Ativas"
            value={activeLicenses.length}
            subtitle="Em estado normal"
            icon={<CheckCircleIcon />}
            color="success"
            onClick={() => setActiveTab(4)}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total"
            value={licenses.length}
            subtitle="Licenças no sistema"
            icon={<ScheduleIcon />}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Alerts */}
      {expiringLicenses.length > 0 && (
        <Fade in={expiringLicenses.length > 0}>
          <Alert 
            severity="warning" 
            sx={{ mb: 3 }}
            icon={<WarningIcon />}
            action={
              <Button color="inherit" size="small" onClick={() => setActiveTab(1)}>
                Ver Detalhes
              </Button>
            }
          >
            <strong>Alerta!</strong> Existem {expiringLicenses.length} licenças prestes a expirar nos próximos 30 dias.
          </Alert>
        </Fade>
      )}

      {expiredLicenses.length > 0 && (
        <Fade in={expiredLicenses.length > 0}>
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            icon={<ErrorIcon />}
            action={
              <Button color="inherit" size="small" onClick={() => setActiveTab(2)}>
                Ver Detalhes
              </Button>
            }
          >
            <strong>Urgente!</strong> Existem {expiredLicenses.length} licenças expiradas que necessitam de atenção imediata.
          </Alert>
        </Fade>
      )}

      {error && (
        <Fade in={!!error}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </Fade>
      )}

      {/* Tabs */}
      <Card
        sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons="auto"
            sx={{ 
              px: { xs: 2, sm: 3 }, 
              pt: 2,
              '& .MuiTab-root': {
                fontWeight: 600,
                minHeight: 60
              }
            }}
          >
            <Tab 
              icon={<InfoIcon />} 
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  Visão Geral
                  {notificationCount > 0 && (
                    <Chip label={notificationCount} color="error" size="small" />
                  )}
                </Box>
              } 
            />
            <Tab 
              icon={<WarningIcon />} 
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  A Expirar
                  {expiringLicenses.length > 0 && (
                    <Chip label={expiringLicenses.length} color="warning" size="small" />
                  )}
                </Box>
              } 
            />
            <Tab 
              icon={<ErrorIcon />} 
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  Expiradas
                  {expiredLicenses.length > 0 && (
                    <Chip label={expiredLicenses.length} color="error" size="small" />
                  )}
                </Box>
              } 
            />
            <Tab 
              icon={<ErrorIcon />} 
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  Pendentes
                  {inactiveLicenses.length > 0 && (
                    <Chip label={inactiveLicenses.length} color="warning" size="small" />
                  )}
                </Box>
              } 
            />
            <Tab 
              icon={<CheckCircleIcon />} 
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  Ativas
                  {activeLicenses.length > 0 && (
                    <Chip label={activeLicenses.length} color="success" size="small" />
                  )}
                </Box>
              } 
            />
            
          </Tabs>

          <Divider />

          {/* Overview Tab */}
          <TabPanel value={activeTab} index={0}>
            <Box px={{ xs: 2, sm: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Resumo das Notificações
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Visão geral do estado atual das licenças do sistema.
              </Typography>

              {notificationCount === 0 ? (
                <Alert severity="success" sx={{ mb: 3 }}>
                  <strong>Excelente!</strong> Todas as licenças estão em dia e não há alertas pendentes.
                </Alert>
              ) : (
                <Grid container spacing={3}>
                  {/* Expiring Soon */}
                  {expiringLicenses.length > 0 && (
                    <Grid item xs={12} md={6}>
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: 2,
                          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
                          border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <WarningIcon color="warning" />
                          <Typography variant="h6" fontWeight="bold">
                            Licenças a Expirar
                          </Typography>
                        </Box>
                        <List dense>
                          {expiringLicenses.slice(0, 3).map((license) => (
                            <ListItem key={license._id}>
                              <ListItemText
                                primary={license.cliente.clientName}
                                secondary={`Expira em ${formatDate(license.data_da_expiracao)}`}
                              />
                              <Chip
                                label={`${calculateDaysUntilExpiration(license.data_da_expiracao)} dias`}
                                color="warning"
                                size="small"
                              />
                            </ListItem>
                          ))}
                        </List>
                        {expiringLicenses.length > 3 && (
                          <Button 
                            size="small" 
                            onClick={() => setActiveTab(1)}
                            sx={{ mt: 1 }}
                          >
                            Ver todas ({expiringLicenses.length})
                          </Button>
                        )}
                      </Paper>
                    </Grid>
                  )}

                  {/* Expired */}
                  {expiredLicenses.length > 0 && (
                    <Grid item xs={12} md={6}>
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: 2,
                          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
                          border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <ErrorIcon color="error" />
                          <Typography variant="h6" fontWeight="bold">
                            Licenças Expiradas
                          </Typography>
                        </Box>
                        <List dense>
                          {expiredLicenses.slice(0, 3).map((license) => (
                            <ListItem key={license._id}>
                              <ListItemText
                                primary={license.cliente.clientName}
                                secondary={`Expirou em ${formatDate(license.data_da_expiracao)}`}
                              />
                              <Chip
                                label="Expirada"
                                color="error"
                                size="small"
                              />
                            </ListItem>
                          ))}
                        </List>
                        {expiredLicenses.length > 3 && (
                          <Button 
                            size="small" 
                            onClick={() => setActiveTab(2)}
                            sx={{ mt: 1 }}
                          >
                            Ver todas ({expiredLicenses.length})
                          </Button>
                        )}
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              )}
            </Box>
          </TabPanel>

          {/* Expiring Tab */}
          <TabPanel value={activeTab} index={1}>
            <Box px={{ xs: 2, sm: 3 }}>
              <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={2} mb={3}>
                <Box>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Licenças a Expirar
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Licenças que expiram nos próximos 30 dias
                  </Typography>
                </Box>
                <Chip 
                  label={`${expiringLicenses.length} licenças`} 
                  color="warning" 
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </Box>

              {expiringLicenses.length === 0 ? (
                <Alert severity="success">
                  Não há licenças a expirar nos próximos 30 dias.
                </Alert>
              ) : (
                expiringLicenses.map(license => (
                  <LicenseCard key={license._id} license={license} />
                ))
              )}
            </Box>
          </TabPanel>

          {/* Expired Tab */}
          <TabPanel value={activeTab} index={2}>
            <Box px={{ xs: 2, sm: 3 }}>
              <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={2} mb={3}>
                <Box>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Licenças Expiradas
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Licenças que já expiraram e necessitam de renovação
                  </Typography>
                </Box>
                <Chip 
                  label={`${expiredLicenses.length} licenças`} 
                  color="error" 
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </Box>

              {expiredLicenses.length === 0 ? (
                <Alert severity="success">
                  Não há licenças expiradas.
                </Alert>
              ) : (
                expiredLicenses.map(license => (
                  <LicenseCard key={license._id} license={license} />
                ))
              )}
            </Box>
          </TabPanel>

          {/* Inactive Tab */}
          <TabPanel value={activeTab} index={3}>
            <Box px={{ xs: 2, sm: 3 }}>
              <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={2} mb={3}>
                <Box>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Licenças Inativas
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Licenças pendentes, canceladas ou suspensas
                  </Typography>
                </Box>
                <Chip 
                  label={`${inactiveLicenses.length} licenças`} 
                  color="error" 
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </Box>

              {inactiveLicenses.length === 0 ? (
                <Alert severity="info">
                  Não há licenças inativas.
                </Alert>
              ) : (
                inactiveLicenses.map(license => (
                  <LicenseCard key={license._id} license={license} />
                ))
              )}
            </Box>
          </TabPanel>

          {/* Active Tab */}
          <TabPanel value={activeTab} index={4}>
            <Box px={{ xs: 2, sm: 3 }}>
              <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={2} mb={3}>
                <Box>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Licenças Ativas
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Licenças em estado normal (mais de 30 dias até expiração)
                  </Typography>
                </Box>
                <Chip 
                  label={`${activeLicenses.length} licenças`} 
                  color="success" 
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </Box>

              {activeLicenses.length === 0 ? (
                <Alert severity="info">
                  Não há licenças ativas no momento.
                </Alert>
              ) : (
                activeLicenses.map(license => (
                  <LicenseCard key={license._id} license={license} />
                ))
              )}
            </Box>
          </TabPanel>
        </CardContent>
      </Card>

      {/* License Detail Dialog */}
      <Dialog
        open={detailDialog}
        onClose={() => setDetailDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          <Box display="flex" alignItems="center" gap={1}>
            <InfoIcon color="primary" />
            Detalhes da Licença
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedLicense && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Cliente
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedLicense.cliente.clientName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  NIF
                </Typography>
                <Typography variant="body1">
                  {selectedLicense.cliente.nif}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Número da Licença
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedLicense.numeroLicenca}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Técnico
                </Typography>
                <Typography variant="body1">
                  {selectedLicense.tecnico}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Data de Instalação
                </Typography>
                <Typography variant="body1">
                  {formatDate(selectedLicense.data_da_instalacao)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Data de Expiração
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatDate(selectedLicense.data_da_expiracao)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Estado
                </Typography>
                <Chip
                  label={getExpirationStatus(selectedLicense).label}
                  color={getExpirationStatus(selectedLicense).color}
                  icon={getExpirationStatus(selectedLicense).icon}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Dias Restantes
                </Typography>
                <Typography 
                  variant="body1" 
                  fontWeight="bold"
                  color={getExpirationStatus(selectedLicense).color}
                >
                  {getExpirationStatus(selectedLicense).days > 0 
                    ? `${getExpirationStatus(selectedLicense).days} dias`
                    : 'Expirada'
                  }
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Valor Pago
                </Typography>
                <Typography variant="body1">
                  {formatCurrency(selectedLicense.valor_pago)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Validade
                </Typography>
                <Typography variant="body1">
                  {selectedLicense.validade_em_mes} meses
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setDetailDialog(false)}
            variant="outlined"
            sx={{ fontWeight: 600 }}
          >
            Fechar
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setDetailDialog(false);
              navigate(`/client/getById/${selectedLicense?.client_id}`);
            }}
            sx={{ 
              fontWeight: 600,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              }
            }}
          >
            Ver Cliente
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Notifications;