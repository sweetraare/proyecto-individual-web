import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistaEntity } from './artista.entity';
import { ArtistaService } from './artista.service';
import { ArtistaController } from './artista.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        ArtistaEntity,
      ],
      'default',
    ),
  ],
  controllers: [
    ArtistaController,
  ],
  providers: [
    ArtistaService,
  ],
  exports: [
    ArtistaService,
  ],
})
export class ArtistaModule {
}
