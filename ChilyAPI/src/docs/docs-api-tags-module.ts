import { ApiTags } from '@nestjs/swagger';

export class DocumentationApiTagsModule {
  static clasification(tagName: string) {
    return ApiTags(tagName);
  }
}
