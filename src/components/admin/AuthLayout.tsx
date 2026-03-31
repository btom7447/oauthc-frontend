import Image from "next/image";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex">
      {/* Left — image panel (3/4) */}
      <div className="hidden lg:flex lg:w-3/4 relative overflow-hidden">
        <Image
          src="/images/admin/auth.jpg"
          alt="OAUTHC Hospital"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-green-950/65" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-14">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative">
              <Image src="/logo.png" alt="OAUTHC" fill className="object-contain" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight tracking-tight">
                OAUTHC
              </p>
              <p className="text-green-300 text-[10px] tracking-wide uppercase">
                Admin Portal
              </p>
            </div>
          </div>

          {/* Quote */}
          <div className="max-w-xl">
            <blockquote className="text-white text-4xl font-bold font-yeseva leading-snug">
              &ldquo;Excellence in healthcare, research, and training — since 1975.&rdquo;
            </blockquote>
            <p className="text-green-200 mt-5 text-base leading-relaxed">
              The OAUTHC staff portal gives you secure, role-based access to manage
              appointments, hospital content, and operations — all in one place.
            </p>

          </div>

          <p className="text-green-400 text-xs">
            © {new Date().getFullYear()} Obafemi Awolowo University Teaching Hospitals Complex.
            All rights reserved.
          </p>
        </div>
      </div>

      {/* Right — form panel (1/4) */}
      <div className="w-full lg:w-1/4 bg-white flex flex-col justify-center px-8 py-12 overflow-y-auto">
        {/* Mobile logo */}
        <div className="flex items-center gap-3 mb-8 lg:hidden">
          <div className="w-8 h-8 relative">
            <Image src="/logo.png" alt="OAUTHC" fill className="object-contain" />
          </div>
          <span className="text-gray-900 font-bold text-base">OAUTHC Admin</span>
        </div>

        {children}
      </div>
    </div>
  );
}
