import { PrismaClient } from "@prisma/client";

export default class LogService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    public async create(error: string): Promise<any> {
        return await this.prisma.log.create({
            data: {
                error
            }
        })
    }
}