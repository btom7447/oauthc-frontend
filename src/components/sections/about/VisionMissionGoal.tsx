import { Eye, Target, Flag } from "lucide-react";

const items = [
  {
    Icon: Eye,
    label: "Our Vision",
    color: "text-green-900",
    border: "border-green-900",
    bg: "bg-green-900",
    heading: "A World-Class Healthcare Institution",
    body: "To be the foremost teaching hospital in Africa — recognised globally for clinical excellence, medical innovation, and the delivery of compassionate, patient-centred care that transforms lives.",
  },
  {
    Icon: Target,
    label: "Our Mission",
    color: "text-green-900",
    border: "border-green-900",
    bg: "bg-green-900",
    heading: "Excellence in Care, Education & Research",
    body: "To provide accessible, high-quality healthcare services; train world-class medical professionals; and drive research that advances medicine — all in service of the communities we serve across Nigeria and beyond.",
  },
  {
    Icon: Flag,
    label: "Our Goal",
    color: "text-green-900",
    border: "border-green-900",
    bg: "bg-green-900",
    heading: "Healthier Communities, Stronger Systems",
    body: "To continuously improve patient outcomes, strengthen our clinical infrastructure, expand specialist services, and build a sustainable health ecosystem that benefits every individual who walks through our doors.",
  },
];

export default function VisionMissionGoalSection() {
  return (
    <section className="w-full bg-gray-100 py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">

        {/* Header */}
        <div className="text-center">
          <p className="text-green-900 uppercase text-xl font-semibold tracking-wide">
            What Drives Us
          </p>
          <h2 className="text-red-600 text-3xl md:text-5xl font-semibold font-yeseva mt-2">
            Vision, Mission & Goal
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(({ Icon, label, color, border, bg, heading, body }) => (
            <div
              key={label}
              className={`group relative flex flex-col gap-5 bg-white rounded-2xl p-8 border-t-4 ${border}  transition-shadow duration-300`}
            >
              {/* Icon circle */}
              <div className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                <Icon size={22} className="text-white" strokeWidth={1} />
              </div>

              <div className="flex flex-col gap-2">
                <span className={`text-xs font-bold uppercase tracking-widest ${color}`}>
                  {label}
                </span>
                <h3 className="text-lg font-bold text-gray-900 leading-snug">
                  {heading}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
