import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDrawerContext } from '../shareds/contexts';
import CadastroDeClientes from '../pages/Licenca/CadastroDeClientes';
import ListaDeClientes from '../pages/Licenca/ListaDeClientes';
import Login from '../pages/Login/LoginApp';
import DadosDoCliente from '../pages/Licenca/DadosDoCliente'; // Importe o componente DadosDoCliente
import { IconButton } from '@mui/material';
import { PaginaInicial } from '../pages';
import GroupIcon from '@mui/icons-material/Group';
import { DataSaverOff } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';

interface AppRoutesProps {
  authenticated: boolean;
  setAuthenticated: (authenticated: boolean) => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ authenticated, setAuthenticated }) => {
  const { setDrawerOptions } = useDrawerContext();

  useEffect(() => {
    setDrawerOptions([
      {
        label: 'HOME',
        icon: <IconButton style={{ padding: "0px" }}>
          <HomeIcon />
        </IconButton>,
        path: '/pagina-inicial',
      },
      {
        label: 'CADASTRO DE CLIENTES',
        icon: <IconButton style={{ padding: "0px" }}>
          <DataSaverOff />
        </IconButton>,
        path: '/pagina-de-cadastro-clientes',
      },
      {
        label: 'CONSULTA DE CLIENTES',
        icon: <IconButton style={{ padding: "0px" }}>
          <GroupIcon />
        </IconButton>,
        path: '/pagina-lista-de-clientes',
      },
    ]);
  }, [setDrawerOptions]);

  return (
    <Routes>
      <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
      <Route path="/pagina-inicial" element={authenticated ? <PaginaInicial /> : <Navigate to="/login" />} />
      <Route path="/pagina-de-cadastro-clientes" element={authenticated ? <CadastroDeClientes /> : <Navigate to={'/login'} />} />
      <Route path="/pagina-lista-de-clientes" element={authenticated ? <ListaDeClientes /> : <Navigate to="/login" />} />
      <Route path="/dados-do-cliente/:clienteId" element={<DadosDoCliente />} />
      <Route path="*" element={<Navigate to={authenticated ? '/pagina-inicial' : '/login'} />} />
    </Routes>
  );
};

export default AppRoutes;