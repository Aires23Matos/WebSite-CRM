// pages/contacts/ViewContact.js
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
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';

const ViewContact = () => {
  const { contact_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contact, setContact] = useState(null);

  useEffect(() => {
    fetchContact();
  }, [contact_id]);

  const fetchContact = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/v1/contact/${contact_id}`);
      setContact(response.data.data);
    } catch (err) {
      setError('Erro ao carregar dados do contacto');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este contacto?')) {
      try {
        await axios.delete(`http://localhost:3000/api/v1/contact/contacts/${contact_id}`);
        navigate('/clients');
      } catch (err) {
        setError('Erro ao excluir contacto');
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

  if (!contact) {
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        Contacto não encontrado
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
            Detalhes do Contacto
          </Typography>
        </Box>
        
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/edit-contact/${contact_id}`)}
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
              <Typography variant="h6" gutterBottom>Informações do Contacto</Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <EmailIcon color="primary" />
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                  </Box>
                  <Typography variant="body1">{contact.email}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <PhoneIcon color="primary" />
                    <Typography variant="body2" color="text.secondary">Telefone</Typography>
                  </Box>
                  <Typography variant="body1">{contact.telefone}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>Status</Typography>
                  <Chip 
                    label={contact.isPrincipal ? "Contacto Principal" : "Contacto Secundário"} 
                    color={contact.isPrincipal ? "primary" : "default"}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>Cliente</Typography>
                  <Typography variant="body1">{contact.client_id}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default ViewContact;