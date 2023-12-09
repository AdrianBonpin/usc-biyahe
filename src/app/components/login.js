'use client'

import styles from '@/app/components/login.module.css'
import { faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'

import { signIn } from 'next-auth/react'

import { useRouter } from "next/navigation"

export default function login({onClose}) {

    const router = useRouter()

    const [ signUp, setSignUp ] = useState(false)

    function changeSign(){
        setSignUp(!signUp)
    }

    const [ signUpStat, setSignUpStat ] = useState('Join Us')

    const [ signInStat, setSignInStat ] = useState('Welcome Back')
    
    const [ passMiss, setPassMiss ] = useState('')

    const [ signInData, setSignInData ] = useState({
        email: '',
        pass: '',
    })

    const [ signUpData, setSignUpData ] = useState({
        username: '',
        email: '',
        pass: '',
        pass_conf: '',
    })

    function signInChange(e){
        const { name, value } = e.target
        setSignInData((prev) => ({
            ...prev,
            [name] :value,
        }))
    }

    function signUpChange(e){
        const { name, value } = e.target
        setSignUpData((prev) => ({
            ...prev,
            [name] :value,
        }))
    }

    async function handleSignIn(e){
        e.preventDefault()
        if (!signInData.email || !signInData.pass) {
            return null
        }
        try {
            const res = await signIn('credentials',{
                email: signInData.email,
                password: signInData.pass,
                redirect: false,
            })
            setSignInStat('Logged In!')
            window.location.reload()
        } catch (error) {
            setSignInStat('Login Error!')
        }
    }

    async function handleSignUp(e){
        e.preventDefault()

        if (!signUpData.username || !signUpData.email || !signUpData.pass || !signUpData.pass_conf) {
            return null
        } else if (!(signUpData.pass === signUpData.pass_conf)) {
            setPassMiss('Password Mismatch!')
            return null
        }
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',},
                body: JSON.stringify(signUpData),
            })
            const retdat = await res.json()
            setSignUpStat(retdat)
        } catch (error) {
            setSignUpStat('Error!')
        }
    }

    return (
        <div className={styles.login_bg}>
            <div className={styles.login_box}>
                <div className={styles.box_close}>
                    <button onClick={onClose} className={styles.close_button}>
                        <FontAwesomeIcon icon={faX}/>
                    </button>
                </div>
                <form onSubmit={handleSignIn} className={ signUp === false ? styles.signIn : styles.hide }>
                    <span className={styles.maintxt}>{signInStat}</span>
                    <div className={styles.input_cont}> 
                        <label className={styles.label}>Email Address</label>
                        <input name='email' type='email' value={signInData.email} onChange={signInChange} className={styles.input} placeholder='Enter Email' required/>
                    </div>
                    <div className={styles.input_cont}> 
                        <label className={styles.label}>Password</label>
                        <input name='pass' type='password' value={signInData.pass} onChange={signInChange} className={styles.input} placeholder='Enter Password' required/>
                    </div>
                    <button type='submit' className={styles.form_button}>Log In</button>
                    <span className={styles.sign_txt}>Don't have an account? <a onClick={changeSign} className={styles.sign_txt_act}>Sign Up</a></span>
                </form>
                <form onSubmit={handleSignUp} className={ signUp === true ? styles.signUp : styles.hide }>
                    <span className={styles.maintxt}>{signUpStat}</span>
                    <div className={styles.input_cont}> 
                        <label className={styles.label}>Username</label>
                        <input name='username' type='text' value={signUpData.username} onChange={signUpChange} className={styles.input} placeholder='Enter Username' required/>
                    </div>
                    <div className={styles.input_cont}> 
                        <label className={styles.label}>Email</label>
                        <input name='email' type='email' value={signUpData.email} onChange={signUpChange} className={styles.input} placeholder='Enter Email' required/>
                    </div>
                    <div className={styles.input_cont}> 
                        <label className={styles.label}>Password</label>
                        <input name='pass' type='password' value={signUpData.pass} onChange={signUpChange} className={styles.input} placeholder='Enter Password' required/>
                    </div>
                    <div className={styles.input_cont}> 
                        <label className={styles.label}>Confirm Password <span className={styles.warn}>{passMiss}</span></label>
                        <input name='pass_conf' type='password' value={signUpData.pass_conf} onChange={signUpChange} className={styles.input} placeholder='Confirm Password' required/>
                    </div>
                    <button type='submit' className={styles.form_button}>Sign Up</button>
                    <span className={styles.sign_txt}>Already have an account? <a onClick={changeSign} className={styles.sign_txt_act}>Sign In</a></span>
                </form>
            </div>
        </div>
    )
}