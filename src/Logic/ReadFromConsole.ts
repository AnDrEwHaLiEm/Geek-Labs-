import * as readline from 'readline/promises';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class ReadFromConsole {
    private twitterAccounts: string[] = [];
    private ticker: string = "";
    private interval: number = 0;


    async askTwitterAccounts(): Promise<string[]> {
        const accountsInput = await rl.question('Enter the list of Twitter accounts (separated by commas): ');
        return accountsInput.split(',').map(account => account.trim());

    }


    async askTicker(): Promise<string> {
        const tickerInput = await rl.question('Enter the ticker symbol to search (e.g., $TSLA): ');
        if (tickerInput.startsWith('$'))
            return tickerInput;
        else
            console.log('Invalid ticker symbol. It must start with "$".');
        return this.askTicker();
    }



    async askInterval(): Promise<number> {
        const intervalInput = await rl.question('Enter the time interval in minutes between scrapes (e.g., 15): ')
        const parsedInterval = parseInt(intervalInput);
        if (!isNaN(parsedInterval) && parsedInterval > 0) {
            return parsedInterval;
        } else {
            console.log('Invalid interval. It must be a positive number.');
            return this.askInterval();
        }
    }


    async startTakeInput() {
        this.twitterAccounts = await this.askTwitterAccounts();
        this.ticker = await this.askTicker();
        this.interval = await this.askInterval();
        rl.close();
        return {
            twitterAccounts: this.twitterAccounts,
            ticker: this.ticker,
            interval: this.interval
        }
    }


}

export default ReadFromConsole;