import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Container,
  useTheme,
  useMediaQuery,
  alpha,
  Tooltip,
  Skeleton,
  LinearProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch users from API
  const fetchUsers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const response = await axios.get('http://localhost:3000/api/v1/users/');
      setUsers(response.data.users || []);
      setError('');
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
      setError('Erro ao carregar lista de usuários');
      showSnackbar('Erro ao carregar usuários', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user function
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/users/delete/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
      showSnackbar('Usuário deletado com sucesso', 'success');
      setDeleteDialog({ open: false, user: null });
    } catch (err) {
      console.error('Erro ao deletar usuário:', err);
      showSnackbar('Erro ao deletar usuário', 'error');
    }
  };

  // Navigate to edit user
  const editUser = (userId) => {
    navigate(`/users/update/${userId}`);
  };

  // Navigate to view user details
  const viewUser = (userId) => {
    navigate(`/users/${userId}`);
  };

  // Navigate to create new user
  const createUser = () => {
    navigate('/users/new');
  };

  // Show snackbar notification
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Handle delete confirmation
  const confirmDelete = (user) => {
    setDeleteDialog({ open: true, user });
  };

  // Close delete dialog
  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, user: null });
  };

  // Get role color and icon
  const getRoleConfig = (role) => {
    switch (role) {
      case 'admin':
        return { 
          color: 'error', 
          icon: <AdminIcon sx={{ fontSize: 16 }} />,
          gradient: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`
        };
      case 'user':
        return { 
          color: 'primary', 
          icon: <PersonIcon sx={{ fontSize: 16 }} />,
          gradient: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
        };
      default:
        return { 
          color: 'default', 
          icon: <PersonIcon sx={{ fontSize: 16 }} />,
          gradient: `linear-gradient(135deg, ${theme.palette.grey[500]}, ${theme.palette.grey[700]})`
        };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <Box>
      {/* Header Skeleton */}
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={2} mb={4}>
        <Box flex={1}>
          <Skeleton variant="text" width="60%" height={48} />
          <Skeleton variant="text" width="40%" height={32} />
        </Box>
        <Box display="flex" gap={2}>
          <Skeleton variant="rounded" width={120} height={40} />
          <Skeleton variant="rounded" width={140} height={40} />
        </Box>
      </Box>

      {/* Table Skeleton */}
      <Card>
        <CardContent>
          <Skeleton variant="rounded" height={400} />
        </CardContent>
      </Card>
    </Box>
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 } }}>
        <LoadingSkeleton />
      </Container>
    );
  }

  if (error && users.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 } }}>
        <Card 
          sx={{ 
            textAlign: 'center',
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`
          }}
        >
          <CardContent sx={{ py: 6 }}>
            <Box sx={{ color: 'error.main', mb: 2 }}>
              <PersonIcon sx={{ fontSize: 64 }} />
            </Box>
            <Typography variant="h5" color="error" gutterBottom fontWeight="bold">
              {error}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Não foi possível carregar a lista de usuários
            </Typography>
            <Button 
              variant="contained" 
              onClick={fetchUsers}
              startIcon={<RefreshIcon />}
              sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
              }}
            >
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box 
        display="flex" 
        flexDirection={{ xs: 'column', sm: 'row' }} 
        justifyContent="space-between" 
        alignItems={{ xs: 'flex-start', sm: 'center' }} 
        gap={2} 
        mb={4}
      >
        <Box>
          <Typography 
            variant="h3" 
            component="h1" 
            fontWeight="bold" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '1.75rem', sm: '2.25rem', lg: '2.75rem' },
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}
          >
            Gestão de Usuários
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              fontSize: { xs: '0.9rem', sm: '1.1rem' },
              fontWeight: 400
            }}
          >
            Total de {users.length} usuário(s) cadastrado(s)
          </Typography>
        </Box>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Tooltip title="Atualizar lista">
            <IconButton
              onClick={() => fetchUsers(true)}
              disabled={refreshing}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.grey[100]}, ${theme.palette.grey[200]})`,
                color: theme.palette.text.primary,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.grey[200]}, ${theme.palette.grey[300]})`,
                },
                transition: 'all 0.3s ease-in-out'
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={createUser}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                transform: 'translateY(-2px)',
                boxShadow: 4
              },
              transition: 'all 0.3s ease-in-out',
              fontWeight: 600,
              px: 3
            }}
          >
            Novo Usuário
          </Button>
        </Box>
      </Box>

      {refreshing && (
        <LinearProgress 
          sx={{ 
            mb: 2,
            height: 3,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            '& .MuiLinearProgress-bar': {
              background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`
            }
          }} 
        />
      )}

      {/* Users Table */}
      <Card
        sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          overflow: 'hidden'
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <TableContainer 
            component={Paper} 
            elevation={0}
            sx={{ 
              maxHeight: isMobile ? '60vh' : '70vh',
              '&::-webkit-scrollbar': {
                width: 8,
              },
              '&::-webkit-scrollbar-track': {
                background: theme.palette.grey[100],
              },
              '&::-webkit-scrollbar-thumb': {
                background: theme.palette.primary.main,
                borderRadius: 4,
              }
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow 
                  sx={{ 
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    '& th': {
                      fontWeight: 'bold',
                      color: theme.palette.primary.dark,
                      fontSize: { xs: '0.8rem', sm: '0.9rem' },
                      py: 2,
                      borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`
                    }
                  }}
                >
                  <TableCell>Usuário</TableCell>
                  {!isMobile && <TableCell>Email</TableCell>}
                  <TableCell>Nome Completo</TableCell>
                  <TableCell>Cargo</TableCell>
                  {!isMobile && <TableCell>Data de Criação</TableCell>}
                  <TableCell sx={{ textAlign: 'center' }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isMobile ? 4 : 6} align="center" sx={{ py: 6 }}>
                      <Box sx={{ color: 'text.secondary', mb: 2 }}>
                        <PersonIcon sx={{ fontSize: 48 }} />
                      </Box>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        Nenhum usuário encontrado
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Comece cadastrando um novo usuário
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={createUser}
                        size="small"
                      >
                        Cadastrar Usuário
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => {
                    const roleConfig = getRoleConfig(user.role);
                    return (
                    <TableRow 
                      key={user._id}
                      sx={{ 
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': { 
                          backgroundColor: alpha(theme.palette.primary.main, 0.04),
                          transform: 'translateX(4px)'
                        },
                        '&:last-child td': {
                          borderBottom: 0
                        }
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Box
                            sx={{
                              width: { xs: 36, sm: 44 },
                              height: { xs: 36, sm: 44 },
                              borderRadius: '50%',
                              background: roleConfig.gradient,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: { xs: '12px', sm: '14px' },
                              mr: 2,
                              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
                            }}
                          >
                            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="600">
                              {user.username}
                            </Typography>
                            {isMobile && (
                              <Typography variant="caption" color="text.secondary">
                                {user.email}
                              </Typography>
                            )}
                            <Typography variant="caption" color="text.secondary" display="block">
                              ID: {user._id.substring(0, 8)}...
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      {!isMobile && (
                        <TableCell>
                          <Typography variant="body2">{user.email}</Typography>
                        </TableCell>
                      )}
                      <TableCell>
                        <Typography variant="body2" fontWeight="500">
                          {user.firstName} {user.lastName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={roleConfig.icon}
                          label={user.role.toUpperCase()}
                          color={roleConfig.color}
                          size="small"
                          variant="filled"
                          sx={{ 
                            fontWeight: 600,
                            background: roleConfig.gradient,
                            color: 'white',
                            '& .MuiChip-icon': {
                              color: 'white !important'
                            }
                          }}
                        />
                      </TableCell>
                      {!isMobile && (
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(user.createdAt)}
                          </Typography>
                        </TableCell>
                      )}
                      <TableCell>
                        <Box display="flex" justifyContent="center" gap={0.5}>
                          <Tooltip title="Ver detalhes">
                            <IconButton
                              size="small"
                              onClick={() => viewUser(user._id)}
                              sx={{ 
                                color: theme.palette.info.main,
                                background: alpha(theme.palette.info.main, 0.1),
                                '&:hover': { 
                                  background: alpha(theme.palette.info.main, 0.2),
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar usuário">
                            <IconButton
                              size="small"
                              onClick={() => editUser(user._id)}
                              sx={{ 
                                color: theme.palette.success.main,
                                background: alpha(theme.palette.success.main, 0.1),
                                '&:hover': { 
                                  background: alpha(theme.palette.success.main, 0.2),
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Excluir usuário">
                            <IconButton
                              size="small"
                              onClick={() => confirmDelete(user)}
                              sx={{ 
                                color: theme.palette.error.main,
                                background: alpha(theme.palette.error.main, 0.1),
                                '&:hover': { 
                                  background: alpha(theme.palette.error.main, 0.2),
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )})
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
          }
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 'bold' }}>
          <Box display="flex" alignItems="center" gap={1}>
            <DeleteIcon color="error" />
            Confirmar Exclusão
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja excluir o usuário{' '}
            <strong>{deleteDialog.user?.firstName} {deleteDialog.user?.lastName}</strong>?
            <br />
            <Typography 
              variant="caption" 
              color="error" 
              sx={{ 
                fontSize: '14px',
                fontWeight: 'medium'
              }}
            >
              Esta ação não pode ser desfeita.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={closeDeleteDialog}
            variant="outlined"
            sx={{ 
              fontWeight: 600,
              borderColor: theme.palette.grey[400]
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={() => deleteUser(deleteDialog.user?._id)} 
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            sx={{ 
              fontWeight: 600,
              background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.error.dark}, ${theme.palette.error.main})`
              }
            }}
            autoFocus
          >
            Confirmar Exclusão
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            fontWeight: 500,
            boxShadow: 4
          }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Users;