import { ApiProperty } from "@nestjs/swagger";

export class EnvironmentVariablesDto {
  @ApiProperty({
    description: "Hostname or IP address of the database server",
    example: "localhost",
  })
  DB_HOST: string;

  @ApiProperty({
    description: "Port number of the database server",
    example: 5432,
  })
  DB_PORT: number;

  @ApiProperty({
    description: "Username for connecting to the database",
    example: "postgres",
  })
  DB_USERNAME: string;

  @ApiProperty({
    description: "Password for connecting to the database",
    example: "your_password",
    required: false,
  })
  DB_PASSWORD?: string;

  @ApiProperty({
    description: "Name of the database to connect to",
    example: "your_database_name",
  })
  DB_DATABASE: string;

  @ApiProperty({
    description: "Secret key for JWT token generation",
    example: "secretsecret",
  })
  JWT_SECRET: string;

  @ApiProperty({
    description: "Secret key for session management",
    example: "secretsecret",
  })
  SESSION_PASSPORT: string;

  @ApiProperty({
    description: "Client ID for Google OAuth authentication",
    example: "your_client_id",
  })
  GOOGLE_CLIENT_ID: string;

  @ApiProperty({
    description: "Client secret for Google OAuth authentication",
    example: "your_client_secret",
  })
  GOOGLE_CLIENT_SECRET: string;

  @ApiProperty({
    description: "Email address for sending notifications",
    example: "your_email@example.com",
  })
  NOTIFICATIONS_EMAIL_USER: string;

  @ApiProperty({
    description: "Password or access key for the email account",
    example: "your_email_password_or_key",
  })
  NOTIFICATIONS_EMAIL_PASS: string;

  @ApiProperty({
    description: "URL for password reset functionality",
    example: "http://localhost:3000/reset-password",
  })
  NOTIFICATIONS_PASSWORD_RESET_URL: string;

  @ApiProperty({
    description: "Stripe secret key for API authentication",
    example: "your_stripe_secret_key",
  })
  STRIPE_SECRET_KEY: string;

  @ApiProperty({
    description: "Stripe public key for API authentication",
    example: "your_stripe_public_key",
  })
  STRIPE_PUBLIC_KEY: string;

  @ApiProperty({
    description: "Port number on which the server will run",
    example: 3000,
  })
  PORT: number;

  @ApiProperty({
    description: "Backend URL of the application",
    example: "http://localhost:3000",
  })
  BACKEND_URL: string;

  @ApiProperty({
    description: "Frontend URL of the application",
    example: "http://localhost:3000",
  })
  FRONTEND_URL: string;

  @ApiProperty({
    description: "API key for Google Maps services",
    example: "your_google_maps_api_key",
  })
  GOOGLE_MAPS_API_KEY: string;

  @ApiProperty({
    description: "Access key ID for AWS S3 storage",
    example: "your_aws_access_key_id",
  })
  AWS_ACCESS_KEY_ID: string;

  @ApiProperty({
    description: "Secret access key for AWS S3 storage",
    example: "your_aws_secret_access_key",
  })
  AWS_SECRET_ACCESS_KEY: string;

  @ApiProperty({
    description: "Region where AWS S3 bucket is located",
    example: "your_aws_region",
  })
  AWS_S3_REGION: string;

  @ApiProperty({
    description: "Name of the AWS S3 bucket",
    example: "your_s3_bucket_name",
  })
  BUCKET: string;

  @ApiProperty({
    description: "Physical address of the restaurant location",
    example: "Monte Grande, Buenos Aires",
  })
  ADDRESS: string;
}
