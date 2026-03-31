"use client";

import { useState } from "react";
import { Microscope, Save, CheckCircle } from "lucide-react";

type Section = {
  key: string;
  label: string;
  placeholder: string;
  content: string;
};

const INITIAL_SECTIONS: Section[] = [
  {
    key: "about",
    label: "About the Committee",
    placeholder: "Describe the Research Ethics Committee, its mandate, composition, and role…",
    content: "The OAUTHC Research Ethics Committee (REC) is responsible for the ethical review of all biomedical, clinical and social research involving human participants conducted within the hospital. The committee operates in accordance with national and international guidelines including the NHREC Guidelines and the Declaration of Helsinki.",
  },
  {
    key: "mandate",
    label: "Mandate & Scope",
    placeholder: "Describe the mandate, scope of authority, and types of research reviewed…",
    content: "The REC reviews all research proposals involving human subjects, human biological materials, or identifiable data. This includes clinical trials, observational studies, surveys, and student research projects. Research cannot proceed without prior REC approval.",
  },
  {
    key: "requirements",
    label: "Application Requirements",
    placeholder: "List the documents and requirements needed for an application…",
    content: "Applicants must submit: (1) Completed application form (2) Study protocol (3) Informed consent documents (4) Questionnaires and data collection instruments (5) CV of principal investigator (6) Approval from relevant institution (7) Application fee receipt. All documents must be submitted in English.",
  },
  {
    key: "process",
    label: "Review Process",
    placeholder: "Describe the review steps, timelines, and decision types…",
    content: "Applications are reviewed at the monthly REC meeting. The committee may grant full approval, request modifications, or reject the application. Applicants are notified of the decision within 10 working days of the meeting. Approved studies are monitored throughout their duration.",
  },
  {
    key: "contact",
    label: "Contact & Submissions",
    placeholder: "Contact details for the Research Ethics office…",
    content: "Research Ethics Office, OAUTHC, PMB 5538, Ile-Ife, Osun State.\nEmail: research.ethics@oauthc.gov.ng\nPhone: +234 036 230 395\nOffice Hours: Monday–Friday, 8am–4pm",
  },
];

export default function ResearchEthicsCMSPage() {
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [saved, setSaved] = useState(false);

  const updateContent = (key: string, value: string) =>
    setSections((prev) => prev.map((s) => s.key === key ? { ...s, content: value } : s));

  const handleSave = async () => {
    await new Promise((r) => setTimeout(r, 600));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-gray-900 text-xl font-bold">Research Ethics Page</h1>
          <p className="text-gray-500 text-sm mt-1">Edit the content displayed on the public Research Ethics information page.</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-green-900 hover:bg-green-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shrink-0"
        >
          {saved ? <><CheckCircle size={14} strokeWidth={2} /> Saved</> : <><Save size={14} strokeWidth={1.5} /> Save All</>}
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {sections.map((section) => (
          <div key={section.key} className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                <Microscope size={14} strokeWidth={1.5} className="text-teal-700" />
              </div>
              <label className="text-sm font-semibold text-gray-800">{section.label}</label>
            </div>
            <textarea
              value={section.content}
              onChange={(e) => updateContent(section.key, e.target.value)}
              placeholder={section.placeholder}
              rows={5}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50 resize-y"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-green-900 hover:bg-green-800 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
        >
          {saved ? <><CheckCircle size={14} strokeWidth={2} /> Saved</> : <><Save size={14} strokeWidth={1.5} /> Save All</>}
        </button>
      </div>
    </div>
  );
}
