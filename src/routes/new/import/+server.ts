import { error, type RequestHandler } from '@sveltejs/kit';
import puppeteer from "puppeteer-extra"
import StealthPlugin from "puppeteer-extra-plugin-stealth"

export const POST: RequestHandler = async ({ request, locals }) => {

    const { userId } = locals.auth();
    if (!userId) {
        return error(403)
    }

    const body : {url: string} = await request.json()
    if (!body || !body.url){
        return error(400)
    }

    const stream = new ReadableStream({
        start(controller) {

            puppeteer.use(StealthPlugin())
            const browser = await puppeteer.launch({headless: true})
            const page = await browser.newPage()
            sendMessage(controller, {type:"info", info:"Navigating to Quizlet"})


        }
    });


    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',

        }
    });
};

async function sendMessage(controller: ReadableStreamDefaultController|null, data: any){
    const encoder = new TextEncoder()
    const body = JSON.stringify(data);
    controller?.enqueue(encoder.encode(`data: ${body}\n\n`));
}