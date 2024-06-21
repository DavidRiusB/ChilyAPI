import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';

@Module({
  providers: [SessionsService],
  exports: [SessionsService]
})
export class SessionsModule {}
//