export const metadata = {
  title: "Privacy Policy | OAUTHC",
  description:
    "Learn how OAUTHC collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="w-full bg-white">
      {/* Hero */}
      <section className="bg-green-900 py-20 px-6 md:px-12 text-white">
        <div className="max-w-7xl mx-auto">
          <p className="uppercase text-sm font-semibold tracking-wide text-green-300">
            Legal
          </p>
          <h1 className="text-3xl md:text-5xl font-bold font-yeseva mt-2">
            Privacy Policy
          </h1>
          <p className="mt-3 text-green-200 text-sm">Last updated: March 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">

          <Block title="1. Introduction">
            The Obafemi Awolowo University Teaching Hospitals Complex (OAUTHC)
            is committed to protecting your personal information. This Privacy
            Policy explains how we collect, use, store, and safeguard data when
            you interact with our website and services.
          </Block>

          <Block title="2. Information We Collect">
            <p>We may collect the following categories of information:</p>
            <ul className="list-disc pl-5 mt-3 flex flex-col gap-1.5 text-gray-600">
              <li><strong className="text-gray-800">Personal identification:</strong> Name, email address, phone number, gender.</li>
              <li><strong className="text-gray-800">Appointment data:</strong> Preferred dates, times, patient type, and any notes you provide when booking.</li>
              <li><strong className="text-gray-800">Newsletter data:</strong> Email address submitted for subscription.</li>
              <li><strong className="text-gray-800">Technical data:</strong> IP address, browser type, pages visited, and cookies (see Section 7).</li>
            </ul>
          </Block>

          <Block title="3. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-5 mt-3 flex flex-col gap-1.5 text-gray-600">
              <li>Process and confirm appointment bookings.</li>
              <li>Send health news and updates (newsletter subscribers only).</li>
              <li>Improve the functionality and content of our website.</li>
              <li>Comply with legal and regulatory obligations.</li>
              <li>Respond to enquiries and provide patient support.</li>
            </ul>
          </Block>

          <Block title="4. Legal Basis for Processing">
            We process your personal data on the following legal bases:
            performance of a contract (appointment bookings), legitimate
            interests (website improvement), consent (newsletter), and
            compliance with legal obligations.
          </Block>

          <Block title="5. Sharing of Information">
            <p>
              OAUTHC does not sell, trade, or rent your personal information to
              third parties. We may share data with:
            </p>
            <ul className="list-disc pl-5 mt-3 flex flex-col gap-1.5 text-gray-600">
              <li>Service providers who assist in operating our website (under strict confidentiality agreements).</li>
              <li>Government or regulatory authorities where required by law.</li>
              <li>Clinical staff within OAUTHC directly involved in your care.</li>
            </ul>
          </Block>

          <Block title="6. Data Retention">
            We retain personal data only as long as necessary for the purpose
            it was collected, or as required by applicable Nigerian law.
            Appointment records are retained in line with national health
            records management guidelines.
          </Block>

          <Block title="7. Cookies">
            Our website uses cookies to enhance your browsing experience.
            Cookies are small text files stored on your device. You may disable
            cookies through your browser settings; however, some features of
            the website may not function as intended.
          </Block>

          <Block title="8. Your Rights">
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 mt-3 flex flex-col gap-1.5 text-gray-600">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate information.</li>
              <li>Request deletion of your data where there is no lawful reason to continue processing it.</li>
              <li>Withdraw consent at any time (e.g. unsubscribe from newsletter).</li>
              <li>Lodge a complaint with the relevant data protection authority.</li>
            </ul>
          </Block>

          <Block title="9. Security">
            We implement appropriate technical and organisational measures to
            protect your personal data against unauthorised access, alteration,
            disclosure, or destruction. However, no internet transmission is
            completely secure, and we cannot guarantee absolute security.
          </Block>

          <Block title="10. Changes to This Policy">
            OAUTHC may update this Privacy Policy periodically. We will notify
            users of material changes by posting the updated policy on this page
            with a revised date. Continued use of the website constitutes
            acceptance of the updated policy.
          </Block>

          <Block title="11. Contact Us">
            For questions, data access requests, or concerns regarding this
            Privacy Policy, please contact{" "}
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
