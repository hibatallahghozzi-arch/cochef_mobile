import { plainToInstance } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumberString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsNumberString()
  PORT: string;

  @IsIn(['development', 'production', 'test'])
  NODE_ENV: string;

  @IsNotEmpty()
  JWT_SECRET: string;

  @IsNotEmpty()
  JWT_EXPIRES_IN: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(
      `Invalid environment configuration: ${errors
        .map((e) => Object.values(e.constraints ?? {}).join(', '))
        .join('; ')}`,
    );
  }
  return validatedConfig;
}
