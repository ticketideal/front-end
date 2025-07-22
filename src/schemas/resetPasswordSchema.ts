import { z } from "zod";

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Formato de email inválido"),
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
