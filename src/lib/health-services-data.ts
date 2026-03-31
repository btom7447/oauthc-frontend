export type HealthServiceItem = {
  name: string;
  slug: string;
  image: string;
  tagline: string;
  iconKey: string;
};

export type HealthServiceDetail = HealthServiceItem & {
  overview: string[];
  keyPoints: string[];
  additionalInfo: string[];
  whatToExpect: { title: string; detail: string }[];
};

export const ALL_HEALTH_SERVICES: HealthServiceItem[] = [
  {
    name: "Emergency & Trauma Care",
    slug: "emergency-trauma-care",
    image: "/images/health-services/emergency.jpg",
    tagline: "Round-the-clock critical care for life-threatening conditions",
    iconKey: "siren",
  },
  {
    name: "Cardiology Services",
    slug: "cardiology-services",
    image: "/images/health-services/cardiology.jpg",
    tagline: "Advanced diagnosis and treatment of heart conditions",
    iconKey: "heart",
  },
  {
    name: "Maternal & Child Health",
    slug: "maternal-child-health",
    image: "/images/health-services/maternal.jpg",
    tagline: "Comprehensive care for mothers and children at every stage",
    iconKey: "baby",
  },
  {
    name: "Surgical Services",
    slug: "surgical-services",
    image: "/images/health-services/surgery.jpg",
    tagline: "Expert surgical interventions across all major specialties",
    iconKey: "scissors",
  },
  {
    name: "Oncology Services",
    slug: "oncology-services",
    image: "/images/health-services/oncology.jpg",
    tagline: "Multidisciplinary cancer diagnosis, treatment and support",
    iconKey: "microscope",
  },
  {
    name: "Radiology & Imaging",
    slug: "radiology-imaging",
    image: "/images/health-services/radiology.jpg",
    tagline: "State-of-the-art diagnostic imaging and interventional radiology",
    iconKey: "scan-line",
  },
  {
    name: "Laboratory Services",
    slug: "laboratory-services",
    image: "/images/health-services/laboratory.jpg",
    tagline: "Accurate, timely diagnostic testing across all disciplines",
    iconKey: "flask-conical",
  },
  {
    name: "Pharmacy Services",
    slug: "pharmacy-services",
    image: "/images/health-services/pharmacy.jpg",
    tagline: "Safe, evidence-based medication management and dispensing",
    iconKey: "pill",
  },
  {
    name: "Physiotherapy & Rehabilitation",
    slug: "physiotherapy-rehabilitation",
    image: "/images/health-services/physiotherapy.jpg",
    tagline: "Restoring mobility, function and quality of life",
    iconKey: "activity",
  },
  {
    name: "Mental Health Services",
    slug: "mental-health-services",
    image: "/images/health-services/mental-health.jpg",
    tagline: "Compassionate psychiatric and psychological support",
    iconKey: "brain",
  },
  {
    name: "Dental Services",
    slug: "dental-services",
    image: "/images/health-services/dental.jpg",
    tagline: "Preventive, restorative and specialist oral healthcare",
    iconKey: "smile-plus",
  },
  {
    name: "Ophthalmology Services",
    slug: "ophthalmology-services",
    image: "/images/health-services/ophthalmology.jpg",
    tagline: "Complete eye care from routine checks to complex surgery",
    iconKey: "eye",
  },
];

export function getHealthServiceDetail(slug: string): HealthServiceDetail {
  const base =
    ALL_HEALTH_SERVICES.find((s) => s.slug === slug) ?? ALL_HEALTH_SERVICES[0];

  return {
    ...base,
    overview: [
      `The ${base.name} unit at OAUTHC is staffed by a dedicated team of specialists, nurses, and allied health professionals committed to delivering the highest standard of patient-centred care. Our facility is equipped with modern diagnostic and therapeutic technology, enabling us to manage both routine and complex cases with precision and efficiency.`,
      "We work within a multidisciplinary framework, ensuring that patients benefit from the combined expertise of consultants across relevant specialties. Care plans are tailored to each individual, integrating clinical evidence with the patient's personal goals and circumstances to achieve the best possible outcomes.",
      "Patient education and follow-up are central to our approach. We believe that informed patients make better health decisions, and we invest in supporting patients and their families throughout the full care journey — from initial assessment through to recovery and long-term management.",
    ],
    keyPoints: [
      "24-hour specialist consultant access",
      "Evidence-based clinical protocols aligned with international guidelines",
      "Multidisciplinary team approach for complex cases",
      "Dedicated patient education and counselling",
      "Seamless referral pathways within OAUTHC departments",
      "Ongoing audit and quality improvement programmes",
    ],
    additionalInfo: [
      "Our unit actively participates in national and international clinical research, contributing to the growing body of evidence that shapes best practice across Nigeria and West Africa. Many of our consultants hold faculty positions at Obafemi Awolowo University and are involved in training the next generation of healthcare professionals.",
      "We maintain strong links with specialist centres globally, enabling us to offer our patients access to the latest treatment innovations and, where necessary, to facilitate referrals to international centres of excellence.",
    ],
    whatToExpect: [
      {
        title: "Initial Consultation",
        detail:
          "A thorough assessment by a specialist to review your history, symptoms, and any prior investigations before recommending a personalised plan.",
      },
      {
        title: "Investigations & Diagnostics",
        detail:
          "Targeted tests — including laboratory, imaging, or specialist procedures — conducted within the OAUTHC network for rapid turnaround.",
      },
      {
        title: "Treatment & Intervention",
        detail:
          "Medical, surgical, or therapeutic interventions carried out by experienced specialists using current, evidence-based techniques.",
      },
      {
        title: "Follow-up & Monitoring",
        detail:
          "Structured follow-up appointments and remote monitoring options to track your progress and adjust your care plan as needed.",
      },
    ],
  };
}
