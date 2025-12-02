import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Container,
  useTheme,
  useMediaQuery,
  alpha,
  Tooltip,
  Fade,
  LinearProgress,
  Skeleton,
  InputAdornment,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Home as HomeIcon,
  Map as MapIcon,
  Place as PlaceIcon,
  Info as InfoIcon,
  Numbers as NumbersIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import CreateClient from "../clients/CreateClient";
import { urlApi } from "../../../public/url/url";
import { angolaProvincesAndMunicipalities, provinces } from "../../components/utils/angolaProvincesData";

const url = urlApi;

const Address = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    address: null,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    client_id: "",
    provincia: "",
    municipio: "",
    bairro: "",
    rua_ou_avenida: "",
    numero_da_casa: "",
    ponto_de_referencia: "",
  });

  // Estado para armazenar municípios filtrados
  const [filteredMunicipalities, setFilteredMunicipalities] = useState([]);

  // Efeito para carregar municípios quando a província mudar
  useEffect(() => {
    if (formData.provincia && angolaProvincesAndMunicipalities[formData.provincia]) {
      setFilteredMunicipalities(angolaProvincesAndMunicipalities[formData.provincia]);
      // Limpar município quando a província mudar
      if (!angolaProvincesAndMunicipalities[formData.provincia].includes(formData.municipio)) {
        setFormData(prev => ({ ...prev, municipio: "" }));
      }
    } else {
      setFilteredMunicipalities([]);
      setFormData(prev => ({ ...prev, municipio: "" }));
    }
  }, [formData.provincia]);

  // Carregar lista de endereços
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/v1/address/addresses`);
      setAddresses(response.data.data?.addresses || response.data.data || []);
      setError("");
    } catch (err) {
      console.error("Erro ao carregar endereços:", err);
      setError("Erro ao carregar lista de endereços");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClientChange = (client) => {
    setFormData((prev) => ({
      ...prev,
      client_id: client ? client.client_id : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `${url}/api/v1/address/register`,
        formData
      );
      setSuccess(response.data.message || "Endereço criado com sucesso!");

      // Limpar formulário
      setFormData({
        client_id: "",
        provincia: "",
        municipio: "",
        bairro: "",
        rua_ou_avenida: "",
        numero_da_casa: "",
        ponto_de_referencia: "",
      });

      // Recarregar lista de endereços
      fetchAddresses();
    } catch (err) {
      console.error("Erro ao criar endereço:", err);
      setError(err.response?.data?.message || "Erro ao criar endereço");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (address) => {
    const addressId = address._id;
    if (addressId) {
      navigate(`/edit-address/${addressId}`);
    } else {
      setError("Erro: ID do endereço não encontrado");
    }
  };

  const handleDelete = (address) => {
    setDeleteDialog({ open: true, address });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.address) return;

    try {
      const addressId = deleteDialog.address._id;
      await axios.delete(`${url}/api/v1/address/${addressId}`);
      setSuccess("Endereço excluído com sucesso!");
      fetchAddresses();
    } catch (err) {
      console.error("Erro ao excluir endereço:", err);
      setError(err.response?.data?.message || "Erro ao excluir endereço");
    } finally {
      setDeleteDialog({ open: false, address: null });
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({ open: false, address: null });
  };

  // Filtrar endereços baseado na pesquisa
  const filteredAddresses = addresses.filter(
    (address) =>
      address.cliente?.clientName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      address.provincia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.municipio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.bairro?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.rua_ou_avenida?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para formatar endereço completo
  const formatFullAddress = (address) => {
    const parts = [
      address.rua_ou_avenida,
      address.numero_da_casa && `Nº ${address.numero_da_casa}`,
      address.bairro,
      address.municipio,
      address.provincia,
    ].filter(Boolean);

    return parts.join(", ");
  };

  // Função para truncar texto longo
  const truncateText = (text, maxLength = 25) => {
    if (!text) return "N/A";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <Box>
      <Skeleton variant="rounded" height={56} sx={{ mb: 2 }} />
      <Skeleton variant="rounded" height={400} />
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={2}
        mb={4}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Tooltip title="Voltar para clientes">
            <IconButton
              onClick={() => navigate("/clients")}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.grey[100]}, ${theme.palette.grey[200]})`,
                "&:hover": {
                  background: `linear-gradient(135deg, ${theme.palette.grey[200]}, ${theme.palette.grey[300]})`,
                },
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
                fontSize: { xs: "1.75rem", sm: "2.25rem", lg: "2.75rem" },
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Gestão de Endereços
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                fontSize: { xs: "0.9rem", sm: "1.1rem" },
                fontWeight: 400,
              }}
            >
              Cadastre e gerencie endereços dos clientes
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Formulário */}
        <Grid item xs={12} lg={6}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${
                theme.palette.background.paper
              } 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  <LocationIcon />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Registrar Novo Endereço
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Preencha as informações do endereço
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
                    <FormControl fullWidth required>
                      <InputLabel id="provincia-label">Província</InputLabel>
                      <Select
                        labelId="provincia-label"
                        name="provincia"
                        value={formData.provincia}
                        onChange={handleChange}
                        label="Província"
                        startAdornment={
                          <InputAdornment position="start">
                            <MapIcon color="action" />
                          </InputAdornment>
                        }
                        IconComponent={ExpandMoreIcon}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 300,
                            },
                          },
                        }}
                      >
                        <MenuItem value="">
                          <em>Selecione uma província</em>
                        </MenuItem>
                        {provinces.map((provincia) => (
                          <MenuItem key={provincia} value={provincia}>
                            {provincia}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required disabled={!formData.provincia}>
                      <InputLabel id="municipio-label">Município</InputLabel>
                      <Select
                        labelId="municipio-label"
                        name="municipio"
                        value={formData.municipio}
                        onChange={handleChange}
                        label="Município"
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 300,
                            },
                          },
                        }}
                      >
                        <MenuItem value="">
                          <em>
                            {formData.provincia 
                              ? `Selecione um município de ${formData.provincia}`
                              : "Selecione primeiro a província"}
                          </em>
                        </MenuItem>
                        {filteredMunicipalities.map((municipio) => (
                          <MenuItem key={municipio} value={municipio}>
                            {municipio}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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
                    <Box
                      display="flex"
                      gap={2}
                      justifyContent="flex-end"
                      sx={{ mt: 2 }}
                    >
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() => navigate("/clients")}
                        disabled={saving}
                        sx={{
                          fontWeight: 600,
                          minWidth: 120,
                        }}
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
                        sx={{
                          fontWeight: 600,
                          minWidth: 180,
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          "&:hover": {
                            background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                          },
                        }}
                      >
                        {saving ? "Registrando..." : "Registrar Endereço"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
          {/* Informações Adicionais */}
          <Card
            sx={{
              mt: 3,
              background: `linear-gradient(135deg, ${
                theme.palette.background.paper
              } 0%, ${alpha(theme.palette.info.main, 0.02)} 100%)`,
              border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <InfoIcon color="info" />
                <Typography variant="h6" fontWeight="bold" color="info.main">
                  Informações Importantes
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <MapIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle2" fontWeight="bold">
                      Localização
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Província e município são obrigatórios para identificação
                    geográfica.
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <PlaceIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle2" fontWeight="bold">
                      Endereço Completo
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Bairro e rua são essenciais para localização precisa.
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <HomeIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle2" fontWeight="bold">
                      Referência
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Ponto de referência ajuda na localização exata.
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <LocationIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle2" fontWeight="bold">
                      Cliente
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Selecione o cliente associado ao endereço.
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Tabela de Endereços */}
        <Grid item xs={12} lg={6}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${
                theme.palette.background.paper
              } 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                gap={2}
                mb={3}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <HomeIcon />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Endereços Registrados
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {filteredAddresses.length} de {addresses.length} endereços
                    </Typography>
                  </Box>
                </Box>

                <TextField
                  size="small"
                  placeholder="Pesquisar endereços..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    minWidth: { xs: "100%", sm: 250 },
                    background: theme.palette.background.default,
                    borderRadius: 2,
                  }}
                />
              </Box>

              <Divider sx={{ mb: 3 }} />

              {loading ? (
                <LoadingSkeleton />
              ) : (
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                    maxHeight: isMobile ? "50vh" : "60vh",
                    border: `1px solid ${theme.palette.divider}`,
                    "&::-webkit-scrollbar": {
                      width: 8,
                    },
                    "&::-webkit-scrollbar-track": {
                      background: theme.palette.grey[100],
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: theme.palette.primary.main,
                      borderRadius: 4,
                    },
                  }}
                >
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.05
                          ),
                          "& th": {
                            fontWeight: "bold",
                            color: theme.palette.primary.dark,
                            fontSize: { xs: "0.75rem", sm: "0.8rem" },
                            py: 2,
                            borderBottom: `2px solid ${alpha(
                              theme.palette.primary.main,
                              0.2
                            )}`,
                          },
                        }}
                      >
                        <TableCell>Cliente</TableCell>
                        <TableCell>Endereço</TableCell>
                        {!isMobile && <TableCell>Referência</TableCell>}
                        <TableCell align="center">Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredAddresses.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={isMobile ? 3 : 4}
                            align="center"
                            sx={{ py: 6 }}
                          >
                            <Box sx={{ color: "text.secondary", mb: 2 }}>
                              <LocationIcon sx={{ fontSize: 48 }} />
                            </Box>
                            <Typography
                              variant="h6"
                              color="text.secondary"
                              gutterBottom
                            >
                              {searchTerm
                                ? "Nenhum endereço encontrado"
                                : "Nenhum endereço registrado"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {searchTerm
                                ? "Tente ajustar os termos da pesquisa"
                                : "Comece registrando um novo endereço"}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredAddresses.map((address) => (
                          <TableRow
                            key={address._id}
                            sx={{
                              transition: "all 0.2s ease-in-out",
                              "&:hover": {
                                backgroundColor: alpha(
                                  theme.palette.primary.main,
                                  0.04
                                ),
                                transform: "translateX(4px)",
                              },
                            }}
                          >
                            <TableCell>
                              <Typography variant="body2" fontWeight="600">
                                {address.cliente?.clientName ||
                                  address.client_id ||
                                  "N/A"}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" fontWeight="500">
                                  {truncateText(formatFullAddress(address), 40)}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {address.provincia} → {address.municipio}
                                </Typography>
                              </Box>
                            </TableCell>
                            {!isMobile && (
                              <TableCell>
                                <Typography variant="body2">
                                  {address.ponto_de_referencia ? (
                                    <Chip
                                      label={truncateText(
                                        address.ponto_de_referencia
                                      )}
                                      color="primary"
                                      size="small"
                                      variant="outlined"
                                      sx={{ fontWeight: 500 }}
                                    />
                                  ) : (
                                    <Chip
                                      label="Sem referência"
                                      color="default"
                                      size="small"
                                      variant="outlined"
                                    />
                                  )}
                                </Typography>
                              </TableCell>
                            )}
                            <TableCell align="center">
                              <Box
                                display="flex"
                                justifyContent="center"
                                gap={0.5}
                              >
                                <Tooltip title="Editar endereço">
                                  <IconButton
                                    color="primary"
                                    onClick={() => handleEdit(address)}
                                    size="small"
                                    sx={{
                                      background: alpha(
                                        theme.palette.primary.main,
                                        0.1
                                      ),
                                      "&:hover": {
                                        background: alpha(
                                          theme.palette.primary.main,
                                          0.2
                                        ),
                                        transform: "scale(1.1)",
                                      },
                                    }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Excluir endereço">
                                  <IconButton
                                    color="error"
                                    onClick={() => handleDelete(address)}
                                    size="small"
                                    sx={{
                                      background: alpha(
                                        theme.palette.error.main,
                                        0.1
                                      ),
                                      "&:hover": {
                                        background: alpha(
                                          theme.palette.error.main,
                                          0.2
                                        ),
                                        transform: "scale(1.1)",
                                      },
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
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

          {/* Estatísticas Rápidas */}
          <Card
            sx={{
              mt: 3,
              background: `linear-gradient(135deg, ${
                theme.palette.background.paper
              } 0%, ${alpha(theme.palette.success.main, 0.02)} 100%)`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography
                variant="h6"
                gutterBottom
                fontWeight="bold"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <MapIcon color="success" />
                Estatísticas de Endereços
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      {addresses.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      {new Set(addresses.map((a) => a.provincia)).size}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Províncias
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      {new Set(addresses.map((a) => a.municipio)).size}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Municípios
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      {new Set(addresses.map((a) => a.client_id)).size}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Clientes
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog
        open={deleteDialog.open}
        onClose={cancelDelete}
        PaperProps={{
          sx: {
            background: `linear-gradient(135deg, ${
              theme.palette.background.paper
            } 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          <Box display="flex" alignItems="center" gap={1}>
            <DeleteIcon color="error" />
            Confirmar Exclusão
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o endereço de{" "}
            <strong>
              {deleteDialog.address?.cliente?.clientName ||
                deleteDialog.address?.client_id}
            </strong>
            ?
          </Typography>
          {deleteDialog.address && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                backgroundColor: alpha(theme.palette.grey[100], 0.5),
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" fontWeight="500">
                <strong>Endereço:</strong>{" "}
                {formatFullAddress(deleteDialog.address)}
              </Typography>
              {deleteDialog.address.ponto_de_referencia && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Referência:</strong>{" "}
                  {deleteDialog.address.ponto_de_referencia}
                </Typography>
              )}
            </Box>
          )}
          <Alert severity="warning" sx={{ mt: 2 }}>
            Esta ação não pode ser desfeita.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={cancelDelete}
            variant="outlined"
            sx={{ fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
            sx={{
              fontWeight: 600,
              background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
              "&:hover": {
                background: `linear-gradient(135deg, ${theme.palette.error.dark}, ${theme.palette.error.main})`,
              },
            }}
          >
            Excluir Endereço
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Address;
