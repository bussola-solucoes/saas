import { Test, TestingModule } from '@nestjs/testing';
import { MessageOrderStatusController } from './message-order-status.controller';
import { MessageOrderStatusService } from './message-order-status.service';

describe('MessageOrderStatusController', () => {
  let controller: MessageOrderStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageOrderStatusController],
      providers: [MessageOrderStatusService],
    }).compile();

    controller = module.get<MessageOrderStatusController>(MessageOrderStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
