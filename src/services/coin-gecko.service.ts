import { Injectable, OnModuleInit } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import CoinGecko from "coingecko-api";

@Injectable()
export class CoinGeckoService implements OnModuleInit
{
    private client: CoinGecko | undefined;
    private vetPrice: number | undefined;

    @Interval(60000)
    private async fetch(): Promise<void>
    {
        this.vetPrice = (
            await this.client.simple.price({
                ids: ["vechain"],
                vs_currencies: ["usd"],
            })
        ).data.vechain.usd;
    }

    public onModuleInit(): void
    {
        this.client = new CoinGecko();
        this.fetch();
    }

    public getVetPrice(): number | undefined
    {
        return this.vetPrice;
    }
}
