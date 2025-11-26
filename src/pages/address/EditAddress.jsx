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
  Divider,
  Paper,
  Container,
  useTheme,
  alpha,
  Tooltip,
  Fade,
  InputAdornment,
  Skeleton,
  IconButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Map as MapIcon,
  Place as PlaceIcon,
  Home as HomeIcon,
  Numbers as NumbersIcon,
  Info as InfoIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import CreateClient from '../clients/CreateClient';
import { urlApi } from '../../../public/url/url';
//const url = 'http://localhost:3000';
const url = urlApi;

const EditAddress = () => {
  const navigate = useNavigate();
  const { address_id } = useParams();
  const theme = useTheme();


  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    client_id: '',
    provincia: '',
    municipio: '',
    bairro: '',
    rua_ou_avenida: '',
    numero_da_casa: '',
    ponto_de_referencia: ''
  });

  const [originalData, setOriginalData] = useState({});

  // Carregar dados do endereço
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        console.log('Buscando endereço com ID:', address_id);
        const response = await axios.get(`${url}/api/v1/address/${address_id}`);
        console.log('Resposta da API:', response.data);
        
        const address = response.data.data;
        
        if (!address) {
          throw new Error('Endereço não encontrado');
        }
        
        const addressData = {
          client_id: address.client_id || '',
          provincia: address.provincia || '',
          municipio: address.municipio || '',
          bairro: address.bairro || '',
          rua_ou_avenida: address.rua_ou_avenida || '',
          numero_da_casa: address.numero_da_casa || '',
          ponto_de_referencia: address.ponto_de_referencia || ''
        };
        
        setFormData(addressData);
        setOriginalData(addressData);
      } catch (err) {
        console.error('Erro ao carregar endereço:', err);
        setError(err.response?.data?.message || 'Erro ao carregar dados do endereço');
      } finally {
        setLoading(false);
      }
    };

    if (address_id && address_id !== 'undefined') {
      fetchAddress();
    } else {
      setError('ID do endereço inválido');
      setLoading(false);
    }
  }, [address_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      console.log('Atualizando endereço ID:', address_id);
      const response = await axios.put(`${url}/api/v1/address/${address_id}`, formData);
      setSuccess(response.data.message || 'Endereço atualizado com sucesso!');
      
      // Redirecionar após sucesso
      setTimeout(() => {
        navigate('/address');
      }, 2000);
    } catch (err) {
      console.error('Erro ao atualizar endereço:', err);
      setError(err.response?.data?.message || 'Erro ao atualizar endereço');
    } finally {
      setSaving(false);
    }
  };

  // Verificar se houve alterações
  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  // Loading skeleton
  const LoadingSkeleton = () => (
    <Box>
      <Skeleton variant="rounded" height={56} sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Skeleton variant="rounded" height={400} />
        </Grid>
        <Grid item xs={12} lg={4}>
          <Skeleton variant="rounded" height={300} />
        </Grid>
      </Grid>
    </Box>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
        <LoadingSkeleton />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
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
          <Tooltip title="Voltar para lista de endereços">
            <IconButton
              onClick={() => navigate('/address')}
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
              Editar Endereço
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.9rem', sm: '1.1rem' },
                fontWeight: 400
              }}
            >
              Atualize as informações do endereço
            </Typography>
          </Box>
        </Box>

        {hasChanges && (
          <Fade in={hasChanges}>
            <Alert 
              severity="info" 
              icon={<EditIcon />}
              sx={{ 
                background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
              }}
            >
              <Typography variant="body2" fontWeight="500">
                Alterações não salvas
              </Typography>
            </Alert>
          </Fade>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Formulário Principal */}
        <Grid item xs={12} lg={8}>
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
                    background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}
                >
                  <EditIcon />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Editar Informações do Endereço
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Atualize os dados do endereço conforme necessário
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

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Província"
                      name="provincia"
                      value={formData.provincia}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      placeholder="Ex: Luanda"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MapIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Município"
                      name="municipio"
                      value={formData.municipio}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      placeholder="Ex: Belas"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Bairro"
                      name="bairro"
                      value={formData.bairro}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      placeholder="Ex: Talatona"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PlaceIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Rua/Avenida"
                      name="rua_ou_avenida"
                      value={formData.rua_ou_avenida}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      placeholder="Ex: Avenida 21 de Janeiro"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Número da Casa"
                      name="numero_da_casa"
                      value={formData.numero_da_casa}
                      onChange={handleChange}
                      variant="outlined"
                      placeholder="Ex: 123"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <NumbersIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Ponto de Referência"
                      name="ponto_de_referencia"
                      value={formData.ponto_de_referencia}
                      onChange={handleChange}
                      variant="outlined"
                      placeholder="Ex: Próximo ao mercado"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HomeIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" gap={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() => navigate('/address')}
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
                        disabled={saving || !formData.client_id || !hasChanges}
                        sx={{ 
                          fontWeight: 600,
                          minWidth: 180,
                          background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${theme.palette.warning.dark}, ${theme.palette.warning.main})`,
                          },
                          '&:disabled': {
                            background: theme.palette.grey[300],
                          }
                        }}
                      >
                        {saving ? 'Atualizando...' : 'Atualizar Endereço'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Painel de Informações */}
        <Grid item xs={12} lg={4}>
          <Card
            sx={{ 
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.info.main, 0.02)} 100%)`,
              border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
              position: 'sticky',
              top: 20
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <InfoIcon color="info" />
                <Typography variant="h6" fontWeight="bold" color="info.main">
                  Informações da Edição
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <LocationIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle2" fontWeight="bold">
                      Localização
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Província, município e bairro são essenciais para identificação geográfica.
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <PlaceIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle2" fontWeight="bold">
                      Endereço Específico
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Rua/Avenida e número identificam a localização exata.
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <HomeIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle2" fontWeight="bold">
                      Referência
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Facilita a localização para visitas técnicas e entregas.
                  </Typography>
                </Grid>
              </Grid>

              <Alert 
                severity="warning"
                icon={<WarningIcon />}
                sx={{ 
                  mb: 2,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
                }}
              >
                <Typography variant="body2" fontWeight="500">
                  Alterações no endereço podem afetar visitas técnicas e entregas futuras.
                </Typography>
              </Alert>

              {/* Informações de Debug */}
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  mt: 2,
                  backgroundColor: alpha(theme.palette.grey[100], 0.5),
                  border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`
                }}
              >
                <Typography variant="caption" color="text.secondary" component="div">
                  <strong>ID do endereço:</strong> {address_id}
                </Typography>
                <Typography variant="caption" color="text.secondary" component="div">
                  <strong>Cliente ID:</strong> {formData.client_id || 'Não definido'}
                </Typography>
                <Typography variant="caption" color="text.secondary" component="div">
                  <strong>Alterações:</strong> {hasChanges ? 'Sim' : 'Não'}
                </Typography>
              </Paper>
            </CardContent>
          </Card>

          {/* Preview do Endereço */}
          <Card
            sx={{ 
              mt: 3,
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.success.main, 0.02)} 100%)`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" display="flex" alignItems="center" gap={1}>
                <LocationIcon color="success" />
                Visualização do Endereço
              </Typography>
              
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ p: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Endereço completo:</strong>
                </Typography>
                <Typography variant="body1" sx={{ 
                  p: 2, 
                  backgroundColor: alpha(theme.palette.grey[50], 0.5),
                  borderRadius: 1,
                  border: `1px solid ${alpha(theme.palette.grey[200], 0.5)}`
                }}>
                  {formData.rua_ou_avenida && formData.numero_da_casa ? 
                    `${formData.rua_ou_avenida}, Nº ${formData.numero_da_casa}, ${formData.bairro}, ${formData.municipio}, ${formData.provincia}` :
                    'Preencha os campos para visualizar o endereço'
                  }
                </Typography>
                
                {formData.ponto_de_referencia && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Ponto de referência:</strong> {formData.ponto_de_referencia}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EditAddress;