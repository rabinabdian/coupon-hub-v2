import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { EventsService } from './events.service';

describe('EventsService', () => {
  let service: EventsService;
  let queue: Queue;

  const mockQueue = {
    add: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getQueueToken('events'),
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    queue = module.get<Queue>(getQueueToken('events'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createEvent', () => {
    it('should enqueue an event and return job id', async () => {
      const eventDto = {
        type: 'user_action',
        data: { action: 'click', target: 'button' },
        userId: 'user-123',
      };

      const mockJob = {
        id: 'job-123',
      };

      mockQueue.add.mockResolvedValue(mockJob);

      const result = await service.createEvent(eventDto);

      expect(result).toEqual({ jobId: 'job-123' });
      expect(mockQueue.add).toHaveBeenCalledWith('process-event', eventDto);
    });

    it('should enqueue an event without userId', async () => {
      const eventDto = {
        type: 'page_view',
        data: { page: '/home' },
      };

      const mockJob = {
        id: 'job-456',
      };

      mockQueue.add.mockResolvedValue(mockJob);

      const result = await service.createEvent(eventDto);

      expect(result).toEqual({ jobId: 'job-456' });
      expect(mockQueue.add).toHaveBeenCalledWith('process-event', eventDto);
    });
  });
});
