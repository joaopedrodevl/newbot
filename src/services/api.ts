import axios from "axios"
import LogService from "./LogService";

const logService = new LogService();

/**
 * Searches for questions on Stack Overflow based on a query.
 * @param query The search query.
 * @returns A string containing the titles and links of the top 5 relevant questions, separated by newlines.
 */
export async function searchQuestions(query: string) {
    try {
        const response = await axios.get('https://api.stackexchange.com/2.2/search', {
            params: {
                order: 'desc',
                sort: 'relevance',
                intitle: query,
                site: 'stackoverflow',
            },
        });

        // Retornar os 5 primeiros resultados, se existirem: titulo e link
        return response.data.items.slice(0, 5).map((question: any) => {
            return `[${question.title}](${question.link})`;
        }).join("\n");
    } catch (error: any) {
        console.log(error);
        await logService.create(error.message);
    }
}
