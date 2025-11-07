import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Paper,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Chip,
  useTheme,
  useMediaQuery,
  Tab,
  Tabs,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Container,
  alpha,
  Tooltip,
  Fade,
  LinearProgress,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  Save as SaveIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  Backup as BackupIcon,
  Storage as StorageIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Cached as CachedIcon,
  Delete as DeleteIcon,
  Shield as ShieldIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';

const Settings = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    licenseExpiryAlerts: true,
    systemUpdates: true,
    clientRegistrationAlerts: true,
    weeklyReports: false,

    // Security
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: 'medium',
    loginAlerts: true,
    ipWhitelist: false,

    // General
    language: 'pt',
    timezone: 'Africa/Luanda',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    itemsPerPage: 25,
    autoLogout: true,

    // Appearance
    theme: 'light',
    compactMode: false,
    sidebarCollapsed: false,
    animations: true,
    highContrast: false
  });

  const [systemInfo, setSystemInfo] = useState({
    version: '2.1.0',
    lastBackup: '2024-01-15 14:30',
    databaseSize: '245 MB',
    activeUsers: 12,
    serverStatus: 'online',
    uptime: '15 dias, 2 horas',
    systemLoad: 24
  });

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        // Simular carregamento de configurações da API
        await new Promise(resolve => setTimeout(resolve, 1200));
        setSystemInfo(prev => ({
          ...prev,
          lastBackup: new Date().toLocaleString('pt-BR'),
          systemLoad: Math.floor(Math.random() * 30) + 10
        }));
      } catch (error) {
        showSnackbar('Erro ao carregar configurações', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      showSnackbar('Configurações salvas com sucesso!', 'success');
      
      // Atualizar informações do sistema
      setSystemInfo(prev => ({
        ...prev,
        lastBackup: new Date().toLocaleString('pt-BR')
      }));
    } catch (error) {
      showSnackbar('Erro ao salvar configurações', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleRunBackup = async () => {
    try {
      // Simular backup
      await new Promise(resolve => setTimeout(resolve, 1500));
      showSnackbar('Backup realizado com sucesso!', 'success');
      setSystemInfo(prev => ({
        ...prev,
        lastBackup: new Date().toLocaleString('pt-BR')
      }));
    } catch (error) {
      showSnackbar('Erro ao realizar backup', 'error');
    }
  };

  const handleClearCache = async () => {
    try {
      // Simular limpeza de cache
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSnackbar('Cache limpo com sucesso!', 'success');
    } catch (error) {
      showSnackbar('Erro ao limpar cache', 'error');
    }
  };

  const handleSystemDiagnostic = async () => {
    try {
      // Simular diagnóstico
      await new Promise(resolve => setTimeout(resolve, 1800));
      showSnackbar('Diagnóstico do sistema concluído', 'info');
    } catch (error) {
      showSnackbar('Erro no diagnóstico do sistema', 'error');
    }
  };

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  const SettingSection = ({ title, icon, description, children }) => (
    <Card
      sx={{ 
        mb: 3,
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              flexShrink: 0
            }}
          >
            {icon}
          </Box>
          <Box flex={1}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {title}
            </Typography>
            {description && (
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            )}
          </Box>
        </Box>
        <Divider sx={{ mb: 3 }} />
        {children}
      </CardContent>
    </Card>
  );

  const SystemMetricCard = ({ title, value, subtitle, color, icon, progress }) => (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(color, 0.05)} 100%)`,
        border: `1px solid ${alpha(color, 0.1)}`,
        height: '100%'
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h4" component="div" fontWeight="bold" color={color}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              backgroundColor: alpha(color, 0.1),
              color: color
            }}
          >
            {icon}
          </Box>
        </Box>
        {progress !== undefined && (
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 6, 
              borderRadius: 3,
              backgroundColor: alpha(color, 0.2),
              '& .MuiLinearProgress-bar': {
                backgroundColor: color
              }
            }} 
          />
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 } }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Box textAlign="center">
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Carregando configurações...
            </Typography>
          </Box>
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
            Configurações do Sistema
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              fontSize: { xs: '0.9rem', sm: '1.1rem' },
              fontWeight: 400
            }}
          >
            Gerencie as configurações e preferências do sistema
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
          onClick={handleSaveSettings}
          disabled={saving}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              transform: 'translateY(-2px)',
              boxShadow: 4
            },
            transition: 'all 0.3s ease-in-out',
            fontWeight: 600,
            px: 4,
            py: 1.5
          }}
        >
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Tabs Navigation */}
        <Grid item xs={12} lg={9}>
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
                  px: { xs: 1, sm: 3 }, 
                  pt: 2,
                  '& .MuiTab-root': {
                    fontWeight: 600,
                    minHeight: 60
                  }
                }}
              >
                <Tab icon={<NotificationsIcon />} label="Notificações" />
                <Tab icon={<SecurityIcon />} label="Segurança" />
                <Tab icon={<LanguageIcon />} label="Geral" />
                <Tab icon={<PaletteIcon />} label="Aparência" />
              </Tabs>

              <Divider />

              {/* Notifications Tab */}
              <TabPanel value={activeTab} index={0}>
                <Box px={{ xs: 1, sm: 3 }}>
                  <SettingSection
                    title="Configurações de Notificação"
                    icon={<NotificationsIcon />}
                    description="Gerencie como e quando receber notificações do sistema"
                  >
                    <Grid container spacing={3}>
                      {[
                        { key: 'emailNotifications', label: 'Notificações por Email', description: 'Receba notificações importantes por email' },
                        { key: 'pushNotifications', label: 'Notificações Push', description: 'Notificações em tempo real no navegador' },
                        { key: 'licenseExpiryAlerts', label: 'Alertas de Expiração de Licença', description: 'Alertas para licenças próximas da expiração' },
                        { key: 'systemUpdates', label: 'Atualizações do Sistema', description: 'Notificações sobre atualizações e manutenção' },
                        { key: 'clientRegistrationAlerts', label: 'Novos Clientes', description: 'Notificações sobre novos clientes cadastrados' },
                        { key: 'weeklyReports', label: 'Relatórios Semanais', description: 'Receba relatórios semanais por email' }
                      ].map((item) => (
                        <Grid item xs={12} md={6} key={item.key}>
                          <Box sx={{ p: 2, borderRadius: 2, border: `1px solid ${alpha(theme.palette.divider, 0.5)}` }}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={settings[item.key]}
                                  onChange={(e) => handleSettingChange(item.key, e.target.checked)}
                                  color="primary"
                                />
                              }
                              label={
                                <Box>
                                  <Typography variant="subtitle2" fontWeight="600">
                                    {item.label}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {item.description}
                                  </Typography>
                                </Box>
                              }
                              sx={{ width: '100%', m: 0 }}
                            />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </SettingSection>
                </Box>
              </TabPanel>

              {/* Security Tab */}
              <TabPanel value={activeTab} index={1}>
                <Box px={{ xs: 1, sm: 3 }}>
                  <SettingSection
                    title="Configurações de Segurança"
                    icon={<SecurityIcon />}
                    description="Configure as opções de segurança e privacidade do sistema"
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.twoFactorAuth}
                              onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                              color="primary"
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="subtitle2" fontWeight="600">
                                Autenticação de Dois Fatores
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Maior segurança para sua conta
                              </Typography>
                            </Box>
                          }
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.loginAlerts}
                              onChange={(e) => handleSettingChange('loginAlerts', e.target.checked)}
                              color="primary"
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="subtitle2" fontWeight="600">
                                Alertas de Login
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Notificar logins suspeitos
                              </Typography>
                            </Box>
                          }
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Tempo de Sessão</InputLabel>
                          <Select
                            value={settings.sessionTimeout}
                            onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                            label="Tempo de Sessão"
                          >
                            <MenuItem value={15}>15 minutos</MenuItem>
                            <MenuItem value={30}>30 minutos</MenuItem>
                            <MenuItem value={60}>1 hora</MenuItem>
                            <MenuItem value={120}>2 horas</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Política de Senha</InputLabel>
                          <Select
                            value={settings.passwordPolicy}
                            onChange={(e) => handleSettingChange('passwordPolicy', e.target.value)}
                            label="Política de Senha"
                          >
                            <MenuItem value="low">Baixa (6 caracteres)</MenuItem>
                            <MenuItem value="medium">Média (8 caracteres + números)</MenuItem>
                            <MenuItem value="high">Alta (10 caracteres + números + símbolos)</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </SettingSection>
                </Box>
              </TabPanel>

              {/* General Tab */}
              <TabPanel value={activeTab} index={2}>
                <Box px={{ xs: 1, sm: 3 }}>
                  <SettingSection
                    title="Configurações Gerais"
                    icon={<LanguageIcon />}
                    description="Personalize o comportamento geral do sistema"
                  >
                    <Grid container spacing={3}>
                      {[
                        { key: 'language', label: 'Idioma', options: [
                          { value: 'pt', label: 'Português' },
                          { value: 'en', label: 'English' },
                          { value: 'es', label: 'Español' }
                        ]},
                        { key: 'timezone', label: 'Fuso Horário', options: [
                          { value: 'Africa/Luanda', label: 'Luanda (WAT)' },
                          { value: 'Europe/Lisbon', label: 'Lisboa (WET)' },
                          { value: 'UTC', label: 'UTC' }
                        ]},
                        { key: 'dateFormat', label: 'Formato de Data', options: [
                          { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                          { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                          { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
                        ]},
                        { key: 'itemsPerPage', label: 'Itens por Página', options: [
                          { value: 10, label: '10 itens' },
                          { value: 25, label: '25 itens' },
                          { value: 50, label: '50 itens' },
                          { value: 100, label: '100 itens' }
                        ]}
                      ].map((item) => (
                        <Grid item xs={12} md={6} key={item.key}>
                          <FormControl fullWidth>
                            <InputLabel>{item.label}</InputLabel>
                            <Select
                              value={settings[item.key]}
                              onChange={(e) => handleSettingChange(item.key, e.target.value)}
                              label={item.label}
                            >
                              {item.options.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      ))}
                    </Grid>
                  </SettingSection>
                </Box>
              </TabPanel>

              {/* Appearance Tab */}
              <TabPanel value={activeTab} index={3}>
                <Box px={{ xs: 1, sm: 3 }}>
                  <SettingSection
                    title="Configurações de Aparência"
                    icon={<PaletteIcon />}
                    description="Personalize a aparência e interface do sistema"
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Tema</InputLabel>
                          <Select
                            value={settings.theme}
                            onChange={(e) => handleSettingChange('theme', e.target.value)}
                            label="Tema"
                          >
                            <MenuItem value="light">Claro</MenuItem>
                            <MenuItem value="dark">Escuro</MenuItem>
                            <MenuItem value="auto">Automático</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      {[
                        { key: 'compactMode', label: 'Modo Compacto', description: 'Interface mais compacta para maior produtividade' },
                        { key: 'sidebarCollapsed', label: 'Sidebar Recolhida', description: 'Sidebar recolhida por padrão' },
                        { key: 'animations', label: 'Animações', description: 'Habilitar animações na interface' },
                        { key: 'highContrast', label: 'Alto Contraste', description: 'Modo de alto contraste para melhor acessibilidade' }
                      ].map((item) => (
                        <Grid item xs={12} md={6} key={item.key}>
                          <Box sx={{ p: 2, borderRadius: 2, border: `1px solid ${alpha(theme.palette.divider, 0.5)}` }}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={settings[item.key]}
                                  onChange={(e) => handleSettingChange(item.key, e.target.checked)}
                                  color="primary"
                                />
                              }
                              label={
                                <Box>
                                  <Typography variant="subtitle2" fontWeight="600">
                                    {item.label}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {item.description}
                                  </Typography>
                                </Box>
                              }
                              sx={{ width: '100%', m: 0 }}
                            />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </SettingSection>
                </Box>
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>

        {/* System Info Sidebar */}
        <Grid item xs={12} lg={3}>
          <Box display="flex" flexDirection="column" gap={3}>
            {/* System Metrics */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <SystemMetricCard
                  title="Uso de CPU"
                  value={`${systemInfo.systemLoad}%`}
                  color={systemInfo.systemLoad > 80 ? theme.palette.error.main : theme.palette.success.main}
                  icon={<CachedIcon />}
                  progress={systemInfo.systemLoad}
                />
              </Grid>
              <Grid item xs={6}>
                <SystemMetricCard
                  title="Usuários Ativos"
                  value={systemInfo.activeUsers}
                  color={theme.palette.info.main}
                  icon={<ShieldIcon />}
                />
              </Grid>
            </Grid>

            {/* System Status */}
            <Card
              sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.info.main, 0.02)} 100%)`,
                border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold" display="flex" alignItems="center" gap={1}>
                  <StorageIcon color="info" />
                  Status do Sistema
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Versão" 
                      secondary={
                        <Chip 
                          label={systemInfo.version} 
                          size="small" 
                          variant="outlined"
                          color="success"
                        />
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <BackupIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Último Backup" 
                      secondary={systemInfo.lastBackup}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <StorageIcon color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Base de Dados" 
                      secondary={systemInfo.databaseSize}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <InfoIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Uptime" 
                      secondary={systemInfo.uptime}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card
              sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.warning.main, 0.02)} 100%)`,
                border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold" display="flex" alignItems="center" gap={1}>
                  <RefreshIcon color="warning" />
                  Ações Rápidas
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Tooltip title="Realizar backup do sistema">
                    <Button
                      variant="outlined"
                      startIcon={<BackupIcon />}
                      onClick={handleRunBackup}
                      fullWidth
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Fazer Backup
                    </Button>
                  </Tooltip>
                  <Tooltip title="Limpar cache do sistema">
                    <Button
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={handleClearCache}
                      fullWidth
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Limpar Cache
                    </Button>
                  </Tooltip>
                  <Tooltip title="Executar diagnóstico do sistema">
                    <Button
                      variant="outlined"
                      startIcon={<WarningIcon />}
                      onClick={handleSystemDiagnostic}
                      fullWidth
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Diagnóstico
                    </Button>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Box>
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
          sx={{ 
            width: '100%',
            fontWeight: 500,
            boxShadow: 4
          }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings;