import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

export interface CreateEventDto {
  type: string;
  data: Record<string, any>;
  userId?: string;
}

@Injectable()
export class EventsService {
  constructor(
    @InjectQueue('events')
    private eventsQueue: Queue
  ) {}

  async createEvent(eventDto: CreateEventDto): Promise<{ jobId: string }> {
    const job = await this.eventsQueue.add('process-event', eventDto);
    return { jobId: job.id };
  }
}
