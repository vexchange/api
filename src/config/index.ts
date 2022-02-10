export const config = (): object => ({
    port: process.env.PORT,
    tradingCompetition: {
        pairAddress: process.env.TRADING_COMPETITION_PAIR_ADDRESS,
        fromBlock: Number(process.env.TRADING_COMPETITION_FROM_BLOCK),
        toBlock: Number(process.env.TRADING_COMPETITION_TO_BLOCK),
    },
});
