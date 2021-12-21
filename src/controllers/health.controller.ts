import { ApiTags } from "@nestjs/swagger";
import { Controller, Get } from "@nestjs/common";


@Controller({ path: "health", version: "1" })
@ApiTags("health")
export class HealthController
{
  @Get()
    public getHealth(): void
    {
        return;
    }
}
