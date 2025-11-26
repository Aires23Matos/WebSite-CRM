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
  Chip,
  Container,
  useTheme,
  useMediaQuery,
  alpha,
  Tooltip,
  Fade,
  LinearProgress,
  Skeleton,
  InputAdornment
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  ContactPhone as ContactIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import CreateClient from '../clients/CreateClient';
import { urlApi } from '../../../public/url/url';

// const url = 'http://localhost:300'

const url = urlApi;

const Contacts = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));


  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [_, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [contacts, setContacts] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, contact: null });
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    client_id: '',
    email: '',
    telefone: '',
    isPrincipal: false
  });

  // Carregar lista de contactos
  const fetchContacts = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const response = await axios.get(`${url}/api/v1/contact/contacts`);
      console.log('Resposta completa da API:', response.data);
      
      const contactsData = response.data.data?.contacts || response.data.data || [];
      setContacts(contactsData);
      setError('');
    } catch (err) {
      console.error('Erro ao carregar contactos:', err);
      setError('Erro ao carregar lista de contactos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchContacts();
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
    if (!formData.email && !formData.telefone) {
      setError('Pelo menos um contacto (email ou telefone) deve ser fornecido');
      setSaving(false);
      return;
    }

    try {
      const response = await axios.post(`${url}/api/v1/contact/register`, formData);
      setSuccess(response.data.message || 'Contacto criado com sucesso!');
      
      // Limpar formulário e recarregar lista
      setFormData({
        client_id: '',
        email: '',
        telefone: '',
        isPrincipal: false
      });
      
      fetchContacts();
    } catch (err) {
      console.error('Erro ao criar contacto:', err);
      setError(err.response?.data?.message || 'Erro ao criar contacto');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (contact) => {
    if (contact.id) {
      navigate(`/contacts/${contact.id}`);
    } else {
      setError('Não foi possível encontrar o ID do contacto para edição');
    }
  };

  const handleDelete = (contact) => {
    setDeleteDialog({ open: true, contact });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.contact) return;

    try {
      const contactId = deleteDialog.contact.id;
      await axios.delete(`${url}/api/v1/contact/contacts/${contactId}`);
      setSuccess('Contacto excluído com sucesso!');
      fetchContacts();
    } catch (err) {
      console.error('Erro ao excluir contacto:', err);
      setError(err.response?.data?.message || 'Erro ao excluir contacto');
    } finally {
      setDeleteDialog({ open: false, contact: null });
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({ open: false, contact: null });
  };

  // Função para formatar telefone
  const formatPhone = (phone) => {
    if (!phone) return 'N/A';
    // Formatação para telefone angolano: +244 XXX XXX XXX
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 9) {
      return `+244 ${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
    }
    return phone;
  };

  // Filtrar contactos baseado na pesquisa
  const filteredContacts = contacts.filter(contact =>
    contact.cliente?.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.telefone?.includes(searchTerm)
  );

  // Loading skeleton
  const LoadingSkeleton = () => (
    <Box>
      <Skeleton variant="rounded" height={56} sx={{ mb: 2 }} />
      <Skeleton variant="rounded" height={400} />
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
              Gestão de Contactos
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.9rem', sm: '1.1rem' },
                fontWeight: 400
              }}
            >
              Gerencie os contactos dos seus clientes
            </Typography>
          </Box>
        </Box>
      </Box>

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
                  <ContactIcon />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Registrar Novo Contacto
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Adicione um novo contacto ao cliente
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
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      variant="outlined"
                      placeholder="exemplo@email.com"
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
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      variant="outlined"
                      placeholder="9XX XXX XXX"
                      inputProps={{
                        maxLength: 9,
                        pattern: '[0-9]{9}'
                      }}
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
                          <Typography variant="body2" fontWeight="500">
                            Contacto Principal
                          </Typography>
                          <Chip 
                            label="Prioritário" 
                            size="small" 
                            color="warning"
                            variant="outlined"
                          />
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
                        disabled={saving || !formData.client_id || (!formData.email && !formData.telefone)}
                        sx={{ 
                          fontWeight: 600,
                          minWidth: 180,
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                          }
                        }}
                      >
                        {saving ? 'Registrando...' : 'Registrar Contacto'}
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
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <ContactIcon color="info" />
                <Typography variant="h6" fontWeight="bold" color="info.main">
                  Informações Importantes
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <StarIcon color="warning" fontSize="small" />
                    <Typography variant="subtitle2" fontWeight="bold">
                      Contacto Principal
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Será usado como contacto preferencial para comunicações importantes.
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <EmailIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle2" fontWeight="bold">
                      Email
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Deve ser um endereço de email válido para comunicações.
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <PhoneIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle2" fontWeight="bold">
                      Telefone
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Número de 9 dígitos no formato angolano.
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <PersonIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle2" fontWeight="bold">
                      Cliente
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Seleccione o cliente ao qual o contacto pertence.
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Tabela de Contactos */}
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
                    <ContactIcon />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Contactos Registrados
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {filteredContacts.length} de {contacts.length} contactos
                    </Typography>
                  </Box>
                </Box>
                
                <TextField
                  size="small"
                  placeholder="Pesquisar contactos..."
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
                        <TableCell>Cliente</TableCell>
                        {!isMobile && <TableCell>Email</TableCell>}
                        <TableCell>Telefone</TableCell>
                        <TableCell>Principal</TableCell>
                        <TableCell align="center">Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredContacts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={isMobile ? 4 : 5} align="center" sx={{ py: 6 }}>
                            <Box sx={{ color: 'text.secondary', mb: 2 }}>
                              <ContactIcon sx={{ fontSize: 48 }} />
                            </Box>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                              {searchTerm ? 'Nenhum contacto encontrado' : 'Nenhum contacto registrado'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {searchTerm ? 'Tente ajustar os termos da pesquisa' : 'Comece registrando um novo contacto'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredContacts.map((contact) => (
                          <TableRow 
                            key={contact.id}
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
                                {contact.cliente?.clientName || contact.client_id || 'N/A'}
                              </Typography>
                              {isMobile && contact.email && (
                                <Typography variant="caption" color="text.secondary">
                                  {contact.email}
                                </Typography>
                              )}
                            </TableCell>
                            {!isMobile && (
                              <TableCell>
                                <Typography variant="body2">
                                  {contact.email || 'N/A'}
                                </Typography>
                              </TableCell>
                            )}
                            <TableCell>
                              <Typography variant="body2" fontWeight="500">
                                {formatPhone(contact.telefone)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {contact.isPrincipal ? (
                                <Chip 
                                  icon={<StarIcon />}
                                  label="Principal" 
                                  color="warning" 
                                  size="small"
                                  variant="filled"
                                  sx={{ 
                                    fontWeight: 600,
                                    background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`
                                  }}
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
                                <Tooltip title="Editar contacto">
                                  <IconButton
                                    color="primary"
                                    onClick={() => handleEdit(contact)}
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
                                <Tooltip title="Excluir contacto">
                                  <IconButton
                                    color="error"
                                    onClick={() => handleDelete(contact)}
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
                <ContactIcon color="success" />
                Estatísticas de Contactos
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
                      {contacts.length}
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
                      {contacts.filter(c => c.isPrincipal).length}
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
                      {new Set(contacts.map(c => c.client_id)).size}
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
                      {contacts.filter(c => c.email).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Com Email
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
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          <Box display="flex" alignItems="center" gap={1}>
            <WarningIcon color="error" />
            Confirmar Exclusão
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o contacto de <strong>{deleteDialog.contact?.email || 'N/A'}</strong>?
          </Typography>
          {deleteDialog.contact && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: alpha(theme.palette.grey[100], 0.5), borderRadius: 1 }}>
              <Typography variant="body2" fontWeight="500">
                <strong>Cliente:</strong> {deleteDialog.contact.cliente?.clientName || deleteDialog.contact.client_id}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Telefone:</strong> {formatPhone(deleteDialog.contact.telefone)}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Tipo:</strong> {deleteDialog.contact.isPrincipal ? 'Principal' : 'Secundário'}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                <strong>ID:</strong> {deleteDialog.contact.id}
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
            Excluir Contacto
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Contacts;