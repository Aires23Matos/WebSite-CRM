import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
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
  MenuItem,
  Divider,
  FormControl,
  InputLabel,
  Select,
  InputAdornment
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  CardMembership as LicenseIcon,
  LocationOn as LocationIcon,
  TrendingUp as TrendingUpIcon
} from "@mui/icons-material";
import CreateClient from "../clients/CreateClient";

const EditLicense = () => {
  const navigate = useNavigate();
  const { license_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientAddresses, setClientAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [clientLoading, setClientLoading] = useState(false);

  // Função para verificar se a licença está expirada
  const isLicenseExpired = (expirationDate) => {
    if (!expirationDate) return false;
    return new Date(expirationDate) < new Date();
  };

  // Função para normalizar datas para o backend (CORRIGIDA)
  const normalizeDateForBackend = (dateString) => {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error('Data inválida:', dateString);
        return null;
      }
      
      // Usar UTC para evitar problemas de fuso horário
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}T00:00:00.000Z`;
    } catch (err) {
      console.error('Erro ao normalizar data:', err);
      return null;
    }
  };

  // Carregar dados do cliente pelo ID
  const fetchClientById = async (clientId) => {
    if (!clientId) return null;
    
    setClientLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/client/clients/${clientId}`);
      return response.data.data;
    } catch (err) {
      console.error('Erro ao carregar dados do cliente:', err);
      return null;
    } finally {
      setClientLoading(false);
    }
  };

  // Carregar endereços do cliente quando um cliente é selecionado
  const fetchClientAddresses = async (clientId) => {
    if (!clientId) {
      setClientAddresses([]);
      return;
    }

    setLoadingAddresses(true);
    try {
      // Buscar endereços pela rota de endereços filtrando por client_id
      const response = await axios.get(`http://localhost:3000/api/v1/address/addresses?client_id=${clientId}`);
      const addresses = response.data.data?.addresses || [];
      setClientAddresses(addresses);
    } catch (err) {
      console.error('Erro ao carregar endereços do cliente:', err);
      // Se der erro, tentar buscar de forma alternativa
      try {
        const alternativeResponse = await axios.get('http://localhost:3000/api/v1/address/addresses');
        const allAddresses = alternativeResponse.data.data?.addresses || [];
        const filteredAddresses = allAddresses.filter(address => address.client_id === clientId);
        setClientAddresses(filteredAddresses);
      } catch (secondErr) {
        console.error('Erro alternativo ao carregar endereços:', secondErr);
        setClientAddresses([]);
      }
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Carregar dados da licença
  useEffect(() => {
    const fetchLicense = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/licenses/${license_id}`
        );
        
        const license = response.data.data;

        // Verificar se a licença está expirada e ajustar o estado automaticamente
        let estado = license.estado || "ativa";
        if (isLicenseExpired(license.data_da_expiracao) && estado === "ativa") {
          estado = "expirada";
        }

        const licenseData = {
          client_id: license.client_id || "",
          tecnico: license.tecnico || "",
          localizacao: license.localizacao || "",
          numeroLicenca: license.numeroLicenca || "",
          data_da_instalacao: license.data_da_instalacao
            ? license.data_da_instalacao.split("T")[0]
            : "",
          data_da_ativacao: license.data_da_ativacao
            ? license.data_da_ativacao.split("T")[0]
            : "",
          data_da_expiracao: license.data_da_expiracao
            ? license.data_da_expiracao.split("T")[0]
            : "",
          estado: estado,
          hora_de_formacao: license.hora_de_formacao || "",
          validade_em_mes: license.validade_em_mes || 12,
          conta_pago: license.conta_pago || "Pendente",
          valor_pago: license.valor_pago || 0,
          valor_total: license.valor_total || 0 // Novo campo para valor total
        };

        setFormData(licenseData);
        setOriginalData(licenseData);

        // Se já existe um client_id, carregar os dados do cliente e seus endereços
        if (license.client_id) {
          // Buscar dados do cliente para preencher o selectedClient
          const clientData = await fetchClientById(license.client_id);
          if (clientData) {
            setSelectedClient(clientData);
          } else {
            // Se não encontrar o cliente, criar um objeto mínimo com os dados disponíveis
            setSelectedClient({
              client_id: license.client_id,
              clientName: license.cliente?.clientName || "Cliente não encontrado",
              nif: license.cliente?.nif || "N/A"
            });
          }
          
          // Carregar endereços do cliente
          fetchClientAddresses(license.client_id);
        }
      } catch (err) {
        console.error("Erro ao carregar licença:", err);
        setError(
          err.response?.data?.message || 
          "Erro ao carregar dados da licença"
        );
      } finally {
        setLoading(false);
      }
    };

    if (license_id) {
      fetchLicense();
    } else {
      setError("ID da licença não encontrado na URL");
      setLoading(false);
    }
  }, [license_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Se a conta for "Parcial", garantir que valor_total seja maior que valor_pago
    if (name === 'conta_pago' && value === 'Parcial') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        valor_total: prev.valor_total > prev.valor_pago ? prev.valor_total : prev.valor_pago + 1000
      }));
      return;
    }

    // Se o estado for alterado para "ativa" mas a licença está expirada, mudar para "expirada"
    if (name === 'estado' && value === 'ativa' && isLicenseExpired(formData.data_da_expiracao)) {
      setFormData(prev => ({
        ...prev,
        [name]: 'expirada'
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "validade_em_mes" || name === "valor_pago" || name === "valor_total"
          ? Number(value)
          : value,
    }));
  };

  // Validação para garantir que valor_pago não seja maior que valor_total quando conta_pago for "Parcial"
  const validatePaymentValues = () => {
    if (formData.conta_pago === 'Parcial') {
      if (formData.valor_pago > formData.valor_total) {
        setError('O valor pago não pode ser maior que o valor total');
        return false;
      }
      if (formData.valor_total <= 0) {
        setError('O valor total deve ser maior que zero para pagamento parcial');
        return false;
      }
    }
    return true;
  };

  const handleClientChange = (client) => {
    setSelectedClient(client);
    const clientId = client ? client.client_id : "";
    
    setFormData((prev) => ({
      ...prev,
      client_id: clientId,
      localizacao: "" // Resetar localização quando mudar de cliente
    }));

    // Carregar endereços do cliente selecionado
    if (clientId) {
      fetchClientAddresses(clientId);
    } else {
      setClientAddresses([]);
    }
  };

  const handleLocationChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      localizacao: value
    }));
  };

  // Função para comparar e enviar apenas os campos modificados
  const getChangedFields = () => {
    const changedFields = {};
    
    Object.keys(formData).forEach(key => {
      if (formData[key] !== originalData[key]) {
        changedFields[key] = formData[key];
      }
    });

    return changedFields;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    // Validar valores de pagamento
    if (!validatePaymentValues()) {
      setSaving(false);
      return;
    }

    try {
      // Pega apenas os campos que foram modificados
      const changedData = getChangedFields();
      
      // Se não há campos modificados, não faz nada
      if (Object.keys(changedData).length === 0) {
        setError("Nenhuma alteração foi feita");
        setSaving(false);
        return;
      }

      console.log("Campos modificados para atualização:", changedData);

      // Verificar se a licença está expirada e ajustar o estado automaticamente
      if (isLicenseExpired(formData.data_da_expiracao) && formData.estado === 'ativa') {
        changedData.estado = 'expirada';
        setFormData(prev => ({ ...prev, estado: 'expirada' }));
      }

      // Normalizar datas antes de enviar
      const dataToSend = { ...changedData };
      
      // Aplicar normalização apenas para campos de data que foram modificados
      const dateFields = ['data_da_instalacao', 'data_da_ativacao', 'data_da_expiracao'];
      dateFields.forEach(field => {
        if (dataToSend[field]) {
          dataToSend[field] = normalizeDateForBackend(dataToSend[field]);
        }
      });

      console.log("Dados normalizados para envio:", dataToSend);
      
      const response = await axios.put(
        `http://localhost:3000/api/v1/licenses/update/${license_id}`,
        dataToSend
      );
      
      setSuccess(response.data.message || "Licença atualizada com sucesso!");
      setOriginalData(formData);

      setTimeout(() => {
        navigate("/license");
      }, 2000);
    } catch (err) {
      console.error("Erro ao atualizar licença:", err);
      
      // Tratamento específico para erro de validação
      const errorData = err.response?.data;
      
      if (errorData?.code === 'InvalidField') {
        setError(`Erro de validação: ${errorData.message}`);
      } else if (errorData?.code === 'DuplicateLicense') {
        setError(`Erro: ${errorData.message}`);
      } else if (errorData?.message) {
        setError(errorData.message);
      } else {
        setError("Erro ao atualizar licença. Verifique os dados e tente novamente.");
      }
    } finally {
      setSaving(false);
    }
  };

  // Função para verificar se um campo foi modificado
  const isFieldModified = (fieldName) => {
    return formData[fieldName] !== originalData[fieldName];
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
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
            onClick={() => navigate("/license")}
          >
            Voltar
          </Button>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Editar Licença
          </Typography>
        </Box>
      </Box>

      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <LicenseIcon color="primary" />
            <Typography variant="h5">
              Editar Informações da Licença
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess("")}>
              {success}
            </Alert>
          )}

          {/* Alerta se a licença está expirada */}
          {isLicenseExpired(formData.data_da_expiracao) && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              Esta licença está expirada. O estado foi automaticamente ajustado para "Expirada".
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box>
                  <CreateClient
                    value={selectedClient}
                    onChange={handleClientChange}
                    required
                  />
                  {clientLoading && (
                    <Box display="flex" alignItems="center" gap={1} sx={{ mt: 1 }}>
                      <CircularProgress size={16} />
                      <Typography variant="caption" color="text.secondary">
                        Carregando dados do cliente...
                      </Typography>
                    </Box>
                  )}
                  {selectedClient && !clientLoading && (
                    <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                      ✓ Cliente carregado: {selectedClient.clientName} - {selectedClient.nif}
                    </Typography>
                  )}
                </Box>
                {isFieldModified('client_id') && (
                  <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                    ✓ Campo modificado
                  </Typography>
                )}
              </Grid>

              {/* Campo de Localização - aparece apenas quando um cliente é selecionado */}
              {selectedClient && (
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Localização (Município)</InputLabel>
                    <Select
                      value={formData.localizacao || ""}
                      onChange={handleLocationChange}
                      label="Localização (Município)"
                      startAdornment={
                        <InputAdornment position="start">
                          <LocationIcon color="action" />
                        </InputAdornment>
                      }
                      disabled={loadingAddresses}
                    >
                      <MenuItem value="">
                        <em>Selecione um município</em>
                      </MenuItem>
                      {clientAddresses.map((endereco, index) => (
                        <MenuItem 
                          key={endereco._id || index} 
                          value={endereco.municipio}
                        >
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              {endereco.municipio}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {loadingAddresses && (
                    <Box display="flex" alignItems="center" gap={1} sx={{ mt: 1 }}>
                      <CircularProgress size={16} />
                      <Typography variant="caption" color="text.secondary">
                        Carregando endereços...
                      </Typography>
                    </Box>
                  )}
                  {!loadingAddresses && clientAddresses.length === 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Este cliente não possui endereços cadastrados.
                    </Typography>
                  )}
                  {isFieldModified('localizacao') && (
                    <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                      ✓ Campo modificado
                    </Typography>
                  )}
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Técnico"
                  name="tecnico"
                  value={formData.tecnico || ""}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
                {isFieldModified('tecnico') && (
                  <Typography variant="caption" color="primary">
                    ✓ Campo modificado
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Número da Licença"
                  name="numeroLicenca"
                  value={formData.numeroLicenca || ""}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
                {isFieldModified('numeroLicenca') && (
                  <Typography variant="caption" color="primary">
                    ✓ Campo modificado
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Data de Instalação"
                  name="data_da_instalacao"
                  type="date"
                  value={formData.data_da_instalacao || ""}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  required
                />
                {isFieldModified('data_da_instalacao') && (
                  <Typography variant="caption" color="primary">
                    ✓ Campo modificado
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Data de Ativação"
                  name="data_da_ativacao"
                  type="date"
                  value={formData.data_da_ativacao || ""}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  required
                />
                {isFieldModified('data_da_ativacao') && (
                  <Typography variant="caption" color="primary">
                    ✓ Campo modificado
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Data de Expiração"
                  name="data_da_expiracao"
                  type="date"
                  value={formData.data_da_expiracao || ""}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  required
                />
                {isFieldModified('data_da_expiracao') && (
                  <Typography variant="caption" color="primary">
                    ✓ Campo modificado
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Hora de Formação"
                  name="hora_de_formacao"
                  type="time"
                  value={formData.hora_de_formacao || ""}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  required
                />
                {isFieldModified('hora_de_formacao') && (
                  <Typography variant="caption" color="primary">
                    ✓ Campo modificado
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Estado"
                  name="estado"
                  value={formData.estado || "ativa"}
                  onChange={handleChange}
                  variant="outlined"
                  required
                  disabled={isLicenseExpired(formData.data_da_expiracao) && formData.estado === "expirada"}
                >
                  <MenuItem value="ativa">Ativa</MenuItem>
                  <MenuItem value="expirada">Expirada</MenuItem>
                  <MenuItem value="pendente">Pendente</MenuItem>
                  <MenuItem value="cancelada">Cancelada</MenuItem>
                </TextField>
                {isLicenseExpired(formData.data_da_expiracao) && formData.estado === "expirada" && (
                  <Typography variant="caption" color="warning.main" sx={{ display: 'block', mt: 0.5 }}>
                    Estado bloqueado: licença expirada não pode estar ativa
                  </Typography>
                )}
                {isFieldModified('estado') && (
                  <Typography variant="caption" color="primary">
                    ✓ Campo modificado
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Status do Pagamento"
                  name="conta_pago"
                  value={formData.conta_pago || "Pendente"}
                  onChange={handleChange}
                  variant="outlined"
                  required
                >
                  <MenuItem value="Pago">Pago</MenuItem>
                  <MenuItem value="Não Pago">Não Pago</MenuItem>
                  <MenuItem value="Parcial">Parcial</MenuItem>
                  <MenuItem value="Pendente">Pendente</MenuItem>
                </TextField>
                {isFieldModified('conta_pago') && (
                  <Typography variant="caption" color="primary">
                    ✓ Campo modificado
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Validade (meses)"
                  name="validade_em_mes"
                  type="number"
                  value={formData.validade_em_mes || 12}
                  onChange={handleChange}
                  variant="outlined"
                  inputProps={{ min: 1, max: 120 }}
                  required
                />
                {isFieldModified('validade_em_mes') && (
                  <Typography variant="caption" color="primary">
                    ✓ Campo modificado
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Valor Pago (KZ)"
                  name="valor_pago"
                  type="number"
                  value={formData.valor_pago || 0}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TrendingUpIcon color="action" />
                      </InputAdornment>
                    ),
                    inputProps: { min: 0, step: 0.01 }
                  }}
                />
                {isFieldModified('valor_pago') && (
                  <Typography variant="caption" color="primary">
                    ✓ Campo modificado
                  </Typography>
                )}
              </Grid>

              {/* Campo para Valor Total - aparece apenas quando conta_pago é "Parcial" */}
              {formData.conta_pago === 'Parcial' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Valor Total (KZ)"
                    name="valor_total"
                    type="number"
                    value={formData.valor_total || 0}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    helperText="Valor total a ser pago pela licença"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TrendingUpIcon color="action" />
                        </InputAdornment>
                      ),
                      inputProps: { min: formData.valor_pago || 0, step: 0.01 }
                    }}
                  />
                  {isFieldModified('valor_total') && (
                    <Typography variant="caption" color="primary">
                      ✓ Campo modificado
                    </Typography>
                  )}
                </Grid>
              )}

              <Grid item xs={12}>
                <Box display="flex" gap={2} justifyContent="flex-end" mt={2}>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => navigate("/license")}
                    disabled={saving}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={
                      saving ? <CircularProgress size={20} /> : <SaveIcon />
                    }
                    disabled={saving || !formData.client_id}
                  >
                    {saving ? "Atualizando..." : "Atualizar Licença"}
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

export default EditLicense;