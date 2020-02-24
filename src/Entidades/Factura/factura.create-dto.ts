import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FacturaCreateDto {

  @IsNotEmpty()
  @IsString()
  fecha: string;

  @IsNotEmpty()
  @IsString()
  direccion: string;

  @IsNotEmpty()
  @IsString()
  cliente: string;

}
