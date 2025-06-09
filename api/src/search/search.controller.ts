import { Controller, Get, Query, SerializeOptions } from "@nestjs/common";
import { SearchService } from "./search.service";
import { SearchFilter } from "./dto/search-filter.dto";
import UseAuth from "src/auth/decorators/auth-with-role.decorator";
import { ApiOkResponse } from "@nestjs/swagger";
import { SearchResultDto } from "./dto/search-result.dto";

@Controller("search")
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @UseAuth()
  @ApiOkResponse({ type: SearchResultDto })
  @SerializeOptions({ type: SearchResultDto })
  searchAll(@Query() filter: SearchFilter) {
    return this.searchService.searchMatchingEntities(filter);
  }
}
