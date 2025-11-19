import { error, type RequestHandler } from '@sveltejs/kit';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { PuppeteerBlocker } from '@ghostery/adblocker-puppeteer';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { userId } = locals.auth();
	if (!userId) {
		return error(403);
	}

	const body: { url: string } = await request.json();
	if (!body || !body.url) {
		return error(400);
	}

	const stream = new ReadableStream({
		async start(controller) {
			try {
				puppeteer.use(StealthPlugin());
				const browser = await puppeteer.launch({ headless: true });

				const page = await browser.newPage();
				const blocker = await PuppeteerBlocker.fromPrebuiltAdsAndTracking(fetch);
				await blocker.enableBlockingInPage(page);

				sendMessage(controller, { type: 'info', info: 'Navigating to Quizlet' });
				await page.goto(body.url, { waitUntil: 'domcontentloaded' });

				sendMessage(controller, { type: 'info', info: 'Waiting for the site to load' });
				await page.waitForSelector("section[data-testid='terms-list']");
				sendMessage(controller, { type: 'info', info: 'Importing the set' });

				let isSeeingAllTerms = false;
				let iteration = 0;
				while (!isSeeingAllTerms) {
					isSeeingAllTerms = await page.evaluate(() => {
						const loadMoreButton = document.querySelector('button[aria-label="See more"]');
						return loadMoreButton === null;
					});
					if (isSeeingAllTerms) {
						break;
					}
					iteration++;
					sendMessage(controller, { type: 'info', info: `Loading more terms... (${iteration})` });

					await page.click('button[aria-label="See more"]');
					await new Promise((resolve) => setTimeout(resolve, 3000)); // TODO: Find a better way to wait for the terms to load
				}

				const result = await page.evaluate(() => {
					const termsList = document.querySelector('section[data-testid="terms-list"]');

					if (!termsList) {
						console.error('Terms list section not found');
						return [];
					}

					const termElements = Array.from(termsList.children).filter(
						(child) => child.getAttribute('aria-label') === 'Term'
					);

					const termsArray = termElements.map((termElement) => {
						const termTexts = termElement.querySelectorAll('.TermText') as NodeListOf<HTMLElement>;

						const termText = termTexts[0]?.innerText || '';
						const definitionText = termTexts[1]?.innerText || '';

						return {
							term: termText,
							definition: definitionText
						};
					});

					return termsArray;
				});
				sendMessage(controller, { type: 'info', info: 'Done!' });

				sendMessage(controller, { type: 'success', data: { cards: result } });
				controller.close();
				browser.close();
			} catch (e) {
				sendMessage(controller, { type: 'error', error: e });
				if (controller) {
					controller.close();
				}
				console.log(e);
				return;
			}
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache'
		}
	});
};

type SSEMessage =
	| { type: 'info'; info: string }
	| { type: 'success'; data: { cards: { term: string; definition: string }[] } }
	| { type: 'error'; error: unknown };

async function sendMessage(controller: ReadableStreamDefaultController | null, data: SSEMessage) {
	const encoder = new TextEncoder();
	const body = JSON.stringify(data);
	controller?.enqueue(encoder.encode(`data: ${body}\n\n`));
}
