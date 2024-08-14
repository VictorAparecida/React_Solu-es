import React, { useState } from 'react';
import styled from 'styled-components';
import { TextField, Button, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  setAuthenticated: (authenticated: boolean) => void;
}

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  background-color: ${({ theme }) => theme.palette.background.default};
`;

const LoginBox = styled.div`
  background: ${({ theme }) => theme.palette.background.paper};
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoginTitle = styled(Typography)`
  margin-bottom: 20px;
`;

const LoginButton = styled(Button)`
  margin-top: 20px;
`;

const Login: React.FC<LoginProps> = ({ setAuthenticated }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const theme = useTheme(); // Acessa o tema da aplicação

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const url = `https://189.126.121.47:444/api/Licenca/api/Login?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(password)}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setAuthenticated(true);
        navigate('/pagina-inicial');
      } else {
        const data = await response.json();
        alert(data.message || 'Erro ao realizar login');
      }
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      alert('Erro ao realizar login. Tente novamente mais tarde.\n' + error);
    }
  };

  return (
    <LoginContainer theme={theme}>
      <LoginBox theme={theme}>
        <LoginTitle variant="h4" gutterBottom>
          Login
        </LoginTitle>
        <LoginForm onSubmit={handleLogin} theme={theme}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            variant="outlined"
            margin="normal"
            fullWidth
          />
          <TextField
            label="Senha"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            variant="outlined"
            margin="normal"
            fullWidth
          />
          <LoginButton
            type="submit"
            variant="contained"
            fullWidth
            style={{
              backgroundColor: theme.palette.secondary.main,
              color: "white",
            }}
          >
            Login
          </LoginButton>
        </LoginForm>
      </LoginBox>
    </LoginContainer>
  );
};

export default Login;
