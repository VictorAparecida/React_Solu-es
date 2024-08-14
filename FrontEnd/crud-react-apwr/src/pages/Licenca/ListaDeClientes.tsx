import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Card, Avatar, CardContent, IconButton, SvgIcon, Typography, useMediaQuery, TablePagination, TextField } from '@mui/material';
import axios from 'axios';
import { addDays, addMonths, addYears, format } from 'date-fns';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import './ListaDeClientes.css';
import MainLayout from '../../shareds/layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';


interface Cliente {
    clienteId: string;
    email: string;
    nome: string;
    nomeEmpresa: string;
    telefone: string;
    tipoLicenca: string;
    licenca: string;
    maquinaCliente: string;
    dataCadastro: string;
    dataExpira: string;
    tipo: string;
    periodo: string;
    tempo: string;
    software: string;
    dataVinculo: string;
    licensaExibicao: string;
    expanded: boolean;
}

const ListaDeClientes: React.FC = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage,] = useState('');
    const [, setSelectedCliente] = useState<Cliente | null>(null);
    const navigate = useNavigate();
    const [, setLoading] = useState<boolean>(false);

    const endpoints = [
        'https://k1m3hrvm-7068.brs.devtunnels.ms/api/licenca/ListarClientesComLicencas',
        'https://k1m3hrvm-7068.brs.devtunnels.ms/api/licenca-ahid/ListarClientesComLicencasAHID'
    ];

    const verificarLicencaUrls = [
        'https://k1m3hrvm-7068.brs.devtunnels.ms/api/licenca/VerificarLicencaVinculada',
        'https://k1m3hrvm-7068.brs.devtunnels.ms/api/licenca-ahid/VerificarLicencaVinculadaAHID'
    ];

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                setLoading(true);

                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Fazendo chamadas para todos os endpoints
                const requests = endpoints.map((endpoint) => axios.get(endpoint));
                const responses = await Promise.all(requests);

                // Combina todos os clientes das respostas
                const allClientes: Cliente[] = responses.flatMap(response => response.data);

                // Remove clientes duplicados (caso haja)
                const uniqueClientes = Array.from(new Map(allClientes.map(cliente => [cliente.clienteId, cliente])).values());

                // Determina o URL de verificação de licença com base no endpoint utilizado
                const verificarLicencaUrl = verificarLicencaUrls[0]; // Assumindo que o primeiro URL é para o primeiro endpoint

                // Processa cada cliente individualmente
                const clientesCompletos: Cliente[] = await Promise.all(uniqueClientes.map(async (cliente) => {
                    try {
                        // Determina o URL de verificação de licença correto com base no endpoint utilizado
                        const url = endpoints.find(endpoint => 
                            endpoint.includes('licenca') 
                                ? verificarLicencaUrl[0] 
                                : verificarLicencaUrl[1]
                        );

                        if (!url) {
                            throw new Error('URL de verificação de licença não encontrada');
                        }

                        const responseVinculo = await axios.get(`${url}?clienteId=${cliente.clienteId}`);
                        const vinculo = responseVinculo.data;
                        cliente.maquinaCliente = vinculo.some((item: any) => item.clienteId === cliente.clienteId);

                        // Verifique se as datas são válidas antes de formatá-las
                        const dataCadastro = new Date(cliente.dataCadastro);
                        const tipoExpira = cliente.tipo;

                        // if (!isValid(dataCadastro)) {
                        //     console.error('Data de cadastro inválida para o cliente:', cliente.clienteId);
                        //     return cliente; // Retorna o cliente sem alterações se a data for inválida
                        // }

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
                                console.error('Tipo de expiração desconhecido para o cliente:', cliente.clienteId);
                                return cliente; // Retorna o cliente sem alterações se o tipo for desconhecido
                        }

                        cliente.tempo = `${format(dataCadastro, 'dd/MM/yyyy')} à ${format(dataExpira, 'dd/MM/yyyy')}`;
                        cliente.licensaExibicao = cliente.licenca.substr(0, 0);
                        cliente.expanded = false;

                        return cliente;
                    } catch (error) {
                        console.error('Erro ao verificar licença vinculada para o cliente:', cliente.clienteId, error);
                        return cliente; // Retorna o cliente sem alterações em caso de erro
                    }
                }));

                setClientes(clientesCompletos);
            } catch (error) {
                console.error('Erro ao buscar clientes com licença:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchClientes();
    }, []);

    const handleRedirectToClientData = async (cliente: Cliente) => {
        setSelectedCliente(cliente);
        
        try {
            navigate(`/dados-do-cliente/${cliente.clienteId}`);
        } catch (error) {

            console.error('Erro ao redirecionar para dados do cliente:', error);
        }
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const [searchQuery, setSearchQuery] = useState(""); // Adicione um estado para armazenar o texto de busca

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const filteredClientes = clientes.filter((cliente) => {
        const nome = cliente.nome.toLowerCase();
        const empresa = cliente.nomeEmpresa.toLowerCase();
        const email = cliente.email.toLowerCase();
        const telefone = cliente.telefone.toLowerCase();
        const searchQueryLower = searchQuery.toLowerCase();

        return (
            nome.includes(searchQueryLower) ||
            empresa.includes(searchQuery) ||
            email.includes(searchQueryLower) ||
            telefone.includes(searchQueryLower)
        );
    });


    const mobile = useMediaQuery('(max-width:700px)');
    const tablet = useMediaQuery('(max-width:1100px)');

    return (
        <MainLayout pageName='Lista De Clientes'>
            <Box>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", justifyContent: "center", flexWrap: 'wrap', gap: '20px', marginLeft: mobile ? '13%' : '23.6%', marginTop: '1.2%', width: '100%', padding: '5px' }}>
                    <TextField
                        placeholder="Pesquisar..."
                        variant="outlined"
                        size="small"
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <IconButton type="submit" edge="start">
                                    <SearchIcon />
                                </IconButton>
                            ),
                        }}
                        sx={{
                            width: "200px", height: "65px",
                            '& .MuiOutlinedInput-root': { borderRadius: '14px' },
                        }}
                        style={{
                            display: tablet ? 'none' : 'block'
                        }}
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", justifyContent: "center", flexWrap: 'wrap', gap: '20px', marginLeft: mobile ? '13%' : '23.6%', marginTop: '1.2%', width: '100%', padding: '5px' }}>
                    {filteredClientes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((cliente) => {
                        return (
                            <Card key={cliente.clienteId} className="card"  >
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <IconButton onClick={() => handleRedirectToClientData(cliente)}>
                                        <MoreVertIcon />
                                    </IconButton>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', marginLeft: '-50px' }}>
                                    <Avatar className="card-avatar" style={{ color: 'black' }}>
                                        {cliente.nome.charAt(0)}
                                    </Avatar>
                                </div>
                                <CardContent>
                                    <Box className="card-info">
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                            <Typography variant='body2' sx={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>{cliente.nome}</Typography>
                                            <Typography variant='caption' sx={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>{cliente.nomeEmpresa}</Typography>
                                        </div>
                                    </Box>
                                </CardContent>
                                <CardContent>
                                    <Box className="card-contact">
                                        <SvgIcon className="card-icon">
                                            <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="0.371979" y="0.0566101" width="40.2695" height="40.2695" rx="12" fill="#D9E7FF" />
                                                <path d="M27.5496 23.9239L25.285 22.3416C24.9888 22.1351 24.6427 22.0262 24.2837 22.0262C23.713 22.0262 23.1772 22.3061 22.8508 22.7745L22.3251 23.5279C21.444 22.937 20.4609 22.1119 19.5237 21.1748C18.5866 20.2378 17.7617 19.2546 17.171 18.3736L17.924 17.8479C18.3079 17.5806 18.5643 17.1801 18.6457 16.7207C18.7269 16.2615 18.6245 15.7976 18.3569 15.4136L16.775 13.1489C16.4442 12.6758 15.9105 12.3931 15.347 12.3931C15.1518 12.3931 14.9603 12.4276 14.778 12.4948C14.5709 12.5713 14.378 12.6652 14.1889 12.784L13.8762 13.0042C13.7981 13.0649 13.7253 13.1315 13.6557 13.2011C13.2742 13.5824 13.0035 14.0651 12.8508 14.6359C12.1989 17.0794 13.8138 20.7744 16.869 23.8297C19.4347 26.3954 22.5171 27.9893 24.913 27.9896H24.9132C25.3235 27.9896 25.7103 27.9418 26.0629 27.8476C26.6337 27.695 27.1164 27.4243 27.4981 27.0426C27.5674 26.9733 27.6336 26.9006 27.7046 26.8088L27.9249 26.4944C28.0326 26.3223 28.1263 26.1295 28.2038 25.9209C28.4703 25.2006 28.2013 24.3793 27.5496 23.9239Z" fill="#0357E6" />
                                            </svg>
                                        </SvgIcon>
                                        <div style={{ fontSize: "15px", marginLeft: "5px" }}>{cliente.telefone}</div>
                                    </Box>
                                    <Box className="card-contact">
                                        <SvgIcon className="card-icon">
                                            <svg width="41" height="42" style={{ marginTop: "10px" }} viewBox="0 0 41 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="0.371979" y="0.749329" width="40.2695" height="40.2695" rx="12" fill="#D9E7FF" />
                                                <path d="M20.5068 20.7543L29.6017 15.7934C29.3125 14.8417 28.7257 14.0078 27.9277 13.4141C27.1296 12.8204 26.1623 12.4981 25.1676 12.4946H15.8459C14.8512 12.4981 13.8839 12.8204 13.0858 13.4141C12.2878 14.0078 11.7011 14.8417 11.4118 15.7934L20.5068 20.7543Z" fill="#0357E6" />
                                                <path d="M20.9534 22.6346C20.8164 22.7093 20.6629 22.7484 20.5069 22.7484C20.3509 22.7484 20.1974 22.7093 20.0604 22.6346L11.1852 17.7936V24.6127C11.1867 25.8484 11.6782 27.0331 12.552 27.9068C13.4257 28.7806 14.6104 29.2721 15.8461 29.2736H25.1677C26.4034 29.2721 27.5881 28.7806 28.4618 27.9068C29.3356 27.0331 29.8271 25.8484 29.8285 24.6127V17.7936L20.9534 22.6346Z" fill="#0357E6" />
                                            </svg>
                                        </SvgIcon>
                                        <div style={{ marginTop: "10px", fontSize: "12px", marginLeft: "5px" }}>{cliente.email}</div>
                                    </Box>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5px', marginLeft: '50%' }}>
                    <TablePagination
                        component="div"
                        count={clientes.length}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[10]}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </div>
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    message={snackbarMessage}
                />
            </Box>
        </MainLayout >
    );
};

export default ListaDeClientes;