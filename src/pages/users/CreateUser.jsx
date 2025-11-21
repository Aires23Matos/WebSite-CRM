import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  Container,
  useTheme,
  useMediaQuery,
  alpha,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  IconButton,
  Tooltip,
  Fade,
  Collapse
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  PersonAdd as PersonAddIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Security as SecurityIcon,
  Email as EmailIcon,
  VpnKey as KeyIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const CreateUser = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));


  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    adminCode: '' // Novo campo para código de administrador
  });

  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminCode: ''
  });

  const steps = ['Informações Básicas', 'Credenciais de Acesso', 'Revisão e Confirmação'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const errors = {};
    
    switch (step) {
      case 0:
        if (!formData.firstName.trim()) errors.firstName = 'Primeiro nome é obrigatório';
        if (!formData.lastName.trim()) errors.lastName = 'Sobrenome é obrigatório';
        if (!formData.email.trim()) {
          errors.email = 'Email é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          errors.email = 'Email inválido';
        }
        break;
      case 1:
        if (!formData.password) {
          errors.password = 'Senha é obrigatória';
        } else if (formData.password.length < 6) {
          errors.password = 'A senha deve ter pelo menos 6 caracteres';
        }
        if (!formData.confirmPassword) {
          errors.confirmPassword = 'Confirmação de senha é obrigatória';
        } else if (formData.password !== formData.confirmPassword) {
          errors.confirmPassword = 'As senhas não coincidem';
        }
        // Validação do código de administrador
        if (formData.role === 'admin' && !formData.adminCode.trim()) {
          errors.adminCode = 'Código de administrador é obrigatório';
        }
        break;
      default:
        break;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Remove confirmPassword before sending
      const {...userData } = formData;
      
      await axios.post('http://localhost:3000/api/v1/auth/register', userData);
      setSuccess('Usuário criado com sucesso!');
      
      setTimeout(() => {
        navigate('/users');
      }, 2000);
    } catch (err) {
      console.error('Erro ao criar usuário:', err);
      setError(err.response?.data?.message || 'Erro ao criar usuário');
    } finally {
      setSaving(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const toggleAdminCodeVisibility = () => {
    setShowAdminCode(!showAdminCode);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Primeiro Nome"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!!formErrors.firstName}
                helperText={formErrors.firstName}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <UserIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sobrenome"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!!formErrors.lastName}
                helperText={formErrors.lastName}
                required
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                required
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
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Senha"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!formErrors.password}
                helperText={formErrors.password || "Mínimo 6 caracteres"}
                required
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  startAdornment: (
                    <InputAdornment position="start">
                      <SecurityIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirmar Senha"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
                required
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Tipo de Usuário"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AdminIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="user">
                  <Box display="flex" alignItems="center" gap={1}>
                    <UserIcon fontSize="small" />
                    <span>Usuário</span>
                  </Box>
                </MenuItem>
                <MenuItem value="admin">
                  <Box display="flex" alignItems="center" gap={1}>
                    <AdminIcon fontSize="small" />
                    <span>Administrador</span>
                  </Box>
                </MenuItem>
              </TextField>
            </Grid>

            {/* Campo para código de administrador - aparece apenas quando role é admin */}
            <Grid item xs={12}>
              <Collapse in={formData.role === 'admin'}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    border: `2px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                    backgroundColor: alpha(theme.palette.warning.main, 0.05),
                    borderRadius: 2
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <WarningIcon color="warning" />
                    <Typography variant="subtitle1" fontWeight="bold" color="warning.main">
                      Código de Administrador Requerido
                    </Typography>
                  </Box>
                  
                  <TextField
                    fullWidth
                    label="Código de Administrador"
                    name="adminCode"
                    type={showAdminCode ? 'text' : 'password'}
                    value={formData.adminCode}
                    onChange={handleChange}
                    error={!!formErrors.adminCode}
                    helperText={formErrors.adminCode || "Código especial necessário para criar conta de administrador"}
                    required={formData.role === 'admin'}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={toggleAdminCodeVisibility} edge="end">
                            {showAdminCode ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      startAdornment: (
                        <InputAdornment position="start">
                          <KeyIcon color="warning" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Este código é necessário para verificar que tem autorização para criar contas de administrador.
                  </Typography>
                </Paper>
              </Collapse>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Box>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 3, 
                mb: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
                Resumo do Usuário
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Nome Completo:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formData.firstName} {formData.lastName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Email:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formData.email}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Tipo de Usuário:
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    {formData.role === 'admin' ? <AdminIcon color="error" /> : <UserIcon color="primary" />}
                    <Typography variant="body1" fontWeight="medium" textTransform="capitalize">
                      {formData.role}
                    </Typography>
                  </Box>
                </Grid>
                {formData.role === 'admin' && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Código de Admin:
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <KeyIcon color="warning" fontSize="small" />
                      <Typography variant="body1" fontWeight="medium">
                        {formData.adminCode ? '••••••••' : 'Não fornecido'}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Paper>
            
            {formData.role === 'admin' && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Atenção:</strong> Está a criar uma conta de administrador com acesso completo ao sistema.
                </Typography>
              </Alert>
            )}
            
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                Verifique todas as informações antes de criar o usuário.
              </Typography>
            </Alert>
          </Box>
        );
      default:
        return 'Step desconhecido';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
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
          <Tooltip title="Voltar para lista de usuários">
            <IconButton
              onClick={() => navigate('/users')}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.grey[100]}, ${theme.palette.grey[200]})`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.grey[200]}, ${theme.palette.grey[300]})`,
                }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
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
              Criar Novo Usuário
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.9rem', sm: '1.1rem' },
                fontWeight: 400
              }}
            >
              Cadastre um novo usuário no sistema
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Main Form */}
        <Grid item xs={12} lg={8}>
          <Card
            sx={{ 
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              overflow: 'visible'
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}
                >
                  <PersonAddIcon />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Dados do Novo Usuário
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Preencha todas as informações necessárias
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ mb: 3 }} />

              {/* Stepper */}
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{!isMobile && label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {error && (
                <Fade in={!!error}>
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                </Fade>
              )}

              {success && (
                <Fade in={!!success}>
                  <Alert 
                    severity="success" 
                    sx={{ mb: 3 }}
                    icon={<CheckCircleIcon fontSize="inherit" />}
                  >
                    {success}
                  </Alert>
                </Fade>
              )}

              <form onSubmit={handleSubmit}>
                {getStepContent(activeStep)}

                <Box display="flex" gap={2} justifyContent="space-between" sx={{ mt: 4 }}>
                  <Button
                    variant="outlined"
                    onClick={activeStep === 0 ? () => navigate('/users') : handleBack}
                    disabled={saving}
                    startIcon={<ArrowBackIcon />}
                    sx={{ 
                      fontWeight: 600,
                      minWidth: 120
                    }}
                  >
                    {activeStep === 0 ? 'Cancelar' : 'Voltar'}
                  </Button>

                  <Box display="flex" gap={2}>
                    {activeStep < steps.length - 1 ? (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ 
                          fontWeight: 600,
                          minWidth: 120,
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                          }
                        }}
                      >
                        Próximo
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                        disabled={saving}
                        sx={{ 
                          fontWeight: 600,
                          minWidth: 140,
                          background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${theme.palette.success.dark}, ${theme.palette.success.main})`,
                          }
                        }}
                      >
                        {saving ? 'Criando...' : 'Criar Usuário'}
                      </Button>
                    )}
                  </Box>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Information Sidebar */}
        <Grid item xs={12} lg={4}>
          <Card
            sx={{ 
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.info.main, 0.02)} 100%)`,
              border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
              position: 'sticky',
              top: 20
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <InfoIcon color="info" />
                <Typography variant="h6" fontWeight="bold" color="info.main">
                  Informações Importantes
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <Box mb={3}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom display="flex" alignItems="center" gap={1}>
                  <AdminIcon color="primary" fontSize="small" />
                  Tipos de Usuário
                </Typography>
                <Box component="ul" sx={{ pl: 2, '& li': { mb: 1 } }}>
                  <Typography variant="body2" color="text.secondary" component="li">
                    <strong>Administrador:</strong> Acesso completo ao sistema
                  </Typography>
                  <Typography variant="body2" color="text.secondary" component="li">
                    <strong>Usuário:</strong> Acesso básico às funcionalidades
                  </Typography>
                </Box>
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom display="flex" alignItems="center" gap={1}>
                  <KeyIcon color="warning" fontSize="small" />
                  Código de Administrador
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Para criar contas de administrador é necessário fornecer um código especial de verificação.
                </Typography>
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom display="flex" alignItems="center" gap={1}>
                  <SecurityIcon color="warning" fontSize="small" />
                  Requisitos de Senha
                </Typography>
                <Box component="ul" sx={{ pl: 2, '& li': { mb: 0.5 } }}>
                  <Typography variant="body2" color="text.secondary" component="li">
                    • Mínimo 6 caracteres
                  </Typography>
                  <Typography variant="body2" color="text.secondary" component="li">
                    • Recomendado usar letras, números e símbolos
                  </Typography>
                </Box>
              </Box>

              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  backgroundColor: alpha(theme.palette.info.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Após a criação, o usuário receberá um username automático gerado pelo sistema e poderá fazer login com o email e senha definidos.
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateUser;