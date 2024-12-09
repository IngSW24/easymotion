import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventEntity } from './entities/event.entity';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { PaginationFilter } from 'src/common/dto/pagination-filter.dto';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /**
   * Create a new event
   * @param createEventDto the event to create
   * @returns the created event
   */
  @Post()
  @ApiCreatedResponse({ type: EventEntity })
  create(@Body() createEventDto: CreateEventDto) {
    console.log('creating event', createEventDto);
    return this.eventsService.create(createEventDto);
  }

  /**
   * Find all events
   * @returns all events
   */
  @Get()
  @ApiPaginatedResponse(EventEntity)
  findAll(@Query() pagination: PaginationFilter) {
    return this.eventsService.findAll(pagination);
  }

  /**
   * Find an event by its id
   * @param id the event uuid
   * @returns the event with the given id
   */
  @Get(':id')
  @ApiOkResponse({ type: EventEntity })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  /**
   * Update an event by its id
   * @param id the event uuid
   * @param updateEventDto fields to update
   * @returns the updated event
   */
  @Put(':id')
  @ApiOkResponse({ type: EventEntity })
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  /**
   * Delete an event by its id
   * @param id the event uuid
   */
  @Delete(':id')
  @ApiOkResponse()
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
