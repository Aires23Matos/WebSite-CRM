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
  FormControlLabel,
  Checkbox,
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
  LinearProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Search as SearchIcon,
  Business as BusinessIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import CreateClient from "../clients/CreateClient";

const Responsible = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));


  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [accountables, setAccountables] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, accountable: null });
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    client_id: '',
    nome: '',
    email: '',
    telefone: '',
    isPrincipal: false
  });

  // Carregar lista de responsáveis
  const fetchAccountables = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const response = await axios.get('http://localhost:3000/api/v1/accountable/accountables');
      setAccountables(response.data.data?.accountables || []);
      setError('');
    } catch (err) {
      console.error('Erro ao carregar responsáveis:', err);
      setError('Erro ao carregar lista de responsáveis');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAccountables();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleClientChange = (client) => {
    setFormData(prev => ({
      ...prev,
      client_id: client ? client.client_id : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    // Validação básica
    if (!formData.client_id) {
      setError('Selecione um cliente');
      setSaving(false);
      return;
    }

    if (!formData.nome.trim()) {
      setError('Nome é obrigatório');
      setSaving(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('Email é obrigatório');
      setSaving(false);
      return;
    }

    if (!formData.telefone.trim()) {
      setError('Telefone é obrigatório');
      setSaving(false);
      return;
    }

    try {
      console.log('Enviando dados:', formData);
      
      // CORREÇÃO: Usando a chamada API correta
      const response = await axios.post('http://localhost:3000/api/v1/accountable/register', formData);
      
      console.log('Resposta da API:', response.data);
      
      if (response.data.success) {
        setSuccess('Responsável criado com sucesso!');
        
        // Limpar formulário
        setFormData({
          client_id: '',
          nome: '',
          email: '',
          telefone: '',
          isPrincipal: false
        });
        
        // Recarregar lista
        fetchAccountables();
      } else {
        setError(response.data.message || 'Erro ao criar responsável');
      }
    } catch (err) {
      console.error('Erro completo:', err);
      console.error('Resposta de erro:', err.response);
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Erro ao criar responsável';
      
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (accountable) => {
    if (accountable._id) {
      navigate(`/edit-accountable/${accountable._id}`);
    } else {
      setError('ID do responsável não encontrado');
    }
  };

  const handleDelete = async (accountable) => {
    if (!accountable._id) {
      setError('ID do responsável não encontrado');
      return;
    }
    setDeleteDialog({ open: true, accountable });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.accountable?._id) return;

    try {
      await axios.delete(`http://localhost:3000/api/v1/accountable/${deleteDialog.accountable._id}`);
      setSuccess('Responsável excluído com sucesso!');
      fetchAccountables();
    } catch (err) {
      console.error('Erro ao excluir responsável:', err);
      setError(err.response?.data?.message || 'Erro ao excluir responsável');
    } finally {
      setDeleteDialog({ open: false, accountable: null });
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({ open: false, accountable: null });
  };

  // Filtrar responsáveis baseado na pesquisa
  const filteredAccountables = accountables.filter(accountable =>
    accountable.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    accountable.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    accountable.telefone?.includes(searchTerm) ||
    accountable.cliente?.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading skeleton
  const LoadingSkeleton = () => (
    <Box>
      <Skeleton variant="rounded" height={56} sx={{ mb: 2 }} />
      <Skeleton variant="rounded" height={400} />
    </Box>
  );

  // Função para formatar telefone
  const formatPhone = (phone) => {
    if (!phone) return 'N/A';
    // Formatação básica para telefones angolanos
    return phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  };

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
              Gestão de Responsáveis
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.9rem', sm: '1.1rem' },
                fontWeight: 400
              }}
            >
              Cadastre e gerencie responsáveis pelos clientes
            </Typography>
          </Box>
        </Box>
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
                  <PersonIcon />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Registrar Novo Responsável
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Preencha as informações do responsável
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
                    <CreateClient
                      value={formData.client_id}
                      onChange={handleClientChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nome Completo"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      placeholder="Ex: João Silva Santos"
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
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      placeholder="exemplo@empresa.com"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      placeholder="+244 900 000 000"
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
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="isPrincipal"
                          checked={formData.isPrincipal}
                          onChange={handleChange}
                          color="primary"
                          icon={<StarBorderIcon />}
                          checkedIcon={<StarIcon />}
                        />
                      }
                      label={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body1" fontWeight="500">
                            Responsável Principal
                          </Typography>
                          <Tooltip title="O responsável principal será o contato preferencial para comunicações importantes">
                            <InfoIcon color="action" fontSize="small" />
                          </Tooltip>
                        </Box>
                      }
                    />
                  </Grid>

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
                        disabled={saving || !formData.client_id || !formData.nome || !formData.email || !formData.telefone}
                        sx={{ 
                          fontWeight: 600,
                          minWidth: 200,
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                          }
                        }}
                      >
                        {saving ? 'Registrando...' : 'Registrar Responsável'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          <Card
            sx={{ 
              mt: 3,
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.info.main, 0.02)} 100%)`,
              border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" display="flex" alignItems="center" gap={1}>
                <BusinessIcon color="info" />
                Sobre Responsáveis
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <StarIcon color="warning" fontSize="small" />
                    <Typography variant="subtitle2" fontWeight="bold">
                      Responsável Principal
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Contato preferencial para comunicações importantes e tomada de decisões.
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <PersonIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle2" fontWeight="bold">
                      Múltiplos Responsáveis
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Um cliente pode ter vários responsáveis, mas apenas um principal.
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Tabela de Responsáveis */}
        <Grid item xs={12} lg={6}>
          <Card
            sx={{ 
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={2} mb={3}>
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
                    <BusinessIcon />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Responsáveis Registrados
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {filteredAccountables.length} de {accountables.length} responsáveis
                    </Typography>
                  </Box>
                </Box>
                
                <TextField
                  size="small"
                  placeholder="Pesquisar responsáveis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    minWidth: { xs: '100%', sm: 250 },
                    background: theme.palette.background.default,
                    borderRadius: 2
                  }}
                />
              </Box>

              <Divider sx={{ mb: 3 }} />

              {loading ? (
                <LoadingSkeleton />
              ) : (
                <TableContainer 
                  component={Paper} 
                  elevation={0}
                  sx={{ 
                    maxHeight: isMobile ? '50vh' : '60vh',
                    border: `1px solid ${theme.palette.divider}`,
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
                        <TableCell>Responsável</TableCell>
                        {!isMobile && <TableCell>Contato</TableCell>}
                        <TableCell>Cliente</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell align="center">Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredAccountables.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={isMobile ? 4 : 5} align="center" sx={{ py: 6 }}>
                            <Box sx={{ color: 'text.secondary', mb: 2 }}>
                              <PersonIcon sx={{ fontSize: 48 }} />
                            </Box>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                              {searchTerm ? 'Nenhum responsável encontrado' : 'Nenhum responsável registrado'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {searchTerm ? 'Tente ajustar os termos da pesquisa' : 'Comece registrando um novo responsável'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredAccountables.map((accountable) => (
                          <TableRow 
                            key={accountable._id}
                            sx={{ 
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': { 
                                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                                transform: 'translateX(4px)'
                              }
                            }}
                          >
                            <TableCell>
                              <Box>
                                <Typography variant="subtitle2" fontWeight="600">
                                  {accountable.nome}
                                </Typography>
                                {isMobile && (
                                  <Typography variant="caption" color="text.secondary">
                                    {accountable.email}
                                  </Typography>
                                )}
                              </Box>
                            </TableCell>
                            {!isMobile && (
                              <TableCell>
                                <Box>
                                  <Typography variant="body2">{accountable.email}</Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {formatPhone(accountable.telefone)}
                                  </Typography>
                                </Box>
                              </TableCell>
                            )}
                            <TableCell>
                              <Typography variant="body2" fontWeight="500">
                                {accountable.cliente?.clientName || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {accountable.isPrincipal ? (
                                <Chip 
                                  icon={<StarIcon />}
                                  label="Principal" 
                                  color="warning" 
                                  size="small"
                                  variant="filled"
                                  sx={{ fontWeight: 600 }}
                                />
                              ) : (
                                <Chip 
                                  label="Secundário" 
                                  color="default" 
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <Box display="flex" justifyContent="center" gap={0.5}>
                                <Tooltip title="Editar responsável">
                                  <IconButton
                                    color="primary"
                                    onClick={() => handleEdit(accountable)}
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
                                <Tooltip title="Excluir responsável">
                                  <IconButton
                                    color="error"
                                    onClick={() => handleDelete(accountable)}
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
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>

          {/* Estatísticas Rápidas */}
          <Card
            sx={{ 
              mt: 3,
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.success.main, 0.02)} 100%)`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" display="flex" alignItems="center" gap={1}>
                <BusinessIcon color="success" />
                Estatísticas
              </Typography>
              
              <Grid container spacing={3}>
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
                      {accountables.length}
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
                        background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent'
                      }}
                    >
                      {accountables.filter(a => a.isPrincipal).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Principais
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography 
                      variant="h4" 
                      fontWeight="bold"
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent'
                      }}
                    >
                      {new Set(accountables.map(a => a.client_id)).size}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Clientes
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
                      {Math.round(accountables.filter(a => a.isPrincipal).length / Math.max(accountables.length, 1) * 100)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Com Principal
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
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
            Tem certeza que deseja excluir o responsável{' '}
            <strong>{deleteDialog.accountable?.nome}</strong>?
          </Typography>
          {deleteDialog.accountable && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: alpha(theme.palette.grey[100], 0.5), borderRadius: 1 }}>
              <Typography variant="body2" fontWeight="500">
                <strong>Email:</strong> {deleteDialog.accountable.email}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Telefone:</strong> {formatPhone(deleteDialog.accountable.telefone)}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Cliente:</strong> {deleteDialog.accountable.cliente?.clientName || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Tipo:</strong> {deleteDialog.accountable.isPrincipal ? 'Principal' : 'Secundário'}
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
            Excluir Responsável
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Responsible;