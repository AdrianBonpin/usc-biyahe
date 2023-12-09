

export default function SignInForm() {
    return (
        <form onSubmit={handleSignIn} className={ signUp === false ? styles.signIn : styles.hide }>
                    <span className={styles.maintxt}>Welcome Back</span>
                    <div className={styles.input_cont}> 
                        <label className={styles.label}>Email Address</label>
                        <input name='email' type='email' value={signInData.email} onChange={signInChange} className={styles.input} placeholder='Enter Email' required/>
                    </div>
                    <div className={styles.input_cont}> 
                        <label className={styles.label}>Password</label>
                        <input name='pass' type='password' value={signInData.pass} onChange={signInChange} className={styles.input} placeholder='Enter Password' required/>
                    </div>
                    <span className={styles.chkBox}><label className={styles.label}>Stay Signed In? <input name='keep' type='radio' value={signInData.keep} onChange={keepChange} placeholder='Enter Password' required/></label></span>
                    <button type='submit' className={styles.form_button}>Log In</button>
                    <span className={styles.sign_txt}>Don't have an account? <a onClick={changeSign} className={styles.sign_txt_act}>Sign Up</a></span>
                </form>
    )
}