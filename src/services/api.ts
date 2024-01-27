import axios from "axios"

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
    } catch (error) {
        console.log(error);
    }
}
