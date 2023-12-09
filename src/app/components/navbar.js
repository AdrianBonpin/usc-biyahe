import styles from "@/app/components/navbar.module.css"
import Image from "next/image"
import LoginButton from '@/app/components/loginButton'
import LogoutButton from '@/app/components/logoutButton'
import NavLinks from '@/app/components/navlinks'
import { getServerSession } from 'next-auth'

export default async function Dash() {

  const session = await getServerSession()

  return (
    <nav className={styles.navbar}>
      <div className={styles.logocont}>
        <Image
          src="/logo.png"
          width={100}
          height={100}
          className={styles.logo}
          alt='Logo'
        />
      </div>
      <div className={styles.links}>
        <NavLinks/>
        {!session ? <LoginButton /> : null}
        {!!session ? <LogoutButton session={session} /> : null}
      </div>
    </nav>
  );
}
