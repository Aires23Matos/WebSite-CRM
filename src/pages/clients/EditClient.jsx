// pages/EditClient.js
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
  Paper,
  Divider,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { urlApi } from "../../../public/url/url";

// const url = 'http://localhost:3000';

const url = urlApi;

const EditClient = () => {
  const navigate = useNavigate();
  const { client_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    clientName: "",
    nif: "",
  });

  const [errors, setErrors] = useState({
    clientName: "",
    nif: "",
  });

  // Carregar dados do cliente
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await axios.get(
          `${url}/api/v1/client/getById/${client_id}`
        );
        const client = response.data.data;

        setFormData({
          clientName: client.clientName || "",
          nif: client.nif || "",
        });
      } catch (err) {
        console.error("Erro ao carregar cliente:", err);
        setError("Erro ao carregar dados do cliente");
      } finally {
        setLoading(false);
      }
    };

    if (client_id) {
      fetchClient();
    }
  }, [client_id]);

  const validateForm = () => {
    const newErrors = {
      clientName: "",
      nif: "",
    };

    let isValid = true;

    if (!formData.clientName.trim()) {
      newErrors.clientName = "Nome do cliente é obrigatório";
      isValid = false;
    } else if (formData.clientName.trim().length < 2) {
      newErrors.clientName = "Nome deve ter pelo menos 2 caracteres";
      isValid = false;
    }

    if (!formData.nif) {
      newErrors.nif = "NIF é obrigatório";
      isValid = false;
    } else if (formData.nif.length < 9) {
      newErrors.nif = "NIF deve ter pelo menos 9 dígitos";
      isValid = false;
    } else if (!/^\d+$/.test(formData.nif)) {
      newErrors.nif = "NIF deve conter apenas números";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        clientName: formData.clientName.trim(),
        nif: formData.nif,
      };

      const response = await axios.put(
        `${url}/api/v1/client/update/${client_id}`,
        payload
      );

      setSuccess(response.data.message || "Cliente atualizado com sucesso!");

      // Redirecionar após sucesso
      setTimeout(() => {
        navigate("/register-client");
      }, 2000);
    } catch (err) {
      console.error("Erro ao atualizar cliente:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.code === "NETWORK_ERROR") {
        setError("Erro de conexão. Verifique se o servidor está rodando.");
      } else {
        setError("Erro ao atualizar cliente. Tente novamente.");
      }
    } finally {
      setSaving(false);
    }
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
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        gap={2}
        mb={4}
      >
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          flexDirection={{ xs: "column", sm: "row" }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/register-client")}
            sx={{ alignSelf: { xs: "stretch", sm: "flex-start" } }}
          >
            Voltar
          </Button>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            textAlign={{ xs: "center", sm: "left" }}
          >
            Editar Cliente
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={6}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <PersonAddIcon color="primary" />
                <Typography variant="h5" component="h2">
                  Editar Informações do Cliente
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {error && (
                <Alert
                  severity="error"
                  sx={{ mb: 3 }}
                  onClose={() => setError("")}
                >
                  {error}
                </Alert>
              )}

              {success && (
                <Alert
                  severity="success"
                  sx={{ mb: 3 }}
                  onClose={() => setSuccess("")}
                >
                  {success}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nome do Cliente *"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleChange}
                      error={!!errors.clientName}
                      helperText={errors.clientName}
                      disabled={saving}
                      placeholder="Digite o nome completo do cliente"
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1, color: "text.secondary" }}>•</Box>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="NIF *"
                      name="nif"
                      type="text"
                      value={formData.nif}
                      onChange={handleChange}
                      error={!!errors.nif}
                      helperText={
                        errors.nif ||
                        "Número de Identificação Fiscal (9 dígitos)"
                      }
                      disabled={saving}
                      placeholder="123456789"
                      variant="outlined"
                      inputProps={{
                        maxLength: 9,
                        inputMode: "numeric",
                      }}
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1, color: "text.secondary" }}>•</Box>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box
                      display="flex"
                      gap={2}
                      justifyContent="flex-end"
                      flexDirection={{ xs: "column", sm: "row" }}
                    >
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() => navigate("/register-client")}
                        disabled={saving}
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={
                          saving ? <CircularProgress size={20} /> : <SaveIcon />
                        }
                        disabled={saving}
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                      >
                        {saving ? "Atualizando..." : "Atualizar Cliente"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4} lg={6}>
          <Paper variant="outlined" sx={{ p: 3, height: "fit-content" }}>
            <Typography variant="h6" gutterBottom color="primary">
              💡 Informações da Edição
            </Typography>

            <Box component="ul" sx={{ pl: 2, "& li": { mb: 1 } }}>
              <Typography component="li" variant="body2">
                <strong>Nome do Cliente:</strong> Pode ser atualizado para
                refletir mudanças na razão social
              </Typography>
              <Typography component="li" variant="body2">
                <strong>NIF:</strong> Campo de identificação único, geralmente
                não alterável
              </Typography>
              <Typography component="li" variant="body2">
                <strong>Verificação:</strong> Os dados serão validados antes da
                atualização
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="text.secondary">
              ⚠️ <strong>Atenção:</strong> Alterações no NIF podem afetar a
              integridade dos dados relacionados a este cliente.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default EditClient;
