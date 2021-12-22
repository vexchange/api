import { Controller, Get, VERSION_NEUTRAL } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@Controller({ path: "health", version: VERSION_NEUTRAL })
@ApiTags("health")
export class HealthController
{
    @Get()
    public getHealth(): void
    {
        return;
    }
}
