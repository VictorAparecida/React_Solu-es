import { AppBar, Backdrop, IconButton, Typography, useMediaQuery } from "@mui/material";
import { MenuLateral } from "../../components";
import React, { useEffect, useState } from "react";
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from "@mui/material/styles";

interface Props {
    children?: any;
    pageName: string;
}

function MainLayout({ children, pageName }: Props) {

    const [, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openMenu, setOpenMenu] = useState(false);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const toggleMenu = () => {
        setOpenMenu(!openMenu);
    };

    const mobile = useMediaQuery('(max-width:800px)');
    const tablet = useMediaQuery('(max-width:1100px)');
    useEffect(() => {
        if (!mobile && openMenu) {
            toggleMenu();
        }
    }, [mobile, openMenu]);
    useEffect(() => {
        if (!tablet && openMenu) {
            toggleMenu();
        }
    }, [tablet, openMenu]);

    const theme = useTheme(); // Acessa o tema da aplicação

    return (
        <>
            <AppBar style={{
                paddingLeft: mobile ? "0px" : "25%", position: "static"
                , paddingTop: "15px", height: "65px", display: "flex", flexDirection: "row", justifyContent: "space-between", backgroundColor: theme.palette.background.paper    }}>
                {mobile === true ? (
                    <div>
                        <IconButton onClick={toggleMenu} id="menuToggle">
                            <MenuIcon />
                        </IconButton>
                        {openMenu && (
                            <Backdrop
                                sx={{ zIndex: 999 }}
                                open={openMenu}
                                onClick={toggleMenu}
                            >
                                <MenuLateral />
                            </Backdrop>)}
                    </div>
                ) : ('')}
                <div style={{marginTop: '6px'}}>
                    <Typography
                        variant="h5"
                        noWrap
                        component="div"
                        sx={{ fontFamily: 'Montserrat, Arial, sans-serif', fontSize: '1.3rem'}}
                    >
                        {pageName}
                    </Typography>
                </div>
                <div style={{ display: "flex", flexDirection: "row", marginRight: "2%" }}>
                  
                    <div style={{marginTop: "-5px"}}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                            onClick={handleMenu}
                        >
                            <AccountCircle />
                        </IconButton>
                       
                    </div>
                    <div style={{marginTop: "-5px"}}>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ fontFamily: 'Montserrat, Arial, sans-serif'}}
                            >
                            Suporte
                        </Typography>
                        <Typography
                            variant="caption"
                            noWrap
                            component="div"
                            sx={{ fontFamily: 'Montserrat, Arial, sans-serif'}}
                            >
                            Administrator
                        </Typography>
                    </div>


                </div>
            </AppBar >
            {mobile === false ? (
                <div style={{ width: "200px" }}>
                    <MenuLateral />
                </div>
            ) : (
                <div></div>
            )
            } <div style={{ width: "80%" }}>
                {children}
            </div>
        </>
    );
}

export default MainLayout;
