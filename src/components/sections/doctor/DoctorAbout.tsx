type Props = {
  bio: string[];
};

export default function DoctorAbout({ bio }: Props) {
  return (
    <section className="bg-white py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl flex flex-col gap-6">
          {/* Header */}
          <div>
            <p className="text-green-700 uppercase text-sm font-semibold tracking-wide">
              About
            </p>
            <h2 className="text-red-600 text-3xl md:text-4xl font-semibold font-yeseva mt-2">
              About This Doctor
            </h2>
          </div>

          {/* Bio paragraphs */}
          <div className="flex flex-col gap-4">
            {bio.map((paragraph, i) => (
              <p key={i} className="text-gray-600 text-base leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
