import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | LiTreeLabStudios",
  description: "Terms of Service for LiTreeLabStudios AI Agent Platform.",
};

export default function TermsPage() {
  return (
    <div
      className="min-h-screen pb-20 font-mono text-xs"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div
          className="lit-box p-6 mb-8"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--bg-card)",
          }}
        >
          <div
            className="lit-header -mx-6 -mt-6 mb-4"
            style={{ color: "white" }}
          >
            📜 Terms of Service
          </div>
          <p className="text-[10px] opacity-60 uppercase tracking-widest">
            Last Updated: June 5, 2026 · Please Read Carefully
          </p>
        </div>

        <div className="space-y-8 text-xs leading-relaxed opacity-90">
          <section>
            <h2
              className="text-sm font-bold uppercase tracking-wider mb-2"
              style={{ color: "var(--header-color)" }}
            >
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the LiTreeLabStudios Platform, you agree to
              be bound by these Terms of Service. If you do not agree to all the
              terms and conditions, you may not access or use the Platform.
            </p>
          </section>

          <section>
            <h2
              className="text-sm font-bold uppercase tracking-wider mb-2"
              style={{ color: "var(--header-color)" }}
            >
              2. Description of Service
            </h2>
            <p className="mb-2">
              LiTreeLabStudios provides AI-powered tools and agents for
              creative, development, and productivity tasks, including but not
              limited to:
            </p>
            <ul className="list-disc pl-5 space-y-1 opacity-80">
              <li>AI image, video, and audio generation.</li>
              <li>Code assistance and software development tools.</li>
              <li>Agent orchestration and conversational AI.</li>
              <li>Marketplace listings and digital goods.</li>
            </ul>
          </section>

          <section>
            <h2
              className="text-sm font-bold uppercase tracking-wider mb-2"
              style={{ color: "var(--header-color)" }}
            >
              3. User Accounts
            </h2>
            <p className="mb-2">
              You may be required to create an account via Clerk authentication
              to access certain features. You are responsible for maintaining
              the confidentiality of your account credentials and for all
              activities that occur under your account.
            </p>
            <ul className="list-disc pl-5 space-y-1 opacity-80">
              <li>You must provide accurate and complete information.</li>
              <li>You are responsible for all content you create or share.</li>
              <li>
                You must not share account access with unauthorized users.
              </li>
            </ul>
          </section>

          <section>
            <h2
              className="text-sm font-bold uppercase tracking-wider mb-2"
              style={{ color: "var(--header-color)" }}
            >
              4. Acceptable Use
            </h2>
            <p className="mb-2">
              You agree not to use the Platform to create, generate, distribute,
              or facilitate:
            </p>
            <ul className="list-disc pl-5 space-y-1 opacity-80">
              <li>Illegal, harmful, or infringing content.</li>
              <li>Malware, exploits, or security vulnerabilities.</li>
              <li>Harassment, hate speech, or abusive behavior.</li>
              <li>Unauthorized scraping, spam, or automated abuse.</li>
              <li>
                Content that violates third-party intellectual property rights.
              </li>
            </ul>
          </section>

          <section>
            <h2
              className="text-sm font-bold uppercase tracking-wider mb-2"
              style={{ color: "var(--header-color)" }}
            >
              5. Intellectual Property
            </h2>
            <p>
              You retain ownership of content you create using the Platform.
              LiTreeLabStudios retains ownership of the Platform, its underlying
              software, designs, trademarks, and proprietary AI systems. You are
              granted a limited, non-exclusive license to use the Platform in
              accordance with these Terms.
            </p>
          </section>

          <section>
            <h2
              className="text-sm font-bold uppercase tracking-wider mb-2"
              style={{ color: "var(--header-color)" }}
            >
              6. Payments and LiTBit Coins
            </h2>
            <p>
              Some features or marketplace items may require payment or the use
              of LiTBit Coins. All transactions are processed through Stripe or
              our internal credit system. Prices are subject to change. Refunds
              are handled on a case-by-case basis.
            </p>
          </section>

          <section>
            <h2
              className="text-sm font-bold uppercase tracking-wider mb-2"
              style={{ color: "var(--header-color)" }}
            >
              7. Termination
            </h2>
            <p>
              We may suspend or terminate your access at any time, without prior
              notice, for conduct that we believe violates these Terms or is
              harmful to other users, the Platform, or third parties. You may
              terminate your account by contacting support.
            </p>
          </section>

          <section>
            <h2
              className="text-sm font-bold uppercase tracking-wider mb-2"
              style={{ color: "var(--header-color)" }}
            >
              8. Disclaimer of Warranties
            </h2>
            <p>
              The Platform is provided on an &quot;as-is&quot; and
              &quot;as-available&quot; basis. We make no warranties, express or
              implied, regarding the reliability, accuracy, or availability of
              the Platform or any AI-generated output.
            </p>
          </section>

          <section>
            <h2
              className="text-sm font-bold uppercase tracking-wider mb-2"
              style={{ color: "var(--header-color)" }}
            >
              9. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, LiTreeLabStudios shall not
              be liable for any indirect, incidental, special, consequential, or
              punitive damages arising from your use of the Platform.
            </p>
          </section>

          <section>
            <h2
              className="text-sm font-bold uppercase tracking-wider mb-2"
              style={{ color: "var(--header-color)" }}
            >
              10. Changes to Terms
            </h2>
            <p>
              We may update these Terms from time to time. Continued use of the
              Platform after changes constitutes acceptance of the revised
              Terms. We will notify users of material changes by posting the new
              Terms on this page.
            </p>
          </section>

          <section>
            <h2
              className="text-sm font-bold uppercase tracking-wider mb-2"
              style={{ color: "var(--header-color)" }}
            >
              11. Contact Us
            </h2>
            <p>
              If you have any questions about these Terms, please contact us at
              support@litlabs.net.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
