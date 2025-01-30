import { Test, TestingModule } from '@nestjs/testing';
import { MessageOrderStatusService } from './message-order-status.service';

describe('MessageOrderStatusService', () => {
  let service: MessageOrderStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageOrderStatusService],
    }).compile();

    service = module.get<MessageOrderStatusService>(MessageOrderStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
