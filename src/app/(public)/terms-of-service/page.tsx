export const metadata = {
  title: "Terms of Service | OAUTHC",
  description:
    "Read the terms and conditions governing your use of the OAUTHC website and services.",
};

export default function TermsOfServicePage() {
  return (
    <main className="w-full bg-white">
      {/* Hero */}
      <section className="bg-green-900 py-20 px-6 md:px-12 text-white">
        <div className="max-w-7xl mx-auto">
          <p className="uppercase text-sm font-semibold tracking-wide text-green-300">
            Legal
          </p>
          <h1 className="text-3xl md:text-5xl font-bold font-yeseva mt-2">
            Terms of Service
          </h1>
          <p className="mt-3 text-green-200 text-sm">Last updated: March 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">

          <Block title="1. Acceptance of Terms">
            By accessing or using the website of the Obafemi Awolowo University
            Teaching Hospitals Complex (OAUTHC), you agree to be bound by these
            Terms of Service. If you do not agree to these terms, please do not
            use this website.
          </Block>

          <Block title="2. Use of This Website">
            <p>
              This website is provided for informational purposes only and does
              not constitute medical advice. The content on this site is not a
              substitute for professional medical consultation, diagnosis, or
              treatment.
            </p>
            <ul className="list-disc pl-5 mt-3 flex flex-col gap-1.5 text-gray-600">
              <li>You must be at least 18 years old to use this website.</li>
              <li>You agree not to use the website for any unlawful or prohibited purpose.</li>
              <li>You agree not to attempt to gain unauthorised access to any portion of this website or its related systems.</li>
            </ul>
          </Block>

          <Block title="3. Appointment Bookings">
            Appointment requests submitted through this website are subject to
            availability and confirmation by our administrative team. Submission
            of a booking form does not guarantee an appointment. OAUTHC reserves
            the right to reschedule or cancel appointments in accordance with
            clinical need.
          </Block>

          <Block title="4. Intellectual Property">
            All content on this website — including text, images, logos, and
            graphics — is the property of OAUTHC or its content suppliers and
            is protected by applicable intellectual property laws. You may not
            reproduce, distribute, or create derivative works without express
            written permission.
          </Block>

          <Block title="5. Third-Party Links">
            This website may contain links to third-party websites. OAUTHC does
            not endorse and is not responsible for the content, accuracy, or
            practices of any linked sites. Accessing third-party links is at
            your own risk.
          </Block>

          <Block title="6. Disclaimer of Warranties">
            This website is provided on an "as is" and "as available" basis
            without any warranties of any kind, either express or implied.
            OAUTHC does not warrant that the website will be uninterrupted,
            error-free, or free of viruses or other harmful components.
          </Block>

          <Block title="7. Limitation of Liability">
            To the maximum extent permitted by law, OAUTHC shall not be liable
            for any direct, indirect, incidental, or consequential damages
            arising out of your use of or inability to use this website.
          </Block>

          <Block title="8. Changes to These Terms">
            OAUTHC reserves the right to update these Terms of Service at any
            time. Continued use of the website after changes are posted
            constitutes your acceptance of the revised terms.
          </Block>

          <Block title="9. Governing Law">
            These terms are governed by the laws of the Federal Republic of
            Nigeria. Any disputes arising in connection with these terms shall
            be subject to the exclusive jurisdiction of the courts of Nigeria.
          </Block>

          <Block title="10. Contact">
            If you have questions about these Terms of Service, please contact
            us at{" "}
            <a
              href="mailto:info@oauthc.gov.ng"
              className="text-green-700 hover:underline"
            >
              info@oauthc.gov.ng
            </a>
            .
          </Block>
        </div>
      </section>
    </main>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <div className="text-gray-600 leading-relaxed">{children}</div>
    </div>
  );
}
