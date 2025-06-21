import pkg from "@prisma/client";
const { PrismaClient } = pkg;

// Create Prisma client instance
const prisma = new PrismaClient({
    log:
        process.env.NODE_ENV === "development"
            ? ["query", "info", "warn", "error"]
            : ["error"],
});

// Handle graceful shutdown
process.on("beforeExit", async () => {
    await prisma.$disconnect();
});

export { prisma };
