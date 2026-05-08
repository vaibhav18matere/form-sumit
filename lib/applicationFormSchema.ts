import * as z from "zod";

import { validateMarksRowStrings } from "@/lib/marksRowValidation";
import {
  validateDateNotAfterToday,
  validateDateNotBeforeToday,
} from "@/lib/isoDateValidation";

export const subjectMarksRowSchema = z.object({
  maxMarks: z.string(),
  marksObtained: z.string(),
});

const qualifyingExam12Keys = [
  "physics",
  "chemistry",
  "biology",
  "english",
  "grandTotal",
] as const;

export const qualifyingExam12Schema = z
  .object({
    physics: subjectMarksRowSchema,
    chemistry: subjectMarksRowSchema,
    biology: subjectMarksRowSchema,
    english: subjectMarksRowSchema,
    grandTotal: subjectMarksRowSchema,
  })
  .superRefine((data, ctx) => {
    for (const key of qualifyingExam12Keys) {
      const row = data[key];
      const msg = validateMarksRowStrings(row.maxMarks, row.marksObtained);
      if (msg !== null) {
        ctx.addIssue({
          code: "custom",
          message: msg,
          path: [key, "marksObtained"],
          input: row.marksObtained,
        });
      }
    }
  });

const neetExamKeys = [
  "physics",
  "chemistry",
  "biology",
  "neetScore",
] as const;

export const neetExamSchema = z
  .object({
    physics: subjectMarksRowSchema,
    chemistry: subjectMarksRowSchema,
    biology: subjectMarksRowSchema,
    neetScore: subjectMarksRowSchema,
  })
  .superRefine((data, ctx) => {
    for (const key of neetExamKeys) {
      const row = data[key];
      const msg = validateMarksRowStrings(row.maxMarks, row.marksObtained);
      if (msg !== null) {
        ctx.addIssue({
          code: "custom",
          message: msg,
          path: [key, "marksObtained"],
          input: row.marksObtained,
        });
      }
    }
  });

export const applicationFormSchema = z.object({
  applicantFullName: z.string().trim().min(1, "Full name is required"),
  fatherOrHusbandName: z.string().trim().min(1, "This field is required"),
  motherName: z.string().trim().min(1, "This field is required"),
  correspondenceContactName: z.string(),
  correspondenceAddressLine1: z.string(),
  correspondenceAddressLine2: z.string(),
  correspondenceCity: z.string(),
  correspondencePinCode: z.string(),
  correspondenceState: z.string(),
  phoneStdCode: z.string(),
  phoneLandline: z.string(),
  phoneMobile: z.string().min(1, "Mobile number is required"),
  sex: z.enum(["male", "female"], { error: () => "Select sex" }),
  nationality: z.string().min(1, "Nationality is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .pipe(z.email({ error: () => "Enter a valid email" })),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .superRefine((val, ctx) => {
      const result = validateDateNotAfterToday(
        val,
        new Date(),
        "Date of birth cannot be in the future",
      );
      if (result !== true) {
        ctx.addIssue({
          code: "custom",
          message: result,
          input: val,
        });
      }
    }),
  birthPlace: z.string(),
  religion: z.string(),
  caste: z.string(),
  subCaste: z.string(),
  courseChoice: z.enum(["medical_faculty", "dental", "post_graduate"], {
    error: () => "Select a course",
  }),
  qualifyingExam12: qualifyingExam12Schema,
  neetExam: neetExamSchema,
  boardNameAndAddress: z.string(),
  instituteNameWithAddress: z.string(),
  bscDetailsText: z.string(),
  bscMonthYearPassing: z.string().superRefine((val, ctx) => {
    const result = validateDateNotAfterToday(
      val,
      new Date(),
      "Date of passing cannot be in the future",
    );
    if (result !== true) {
      ctx.addIssue({
        code: "custom",
        message: result,
        input: val,
      });
    }
  }),
  hasPassport: z.union([z.literal(""), z.literal("yes"), z.literal("no")]),
  passportNumber: z.string(),
  passportDateOfIssue: z.string().superRefine((val, ctx) => {
    const result = validateDateNotAfterToday(
      val,
      new Date(),
      "Date of issue cannot be in the future",
    );
    if (result !== true) {
      ctx.addIssue({
        code: "custom",
        message: result,
        input: val,
      });
    }
  }),
  passportValidUntil: z.string().superRefine((val, ctx) => {
    const result = validateDateNotBeforeToday(
      val,
      new Date(),
      "Valid until cannot be in the past",
    );
    if (result !== true) {
      ctx.addIssue({
        code: "custom",
        message: result,
        input: val,
      });
    }
  }),
  demandDraftNumber: z.string(),
  demandDraftDate: z.string().superRefine((val, ctx) => {
    const result = validateDateNotAfterToday(
      val,
      new Date(),
      "Demand draft date cannot be in the future",
    );
    if (result !== true) {
      ctx.addIssue({
        code: "custom",
        message: result,
        input: val,
      });
    }
  }),
  demandDraftBankName: z.string(),
  demandDraftBankCity: z.string(),
  declarationPlace: z.string(),
  declarationDate: z.string(),
  declarationAccepted: z.boolean().refine((value) => value === true, {
    message: "You must accept the declaration",
  }),
});

export type SubjectMarksRow = z.infer<typeof subjectMarksRowSchema>;
export type QualifyingExam12 = z.infer<typeof qualifyingExam12Schema>;
export type NeetExam = z.infer<typeof neetExamSchema>;
export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;
