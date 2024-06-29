import { Test, TestingModule } from '@nestjs/testing';
import { GoogleMapsController } from './google-maps.controller';

describe('GoogleMapsController', () => {
  let controller: GoogleMapsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleMapsController],
    }).compile();

    controller = module.get<GoogleMapsController>(GoogleMapsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
