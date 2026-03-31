export type DiseaseItem = {
  name: string;
  slug: string;
};

export type DiseaseDetail = DiseaseItem & {
  category: string;
  overview: string[];
  images: string[];
  symptoms: string[];
  causes: string[];
  whenToSeeDoctor: string[];
  treatment: string[];
  prevention: string[];
};

export const ALL_DISEASES: DiseaseItem[] = [
  // A
  { name: "Alzheimer's Disease", slug: "alzheimers-disease" },
  { name: "Anaemia", slug: "anaemia" },
  { name: "Appendicitis", slug: "appendicitis" },
  { name: "Arthritis", slug: "arthritis" },
  { name: "Asthma", slug: "asthma" },
  // B
  { name: "Blood Pressure Disorders", slug: "blood-pressure-disorders" },
  { name: "Brain Tumour", slug: "brain-tumour" },
  { name: "Bronchitis", slug: "bronchitis" },
  // C
  { name: "Cancer", slug: "cancer" },
  { name: "Chickenpox", slug: "chickenpox" },
  { name: "Cholera", slug: "cholera" },
  { name: "Chronic Kidney Disease", slug: "chronic-kidney-disease" },
  { name: "COVID-19", slug: "covid-19" },
  // D
  { name: "Dengue Fever", slug: "dengue-fever" },
  { name: "Depression", slug: "depression" },
  { name: "Diabetes", slug: "diabetes" },
  { name: "Diarrhoea", slug: "diarrhoea" },
  // E
  { name: "Ear Infection", slug: "ear-infection" },
  { name: "Eczema", slug: "eczema" },
  { name: "Epilepsy", slug: "epilepsy" },
  // F
  { name: "Fibroids (Uterine)", slug: "uterine-fibroids" },
  { name: "Food Poisoning", slug: "food-poisoning" },
  // G
  { name: "Gastroenteritis", slug: "gastroenteritis" },
  { name: "Glaucoma", slug: "glaucoma" },
  { name: "Gonorrhoea", slug: "gonorrhoea" },
  // H
  { name: "Heart Failure", slug: "heart-failure" },
  { name: "Hepatitis B", slug: "hepatitis-b" },
  { name: "Hepatitis C", slug: "hepatitis-c" },
  { name: "HIV/AIDS", slug: "hiv-aids" },
  { name: "Hypertension", slug: "hypertension" },
  // I
  { name: "Influenza (Flu)", slug: "influenza" },
  { name: "Irritable Bowel Syndrome", slug: "irritable-bowel-syndrome" },
  // J
  { name: "Jaundice", slug: "jaundice" },
  // K
  { name: "Kidney Stones", slug: "kidney-stones" },
  { name: "Kwashiorkor", slug: "kwashiorkor" },
  // L
  { name: "Leukaemia", slug: "leukaemia" },
  { name: "Liver Disease", slug: "liver-disease" },
  { name: "Lupus", slug: "lupus" },
  // M
  { name: "Malaria", slug: "malaria" },
  { name: "Measles", slug: "measles" },
  { name: "Meningitis", slug: "meningitis" },
  { name: "Multiple Sclerosis", slug: "multiple-sclerosis" },
  // N
  { name: "Nephrotic Syndrome", slug: "nephrotic-syndrome" },
  { name: "Neonatal Jaundice", slug: "neonatal-jaundice" },
  // O
  { name: "Obesity", slug: "obesity" },
  { name: "Osteoporosis", slug: "osteoporosis" },
  { name: "Otitis Media", slug: "otitis-media" },
  // P
  { name: "Parkinson's Disease", slug: "parkinsons-disease" },
  { name: "Peptic Ulcer", slug: "peptic-ulcer" },
  { name: "Pneumonia", slug: "pneumonia" },
  { name: "Poliomyelitis", slug: "poliomyelitis" },
  // R
  { name: "Renal Failure", slug: "renal-failure" },
  { name: "Rheumatoid Arthritis", slug: "rheumatoid-arthritis" },
  // S
  { name: "Sexually Transmitted Infections", slug: "sexually-transmitted-infections" },
  { name: "Sickle Cell Disease", slug: "sickle-cell-disease" },
  { name: "Stroke", slug: "stroke" },
  // T
  { name: "Tonsillitis", slug: "tonsillitis" },
  { name: "Tuberculosis", slug: "tuberculosis" },
  { name: "Typhoid Fever", slug: "typhoid-fever" },
  // U
  { name: "Ulcerative Colitis", slug: "ulcerative-colitis" },
  { name: "Urinary Tract Infection", slug: "urinary-tract-infection" },
  // V
  { name: "Viral Conjunctivitis", slug: "viral-conjunctivitis" },
  { name: "Vitiligo", slug: "vitiligo" },
  // W
  { name: "Whooping Cough", slug: "whooping-cough" },
  // Y
  { name: "Yellow Fever", slug: "yellow-fever" },
  // Z
  { name: "Zika Virus", slug: "zika-virus" },
];

export function getDiseasesByLetter(letter: string): DiseaseItem[] {
  return ALL_DISEASES.filter((d) =>
    d.name.toUpperCase().startsWith(letter.toUpperCase())
  );
}

export function getAvailableLetters(): string[] {
  const letters = new Set(ALL_DISEASES.map((d) => d.name[0].toUpperCase()));
  return Array.from(letters).sort();
}

export function searchDiseases(query: string): DiseaseItem[] {
  const q = query.toLowerCase();
  return ALL_DISEASES.filter((d) => d.name.toLowerCase().includes(q));
}

export function getDiseaseDetail(slug: string): DiseaseDetail {
  const base = ALL_DISEASES.find((d) => d.slug === slug) ?? ALL_DISEASES[0];

  return {
    ...base,
    category: "General Medicine",
    overview: [
      `${base.name} is a medical condition that affects a significant number of people across Nigeria and globally. At OAUTHC, our multidisciplinary team of specialists is experienced in diagnosing and managing this condition using evidence-based approaches tailored to each patient's individual needs.`,
      "Early diagnosis is key to better outcomes. Understanding the condition, its causes, and available treatments empowers patients to seek timely care and make informed decisions about their health.",
      "Our clinical teams work closely with patients and their families to develop comprehensive management plans that address not just the physical aspects of the condition but also the psychological and social dimensions of living with illness.",
    ],
    images: [
      `/images/diseases/${slug}-1.jpg`,
      `/images/diseases/${slug}-2.jpg`,
      `/images/diseases/${slug}-3.jpg`,
    ],
    symptoms: [
      "Persistent fatigue or unexplained weakness",
      "Fever or elevated body temperature",
      "Pain or discomfort in the affected area",
      "Changes in appetite or body weight",
      "Difficulty breathing or shortness of breath",
      "Swelling of affected tissues or organs",
      "Skin changes including rashes, pallor, or discolouration",
      "Neurological symptoms such as headache, dizziness, or confusion",
    ],
    causes: [
      "Genetic predisposition or family history of the condition",
      "Environmental exposures including infections, toxins, or allergens",
      "Lifestyle factors such as poor diet, physical inactivity, or smoking",
      "Underlying chronic conditions that increase susceptibility",
      "Immune system dysregulation or autoimmune mechanisms",
      "Nutritional deficiencies affecting normal physiological function",
    ],
    whenToSeeDoctor: [
      "Symptoms are severe, sudden in onset, or rapidly worsening",
      "You experience chest pain, difficulty breathing, or loss of consciousness",
      "Symptoms persist for more than a week without improvement",
      "A child under five or an elderly person is affected",
      "You have a known underlying condition that may be complicated",
      "Home management has not provided relief after 48–72 hours",
    ],
    treatment: [
      "Accurate diagnosis through clinical assessment and targeted investigations",
      "Medication therapy tailored to the specific type and severity of the condition",
      "Lifestyle modifications including diet, exercise, and stress management",
      "Monitoring and follow-up appointments to assess treatment response",
      "Specialist referral where required for complex or refractory cases",
      "Patient education and self-management support",
    ],
    prevention: [
      "Maintain a balanced diet rich in fruits, vegetables, and whole grains",
      "Engage in regular physical activity appropriate to your age and condition",
      "Attend routine health screenings and immunisation programmes",
      "Avoid known environmental and lifestyle risk factors",
      "Practise good hygiene and infection control measures",
      "Follow prescribed medication regimens and attend all scheduled appointments",
    ],
  };
}
