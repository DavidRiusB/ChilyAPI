import { Module } from '@nestjs/common';
import { JwtGenerateService } from './jwt.service';

@Module({
    providers: [JwtGenerateService],
    exports: [JwtGenerateService]
})
export class JwtModule {}
