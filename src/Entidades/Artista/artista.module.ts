import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistaEntity } from './artista.entity';
import { ArtistaService } from './artista.service';
import { ArtistaController } from './artista.controller';
import { ConciertoService } from '../Concierto/concierto.service';
import { ConciertoEntity } from '../Concierto/concierto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        ArtistaEntity,
        ConciertoEntity,
      ],
      'default',
    ),
  ],
  controllers: [
    ArtistaController,
  ],
  providers: [
    ArtistaService,
    ConciertoService,
  ],
  exports: [
    ArtistaService,
    ConciertoService,
  ],
})
export class ArtistaModule {
}
