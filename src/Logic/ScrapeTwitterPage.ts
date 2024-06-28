import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

class ScrapeTwitterPage {
    async scrapeTwitterPage(url: string, ticker: string): Promise<number> {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        try {
            await page.goto(url, { waitUntil: 'networkidle2' });

            await page.waitForSelector('article div[lang]');

            const content = await page.content();
            const $ = cheerio.load(content);

            let count = 0;
            $('article div[lang]').each((_index, element) => {
                const tweetText = $(element).text();
                if (tweetText.includes(ticker)) {
                    count++;
                }
            });

            await browser.close();
            return count;

        } catch (error) {
            await browser.close();
            return 0;
        }
    }
}

export default ScrapeTwitterPage;