export const config = (): object => ({
    port: process.env.PORT,
    tradingCompetition: {
        pairAddress: '0x39cd888a1583498AD30E716625AE1a00ff51286D',
        fromBlock: Number(10848841),
        toBlock: Number(11401689),
    },
});
