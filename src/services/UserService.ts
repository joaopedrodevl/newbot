import { PrismaClient } from "@prisma/client";

export default class UserService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    public async create(email: string, code: string, discord_id: string, type: string): Promise<any> {
        const existingUser = await this.prisma.user.findUnique({
            where: {
                discord_id: discord_id,
            }
        })

        if (existingUser) {
            return await this.prisma.user.update({
                where: {
                    discord_id: discord_id,
                },
                data: {
                    email: email,
                    code: code,
                    type: type,
                }
            })
        }
        
        return await this.prisma.user.create({
            data: {
                email: email,
                code: code,
                discord_id: discord_id,
                type: type,
            }
        })
    }

    public async findByEmail(email: string): Promise<any> {
        return await this.prisma.user.findUnique({
            where: {
                email: email,
            }
        })
    }

    public async findByDiscordId(discord_id: string): Promise<any> {
        return await this.prisma.user.findUnique({
            where: {
                discord_id: discord_id,
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
        const user = await this.prisma.user.findUnique({
            where: {
                discord_id: discord_id,
            }
        })

        if (!user) return;

        return await this.prisma.user.delete({
            where: {
                discord_id: discord_id,
            }
        });
    }
}