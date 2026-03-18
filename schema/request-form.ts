import * as z from 'zod'

export const requestFormSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  position: z.string().min(1, 'Position is required'),
  salaryPerMonth: z.string().min(1, 'Salary per month is required'),

  departureDate: z.date({
    //@ts-ignore
    required_error: 'Departure date is required',
  }),
  returnDate: z.date({
    //@ts-ignore
    required_error: 'Return date is required',
  }),
  destinationProvince: z.string().min(1, 'Destination province is required'),
  specificLocation: z.string().min(1, 'Specific location is required'),

  destinationSummary: z.string().min(1, 'Destination summary is required'),
  specificPurpose: z.string().min(1, 'Specific purpose is required'),
  objectives: z.string().min(1, 'Objectives are required'),
  travelDetails: z.string().min(1, 'Travel details are required'),

  meansOfTransport: z.string().min(1, 'Means of transport is required'),
  estimatedExpenses: z.string().min(1, 'Estimated expenses are required'),
  sourceOfFunds: z.string().min(1, 'Source of funds is required'),
  accompanyingPersonnel: z.string().optional(),
}).refine((data) => data.returnDate >= data.departureDate, {
  message: 'Return date cannot be before departure date',
  path: ['returnDate'],
})

export type RequestFormValues = z.infer<typeof requestFormSchema>