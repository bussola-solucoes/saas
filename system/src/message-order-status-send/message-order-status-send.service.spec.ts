import { Test, TestingModule } from '@nestjs/testing';
import { MessageOrderStatusSendService } from './message-order-status-send.service';

describe('MessageOrderStatusSendService', () => {
  let service: MessageOrderStatusSendService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageOrderStatusSendService],
    }).compile();

    service = module.get<MessageOrderStatusSendService>(MessageOrderStatusSendService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
