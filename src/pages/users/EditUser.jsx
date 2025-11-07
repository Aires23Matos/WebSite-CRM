import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  useMediaQuery,
  useTheme,
  Paper
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: 'user'
  });

  const [originalData, setOriginalData] = useState({});

  // Função para debug do token - CORRIGIDA
  const debugToken = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      console.log('❌ Nenhum token encontrado');
      return null;
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('🔐 TOKEN DEBUG:');
      console.log('📋 Payload completo:', payload);
      console.log('👤 userId (do token):', payload.userId);
      console.log('🎯 ID da URL:', id);
      console.log('❓ IDs coincidem?', payload.userId === id);
      
      return payload;
    } catch (err) {
      console.log('❌ Erro ao decodificar token:', err);
      return null;
    }
  };

  // Efeito para resetar estado quando o ID mudar
  useEffect(() => {
    setUser(null);
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      role: 'user'
    });
    setOriginalData({});
    setError('');
    setSuccess('');
    setLoading(true);
    
    // Debug do token
    debugToken();
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;

      try {
        setLoading(true);
        
        const timestamp = new Date().getTime();
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        console.log(`🔍 Buscando usuário ID: ${id}`);

        const response = await axios.get(
          `http://localhost:3000/api/v1/users/${id}?t=${timestamp}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Cache-Control': 'no-cache'
            }
          }
        );
        
        const userData = response.data.user;
        console.log('📥 Dados recebidos do usuário:', userData);

        setUser(userData);
        const initialFormData = {
          first_name: userData.firstName || '',
          last_name: userData.lastName || '',
          email: userData.email || '',
          role: userData.role || 'user'
        };
        setFormData(initialFormData);
        setOriginalData(initialFormData);
        setError('');
      } catch (err) {
        console.error('❌ Erro ao carregar usuário:', err);
        setError(err.response?.data?.message || 'Erro ao carregar dados do usuário');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para criar payload apenas com campos modificados
  const createUpdatePayload = () => {
    const payload = {};
    
    if (formData.first_name !== originalData.first_name) {
      payload.first_name = formData.first_name;
    }
    if (formData.last_name !== originalData.last_name) {
      payload.last_name = formData.last_name;
    }
    if (formData.email !== originalData.email) {
      payload.email = formData.email;
    }
    if (formData.role !== originalData.role) {
      payload.role = formData.role;
    }
    
    return payload;
  };

  // Verifica se há alterações nos dados
  const hasChanges = () => {
    return formData.first_name !== originalData.first_name ||
           formData.last_name !== originalData.last_name ||
           formData.email !== originalData.email ||
           formData.role !== originalData.role;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updatePayload = createUpdatePayload();
      
      if (Object.keys(updatePayload).length === 0) {
        setError('Nenhuma alteração foi feita');
        setSaving(false);
        return;
      }

      console.log('📤 Enviando atualização para usuário ID:', id);
      console.log('📦 Payload:', updatePayload);

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      // DEBUG: Verificar token antes de enviar
      const tokenData = debugToken();
      if (tokenData) {
        console.log('⚠️ ATENÇÃO: Token userId:', tokenData.userId, 'vs URL id:', id);
        console.log('⚠️ Se forem diferentes, o problema está no backend usando userId do token');
      }

      const response = await axios.put(
        `http://localhost:3000/api/v1/users/update/${id}`,
        updatePayload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Resposta da API:', response.data);

      setSuccess('Usuário atualizado com sucesso!');
      
      if (response.data.user) {
        const updatedUser = response.data.user;
        const newOriginalData = {
          first_name: updatedUser.firstName || '',
          last_name: updatedUser.lastName || '',
          email: updatedUser.email || '',
          role: updatedUser.role || 'user'
        };
        setOriginalData(newOriginalData);
      }
      
      setTimeout(() => {
        navigate('/users');
      }, 2000);
    } catch (err) {
      console.error('❌ Erro ao atualizar usuário:', err);
      
      let errorMessage = 'Erro ao atualizar usuário';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }
      
      if (err.response?.status === 403 || err.response?.status === 401) {
        errorMessage = 'Você não tem permissão para editar este usuário';
      }
      
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // ... resto do componente (loading, error, return) mantém igual
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Box textAlign="center">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            Carregando dados do usuário...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error && !user) {
    return (
      <Box className="p-4 md:p-6">
        <Card className="shadow-lg border-0 rounded-2xl">
          <CardContent className="text-center p-8">
            <Alert severity="error" className="mb-4 rounded-lg">
              {error}
            </Alert>
            <Button 
              variant="contained" 
              onClick={() => navigate('/users')}
              startIcon={<ArrowBackIcon />}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
              size={isMobile ? "medium" : "large"}
            >
              Voltar para Lista
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <Box display="flex" flexDirection={isMobile ? "column" : "row"} justifyContent="space-between" alignItems={isMobile ? "stretch" : "center"} gap={3} className="mb-6 md:mb-8">
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/users')}
            className="border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600"
            size={isMobile ? "medium" : "large"}
          >
            {isSmallMobile ? 'Voltar' : 'Voltar para Lista'}
          </Button>
          <Typography variant={isMobile ? "h5" : "h4"} component="h1" fontWeight="bold" className="text-gray-800">
            Editar Usuário
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          {hasChanges() && (
            <Paper className="px-3 py-1 rounded-lg bg-blue-50 border border-blue-200">
              <Typography variant="caption" className="text-blue-600 font-medium">
                Alterações pendentes
              </Typography>
            </Paper>
          )}
          <Paper variant="outlined" className="px-4 py-2 rounded-lg bg-white">
            <Typography variant="caption" className="text-gray-600 font-mono" sx={{ fontSize: isMobile ? '0.7rem' : '0.8rem' }}>
              ID: {user?._id?.substring(0, 8)}...
            </Typography>
          </Paper>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Form Card */}
        <Grid item xs={12} lg={8}>
          <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <Box display="flex" alignItems="center" gap={2} className="mb-6">
                <Box className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <PersonIcon className="text-blue-600 text-2xl" />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight="bold" className="text-gray-800">
                    Informações do Usuário
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Atualize os dados do usuário abaixo
                  </Typography>
                </Box>
              </Box>
              
              <Divider className="mb-6" />

              {error && (
                <Alert severity="error" className="mb-6 rounded-lg border-l-4 border-red-500">
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" className="mb-6 rounded-lg border-l-4 border-green-500">
                  {success}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Primeiro Nome"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      variant="outlined"
                      size={isMobile ? "small" : "medium"}
                      className="bg-white"
                      helperText="Opcional"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Sobrenome"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      variant="outlined"
                      size={isMobile ? "small" : "medium"}
                      className="bg-white"
                      helperText="Opcional"
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
                      size={isMobile ? "small" : "medium"}
                      className="bg-white"
                      helperText="Opcional"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Tipo de Usuário"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      variant="outlined"
                      size={isMobile ? "small" : "medium"}
                      className="bg-white"
                    >
                      <MenuItem value="user">👤 Usuário</MenuItem>
                      <MenuItem value="admin">👑 Administrador</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={2} justifyContent="flex-end" className="pt-4">
                      <Button
                        variant="outlined"
                        onClick={() => navigate('/users')}
                        disabled={saving}
                        fullWidth={isMobile}
                        size={isMobile ? "medium" : "large"}
                        className="border-gray-300 text-gray-700 hover:border-gray-400"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        disabled={saving || !hasChanges()}
                        fullWidth={isMobile}
                        size={isMobile ? "medium" : "large"}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg disabled:opacity-50"
                      >
                        {saving ? 'Salvando...' : 'Salvar Alterações'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Info Sidebar */}
        <Grid item xs={12} lg={4}>
          <Card className="shadow-xl border-0 rounded-2xl overflow-hidden h-full">
            <CardContent className="p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 h-full">
              <Box display="flex" alignItems="center" gap={2} className="mb-4">
                <InfoIcon className="text-blue-600" />
                <Typography variant="h6" fontWeight="bold" className="text-gray-800">
                  Informações do Sistema
                </Typography>
              </Box>
              <Divider className="mb-4" />
              
              <Box className="space-y-4">
                <Box className="bg-white p-4 rounded-lg border border-gray-200">
                  <Typography variant="caption" className="text-gray-500 font-medium block mb-1">
                    👤 Username
                  </Typography>
                  <Typography variant="body2" fontWeight="medium" className="text-gray-800">
                    {user?.username || 'N/A'}
                  </Typography>
                </Box>

                <Box className="bg-white p-4 rounded-lg border border-gray-200">
                  <Typography variant="caption" className="text-gray-500 font-medium block mb-1">
                    📧 Email Atual
                  </Typography>
                  <Typography variant="body2" fontWeight="medium" className="text-gray-800">
                    {user?.email || 'N/A'}
                  </Typography>
                </Box>

                <Box className="bg-white p-4 rounded-lg border border-gray-200">
                  <Typography variant="caption" className="text-gray-500 font-medium block mb-1">
                    👑 Tipo de Usuário
                  </Typography>
                  <Typography variant="body2" fontWeight="medium" className="text-gray-800">
                    {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
                  </Typography>
                </Box>

                <Box className="bg-white p-4 rounded-lg border border-gray-200">
                  <Typography variant="caption" className="text-gray-500 font-medium block mb-1">
                    📅 Data de Criação
                  </Typography>
                  <Typography variant="body2" fontWeight="medium" className="text-gray-800">
                    {user && user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
                  </Typography>
                </Box>

                <Box className="bg-white p-4 rounded-lg border border-gray-200">
                  <Typography variant="caption" className="text-gray-500 font-medium block mb-1">
                    🔄 Última Atualização
                  </Typography>
                  <Typography variant="body2" fontWeight="medium" className="text-gray-800">
                    {user && user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('pt-BR') : 'N/A'}
                  </Typography>
                </Box>

                <Box className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <Typography variant="caption" className="text-green-800 font-medium block mb-2">
                    💡 Como funciona
                  </Typography>
                  <Typography variant="body2" className="text-green-700">
                    Você pode atualizar qualquer campo individualmente. Apenas os campos modificados serão enviados para a API.
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditUser;