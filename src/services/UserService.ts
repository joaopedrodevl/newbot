import { PrismaClient } from "@prisma/client";

/**
 * Service class for managing user data.
 */
export default class UserService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    /**
     * Creates a new user or updates an existing user.
     * @param email - The email of the user.
     * @param code - The code of the user.
     * @param discord_id - The Discord ID of the user.
     * @param type - The type of the user.
     * @returns A promise that resolves to the created or updated user.
     */
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

    /**
     * Finds a user by their email.
     * @param email - The email of the user.
     * @returns A promise that resolves to the found user, or null if not found.
     */
    public async findByEmail(email: string): Promise<any> {
        return await this.prisma.user.findUnique({
            where: {
                email: email,
            }
        })
    }

    /**
     * Finds a user by their Discord ID.
     * @param discord_id - The Discord ID of the user.
     * @returns A promise that resolves to the found user, or null if not found.
     */
    public async findByDiscordId(discord_id: string): Promise<any> {
        return await this.prisma.user.findUnique({
            where: {
                discord_id: discord_id,
            }
        })
    }

    /**
     * Deletes a user by their email.
     * @param email - The email of the user to delete.
     * @returns A promise that resolves to the deleted user, or null if not found.
     */
    public async deleteByEmail(email: string): Promise<any> {
        return await this.prisma.user.delete({
            where: {
                discord_id: email,
            }
        })
    }

    /**
     * Deletes a user by their Discord ID.
     * @param discord_id - The Discord ID of the user to delete.
     * @returns A promise that resolves to the deleted user, or null if not found.
     */
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