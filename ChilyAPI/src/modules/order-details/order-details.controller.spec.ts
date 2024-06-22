import { Test, TestingModule } from '@nestjs/testing';
import { OrderDetailsController } from './order-details.controller';

describe('OrderDetailsController', () => {
  let controller: OrderDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderDetailsController],
    }).compile();

    controller = module.get<OrderDetailsController>(OrderDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
