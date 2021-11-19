import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PairsController } from './pairs/pairs.controller';
import { PairsService } from './pairs/pairs.service';
import { TokenController } from './token/token.controller';

@Module({
  imports: [],
  controllers: [AppController, PairsController, TokenController],
  providers: [AppService, PairsService],
})
export class AppModule {}
