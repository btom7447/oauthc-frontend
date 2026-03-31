import { UserCircle2 } from "lucide-react";

type FacultyMember = {
  name: string;
  role: string;
  qualification: string;
  image?: string;
};

type Props = {
  members: FacultyMember[];
};

export default function SchoolFaculties({ members }: Props) {
  return (
    <section className="w-full bg-gray-50 py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <div>
          <p className="text-green-700 uppercase text-sm font-semibold tracking-wide">
            Our Team
          </p>
          <h2 className="text-red-600 text-3xl md:text-4xl font-semibold font-yeseva mt-2">
            Faculty Members
          </h2>
        </div>

        {/* Members grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {members.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center gap-3"
            >
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-20 h-20 rounded-full object-cover object-top border-2 border-green-900/20"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-green-900/10 flex items-center justify-center">
                  <UserCircle2 size={36} className="text-green-900/40" strokeWidth={1} />
                </div>
              )}
              <div>
                <p className="text-gray-900 font-bold text-sm leading-snug">{member.name}</p>
                <p className="text-green-700 text-xs font-medium mt-0.5">{member.role}</p>
                <p className="text-gray-400 text-xs mt-0.5">{member.qualification}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
