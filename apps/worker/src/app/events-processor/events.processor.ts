import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from 'bullmq';
import { Event } from '../../entities/event.entity';

interface EventJob {
  type: string;
  data: Record<string, any>;
  userId?: string;
}

@Processor('events', {
  concurrency: 5,
  limiter: {
    max: 10,
    duration: 1000,
  },
})
export class EventsProcessor extends WorkerHost {
  private readonly logger = new Logger(EventsProcessor.name);
  private eventBatch: EventJob[] = [];
  private batchSize = 10;
  private batchTimeout: NodeJS.Timeout | null = null;

  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>
  ) {
    super();
  }

  async process(job: Job<EventJob>): Promise<void> {
    this.logger.log(`Processing event job ${job.id}: ${job.data.type}`);

    // Add to batch
    this.eventBatch.push(job.data);

    // If batch is full, process immediately
    if (this.eventBatch.length >= this.batchSize) {
      await this.processBatch();
    } else {
      // Set timeout to process batch after 5 seconds if not full
      if (this.batchTimeout) {
        clearTimeout(this.batchTimeout);
      }
      this.batchTimeout = setTimeout(async () => {
        if (this.eventBatch.length > 0) {
          await this.processBatch();
        }
      }, 5000);
    }
  }

  private async processBatch(): Promise<void> {
    if (this.eventBatch.length === 0) return;

    const batch = [...this.eventBatch];
    this.eventBatch = [];

    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }

    try {
      const events = batch.map((eventData) => {
        const event = new Event();
        event.type = eventData.type;
        event.data = eventData.data;
        event.userId = eventData.userId;
        return event;
      });

      await this.eventRepository.save(events);
      this.logger.log(`Successfully saved batch of ${events.length} events to database`);
    } catch (error) {
      this.logger.error(`Failed to save event batch: ${error.message}`, error.stack);
      // Re-add to batch for retry
      this.eventBatch.push(...batch);
    }
  }
}
