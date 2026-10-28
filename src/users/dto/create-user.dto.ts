import {
  IsEmail,
  IsInt,
  IsString,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(1)
  @Max(120)
  age: number;
}