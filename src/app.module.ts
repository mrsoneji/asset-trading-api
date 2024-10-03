import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'local'}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
    }),
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  // Este hook se llama cuando el módulo está listo
  async onModuleInit() {
    try {
      // Verificar si la conexión es exitosa
      await this.dataSource.query('SELECT 1');
      console.log('Conexión a la base de datos exitosa');
    } catch (error) {
      console.error('Error al conectarse a la base de datos:', error);
    }
  }
}
