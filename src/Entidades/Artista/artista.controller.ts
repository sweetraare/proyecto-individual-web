import { BadRequestException, Body, Controller, Get, Param, Post, Query, Res, Session } from '@nestjs/common';
import { validate } from 'class-validator';
import { ArtistaService } from './artista.service';
import { ArtistaEntity } from './artista.entity';
import { ArtistaCreateDto } from './artista.create-dto';
import { ArtistaUpdateDto } from './artista.update-dto';
import { ConciertoService } from '../Concierto/concierto.service';

@Controller('artista')
export class ArtistaController {
  constructor(
    private readonly _artistaService: ArtistaService,
    private readonly _conciertoService: ConciertoService,
  ) {
  }

  @Get('ruta/crear-artista')
  async rutaCrearArtista(
    @Res() res,
    @Session() session,
  ): Promise<void> {
    const conciertos = await this._conciertoService.buscarConciertos();
    session.usuario ? res.render('artista/ruta-crear-artista',
      {
        datos: {
          tipoMensaje: 0,
          conciertos
        },
      },
    ) : res.redirect('/');
  }

  @Get('ruta/mostrar-artista')
  async rutaMostrarArtista(
    @Res() res,
    @Session() session,
  ): Promise<void> {
    const artistas = await this._artistaService.buscarArtistas();
    console.log('artistas', artistas )
    session.usuario ? res.render('artista/ruta-mostrar-artista',
      {
        datos: {
          tipoMensaje: 0,
          artistas
        },
      },
    ) : res.redirect('/');
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
        artistaCreateDto.integrantes = +artista.integrantes;
        artistaCreateDto.nacionalidad = artista.nacionalidad;
        artistaCreateDto.precio = +artista.precio;
        artistaCreateDto.representante = artista.representante;

        const errores = await validate(artistaCreateDto);
        if (errores.length > 0) {
          throw new BadRequestException(errores);
        } else {
          try {
            await this._artistaService.crearArtista(artista);
            res.redirect('/artista/ruta/mostrar-artista');
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
