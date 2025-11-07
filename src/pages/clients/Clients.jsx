import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Chip,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, client: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Fetch clients from API
  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/v1/client/clients');
      setClients(response.data.data.clients || []);
      setError('');
    } catch (err) {
      console.error('Erro ao carregar clientes:', err);
      setError('Erro ao carregar lista de clientes');
      showSnackbar('Erro ao carregar clientes', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Delete client function
  const deleteClient = async (clientId) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/client/delete/${clientId}`);
      setClients(clients.filter(client => client.client_id !== clientId));
      showSnackbar('Cliente deletado com sucesso', 'success');
      setDeleteDialog({ open: false, client: null });
    } catch (err) {
      console.error('Erro ao deletar cliente:', err);
      showSnackbar('Erro ao deletar cliente', 'error');
    }
  };

  // Navigate functions
  const editClient = (clientId) => {
    navigate(`/client/update/${clientId}`);
  };

  const viewClient = (clientId) => {
    navigate(`/client/getById/${clientId}`);
  };

  const createClient = () => {
    navigate('/register-client');
  };

  // Helper functions
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const confirmDelete = (client) => {
    setDeleteDialog({ open: true, client });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, client: null });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Mobile Card Component
  const ClientCard = ({ client }) => (
    <Card sx={{ mb: 2, p: 2 }}>
      <Box display="flex" justifyContent="between" alignItems="start" mb={2}>
        <Box flex={1}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {client.clientName}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            NIF: {client.nif}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ID: {client.client_id}
          </Typography>
        </Box>
        <Chip 
          label={`${client.contact?.length || 0} contatos`} 
          size="small" 
          color="primary" 
          variant="outlined" 
        />
      </Box>

      <Grid container spacing={1} mb={2}>
        <Grid item xs={6}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <LocationIcon fontSize="small" color="action" />
            <Typography variant="caption">
              {client.address?.length || 0} end.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="caption">
              {client.accountable?.length || 0} resp.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <EmailIcon fontSize="small" color="action" />
            <Typography variant="caption">
              {client.licenseData?.length || 0} lic.
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Typography variant="caption" color="text.secondary" display="block" mb={2}>
        Criado em: {formatDate(client.publishedAt)}
      </Typography>

      <Box display="flex" justifyContent="space-between">
        <IconButton
          size="small"
          onClick={() => viewClient(client.client_id)}
          color="primary"
        >
          <ViewIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => editClient(client.client_id)}
          color="secondary"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => confirmDelete(client.client_id)}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography variant="h6">Carregando clientes...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={fetchClients}
            startIcon={<RefreshIcon />}
            sx={{ mt: 2 }}
          >
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="between" alignItems={{ xs: 'stretch', sm: 'center' }} gap={2} mb={4}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" color="gray.800" gutterBottom={isMobile}>
            Gestão de Clientes
          </Typography>
          <Typography variant="subtitle1" color="gray.600">
            Total de {clients.length} cliente(s) cadastrado(s)
          </Typography>
        </Box>
        <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchClients}
            fullWidth={isMobile}
          >
            Atualizar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={createClient}
            fullWidth={isMobile}
            sx={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)'
              }
            }}
          >
            Novo Cliente
          </Button>
        </Box>
      </Box>

      {/* Clients List */}
      {isMobile ? (
        // Mobile View - Cards
        <Box>
          {clients.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="gray.500">
                  Nenhum cliente encontrado
                </Typography>
              </CardContent>
            </Card>
          ) : (
            clients.map((client) => (
              <ClientCard key={client.client_id} client={client} />
            ))
          )}
        </Box>
      ) : (
        // Desktop View - Table
        <Card>
          <CardContent>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Cliente</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>NIF</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Contactos</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Endereços</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Licenças</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Data de Criação</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#374151', textAlign: 'center' }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography variant="h6" color="gray.500">
                          Nenhum cliente encontrado
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    clients.map((client) => (
                      <TableRow 
                        key={client.client_id}
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: '#f8fafc' 
                          } 
                        }}
                      >
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {client.clientName}
                            </Typography>
                            <Typography variant="caption" color="gray.600">
                              ID: {client.client_id}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{client.nif}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${client.contact?.length || 0} contatos`}
                            color="primary"
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${client.address?.length || 0} endereços`}
                            color="secondary"
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${client.licenseData?.length || 0} licenças`}
                            color="success"
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(client.publishedAt)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" justifyContent="center" gap={1}>
                            <IconButton
                              size="small"
                              onClick={() => viewClient(client.client_id)}
                              sx={{ 
                                color: '#3B82F6',
                                '&:hover': { 
                                  backgroundColor: '#DBEAFE' 
                                } 
                              }}
                            >
                              <ViewIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => editClient(client.client_id)}
                              sx={{ 
                                color: '#10B981',
                                '&:hover': { 
                                  backgroundColor: '#D1FAE5' 
                                } 
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => confirmDelete(client)}
                              sx={{ 
                                color: '#EF4444',
                                '&:hover': { 
                                  backgroundColor: '#FEE2E2' 
                                } 
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja excluir o cliente <strong>{deleteDialog.client?.clientName}</strong>?
            <br />
            <span style={{ color: '#EF4444', fontSize: '14px' }}>
              Esta ação não pode ser desfeita e excluirá todos os dados associados.
            </span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancelar</Button>
          <Button 
            onClick={() => deleteClient(deleteDialog.client?.client_id)} 
            color="error"
            variant="contained"
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
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Clients;