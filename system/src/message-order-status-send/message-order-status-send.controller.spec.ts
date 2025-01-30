import { Test, TestingModule } from '@nestjs/testing';
import { MessageOrderStatusSendController } from './message-order-status-send.controller';
import { MessageOrderStatusSendService } from './message-order-status-send.service';

describe('MessageOrderStatusSendController', () => {
  let controller: MessageOrderStatusSendController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageOrderStatusSendController],
      providers: [MessageOrderStatusSendService],
    }).compile();

    controller = module.get<MessageOrderStatusSendController>(MessageOrderStatusSendController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
