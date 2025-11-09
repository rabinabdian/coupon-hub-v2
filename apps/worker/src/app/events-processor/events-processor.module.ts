import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsProcessor } from './events.processor';
import { Event } from '../../entities/event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    BullModule.registerQueue({
      name: 'events',
    }),
  ],
  providers: [EventsProcessor],
})
export class EventsProcessorModule {}
