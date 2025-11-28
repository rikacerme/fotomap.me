import { z } from 'zod'

// Auth Validations
export const signupSchema = z.object({
  email: z.string().email('Geçerli bir email adresi girin'),
  name: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
  googleId: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Geçerli bir email adresi girin'),
})

// Event Validations
export const createEventSchema = z.object({
  title: z
    .string()
    .min(3, 'Etkinlik adı en az 3 karakter olmalıdır')
    .max(100, 'Etkinlik adı en fazla 100 karakter olmalıdır'),
  description: z
    .string()
    .max(500, 'Açıklama en fazla 500 karakter olmalıdır')
    .optional(),
})

export const updateEventSchema = createEventSchema.partial()

// File Validations
export const imageFileSchema = z.object({
  size: z.number().max(10 * 1024 * 1024, 'Dosya boyutu 10MB\'ı geçemez'),
  type: z.enum(['image/jpeg', 'image/png', 'image/gif', 'image/webp'], {
    errorMap: () => ({ message: 'Geçersiz dosya tipi' }),
  }),
})

// Payment Validations
export const packageSelectSchema = z.object({
  packageId: z.enum(['free', 'premium']),
})

export const paymentSchema = z.object({
  amount: z.number().positive('Tutar 0\'dan büyük olmalıdır'),
  packageId: z.enum(['free', 'premium']),
})

// Type exports
export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreateEventInput = z.infer<typeof createEventSchema>
export type UpdateEventInput = z.infer<typeof updateEventSchema>
export type ImageFileInput = z.infer<typeof imageFileSchema>
export type PackageSelectInput = z.infer<typeof packageSelectSchema>
export type PaymentInput = z.infer<typeof paymentSchema>
