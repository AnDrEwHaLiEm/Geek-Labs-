import ReadFromConsole from "./Logic/ReadFromConsole";
import ScrapeTwitterAccounts from "./Logic/ScrapeTwitterAccounts";

const waitingTimeInterval = async (totalMinutes: number): Promise<void> => {
    const barLength = 60; 
    const totalTimeSeconds = (totalMinutes * 60) + (totalMinutes <= 1 ? 20 : 0);
    let elapsedSeconds = 0;

    return new Promise<void>((resolve) => {
        const interval = setInterval(() => {
            elapsedSeconds += 1; 
            const percent = (elapsedSeconds / totalTimeSeconds) * 100;
            const filledLength = Math.round((barLength * elapsedSeconds) / totalTimeSeconds);
            const bar = '▇'.repeat(filledLength) + '-'.repeat(barLength - filledLength);

            process.stdout.write(`Waiting: [${bar}] ${percent.toFixed(2)}%\r`);

            if (elapsedSeconds >= totalTimeSeconds) {
                clearInterval(interval);
                process.stdout.clearLine(0); 
                process.stdout.cursorTo(0);
                resolve();
            }
        }, 1000);
    });
}

const startProcess = async (): Promise<void> => {
    const readData = new ReadFromConsole();
    const { twitterAccounts, ticker, interval } = await readData.startTakeInput();

    console.log('\nStarting scraping with the following parameters:');
    console.log('Twitter Accounts:', twitterAccounts);
    console.log('Ticker:', ticker);
    console.log('Interval:', interval, 'minutes\n');

    const scrapeTwitterAccountsInstance = new ScrapeTwitterAccounts();
    while (true) {
        const scrapingPromise = scrapeTwitterAccountsInstance.scrapeTwitterAccounts(twitterAccounts, ticker);
        const progressBarPromise = waitingTimeInterval(interval);
        await Promise.all([progressBarPromise, scrapingPromise]);
        const totalMentions = await scrapingPromise;
        console.log(`'${ticker}' was mentioned '${totalMentions}' times in the last '${interval}' minutes.`);
    }
}

startProcess().catch(error => console.error('Error in scraping process:', error));
