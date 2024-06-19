import { Test, TestingModule } from '@nestjs/testing';
import { JwtGenerateService } from './jwt.service';

describe('JwtService', () => {
  let service: JwtGenerateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtGenerateService],
    }).compile();

    service = module.get<JwtGenerateService>(JwtGenerateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
