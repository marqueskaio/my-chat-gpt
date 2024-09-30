import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

export const DallE = async (message: string) => {
    const response = await openai.images.generate(
    {
        model: "dall-e-3",
        prompt: message,
        size: "1024x1024",
        n: 1,
    }
);
const imageUrl = response.data[0].url;
return imageUrl;
}
