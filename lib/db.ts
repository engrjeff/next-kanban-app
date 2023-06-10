import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

let prisma: PrismaClient

if (typeof window === "undefined") {
  if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient()
  } else {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient()
    }
    prisma = globalForPrisma.prisma
  }
}

// @ts-ignore
export default prisma
