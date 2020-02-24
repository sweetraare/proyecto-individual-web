import { BadRequestException, Body, Controller, Get, Param, Post, Query, Res, Session } from '@nestjs/common';
import { validate } from 'class-validator';
import { FacturaService } from './factura.service';
import { FacturaEntity } from './factura.entity';
import { FacturaCreateDto } from './factura.create-dto';
import { ArtistaService } from '../Artista/artista.service';

@Controller('factura')
export class FacturaController {
  constructor(
    private readonly _facturaService: FacturaService,
    private readonly _artistaService: ArtistaService,
  ) {
  }

  @Get('ruta/crear-factura')
  async rutaCrearFactura(
    @Res() res,
    @Session() session,
  ): Promise<void> {
    session.usuario ? res.render('factura/ruta-crear-factura',
      {
        datos: {
          tipoMensaje: 0,
        },
      },
    ) : res.redirect('/');
  }

  @Get('ruta/ingresar-detalles/:id')
  async rutaCrearDetalles(
    @Res() res,
    @Session() session,
    @Param('id') id: number,
  ): Promise<void> {
    const factura = await this._facturaService.buscarUnaFactura(+id);
    const artistas = await this._artistaService.buscarArtistas();
    session.usuario ? res.render('factura/ruta-ingresar-detalles',
      {
        datos: {
          tipoMensaje: 0,
          factura,
          artistas,
        },
      },
    ) : res.redirect('/');
  }

  @Get('ruta/mostrar-facturas')
  async rutaMostrarFacturas(
    @Res() res,
    @Session() session,
  ): Promise<void> {
    const facturas = await this._facturaService.buscarFacturas();
    session.usuario ? res.render('factura/ruta-mostrar-facturas',
      {
        datos: {
          tipoMensaje: 0,
          facturas,
        },
      },
    ) : res.redirect('/');
  }

  @Get('ruta/editar/:id')
  async editarFacturas(
    @Res() res,
    @Session() session,
    @Param('id') id: number,
  ): Promise<void> {
    if (session.usuario) {
      if (session.usuario.roles.includes('Administrador')) {
        const factura = await this._facturaService.buscarUnaFactura(+id);
        const artistas = await this._artistaService.buscarArtistas();

        res.render('factura/ruta-ingresar-detalles',
          {
            datos: {
              tipoMensaje: 0,
              factura,
              artistas,
              detalles: factura.detalles,
            },
          },
        );
      } else {
        res.redirect('/');
      }
    } else {
      res.redirect('/');
    }


  }


  @Post()
  async ingresarFactura(
    @Body() factura: FacturaEntity,
    @Res() res,
    @Session() session,
  ): Promise<void> {
    if (session.usuario) {
      if (session.usuario.roles.includes('Administrador')) {
        const facturaCreateDto = new FacturaCreateDto();
        facturaCreateDto.fecha = factura.fecha;
        facturaCreateDto.direccion = factura.direccion;
        facturaCreateDto.cliente = factura.cliente;
        factura.usuario = session.usuario.userId;
        const errores = await validate(facturaCreateDto);
        if (errores.length > 0) {
          throw new BadRequestException(errores);
        } else {
          try {
            const facturaIngresada = await this._facturaService.crearFactura(factura);
            res.redirect(`/factura/ruta/ingresar-detalles/${facturaIngresada.id}`);
          } catch (e) {
            throw new BadRequestException(e);
          }
        }
      } else {
        res.send('No cuenta con permisos de Usuario');
      }
    }
  }

  @Get(':id')
  buscarUnaFactura(
    @Param('id') id: string,
  ): Promise<FacturaEntity | undefined> {
    return this._facturaService.buscarUnaFactura(Number(id));
  }

  @Get()
  buscarFacturas(
    @Query('skip') skip?: string | number,
    @Query('take') take?: string | number,
    @Query('where') where?: string,
    @Query('order') order?: string,
  ): Promise<FacturaEntity[] | undefined> {
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
    return this._facturaService.buscarFacturas(
      where,
      skip as number,
      take as number,
      order,
    );
  }
}
