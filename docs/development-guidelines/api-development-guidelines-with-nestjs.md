# 📊 API Development Guidelines with NestJS

This document outlines specific best practices and guidelines for **API development** using NestJS. It complements the [📊 Typescript Coding Guidelines](../development-guidelines/typescript-coding-guidelines.md) document, which should also be adhered to for consistency and maintainability across the codebase.

The aim of this document is to provide clear, concise guidelines to ensure that NestJS-based APIs are well-structured, scalable, and easy to maintain. There are fewer specific rules here compared to other guidelines because much of the quality stems from the correct and conscious application of the **Object-Oriented (OO) paradigm** and **SOLID principles**.

* * *

### Folder and Feature Organization 🛠️

- 🔴 Implement **features grouping** in folders matching the domain area they are related to (domain-driven design).

Example:

```
/src
  /users
    users.controller.ts
    users.service.ts
    users.module.ts
    dto
      create-user.dto.ts
      update-user.dto.ts
  /products
    products.controller.ts
    products.service.ts
    products.module.ts
    dto
      create-product.dto.ts
```

* * *

### File Naming Conventions 📚

- 🔴 Use proper naming conventions for files:
  - DTO files: `[name].dto.ts`
  - Controller files: `[name].controller.ts`
  - Service files: `[name].service.ts`
  - Module files: `[name].module.ts`
  - Other components follow the same logical naming pattern.

Example:

```
users.controller.ts
users.service.ts
users.module.ts
create-user.dto.ts
update-user.dto.ts
```

* * *

### Database Interaction with Prisma 💻

- 🔴 Use **Prisma** for database communication.
- 🔴 Ensure **any change** to the Prisma model has a proper **migration defined**.
- 🔴 Update the **seeding script** whenever the Prisma model has changed.

Example workflow for model changes:

1. Modify the Prisma schema.
2. Run `prisma migrate dev` to create a new migration.
3. Update the seeding script under `prisma/seed.ts`.
4. Test the migration and seeding process.

> 🤔 You can catch mistakes early by using the [VSCode Prisma Extension](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)!

* * *

### Data Transfer Objects (DTOs) 🔄

- 🔴 Define **DTOs** for incoming and outgoing requests. **Never rely on the Prisma model itself**, even if the DTO exposes the same properties as the model.

**Why?**

- This ensures **loose dependency** between the DTOs and the domain entities.
- It provides better control over validation, exposure, and versioning of the API.

Example DTO:

```
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User name' })
  name: string;

  @ApiProperty({ description: 'User email' })
  email: string;
}
```

* * *

### Swagger Documentation 📏

- 🔴 Provide **Swagger documentation** using decorators on DTOs.

**Why?**

- This ensures the API specification is well-documented.
- It ensures the **API client for the webapp** is correctly generated, which is extremely important.

Example:

```
@ApiTags('users')
@Controller('users')
export class UsersController {
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 201, description: 'User created.' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
```

* * *

### Dependency Injection ⚖️

- 🔴 Always use **dependency injection** to inject and export providers through modules. This ensures that **NestJS handles instances properly at runtime**.

Example:

```
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
}
```

* * *

### Testing 🌟

- 🔴 Write **comprehensive tests**:
  - **Unit tests** for individual services and controllers.
  - **Integration tests** for verifying API endpoints.
  - **E2E tests** for testing the entire application flow.

Example test file structure:

```
/src
  /users
    users.controller.spec.ts  // Unit test for controller
    users.service.spec.ts     // Unit test for service
    users.e2e-spec.ts         // E2E test for users API
```

* * *

### Shared Logic and Utilities 🔧

- 🔴 Use **middlewares**, **guards**, and **pipes** to define shared logic so that you don't need to implement it in every controller or service.

Example:

```
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return !!request.user;
  }
}
```

- 🔴 Use **ExceptionFilters** and logging for proper error handling.

* * *

### Pagination for Long Responses 💡

- 🔴 Ensure long responses are **paginated** to avoid timeouts and excessive payload sizes.

* * *

By adhering to these NestJS-specific guidelines, along with general best practices, we can ensure that the APIs we build are scalable, maintainable, and efficient.
