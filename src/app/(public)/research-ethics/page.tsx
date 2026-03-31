"use client";

import { useState } from "react";
import { User, Mail, Send, AlertCircle, Info } from "lucide-react";
import PageBreadcrumb from "@/components/shared/breadcrumb";

type YesNoNA = "yes" | "no" | "na" | "";

type FormState = {
  name: string;
  email: string;
  researchProposal: YesNoNA;
  applicationForm: YesNoNA;
  informedConsent: YesNoNA;
  subjectInfoSheet: YesNoNA;
  questionnaire: YesNoNA;
  proforma: YesNoNA;
  interviewForm: YesNoNA;
  advertisement: YesNoNA;
  consultantLetter: YesNoNA;
  dataSheet: YesNoNA;
  compensationStatement: YesNoNA;
  isotopeClearance: YesNoNA;
};

const CHECKLIST_ITEMS: { key: keyof Omit<FormState, "name" | "email">; label: string }[] = [
  { key: "researchProposal", label: "Research Proposal/Dissertation (Three copies)" },
  { key: "applicationForm", label: "Application Form (Seventeen copies only)" },
  { key: "informedConsent", label: "Informed consent form" },
  { key: "subjectInfoSheet", label: "Subject information sheet" },
  { key: "questionnaire", label: "Questionnaire form" },
  { key: "proforma", label: "Proforma form" },
  { key: "interviewForm", label: "Interview form" },
  { key: "advertisement", label: "Advertisement for research subjects" },
  { key: "consultantLetter", label: "Medical/Dental Practitioners/Consultant information sheet/letter" },
  { key: "dataSheet", label: "Data sheet for all drugs (one copy only)" },
  { key: "compensationStatement", label: "Statement regarding compensation arrangements (one copy only)" },
  { key: "isotopeClearance", label: "Clearance for use of isotopes and/or radiation" },
];

const CAVEAT_ITEMS = [
  "Response to this application is typed on one side of each sheet and all boxes are electronically ticked.",
  "The form is completed in full with the information requested. Where a question is not applicable, it is important to make it clear and not leave it blank.",
  "The application is signed by the applicant, applicant's supervisor (where appropriate), the Head of Department and the Head of Department/Unit where the research will be carried out.",
  "Seventeen collated sets of application form and accompanying documents are attached.",
  "The language used in the application is clear and simple to understand to lay members.",
  "All abbreviations should first be written in full.",
  "Three copies of research proposals are submitted.",
];

const labelCls = "block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5";
const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/10 backdrop-blur-sm px-4 py-3 pl-11 text-sm text-white placeholder-gray-400 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition";

const defaultForm: FormState = {
  name: "",
  email: "",
  researchProposal: "",
  applicationForm: "",
  informedConsent: "",
  subjectInfoSheet: "",
  questionnaire: "",
  proforma: "",
  interviewForm: "",
  advertisement: "",
  consultantLetter: "",
  dataSheet: "",
  compensationStatement: "",
  isotopeClearance: "",
};

function Field({ children }: { children: React.ReactNode }) {
  return <div className="relative flex flex-col">{children}</div>;
}
function Icon({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute left-3 top-[2.2rem] text-gray-300">
      {children}
    </span>
  );
}

export default function ResearchEthicsPage() {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allTicked = CHECKLIST_ITEMS.every((item) => form[item.key] !== "");
    if (!allTicked || !form.name || !form.email) {
      setError(true);
      return;
    }
    setError(false);
    setSubmitted(true);
    console.log(form);
  };

  return (
    <>
      <PageBreadcrumb
        bgImage="/images/breadcrumb/research-ethics.jpg"
        title="Research & Ethics"
        links={[{ label: "Research & Ethics" }]}
      />

      {/* Caveat section */}
      <section className="w-full bg-white py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          <div>
            <p className="text-green-700 uppercase text-sm font-semibold tracking-wide">
              Before You Apply
            </p>
            <h2 className="text-red-600 text-3xl md:text-4xl font-semibold font-yeseva mt-2">
              Application Requirements
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mt-4 max-w-3xl">
              Application to the Ethics and Research Committee for clearance of research
              involving human subjects, or patient records. All applications to the
              committee will only be considered if:
            </p>
          </div>

          <ul className="flex flex-col gap-4">
            {CAVEAT_ITEMS.map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-green-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-gray-600 text-base leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Form section */}
      <section className="relative w-full py-20 px-6 md:px-12 overflow-hidden bg-[url('/images/booking-form/form-poster.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gray-950/75" />

        <div className="relative max-w-7xl mx-auto flex flex-col gap-10">
          {/* Header */}
          <div className="text-center">
            <p className="text-red-500 uppercase text-xl font-semibold tracking-wide">
              Submit Your Application
            </p>
            <h2 className="text-white text-3xl md:text-5xl font-semibold font-yeseva mt-2">
              Ethics Clearance Form
            </h2>
            <p className="mt-3 text-gray-400 text-base max-w-2xl mx-auto">
              Please indicate if the following documents have been enclosed by
              selecting the relevant option for each item below.
            </p>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-green-900/30 border border-green-700 flex items-center justify-center">
                <Send size={24} className="text-green-400" />
              </div>
              <p className="text-white text-xl font-semibold">Application Submitted</p>
              <p className="text-gray-400 text-sm max-w-md">
                Your application has been received. The committee will review your
                submission and respond in due course.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              {/* Name + Email */}
              <div className="grid md:grid-cols-2 gap-6">
                <Field>
                  <label className={labelCls}>Full Name</label>
                  <Icon><User size={15} /></Icon>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={inputCls}
                    required
                  />
                </Field>
                <Field>
                  <label className={labelCls}>Email Address</label>
                  <Icon><Mail size={15} /></Icon>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={inputCls}
                    required
                  />
                </Field>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <hr className="flex-1 border-white/10" />
                <span className="text-gray-400 text-xs uppercase tracking-wide shrink-0 flex items-center gap-1.5">
                  <Info size={12} />
                  Document Checklist
                </span>
                <hr className="flex-1 border-white/10" />
              </div>

              {/* Checklist */}
              <div className="flex flex-col gap-5">
                {CHECKLIST_ITEMS.map(({ key, label }) => (
                  <div
                    key={key}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-5 py-4"
                  >
                    <p className="text-white text-sm leading-snug flex-1">{label}</p>

                    <div className="flex items-center gap-4 shrink-0">
                      {(["yes", "no", "na"] as const).map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-1.5 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name={key}
                            value={opt}
                            checked={form[key] === opt}
                            onChange={handleChange}
                            className="accent-green-500 w-4 h-4 cursor-pointer"
                          />
                          <span
                            className={`text-xs font-semibold transition ${
                              form[key] === opt ? "text-white" : "text-gray-400 group-hover:text-gray-200"
                            }`}
                          >
                            {opt === "na" ? "N/A" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                  <AlertCircle size={16} className="shrink-0" />
                  Form not completed! Please fill in all fields and tick all checklist items.
                </div>
              )}

              <hr className="border-white/10" />

              {/* Submit */}
              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 w-full md:w-fit md:px-12 py-3.5 bg-green-900 hover:bg-green-800 active:scale-95 text-white font-semibold rounded-lg transition"
                >
                  <Send size={16} />
                  Submit Application
                </button>

                <div className="flex items-start gap-2 text-gray-400 text-sm bg-white/5 border border-white/10 rounded-lg px-4 py-3">
                  <span className="font-bold text-white shrink-0">N.B</span>
                  Only the first twenty applications received will be considered,
                  while others will be carried over to the next month.
                </div>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
