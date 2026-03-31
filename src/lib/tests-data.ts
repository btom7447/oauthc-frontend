export type TestItem = {
  name: string;
  slug: string;
};

export type TestDetail = TestItem & {
  category: string;
  overview: string[];
  images: string[];
  whyItsDone: string[];
  howToPrepare: string[];
  whatToExpect: string[];
  results: string[];
  limitations: string[];
};

export const ALL_TESTS: TestItem[] = [
  // A
  { name: "Abdominal Ultrasound", slug: "abdominal-ultrasound" },
  { name: "Allergy Testing", slug: "allergy-testing" },
  { name: "Amniocentesis", slug: "amniocentesis" },
  { name: "Angiography", slug: "angiography" },
  // B
  { name: "Blood Culture", slug: "blood-culture" },
  { name: "Blood Glucose Test", slug: "blood-glucose-test" },
  { name: "Blood Pressure Monitoring", slug: "blood-pressure-monitoring" },
  { name: "Bone Density Scan (DEXA)", slug: "bone-density-scan" },
  { name: "Bone Marrow Biopsy", slug: "bone-marrow-biopsy" },
  // C
  { name: "Chest X-Ray", slug: "chest-x-ray" },
  { name: "Colonoscopy", slug: "colonoscopy" },
  { name: "Complete Blood Count (CBC)", slug: "complete-blood-count" },
  { name: "CT Scan", slug: "ct-scan" },
  { name: "Cytology", slug: "cytology" },
  // D
  { name: "D-Dimer Test", slug: "d-dimer-test" },
  { name: "Doppler Ultrasound", slug: "doppler-ultrasound" },
  { name: "Drug Sensitivity Test", slug: "drug-sensitivity-test" },
  // E
  { name: "Echocardiogram", slug: "echocardiogram" },
  { name: "Electrocardiogram (ECG)", slug: "electrocardiogram" },
  { name: "Electroencephalogram (EEG)", slug: "electroencephalogram" },
  { name: "Endoscopy", slug: "endoscopy" },
  // F
  { name: "Fine Needle Aspiration Cytology", slug: "fine-needle-aspiration" },
  { name: "Full Blood Count", slug: "full-blood-count" },
  // G
  { name: "Gastroscopy", slug: "gastroscopy" },
  { name: "Genetic Testing", slug: "genetic-testing" },
  // H
  { name: "HbA1c Test", slug: "hba1c-test" },
  { name: "HIV Test", slug: "hiv-test" },
  { name: "Hormonal Assay", slug: "hormonal-assay" },
  // I
  { name: "Intravenous Urography (IVU)", slug: "intravenous-urography" },
  // K
  { name: "Kidney Function Test", slug: "kidney-function-test" },
  // L
  { name: "Liver Function Test", slug: "liver-function-test" },
  { name: "Lumbar Puncture", slug: "lumbar-puncture" },
  { name: "Lung Function Test (Spirometry)", slug: "spirometry" },
  // M
  { name: "Malaria Parasite Test", slug: "malaria-parasite-test" },
  { name: "Mammography", slug: "mammography" },
  { name: "MRI Scan", slug: "mri-scan" },
  // P
  { name: "Pap Smear", slug: "pap-smear" },
  { name: "PET Scan", slug: "pet-scan" },
  { name: "Prostate-Specific Antigen (PSA) Test", slug: "psa-test" },
  // R
  { name: "Renal Biopsy", slug: "renal-biopsy" },
  // S
  { name: "Semen Analysis", slug: "semen-analysis" },
  { name: "Stool Analysis", slug: "stool-analysis" },
  // T
  { name: "Thyroid Function Test", slug: "thyroid-function-test" },
  { name: "Tissue Biopsy", slug: "tissue-biopsy" },
  { name: "Tuberculin Skin Test (Mantoux)", slug: "tuberculin-skin-test" },
  // U
  { name: "Urinalysis", slug: "urinalysis" },
  { name: "Urine Culture", slug: "urine-culture" },
  // W
  { name: "Widal Test", slug: "widal-test" },
  // X
  { name: "X-Ray (General)", slug: "x-ray" },
];

export function getTestsByLetter(letter: string): TestItem[] {
  return ALL_TESTS.filter((t) =>
    t.name.toUpperCase().startsWith(letter.toUpperCase())
  );
}

export function getAvailableTestLetters(): string[] {
  const letters = new Set(ALL_TESTS.map((t) => t.name[0].toUpperCase()));
  return Array.from(letters).sort();
}

export function searchTests(query: string): TestItem[] {
  const q = query.toLowerCase();
  return ALL_TESTS.filter((t) => t.name.toLowerCase().includes(q));
}

export function getTestDetail(slug: string): TestDetail {
  const base = ALL_TESTS.find((t) => t.slug === slug) ?? ALL_TESTS[0];

  return {
    ...base,
    category: "Diagnostic Testing",
    overview: [
      `The ${base.name} is a diagnostic procedure used by clinical teams at OAUTHC to assess, monitor, or investigate a wide range of medical conditions. It is performed by trained laboratory scientists, radiologists, or specialist clinicians depending on the nature of the test, and all results are interpreted by qualified medical professionals in the context of each patient's clinical presentation.`,
      "At OAUTHC, our diagnostic services are equipped with modern instrumentation and adhere to strict quality control standards to ensure accurate, reliable results. Timely and precise diagnosis forms the cornerstone of effective patient management, and we are committed to supporting clinicians with the best available diagnostic information.",
    ],
    images: [
      `/images/tests/${slug}-1.jpg`,
      `/images/tests/${slug}-2.jpg`,
      `/images/tests/${slug}-3.jpg`,
    ],
    whyItsDone: [
      "To confirm or rule out a suspected diagnosis based on clinical findings",
      "To monitor the progression of a known condition or the effectiveness of treatment",
      "To screen for conditions in individuals with known risk factors",
      "To guide clinical decision-making before surgical or invasive procedures",
      "To establish a baseline measurement for future comparison",
    ],
    howToPrepare: [
      "Follow any fasting instructions provided by your doctor — typically 8–12 hours for blood tests",
      "Inform your doctor of all current medications, supplements, and herbal remedies",
      "Avoid strenuous physical activity for 24 hours before the procedure if advised",
      "Bring your referral letter, hospital identification, and insurance documents",
      "Wear comfortable, loose-fitting clothing to allow easy access to the sample site",
      "Arrange transportation if sedation or contrast agents will be used",
    ],
    whatToExpect: [
      "A brief clinical assessment and identification verification on arrival",
      "Explanation of the procedure by the attending technician or clinician",
      "Minimal discomfort — most tests involve a simple blood draw, imaging, or non-invasive measurement",
      "The procedure typically takes between 5 and 45 minutes depending on complexity",
      "A small dressing may be applied at the sample site if required",
      "You will be advised when and how to collect your results",
    ],
    results: [
      "Results are typically available within 24–72 hours, though complex analyses may take longer",
      "Your results will be reviewed and interpreted by a qualified clinician in the context of your full clinical history",
      "Normal reference ranges vary by age, sex, and clinical context — your doctor will explain what the values mean for you",
      "Abnormal results do not always indicate disease; further investigation may be recommended",
      "A follow-up appointment will be arranged to discuss findings and any recommended next steps",
    ],
    limitations: [
      "No single test provides a complete picture of health — results must be interpreted alongside clinical findings",
      "Some tests may yield false-positive or false-negative results, particularly in early disease or borderline cases",
      "Technical factors such as sample handling, timing, and patient preparation can affect accuracy",
      "Imaging studies are limited by equipment resolution and operator skill; complex cases may require specialist review",
    ],
  };
}
