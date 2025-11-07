// pages/addresses/ViewAddress.js
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
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

const ViewAddress = () => {
  const { address_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [address, setAddress] = useState(null);

  useEffect(() => {
    fetchAddress();
  }, [address_id]);

  const fetchAddress = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/v1/address/${address_id}`);
      setAddress(response.data.data);
    } catch (err) {
      setError('Erro ao carregar dados do endereço');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este endereço?')) {
      try {
        await axios.delete(`http://localhost:3000/api/v1/address/${address_id}`);
        navigate('/clients');
      } catch (err) {
        setError('Erro ao excluir endereço');
      }
    }
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

  if (!address) {
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        Endereço não encontrado
      </Alert>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <Box display="flex" justifyContent="between" alignItems="center" mb={4}>
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Voltar
          </Button>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Detalhes do Endereço
          </Typography>
        </Box>
        
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/edit-address/${address_id}`)}
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
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <LocationIcon color="primary" />
                <Typography variant="h6">Informações do Endereço</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Província</Typography>
                  <Typography variant="body1">{address.provincia}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Município</Typography>
                  <Typography variant="body1">{address.municipio}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Bairro</Typography>
                  <Typography variant="body1">{address.bairro}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Rua/Avenida</Typography>
                  <Typography variant="body1">{address.rua_ou_avenida}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Número da Casa</Typography>
                  <Typography variant="body1">{address.numero_da_casa || 'Não informado'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Ponto de Referência</Typography>
                  <Typography variant="body1">{address.ponto_de_referencia || 'Não informado'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Cliente</Typography>
                  <Typography variant="body1">{address.client_id}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default ViewAddress;