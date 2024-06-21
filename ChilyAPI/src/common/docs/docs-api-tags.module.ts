import { ApiTags } from '@nestjs/swagger';

export class DocsApiTagsModule {
  static auth() {
    return ApiTags('auth');
  }
}
