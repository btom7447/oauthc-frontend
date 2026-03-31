import { Phone, MapPin, Mail, Clock } from "lucide-react";

type CardType = "phone" | "email" | "text";

type ContactCard = {
  Icon: React.ElementType;
  title: string;
  type: CardType;
  items: string[];
};

const contactCards: ContactCard[] = [
  {
    Icon: Phone,
    title: "Emergency Numbers",
    type: "phone",
    items: [
      "Adult: +234 815 209 2813",
      "Children: +234 815 209 2908",
      "OPD: +234 805 500 4262",
    ],
  },
  {
    Icon: MapPin,
    title: "Location",
    type: "text",
    items: [
      "Ife-Ilesa, Ife,",
      "Osun State, Nigeria.",
    ],
  },
  {
    Icon: Mail,
    title: "Email",
    type: "email",
    items: [
      "info@oauthc.gov.ng",
    ],
  },
  {
    Icon: Clock,
    title: "Working Hours",
    type: "text",
    items: [
      "24 Hours",
    ],
  },
];

function extractHref(type: CardType, item: string): string | null {
  if (type === "phone") {
    // Extract digits after the colon label if present, e.g. "Adult: +234 815..."
    const raw = item.includes(":") ? item.split(":").slice(1).join(":").trim() : item.trim();
    return `tel:${raw.replace(/\s+/g, "")}`;
  }
  if (type === "email") return `mailto:${item.trim()}`;
  return null;
}

export default function GetInTouchSection() {
  return (
    <section className="w-full bg-white py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">

        {/* Header */}
        <div className="text-center">
          <p className="text-green-900 uppercase text-xl font-semibold tracking-wide">
            Reach Out
          </p>
          <h2 className="text-red-500 text-3xl md:text-5xl font-semibold font-yeseva mt-2">
            Get in Touch
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactCards.map(({ Icon, title, type, items }) => (
            <div
              key={title}
              className="flex flex-col bg-green-900 rounded-lg overflow-hidden"
            >
              {/* Card header */}
              <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-white font-bold text-lg">{title}</h3>
              </div>

              {/* Items */}
              <ul className="flex flex-col px-6 py-5">
                {items.map((item, i) => {
                  const href = extractHref(type, item);
                  const cls = "text-md leading-relaxed border-b border-white/10 last:border-0 py-3 first:pt-0 last:pb-0";

                  return (
                    <li key={i} className={cls}>
                      {href ? (
                        <a
                          href={href}
                          className="text-green-100 hover:text-white underline-offset-2 hover:underline transition-colors"
                        >
                          {item}
                        </a>
                      ) : (
                        <span className="text-green-100">{item}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
