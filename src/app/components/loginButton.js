'use client'

import Login from '@/app/components/login'
import { useState } from "react"
import styles from "@/app/components/navbar.module.css"

export default function login() {
    const [ loginOpen, setLoginOpen ] = useState(false)

    function handleCloseLogin(){
        setLoginOpen(false)
    }

    return (
        <>
            <button className={styles.Login} onClick={() => setLoginOpen(true)}> Login </button>
            {loginOpen && <Login onClose={handleCloseLogin}/>}
        </>
    )
}