import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function POST(req) {
    const data = await req.json()

    const chk = await prisma.route.findFirst({
        where: {
            routeCode: data
        }
    })
    
    if (!chk) {
        console.log('pushed route')
        await prisma.route.create({
            data: {
                routeCode: `${data}`,
                type: 'JEEP',
            }
        })
    }
    prisma.$disconnect
    try {
        return new Response('Ok!')
    } catch (error) {
        return new Response('There was an Error')
    }
}