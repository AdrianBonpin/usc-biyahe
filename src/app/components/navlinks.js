'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "@/app/components/navbar.module.css"

export default function navlinks() {
    const pathname = usePathname();

    const chkPage = (href) => {
        return pathname === href ? styles.current : styles.Link;
    };

    return(
        <>
            <div className={chkPage("/")}>
                <Link href="/">Routes</Link>
            </div>
            <div className={chkPage("/about")}>
                <Link href="/about">About</Link>
            </div>
            <div className={chkPage("/contact")}>
                <Link href="/contact">Contact</Link>
            </div>
        </>
    )
}