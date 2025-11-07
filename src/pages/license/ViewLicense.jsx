// pages/licenses/ViewLicense.js
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
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CardMembership as LicenseIcon
} from '@mui/icons-material';

const ViewLicense = () => {
  const { license_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [license, setLicense] = useState(null);

  useEffect(() => {
    fetchLicense();
  }, [license_id]);

  const fetchLicense = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/v1/licenses/${license_id}`);
      setLicense(response.data.data);
    } catch (err) {
      setError('Erro ao carregar dados da licença');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir esta licença?')) {
      try {
        await axios.delete(`http://localhost:3000/api/v1/licenses/${license_id}`);
        navigate('/clients');
      } catch (err) {
        setError('Erro ao excluir licença');
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

  if (!license) {
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        Licença não encontrada
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
            Detalhes da Licença
          </Typography>
        </Box>
        
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/edit-license/${license_id}`)}
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
                <LicenseIcon color="primary" />
                <Typography variant="h6">Informações da Licença</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Número da Licença</Typography>
                  <Typography variant="body1" fontWeight="bold">{license.numeroLicenca}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Técnico</Typography>
                  <Typography variant="body1">{license.tecnico}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Data de Instalação</Typography>
                  <Typography variant="body1">
                    {new Date(license.data_da_instalacao).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Data de Ativação</Typography>
                  <Typography variant="body1">
                    {new Date(license.data_da_ativacao).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Data de Expiração</Typography>
                  <Typography variant="body1">
                    {new Date(license.data_da_expiracao).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Estado</Typography>
                  <Chip 
                    label={license.estado} 
                    color={
                      license.estado === 'ativa' ? 'success' : 
                      license.estado === 'expirada' ? 'error' : 'default'
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Valor Pago</Typography>
                  <Typography variant="body1">{license.valor_pago} €</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Cliente</Typography>
                  <Typography variant="body1">{license.client_id}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default ViewLicense;