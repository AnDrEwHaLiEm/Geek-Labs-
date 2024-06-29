import ScrapeTwitterPage from "./ScrapeTwitterPage";
class ScrapeTwitterAccounts {
    async scrapeTwitterAccounts(twitterAccounts: string[], ticker: string): Promise<number> {
        let totalMentions = 0;
        const scrapeTwitterPageInstance = new ScrapeTwitterPage();
        for (const account of twitterAccounts) {
            const mentions = await scrapeTwitterPageInstance.scrapeTwitterPage(account, ticker);
            totalMentions += mentions;
        }
        return totalMentions;
    }
}

export default ScrapeTwitterAccounts;