import { Controller, Get, Query } from "@nestjs/common";
import { SearchService } from "./search.service";
import { SearchFilter } from "./dto/search-filter.dto";
import UseAuth from "src/auth/decorators/auth-with-role.decorator";

@Controller("search")
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @UseAuth()
  searchPhysiotherapist(@Query() filter: SearchFilter) {
    return this.searchService.searchMatchingEntities(filter);
  }
}
