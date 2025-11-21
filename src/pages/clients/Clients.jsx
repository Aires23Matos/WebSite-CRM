import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Chip,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  useMediaQuery,
  useTheme,
  TextField,
  Tabs,
  Tab,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Edit as EditIcon,
  Block as BlockIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [blockedClients, setBlockedClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blockLoading, setBlockLoading] = useState(false);
  const [error, setError] = useState("");
  const [blockDialog, setBlockDialog] = useState({
    open: false,
    client: null,
    action: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [blockReason, setBlockReason] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("name"); // 'name', 'nif', 'id'
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Fetch all clients from API
  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/api/v1/client/clients"
      );
      const allClients = response.data.data.clients || [];

      // Filtrar clientes ativos (não bloqueados)
      const activeClients = allClients.filter((client) => !client.isBlocked);
      setClients(activeClients);
      setError("");
    } catch (err) {
      console.error("Erro ao carregar clientes:", err);
      setError("Erro ao carregar lista de clientes");
      showSnackbar("Erro ao carregar clientes", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch blocked clients from API
  const fetchBlockedClients = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/client/blocked"
      );
      setBlockedClients(response.data.data.clientes || []);
    } catch (err) {
      console.error("Erro ao carregar clientes bloqueados:", err);
      showSnackbar("Erro ao carregar clientes bloqueados", "error");
    }
  };

  // Fetch both lists
  const fetchAllData = async () => {
    await fetchClients();
    await fetchBlockedClients();
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Filter clients based on search term
  const filterClients = (clientList, isBlocked = false) => {
    if (!searchTerm.trim()) return clientList;

    const term = searchTerm.toLowerCase().trim();

    return clientList.filter((client) => {
      const clientData = isBlocked ? client.cliente : client;

      switch (searchField) {
        case "name":
          return clientData.clientName?.toLowerCase().includes(term);
        case "nif":
          return clientData.nif?.toLowerCase().includes(term);
        case "id":
          return clientData.client_id?.toLowerCase().includes(term);
        case "all":
        default:
          return (
            clientData.clientName?.toLowerCase().includes(term) ||
            clientData.nif?.toLowerCase().includes(term) ||
            clientData.client_id?.toLowerCase().includes(term)
          );
      }
    });
  };

  // Get filtered clients
  const filteredActiveClients = filterClients(
    clients.filter((client) => !client.isBlocked)
  );
  const filteredBlockedClients = filterClients(blockedClients, true);

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
  };

  // Block/Unblock client function
  const handleBlockAction = async () => {
    try {
      setBlockLoading(true);
      const { client, action } = blockDialog;

      if (action === "block") {
        await axios.post("http://localhost:3000/api/v1/client/block", {
          clientId: client.client_id,
          motivo: blockReason,
        });
        showSnackbar("Cliente bloqueado com sucesso", "success");
      } else {
        await axios.post("http://localhost:3000/api/v1/client/unblock", {
          clientId: client.client_id,
        });
        showSnackbar("Cliente desbloqueado com sucesso", "success");
      }

      // Refresh both lists
      await fetchAllData();

      setBlockDialog({ open: false, client: null, action: "" });
      setBlockReason("");
    } catch (err) {
      console.error("Erro ao executar ação:", err);
      showSnackbar("Erro ao executar ação", "error");
    } finally {
      setBlockLoading(false);
    }
  };

  // Navigate functions
  const editClient = (clientId) => {
    navigate(`/client/update/${clientId}`);
  };

  const viewClient = (clientId) => {
    navigate(`/client/getById/${clientId}`);
  };

  const createClient = () => {
    navigate("/register-client");
  };

  // Helper functions
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const confirmBlockAction = (client, action) => {
    setBlockDialog({ open: true, client, action });
  };

  const closeBlockDialog = () => {
    setBlockDialog({ open: false, client: null, action: "" });
    setBlockReason("");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Clear search when changing tabs
    setSearchTerm("");
  };

  // Get active clients (filter out blocked ones)
  const activeClients = clients.filter((client) => !client.isBlocked);

  // Mobile Card Component for active clients
  const ClientCard = ({ client }) => (
    <Card sx={{ mb: 2, p: 2 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="start"
        mb={2}
      >
        <Box flex={1}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {client.clientName}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            NIF: {client.nif}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ID: {client.client_id}
          </Typography>
        </Box>
        <Chip label="Ativo" size="small" color="success" variant="outlined" />
      </Box>

      <Grid container spacing={1} mb={2}>
        <Grid item xs={6}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <LocationIcon fontSize="small" color="action" />
            <Typography variant="caption">
              {client.address?.length || 0} end.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="caption">
              {client.accountable?.length || 0} resp.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <EmailIcon fontSize="small" color="action" />
            <Typography variant="caption">
              {client.contact?.length || 0} cont.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <PhoneIcon fontSize="small" color="action" />
            <Typography variant="caption">
              {client.licenseData?.length || 0} lic.
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        mb={2}
      >
        Criado em: {formatDate(client.publishedAt)}
      </Typography>

      <Box display="flex" justifyContent="space-between">
        <IconButton
          size="small"
          onClick={() => viewClient(client.client_id)}
          color="primary"
        >
          <ViewIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => editClient(client.client_id)}
          color="secondary"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => confirmBlockAction(client, "block")}
          color="warning"
        >
          <BlockIcon />
        </IconButton>
      </Box>
    </Card>
  );

  // Mobile Card Component for blocked clients
  const BlockedClientCard = ({ client }) => (
    <Card sx={{ mb: 2, p: 2, border: "1px solid", borderColor: "error.light" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="start"
        mb={2}
      >
        <Box flex={1}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {client.cliente.clientName}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            NIF: {client.cliente.nif}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ID: {client.cliente.client_id}
          </Typography>
        </Box>
        <Chip label="Bloqueado" size="small" color="error" />
      </Box>

      {client.cliente.blockReason && (
        <Box mb={2}>
          <Typography variant="caption" fontWeight="bold" color="error">
            Motivo:
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {client.cliente.blockReason}
          </Typography>
        </Box>
      )}

      <Grid container spacing={1} mb={2}>
        <Grid item xs={6}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <LocationIcon fontSize="small" color="action" />
            <Typography variant="caption">
              {client.enderecos?.length || 0} end.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="caption">
              {client.responsaveis?.length || 0} resp.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <EmailIcon fontSize="small" color="action" />
            <Typography variant="caption">
              {client.contatos?.length || 0} cont.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <PhoneIcon fontSize="small" color="action" />
            <Typography variant="caption">
              {client.licencas?.length || 0} lic.
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        mb={2}
      >
        Bloqueado em:{" "}
        {client.cliente.blockedAt
          ? formatDate(client.cliente.blockedAt)
          : "N/A"}
      </Typography>

      <Box display="flex" justifyContent="space-between">
        <IconButton
          size="small"
          onClick={() => viewClient(client.cliente.client_id)}
          color="primary"
        >
          <ViewIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => confirmBlockAction(client.cliente, "unblock")}
          color="success"
        >
          <UnlockIcon />
        </IconButton>
      </Box>
    </Card>
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography variant="h6">Carregando clientes...</Typography>
      </Box>
    );
  }

  if (error && activeTab === 0) {
    return (
      <Card>
        <CardContent>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={fetchAllData}
            startIcon={<RefreshIcon />}
            sx={{ mt: 2 }}
          >
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        gap={2}
        mb={4}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            color="gray.800"
            gutterBottom={isMobile}
          >
            Gestão de Clientes
          </Typography>
          <Typography variant="subtitle1" color="gray.600">
            {activeTab === 0
              ? `Total de ${activeClients.length} cliente(s) ativo(s)`
              : `Total de ${blockedClients.length} cliente(s) bloqueado(s)`}
          </Typography>
        </Box>
        <Box display="flex" gap={2} flexDirection={{ xs: "column", sm: "row" }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchAllData}
            fullWidth={isMobile}
          >
            Atualizar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={createClient}
            fullWidth={isMobile}
            sx={{
              background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)",
              },
            }}
          >
            Novo Cliente
          </Button>
        </Box>
      </Box>

      {/* Search Bar */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Pesquisar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={clearSearch} edge="end">
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Campo de busca</InputLabel>
              <Select
                value={searchField}
                label="Campo de busca"
                onChange={(e) => setSearchField(e.target.value)}
              >
                <MenuItem value="all">Todos os campos</MenuItem>
                <MenuItem value="name">Nome</MenuItem>
                <MenuItem value="nif">NIF</MenuItem>
                <MenuItem value="id">ID do Cliente</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" color="text.secondary">
                Resultados:
              </Typography>
              <Chip
                label={
                  activeTab === 0
                    ? `${filteredActiveClients.length} de ${activeClients.length}`
                    : `${filteredBlockedClients.length} de ${blockedClients.length}`
                }
                size="small"
                color="primary"
                variant="outlined"
              />
              {searchTerm && (
                <Button
                  size="small"
                  onClick={clearSearch}
                  startIcon={<ClearIcon />}
                >
                  Limpar
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
          <Tab
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <PersonIcon fontSize="small" />
                <span>Clientes Ativos ({activeClients.length})</span>
              </Box>
            }
          />
          <Tab
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <LockIcon fontSize="small" />
                <span>Clientes Bloqueados ({blockedClients.length})</span>
              </Box>
            }
          />
        </Tabs>
      </Card>

      {/* Clients List */}
      {activeTab === 0 ? (
        // Active Clients Tab - Mostrar apenas clientes não bloqueados
        isMobile ? (
          // Mobile View - Cards
          <Box>
            {filteredActiveClients.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  {searchTerm ? (
                    <>
                      <Typography variant="h6" color="gray.500" gutterBottom>
                        Nenhum cliente encontrado
                      </Typography>
                      <Typography variant="body2" color="gray.500">
                        Não foram encontrados clientes para "{searchTerm}"
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={clearSearch}
                        sx={{ mt: 2 }}
                      >
                        Limpar pesquisa
                      </Button>
                    </>
                  ) : (
                    <Typography variant="h6" color="gray.500">
                      Nenhum cliente ativo encontrado
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredActiveClients.map((client) => (
                <ClientCard key={client.client_id} client={client} />
              ))
            )}
          </Box>
        ) : (
          // Desktop View - Table
          <Card>
            <CardContent>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                      <TableCell sx={{ fontWeight: "bold", color: "#374151" }}>
                        Cliente
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#374151" }}>
                        NIF
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#374151" }}>
                        Contactos
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#374151" }}>
                        Endereços
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#374151" }}>
                        Licenças
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#374151" }}>
                        Data de Criação
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          color: "#374151",
                          textAlign: "center",
                        }}
                      >
                        Ações
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredActiveClients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          {searchTerm ? (
                            <Box>
                              <Typography
                                variant="h6"
                                color="gray.500"
                                gutterBottom
                              >
                                Nenhum cliente encontrado
                              </Typography>
                              <Typography
                                variant="body2"
                                color="gray.500"
                                gutterBottom
                              >
                                Não foram encontrados clientes para "
                                {searchTerm}"
                              </Typography>
                              <Button
                                variant="outlined"
                                onClick={clearSearch}
                                size="small"
                              >
                                Limpar pesquisa
                              </Button>
                            </Box>
                          ) : (
                            <Typography variant="h6" color="gray.500">
                              Nenhum cliente ativo encontrado
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredActiveClients.map((client) => (
                        <TableRow
                          key={client.client_id}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#f8fafc",
                            },
                          }}
                        >
                          <TableCell>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {client.clientName}
                              </Typography>
                              <Typography variant="caption" color="gray.600">
                                ID: {client.client_id}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {client.nif}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={`${client.contact?.length || 0} contatos`}
                              color="primary"
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={`${client.address?.length || 0} endereços`}
                              color="secondary"
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={`${
                                client.licenseData?.length || 0
                              } licenças`}
                              color="success"
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDate(client.publishedAt)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" justifyContent="center" gap={1}>
                              <IconButton
                                size="small"
                                onClick={() => viewClient(client.client_id)}
                                sx={{
                                  color: "#3B82F6",
                                  "&:hover": {
                                    backgroundColor: "#DBEAFE",
                                  },
                                }}
                              >
                                <ViewIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => editClient(client.client_id)}
                                sx={{
                                  color: "#10B981",
                                  "&:hover": {
                                    backgroundColor: "#D1FAE5",
                                  },
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  confirmBlockAction(client, "block")
                                }
                                sx={{
                                  color: "#F59E0B",
                                  "&:hover": {
                                    backgroundColor: "#FEF3C7",
                                  },
                                }}
                              >
                                <BlockIcon />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )
      ) : // Blocked Clients Tab
      isMobile ? (
        // Mobile View - Cards
        <Box>
          {filteredBlockedClients.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                {searchTerm ? (
                  <>
                    <Typography variant="h6" color="gray.500" gutterBottom>
                      Nenhum cliente bloqueado encontrado
                    </Typography>
                    <Typography variant="body2" color="gray.500">
                      Não foram encontrados clientes bloqueados para "
                      {searchTerm}"
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={clearSearch}
                      sx={{ mt: 2 }}
                    >
                      Limpar pesquisa
                    </Button>
                  </>
                ) : (
                  <Typography variant="h6" color="gray.500">
                    Nenhum cliente bloqueado encontrado
                  </Typography>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredBlockedClients.map((client) => (
              <BlockedClientCard
                key={client.cliente.client_id}
                client={client}
              />
            ))
          )}
        </Box>
      ) : (
        // Desktop View - Table
        <Card>
          <CardContent>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#fef2f2" }}>
                    <TableCell sx={{ fontWeight: "bold", color: "#374151" }}>
                      Cliente
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#374151" }}>
                      NIF
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#374151" }}>
                      Motivo do Bloqueio
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#374151" }}>
                      Data do Bloqueio
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#374151" }}>
                      Contactos
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#374151" }}>
                      Endereços
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "#374151",
                        textAlign: "center",
                      }}
                    >
                      Ações
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBlockedClients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        {searchTerm ? (
                          <Box>
                            <Typography
                              variant="h6"
                              color="gray.500"
                              gutterBottom
                            >
                              Nenhum cliente bloqueado encontrado
                            </Typography>
                            <Typography
                              variant="body2"
                              color="gray.500"
                              gutterBottom
                            >
                              Não foram encontrados clientes bloqueados para "
                              {searchTerm}"
                            </Typography>
                            <Button
                              variant="outlined"
                              onClick={clearSearch}
                              size="small"
                            >
                              Limpar pesquisa
                            </Button>
                          </Box>
                        ) : (
                          <Typography variant="h6" color="gray.500">
                            Nenhum cliente bloqueado encontrado
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBlockedClients.map((client) => (
                      <TableRow
                        key={client.cliente.client_id}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#fef2f2",
                          },
                        }}
                      >
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {client.cliente.clientName}
                            </Typography>
                            <Typography variant="caption" color="gray.600">
                              ID: {client.cliente.client_id}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {client.cliente.nif}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="error.main">
                            {client.cliente.blockReason ||
                              "Sem motivo especificado"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {client.cliente.blockedAt
                              ? formatDate(client.cliente.blockedAt)
                              : "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${client.contatos?.length || 0} contatos`}
                            color="primary"
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${client.enderecos?.length || 0} endereços`}
                            color="secondary"
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" justifyContent="center" gap={1}>
                            <IconButton
                              size="small"
                              onClick={() =>
                                viewClient(client.cliente.client_id)
                              }
                              sx={{
                                color: "#3B82F6",
                                "&:hover": {
                                  backgroundColor: "#DBEAFE",
                                },
                              }}
                            >
                              <ViewIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() =>
                                confirmBlockAction(client.cliente, "unblock")
                              }
                              sx={{
                                color: "#10B981",
                                "&:hover": {
                                  backgroundColor: "#D1FAE5",
                                },
                              }}
                            >
                              <UnlockIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Block/Unblock Confirmation Dialog */}
      <Dialog
        open={blockDialog.open}
        onClose={closeBlockDialog}
        aria-labelledby="block-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="block-dialog-title">
          {blockDialog.action === "block"
            ? "Bloquear Cliente"
            : "Desbloquear Cliente"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {blockDialog.action === "block"
              ? `Tem certeza que deseja bloquear o cliente <strong>${blockDialog.client?.clientName}</strong>?`
              : `Tem certeza que deseja desbloquear o cliente <strong>${blockDialog.client?.clientName}</strong>?`}
          </DialogContentText>

          {blockDialog.action === "block" && (
            <TextField
              autoFocus
              margin="dense"
              label="Motivo do bloqueio (opcional)"
              type="text"
              fullWidth
              variant="outlined"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              sx={{ mt: 2 }}
              placeholder="Digite o motivo do bloqueio..."
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeBlockDialog} disabled={blockLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleBlockAction}
            color={blockDialog.action === "block" ? "warning" : "success"}
            variant="contained"
            disabled={blockLoading}
            startIcon={
              blockDialog.action === "block" ? <BlockIcon /> : <UnlockIcon />
            }
          >
            {blockLoading
              ? "Processando..."
              : blockDialog.action === "block"
              ? "Bloquear"
              : "Desbloquear"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Clients;
