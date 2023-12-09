'use client'

import styles from "@/app/components/navbar.module.css"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser } from "@fortawesome/free-solid-svg-icons"
import Profile from '@/app/components/profile'

export default function logout({session}) {

    const [ profileOpen, setProfileOpen ] = useState(false)

    function handleCloseProfile(){
        setProfileOpen(false)
    }

    return (
        <>
            <button className={styles.Login} onClick={() => setProfileOpen(true)}><FontAwesomeIcon icon={faUser}/></button>
            {profileOpen && <Profile session={session} onClose={handleCloseProfile}/>}
        </>
    )
}