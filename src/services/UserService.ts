import { PrismaClient } from "@prisma/client";

export default class UserService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    public async create(email: string, code: string, discord_id: string): Promise<any> {
        return await this.prisma.user.create({
            data: {
                academic_email: email,
                code: code,
                discord_id: discord_id,
            }
        })
    }

    public async findByEmail(email: string): Promise<any> {
        return await this.prisma.user.findUnique({
            where: {
                academic_email: email,
            }
        })
    }

    public async deleteByEmail(email: string): Promise<any> {
        return await this.prisma.user.delete({
            where: {
                discord_id: email,
            }
        })
    }

    public async deleteByDiscordId(discord_id: string): Promise<any> {
        return await this.prisma.user.delete({
            where: {
                discord_id: discord_id,
            }
        })
    }
}