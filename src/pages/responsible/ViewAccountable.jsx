// pages/accountables/ViewAccountable.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardContent,
  Button,
  Box,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Paper
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { urlApi } from '../../../public/url/url';

// const url = 'http://localhost:3000'

const url = urlApi;

const ViewAccountable = () => {
  const { accountable_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accountable, setAccountable] = useState(null);
  const [client, setClient] = useState(null);

  useEffect(() => {
    fetchAccountable();
  }, [accountable_id]);

  const fetchAccountable = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/v1/accountable/${accountable_id}`);
      setAccountable(response.data.data);
      
      // Buscar informações do cliente se necessário
      if (response.data.data.client_id) {
        fetchClientInfo(response.data.data.client_id);
      }
    } catch (err) {
      console.error('Erro:', err);
      setError('Erro ao carregar dados do responsável');
    } finally {
      setLoading(false);
    }
  };

  const fetchClientInfo = async (clientId) => {
    try {
      const response = await axios.get(`${url}/api/v1/client/getById/${clientId}`);
      setClient(response.data.data);
    } catch (err) {
      console.error('Erro ao carregar dados do cliente:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este responsável?')) {
      try {
        await axios.delete(`${url}/api/v1/accountable/${accountable_id}`);
        navigate('/clients');
      } catch (err) {
        setError('Erro ao excluir responsável');
        console.error('Erro:', err);
      }
    }
  };

  const handleEdit = () => {
    navigate(`/edit-accountable/${accountable_id}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!accountable) {
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        Responsável não encontrado
      </Alert>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Voltar
          </Button>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Detalhes do Responsável
          </Typography>
        </Box>
        
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Editar
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Excluir
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Informações do Responsável */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <PersonIcon color="primary" />
                <Typography variant="h5">
                  Informações do Responsável
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Nome Completo
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {accountable.nome}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <EmailIcon color="action" />
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                  </Box>
                  <Typography variant="body1">
                    {accountable.email}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <PhoneIcon color="action" />
                    <Typography variant="body2" color="text.secondary">Telefone</Typography>
                  </Box>
                  <Typography variant="body1">
                    {accountable.telefone}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Status
                  </Typography>
                  <Chip 
                    label={accountable.isPrincipal ? "Responsável Principal" : "Responsável Secundário"} 
                    color={accountable.isPrincipal ? "primary" : "default"}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Data de Registro
                  </Typography>
                  <Typography variant="body1">
                    {new Date(accountable.publishedAt).toLocaleDateString('pt-BR')}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Informações do Cliente */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                📋 Cliente Associado
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {client ? (
                <Box>
                  <Typography variant="body1" fontWeight="bold" gutterBottom>
                    {client.clientName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    NIF: {client.nif}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    ID: {client.client_id}
                  </Typography>
                  
                  <Box mt={2}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/view-client/${client._id}`)}
                      fullWidth
                    >
                      Ver Detalhes do Cliente
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Carregando informações do cliente...
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                ⚡ Ações Rápidas
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box display="flex" flexDirection="column" gap={1}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleEdit}
                  startIcon={<EditIcon />}
                >
                  Editar Responsável
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  onClick={handleDelete}
                  startIcon={<DeleteIcon />}
                >
                  Excluir Responsável
                </Button>
                {client && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/view-client/${client._id}`)}
                  >
                    Ver Cliente
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default ViewAccountable;