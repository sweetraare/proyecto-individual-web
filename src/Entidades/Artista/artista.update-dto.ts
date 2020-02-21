import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class ArtistaUpdateDto {

  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  representante: string;

  @IsNumber()
  @IsPositive()
  integrantes: number;

  @IsNotEmpty()
  @IsString()
  nacionalidad: string;

  @IsNumber()
  precio: number;
}
