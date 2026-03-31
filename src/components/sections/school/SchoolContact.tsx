import { Mail, Phone, Clock } from "lucide-react";

type Props = {
  email: string;
  phone: string;
  officeHours?: string;
  note?: string;
};

export default function SchoolContact({ email, phone, officeHours, note }: Props) {
  return (
    <section className="w-full bg-green-900 py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <div>
          <p className="text-green-300 uppercase text-sm font-semibold tracking-wide">
            Get in Touch
          </p>
          <h2 className="text-white text-3xl md:text-4xl font-semibold font-yeseva mt-2">
            Enquiries & Admissions
          </h2>
          {note && (
            <p className="text-green-200 text-base leading-relaxed mt-3 max-w-2xl">
              {note}
            </p>
          )}
        </div>

        {/* Contact cards */}
        <div className="flex flex-col sm:flex-row gap-5">
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-4 bg-white/10 hover:bg-white/20 transition rounded-xl px-6 py-5 flex-1"
          >
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Mail size={18} className="text-white" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-green-300 text-xs font-semibold uppercase tracking-wide">
                Email
              </p>
              <p className="text-white text-sm font-medium mt-0.5">{email}</p>
            </div>
          </a>

          <a
            href={`tel:${phone.replace(/\s+/g, "")}`}
            className="flex items-center gap-4 bg-white/10 hover:bg-white/20 transition rounded-xl px-6 py-5 flex-1"
          >
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Phone size={18} className="text-white" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-green-300 text-xs font-semibold uppercase tracking-wide">
                Phone
              </p>
              <p className="text-white text-sm font-medium mt-0.5">{phone}</p>
            </div>
          </a>

          {officeHours && (
            <div className="flex items-center gap-4 bg-white/10 rounded-xl px-6 py-5 flex-1">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Clock size={18} className="text-white" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-green-300 text-xs font-semibold uppercase tracking-wide">
                  Office Hours
                </p>
                <p className="text-white text-sm font-medium mt-0.5">{officeHours}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
