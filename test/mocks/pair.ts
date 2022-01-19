import { IPair, IPairs } from "@interfaces/pair";

export const allPairs: IPairs = {
    "0x2b6fc877ff5535b50f6c3e068bb436b16ec76fc5": {
        address: "0x2b6fc877ff5535b50f6c3e068bb436b16ec76fc5",
        token0: {
            name: "VeThor",
            symbol: "VTHO",
            contractAddress: "0x0000000000000000000000000000456e65726779",
            usdPrice: undefined,
            decimals: 18,
        },
        token1: {
            name: "Wrapped VET",
            symbol: "WVET",
            contractAddress: "0xD8CCDD85abDbF68DFEc95f06c973e87B1b5A9997",
            usdPrice: 0.123694,
            decimals: 18,
        },
        price: "13.648737925900864974",
        platformFee: "1%",
        swapFee: "25%",
        token0Reserve: "5456454",
        token1Reserve: "5456454",
        token0Volume: "4665940.498116731766938627",
        token1Volume: "336487.684316643656557238",
    },
};

export const pair: IPair = {
    address: "0x2b6fc877ff5535b50f6c3e068bb436b16ec76fc5",
    token0: {
        name: "VeThor",
        symbol: "VTHO",
        contractAddress: "0x0000000000000000000000000000456e65726779",
        usdPrice: undefined,
        decimals: 18,
    },
    token1: {
        name: "Wrapped VET",
        symbol: "WVET",
        contractAddress: "0xD8CCDD85abDbF68DFEc95f06c973e87B1b5A9997",
        usdPrice: 0.111724,
        decimals: 18,
    },
    price: "13.545140813075924863",
    platformFee: "0.1%",
    swapFee: "25%",
    token0Reserve: "44714135.980865628120959008",
    token1Reserve: "3301120.054632464973851585",
    token0Volume: "8542303.782305247881428819",
    token1Volume: "619979.933041357218919542",
};
