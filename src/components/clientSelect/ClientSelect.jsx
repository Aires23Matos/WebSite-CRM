// components/ClientSelect.js
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Autocomplete,
  CircularProgress,
  Box,
  Typography,
  Chip
} from '@mui/material';
import axios from 'axios';

const ClientSelect = ({ value, onChange, error, helperText, required = false }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && clients.length === 0) {
      fetchClients();
    }
  }, [open]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/v1/client/clients');
      const allClients = response.data.data.clients || [];
      
      // Filtrar apenas clientes não bloqueados
      const activeClients = allClients.filter(client => !client.isBlocked);
      setClients(activeClients);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Autocomplete
      style={{paddingRight:"130px"}}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={value}
      onChange={(event, newValue) => onChange(newValue)}
      options={clients}
      loading={loading}
      getOptionLabel={(option) => 
        typeof option === 'string' ? option : `${option.clientName} - ${option.nif}`
      }
      isOptionEqualToValue={(option, value) => 
        option.client_id === value.client_id
      }
      renderInput={(params) => (
        <TextField
          style={{width: "220%"}}
          {...params}
          label="Selecionar Cliente"
          required={required}
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Box>
            <Typography variant="body1" fontWeight="medium">
              {option.clientName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              NIF: {option.nif} | ID: {option.client_id}
            </Typography>
          </Box>
        </Box>
      )}
    />
  );
};

export default ClientSelect;