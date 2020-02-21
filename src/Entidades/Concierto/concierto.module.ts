import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConciertoEntity } from './concierto.entity';
import { ConciertoService } from './concierto.service';
import { ConciertoController } from './concierto.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        ConciertoEntity,
      ],
      'default',
    ),
  ],
  controllers: [
    ConciertoController,
  ],
  providers: [
    ConciertoService,
  ],
  exports: [
    ConciertoService,
  ],
})
export class ConciertoModule {
}
