import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Divider,
    Paper,
    Box,
    CircularProgress,
    Grid,
    IconButton,
    Snackbar,
    useMediaQuery,
    useTheme,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    MenuItem,
} from '@mui/material';
import axios from 'axios';
import { Save } from '@mui/icons-material';
import MainLayout from '../../shareds/layouts/MainLayout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { format, addDays, addMonths, addYears, isValid } from 'date-fns';

interface ClienteParams {
    [key: string]: string | undefined;
    clienteId: string;
}

interface Licenca {
    licencaId: string;
    software: string;
    tipoLicenca: string;
    periodo: string;
    maquinaVinculada: boolean;
    dataVinculo: string;
    licencaList: string;
    dataCadastro: string;
}

interface Cliente {
    clienteId: string;
    nome: string;
    email: string;
    cnpjCpf: string;
    nomeEmpresa: string;
    telefone: string;
    licencas: Licenca[];
}

interface ClienteData {
    software: string;
    tipoLicenca: string;
}

const DadosDoCliente: React.FC = () => {
    const { clienteId } = useParams<ClienteParams>();
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [clienteData, setClienteData] = useState<ClienteData>({
        tipoLicenca: '',
        software: ''
    });
    const navigate = useNavigate();
    const mobile = useMediaQuery('(max-width:800px)');
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleIncluir = async () => {
        try {
           console.log("Dados recebidos:", clienteData.software);
            const incluirUrl = clienteData.software === '1' || clienteData.software === '2'
                ? 'https://k1m3hrvm-7068.brs.devtunnels.ms/api/licenca/GerarNovaLicenca'
                : 'https://k1m3hrvm-7068.brs.devtunnels.ms/api/licenca-ahid/GerarNovaLicencaAHID';

            const response = await axios.post(
                `${incluirUrl}?clienteId=${clienteId}&tipoId=${clienteData.tipoLicenca}&softwareId=${clienteData.software}`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                setSnackbarMessage('Licença incluída com sucesso!');
                setSnackbarOpen(true);
            } else {
                throw new Error('Erro ao incluir licença');
            }
        } catch (error) {
            console.error('Erro ao incluir licença:', error);
            setSnackbarMessage('Erro ao incluir licença: ' + error);
            setSnackbarOpen(true);
        } finally {
            handleClose();
        }
    };

    useEffect(() => {
        const fetchCliente = async () => {
            try {
                setLoading(true);
                console.log("Dados para obter o cliente:", clienteData);
                const obterClienteUrl = clienteData.software === '1' || clienteData.software === '2'
                    ? `https://k1m3hrvm-7068.brs.devtunnels.ms/api/licenca-ahid/ObterClienteAHID?clienteId=${clienteId}`
                    : `https://k1m3hrvm-7068.brs.devtunnels.ms/api/licenca/ObterCliente?clienteId=${clienteId}` ;
    
                   
                const response = await axios.get(obterClienteUrl);
    
                if (response.status !== 200) {
                    throw new Error('Erro ao buscar dados do cliente');
                }
    
                const data: Cliente = response.data;
    
                console.log('Dados do cliente recebidos:', data); // Log dos dados do cliente
    
                const verificarLicencaUrl = clienteData.software === '1' || clienteData.software === '2'
                    ? 'https://k1m3hrvm-7068.brs.devtunnels.ms/api/licenca-ahid/VerificarLicencaVinculadaAHID'
                    : 'https://k1m3hrvm-7068.brs.devtunnels.ms/api/licenca/VerificarLicencaVinculada';
                  
                for (const licenca of data.licencas) {
                    const responseLicenca = await axios.get(`${verificarLicencaUrl}?clienteId=${clienteId}`);
                    const licencaVinculada = responseLicenca.data;
    
                    console.log('Licença recebida:', licenca); // Log de licença individual
                    console.log('Resposta de verificação de licença:', licencaVinculada); // Log da resposta da verificação de licença
    
                    licenca.maquinaVinculada = licencaVinculada.some((item: any) => item.clienteId === clienteId && item.licencaId === licenca.licencaId);
    
                    // Formatação da data de cadastro e cálculo do período de validade da licença
                    const dataCadastro = new Date(licenca.dataCadastro);
                    const tipoExpira = licenca.tipoLicenca;
    
                    console.log('Data de cadastro:', dataCadastro); // Log da data de cadastro
                    console.log('Tipo de expiração:', tipoExpira); // Log do tipo de expiração
    
                    if (!isValid(dataCadastro)) {
                        console.error('Data de cadastro inválida para a licença:', licenca.licencaId);
                        continue;
                    }
    
                    let dataExpira: Date;
    
                    switch (tipoExpira) {
                        case 'Mensal':
                            dataExpira = addDays(dataCadastro, 30);
                            break;
                        case 'Semestral':
                            dataExpira = addMonths(dataCadastro, 6);
                            break;
                        case 'Anual':
                            dataExpira = addYears(dataCadastro, 1);
                            break;
                        case 'Vitalicio':
                            dataExpira = new Date('9999-12-31');
                            break;
                        default:
                            console.error('Tipo de expiração desconhecido para a licença:', licenca.licencaId);
                            continue;
                    }
    
                    licenca.periodo = `${format(dataCadastro, 'dd/MM/yyyy')} à ${format(dataExpira, 'dd/MM/yyyy')}`;
                    console.log('Período formatado para a licença:', licenca.periodo); // Log do período formatado
                }
    
                setCliente(data);
            } catch (error) {
                console.error('Erro ao buscar dados do cliente:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchCliente();
    }, [clienteId]);
    


    const handleDesvincularLicenca = async (clienteId: string) => {
        try {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Determina a URL para verificação de licença com base no software
            const verificarLicencaUrl = clienteData.software === '1' || clienteData.software === '2'
                ? 'https://k1m3hrvm-7068.brs.devtunnels.ms/api/licenca/VerificarLicencaVinculada'
                : 'https://k1m3hrvm-7068.brs.devtunnels.ms/api/licenca-ahid/VerificarLicencaVinculadaAHID';

            // Determina a URL para desvinculação com base no software
            const desvincularUrl = clienteData.software === '1' || clienteData.software === '2'
                ? 'https://k1m3hrvm-7068.brs.devtunnels.ms/api/licenca/DesvincularMaquina'
                : 'https://k1m3hrvm-7068.brs.devtunnels.ms/api/licenca-ahid/DesvincularMaquinaAHID';

            const responseVinculo = await axios.get(`${verificarLicencaUrl}?clienteId=${clienteId}`);

            const data = responseVinculo.data;

            const licenca = data.find((item: any) => item.clienteId === clienteId);

            if (!licenca) {
                throw new Error('Cliente não possui uma licença vinculada');
            }

            const responseDesvinculacao = await axios.post(
                `${desvincularUrl}?maquinaCliente=${licenca.maquina}`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (responseDesvinculacao.status === 200) {
                setSnackbarMessage('Máquina desvinculada com sucesso!');
                setSnackbarOpen(true);
            } else {
                throw new Error('Erro ao desvincular máquina');
            }
        } catch (error) {
            console.error('Erro ao desvincular máquina:', error);
            setSnackbarMessage('Erro ao desvincular máquina: ' + error);
            setSnackbarOpen(true);
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

    const handleBack = () => {
        navigate(-1); // Navega de volta para a página anterior
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    if (loading || !cliente) {
        return (
            <MainLayout pageName='Lista De Clientes'>
                <CircularProgress style={{ marginTop: '20px' }} />
            </MainLayout>
        );
    }

    return (
        <MainLayout pageName='Lista de Clientes'>
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
                        <strong>{cliente.nome}</strong>
                    </Typography>
                </div>
                <Divider sx={{
                    marginBottom: "20px"
                }} />
                <Container>
                    <Box
                        component="form"
                        sx={{
                            '&.MuiTextField-root': { marginBottom: 2 },
                            '&.MuiButton-root': { marginTop: 2 },
                        }}
                    >
                        <Grid container direction="column">
                            <Grid container justifyContent='space-around' spacing={2}>
                                <Grid item xs={12} md={5}>
                                    <Typography sx={{ width: "120px", height: "24px", fontSize: "20px", marginBottom: "5px", fontWeight: 'bold', fontFamily: 'Montserrat, Arial, sans-serif' }}>CPF/CNPJ </Typography>
                                    <Typography sx={{ textAlign: 'left', margin: '10px' }}>
                                        {cliente.cnpjCpf}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={7}>
                                    <Typography sx={{ width: "210px", height: "24px", fontSize: "20px", marginBottom: "5px", fontWeight: 'bold', fontFamily: 'Montserrat, Arial, sans-serif' }}>NOME DA EMPRESA </Typography>
                                    <Typography sx={{ textAlign: 'left', margin: '10px' }}>
                                        {cliente.nomeEmpresa}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container justifyContent='space-around' spacing={2}>
                                <Grid item xs={12} md={5}>
                                    <Typography sx={{ width: "120px", height: "24px", fontSize: "20px", marginBottom: "5px", fontWeight: 'bold', fontFamily: 'Montserrat, Arial, sans-serif' }}>E-MAIL </Typography>
                                    <Typography sx={{ textAlign: 'left', margin: '10px' }}>
                                        {cliente.email}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={7}>
                                    <Typography sx={{ width: "110px", height: "24px", fontSize: "20px", marginBottom: "5px", fontWeight: 'bold', fontFamily: 'Montserrat, Arial, sans-serif' }}>CELULAR/TELEFONE </Typography>
                                    <Typography sx={{ textAlign: 'left', margin: '10px' }}>
                                        {cliente.telefone}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Typography variant='h6' sx={{ fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 'bold', marginTop: "10px", marginBottom: "10px" }}>
                                Licença(s) :
                            </Typography>
                            <TableContainer component={Paper}>
                                <div style={{ overflow: 'auto', maxHeight: '500px', maxWidth: '1000px' }}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{ width: '70px' }}>Software</TableCell>
                                                <TableCell align="left" style={{ width: '10px' }}>Tipo</TableCell>
                                                <TableCell align="left" style={{ width: '10px' }}>Período</TableCell>
                                                <TableCell align="left" style={{ width: '150px' }}>Máquina Vinculada</TableCell>
                                                <TableCell align="left" style={{ width: '100px' }}>Data Vínculo</TableCell>
                                                <TableCell align="left" style={{ width: '200px' }}>Número de Licença</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {cliente.licencas.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell component="th" scope="row">
                                                        {row.software}
                                                    </TableCell>
                                                    <TableCell align="left">{row.tipoLicenca}</TableCell>
                                                    <TableCell align="left">{row.periodo}</TableCell>
                                                    <TableCell align="left" style={{ fontSize: '12px' }}>{row.maquinaVinculada ? 'Sim' : 'Não'}</TableCell>
                                                    <TableCell align="left">{row.dataVinculo ? row.dataVinculo : 'N/A'}</TableCell>
                                                    <TableCell align="left" style={{ fontSize: '12px' }}>{row.licencaList}</TableCell>
                                                    <TableCell align="center">
                                                        <Button
                                                            onClick={() => handleDesvincularLicenca(cliente.clienteId)}
                                                            variant="contained"
                                                            color="error"
                                                            disabled={loading || !row.maquinaVinculada}
                                                        >
                                                            {loading ? <CircularProgress size={24} /> : 'Desvincular'}
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>

                                    </Table>
                                </div>
                            </TableContainer>
                            <Grid item xs={6} md={8}>
                                <Button
                                    variant="contained"
                                    disabled={loading}
                                    startIcon={<Save />}
                                    sx={{ marginTop: '20px', color: theme.palette.secondary.light }}
                                    onClick={handleOpen}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Incluir'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>

                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Incluir Nova Licença</DialogTitle>
                        <DialogContent>
                            <Typography sx={{ width: "169px", height: "24px", fontSize: "16px", marginBottom: "12px", fontFamily: 'Montserrat, Arial, sans-serif' }}>SOFTWARE:</Typography>
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
                                            '0': 'Nenhuma selecionada',
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
                            <Typography sx={{ width: "169px", height: "24px", fontSize: "16px", marginBottom: "12px", fontFamily: 'Montserrat, Arial, sans-serif' }}>TIPO DE LICENÇA:</Typography>
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
                                            '0': 'Nenhuma selecionada',
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
                        </DialogContent>
                        <DialogActions >
                            <Button onClick={handleClose} sx={{ marginRight: "90px", marginBottom: "10px" }}>Cancelar</Button>
                            <Button onClick={handleIncluir} variant="contained" sx={{ color: "white", marginBottom: "10px", marginRight: "16px" }} startIcon={<Save />}>Incluir</Button>
                        </DialogActions>
                    </Dialog>

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

export default DadosDoCliente;
