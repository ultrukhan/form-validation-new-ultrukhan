import { z } from 'zod';

const emailSchema = z.email();
const urlSchema = z.url();

export const createBookingSchema = (availableTimeSlots = []) => {
  const unavailableMessage = 'Selected time slot is unavailable';

  const timeSlotSchema =
    availableTimeSlots.length > 0
      ? z.enum(availableTimeSlots, { error: unavailableMessage })
      : z.string().refine(() => false, { error: unavailableMessage });

  return z.object({
    bookerName: z
      .string()
      .min(2, 'Booker name must be at least 2 characters long'),
    bookerEmail: z
      .string()
      .refine((value) => value === '' || emailSchema.safeParse(value).success, {
        error: 'Invalid email address',
      })
      .optional(),
    eventName: z
      .string()
      .min(2, 'Event name must be at least 2 characters long'),
    eventDate: z.coerce
      .date({ error: 'Event date must be in the future' })
      .refine((date) => date.getTime() > Date.now(), {
        error: 'Event date must be in the future',
      }),
    numberOfGuests: z.coerce
      .number()
      .int('Number of Guests must be an integer')
      .min(1, 'Number of Guests must be greater than or equal to 1')
      .max(10, 'Number of Guests must be less than or equal to 10'),
    timeSlot: timeSlotSchema,
    eventLink: z
      .string({ error: 'Required' })
      .refine((value) => urlSchema.safeParse(value).success, {
        error: 'Invalid URL. Please enter a valid event link',
      }),
  });
};
