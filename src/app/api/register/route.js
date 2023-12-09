import bcrypt from 'bcrypt'

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function POST(req){
    try {
        const {username, email, pass} = await req.json()
        const exists = await prisma.user.findFirst({
            where:{
                email: `${email}`,
            }
        })

        if (exists){
            prisma.$disconnect()
            return new Response(JSON.stringify('Duplicate!'))
        }
        const hashedPass = await bcrypt.hash(pass, 10)
        await prisma.user.create({
            data:{
                username: `${username}`,
                email: `${email}`,
                password: `${hashedPass}`,
                auth: 0,
            }
        })
        console.log('User Added!')
        prisma.$disconnect()
        return new Response(JSON.stringify('Registered!'))
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify('Sign Up Error!'))
    }
}