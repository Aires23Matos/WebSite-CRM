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
  Divider,
  Paper
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  ContactPhone as ContactIcon
} from '@mui/icons-material';
import CreateClient from '../clients/CreateClient';
import { urlApi } from '../../../public/url/url';
// const url = 'http://localhost:3000'

const url = urlApi;

const EditContact = () => {
  const navigate = useNavigate();
  const { contact_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentClient, setCurrentClient] = useState(null);

  const [formData, setFormData] = useState({
    client_id: '',
    email: '',
    telefone: '',
    isPrincipal: false
  });

  // Carregar dados do contacto
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await axios.get(`${url}/api/v1/contact/${contact_id}`);
        const contact = response.data.data;
        
        console.log('Dados do contacto:', contact);
        
        setFormData({
          client_id: contact.client_id || '',
          email: contact.email || '',
          telefone: contact.telefone || '',
          isPrincipal: contact.isPrincipal || false
        });

        // Se o contacto tiver informações do cliente, definir o cliente atual
        if (contact.client_id) {
          setCurrentClient({
            client_id: contact.client_id,
            clientName: contact.cliente?.clientName || 'Cliente não encontrado'
          });
        }
      } catch (err) {
        console.error('Erro ao carregar contacto:', err);
        setError('Erro ao carregar dados do contacto');
      } finally {
        setLoading(false);
      }
    };

    if (contact_id) {
      fetchContact();
    }
  }, [contact_id]);

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
    setCurrentClient(client);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.put(`${url}/api/v1/contact/contacts/${contact_id}`, formData);
      setSuccess(response.data.message || 'Contacto atualizado com sucesso!');
      
      // Redirecionar após sucesso
      setTimeout(() => {
        navigate('/contacts');
      }, 2000);
    } catch (err) {
      console.error('Erro ao atualizar contacto:', err);
      setError(err.response?.data?.message || 'Erro ao atualizar contacto');
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
            onClick={() => navigate('/contacts')}
          >
            Voltar
          </Button>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Editar Contacto
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <ContactIcon color="primary" />
                <Typography variant="h5">
                  Editar Informações do Contacto
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

              {/* Mostrar cliente atual */}
              {currentClient && (
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    mb: 3, 
                    backgroundColor: 'primary.light',
                    borderColor: 'primary.main'
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold" color="primary.dark" gutterBottom>
                    📋 Cliente Atual
                  </Typography>
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {currentClient.clientName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ID: {currentClient.client_id}
                    </Typography>
                  </Box>
                </Paper>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom color="primary">
                      Alterar Cliente (Opcional)
                    </Typography>
                    <CreateClient
                      value={formData.client_id}
                      onChange={handleClientChange}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Deixe em branco para manter o cliente atual
                    </Typography>
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
                      placeholder="exemplo@email.com"
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
                      placeholder="9XX XXX XXX"
                      inputProps={{
                        maxLength: 9
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
                        />
                      }
                      label="Contacto Principal"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" gap={2} justifyContent="flex-end">
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() => navigate('/contacts')}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                        disabled={saving}
                      >
                        {saving ? 'Atualizando...' : 'Atualizar Contacto'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4} lg={6}>
          <Paper variant="outlined" sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom color="primary">
              💡 Informações da Edição
            </Typography>
            
            <Box component="ul" sx={{ pl: 2, '& li': { mb: 1 } }}>
              <Typography component="li" variant="body2">
                <strong>Cliente Atual:</strong> O contacto está associado ao cliente mostrado acima
              </Typography>
              <Typography component="li" variant="body2">
                <strong>Alterar Cliente:</strong> Selecione um novo cliente na lista suspensa
              </Typography>
              <Typography component="li" variant="body2">
                <strong>Contacto Principal:</strong> Apenas um contacto pode ser principal por cliente
              </Typography>
              <Typography component="li" variant="body2">
                <strong>Email:</strong> Será usado para comunicações importantes
              </Typography>
              <Typography component="li" variant="body2">
                <strong>Telefone:</strong> Número de contacto direto
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ backgroundColor: 'warning.light', p: 2, borderRadius: 1 }}>
              <Typography variant="body2" color="warning.dark" fontWeight="bold">
                ⚠️ Atenção:
              </Typography>
              <Typography variant="body2" color="warning.dark">
                Alterar o contacto principal pode afetar as comunicações automáticas do sistema.
              </Typography>
            </Box>

            {/* Informações do Contacto */}
            <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom color="primary">
                Informações do Contacto
              </Typography>
              <Typography variant="body2">
                <strong>ID do Contacto:</strong> {contact_id}
              </Typography>
              <Typography variant="body2">
                <strong>Email atual:</strong> {formData.email}
              </Typography>
              <Typography variant="body2">
                <strong>Telefone atual:</strong> {formData.telefone}
              </Typography>
              <Typography variant="body2">
                <strong>Status:</strong> {formData.isPrincipal ? 'Principal' : 'Secundário'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default EditContact;