import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET() {
    const costs = await prisma.puv.findMany()
    prisma.$disconnect()
    return new Response(JSON.stringify(costs))
}