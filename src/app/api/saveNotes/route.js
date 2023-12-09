import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function POST(req){
    try {
        const {notes, email} = await req.json()
        const user = await prisma.user.findFirst({
            where: {
                email: email,
            }
        })

        const exist = await prisma.routenotes.findFirst({
            where: {
                userID: user.userID,
            }
        })

        if (!exist) {
            await prisma.routenotes.create({
                data: {
                    content: notes,
                    userID: user.userID,
                }
            })
            return new Response(JSON.stringify('OK'))
        }
        await prisma.routenotes.update({
            where: {
                noteID: exist.noteID,
            },
            data: {
                content: notes,
            }
        })
        prisma.$disconnect()
        return new Response(JSON.stringify('OK'))
    } catch (error) {
        prisma.$disconnect()
        console.error(error)
        return new Response(JSON.stringify('BAD'))
    }
}