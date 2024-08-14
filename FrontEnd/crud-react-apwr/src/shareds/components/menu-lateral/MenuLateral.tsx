import React, { ReactNode, useState } from 'react';
import { Avatar, Box, Divider, Drawer, Icon, List, ListItemButton, ListItemIcon, ListItemText, Paper, SvgIcon, Switch, useMediaQuery, useTheme } from '@mui/material';
import { useAppThemeContext, useDrawerContext } from '../../contexts';
import { useNavigate, useResolvedPath, useMatch } from 'react-router-dom';

interface IListItemLinkProps {
  label: string;
  icon: string;
  to: string;
  onClick: (() => void) | undefined;
}

const ListItemLink: React.FC<IListItemLinkProps> = ({ to, icon, label, onClick }) => {
  const navigate = useNavigate();
  const resolvedPath = useResolvedPath(to);
  const match = useMatch({ path: resolvedPath.pathname, end: false });

  const handleClick = () => {
    navigate(to);
    onClick?.();
  };

  return (
    <ListItemButton style={{ height: "60px", marginBottom: "5px" }} selected={!!match} onClick={handleClick} sx={{
      '&:hover': {
        backgroundColor: 'rgb(3, 87, 230, 0.5)',
        color: '#fff'
      },
      '&.Mui-selected': {
        backgroundColor: '#0357E6',
        color: '#fff'
      },
      '&.Mui-selected:hover': {
        backgroundColor: '#0357E6',
        color: '#fff'
      }
    }}>
      <ListItemIcon style={{ minWidth: "40px" }} >
        <Icon>{icon}</Icon>
      </ListItemIcon>
      <ListItemText primaryTypographyProps={{ fontSize: "11px", fontFamily: 'Montserrat, Arial, sans-serif' }} primary={label} />
    </ListItemButton>
  );
};

interface MenuLateralProps {
  children?: ReactNode;
}

export const MenuLateral: React.FC<MenuLateralProps> = ({ children }) => {
  const theme = useTheme();
  const [darkTheme, setDarkTheme] = useState<boolean>(theme.palette.mode === 'dark');
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const { toggleDrawerOpen, drawerOptions } = useDrawerContext();
  const { toggleTheme } = useAppThemeContext();
  const navigate = useNavigate();

  const avatar = '/public/images/SolucoesIcon.png';

  const handleLogoff = () => {
    window.location.reload();
    navigate('/Login');
  };

  const handleThemeChange = () => {
    setDarkTheme(!darkTheme);
    toggleTheme(); // Toggle theme function from context
  };

  const handleMenuItemClick = () => {
    handleThemeChange();
  };

  return (
    <>
      <Paper>
        <Drawer open={true} sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box' }, }} variant={smDown ? 'temporary' : 'persistent'} anchor='left' onClose={toggleDrawerOpen}
        >
          <Box sx={{ height: "53px", marginTop: "30px" }} display="flex" alignItems="center" justifyContent="center">
            <Avatar variant="square" src={avatar} sx={{ height: theme.spacing(12), width: theme.spacing(12) }} />
          </Box>
          <Box sx={{ width: "200px", height: "220px", marginTop: "39px", marginLeft: "20px" }}>
            <div style={{ width: "48px", height: "20px" }}><text fontWeight={400} style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>Menu</text></div>
            <List component="nav" style={{ fontSize: "14px" }} >
              {drawerOptions.map(option => (
                <ListItemLink
                  key={option.path}
                  icon={option.icon}
                  label={option.label}
                  to={option.path}
                  onClick={smDown ? toggleDrawerOpen : undefined}
                />
              ))}
            </List>
          </Box>
          <Divider sx={{ width: "200px", marginLeft: "15px", marginBottom: "20px", height: "20px" }} />
          <Box sx={{ width: "200px", height: "110px", marginLeft: "20px", marginRight: "32px" }}>
            <div style={{ width: "48px", height: "20px" }}><text>Configurações</text></div>
            <List component="nav">
              <ListItemButton onClick={handleMenuItemClick}>
                <ListItemIcon style={{ minWidth: "40px" }}>
                  <SvgIcon>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.5165 3.29207C11.2129 2.21615 12.7871 2.21615 13.4835 3.29207L14.1162 4.2697C14.5148 4.88555 15.2524 5.19108 15.9697 5.03746L17.1084 4.79359C18.3616 4.5252 19.4748 5.63835 19.2064 6.89154L18.9625 8.03025C18.8089 8.74756 19.1144 9.48519 19.7303 9.88378L20.7079 10.5165C21.7838 11.2129 21.7838 12.7871 20.7079 13.4835L19.7303 14.1162C19.1144 14.5148 18.8089 15.2524 18.9625 15.9697L19.2064 17.1085C19.4748 18.3616 18.3616 19.4748 17.1084 19.2064L15.9697 18.9625C15.2524 18.8089 14.5148 19.1144 14.1162 19.7303L13.4835 20.7079C12.7871 21.7838 11.2129 21.7839 10.5165 20.7079L9.88376 19.7303C9.48517 19.1145 8.74754 18.8089 8.03023 18.9625L6.89152 19.2064C5.63833 19.4748 4.52518 18.3617 4.79357 17.1085L5.03744 15.9698C5.19107 15.2524 4.88553 14.5148 4.26968 14.1162L3.29205 13.4835C2.21613 12.7871 2.21613 11.2129 3.29205 10.5165L4.26968 9.88378C4.88553 9.48519 5.19107 8.74756 5.03744 8.03025L4.79357 6.89154C4.52518 5.63835 5.63833 4.5252 6.89152 4.79359L8.03023 5.03746C8.74754 5.19108 9.48517 4.88555 9.88376 4.2697L10.5165 3.29207Z" stroke="#8A8C98" stroke-width="1.5" />
                      <path d="M15 12C15 13.6569 13.6568 15 12 15C10.3431 15 8.99998 13.6569 8.99998 12C8.99998 10.3431 10.3431 9 12 9C13.6568 9 15 10.3431 15 12Z" stroke="#8A8C98" stroke-width="1.5" />
                    </svg>
                  </SvgIcon>
                </ListItemIcon>
                <div><text style={{ fontSize: "12px", textWrap: "nowrap", textAlign: "center", fontFamily: 'Montserrat, Arial, sans-serif' }}>MUDAR TEMA</text> </div>
                <Switch
                  sx={{ marginLeft: "15px", borderRadius: "32px" }}
                  checked={darkTheme}
                  onChange={handleThemeChange}
                  disabled
                />
              </ListItemButton>
            </List>
          </Box>
          <Box sx={{ width: "168px", height: "56px", marginLeft: "32px", padding: "16px, 48px, 16px, 16px", gap: "10px" }}>
            <List component="nav">
              <ListItemButton onClick={handleLogoff}>
                <ListItemIcon>
                  <Icon style={{ color: '#FF5050' }}>exit_to_app</Icon>
                </ListItemIcon>
                <ListItemText primary={<span style={{ color: '#FF5050' }}>Log Out</span>} />
              </ListItemButton>
            </List>
          </Box>
        </Drawer>
      </Paper>
      <Box>
        {children}
      </Box>
    </>
  );
};
