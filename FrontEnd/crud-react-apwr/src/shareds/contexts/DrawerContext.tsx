import { createContext, useCallback, useState, ReactNode, useContext } from "react";


interface IDrawerContextData {
    isDrawerOpen: boolean
    drawerOptions: IDrawerOptions[]
    toggleDrawerOpen: () => void
    setDrawerOptions: (newDrawerOptions: IDrawerOptions[]) => void
}

interface IDrawerOptions {
    icon: any
    path: string
    label: string
}

const DrawerContext = createContext({} as IDrawerContextData)

export const useDrawerContext = () => {
    return useContext(DrawerContext)
}

export const DrawerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [drawerOptions, setDrawerOptions] = useState<IDrawerOptions[]>([])

    const toggleDrawerOpen = useCallback(() => {
        setIsDrawerOpen(oldDrawerOpen => !oldDrawerOpen)
    }, [])

    const handleSetDrawerOptions = useCallback((newDrawerOptions: IDrawerOptions[]) => {
        setDrawerOptions(newDrawerOptions)
    }, [])

    return (
        <DrawerContext.Provider value={{ isDrawerOpen, drawerOptions, toggleDrawerOpen, setDrawerOptions:handleSetDrawerOptions }}>
            {children}
        </DrawerContext.Provider>
    )
}
