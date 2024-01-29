import { PrismaClient } from "@prisma/client";

/**
 * Service responsible for logging errors.
 */
export default class LogService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    /**
     * Creates a new log entry with the specified error message.
     * @param error The error message to be logged.
     * @returns A Promise that resolves to the created log entry.
     */
    public async create(error: string): Promise<any> {
        return await this.prisma.log.create({
            data: {
                error
            }
        })
    }
}