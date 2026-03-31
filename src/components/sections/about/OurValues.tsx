import { HeartHandshake, ShieldCheck, Lightbulb, Users } from "lucide-react";

const values = [
  {
    Icon: HeartHandshake,
    title: "Compassion",
    body: "We treat every patient with warmth, empathy, and dignity. Behind every case is a person — and we never lose sight of that. Our care extends beyond diagnosis to the whole human experience of illness and recovery.",
  },
  {
    Icon: ShieldCheck,
    title: "Integrity",
    body: "We uphold the highest standards of honesty, transparency, and ethical conduct in everything we do — from clinical decisions to administrative practice. Trust is the foundation of the care we provide.",
  },
  {
    Icon: Lightbulb,
    title: "Innovation",
    body: "We embrace research, technology, and continuous learning to stay at the forefront of medicine. We challenge the status quo and invest in new ideas that improve patient outcomes and advance healthcare delivery.",
  },
  {
    Icon: Users,
    title: "Teamwork",
    body: "Great healthcare is never a solo effort. We foster a culture of collaboration — where doctors, nurses, scientists, and support staff work together seamlessly to deliver the best possible care for our patients.",
  },
];

export default function OurValuesSection() {
  return (
    <section className="w-full bg-green-900 py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">

        {/* Header */}
        <div className="text-center">
          <p className="text-red-500 uppercase text-xl font-semibold tracking-wide">
            What We Stand For
          </p>
          <h2 className="text-white text-3xl md:text-5xl font-semibold font-yeseva mt-2">
            Our Core Values
          </h2>
        </div>

        {/* Values grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map(({ Icon, title, body }) => (
            <div
              key={title}
              className="flex flex-col gap-5 bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/10 transition-colors duration-300"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-red-600/20 flex items-center justify-center shrink-0">
                <Icon size={24} className="text-red-400" strokeWidth={1.5} />
              </div>

              {/* Text */}
              <div className="flex flex-col gap-2">
                <h3 className="text-white text-lg font-bold">{title}</h3>
                <p className="text-green-200 text-sm leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
