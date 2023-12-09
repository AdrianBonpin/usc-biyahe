import styles from '@/app/components/profile.module.css'

import { signOut } from "next-auth/react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faX } from '@fortawesome/free-solid-svg-icons'

import { useEffect, useState } from 'react'

export default function profile({onClose, session}) {

    const [ notes, setNotes ] = useState()

    const [ save, setSave ] = useState('Save')

    const email = session.user.email

    useEffect(() => {
        async function getNotes(){
            const res = await fetch('/api/getNotes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',},
                body: JSON.stringify(email),
            })
            setNotes(await res.json())
        }
        getNotes()
    }, [])

    async function saveNotes(){
        if ( notes.length > 512 ){
            return setSave('Note Too Long!')
        }
        const res = await fetch('/api/saveNotes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',},
            body: JSON.stringify({notes, email}),
        })
        const reply = await res.json()
        if ( reply === 'OK' ){
            setSave('Note Saved!')
        } else if ( reply === 'ADD' ) {
            setSave('Note Added!')
        } else {
            setSave('Error Saving Note!')
        }
    }

    async function deleteAccount(){
        const res = await fetch('/api/deleteAccount', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',},
            body: JSON.stringify(email),
        })
        signOut()
    }

    return (
        <div className={styles.login_bg}>
            <div className={styles.login_box}>
                <div className={styles.box_close}>
                    <button onClick={onClose} className={styles.close_button}>
                        <FontAwesomeIcon icon={faX}/>
                    </button>
                </div>
                <div className={styles.cont}>
                    <span className={styles.maintxt}>{session.user.name}</span>
                    <span className={styles.secondtxt}>Personal Notes</span>
                    <div className={styles.notes_box}>
                        <textarea className={styles.persona_notes} onChange={(e) => setNotes(e.target.value)} value={notes}/>
                    </div>
                    <button className={styles.button} onClick={saveNotes}>{save}</button>
                    <button className={styles.button} onClick={() => signOut()}>Logout</button>
                    <button className={styles.button2} onClick={deleteAccount}>Delete Account</button>
                </div>
            </div>
        </div>
    )
}