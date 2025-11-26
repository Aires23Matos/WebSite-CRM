import React, { useState, useEffect } from 'react';
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
  Alert,
  CircularProgress,
  MenuItem,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
  useTheme,
  useMediaQuery,
  alpha,
  Tooltip,
  Fade,
  Chip,
  InputAdornment,
  Skeleton,
  LinearProgress,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  CardMembership as LicenseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  Payment as PaymentIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import ClientSelect from "../../components/clientSelect/ClientSelect"
import { urlApi } from '../../../public/url/url';

// const url = 'http://localhost:3000';
const url = urlApi;

const License = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [licenses, setLicenses] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, license: null });
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientAddresses, setClientAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const [formData, setFormData] = useState({
    client_id: '',
    tecnico: '',
    localizacao: '',
    numeroLicenca: '',
    data_da_instalacao: '',
    data_da_ativacao: '',
    data_da_expiracao: '',
    estado: 'ativa',
    hora_de_formacao: '',
    validade_em_mes: 12,
    conta_pago: 'Pago',
    valor_pago: 0,
    valor_total: 0 
  });

  // Carregar lista de licenças
  const fetchLicenses = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const response = await axios.get(`${url}/api/v1/licenses/licenses`);
      const licensesData = response.data.data?.licenses || response.data.data || [];
      
      // Verificar e atualizar estado das licenças expiradas
      const updatedLicenses = licensesData.map(license => {
        if (isLicenseExpired(license.data_da_expiracao) && license.estado === 'ativa') {
          return { ...license, estado: 'expirada' };
        }
        return license;
      });
      
      setLicenses(updatedLicenses);
      setError('');
    } catch (err) {
      console.error('Erro ao carregar licenças:', err);
      setError('Erro ao carregar lista de licenças');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Função para verificar se a licença está expirada
  const isLicenseExpired = (expirationDate) => {
    if (!expirationDate) return false;
    return new Date(expirationDate) < new Date();
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  // Carregar endereços do cliente quando um cliente é selecionado
  const fetchClientAddresses = async (clientId) => {
    if (!clientId) {
      setClientAddresses([]);
      return;
    }

    setLoadingAddresses(true);
    try {
      const response = await axios.get(`${url}/api/v1/address/${clientId}`);
      const addresses = response.data.data?.addresses || [];
      setClientAddresses(addresses);
    } catch (err) {
      console.error('Erro ao carregar endereços do cliente:', err);
      try {
        const alternativeResponse = await axios.get(`${url}/api/v1/address/addresses`);
        const allAddresses = alternativeResponse.data.data?.addresses || [];
        const filteredAddresses = allAddresses.filter(address => address.client_id === clientId);
        setClientAddresses(filteredAddresses);
      } catch (secondErr) {
        console.error('Erro alternativo ao carregar endereços:', secondErr);
        setClientAddresses([]);
      }
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Se a conta for "Parcial", garantir que valor_total seja maior que valor_pago
    if (name === 'conta_pago' && value === 'Parcial') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        valor_total: prev.valor_total > prev.valor_pago ? prev.valor_total : prev.valor_pago + 1000
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: name === 'validade_em_mes' || name === 'valor_pago' || name === 'valor_total' ? Number(value) : value
    }));
  };

  // Validação para garantir que valor_pago não seja maior que valor_total quando conta_pago for "Parcial"
  const validatePaymentValues = () => {
    if (formData.conta_pago === 'Parcial') {
      if (formData.valor_pago > formData.valor_total) {
        setError('O valor pago não pode ser maior que o valor total');
        return false;
      }
      if (formData.valor_total <= 0) {
        setError('O valor total deve ser maior que zero para pagamento parcial');
        return false;
      }
    }
    return true;
  };

  const handleClientChange = (client) => {
    setSelectedClient(client);
    const clientId = client ? client.client_id : '';
    
    setFormData(prev => ({
      ...prev,
      client_id: clientId,
      localizacao: '' // Resetar localização quando mudar de cliente
    }));

    // Carregar endereços do cliente selecionado
    if (clientId) {
      fetchClientAddresses(clientId);
    } else {
      setClientAddresses([]);
    }
  };

  const handleLocationChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      localizacao: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    // Validar valores de pagamento
    if (!validatePaymentValues()) {
      setSaving(false);
      return;
    }

    // Verificar se a licença está expirada e ajustar o estado automaticamente
    const finalFormData = { ...formData };
    if (isLicenseExpired(formData.data_da_expiracao) && formData.estado === 'ativa') {
      finalFormData.estado = 'expirada';
    }

    try {
      const response = await axios.post(`${url}/api/v1/licenses/register`, finalFormData);
      setSuccess(response.data.message || 'Licença criada com sucesso!');
      
      // Limpar formulário e recarregar lista
      setFormData({
        client_id: '',
        tecnico: '',
        localizacao: '',
        numeroLicenca: '',
        data_da_instalacao: '',
        data_da_ativacao: '',
        data_da_expiracao: '',
        estado: 'ativa',
        hora_de_formacao: '',
        validade_em_mes: 12,
        conta_pago: 'Pago',
        valor_pago: 0,
        valor_total: 0
      });
      setSelectedClient(null);
      setClientAddresses([]);
      
      fetchLicenses(true);
    } catch (err) {
      console.error('Erro ao criar licença:', err);
      setError(err.response?.data?.message || 'Erro ao criar licença');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (license) => {
    const licenseId = license._id || license.license_id;
    navigate(`/licenses/update/${licenseId}`);
  };

  const handleDelete = (license) => {
    setDeleteDialog({ open: true, license });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.license) return;

    try {
      const licenseId = deleteDialog.license._id || deleteDialog.license.license_id;
      await axios.delete(`${url}/api/v1/licenses/${licenseId}`);
      setSuccess('Licença excluída com sucesso!');
      fetchLicenses(true);
    } catch (err) {
      console.error('Erro ao excluir licença:', err);
      setError(err.response?.data?.message || 'Erro ao excluir licença');
    } finally {
      setDeleteDialog({ open: false, license: null });
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({ open: false, license: null });
  };

  // Função para formatar data
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Função para obter configuração do estado
  const getEstadoConfig = (estado, expirationDate) => {
    // Se a licença está expirada, forçar estado como expirada
    if (isLicenseExpired(expirationDate) && estado === 'ativa') {
      estado = 'expirada';
    }

    switch (estado) {
      case 'ativa':
        return { 
          color: 'success', 
          icon: <CheckCircleIcon fontSize="small" />,
          gradient: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`
        };
      case 'expirada':
        return { 
          color: 'error', 
          icon: <CancelIcon fontSize="small" />,
          gradient: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`
        };
      case 'pendente':
        return { 
          color: 'warning', 
          icon: <PendingIcon fontSize="small" />,
          gradient: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`
        };
      case 'cancelada':
        return { 
          color: 'default', 
          icon: <CancelIcon fontSize="small" />,
          gradient: `linear-gradient(135deg, ${theme.palette.grey[500]}, ${theme.palette.grey[700]})`
        };
      default:
        return { 
          color: 'default', 
          icon: <PendingIcon fontSize="small" />,
          gradient: `linear-gradient(135deg, ${theme.palette.grey[500]}, ${theme.palette.grey[700]})`
        };
    }
  };

  // Função para obter configuração do pagamento
  const getPagamentoConfig = (conta_pago) => {
    switch (conta_pago) {
      case 'Pago':
        return { color: 'success', icon: <CheckCircleIcon fontSize="small" /> };
      case 'Não Pago':
        return { color: 'error', icon: <CancelIcon fontSize="small" /> };
      case 'Parcial':
        return { color: 'warning', icon: <PendingIcon fontSize="small" /> };
      case 'Pendente':
        return { color: 'info', icon: <ScheduleIcon fontSize="small" /> };
      default:
        return { color: 'default', icon: <PendingIcon fontSize="small" /> };
    }
  };

  // Calcular estatísticas
  const stats = {
    total: licenses.length,
    ativas: licenses.filter(l => l.estado === 'ativa' && !isLicenseExpired(l.data_da_expiracao)).length,
    expiradas: licenses.filter(l => l.estado === 'expirada' || (l.estado === 'ativa' && isLicenseExpired(l.data_da_expiracao))).length,
    pendentes: licenses.filter(l => l.estado === 'pendente').length,
    valorTotal: licenses.reduce((sum, l) => sum + (l.valor_pago || 0), 0)
  };

  // Loading skeleton
  const TableSkeleton = () => (
    <Box>
      {[1, 2, 3, 4, 5].map((item) => (
        <Skeleton key={item} variant="rounded" height={60} sx={{ mb: 1 }} />
      ))}
    </Box>
  );

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
          <Tooltip title="Voltar para clientes">
            <IconButton
              onClick={() => navigate('/clients')}
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
              Gestão de Licenças
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.9rem', sm: '1.1rem' },
                fontWeight: 400
              }}
            >
              Registre e gerencie licenças dos clientes
            </Typography>
          </Box>
        </Box>

        <Tooltip title="Atualizar lista">
          <IconButton
            onClick={() => fetchLicenses(true)}
            disabled={refreshing}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.grey[100]}, ${theme.palette.grey[200]})`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.grey[200]}, ${theme.palette.grey[300]})`,
              }
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {refreshing && (
        <LinearProgress 
          sx={{ 
            mb: 2,
            height: 3,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            '& .MuiLinearProgress-bar': {
              background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`
            }
          }} 
        />
      )}

      <Grid container spacing={3}>
        {/* Formulário */}
        <Grid item xs={12} lg={6}>
          <Card
            sx={{ 
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
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
                  <LicenseIcon />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Registrar Nova Licença
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Preencha as informações da licença
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {error && (
                <Fade in={!!error}>
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                </Fade>
              )}

              {success && (
                <Fade in={!!success}>
                  <Alert severity="success" sx={{ mb: 3 }}>
                    {success}
                  </Alert>
                </Fade>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <ClientSelect
                      value={selectedClient}
                      onChange={handleClientChange}
                      required
                    />
                  </Grid>

                  {/* Campo de Localização - aparece apenas quando um cliente é selecionado */}
                  {selectedClient && (
                    <Grid item xs={12}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Localização (Município)</InputLabel>
                        <Select
                          value={formData.localizacao}
                          onChange={handleLocationChange}
                          label="Localização (Município)"
                          startAdornment={
                            <InputAdornment position="start">
                              <LocationIcon color="action" />
                            </InputAdornment>
                          }
                          disabled={loadingAddresses}
                        >
                          <MenuItem value="">
                            <em>Selecione um município</em>
                          </MenuItem>
                          {clientAddresses.map((endereco, index) => (
                            <MenuItem 
                              key={endereco._id || index} 
                              value={endereco.municipio}
                            >
                              <Box>
                                <Typography variant="body1" fontWeight="medium">
                                  {endereco.municipio}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {loadingAddresses && (
                        <Box display="flex" alignItems="center" gap={1} sx={{ mt: 1 }}>
                          <CircularProgress size={16} />
                          <Typography variant="caption" color="text.secondary">
                            Carregando endereços...
                          </Typography>
                        </Box>
                      )}
                      {!loadingAddresses && clientAddresses.length === 0 && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          Este cliente não possui endereços cadastrados.
                        </Typography>
                      )}
                    </Grid>
                  )}

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Técnico Responsável"
                      name="tecnico"
                      value={formData.tecnico}
                      onChange={handleChange}
                      variant="outlined"
                      placeholder="Nome do técnico"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Número da Licença"
                      name="numeroLicenca"
                      value={formData.numeroLicenca}
                      onChange={handleChange}
                      variant="outlined"
                      placeholder="Número único da licença"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LicenseIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Data de Instalação"
                      name="data_da_instalacao"
                      type="date"
                      value={formData.data_da_instalacao}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Data de Ativação"
                      name="data_da_ativacao"
                      type="date"
                      value={formData.data_da_ativacao}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Data de Expiração"
                      name="data_da_expiracao"
                      type="date"
                      value={formData.data_da_expiracao}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Hora de Formação"
                      name="hora_de_formacao"
                      type="time"
                      value={formData.hora_de_formacao}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ScheduleIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Estado da Licença"
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      variant="outlined"
                    >
                      <MenuItem value="ativa">Ativa</MenuItem>
                      <MenuItem value="expirada">Expirada</MenuItem>
                      <MenuItem value="pendente">Pendente</MenuItem>
                      <MenuItem value="cancelada">Cancelada</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Status do Pagamento"
                      name="conta_pago"
                      value={formData.conta_pago}
                      onChange={handleChange}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PaymentIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    >
                      <MenuItem value="Pago">Pago</MenuItem>
                      <MenuItem value="Não Pago">Não Pago</MenuItem>
                      <MenuItem value="Parcial">Parcial</MenuItem>
                      <MenuItem value="Pendente">Pendente</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Validade (meses)"
                      name="validade_em_mes"
                      type="number"
                      value={formData.validade_em_mes}
                      onChange={handleChange}
                      variant="outlined"
                      inputProps={{ min: 1, max: 60 }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Valor Pago (KZ)"
                      name="valor_pago"
                      type="number"
                      value={formData.valor_pago}
                      onChange={handleChange}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <TrendingUpIcon color="action" />
                          </InputAdornment>
                        ),
                        inputProps: { min: 0, step: 0.01 }
                      }}
                    />
                  </Grid>

                  {/* Campo para Valor Total - aparece apenas quando conta_pago é "Parcial" */}
                  {formData.conta_pago === 'Parcial' && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Valor Total (KZ)"
                        name="valor_total"
                        type="number"
                        value={formData.valor_total}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        helperText="Valor total a ser pago pela licença"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <TrendingUpIcon color="action" />
                            </InputAdornment>
                          ),
                          inputProps: { min: formData.valor_pago, step: 0.01 }
                        }}
                      />
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Box display="flex" gap={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() => navigate('/clients')}
                        disabled={saving}
                        sx={{ 
                          fontWeight: 600,
                          minWidth: 120
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                        disabled={saving || !formData.client_id}
                        sx={{ 
                          fontWeight: 600,
                          minWidth: 180,
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                          }
                        }}
                      >
                        {saving ? 'Registrando...' : 'Registrar Licença'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Tabela de Licenças */}
        <Grid item xs={12} lg={6}>
          <Card
            sx={{ 
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}
                  >
                    <LicenseIcon />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Licenças Registradas
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {licenses.length} licença(s) no sistema
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {loading ? (
                <TableSkeleton />
              ) : (
                <TableContainer 
                  sx={{ 
                    maxHeight: isMobile ? '50vh' : '60vh',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    '&::-webkit-scrollbar': {
                      width: 8,
                    },
                    '&::-webkit-scrollbar-track': {
                      background: theme.palette.grey[100],
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: theme.palette.primary.main,
                      borderRadius: 4,
                    }
                  }}
                >
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow 
                        sx={{ 
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                          '& th': {
                            fontWeight: 'bold',
                            color: theme.palette.primary.dark,
                            fontSize: { xs: '0.75rem', sm: '0.8rem' },
                            py: 2,
                            borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`
                          }
                        }}
                      >
                        <TableCell>Licença</TableCell>
                        <TableCell>Cliente</TableCell>
                        <TableCell>Localização</TableCell>
                        <TableCell>Estado</TableCell>
                        {!isMobile && <TableCell>Expiração</TableCell>}
                        <TableCell>Pagamento</TableCell>
                        <TableCell align="center">Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {licenses.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={isMobile ? 6 : 7} align="center" sx={{ py: 6 }}>
                            <Box sx={{ color: 'text.secondary', mb: 2 }}>
                              <LicenseIcon sx={{ fontSize: 48 }} />
                            </Box>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                              Nenhuma licença registrada
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Comece registrando uma nova licença
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        licenses.map((license) => {
                          const estadoConfig = getEstadoConfig(license.estado, license.data_da_expiracao);
                          const pagamentoConfig = getPagamentoConfig(license.conta_pago);
                          const isExpired = isLicenseExpired(license.data_da_expiracao);
                          const displayEstado = isExpired && license.estado === 'ativa' ? 'expirada' : license.estado;
                          
                          return (
                            <TableRow 
                              key={license._id || license.license_id}
                              sx={{ 
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': { 
                                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                                  transform: 'translateX(4px)'
                                }
                              }}
                            >
                              <TableCell>
                                <Typography variant="body2" fontWeight="600">
                                  {license.numeroLicenca || 'N/A'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {license.cliente?.clientName || license.client_id || 'N/A'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                  {license.localizacao || 'N/A'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  icon={estadoConfig.icon}
                                  label={displayEstado}
                                  color={estadoConfig.color}
                                  size="small"
                                  variant="filled"
                                  sx={{ 
                                    fontWeight: 500,
                                    background: estadoConfig.gradient,
                                    color: 'white',
                                    '& .MuiChip-icon': {
                                      color: 'white !important'
                                    }
                                  }}
                                />
                              </TableCell>
                              {!isMobile && (
                                <TableCell>
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      {formatDate(license.data_da_expiracao)}
                                    </Typography>
                                    {isExpired && (
                                      <Chip
                                        label="Expirada"
                                        color="error"
                                        size="small"
                                        variant="outlined"
                                        sx={{ mt: 0.5, fontSize: '0.6rem', height: 20 }}
                                      />
                                    )}
                                  </Box>
                                </TableCell>
                              )}
                              <TableCell>
                                <Box display="flex" flexDirection="column" gap={0.5}>
                                  <Chip
                                    icon={pagamentoConfig.icon}
                                    label={license.valor_pago ? `${license.valor_pago} KZ` : 'N/A'}
                                    color={pagamentoConfig.color}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontWeight: 500 }}
                                  />
                                  {license.conta_pago === 'Parcial' && license.valor_total && (
                                    <Typography 
                                      variant="caption" 
                                      color="text.secondary"
                                      sx={{ textAlign: 'center' }}
                                    >
                                      Total: {license.valor_total} KZ
                                    </Typography>
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Box display="flex" justifyContent="center" gap={0.5}>
                                  <Tooltip title="Editar licença">
                                    <IconButton
                                      color="primary"
                                      onClick={() => handleEdit(license)}
                                      size="small"
                                      sx={{ 
                                        background: alpha(theme.palette.primary.main, 0.1),
                                        '&:hover': { 
                                          background: alpha(theme.palette.primary.main, 0.2),
                                          transform: 'scale(1.1)'
                                        }
                                      }}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Excluir licença">
                                    <IconButton
                                      color="error"
                                      onClick={() => handleDelete(license)}
                                      size="small"
                                      sx={{ 
                                        background: alpha(theme.palette.error.main, 0.1),
                                        '&:hover': { 
                                          background: alpha(theme.palette.error.main, 0.2),
                                          transform: 'scale(1.1)'
                                        }
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <Card
            sx={{ 
              mt: 3,
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.info.main, 0.02)} 100%)`,
              border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" display="flex" alignItems="center" gap={1}>
                <TrendingUpIcon color="info" />
                Estatísticas de Licenças
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography 
                      variant="h4" 
                      fontWeight="bold"
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent'
                      }}
                    >
                      {stats.total}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography 
                      variant="h4" 
                      fontWeight="bold"
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent'
                      }}
                    >
                      {stats.ativas}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ativas
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography 
                      variant="h4" 
                      fontWeight="bold"
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent'
                      }}
                    >
                      {stats.pendentes}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pendentes
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography 
                      variant="h4" 
                      fontWeight="bold"
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent'
                      }}
                    >
                      {stats.expiradas}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Expiradas
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  Valor Total: <strong>{stats.valorTotal} KZ</strong>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog 
        open={deleteDialog.open} 
        onClose={cancelDelete}
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
            Tem certeza que deseja excluir a licença <strong>{deleteDialog.license?.numeroLicenca}</strong>?
          </Typography>
          {deleteDialog.license && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: alpha(theme.palette.grey[100], 0.5), borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>Cliente:</strong> {deleteDialog.license.cliente?.clientName || deleteDialog.license.client_id}
              </Typography>
              <Typography variant="body2">
                <strong>Localização:</strong> {deleteDialog.license.localizacao || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Estado:</strong> {deleteDialog.license.estado}
              </Typography>
              <Typography variant="body2">
                <strong>Valor:</strong> {deleteDialog.license.valor_pago ? `${deleteDialog.license.valor_pago} KZ` : 'N/A'}
                {deleteDialog.license.conta_pago === 'Parcial' && deleteDialog.license.valor_total && (
                  <span> de {deleteDialog.license.valor_total} KZ</span>
                )}
              </Typography>
            </Box>
          )}
          <Alert severity="warning" sx={{ mt: 2 }}>
            Esta ação não pode ser desfeita.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={cancelDelete}
            variant="outlined"
            sx={{ fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={confirmDelete} 
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
          >
            Excluir Licença
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default License;