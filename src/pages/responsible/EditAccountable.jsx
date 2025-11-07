import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import CreateClient from "../clients/CreateClient";

const EditAccountable = () => {
  const navigate = useNavigate();
  const { accountable_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    client_id: '',
    nome: '',
    email: '',
    telefone: '',
    isPrincipal: false
  });

  // Carregar dados do responsável
  useEffect(() => {
    const fetchAccountable = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/accountable/${accountable_id}`);
        // CORREÇÃO: Acessar a propriedade correta da resposta
        const accountable = response.data.data;
        
        setFormData({
          client_id: accountable.client_id || '',
          nome: accountable.nome || '',
          email: accountable.email || '',
          telefone: accountable.telefone || '',
          isPrincipal: accountable.isPrincipal || false
        });
      } catch (err) {
        console.error('Erro ao carregar responsável:', err);
        setError('Erro ao carregar dados do responsável');
      } finally {
        setLoading(false);
      }
    };

    if (accountable_id) {
      fetchAccountable();
    }
  }, [accountable_id]);

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

    try {
      // CORREÇÃO: Usar _id na URL
      const response = await axios.put(`http://localhost:3000/api/v1/accountable/${accountable_id}`, formData);
      setSuccess(response.data.message || 'Responsável atualizado com sucesso!');
      
      // Redirecionar após sucesso
      setTimeout(() => {
        navigate('/responsible');
      }, 2000);
    } catch (err) {
      console.error('Erro ao atualizar responsável:', err);
      setError(err.response?.data?.message || 'Erro ao atualizar responsável');
    } finally {
      setSaving(false);
    }

     
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <Box display="flex" justifyContent="between" alignItems="center" mb={4}>
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/register-accountable')}
          >
            Voltar
          </Button>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Editar Responsável
          </Typography>
        </Box>
      </Box>

      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <PersonIcon color="primary" />
            <Typography variant="h5">
              Editar Informações do Responsável
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
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
                    />
                  }
                  label="Responsável Principal"
                />
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => navigate('/responsible')}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={saving || !formData.client_id}
                  >
                    {saving ? 'Atualizando...' : 'Atualizar Responsável'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditAccountable;