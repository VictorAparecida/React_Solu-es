import { createContext, useCallback, useMemo, useState, ReactNode, useContext, useEffect } from "react";
import { Box, ThemeProvider, useMediaQuery } from "@mui/material"
import { DarkTheme, LightTheme } from "../themes";

interface IThemeContextData {
    themeName: 'light' | 'dark'
    toggleTheme: () => void
}

const ThemeContext = createContext({} as IThemeContextData)

export const useAppThemeContext = () => {
    return useContext(ThemeContext)
}

export const AppThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const mobile = useMediaQuery('(max-width:800px)');
    const [themeName, setThemeName] = useState<'light' | 'dark'>(() => {
        const savedThemeName = localStorage.getItem('themeName');
        return savedThemeName ? savedThemeName as 'light' | 'dark' : 'light';
    })

    const toggleTheme = useCallback(() => {
        setThemeName(oldThemeName => oldThemeName === 'light' ? 'dark' : 'light')
    }, [])

    useEffect(() => {
        localStorage.setItem('themeName', themeName)
    }, [themeName])

    const theme = useMemo(() => {
        if (themeName === 'light') return LightTheme
        return DarkTheme
    }, [themeName])

    return (
        <ThemeContext.Provider value={{ themeName, toggleTheme }}>
            <ThemeProvider theme={theme} >
                <Box width="100%" height={mobile ? '100%' : '110vh'} bgcolor={theme.palette.background.default}>
                    {children}
                </Box>
            </ThemeProvider>
        </ThemeContext.Provider>
    )
}