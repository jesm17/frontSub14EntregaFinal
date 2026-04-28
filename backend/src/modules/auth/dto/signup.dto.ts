import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @IsString({ message: 'El nombre debe ser texto.' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  name: string;

  @IsEmail({}, { message: 'Debes ingresar un correo electrónico válido.' })
  email: string;

  @IsString({ message: 'La contraseña debe ser texto.' })
  @MinLength(4, { message: 'La contraseña debe tener al menos 4 caracteres.' })
  password: string;
}
