import { ClipboardList } from "lucide-react";

type Props = {
  serviceName: string;
};

export default function HealthServiceCTA({ serviceName }: Props) {
  return (
    <div className="bg-green-900 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <ClipboardList size={22} className="text-green-300 shrink-0" strokeWidth={1.5} />
        <div>
          <p className="text-white font-semibold text-base">Ready to get started?</p>
          <p className="text-green-300 text-sm">
            Book an appointment with our {serviceName} team today.
          </p>
        </div>
      </div>
      <a
        href="/#bookingForm"
        className="shrink-0 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition"
      >
        Book Appointment
      </a>
    </div>
  );
}
