import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { EventsService, CreateEventDto } from './events.service';
import { IsString, IsObject, IsOptional } from 'class-validator';

class CreateEventRequestDto implements CreateEventDto {
  @ApiProperty({ example: 'user_action' })
  @IsString()
  type: string;

  @ApiProperty({ example: { action: 'click', target: 'coupon' } })
  @IsObject()
  data: Record<string, any>;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  userId?: string;
}

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new event and enqueue it for processing' })
  @ApiResponse({ status: 201, description: 'Event enqueued successfully' })
  async createEvent(@Body() createEventDto: CreateEventRequestDto): Promise<{ jobId: string }> {
    return this.eventsService.createEvent(createEventDto);
  }
}
