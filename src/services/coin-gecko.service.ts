import { Injectable, OnModuleInit } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import * as CoinGecko from "coingecko-api";

@Injectable()
export class CoinGeckoService implements OnModuleInit
{
    private mClient: typeof CoinGecko | undefined;
    private mVetPrice: number | undefined;

    @Interval(60000)
    private async fetch(): Promise<void>
    {
        if (this.mClient === undefined) { throw new Error("Client undefined"); }
        this.mVetPrice = (
            await this.mClient.simple.price({
                ids: ["vechain"],
                vs_currencies: ["usd"],
            })
        ).data.vechain.usd;
    }

    public onModuleInit(): void
    {
        this.mClient = new CoinGecko();
        this.fetch();
    }

    public getVetPrice(): number | undefined
    {
        return this.mVetPrice;
    }
}
