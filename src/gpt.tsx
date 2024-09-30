import OpenAI from "openai"


    const gpt = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
    })
export const Gpt = async (message: string) => {
    const response = await gpt.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": "Voce é um assistente pessoal dentro do meu computador.\n"
                    }
                ]
            },
            {"role": "user", "content": message}
        ]
    });
    return response.choices[0]?.message?.content ?? ''
}