import Image from "next/image";
import { Phone, MapPin, Shield } from "lucide-react";

export default function FirstHeader() {
  const inquiriesPhones = [
    "+2348152092751",
    "+2348152092755",
    "+2348152092753",
  ];

  const locationLines = ["Ilesa Road, Ife,", "Osun, Nigeria"];

  const securityPhones = ["+2348055002174"];

  return (
    <div className="first-header bg-white flex justify-between items-center px-6 py-4 border-b">
      {/* Left */}
      <div className="f-header-left hidden lg:flex items-center gap-3">
        <Image src="/logo.png" alt="OAUTHC Logo" width={50} height={50} />

        <h4 className="text-2xl text-green-900 uppercase font-bold font-yeseva">
          Obafemi Awolowo University <br />
          Teaching Hospitals Complex
        </h4>
      </div>

      {/* Right */}
      <div className="f-header-right flex flex-wrap justify-center items-start gap-10 font-work-sans">
        {/* Inquiries */}
        <div className="flex gap-2 items-start">
          <Phone className="text-green-800 mt-1" size={22} strokeWidth={1.5} />

          <div>
            <h5 className="text-xl lg:text-2xl uppercase text-green-800 font-semibold">
              Inquiries
            </h5>

            {inquiriesPhones.map((phone) => (
              <a
                key={phone}
                href={`tel:${phone}`}
                className="block text-red-600 text-xl hover:underline"
              >
                {phone.replace(/(\d{3})(\d{3})(\d+)/, "$1 $2 $3")}
              </a>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="flex gap-2 items-start">
          <MapPin className="text-green-800 mt-1" size={22} strokeWidth={1.5} />

          <div>
            <h5 className="text-xl lg:text-2xl uppercase text-green-800 font-semibold">
              Location
            </h5>

            {locationLines.map((line, index) => (
              <p key={index} className="text-red-600 text-xl">
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="flex gap-2 items-start">
          <Shield className="text-green-800 mt-1" size={22} strokeWidth={1.5} />

          <div>
            <h5 className="text-xl lg:text-2xl uppercase text-green-800 font-semibold">
              Security
            </h5>

            {securityPhones.map((phone) => (
              <a
                key={phone}
                href={`tel:${phone}`}
                className="block text-xl text-red-600 hover:underline"
              >
                {phone.replace(/(\d{3})(\d{3})(\d+)/, "$1 $2 $3")}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
