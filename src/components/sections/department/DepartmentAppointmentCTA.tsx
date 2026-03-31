import Link from "next/link";
import { CalendarCheck } from "lucide-react";

type Props = {
  departmentName: string;
};

export default function DepartmentAppointmentCTA({ departmentName }: Props) {
  return (
    <section className="w-full bg-green-900 py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <p className="text-green-400 uppercase text-sm font-semibold tracking-wide">
            Ready to Visit?
          </p>
          <h3 className="text-white text-2xl md:text-4xl font-bold font-yeseva leading-tight">
            Book an Appointment in{" "}
            <span className="text-red-400">{departmentName}</span>
          </h3>
          <p className="text-green-200 text-sm max-w-lg">
            Our specialists are available to provide expert care. Fill in your
            details and our team will confirm your slot within 24 hours.
          </p>
        </div>

        <Link
          href="/#bookingForm"
          className="shrink-0 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white px-8 py-4 rounded-lg font-semibold text-base transition"
        >
          <CalendarCheck size={18} />
          Book Appointment
        </Link>
      </div>
    </section>
  );
}
