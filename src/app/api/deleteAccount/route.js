import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function POST(req){
    try {
        const initmail = await req.json()
        const user = await prisma.user.findFirst({
            where: {
                email: initmail,
            }
        })

        const exist = await prisma.routenotes.findFirst({
            where: {
                userID: user.userID,
            }
        })

        if (exist) {
            await prisma.routenotes.delete({
                where: {
                    noteID: exist.noteID,
                }
            })
        }

        await prisma.user.delete({
            where: {
                userID: user.userID,
            }
        })

        prisma.$disconnect()
        return new Response(JSON.stringify(''))
    } catch (error) {
        prisma.$disconnect()
        console.error(error)
        return new Response(JSON.stringify(''))
    }
}