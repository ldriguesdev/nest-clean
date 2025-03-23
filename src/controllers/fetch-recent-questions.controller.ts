import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@/auth/jwt-auth-guard";
import { ZodValidationPipe } from "@/pipes/zod-validation-pipe";
import { PrismaService } from "@/prisma/prisma.service";
import { z } from "zod";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const perPageQueryParamSchema = z
  .string()
  .optional()
  .default("10")
  .transform(Number)
  .pipe(z.number().min(1).max(100));

const pageQueryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);
const perPageQueryValidationPipe = new ZodValidationPipe(
  perPageQueryParamSchema
);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;
type PerPageQueryParamSchema = z.infer<typeof perPageQueryParamSchema>;

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(
    @Query("page", pageQueryValidationPipe) page: PageQueryParamSchema,
    @Query("perPage", perPageQueryValidationPipe)
    perPage: PerPageQueryParamSchema
  ) {
    const questions = await this.prisma.question.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: "desc",
      },
    });

    return { questions };
  }
}
