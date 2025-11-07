import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  Paper,
  Alert,
  Snackbar,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Tab,
  Tabs,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Container,
  alpha,
  Tooltip,
  Fade,
  CircularProgress,
  InputAdornment,
  Skeleton
} from '@mui/material';
import {
  Save as SaveIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  Language as LanguageIcon,
  Schedule as ScheduleIcon,
  Public as PublicIcon,
  AccountBalance as AccountBalanceIcon,
  ContactPhone as ContactPhoneIcon,
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  CorporateFare as CorporateFareIcon,
  Web as WebIcon,
  Flag as FlagIcon
} from '@mui/icons-material';

const Company = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, contact: null });

  const [company, setCompany] = useState({
    // Basic Info
    name: 'TechSolutions Angola Lda',
    tradeName: 'TechSolutions',
    nif: '54123456789',
    nuit: '123456789',
    industry: 'Tecnologia',
    foundedDate: '2020-01-15',
    
    // Contact
    email: 'geral@techsolutions.ao',
    phone: '+244 222 123 456',
    website: 'https://techsolutions.ao',
    
    // Address
    address: {
      street: 'Rua da Tecnologia, 123',
      city: 'Luanda',
      province: 'Luanda',
      postalCode: '1234-567',
      country: 'Angola'
    },
    
    // Social Media
    socialMedia: {
      facebook: 'techsolutions.ao',
      linkedin: 'company/techsolutions',
      twitter: 'techsolutions_ao'
    },
    
    // Business Info
    businessType: 'Sociedade por Quotas',
    legalForm: 'Lda',
    capital: 50000000,
    employees: 47,
    
    // Additional Contacts
    additionalContacts: [
      {
        id: 1,
        name: 'Maria Silva',
        position: 'Directora Comercial',
        email: 'maria.silva@techsolutions.ao',
        phone: '+244 923 123 456',
        department: 'Comercial',
        isPrimary: true
      },
      {
        id: 2,
        name: 'João Santos',
        position: 'Chefe de TI',
        email: 'joao.santos@techsolutions.ao',
        phone: '+244 923 654 321',
        department: 'Tecnologia',
        isPrimary: false
      },
      {
        id: 3,
        name: 'Ana Pereira',
        position: 'Responsável Financeiro',
        email: 'ana.pereira@techsolutions.ao',
        phone: '+244 923 789 123',
        department: 'Financeiro',
        isPrimary: false
      }
    ]
  });

  const [formData, setFormData] = useState({ ...company });
  const [newContact, setNewContact] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    department: '',
    isPrimary: false
  });

  useEffect(() => {
    // Simular carregamento de dados da empresa
    const loadCompanyData = async () => {
      setLoading(true);
      try {
        // Em produção, aqui viria uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setFormData({ ...company });
      } catch (error) {
        showSnackbar('Erro ao carregar dados da empresa', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadCompanyData();
  }, [company]);

  const handleCompanyChange = (key, value, nestedKey = null) => {
    if (nestedKey) {
      setFormData(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          [nestedKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  const handleSaveCompany = async () => {
    setSaving(true);
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCompany(formData);
      setEditing(false);
      showSnackbar('Informações da empresa atualizadas com sucesso!', 'success');
    } catch (error) {
      showSnackbar('Erro ao atualizar informações da empresa', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.email) {
      showSnackbar('Nome e email são obrigatórios', 'error');
      return;
    }

    const contact = {
      ...newContact,
      id: Date.now()
    };

    setFormData(prev => ({
      ...prev,
      additionalContacts: [...prev.additionalContacts, contact]
    }));

    setNewContact({
      name: '',
      position: '',
      email: '',
      phone: '',
      department: '',
      isPrimary: false
    });

    showSnackbar('Contacto adicionado com sucesso!', 'success');
  };

  const handleDeleteContact = (contactId) => {
    setFormData(prev => ({
      ...prev,
      additionalContacts: prev.additionalContacts.filter(contact => contact.id !== contactId)
    }));
    setDeleteDialog({ open: false, contact: null });
    showSnackbar('Contacto removido com sucesso!', 'success');
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`company-tabpanel-${index}`}
      aria-labelledby={`company-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getDepartmentColor = (department) => {
    const colors = {
      'Comercial': 'primary',
      'Tecnologia': 'secondary',
      'Financeiro': 'success',
      'Recursos Humanos': 'warning',
      'Marketing': 'info',
      'Direcção': 'error'
    };
    return colors[department] || 'default';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0
    }).format(value);
  };

  const LoadingSkeleton = () => (
    <Box>
      <Skeleton variant="rounded" height={56} sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} lg={4}>
          <Box display="flex" flexDirection="column" gap={3}>
            <Skeleton variant="rounded" height={200} />
            <Skeleton variant="rounded" height={150} />
            <Skeleton variant="rounded" height={150} />
          </Box>
        </Grid>
        <Grid item xs={12} lg={8}>
          <Skeleton variant="rounded" height={500} />
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
            sx={{ 
              fontSize: { xs: '1.75rem', sm: '2.25rem', lg: '2.75rem' },
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}
          >
            Informações da Empresa
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              fontSize: { xs: '0.9rem', sm: '1.1rem' },
              fontWeight: 400
            }}
          >
            Gerencie os dados e contactos da sua empresa
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={editing ? (saving ? <CircularProgress size={20} /> : <SaveIcon />) : <EditIcon />}
          onClick={editing ? handleSaveCompany : () => setEditing(true)}
          disabled={saving}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
            },
            fontWeight: 600,
            px: 3
          }}
        >
          {editing ? (saving ? 'Salvando...' : 'Salvar Alterações') : 'Editar Empresa'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Company Overview Sidebar */}
        <Grid item xs={12} lg={4}>
          <Box display="flex" flexDirection="column" gap={3}>
            {/* Company Card */}
            <Card
              sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 2,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
                  }}
                >
                  {getInitials(company.name)}
                </Avatar>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {company.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {company.tradeName}
                </Typography>
                <Chip
                  label={company.industry}
                  color="primary"
                  variant="filled"
                  sx={{ 
                    mb: 2,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  Desde {new Date(company.foundedDate).getFullYear()}
                </Typography>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card
              sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
                border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold" display="flex" alignItems="center" gap={1}>
                  <BusinessIcon color="info" />
                  Estatísticas da Empresa
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 2,
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}
                      >
                        <PeopleIcon fontSize="small" />
                      </Box>
                    </ListItemIcon>
                    <ListItemText 
                      primary="Colaboradores" 
                      secondary={company.employees}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 2,
                          background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}
                      >
                        <AccountBalanceIcon fontSize="small" />
                      </Box>
                    </ListItemIcon>
                    <ListItemText 
                      primary="Capital Social" 
                      secondary={formatCurrency(company.capital)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 2,
                          background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}
                      >
                        <CorporateFareIcon fontSize="small" />
                      </Box>
                    </ListItemIcon>
                    <ListItemText 
                      primary="Tipo de Sociedade" 
                      secondary={company.businessType}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 2,
                          background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}
                      >
                        <ScheduleIcon fontSize="small" />
                      </Box>
                    </ListItemIcon>
                    <ListItemText 
                      primary="Fundação" 
                      secondary={new Date(company.foundedDate).toLocaleDateString('pt-BR')}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card
              sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
                border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold" display="flex" alignItems="center" gap={1}>
                  <ContactPhoneIcon color="success" />
                  Contacto Principal
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <EmailIcon color="primary" fontSize="small" />
                    <Typography variant="body2">
                      {company.email}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <PhoneIcon color="primary" fontSize="small" />
                    <Typography variant="body2">
                      {company.phone}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <WebIcon color="primary" fontSize="small" />
                    <Typography variant="body2">
                      {company.website}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="flex-start" gap={1}>
                    <LocationIcon color="primary" fontSize="small" />
                    <Typography variant="body2">
                      {company.address.street}, {company.address.city}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          <Card
            sx={{ 
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons="auto"
                sx={{ 
                  px: 3, 
                  pt: 2,
                  '& .MuiTab-root': {
                    fontWeight: 600,
                    minHeight: 60
                  }
                }}
              >
                <Tab icon={<BusinessIcon />} label="Informações" />
                <Tab icon={<ContactPhoneIcon />} label="Contactos" />
                <Tab icon={<LocationIcon />} label="Localização" />
                <Tab icon={<PublicIcon />} label="Redes Sociais" />
              </Tabs>

              <Divider />

              {/* Company Info Tab */}
              <TabPanel value={activeTab} index={0}>
                <Box px={3}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Informações da Empresa
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Dados legais e informações comerciais da sua empresa.
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Nome da Empresa"
                        value={formData.name}
                        onChange={(e) => handleCompanyChange('name', e.target.value)}
                        disabled={!editing}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BusinessIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Nome Comercial"
                        value={formData.tradeName}
                        onChange={(e) => handleCompanyChange('tradeName', e.target.value)}
                        disabled={!editing}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="NIF"
                        value={formData.nif}
                        onChange={(e) => handleCompanyChange('nif', e.target.value)}
                        disabled={!editing}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="NUIT"
                        value={formData.nuit}
                        onChange={(e) => handleCompanyChange('nuit', e.target.value)}
                        disabled={!editing}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Ramo de Actividade</InputLabel>
                        <Select
                          value={formData.industry}
                          onChange={(e) => handleCompanyChange('industry', e.target.value)}
                          disabled={!editing}
                          label="Ramo de Actividade"
                        >
                          <MenuItem value="Tecnologia">Tecnologia</MenuItem>
                          <MenuItem value="Consultoria">Consultoria</MenuItem>
                          <MenuItem value="Comércio">Comércio</MenuItem>
                          <MenuItem value="Indústria">Indústria</MenuItem>
                          <MenuItem value="Serviços">Serviços</MenuItem>
                          <MenuItem value="Outro">Outro</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Data de Fundação"
                        type="date"
                        value={formData.foundedDate}
                        onChange={(e) => handleCompanyChange('foundedDate', e.target.value)}
                        disabled={!editing}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Tipo de Negócio</InputLabel>
                        <Select
                          value={formData.businessType}
                          onChange={(e) => handleCompanyChange('businessType', e.target.value)}
                          disabled={!editing}
                          label="Tipo de Negócio"
                        >
                          <MenuItem value="Sociedade por Quotas">Sociedade por Quotas</MenuItem>
                          <MenuItem value="Sociedade Anónima">Sociedade Anónima</MenuItem>
                          <MenuItem value="Empresário Individual">Empresário Individual</MenuItem>
                          <MenuItem value="Sucursal">Sucursal</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Forma Jurídica"
                        value={formData.legalForm}
                        onChange={(e) => handleCompanyChange('legalForm', e.target.value)}
                        disabled={!editing}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Capital Social (AOA)"
                        type="number"
                        value={formData.capital}
                        onChange={(e) => handleCompanyChange('capital', parseInt(e.target.value))}
                        disabled={!editing}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccountBalanceIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Número de Colaboradores"
                        type="number"
                        value={formData.employees}
                        onChange={(e) => handleCompanyChange('employees', parseInt(e.target.value))}
                        disabled={!editing}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PeopleIcon color="action" />
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
                        sx={{ fontWeight: 600 }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleSaveCompany}
                        disabled={saving}
                        startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                        sx={{ 
                          fontWeight: 600,
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                          }
                        }}
                      >
                        {saving ? 'Salvando...' : 'Salvar Alterações'}
                      </Button>
                    </Box>
                  )}
                </Box>
              </TabPanel>

              {/* Contacts Tab */}
              <TabPanel value={activeTab} index={1}>
                <Box px={3}>
                  <Box display="flex" justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={3}>
                    <Box>
                      <Typography variant="h6" gutterBottom fontWeight="bold">
                        Contactos da Empresa
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Liste os contactos principais da sua empresa
                      </Typography>
                    </Box>
                    <Chip 
                      label={`${formData.additionalContacts.length} contactos`}
                      color="primary"
                      variant="outlined"
                    />
                  </Box>

                  {/* Contact List */}
                  <List>
                    {formData.additionalContacts.map((contact, index) => (
                      <React.Fragment key={contact.id}>
                        <ListItem 
                          alignItems="flex-start"
                          sx={{
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.04),
                              transform: 'translateX(4px)'
                            }
                          }}
                        >
                          <ListItemIcon>
                            <Avatar 
                              sx={{ 
                                bgcolor: theme.palette.primary.main,
                                boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`
                              }}
                            >
                              {getInitials(contact.name)}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box display="flex" alignItems="center" gap={1} mb={1} flexWrap="wrap">
                                <Typography variant="subtitle1" fontWeight="600">
                                  {contact.name}
                                </Typography>
                                {contact.isPrimary && (
                                  <Chip 
                                    label="Principal" 
                                    color="primary" 
                                    size="small"
                                    sx={{ fontWeight: 600 }}
                                  />
                                )}
                                <Chip 
                                  label={contact.department} 
                                  color={getDepartmentColor(contact.department)}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontWeight: 500 }}
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.primary" gutterBottom fontWeight="500">
                                  {contact.position}
                                </Typography>
                                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={{ xs: 0.5, sm: 2 }} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                                  <Box display="flex" alignItems="center" gap={0.5}>
                                    <EmailIcon fontSize="small" color="action" />
                                    <Typography variant="body2">
                                      {contact.email}
                                    </Typography>
                                  </Box>
                                  <Box display="flex" alignItems="center" gap={0.5}>
                                    <PhoneIcon fontSize="small" color="action" />
                                    <Typography variant="body2">
                                      {contact.phone}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <Tooltip title="Excluir contacto">
                              <IconButton
                                edge="end"
                                onClick={() => setDeleteDialog({ open: true, contact })}
                                color="error"
                                sx={{
                                  background: alpha(theme.palette.error.main, 0.1),
                                  '&:hover': {
                                    background: alpha(theme.palette.error.main, 0.2),
                                  }
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </ListItemSecondaryAction>
                        </ListItem>
                        {index < formData.additionalContacts.length - 1 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))}
                  </List>

                  {/* Add Contact Form */}
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 3, 
                      mt: 3,
                      background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.info.main, 0.02)} 100%)`,
                      border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                    }}
                  >
                    <Typography variant="h6" gutterBottom fontWeight="bold" display="flex" alignItems="center" gap={1}>
                      <AddIcon color="info" />
                      Adicionar Novo Contacto
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Nome"
                          value={newContact.name}
                          onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PeopleIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Cargo"
                          value={newContact.position}
                          onChange={(e) => setNewContact(prev => ({ ...prev, position: e.target.value }))}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          value={newContact.email}
                          onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
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
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Telefone"
                          value={newContact.phone}
                          onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
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
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Departamento</InputLabel>
                          <Select
                            value={newContact.department}
                            onChange={(e) => setNewContact(prev => ({ ...prev, department: e.target.value }))}
                            label="Departamento"
                          >
                            <MenuItem value="Comercial">Comercial</MenuItem>
                            <MenuItem value="Tecnologia">Tecnologia</MenuItem>
                            <MenuItem value="Financeiro">Financeiro</MenuItem>
                            <MenuItem value="Recursos Humanos">Recursos Humanos</MenuItem>
                            <MenuItem value="Marketing">Marketing</MenuItem>
                            <MenuItem value="Direcção">Direcção</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={newContact.isPrimary}
                              onChange={(e) => setNewContact(prev => ({ ...prev, isPrimary: e.target.checked }))}
                              color="primary"
                            />
                          }
                          label="Contacto Principal"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={handleAddContact}
                          sx={{
                            background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
                            '&:hover': {
                              background: `linear-gradient(135deg, ${theme.palette.info.dark}, ${theme.palette.info.main})`,
                            }
                          }}
                        >
                          Adicionar Contacto
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              </TabPanel>

              {/* Location Tab */}
              <TabPanel value={activeTab} index={2}>
                <Box px={3}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Localização da Empresa
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Informações de localização e endereço da sua empresa.
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Morada"
                        value={formData.address.street}
                        onChange={(e) => handleCompanyChange('address', e.target.value, 'street')}
                        disabled={!editing}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Cidade"
                        value={formData.address.city}
                        onChange={(e) => handleCompanyChange('address', e.target.value, 'city')}
                        disabled={!editing}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Província"
                        value={formData.address.province}
                        onChange={(e) => handleCompanyChange('address', e.target.value, 'province')}
                        disabled={!editing}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Código Postal"
                        value={formData.address.postalCode}
                        onChange={(e) => handleCompanyChange('address', e.target.value, 'postalCode')}
                        disabled={!editing}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="País"
                        value={formData.address.country}
                        onChange={(e) => handleCompanyChange('address', e.target.value, 'country')}
                        disabled={!editing}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FlagIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>

                  {/* Contact Information */}
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Informações de Contacto
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleCompanyChange('email', e.target.value)}
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
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Telefone"
                        value={formData.phone}
                        onChange={(e) => handleCompanyChange('phone', e.target.value)}
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
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Website"
                        value={formData.website}
                        onChange={(e) => handleCompanyChange('website', e.target.value)}
                        disabled={!editing}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <WebIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </TabPanel>

              {/* Social Media Tab */}
              <TabPanel value={activeTab} index={3}>
                <Box px={3}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Redes Sociais
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Links para as redes sociais da sua empresa.
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Facebook"
                        value={formData.socialMedia.facebook}
                        onChange={(e) => handleCompanyChange('socialMedia', e.target.value, 'facebook')}
                        disabled={!editing}
                        variant="outlined"
                        placeholder="username"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FacebookIcon sx={{ color: '#1877F2' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="LinkedIn"
                        value={formData.socialMedia.linkedin}
                        onChange={(e) => handleCompanyChange('socialMedia', e.target.value, 'linkedin')}
                        disabled={!editing}
                        variant="outlined"
                        placeholder="company/username"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LinkedInIcon sx={{ color: '#0A66C2' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Twitter"
                        value={formData.socialMedia.twitter}
                        onChange={(e) => handleCompanyChange('socialMedia', e.target.value, 'twitter')}
                        disabled={!editing}
                        variant="outlined"
                        placeholder="username"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <TwitterIcon sx={{ color: '#1DA1F2' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Contact Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, contact: null })}
        PaperProps={{
          sx: {
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          <Box display="flex" alignItems="center" gap={1}>
            <DeleteIcon color="error" />
            Confirmar Exclusão
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o contacto <strong>{deleteDialog.contact?.name}</strong>?
          </Typography>
          {deleteDialog.contact && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: alpha(theme.palette.grey[100], 0.5), borderRadius: 1 }}>
              <Typography variant="body2" fontWeight="500">
                <strong>Email:</strong> {deleteDialog.contact.email}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Departamento:</strong> {deleteDialog.contact.department}
              </Typography>
            </Box>
          )}
          <Alert severity="warning" sx={{ mt: 2 }}>
            Esta ação não pode ser desfeita.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setDeleteDialog({ open: false, contact: null })}
            variant="outlined"
            sx={{ fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={() => handleDeleteContact(deleteDialog.contact?.id)} 
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
            sx={{ 
              fontWeight: 600,
              background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.error.dark}, ${theme.palette.error.main})`,
              }
            }}
            autoFocus
          >
            Confirmar Exclusão
          </Button>
        </DialogActions>
      </Dialog>

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
            fontWeight: 500
          }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Company;