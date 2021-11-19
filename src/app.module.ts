import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PairsController } from './pairs/pairs.controller';
import { PairsService } from './pairs/pairs.service';

@Module({
  imports: [],
  controllers: [AppController, PairsController],
  providers: [AppService, PairsService],
})
export class AppModule {}
