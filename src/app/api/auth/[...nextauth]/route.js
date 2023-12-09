import NextAuth from 'next-auth'
import CredentialProvider from 'next-auth/providers/credentials'

import bcrypt from 'bcrypt'

import { PrismaClient } from '@prisma/client'


async function login(credentials){
    try {
        const prisma = new PrismaClient()
        const user = await prisma.user.findFirst({
            where:{
                email: credentials.email,
            }
        })

        if (!user) throw new Error('Not Found!')
        const passChk = await bcrypt.compare(credentials.password, user.password)
        if (!passChk) throw new Error('Wrong Password!')
        return user
    } catch (error) {
        console.error(error)
    }
}

export const authOptions = {
    session: {
        strategy: 'jwt',
    },
    providers: [
        CredentialProvider({
            name: 'credentials',
            credentials: {},
            async authorize(credentials){
                try {
                    const user = await login(credentials)
                    return user
                } catch (error) {
                    console.error(error)
                    return null
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}){
            if (user){
                token.name = user.username
                token.email = user.email
                token.id = user.id
                token.auth = user.auth
            }
            return token
        },
        async session({session, token}){
            if (token){
                session.user.username = token.name
                session.user.email = token.email
                session.user.id = token.id
                session.user.auth = token.auth
            }
            return session
        }
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }