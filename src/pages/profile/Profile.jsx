import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Paper,
  Alert,
  Snackbar,
  Tab,
  Tabs,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  useTheme,
  useMediaQuery,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Save as SaveIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Security as SecurityIcon,
  History as HistoryIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Badge as BadgeIcon
} from '@mui/icons-material';

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editing, setEditing] = useState(false);

  const [user, setUser] = useState({
    firstName: 'Aires',
    lastName: 'Matos',
    email: 'aires.matos@empresa.com',
    phone: '+244 923 456 789',
    role: 'Administrador',
    department: 'TI',
    joinDate: '2024-01-15',
    lastLogin: '2024-01-20 14:30',
    avatar: ''
  });

  const [profile, setProfile] = useState({
    // Personal Info
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    
    // Security
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    
    // Preferences
    emailNotifications: true,
    pushNotifications: false,
    newsletter: true,
    language: 'pt',
    timezone: 'Africa/Luanda'
  });

  const [activityLog, setActivityLog] = useState([
    { id: 1, action: 'Login', description: 'Login realizado com sucesso', time: '2024-01-20 14:30', ip: '192.168.1.100' },
    { id: 2, action: 'Atualização', description: 'Perfil atualizado', time: '2024-01-19 10:15', ip: '192.168.1.100' },
    { id: 3, action: 'Cliente', description: 'Cliente criado: João Silva', time: '2024-01-18 16:45', ip: '192.168.1.100' },
    { id: 4, action: 'Login', description: 'Login realizado com sucesso', time: '2024-01-18 09:00', ip: '192.168.1.100' }
  ]);

  useEffect(() => {
    // Simular carregamento de dados do usuário
    const loadUserData = async () => {
      // Em produção, aqui viria uma chamada à API
      setTimeout(() => {
        setProfile(prev => ({
          ...prev,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone
        }));
      }, 500);
    };

    loadUserData();
  }, [user]);

  const handleProfileChange = (key, value) => {
    setProfile(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Atualizar dados do usuário
      setUser(prev => ({
        ...prev,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone
      }));

      setEditing(false);
      showSnackbar('Perfil atualizado com sucesso!', 'success');
    } catch (error) {
      showSnackbar('Erro ao atualizar perfil', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (profile.newPassword !== profile.confirmPassword) {
      showSnackbar('As senhas não coincidem', 'error');
      return;
    }

    if (profile.newPassword.length < 6) {
      showSnackbar('A senha deve ter pelo menos 6 caracteres', 'error');
      return;
    }

    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProfile(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      showSnackbar('Senha alterada com sucesso!', 'success');
    } catch (error) {
      showSnackbar('Erro ao alterar senha', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  const getInitials = () => {
    return `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}`.toUpperCase();
  };

  return (
    <Box className="p-4 lg:p-6">
      {/* Header */}
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={2} mb={4}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Meu Perfil
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Gerencie suas informações pessoais e preferências
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={editing ? <SaveIcon /> : <EditIcon />}
          onClick={editing ? handleSaveProfile : () => setEditing(true)}
          disabled={saving}
          size={isMobile ? "medium" : "large"}
        >
          {editing ? (saving ? 'Salvando...' : 'Salvar Alterações') : 'Editar Perfil'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Sidebar */}
        <Grid item xs={12} lg={4}>
          <Box display="flex" flexDirection="column" gap={3}>
            {/* Profile Card */}
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    mx: 'auto',
                    mb: 2,
                    backgroundColor: theme.palette.primary.main,
                    fontSize: '2rem',
                    fontWeight: 'bold'
                  }}
                >
                  {getInitials()}
                </Avatar>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {user.firstName} {user.lastName}
                </Typography>
                <Chip
                  label={user.role}
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </CardContent>
            </Card>

            {/* User Info */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Informações da Conta
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <BadgeIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Departamento" 
                      secondary={user.department}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Data de Adesão" 
                      secondary={new Date(user.joinDate).toLocaleDateString('pt-BR')}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <HistoryIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Último Login" 
                      secondary={new Date(user.lastLogin).toLocaleString('pt-BR')}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Estatísticas
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Box display="flex" justifyContent="between">
                    <Typography variant="body2" color="text.secondary">
                      Clientes Criados
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      24
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="between">
                    <Typography variant="body2" color="text.secondary">
                      Atividade Este Mês
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      156
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="between">
                    <Typography variant="body2" color="text.secondary">
                      Tempo Online
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      48h
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent sx={{ p: 0 }}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons="auto"
                sx={{ px: 3, pt: 2 }}
              >
                <Tab icon={<PersonIcon />} label="Informações Pessoais" />
                <Tab icon={<SecurityIcon />} label="Segurança" />
                <Tab icon={<NotificationsIcon />} label="Notificações" />
                <Tab icon={<HistoryIcon />} label="Atividade" />
              </Tabs>

              <Divider />

              {/* Personal Info Tab */}
              <TabPanel value={activeTab} index={0}>
                <Box px={3}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Informações Pessoais
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Atualize suas informações pessoais e de contacto.
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Primeiro Nome"
                        value={profile.firstName}
                        onChange={(e) => handleProfileChange('firstName', e.target.value)}
                        disabled={!editing}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Sobrenome"
                        value={profile.lastName}
                        onChange={(e) => handleProfileChange('lastName', e.target.value)}
                        disabled={!editing}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        disabled={!editing}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Telefone"
                        value={profile.phone}
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                        disabled={!editing}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>

                  {editing && (
                    <Box display="flex" gap={2} mt={3}>
                      <Button
                        variant="outlined"
                        onClick={() => setEditing(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleSaveProfile}
                        disabled={saving}
                      >
                        {saving ? 'Salvando...' : 'Salvar Alterações'}
                      </Button>
                    </Box>
                  )}
                </Box>
              </TabPanel>

              {/* Security Tab */}
              <TabPanel value={activeTab} index={1}>
                <Box px={3}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Segurança da Conta
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Altere sua senha e configure opções de segurança.
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Senha Atual"
                        type={showPassword ? 'text' : 'password'}
                        value={profile.currentPassword}
                        onChange={(e) => handleProfileChange('currentPassword', e.target.value)}
                        variant="outlined"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Nova Senha"
                        type={showPassword ? 'text' : 'password'}
                        value={profile.newPassword}
                        onChange={(e) => handleProfileChange('newPassword', e.target.value)}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Confirmar Nova Senha"
                        type={showPassword ? 'text' : 'password'}
                        value={profile.confirmPassword}
                        onChange={(e) => handleProfileChange('confirmPassword', e.target.value)}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>

                  <Box mt={3}>
                    <Button
                      variant="contained"
                      onClick={handleChangePassword}
                      disabled={saving || !profile.currentPassword || !profile.newPassword}
                    >
                      {saving ? 'Alterando...' : 'Alterar Senha'}
                    </Button>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Autenticação de Dois Fatores
                  </Typography>
                  <FormControlLabel
                    control={<Switch color="primary" />}
                    label="Ativar autenticação de dois fatores para maior segurança"
                  />
                </Box>
              </TabPanel>

              {/* Notifications Tab */}
              <TabPanel value={activeTab} index={2}>
                <Box px={3}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Preferências de Notificação
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Configure como deseja receber notificações do sistema.
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={profile.emailNotifications}
                            onChange={(e) => handleProfileChange('emailNotifications', e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Notificações por Email"
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                        Receba notificações importantes por email
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={profile.pushNotifications}
                            onChange={(e) => handleProfileChange('pushNotifications', e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Notificações Push"
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                        Notificações em tempo real no navegador
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={profile.newsletter}
                            onChange={(e) => handleProfileChange('newsletter', e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Newsletter"
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                        Receba novidades e atualizações do sistema
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box mt={3}>
                    <Button variant="contained">
                      Salvar Preferências
                    </Button>
                  </Box>
                </Box>
              </TabPanel>

              {/* Activity Tab */}
              <TabPanel value={activeTab} index={3}>
                <Box px={3}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Histórico de Atividade
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Registro das suas atividades recentes no sistema.
                  </Typography>

                  <List>
                    {activityLog.map((activity, index) => (
                      <React.Fragment key={activity.id}>
                        <ListItem alignItems="flex-start">
                          <ListItemIcon>
                            <HistoryIcon color="action" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box display="flex" justifyContent="between" alignItems="center">
                                <Typography variant="subtitle2" fontWeight="medium">
                                  {activity.action}
                                </Typography>
                                <Chip 
                                  label={activity.time} 
                                  size="small" 
                                  variant="outlined"
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.primary">
                                  {activity.description}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  IP: {activity.ip}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < activityLog.length - 1 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;