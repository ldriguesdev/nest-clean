import { ConfigModule } from "@nestjs/config";
import { PrismaService } from "./prisma/prisma.service";
import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module";
import { envSchema } from "./env";

import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { FetchRecentQuestionsController } from "./controllers/fetch-recent-questions.controller";


@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController
  ],
  providers: [PrismaService],
})
export class AppModule {}
