import { applyDecorators } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
export function DocumentationExcludeController() {
    return applyDecorators(
        ApiExcludeEndpoint()
    )
}