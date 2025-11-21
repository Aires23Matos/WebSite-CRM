import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  Dashboard as DashboardIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  PlayArrow as PlayArrowIcon,
} from "@mui/icons-material";

const Home = ({ user, error }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const features = [
    {
      icon: <BusinessIcon sx={{ fontSize: 40 }} />,
      title: "Gestão Completa de Clientes",
      description:
        "Organize todos os dados dos seus clientes em um só lugar com nossa plataforma intuitiva.",
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: "Segurança Avançada",
      description:
        "Seus dados estão protegidos com criptografia de última geração e backups automáticos.",
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      title: "Relatórios Detalhados",
      description:
        "Obtenha insights valiosos com relatórios personalizados e análises em tempo real.",
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: "Performance Otimizada",
      description:
        "Interface rápida e responsiva que funciona perfeitamente em todos os dispositivos.",
    },
  ];

  const stats = [
    { number: "500+", label: "Clientes Ativos" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Suporte" },
    { number: "50+", label: "Funcionalidades" },
  ];

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 8, md: 12 },
          pb: { xs: 12, md: 20 },
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Elements */}
        <Box
          sx={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            [theme.breakpoints.down("md")]: {
              width: 300,
              height: 300,
              top: -50,
              right: -50,
            },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -150,
            left: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            [theme.breakpoints.down("md")]: {
              width: 300,
              height: 300,
              bottom: -100,
              left: -50,
            },
          }}
        />

        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ position: "relative", zIndex: 1 }}>
                {/* Badge */}
                <Paper
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 1,
                    mb: 3,
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 3,
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <PlayArrowIcon sx={{ fontSize: 16 }} />
                  <Typography variant="body2" fontWeight="medium">
                    ZenCRM Moderno
                  </Typography>
                </Paper>

                {/* Main Heading */}
                <Typography
                  variant={isMobile ? "h3" : "h2"}
                  component="h1"
                  fontWeight="bold"
                  gutterBottom
                  sx={{
                    textShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    lineHeight: 1.2,
                  }}
                >
                  ZenCRM{" "}
                  <Box
                    component="span"
                    sx={{
                      background: "linear-gradient(45deg, #FFD700, #FFA500)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    Inteligente
                  </Box>
                </Typography>

                {/* Subtitle */}
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  component="p"
                  sx={{
                    mb: 4,
                    opacity: 0.9,
                    fontWeight: 300,
                    lineHeight: 1.6,
                  }}
                >
                  Transforme a maneira como você gerencia seus clientes com
                  nossa plataforma completa e intuitiva. Eficiência e
                  organização em um só lugar.
                </Typography>

                {/* CTA Buttons */}
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleGetStarted}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: "1.1rem",
                      background: "linear-gradient(45deg, #FFD700, #FFA500)",
                      color: "#333",
                      fontWeight: "bold",
                      borderRadius: 3,
                      boxShadow: "0 8px 25px rgba(255,215,0,0.3)",
                      "&:hover": {
                        background: "linear-gradient(45deg, #FFC400, #FF8C00)",
                        boxShadow: "0 12px 35px rgba(255,215,0,0.4)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {user ? "Ir para Dashboard" : "Começar Agora"}
                  </Button>

                  {!user && (
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate("/register")}
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: "1.1rem",
                        borderColor: "white",
                        color: "white",
                        borderRadius: 3,
                        "&:hover": {
                          background: "rgba(255,255,255,0.1)",
                          borderColor: "white",
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Criar Conta
                    </Button>
                  )}
                </Box>

                {/* Stats */}
                <Box sx={{ display: "flex", gap: 4, mt: 6, flexWrap: "wrap" }}>
                  {stats.map((stat, index) => (
                    <Box key={index} sx={{ textAlign: "center" }}>
                      <Typography
                        variant="h4"
                        component="div"
                        fontWeight="bold"
                      >
                        {stat.number}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Hero Image/Illustration */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                  textAlign: "center",
                }}
              >
                <Paper
                  sx={{
                    p: 4,
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(20px)",
                    borderRadius: 4,
                    border: "1px solid rgba(255,255,255,0.2)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: 300,
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)",
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <DashboardIcon sx={{ fontSize: 80, opacity: 0.7 }} />
                    <Typography variant="h6" sx={{ opacity: 0.8 }}>
                      Dashboard Interativo
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, background: "white" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant={isMobile ? "h4" : "h3"}
              component="h2"
              fontWeight="bold"
              gutterBottom
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Por que Escolher Nosso Sistema?
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto" }}
            >
              Descubra as funcionalidades que tornam nossa plataforma a melhor
              escolha para a gestão do seu negócio.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    borderRadius: 3,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: "center" }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 3,
                        color: "white",
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      fontWeight="bold"
                      gutterBottom
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          color: "white",
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant={isMobile ? "h4" : "h3"}
              component="h2"
              fontWeight="bold"
              gutterBottom
            >
              Pronto para Transformar sua Gestão?
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 4, opacity: 0.9, fontWeight: 300 }}
            >
              Junte-se a centenas de empresas que já estão usando nossa
              plataforma para otimizar seus processos.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleGetStarted}
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 6,
                py: 1.5,
                fontSize: "1.1rem",
                background: "white",
                color: "#f5576c",
                fontWeight: "bold",
                borderRadius: 3,
                boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                "&:hover": {
                  background: "#f8f9fa",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 35px rgba(0,0,0,0.3)",
                },
                transition: "all 0.3s ease",
              }}
            >
              {user ? "Acessar Sistema" : "Experimentar"}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, background: "#2D3748", color: "white" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <PeopleIcon sx={{ fontSize: 32 }} />
                <Typography variant="h6" fontWeight="bold">
                  GestãoClientes
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.7 }}>
                Sistema de gestão completo para o seu negócio
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  justifyContent: { md: "flex-end" },
                  flexWrap: "wrap",
                }}
              >
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  © 2025 Todos os direitos reservados
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  Termos de Serviço
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  Política de Privacidade
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Error Alert */}
      {error && (
        <Box
          sx={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 9999,
            maxWidth: 400,
          }}
        >
          <Paper
            sx={{
              p: 2,
              background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
              color: "white",
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
          >
            <Typography variant="body2" fontWeight="medium">
              {error}
            </Typography>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default Home;
