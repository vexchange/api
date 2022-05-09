export const config = (): object => ({
    port: process.env.PORT,
    tradingCompetition: {
        pairAddress: '0x25491130A43d43AB0951d66CdF7ddaC7B1dB681b',
        fromBlock: Number(11848076),
        toBlock: Number(11969036),
    },
});