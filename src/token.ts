export class Token
{
    private readonly name: string;
    private readonly symbol: string;
    private readonly contractAddress: string;
    private usdPrice: number | undefined;
    // readonly circulatingSupply: BigNumber;
    // readonly totalSupply: BigNumber;

    public constructor(
        aName: string,
        aSymbol: string,
        aContractAddress: string,
        aUsdPrice: number | undefined,
        aDecimals: number,
    // aCirculatingSupply,
    // aTotalSupply,
    )
    {
        this.name = aName;
        this.symbol = aSymbol;
        this.contractAddress = aContractAddress;
        this.usdPrice = aUsdPrice;
        this.decimals = aDecimals;
    // this.circulatingSupply = aCirculatingSupply;
    // this.totalSupply = aTotalSupply;
    }

    public readonly decimals: number;

    public getUsdPrice(): number | undefined
    {
        return this.usdPrice;
    }

    public setUsdPrice(aNewUsdPrice: number | undefined): void
    {
        this.usdPrice = aNewUsdPrice;
    }
}

export class Tokens
{
  [key: string]: Token;
}
