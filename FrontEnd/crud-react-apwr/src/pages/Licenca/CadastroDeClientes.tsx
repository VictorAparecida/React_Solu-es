import React, { useState } from 'react';
import { Container, TextField, Button, CircularProgress, Box, Snackbar, Grid, MenuItem, Paper, IconButton, Divider, Typography, useMediaQuery, useTheme} from '@mui/material';
import axios from 'axios';
import { Save } from '@mui/icons-material';
import MainLayout from '../../shareds/layouts/MainLayout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { formatISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface ClienteData {
    clienteId: string;
    email: string;
    cnpjCpf: string;
    nome: string;
    nomeEmpresa: string;
    telefone: string;
    tipoLicenca: string;
    licenca: string;
    dataCadastro: string;
    dataExpira: string;
    tipo: string;
    periodo: string;
    tempo: string;
    software: string;
    ativo: string;
}

const CadastroDeClientes: React.FC = () => {
    const [clienteData, setClienteData] = useState<ClienteData>({
        clienteId: '',
        email: '',
        cnpjCpf: '',
        nome: '',
        nomeEmpresa: '',
        telefone: '',
        tipoLicenca: '',
        licenca: '',
        dataCadastro: '',
        dataExpira: '',
        tipo: '',
        periodo: '',
        tempo: '',
        software: '',
        ativo: '1'
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const navigate = useNavigate();
    const mobile = useMediaQuery('(max-width:800px)');

    const theme = useTheme(); // Acessa o tema da aplicação

    const getEndpointForSoftware = (software: number): string => {
        switch (software) {
            case 1: // AutoPower - AutoCad
                return 'https://k1m3hrvm-7068.brs.devtunnels.ms/api/licenca/CadastroCliente';
            case 2: // AutoPower - GstarCad
                return 'https://k1m3hrvm-7068.brs.devtunnels.ms/api/licenca/CadastroCliente';
            case 3: // AutoHidro - AutoCad
                return 'https://k1m3hrvm-7068.brs.devtunnels.ms/api/licenca-ahid/CadastroClienteAHID';
            case 4: // AutoHidro - GstarCad
                return 'https://k1m3hrvm-7068.brs.devtunnels.ms/api/licenca-ahid/CadastroClienteAHID';
            default:
                return '';
        }
    };

    const handleCadastroCliente = async () => {
        try {
          setLoading(true);
          const dataCadastro = formatISO(new Date());
          const expira = '';
          const license = '';
          const softwareNumber = parseInt(clienteData.software, 10);
    
          // Verifica se o número do software é válido antes de prosseguir
          if (isNaN(softwareNumber)) {
            showSnackbar('Software inválido');
            return;
          }
    
          const endpoint = getEndpointForSoftware(softwareNumber);
    
          if (!endpoint) {
            throw new Error('Endpoint inválido');
          }
    
          console.log("Dados enviados:", {
            clienteId: clienteData.clienteId,
            email: clienteData.email,
            cnpjCpf: clienteData.cnpjCpf,
            nome: clienteData.nome,
            nomeEmpresa: clienteData.nomeEmpresa,
            telefone: clienteData.telefone,
            TipoLicencaId: clienteData.tipoLicenca.toString(), // Alterado para TipoLicencaId
            Licencaid: license, // Adicionado Licencaid
            dataCadastro: dataCadastro,
            dataExpira: expira,
            tipo: clienteData.tipo,
            periodo: clienteData.periodo,
            tempo: clienteData.tempo,
            software: clienteData.software.toString(),
            ativo: '1'
          });
    
          const response = await axios.post(
            endpoint,
            {
              clienteId: clienteData.clienteId,
              email: clienteData.email,
              cnpjCpf: clienteData.cnpjCpf,
              nome: clienteData.nome,
              nomeEmpresa: clienteData.nomeEmpresa,
              telefone: clienteData.telefone,
              TipoLicencaId: clienteData.tipoLicenca.toString(), // Alterado para TipoLicencaId
              Licencaid: license, // Adicionado Licencaid
              dataCadastro: dataCadastro,
              dataExpira: expira,
              tipo: clienteData.tipo,
              periodo: clienteData.periodo,
              tempo: clienteData.tempo,
              software: clienteData.software.toString(),
              ativo: '1'
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
    
          console.log("Response data:", response.data);
          if (response.status === 200) {
            showSnackbar('Cliente cadastrado com sucesso!');
            clearForm(); // Limpa o formulário após o envio bem-sucedido
          } else {
            throw new Error('Erro ao cadastrar cliente');
          }
        } catch (error: any) {
          const errorMessage = error.response
            ? `Erro ao cadastrar cliente: ${error.response.data.message || error.message}`
            : `Erro ao cadastrar cliente: ${error.message}`;
          showSnackbar(errorMessage);
          console.error('Detalhes do erro:', error);
        } finally {
          setLoading(false);
        }
      };

    const handleInputChange = (e: React.ChangeEvent<{ value: unknown }>, field: keyof ClienteData) => {
        const { value } = e.target;
        setClienteData(prevData => ({
            ...prevData,
            [field]: value as string
        }));
    };

    const clearForm = () => {
        setClienteData({
            clienteId: '',
            email: '',
            cnpjCpf: '',
            nome: '',
            nomeEmpresa: '',
            telefone: '',
            tipoLicenca: '',
            licenca: '',
            dataCadastro: '',
            dataExpira: '',
            tipo: '',
            periodo: '',
            tempo: '',
            software: '',
            ativo: '1'
        });
    };

    const handleBack = () => {
        navigate(-1); // Navega de volta para a página anterior
    };

    const showSnackbar = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <MainLayout pageName='Cadastro de Clientes'>
            <Paper style={{ padding: "10px", marginLeft: mobile ? '13%' : '26%', marginTop: "2%", width: "95%" }}>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <IconButton color='primary' onClick={handleBack} sx={{
                        '&:hover': {
                            bgcolor: 'transparent'
                        }
                    }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant='h5' sx={{ fontFamily: 'Montserrat, Arial, sans-serif', marginLeft: '10px' }}>
                        Add Cliente Novo
                    </Typography>
                </div>
                <Divider />
                <Container>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { marginBottom: 2 },
                            '& .MuiButton-root': { marginTop: 2 },
                        }}
                    >
                        <Grid container direction="column">
                            <Typography variant='h6' sx={{ fontFamily: 'Montserrat, Arial, sans-serif', marginTop: "10px", marginBottom: "10px" }}>
                                Dados
                            </Typography>
                            <Grid container justifyContent='space-around' spacing={2}>
                                <Grid item xs={12} md={5}>
                                    <Typography sx={{ width: "169px", height: "24px", fontSize: "16px", marginBottom: "12px", fontFamily: 'Montserrat, Arial, sans-serif' }}>NOME COMPLETO</Typography>
                                    <TextField
                                        sx={{
                                            width: "300px", height: "65px",
                                            '& .MuiOutlinedInput-root': { borderRadius: '14px' },
                                        }}
                                        placeholder="Nome Completo"
                                        value={clienteData.nome}
                                        onChange={(e) => handleInputChange(e, 'nome')}
                                    />
                                </Grid>
                                <Grid item xs={12} md={7}>
                                    <Typography sx={{ width: "113px", height: "24px", fontSize: "16px", marginBottom: "12px", fontFamily: 'Montserrat, Arial, sans-serif' }}>CPF/CNPJ</Typography>
                                    <TextField
                                        sx={{
                                            width: "300px", height: "65px", borderRadius: "14px",
                                            '& .MuiOutlinedInput-root': { borderRadius: '16px' },
                                        }}
                                        placeholder="CPF/CNPJ"
                                        value={clienteData.cnpjCpf}
                                        onChange={(e) => handleInputChange(e, 'cnpjCpf')}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container justifyContent='space-around' spacing={2}>
                                <Grid item xs={12} md={5}>
                                    <Typography sx={{ width: "169px", height: "24px", fontSize: "16px", marginBottom: "12px", fontFamily: 'Montserrat, Arial, sans-serif' }}>NOME DA EMPRESA</Typography>
                                    <TextField
                                        sx={{
                                            width: "300px", height: "65px", borderRadius: "14px",
                                            '& .MuiOutlinedInput-root': { borderRadius: '16px' },
                                        }}
                                        placeholder="Nome da empresa"
                                        value={clienteData.nomeEmpresa}
                                        onChange={(e) => handleInputChange(e, 'nomeEmpresa')}
                                    />
                                    <Typography sx={{ width: "169px", height: "24px", fontSize: "16px", marginBottom: "12px", fontFamily: 'Montserrat, Arial, sans-serif' }}>SOFTWARE</Typography>
                                    <TextField
                                        sx={{
                                            width: "300px", height: "65px", borderRadius: "14px",
                                            '& .MuiOutlinedInput-root': { borderRadius: '16px' },
                                        }}
                                        select
                                        name="software"
                                        id='software'
                                        fullWidth
                                        onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement>, 'software')}
                                        value={clienteData.software}
                                        SelectProps={{
                                            displayEmpty: true,
                                            renderValue: (value: unknown) => {
                                                if (!value) return <span style={{ color: '#999999' }}>Clique e Selecione</span>;
                                                const valueMap: Record<string, string> = {
                                                    '1': 'AutoPower - AutoCad',
                                                    '2': 'AutoPower - GstarCad',
                                                    '3': 'AutoHidro - AutoCad',
                                                    '4': 'AutoHidro - GstarCad',
                                                };
                                                const selectedName = valueMap[value as string] || '';
                                                return <span>{selectedName}</span>;
                                            }
                                        }}
                                        style={{ minWidth: "230px" }}
                                    >
                                        <MenuItem value={1}>AutoPower - AutoCad</MenuItem>
                                        <MenuItem value={2}>AutoPower - GstarCad</MenuItem>
                                        <MenuItem value={3}>AutoHidro - AutoCad</MenuItem>
                                        <MenuItem value={4}>AutoHidro - GstarCad</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} md={7}>
                                    <Typography sx={{ width: "169px", height: "24px", fontSize: "16px", marginBottom: "12px", fontFamily: 'Montserrat, Arial, sans-serif' }}>TIPO DE LICENÇA</Typography>
                                    <TextField
                                        sx={{
                                            width: "300px", height: "65px", borderRadius: "14px",
                                            '& .MuiOutlinedInput-root': { borderRadius: '16px' },
                                        }}
                                        select
                                        name="tipo-licenca"
                                        id='tipo_licenca'
                                        fullWidth
                                        onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement>, 'tipoLicenca')}
                                        value={clienteData.tipoLicenca}
                                        SelectProps={{
                                            displayEmpty: true,
                                            renderValue: (value: unknown) => {
                                                if (!value) return <span style={{ color: '#999999' }}>Clique e Selecione</span>;
                                                const valueMap: Record<string, string> = {
                                                    '1': 'Mensal',
                                                    '2': 'Semestral',
                                                    '3': 'Anual',
                                                    '4': 'Vitalícia',
                                                    '5': 'Temporária'
                                                };
                                                const selectedName = valueMap[value as string] || '';
                                                return <span>{selectedName}</span>;
                                            }
                                        }}
                                        style={{ minWidth: "230px" }}
                                    >
                                        <MenuItem value={1}>Mensal</MenuItem>
                                        <MenuItem value={2}>Semestral</MenuItem>
                                        <MenuItem value={3}>Anual</MenuItem>
                                        <MenuItem value={4}>Vitalícia</MenuItem>
                                        <MenuItem value={5}>Temporária</MenuItem>
                                    </TextField>
                                </Grid>

                            </Grid>
                            <Typography variant='h6' sx={{ fontFamily: 'Montserrat, Arial, sans-serif', marginTop: "10px", marginBottom: "10px" }}>
                                Contatos
                            </Typography>
                            <Grid container justifyContent='space-around' spacing={2}>
                                <Grid item xs={12} md={5}>
                                    <Typography sx={{ width: "113px", height: "24px", fontSize: "16px", marginBottom: "12px", fontFamily: 'Montserrat, Arial, sans-serif' }}>E-MAIL</Typography>
                                    <TextField
                                        sx={{
                                            width: "300px", height: "65px", borderRadius: "14px",
                                            '& .MuiOutlinedInput-root': { borderRadius: '16px' },
                                        }}
                                        placeholder="E-mail"
                                        value={clienteData.email}
                                        onChange={(e) => handleInputChange(e, 'email')}
                                    />
                                </Grid>
                                <Grid item xs={12} md={7}>
                                    <Typography sx={{ width: "113px", height: "24px", fontSize: "16px", marginBottom: "12px", fontFamily: 'Montserrat, Arial, sans-serif' }}>CELULAR/TELEFONE</Typography>
                                    <TextField
                                        sx={{
                                            width: "300px", height: "65px", borderRadius: "14px",
                                            '& .MuiOutlinedInput-root': { borderRadius: '16px' },
                                        }}
                                        placeholder="Celular/Telefone"
                                        value={clienteData.telefone}
                                        onChange={(e) => handleInputChange(e, 'telefone')}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={6} md={8}>
                                <Button
                                    variant="contained"
                                    onClick={handleCadastroCliente}
                                    disabled={loading}
                                    startIcon={<Save />}
                                    sx={{ marginTop: '20px', color: theme.palette.secondary.light }}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Salvar'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbar}
                        message={snackbarMessage}
                    />
                </Container>
            </Paper>
        </MainLayout>
    );
};

export default CadastroDeClientes;