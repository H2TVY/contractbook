const { z } = require("zod");
const contactSchema = z.object({
  id: z.coerce.number().int().nonnegative(),
  name: z.string().max(255),
  email: z.string().email().optional(),
  address: z.string().max(255).optional(),
  phone: z.string().max(15).optional(),
  favorite: z.boolean().optional(),
  avatar: z.string().max(255).optional(),
  avatarFile: z
    .instanceof(Object)
    .refine((file) => file & (file.fieldname === "avatarFile"), {
      message: "Invalid file upload",
    })
    .optional(),
});

const partialContactSchema = contactSchema.partial();
module.exports = {
  contactSchema,
  partialContactSchema,
};
