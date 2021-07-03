import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';

import { QueryFailedErrorFilter } from 'src/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new QueryFailedErrorFilter());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
