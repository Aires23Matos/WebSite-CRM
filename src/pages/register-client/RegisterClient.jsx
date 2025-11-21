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
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const RegisterClient = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [clients, setClients] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, client: null });

  const [formData, setFormData] = useState({
    clientName: '',
    nif: ''
  });

  const [errors, setErrors] = useState({
    clientName: '',
    nif: ''
  });

  // Carregar lista de clientes
  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/v1/client/clients');
      // Ajuste conforme a estrutura da sua resposta da API
      setClients(response.data.data?.clients || response.data.data || []);
    } catch (err) {
      console.error('Erro ao carregar clientes:', err);
      setError('Erro ao carregar lista de clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const validateForm = () => {
    const newErrors = {
      clientName: '',
      nif: ''
    };

    let isValid = true;

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Nome do cliente é obrigatório';
      isValid = false;
    } else if (formData.clientName.trim().length < 2) {
      newErrors.clientName = 'Nome deve ter pelo menos 2 caracteres';
      isValid = false;
    }
    
    if (!formData.nif) {
      newErrors.nif = 'NIF é obrigatório';
      isValid = false;
    } else if (formData.nif.length > 14 ) {
      newErrors.nif = 'NIF deve ter pelo menos 10 a 14 dígitos';
      isValid = false;
    }
     else if (!/^\d|[A-Za-z0-9]+$/.test(formData.nif)) {
      newErrors.nif = 'NIF deve conter apenas números e letras';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        clientName: formData.clientName.trim(),
        nif: formData.nif
      };

      const response = await axios.post('http://localhost:3000/api/v1/auth/register/client', payload);
      
      setSuccess(response.data.message || 'Cliente criado com sucesso!');
      
      // Limpar formulário e recarregar lista
      setFormData({
        clientName: '',
        nif: ''
      });

      // Recarregar lista de clientes
      fetchClients();

    } catch (err) {
      console.error('Erro ao criar cliente:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.code === 'NETWORK_ERROR') {
        setError('Erro de conexão. Verifique se o servidor está rodando.');
      } else {
        setError('Erro ao criar cliente. Tente novamente.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({
      clientName: '',
      nif: ''
    });
    setErrors({
      clientName: '',
      nif: ''
    });
    setError('');
    setSuccess('');
  };

  const handleEdit = (client) => {
    navigate(`/client/update/${client.client_id}`);
  };

  // const handleDelete = (client) => {
  //   setDeleteDialog({ open: true, client });
  // };

  const confirmDelete = async () => {
    if (!deleteDialog.client) return;

    try {
      const clientId =  deleteDialog.client.client_id;
      await axios.delete(`http://localhost:3000/api/v1/client/delete/${clientId}`);
      setSuccess('Cliente excluído com sucesso!');
      fetchClients(); // Recarregar lista
    } catch (err) {
      console.error('Erro ao excluir cliente:', err);
      setError(err.response?.data?.message || 'Erro ao excluir cliente');
    } finally {
      setDeleteDialog({ open: false, client: null });
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({ open: false, client: null });
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} gap={2} mb={4}>
        <Box display="flex" alignItems="center" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/clients')}
            sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
          >
            Voltar para Lista
          </Button>
          <Typography variant="h4" component="h1" fontWeight="bold" textAlign={{ xs: 'center', sm: 'left' }}>
            Registrar Novo Cliente
          </Typography>
        </Box>
        
        <Box display="flex" gap={1} flexDirection={{ xs: 'column', sm: 'row' }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleReset}
            disabled={saving}
            sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
          >
            Limpar
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Formulário e Informações */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <PersonAddIcon color="primary" />
                <Typography variant="h5" component="h2">
                  Informações Básicas do Cliente
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ mb: 3 }}
                  onClose={() => setError('')}
                >
                  {error}
                </Alert>
              )}

              {success && (
                <Alert 
                  severity="success" 
                  sx={{ mb: 3 }}
                  onClose={() => setSuccess('')}
                >
                  {success}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nome do Cliente *"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleChange}
                      error={!!errors.clientName}
                      helperText={errors.clientName}
                      disabled={saving}
                      placeholder="Digite o nome completo do cliente"
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1, color: 'text.secondary' }}>
                            •
                          </Box>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="NIF *"
                      name="nif"
                      type="text"
                      value={formData.nif}
                      onChange={handleChange}
                      error={!!errors.nif}
                      helperText={errors.nif || "Número de Identificação Fiscal (14 dígitos)"}
                      disabled={saving}
                      placeholder="12345678910"
                      variant="outlined"
                      inputProps={{
                        maxLength: 14,
                        inputMode: 'numeric'
                      }}
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1, color: 'text.secondary' }}>
                            •
                          </Box>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" gap={2} justifyContent="flex-end" flexDirection={{ xs: 'column', sm: 'row' }}>
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() => navigate('/clients')}
                        disabled={saving}
                        sx={{ width: { xs: '100%', sm: 'auto' } }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                        disabled={saving}
                        sx={{ width: { xs: '100%', sm: 'auto' } }}
                      >
                        {saving ? 'Registrando...' : 'Registrar Cliente'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>

          {/* Informações Importantes */}
          <Paper variant="outlined" sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              📋 Informações Importantes
            </Typography>
            
            <Box component="ul" sx={{ pl: 2, '& li': { mb: 1 } }}>
              <Typography component="li" variant="body2">
                <strong>Nome do Cliente:</strong> Use o nome completo ou razão social
              </Typography>
              <Typography component="li" variant="body2">
                <strong>NIF:</strong> Deve conter exatamente 10 a 14 dígitos numéricos
              </Typography>
              <Typography component="li" variant="body2">
                <strong>Campos obrigatórios:</strong> Todos os campos marcados com (*) são de preenchimento obrigatório
              </Typography>
              <Typography component="li" variant="body2">
                <strong>Após o registro:</strong> Você poderá adicionar contactos, endereços, responsáveis e licenças separadamente
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="text.secondary">
              💡 <strong>Dica:</strong> Verifique se os dados estão corretos antes de registrar. 
              O NIF não pode ser alterado posteriormente.
            </Typography>
          </Paper>
        </Grid>

        {/* Tabela de Clientes */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <PersonAddIcon color="primary" />
                <Typography variant="h5">
                  Clientes Registrados
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {loading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nome</TableCell>
                        <TableCell>NIF</TableCell>
                        <TableCell>Data Registro</TableCell>
                        <TableCell align="center">Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {clients.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            Nenhum cliente registrado
                          </TableCell>
                        </TableRow>
                      ) : (
                        clients.map((client) => (
                          <TableRow key={client._id || client.client_id}>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {client.clientName}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {client.nif}
                            </TableCell>
                            <TableCell>
                              {client.createdAt ? new Date(client.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                color="primary"
                                onClick={() => handleEdit(client)}
                                size="small"
                              >
                                <EditIcon />
                              </IconButton>
                           
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

          {/* Quick Actions */}
          <Paper variant="outlined" sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              ⚡ Ações Rápidas
            </Typography>
            
            <Box display="flex" flexDirection="column" gap={1}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/contacts')}
                sx={{ justifyContent: 'flex-start' }}
              >
                📞 Adicionar Contacto
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/address')}
                sx={{ justifyContent: 'flex-start' }}
              >
                📍 Adicionar Endereço
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/responsible')}
                sx={{ justifyContent: 'flex-start' }}
              >
                👤 Adicionar Responsável
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/license')}
                sx={{ justifyContent: 'flex-start' }}
              >
                📄 Adicionar Licença
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={deleteDialog.open} onClose={cancelDelete}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o cliente <strong>{deleteDialog.client?.clientName}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            NIF: {deleteDialog.client?.nif}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RegisterClient;