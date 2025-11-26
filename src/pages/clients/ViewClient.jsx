import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Grid,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Alert,
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
  Container,
  useTheme,
  alpha,
  Tooltip,
  Fade,
  Skeleton,
  Breadcrumbs,
  Link,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  CardMembership as LicenseIcon,
  Business as BusinessIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  Warning as WarningIcon,
  CalendarToday as CalendarIcon,
  AccountCircle as AccountIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material";
import { urlApi } from "../../../public/url/url";

//const url = 'http://localhost:3000';

const url = urlApi;

const ViewClient = () => {
  const { client_id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [client, setClient] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false });

  // Carregar dados do cliente
  const fetchClient = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${url}/api/v1/client/getById/${client_id}`
      );
      setClient(response.data.data);
      setError("");
    } catch (err) {
      console.error("Erro ao carregar cliente:", err);
      setError("Erro ao carregar dados do cliente");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (client_id) {
      fetchClient();
    }
  }, [client_id]);

  const handleEdit = () => {
    navigate(`/client/update/${client_id}`);
  };

  // const handleDelete = async () => {
  //   try {
  //     await axios.delete(`${url}/api/v1/client/delete/${client_id}`);
  //     navigate('/clients');
  //   } catch (err) {
  //     console.error('Erro ao excluir cliente:', err);
  //     setError('Erro ao excluir cliente');
  //   } finally {
  //     setDeleteDialog({ open: false });
  //   }
  // };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPhone = (phone) => {
    if (!phone) return "N/A";
    return phone.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
    }).format(value || 0);
  };

  const getLicenseStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "ativa":
        return "success";
      case "expirada":
        return "error";
      case "pendente":
        return "warning";
      case "suspensa":
        return "warning";
      default:
        return "default";
    }
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <Box>
      <Skeleton variant="rounded" height={56} sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Skeleton variant="rounded" height={300} />
          <Skeleton variant="rounded" height={200} sx={{ mt: 3 }} />
        </Grid>
        <Grid item xs={12} md={8}>
          <Skeleton variant="rounded" height={400} />
        </Grid>
      </Grid>
    </Box>
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 } }}>
        <LoadingSkeleton />
      </Container>
    );
  }

  if (error || !client) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 } }}>
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => navigate("/clients")}
            >
              VOLTAR
            </Button>
          }
        >
          {error || "Cliente não encontrado"}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 } }}>
      {/* Header e Breadcrumbs */}
      <Box mb={4}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 2 }}
        >
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate("/clients")}
            sx={{
              color: "text.secondary",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Clientes
          </Link>
          <Typography color="text.primary" variant="body2">
            {client.clientName}
          </Typography>
        </Breadcrumbs>

        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={2}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Tooltip title="Voltar para lista de clientes">
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
                {client.clientName}
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  fontSize: { xs: "0.9rem", sm: "1.1rem" },
                  fontWeight: 400,
                }}
              >
                Detalhes completos do cliente
              </Typography>
            </Box>
          </Box>

          <Box display="flex" gap={1} flexWrap="wrap">
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{
                fontWeight: 600,
                minWidth: 120,
              }}
            >
              Editar
            </Button>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Informações Básicas */}
        <Grid item xs={12} lg={4}>
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
                  <BusinessIcon />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Informações Básicas
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Dados principais do cliente
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Nome do Cliente
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="600"
                      color="primary"
                    >
                      {client.clientName}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      NIF
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {client.nif}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      ID do Cliente
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="medium"
                      fontFamily="monospace"
                      fontSize="0.9rem"
                    >
                      {client.client_id}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarIcon color="action" fontSize="small" />
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Data de Registro
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formatDate(client.publishedAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Estatísticas Rápidas */}
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
              <Typography
                variant="h6"
                gutterBottom
                fontWeight="bold"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <AccountIcon color="info" />
                Estatísticas do Cliente
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box textAlign="center" sx={{ p: 1 }}>
                    <Chip
                      label={client.enderecos?.length || 0}
                      color="primary"
                      variant="filled"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        minWidth: 50,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      }}
                    />
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mt: 1 }}
                      fontWeight="500"
                    >
                      Endereços
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" sx={{ p: 1 }}>
                    <Chip
                      label={client.contatos?.length || 0}
                      color="secondary"
                      variant="filled"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        minWidth: 50,
                        background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                      }}
                    />
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mt: 1 }}
                      fontWeight="500"
                    >
                      Contactos
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" sx={{ p: 1 }}>
                    <Chip
                      label={client.licencas?.length || 0}
                      color="success"
                      variant="filled"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        minWidth: 50,
                        background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                      }}
                    />
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mt: 1 }}
                      fontWeight="500"
                    >
                      Licenças
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" sx={{ p: 1 }}>
                    <Chip
                      label={client.responsaveis?.length || 0}
                      color="warning"
                      variant="filled"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        minWidth: 50,
                        background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                      }}
                    />
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mt: 1 }}
                      fontWeight="500"
                    >
                      Responsáveis
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Informações Detalhadas */}
        <Grid item xs={12} lg={8}>
          {/* Contactos */}
          <Card
            sx={{
              mb: 3,
              background: `linear-gradient(135deg, ${
                theme.palette.background.paper
              } 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  <EmailIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Contactos
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {client.contatos?.length || 0} contacto(s) registrado(s)
                  </Typography>
                </Box>
              </Box>

              {!client.contatos || client.contatos.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <EmailIcon
                    sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                  />
                  <Typography color="text.secondary">
                    Nenhum contacto registrado
                  </Typography>
                </Box>
              ) : (
                <TableContainer
                  component={Paper}
                  variant="outlined"
                  sx={{
                    "& .MuiTableRow:hover": {
                      backgroundColor: alpha(
                        theme.palette.secondary.main,
                        0.04
                      ),
                    },
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: alpha(
                            theme.palette.secondary.main,
                            0.05
                          ),
                        }}
                      >
                        <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Telefone
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Tipo</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {client.contatos.map((contato) => (
                        <TableRow key={contato._id}>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <EmailIcon fontSize="small" color="action" />
                              <Typography variant="body2">
                                {contato.email}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <PhoneIcon fontSize="small" color="action" />
                              <Typography variant="body2">
                                {formatPhone(contato.telefone)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={
                                contato.isPrincipal ? "Principal" : "Secundário"
                              }
                              color={
                                contato.isPrincipal ? "primary" : "default"
                              }
                              size="small"
                              variant={
                                contato.isPrincipal ? "filled" : "outlined"
                              }
                              sx={{ fontWeight: 500 }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>

          {/* Endereços */}
          <Card
            sx={{
              mb: 3,
              background: `linear-gradient(135deg, ${
                theme.palette.background.paper
              } 0%, ${alpha(theme.palette.success.main, 0.02)} 100%)`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  <LocationIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Endereços
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {client.enderecos?.length || 0} endereço(s) registrado(s)
                  </Typography>
                </Box>
              </Box>

              {!client.enderecos || client.enderecos.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <LocationIcon
                    sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                  />
                  <Typography color="text.secondary">
                    Nenhum endereço registrado
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {client.enderecos.map((endereco, index) => (
                    <Grid item xs={12} md={6} key={endereco._id}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          height: "100%",
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            borderColor: theme.palette.success.main,
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <HomeIcon color="action" fontSize="small" />
                          <Typography variant="subtitle2" fontWeight="600">
                            Endereço {index + 1}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {endereco.provincia} → {endereco.municipio}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {endereco.bairro}, {endereco.rua_ou_avenida}
                          {endereco.numero_da_casa &&
                            `, Nº ${endereco.numero_da_casa}`}
                        </Typography>
                        {endereco.ponto_de_referencia && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            <strong>Referência:</strong>{" "}
                            {endereco.ponto_de_referencia}
                          </Typography>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>

          {/* Licenças */}
          <Card
            sx={{
              mb: 3,
              background: `linear-gradient(135deg, ${
                theme.palette.background.paper
              } 0%, ${alpha(theme.palette.warning.main, 0.02)} 100%)`,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  <LicenseIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Licenças
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {client.licencas?.length || 0} licença(s) registrada(s)
                  </Typography>
                </Box>
              </Box>

              {!client.licencas || client.licencas.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <LicenseIcon
                    sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                  />
                  <Typography color="text.secondary">
                    Nenhuma licença registrada
                  </Typography>
                </Box>
              ) : (
                <TableContainer
                  component={Paper}
                  variant="outlined"
                  sx={{
                    "& .MuiTableRow:hover": {
                      backgroundColor: alpha(theme.palette.warning.main, 0.04),
                    },
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: alpha(
                            theme.palette.warning.main,
                            0.05
                          ),
                        }}
                      >
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Nº Licença
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Técnico
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Localização
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Estado
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Expiração
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Valor</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {client.licencas.map((licenca) => (
                        <TableRow key={licenca._id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="600">
                              {licenca.numeroLicenca}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {licenca.tecnico}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {licenca.localizacao}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={licenca.estado}
                              color={getLicenseStatusColor(licenca.estado)}
                              size="small"
                              variant="filled"
                              sx={{ fontWeight: 500, minWidth: 80 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <CalendarIcon fontSize="small" color="action" />
                              <Typography variant="body2">
                                {formatDate(licenca.data_da_expiracao)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <PaymentIcon fontSize="small" color="action" />
                              <Typography variant="body2" fontWeight="500">
                                {formatCurrency(licenca.valor_pago)}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>

          {/* Responsáveis */}
          <Card
            sx={{
              background: `linear-gradient(135deg, ${
                theme.palette.background.paper
              } 0%, ${alpha(theme.palette.info.main, 0.02)} 100%)`,
              border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  <PersonIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Responsáveis
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {client.responsaveis?.length || 0} responsável(eis)
                    registrado(s)
                  </Typography>
                </Box>
              </Box>

              {!client.responsaveis || client.responsaveis.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <PersonIcon
                    sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                  />
                  <Typography color="text.secondary">
                    Nenhum responsável registrado
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {client.responsaveis.map((responsavel, index) => (
                    <Grid item xs={12} md={6} key={responsavel._id}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          height: "100%",
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            borderColor: theme.palette.info.main,
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <AccountIcon color="action" fontSize="small" />
                          <Typography variant="subtitle2" fontWeight="600">
                            {responsavel.nome}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <EmailIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {responsavel.email}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <PhoneIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {formatPhone(responsavel.telefone)}
                          </Typography>
                        </Box>

                        <Chip
                          label={
                            responsavel.isPrincipal ? "Principal" : "Secundário"
                          }
                          color={
                            responsavel.isPrincipal ? "primary" : "default"
                          }
                          size="small"
                          variant={
                            responsavel.isPrincipal ? "filled" : "outlined"
                          }
                          sx={{ fontWeight: 500 }}
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false })}
        maxWidth="sm"
        fullWidth
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
            <WarningIcon color="error" />
            Confirmar Exclusão
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o cliente{" "}
            <strong>{client.clientName}</strong>?
          </Typography>
          <Alert severity="error" sx={{ mt: 2 }} icon={<WarningIcon />}>
            <Typography variant="body2" fontWeight="500">
              Esta ação excluirá todos os dados associados (endereços,
              contactos, licenças e responsáveis) e não pode ser desfeita.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false })}
            variant="outlined"
            sx={{ fontWeight: 600 }}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ViewClient;
