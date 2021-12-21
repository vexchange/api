import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";


@Controller({ path: "health" })
@ApiTags("health")
export class HealthController
{
  @Get()
    public getHealth(): void
    {
        return;
    }
}
