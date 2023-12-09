'use client'
import { ThemeProvider } from "next-themes";

import { SessionProvider } from "next-auth/react";

export default function Providers({children, session}){
    return (
        <SessionProvider session={session}>
            <ThemeProvider >
                {children}
            </ThemeProvider>
        </SessionProvider>
    )
}