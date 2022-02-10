export default () => ({
  port: process.env.PORT || 3000,
  tradingCompetition: {
    pairAddress: process.env.TRADING_COMPETITION_PAIR_ADDRESS || "0x2B6fC877fF5535b50f6C3e068BB436b16EC76fc5",
    fromBlock: Number(process.env.TRADING_COMPETITION_FROM_BLOCK),
    toBlock: Number(process.env.TRADING_COMPETITION_TO_BLOCK)
  }
});
