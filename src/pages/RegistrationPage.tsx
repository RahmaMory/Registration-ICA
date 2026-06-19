


import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const registrationSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "Full name is required")
      .refine((val) => val.trim().split(" ").length >= 3, {
        message: "Full name must be at least 3 names (e.g. Ahmed Mohamed Ali)",
      }),

    email: z.string().email("Invalid email"),
    phone: z.string().min(11, "Phone must be 11 digits"),

age: z.coerce
  .number()
  .min(10, "Age must be at least 10"),
    faculty: z.string().min(1, "Faculty is required"),
    academicYear: z.string().min(1),

    track: z.string().min(1, "Track is required"),

studyMode: z.enum(
  ["Online", "Offline"],
  {
    message:
      "Please select study mode",
  }
),

level: z.enum([
  "Zero",
  "One",
  "ZeroAndOne",
], {
  message: "Please select a level",
}),

    depositPaid: z.boolean().default(false),

depositAmount: z.coerce
  .number()
  .optional(),

    paymentDate: z.string().min(1),
    salesAgent: z.string().min(1),
    status: z.string().min(1),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const phoneDigits = data.phone.replace(/\D/g, "");

    if (phoneDigits.length !== 11) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Phone number must be exactly 11 digits",
      });
    }

    if (data.depositPaid) {
      if (data.level === "Zero" && data.depositAmount !== 200) {
        ctx.addIssue({
          code: "custom",
          path: ["depositAmount"],
          message: "Level Zero is fixed at 200 EGP",
        });
      }

      if (data.level === "One" && (data.depositAmount ?? 0) < 1000) {
        ctx.addIssue({
          code: "custom",
          path: ["depositAmount"],
          message: "Minimum for Level One is 1000 EGP",
        });
      }

      if (data.level === "ZeroAndOne" && (data.depositAmount ?? 0) < 1200) {
        ctx.addIssue({
          code: "custom",
          path: ["depositAmount"],
          message: "Minimum is 1200 EGP",
        });
      }
    }
  });


type FormData = z.output<typeof registrationSchema>;
export default function RegistrationPage() {
const {
  register,
  handleSubmit,
  watch,
  reset,
  setValue,
  resetField,
  formState: { errors },
} = useForm<FormData>({
resolver: zodResolver(registrationSchema) as any,
  defaultValues: {
    depositPaid: false,
  },
});

  const track = watch("track");
  const level = watch("level");
  const depositPaid = watch("depositPaid");
const depositAmount =
  watch("depositAmount");
  useEffect(() => {
    if (!depositPaid) {
      resetField("depositAmount");
    }
  }, [depositPaid, resetField]);

useEffect(() => {
  if (!depositPaid) return;

  if (level === "Zero") {
    setValue("depositAmount", 200);
  }

  if (level === "One") {
    setValue("depositAmount", 1000);
  }

  if (
    level === "ZeroAndOne" &&
    (!depositAmount ||
      depositAmount < 1200)
  ) {
    setValue(
      "depositAmount",
      1200
    );
  }
}, [
  level,
  depositPaid,
  depositAmount,
  setValue,
]);

 const onSubmit = (data: FormData) => {
  console.log(data);

  alert("Registration Submitted Successfully");

  reset();
};

  const inputStyle =
  "w-full rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30";
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl rounded-3xl border border-cyan-500/20 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        
        {/* HEADER */}
        <div className="mb-8 text-center">
          <h1 className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-5xl font-extrabold text-transparent">
            IO Code Academy
          </h1>
          <p className="mt-3 text-lg text-white/60">
            Student Registration Form
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-5 md:grid-cols-2"
        >
          {/* FULL NAME */}
          <div>
            <input placeholder="Full Name" className={inputStyle} {...register("fullName")} />
            <p className="text-red-400 text-sm">{errors.fullName?.message}</p>
          </div>

          {/* EMAIL */}
          <div>
<input
  type="email"
  placeholder="Email"
  className={inputStyle}
  {...register("email")}
/>            <p className="text-red-400 text-sm">{errors.email?.message}</p>
          </div>

          {/* PHONE */}
          <div>
            <input placeholder="Phone Number" className={inputStyle} {...register("phone")} />
            <p className="text-red-400 text-sm">{errors.phone?.message}</p>
          </div>

          {/* AGE */}
          <div>
            <input type="number" placeholder="Age" className={inputStyle} {...register("age")} />
            <p className="text-red-400 text-sm">{errors.age?.message}</p>
          </div>

          {/* FACULTY */}
          <div>
            <input placeholder="Faculty" className={inputStyle} {...register("faculty")} />
            <p className="text-red-400 text-sm">{errors.faculty?.message}</p>
          </div>
          <div>
  <select
    className={inputStyle}
    {...register("academicYear")}
  >
    <option value="">
      Academic Year
    </option>

    <option value="1st Year">
      1st Year
    </option>

    <option value="2nd Year">
      2nd Year
    </option>

    <option value="3rd Year">
      3rd Year
    </option>

    <option value="4th Year">
      4th Year
    </option>

    <option value="Graduate">
      Graduate
    </option>
  </select>

  <p className="text-red-400 text-sm">
    {errors.academicYear?.message}
  </p>
</div>

          {/* TRACK */}
          <div>
            <select className={inputStyle} {...register("track")}>
              <option value="">Select Track</option>
              <option>Frontend</option>
              <option>Backend</option>
              <option>Flutter</option>
              <option>AI</option>
              <option>Cyber Security</option>
              <option>Not Selected</option>
            </select>
            <p className="text-red-400 text-sm">{errors.track?.message}</p>
          </div>

          {/* LEVEL */}
          <div>
            <select className={inputStyle} {...register("level")}>
              <option value="">Select Level</option>
              <option value="Zero">Level Zero</option>

              {track && track !== "Not Selected" && (
                <>
                  <option value="One">Level One</option>
                  <option value="ZeroAndOne">Level Zero + One</option>
                </>
              )}
            </select>
            <p className="text-red-400 text-sm">{errors.level?.message}</p>
          </div>

          {/* STUDY MODE */}
          <div>
            <select className={inputStyle} {...register("studyMode")}>
              <option value="">Online / Offline</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
            <p className="text-red-400 text-sm">{errors.studyMode?.message}</p>
          </div>

          {/* DEPOSIT */}
          {level && (
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <input type="checkbox" {...register("depositPaid")} />
              Deposit Paid
            </label>
            
          )}

          {/* DEPOSIT AMOUNT */}
          {level && depositPaid && (
            <div>
              <input
                type="number"
                className={inputStyle}
                readOnly={level === "Zero"}
                {...register("depositAmount", { valueAsNumber: true })}
              />

              <p className="text-sm text-gray-400">
                {level === "Zero" && "Fixed: 200 EGP (not editable)"}
                {level === "One" && "Min: 1000 EGP"}
                {level === "ZeroAndOne" && "Min: 1200 EGP"}
              </p>

              <p className="text-red-400 text-sm">
                {errors.depositAmount?.message}
              </p>
            </div>
          )}

          {/* PAYMENT */}
          <div>
            <input type="date" className={inputStyle} {...register("paymentDate")} />
            <p className="text-red-400 text-sm">{errors.paymentDate?.message}</p>
          </div>

          {/* SALES */}
          <div>
            <input placeholder="Sales Agent" className={inputStyle} {...register("salesAgent")} />
            <p className="text-red-400 text-sm">{errors.salesAgent?.message}</p>
          </div>

          {/* STATUS */}
          <div>
            <input placeholder="Status" className={inputStyle} {...register("status")} />
            <p className="text-red-400 text-sm">{errors.status?.message}</p>
          </div>

          {/* NOTES */}
          <div className="md:col-span-2">
            <textarea
              rows={4}
              placeholder="Other Notes"
              className={inputStyle}
              {...register("notes")}
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="md:col-span-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-4 text-lg font-bold shadow-lg transition hover:scale-[1.01]"
          >
            Submit Registration
          </button>
        </form>
      </div>
    </div>
  );
}