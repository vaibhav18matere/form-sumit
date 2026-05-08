"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm, type DefaultValues, type FieldErrors } from "react-hook-form";

import {
  applicationFormSchema,
  type ApplicationFormValues,
  type NeetExam,
  type QualifyingExam12,
  type SubjectMarksRow,
} from "@/lib/applicationFormSchema";
import type { FormSectionProps, LabelFieldProps } from "@/lib/applicationFormTypes";
import { getSortedCountryOptions } from "@/lib/countries";
import { INDIAN_BANK_OPTIONS } from "@/lib/indianBanks";
import { RELIGION_OPTIONS } from "@/lib/religions";
import { validateMarksRowStrings } from "@/lib/marksRowValidation";
import { formatLocalIsoDate } from "@/lib/isoDateValidation";
import { uppercaseFormValue } from "@/lib/textInputTransform";

export type { ApplicationFormValues } from "@/lib/applicationFormSchema";

const emptySubjectRow = (): SubjectMarksRow => ({
  maxMarks: "",
  marksObtained: "",
});

const emptyQualifyingExam12 = (): QualifyingExam12 => ({
  physics: emptySubjectRow(),
  chemistry: emptySubjectRow(),
  biology: emptySubjectRow(),
  english: emptySubjectRow(),
  grandTotal: emptySubjectRow(),
});

const emptyNeetExam = (): NeetExam => ({
  physics: emptySubjectRow(),
  chemistry: emptySubjectRow(),
  biology: emptySubjectRow(),
  neetScore: emptySubjectRow(),
});

function buildInitialValues(): DefaultValues<ApplicationFormValues> {
  return {
    applicantFullName: "",
    fatherOrHusbandName: "",
    motherName: "",
    correspondenceContactName: "",
    correspondenceAddressLine1: "",
    correspondenceAddressLine2: "",
    correspondenceCity: "",
    correspondencePinCode: "",
    correspondenceState: "",
    phoneStdCode: "",
    phoneLandline: "",
    phoneMobile: "",
    sex: "",
    nationality: "",
    email: "",
    dateOfBirth: "",
    birthPlace: "",
    religion: "",
    caste: "",
    subCaste: "",
    courseChoice: "",
    qualifyingExam12: emptyQualifyingExam12(),
    neetExam: emptyNeetExam(),
    boardNameAndAddress: "",
    instituteNameWithAddress: "",
    bscDetailsText: "",
    bscMonthYearPassing: "",
    hasPassport: "",
    passportNumber: "",
    passportDateOfIssue: "",
    passportValidUntil: "",
    demandDraftNumber: "",
    demandDraftDate: "",
    demandDraftBankName: "",
    demandDraftBankCity: "",
    declarationPlace: "",
    declarationDate: "",
    declarationAccepted: false,
  } as unknown as DefaultValues<ApplicationFormValues>;
}

function FormSection(props: FormSectionProps) {
  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
      <div className="mb-4 border-b border-slate-100 pb-3 sm:mb-5">
        <h2 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
          {props.title}
        </h2>
        {props.description ? (
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
            {props.description}
          </p>
        ) : null}
      </div>
      <div className="space-y-5">{props.children}</div>
    </section>
  );
}

function LabelField(props: LabelFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-[15px] font-medium leading-snug text-slate-800 sm:text-sm">
        {props.label}
      </label>
      {props.hint ? (
        <p className="text-xs leading-relaxed text-slate-500">{props.hint}</p>
      ) : null}
      {props.children}
    </div>
  );
}

function formatSubmitErrors(errors: FieldErrors<ApplicationFormValues>): string {
  const keys = Object.keys(errors);
  if (keys.length === 0) {
    return "Please fix the highlighted fields.";
  }
  return "Please complete required fields and correct any errors.";
}

export default function ApplicationForm() {
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const countryOptions = useMemo(() => getSortedCountryOptions(), []);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: buildInitialValues(),
  });

  const passportAnswer = watch("hasPassport");
  const declarationAccepted = watch("declarationAccepted");

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
    };
  }, [photoPreviewUrl]);

  const onSubmit = async (data: ApplicationFormValues) => {
    await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    alert("Application submitted successfully.");
    console.log(data);
  };

  const onInvalid = (formErrors: FieldErrors<ApplicationFormValues>) => {
    alert(formatSubmitErrors(formErrors));
  };

  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))]">
      <div className="mx-auto w-full max-w-5xl space-y-6 px-3 sm:space-y-8 sm:px-5 sm:py-6 md:py-10">
        <header className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-md sm:rounded-2xl">
          <div className="bg-[#0c4a8c] px-4 py-6 text-white sm:px-6 sm:py-8">
            <p className="text-xs font-medium uppercase tracking-wider text-blue-100/95 sm:text-sm">
              Kyrgyz-Russian Slavic University (KRSU)
            </p>
            <p className="mt-1 text-[11px] leading-snug text-blue-200 sm:text-xs">
              Named after the First President of Russia B. N. Yeltsin
            </p>
            <h1 className="mt-4 text-xl font-bold leading-snug sm:text-2xl md:text-3xl">
              Application for Admission to Medical Faculty
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-blue-100/90">
              KRSU, Kiev Street, Bishkek, Kyrgyz Republic 720 001
            </p>
          </div>
        </header>

        <form
          className="space-y-6 sm:space-y-8"
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          noValidate
        >
          <FormSection
            title="1. Personal particulars"
            description="Identity as it should appear on official records."
          >
            <LabelField
              label="1. Full name"
              // hint="Leave a space between first, middle, and last name."
            >
              <input
                {...register("applicantFullName", {
                  setValueAs: uppercaseFormValue,
                })}
                className="input uppercase"
                autoComplete="name"
              />
              {errors.applicantFullName ? (
                <p className="text-sm text-red-600">
                  {errors.applicantFullName.message}
                </p>
              ) : null}
            </LabelField>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <LabelField label="2. Father's / husband's name">
                <input
                  {...register("fatherOrHusbandName", {
                    setValueAs: uppercaseFormValue,
                  })}
                  className="input uppercase"
                />
                {errors.fatherOrHusbandName ? (
                  <p className="text-sm text-red-600">
                    {errors.fatherOrHusbandName.message}
                  </p>
                ) : null}
              </LabelField>
              <LabelField label="3. Mother's name">
                <input
                  {...register("motherName", {
                    setValueAs: uppercaseFormValue,
                  })}
                  className="input uppercase"
                />
                {errors.motherName ? (
                  <p className="text-sm text-red-600">
                    {errors.motherName.message}
                  </p>
                ) : null}
              </LabelField>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <fieldset className="space-y-3">
                <legend className="text-[15px] font-medium text-slate-800 sm:text-sm">
                  6. Sex <span className="text-red-600">*</span>
                </legend>
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
                  <label className="flex min-h-[2.75rem] cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-base transition active:bg-slate-100 sm:border-transparent sm:bg-transparent sm:px-3 sm:py-2 sm:text-sm">
                    <input
                      type="radio"
                      value="male"
                      {...register("sex")}
                      className="h-5 w-5 shrink-0 accent-[#0c4a8c]"
                    />
                    Male
                  </label>
                  <label className="flex min-h-[2.75rem] cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-base transition active:bg-slate-100 sm:border-transparent sm:bg-transparent sm:px-3 sm:py-2 sm:text-sm">
                    <input
                      type="radio"
                      value="female"
                      {...register("sex")}
                      className="h-5 w-5 shrink-0 accent-[#0c4a8c]"
                    />
                    Female
                  </label>
                </div>
                {errors.sex ? (
                  <p className="text-sm text-red-600">{errors.sex.message}</p>
                ) : null}
              </fieldset>

              <LabelField label="7. Nationality">
                <select
                  {...register("nationality")}
                  className="input"
                  autoComplete="country"
                >
                  <option value="">Select country</option>
                  {countryOptions.map((country) => (
                    <option key={country.name} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errors.nationality ? (
                  <p className="text-sm text-red-600">
                    {errors.nationality.message}
                  </p>
                ) : null}
              </LabelField>

              <LabelField label="9. Date of birth">
                <input
                  type="date"
                  max={formatLocalIsoDate(new Date())}
                  {...register("dateOfBirth")}
                  className="input"
                />
                {errors.dateOfBirth ? (
                  <p className="text-sm text-red-600">
                    {errors.dateOfBirth.message}
                  </p>
                ) : null}
              </LabelField>
            </div>

            <LabelField label="10. Place of birth">
              <input
                {...register("birthPlace", {
                  setValueAs: uppercaseFormValue,
                })}
                className="input uppercase"
              />
            </LabelField>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <LabelField label="11. Religion">
                <select
                  {...register("religion")}
                  className="input"
                  autoComplete="off"
                >
                  <option value="">Select religion</option>
                  {RELIGION_OPTIONS.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </LabelField>
              <LabelField label="Caste">
                <input
                  {...register("caste", {
                    setValueAs: uppercaseFormValue,
                  })}
                  className="input uppercase"
                />
              </LabelField>
              <LabelField label="Sub-caste">
                <input
                  {...register("subCaste", {
                    setValueAs: uppercaseFormValue,
                  })}
                  className="input uppercase"
                />
              </LabelField>
            </div>
          </FormSection>

          <FormSection
            title="4–5. Correspondence & contact"
            description="Address and phone numbers for official communication."
          >
            <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,240px)] lg:items-start lg:gap-8">
              <div className="space-y-4">
                <LabelField label="4. Name (correspondence)">
                  <input
                    {...register("correspondenceContactName", {
                      setValueAs: uppercaseFormValue,
                    })}
                    className="input uppercase"
                  />
                </LabelField>
                <LabelField label="Address line 1">
                  <input
                    {...register("correspondenceAddressLine1", {
                      setValueAs: uppercaseFormValue,
                    })}
                    className="input uppercase"
                  />
                </LabelField>
                <LabelField label="Address line 2">
                  <input
                    {...register("correspondenceAddressLine2", {
                      setValueAs: uppercaseFormValue,
                    })}
                    className="input uppercase"
                  />
                </LabelField>
                <div className="grid gap-4 sm:grid-cols-2">
                  <LabelField label="City">
                    <input
                      {...register("correspondenceCity", {
                        setValueAs: uppercaseFormValue,
                      })}
                      className="input uppercase"
                    />
                  </LabelField>
                  <LabelField label="PIN code">
                    <input
                      inputMode="numeric"
                      maxLength={6}
                      {...register("correspondencePinCode", {
                        setValueAs: uppercaseFormValue,
                      })}
                      className="input uppercase"
                    />
                  </LabelField>
                </div>
                <LabelField label="State">
                  <input
                    {...register("correspondenceState", {
                      setValueAs: uppercaseFormValue,
                    })}
                    className="input uppercase"
                  />
                </LabelField>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <LabelField label="5. STD code">
                    <input
                      {...register("phoneStdCode", {
                        setValueAs: uppercaseFormValue,
                      })}
                      className="input uppercase"
                    />
                  </LabelField>
                  <LabelField label="Telephone">
                    <input
                      type="tel"
                      {...register("phoneLandline")}
                      className="input"
                    />
                  </LabelField>
                  <LabelField label="Mobile">
                    <input
                      type="tel"
                      {...register("phoneMobile")}
                      className="input"
                    />
                  </LabelField>
                </div>
                {errors.phoneMobile ? (
                  <p className="text-sm text-red-600">
                    {errors.phoneMobile.message}
                  </p>
                ) : null}

                <LabelField label="8. Email">
                  <input
                    type="email"
                    {...register("email")}
                    className="input"
                    autoComplete="email"
                  />
                  {errors.email ? (
                    <p className="text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  ) : null}
                </LabelField>
              </div>

              <div className="flex flex-col gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/80 p-4 sm:p-5 lg:sticky lg:top-4">
                <p className="text-center text-sm font-medium leading-snug text-slate-800">
                  Upload your photo here
                </p>
                <div className="relative mx-auto aspect-3/4 w-full max-w-[200px] overflow-hidden rounded-xl bg-white shadow-inner ring-1 ring-slate-200/80 sm:max-w-[220px]">
                  {photoPreviewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt="Applicant preview"
                      src={photoPreviewUrl}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-400">
                      Preview
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="text-base file:mr-3 file:min-h-[2.75rem] file:rounded-xl file:border-0 file:bg-[#0c4a8c] file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white touch-manipulation"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (photoPreviewUrl) {
                      URL.revokeObjectURL(photoPreviewUrl);
                    }
                    if (file) {
                      setPhotoPreviewUrl(URL.createObjectURL(file));
                    } else {
                      setPhotoPreviewUrl(null);
                    }
                  }}
                />
              </div>
            </div>
          </FormSection>

          <FormSection title="12. Programme applied for">
            <fieldset className="space-y-3">
              <legend className="text-[15px] font-medium text-slate-800 sm:text-sm">
                Select one course <span className="text-red-600">*</span>
              </legend>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <label className="flex min-h-[3rem] w-full cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-base transition active:bg-slate-50 sm:w-auto sm:min-w-[10.5rem] sm:text-sm">
                  <input
                    type="radio"
                    value="medical_faculty"
                    {...register("courseChoice")}
                    className="h-5 w-5 shrink-0 accent-[#0c4a8c]"
                  />
                  Medical Faculty
                </label>
                <label className="flex min-h-[3rem] w-full cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-base transition active:bg-slate-50 sm:w-auto sm:min-w-[10.5rem] sm:text-sm">
                  <input
                    type="radio"
                    value="dental"
                    {...register("courseChoice")}
                    className="h-5 w-5 shrink-0 accent-[#0c4a8c]"
                  />
                  Dental
                </label>
                <label className="flex min-h-[3rem] w-full cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-base transition active:bg-slate-50 sm:w-auto sm:min-w-[10.5rem] sm:text-sm">
                  <input
                    type="radio"
                    value="post_graduate"
                    {...register("courseChoice")}
                    className="h-5 w-5 shrink-0 accent-[#0c4a8c]"
                  />
                  Post Graduate
                </label>
              </div>
              {errors.courseChoice ? (
                <p className="text-sm text-red-600">
                  {errors.courseChoice.message}
                </p>
              ) : null}
            </fieldset>
          </FormSection>

          <FormSection
            title="13. Qualifying examination & NEET"
            description="10+2 or equivalent marks and NEET details."
          >
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-sm font-semibold leading-snug text-slate-900 sm:mb-3">
                  Part A — Examination passed (10+2 or equivalent)
                </h3>
                <div className="w-full max-w-full">
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                  <table className="w-full max-w-full table-fixed border-collapse text-left text-xs sm:text-sm">
                    <colgroup>
                      <col className="w-[34%]" />
                      <col className="w-[33%]" />
                      <col className="w-[33%]" />
                    </colgroup>
                    <thead className="bg-slate-100 text-slate-700">
                      <tr>
                        <th className="px-2 py-2 text-left align-bottom font-semibold sm:px-3">
                          Subject
                        </th>
                        <th className="px-2 py-2 text-left align-bottom font-semibold sm:px-3">
                          Max. marks
                        </th>
                        <th className="px-2 py-2 text-left align-bottom font-semibold sm:px-3">
                          Marks obtained
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(
                        [
                          ["physics", "Physics"],
                          ["chemistry", "Chemistry"],
                          ["biology", "Biology"],
                          ["english", "English"],
                          ["grandTotal", "Grand total"],
                        ] as const
                      ).map(([key, label]) => {
                        const obtPath =
                          `qualifyingExam12.${key}.marksObtained` as const;
                        const maxReg = register(
                          `qualifyingExam12.${key}.maxMarks` as const,
                        );
                        const obtReg = register(obtPath, {
                          validate: (obtVal: string) => {
                            const maxVal = getValues(
                              `qualifyingExam12.${key}.maxMarks`,
                            );
                            const msg = validateMarksRowStrings(maxVal, obtVal);
                            return msg === null ? true : msg;
                          },
                        });
                        const obtMessage =
                          errors.qualifyingExam12?.[key]?.marksObtained?.message;
                        return (
                        <tr key={key}>
                          <td className="min-w-0 px-2 py-2 font-medium break-words text-slate-800 sm:px-3">
                            {label}
                          </td>
                          <td className="min-w-0 px-2 py-2 align-top sm:px-3">
                            <input
                              type="number"
                              min={0}
                              className="input input-compact min-w-0 tabular-nums"
                              {...maxReg}
                              onChange={(e) => {
                                maxReg.onChange(e);
                                void trigger(obtPath);
                              }}
                            />
                          </td>
                          <td className="min-w-0 px-2 py-2 align-top sm:px-3">
                            <input
                              type="number"
                              min={0}
                              className="input input-compact min-w-0 tabular-nums"
                              {...obtReg}
                              onChange={(e) => {
                                obtReg.onChange(e);
                                void trigger(obtPath);
                              }}
                            />
                            {obtMessage ? (
                              <p className="mt-1 break-words text-xs leading-snug text-red-600">
                                {obtMessage}
                              </p>
                            ) : null}
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold leading-snug text-slate-900 sm:mb-3">
                  Part B — National Eligibility cum Entrance Test (NEET)
                </h3>
                <div className="w-full max-w-full">
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                  <table className="w-full max-w-full table-fixed border-collapse text-left text-xs sm:text-sm">
                    <colgroup>
                      <col className="w-[34%]" />
                      <col className="w-[33%]" />
                      <col className="w-[33%]" />
                    </colgroup>
                    <thead className="bg-slate-100 text-slate-700">
                      <tr>
                        <th className="px-2 py-2 text-left align-bottom font-semibold sm:px-3">
                          Component
                        </th>
                        <th className="px-2 py-2 text-left align-bottom font-semibold sm:px-3">
                          Max. marks
                        </th>
                        <th className="px-2 py-2 text-left align-bottom font-semibold sm:px-3">
                          Marks obtained
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(
                        [
                          ["physics", "Physics"],
                          ["chemistry", "Chemistry"],
                          ["biology", "Biology"],
                          ["neetScore", "NEET score"],
                        ] as const
                      ).map(([key, label]) => {
                        const obtPath =
                          `neetExam.${key}.marksObtained` as const;
                        const maxReg = register(
                          `neetExam.${key}.maxMarks` as const,
                        );
                        const obtReg = register(obtPath, {
                          validate: (obtVal: string) => {
                            const maxVal = getValues(`neetExam.${key}.maxMarks`);
                            const msg = validateMarksRowStrings(maxVal, obtVal);
                            return msg === null ? true : msg;
                          },
                        });
                        const obtMessage =
                          errors.neetExam?.[key]?.marksObtained?.message;
                        return (
                        <tr key={key}>
                          <td className="min-w-0 px-2 py-2 font-medium break-words text-slate-800 sm:px-3">
                            {label}
                          </td>
                          <td className="min-w-0 px-2 py-2 align-top sm:px-3">
                            <input
                              type="number"
                              min={0}
                              className="input input-compact min-w-0 tabular-nums"
                              {...maxReg}
                              onChange={(e) => {
                                maxReg.onChange(e);
                                void trigger(obtPath);
                              }}
                            />
                          </td>
                          <td className="min-w-0 px-2 py-2 align-top sm:px-3">
                            <input
                              type="number"
                              min={0}
                              className="input input-compact min-w-0 tabular-nums"
                              {...obtReg}
                              onChange={(e) => {
                                obtReg.onChange(e);
                                void trigger(obtPath);
                              }}
                            />
                            {obtMessage ? (
                              <p className="mt-1 break-words text-xs leading-snug text-red-600">
                                {obtMessage}
                              </p>
                            ) : null}
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  </div>
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection title="14–15. Board and prior institution">
            <LabelField label="14. Board name & full address">
              <textarea
                {...register("boardNameAndAddress", {
                  setValueAs: uppercaseFormValue,
                })}
                rows={4}
                className="input min-h-[120px] uppercase"
              />
            </LabelField>
            <LabelField label="15. Name of institute / college with address">
              <textarea
                {...register("instituteNameWithAddress", {
                  setValueAs: uppercaseFormValue,
                })}
                rows={4}
                className="input min-h-[120px] uppercase"
              />
            </LabelField>
          </FormSection>

          <FormSection title="16. B.Sc. (if applicable)">
            <LabelField
              label="Details of examination passed"
              hint="Subject, marks, roll number, year of passing, university, etc."
            >
              <textarea
                {...register("bscDetailsText", {
                  setValueAs: uppercaseFormValue,
                })}
                rows={4}
                className="input min-h-[120px] uppercase"
              />
            </LabelField>
            <LabelField
              label="Date of passing"
              hint="Select any calendar date (month, day, and year)."
            >
              <input
                type="date"
                max={formatLocalIsoDate(new Date())}
                {...register("bscMonthYearPassing")}
                className="input"
              />
              {errors.bscMonthYearPassing ? (
                <p className="text-sm text-red-600">
                  {errors.bscMonthYearPassing.message}
                </p>
              ) : null}
            </LabelField>
          </FormSection>

          <FormSection title="17. Passport">
            <fieldset className="space-y-3">
              <legend className="text-[15px] font-medium text-slate-800 sm:text-sm">
                Do you have a passport?
              </legend>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                <label className="flex min-h-[2.75rem] cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-base active:bg-slate-100 sm:border-transparent sm:bg-transparent sm:text-sm">
                  <input
                    type="radio"
                    value="yes"
                    {...register("hasPassport")}
                    className="h-5 w-5 shrink-0 accent-[#0c4a8c]"
                  />
                  Yes
                </label>
                <label className="flex min-h-[2.75rem] cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-base active:bg-slate-100 sm:border-transparent sm:bg-transparent sm:text-sm">
                  <input
                    type="radio"
                    value="no"
                    {...register("hasPassport")}
                    className="h-5 w-5 shrink-0 accent-[#0c4a8c]"
                  />
                  No
                </label>
              </div>
            </fieldset>

            {passportAnswer === "yes" ? (
              <div className="grid grid-cols-1 gap-4 border-l-4 border-[#0c4a8c] bg-slate-50/90 p-4 sm:p-5 md:grid-cols-2">
                <LabelField label="Passport number">
                  <input
                    {...register("passportNumber", {
                      setValueAs: uppercaseFormValue,
                    })}
                    className="input uppercase"
                  />
                </LabelField>
                <LabelField label="Date of issue">
                  <input
                    type="date"
                    max={formatLocalIsoDate(new Date())}
                    {...register("passportDateOfIssue")}
                    className="input"
                  />
                  {errors.passportDateOfIssue ? (
                    <p className="text-sm text-red-600">
                      {errors.passportDateOfIssue.message}
                    </p>
                  ) : null}
                </LabelField>
                <LabelField label="Valid until">
                  <input
                    type="date"
                    min={formatLocalIsoDate(new Date())}
                    {...register("passportValidUntil")}
                    className="input"
                  />
                  {errors.passportValidUntil ? (
                    <p className="text-sm text-red-600">
                      {errors.passportValidUntil.message}
                    </p>
                  ) : null}
                </LabelField>
              </div>
            ) : null}
          </FormSection>

          <FormSection title="18. Demand draft (Rs. 65,000 /-)">
            <p className="text-sm text-slate-600">
              Non-refundable fees. Enter draft details as on the instrument.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <LabelField label="D.D. number">
                <input
                  {...register("demandDraftNumber", {
                    setValueAs: uppercaseFormValue,
                  })}
                  className="input uppercase"
                />
              </LabelField>
              <LabelField label="Date">
                <input
                  type="date"
                  max={formatLocalIsoDate(new Date())}
                  {...register("demandDraftDate")}
                  className="input"
                />
                {errors.demandDraftDate ? (
                  <p className="text-sm text-red-600">
                    {errors.demandDraftDate.message}
                  </p>
                ) : null}
              </LabelField>
              <LabelField label="Name of bank">
                <select
                  {...register("demandDraftBankName")}
                  className="input"
                  autoComplete="organization"
                >
                  <option value="">Select bank</option>
                  {INDIAN_BANK_OPTIONS.map((bankName) => (
                    <option key={bankName} value={bankName}>
                      {bankName}
                    </option>
                  ))}
                </select>
              </LabelField>
              <LabelField label="City">
                <input
                  {...register("demandDraftBankCity", {
                    setValueAs: uppercaseFormValue,
                  })}
                  className="input uppercase"
                />
              </LabelField>
            </div>
            <p className="text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
              Non-refundable fees
            </p>
          </FormSection>

          <section className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm sm:rounded-2xl">
            <div className="bg-[#0c4a8c] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white sm:px-6 sm:text-sm">
              Declaration
            </div>
            <div className="space-y-4 p-4 text-sm leading-relaxed text-slate-700 sm:p-6">
              <ol className="list-decimal space-y-3 pl-5">
                <li>
                  I certify that the information given above is true and correct
                  to the best of my knowledge.
                </li>
                <li>
                  I understand that any false statement may lead to cancellation
                  of admission.
                </li>
                <li>
                  I confirm citizenship / eligibility status as required by the
                  university and host country regulations.
                </li>
                <li>
                  Documents submitted are genuine; copies match original records.
                </li>
                <li>
                  I agree to abide by the rules and discipline of the university.
                </li>
              </ol>

              <label className="flex min-h-[3rem] cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/90 p-4 active:bg-slate-100">
                <input
                  type="checkbox"
                  {...register("declarationAccepted")}
                  className="mt-1 h-5 w-5 shrink-0 accent-[#0c4a8c]"
                />
                <span className="text-[15px] font-medium leading-snug text-slate-900 sm:text-sm">
                  I have read and agree to the declaration above.{" "}
                  <span className="text-red-600">*</span>
                </span>
              </label>
              {errors.declarationAccepted ? (
                <p className="text-sm text-red-600">
                  {errors.declarationAccepted.message}
                </p>
              ) : null}

              <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
                <LabelField label="Place">
                  <input
                    {...register("declarationPlace", {
                      setValueAs: uppercaseFormValue,
                    })}
                    className="input uppercase"
                  />
                </LabelField>
                <LabelField label="Date">
                  <input
                    type="date"
                    {...register("declarationDate")}
                    className="input"
                  />
                </LabelField>
              </div>
              <p className="text-xs text-slate-500">
                Digital submission replaces wet signature; ticking the box above
                confirms your intent to sign.
              </p>
            </div>
          </section>

          <div className="relative w-full">
            {declarationAccepted ? null : (
              <div
                className="absolute inset-0 z-[1] cursor-not-allowed rounded-2xl"
                title='Please tick "I have read and agree to the declaration above" to give your consent before submitting.'
                aria-hidden
              />
            )}
            <button
              type="submit"
              disabled={!declarationAccepted}
              aria-disabled={!declarationAccepted}
              className="relative w-full min-h-[3.25rem] touch-manipulation rounded-2xl bg-[#0c4a8c] px-4 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-[#0a3f75] active:bg-[#083866] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 focus-visible:ring-offset-2 enabled:cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-400 disabled:text-slate-100 disabled:opacity-90 disabled:shadow-none disabled:hover:bg-slate-400 sm:min-h-[3.5rem] sm:text-lg"
            >
              Submit application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
