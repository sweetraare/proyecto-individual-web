import { BadRequestException, Body, Controller, Get, Param, Post, Query, Res, Session } from '@nestjs/common';
import { validate } from 'class-validator';
import { DetalleFacturaService } from './detalleFactura.service';
import { DetalleFacturaEntity } from './detalleFactura.entity';
import { DetalleFacturaCreateDto } from './detalleFactura.create-dto';
import { ArtistaService } from '../Artista/artista.service';
import { FacturaService } from '../Factura/factura.service';


@Controller('detallefactura')
export class DetalleFacturaController {
  constructor(
    private readonly _detalleFacturaService: DetalleFacturaService,
    private readonly _artistaService: ArtistaService,
    private readonly _facturaService: FacturaService,
  ) {
  }

  @Post('finalizar/:id')
  async finalizar(
    @Param('id') id: string,
    @Res() res,
    @Session() session,
  ) {
    if (session.usuario) {
      if (session.usuario.roles.includes('Administrador')) {
        const factura = await this._facturaService.buscarUnaFactura(+id);
        await this._facturaService.actualizarFactura(+id, {
          ...factura,
          finalizada: true,
        });
        res.redirect('/factura/ruta/mostrar-facturas');
      }
    } else {
      res.redirect('/');
    }

  }

  @Post('eliminar/:id/:factura')
  async eliminarDetalle(
    @Param('id') id: number,
    @Param('factura') factura: number,
    @Res() res,
  ) {
    const detalle = await this._detalleFacturaService.buscarDetallesFactura({ id: +id });
    const facturaEntity = await this._facturaService.buscarUnaFactura(+factura);
    const artistas = await this._artistaService.buscarArtistas();

    try {

      await this._detalleFacturaService.borrarDetalle(detalle[0].id);
      await this._facturaService.actualizarFactura(facturaEntity.id, {
        ...facturaEntity,
        total: +(facturaEntity.total) - (detalle[0].subtotal),
      });

      const detalles = await this._detalleFacturaService.buscarDetallesFactura({ factura: +facturaEntity.id });

      res.render('factura/ruta-ingresar-detalles',
        {
          datos: {
            tipoMensaje: 0,
            factura: facturaEntity,
            artistas,
            detalles,
          },
        },
      );

    } catch (e) {
      res.send(e);
    }

  }

  @Post()
  async ingresarDetalleFactura(
    @Body() detallefactura: DetalleFacturaEntity,
    @Res() res,
    @Session() session,
  ): Promise<void> {
    if (session.usuario) {
      if (session.usuario.roles.includes('Administrador')) {
        console.log('detallefactura', detallefactura);
        const artista = await this._artistaService.buscarUnArtista(+detallefactura.artista);
        const factura = await this._facturaService.buscarUnaFactura(+detallefactura.factura);
        const artistas = await this._artistaService.buscarArtistas();

        const detallefacturaCreateDto = new DetalleFacturaCreateDto();
        detallefacturaCreateDto.cantidad = +detallefactura.cantidad;
        detallefacturaCreateDto.precio = artista.precio;
        detallefacturaCreateDto.factura = +detallefactura.factura;
        detallefacturaCreateDto.subtotal = artista.precio * +detallefactura.cantidad;
        const errores = await validate(detallefacturaCreateDto);
        if (errores.length > 0) {
          throw new BadRequestException(errores);
        } else {
          try {

            let total: number = (+artista.precio * +detallefactura.cantidad);
            total += +factura.total;

            await this._facturaService.actualizarFactura(factura.id, {
              ...factura,
              total,
            });

            await this._detalleFacturaService.crearDetalleFactura({
              ...detallefactura,
              subtotal: artista.precio * (+detallefactura.cantidad),
              precio: artista.precio,
            });
            const detalles = await this._detalleFacturaService.buscarDetallesFactura({ factura: +factura.id });

            res.render('factura/ruta-ingresar-detalles',
              {
                datos: {
                  tipoMensaje: 0,
                  factura,
                  artistas,
                  detalles,
                },
              },
            );
          } catch (e) {
            throw new BadRequestException(e);
          }
        }
      } else {
        res.send('No cuenta con permisos de Usuario');
      }
    }
  }

  @Get()
  buscarFacturas(
    @Query('skip') skip?: string | number,
    @Query('take') take?: string | number,
    @Query('where') where?: string,
    @Query('order') order?: string,
  ): Promise<DetalleFacturaEntity[] | undefined> {
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
    return this._detalleFacturaService.buscarDetallesFactura(
      where,
      skip as number,
      take as number,
      order,
    );
  }
}
