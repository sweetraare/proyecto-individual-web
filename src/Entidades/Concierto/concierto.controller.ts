import { BadRequestException, Body, Controller, Get, Param, Post, Query, Res, Session } from '@nestjs/common';
import { validate } from 'class-validator';
import { ConciertoService } from './concierto.service';
import { ConciertoEntity } from './concierto.entity';
import { ConciertoCreateDto } from './concierto.create-dto';
import { ConciertoUpdateDto } from './concierto.update-dto';
import { log } from 'util';

@Controller('concierto')
export class ConciertoController {
  constructor(
    private readonly _conciertoService: ConciertoService,
  ) {
  }

  @Get('ruta/crear-concierto')
  async rutaCrearConcierto(
    @Res() res,
    @Session() session,
  ): Promise<void> {
    session.usuario ? res.render('concierto/ruta-crear-concierto',
      {
        datos: {
          tipoMensaje: 0,
        },
      },
    ) : res.redirect('/');
  }

  @Get('ruta/editar-concierto/:id')
  async rutaEditarConcierto(
    @Res() res,
    @Param('id') id: string,
    @Session() session
  ): Promise<void> {
    const concierto = await this._conciertoService.buscarUnConciero(+id);
    session.usuario ? res.render('concierto/ruta-crear-concierto',
      {
        datos: {
          tipoMensaje: 0,
          concierto,

        },
      },
    ) : res.redirect('/');
  }

  @Get('ruta/mostrar-conciertos')
  async rutaMostrarConcierto(
    @Res() res,
    @Session() session
  ): Promise<void> {
    const conciertos = await this._conciertoService.buscarConciertos();
    session.usuario ? res.render('concierto/ruta-mostrar-concierto',
      {
        datos: {
          conciertos,
        },
      },
    ) : res.redirect('/');
  }

  @Post()
  async ingresarConcierto(
    @Body() concierto: ConciertoEntity,
    @Res() res,
    @Session() session,
  ): Promise<void> {
    console.log('concierto', concierto);
    if (session) {
      if (session.usuario.roles.includes('Administrador')) {
        const conciertoCreateDto = new ConciertoCreateDto();
        conciertoCreateDto.area = concierto.area;
        conciertoCreateDto.capacidad = +concierto.capacidad;
        conciertoCreateDto.ciudad = concierto.ciudad;
        conciertoCreateDto.horaFin = +concierto.horaFin;
        conciertoCreateDto.horaInicio = +concierto.horaInicio;
        conciertoCreateDto.tipoMusica = concierto.tipoMusica;
        conciertoCreateDto.nombre = concierto.nombre;
        const errores = await validate(conciertoCreateDto);
        if (errores.length > 0) {
          throw new BadRequestException(errores);
        } else {
          try {
            await this._conciertoService.crearConcierto(concierto);
            res.redirect('concierto/ruta/mostrar-conciertos');
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
  buscarUnConcierto(
    @Param('id') id: string,
  ): Promise<ConciertoEntity | undefined> {
    return this._conciertoService.buscarUnConciero(+id);
  }

  @Get()
  buscarConcierto(
    @Query('skip') skip?: string | number,
    @Query('take') take?: string | number,
    @Query('where') where?: string,
    @Query('order') order?: string,
  ): Promise<ConciertoEntity[] | undefined> {
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
    return this._conciertoService.buscarConciertos(
      where,
      skip as number,
      take as number,
      order,
    );
  }

  @Post(':id')
  async actualizarConcierto(
    @Body() concierto: ConciertoEntity,
    @Param('id') id: string,
    @Res() res,
    @Session() session,
  ): Promise<void> {
    if (session) {
      console.log(session);
      if (session.usuario.roles.includes('Administrador')) {
        const conciertoCreateDto = new ConciertoUpdateDto();
        conciertoCreateDto.area = concierto.area;
        conciertoCreateDto.capacidad = concierto.capacidad;
        conciertoCreateDto.ciudad = concierto.ciudad;
        conciertoCreateDto.horaFin = concierto.horaFin;
        conciertoCreateDto.horaInicio = concierto.horaInicio;
        conciertoCreateDto.tipoMusica = concierto.tipoMusica;
        conciertoCreateDto.id = +id;
        const errores = await validate(conciertoCreateDto);
        if (errores.length > 0) {
          throw new BadRequestException(errores);
        } else {
          try {

            await this._conciertoService.actualizarConcierto(+id, concierto);
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

  @Post(':id')
  async eliminarConcierto(
    @Param('id') id: string,
    @Res() res,
    @Session() session,
  ): Promise<void> {
    if (session) {
      if (session.usuario.roles.includes('Administrador')) {
        try {
          await this._conciertoService.borrarConcierto(+id);
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
