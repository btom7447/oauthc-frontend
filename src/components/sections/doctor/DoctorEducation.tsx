type EducationEntry = {
  degree: string;
  institution: string;
  year: string;
};

type Props = {
  education: EducationEntry[];
};

export default function DoctorEducation({ education }: Props) {
  return (
    <section className="bg-white py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <div>
          <p className="text-green-700 uppercase text-sm font-semibold tracking-wide">
            Background
          </p>
          <h2 className="text-red-600 text-3xl md:text-4xl font-semibold font-yeseva mt-2">
            Education &amp; Training
          </h2>
        </div>

        {/* Vertical timeline */}
        <div className="border-l-2 border-green-900 ml-4 pl-8 flex flex-col gap-8">
          {education.map((entry, i) => (
            <div key={i} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-[2.85rem] w-4 h-4 rounded-full bg-green-900 border-4 border-white shadow" />

              {/* Year badge */}
              <span className="text-xs font-bold bg-green-900 text-white px-2 py-0.5 rounded w-fit inline-block">
                {entry.year}
              </span>

              {/* Degree */}
              <p className="font-bold text-gray-900 text-base mt-1">{entry.degree}</p>

              {/* Institution */}
              <p className="text-gray-500 text-sm">{entry.institution}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
