import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

const mongoUrl = process.env.MONGO_URL;
if (!mongoUrl) {
  throw new Error('MONGO_URL environment variable is not set');
}

@Module({
  imports: [MongooseModule.forRoot(mongoUrl)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
