import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';

export const securitySchemeName: string =
  process.env.SWAGGER_SECURITY_SCHEME_NAME || 'authorizationToken2';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Referral broker example')
  .setDescription('The Referral broker API description')
  .setVersion('1.0')
  .addTag('broker')
  .addBearerAuth(
    {
      type: 'http', //'http' | 'apiKey' | 'oauth2' | 'openIdConnect'
      scheme: 'bearer', //'bearer' | 'basic' | 'digest' | 'negotiate' | 'ntlm'
      bearerFormat: 'JWT', //'JWT' | 'JWTFFF' | 'MyCustomToken' | string => بی مصرف! فقط در جیسونش درج میشه!
    },
    securitySchemeName,
  )
  //   .addSecurityRequirements('111authorization111')
  .build();

export const swaggerDocumentOptions: SwaggerDocumentOptions = {};

export const swaggerCustomOptions: SwaggerCustomOptions = {};
