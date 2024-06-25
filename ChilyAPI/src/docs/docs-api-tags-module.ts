import { ApiTags } from '@nestjs/swagger';

export class DocumentationApiTagsModule {
  static clasification(tagName: string): ReturnType<typeof ApiTags> {
    return ApiTags(tagName);
  }
}
