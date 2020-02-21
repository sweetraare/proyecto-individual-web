import { BadRequestException, Body, Controller, Get, Param, Post, Query, Res, Session } from '@nestjs/common';
import { validate } from 'class-validator';
import { ArtistaService } from './artista.service';
import { ArtistaEntity } from './artista.entity';
import { ArtistaCreateDto } from './artista.create-dto';
import { ArtistaUpdateDto } from './artista.update-dto';

@Controller('artista')
export class ArtistaController {
  constructor(
    private readonly _artistaService: ArtistaService,
  ) {
  }

  @Post()
  async ingresarArtista(
    @Body() artista: ArtistaEntity,
    @Res() res,
    @Session() session,
  ): Promise<void> {
    if (session) {
      if (session.usuario.roles.includes('Administrador')) {
        const artistaCreateDto = new ArtistaCreateDto();
        artistaCreateDto.nombre = artista.nombre;
        artistaCreateDto.integrantes = artista.integrantes;
        artistaCreateDto.nacionalidad = artista.nacionalidad;
        artistaCreateDto.precio = artista.precio;
        artistaCreateDto.representante = artista.representante;

        const errores = await validate(artistaCreateDto);
        if (errores.length > 0) {
          throw new BadRequestException(errores);
        } else {
          try {
            await this._artistaService.crearArtista(artista);
            res.send('OK');
          } catch (e) {
            throw new BadRequestException(e);
          }
        }
      } else {
        res.send('No cuenta con permisos de Administrador');
      }
    }
  }

  @Get(':id')
  buscarUnaPareja(
    @Param('id') id: string,
  ): Promise<ArtistaEntity | undefined> {
    return this._artistaService.buscarUnArtista(Number(id));
  }

  @Get()
  buscarArtistas(
    @Query('skip') skip?: string | number,
    @Query('take') take?: string | number,
    @Query('where') where?: string,
    @Query('order') order?: string,
  ): Promise<ArtistaEntity[] | undefined> {
    if (order) {
      try {
        order = JSON.parse(order);
      } catch (e) {
        order = undefined;
      }
    }

    if (where) {
      try {
        where = JSON.parse(where);
      } catch (e) {
        where = undefined;
      }
    }
    return this._artistaService.buscarArtistas(
      where,
      skip as number,
      take as number,
      order,
    );
  }

  @Post('actualizar/:id')
  async actualizarArtista(
    @Body() artista: ArtistaEntity,
    @Param('id') id: string,
    @Res() res,
    @Session() session,
  ): Promise<void> {
    if (session) {
      if (session.usuario.roles.includes('Administrador')) {
        const artistaCreateDto = new ArtistaUpdateDto();
        artistaCreateDto.nombre = artista.nombre;
        artistaCreateDto.integrantes = artista.integrantes;
        artistaCreateDto.nacionalidad = artista.nacionalidad;
        artistaCreateDto.precio = artista.precio;
        artistaCreateDto.representante = artista.representante;
        artistaCreateDto.id = +id;
        const errores = await validate(artistaCreateDto);
        if (errores.length > 0) {
          throw new BadRequestException(errores);
        } else {
          try {

            await this._artistaService.actualizarArtista(+id, artista);
            res.send('Ok');
          } catch (e) {
            throw new BadRequestException(e);
          }
        }
      } else {
        res.send('No cuenta con permisos de Administrador');
      }
    }

  }

  @Post('eliminar/:id')
  async eliminarPareja(
    @Param('id') id: string,
    @Res() res,
    @Session() session,
  ): Promise<void> {
    if (session) {
      if (session.usuario.roles.includes('Administrador')) {
        try {
          await this._artistaService.borrarArtista(+id);
          res.send('Ok');
        } catch (error) {
          throw new BadRequestException();
        }
      } else {
        res.send('No cuenta con permisos de Administrador');
      }
    }

  }
}
