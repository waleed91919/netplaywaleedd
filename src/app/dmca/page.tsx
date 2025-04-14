export default function DMCAPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">DMCA Policy</h1>

      <div className="space-y-6 text-secondary-text">
        <section>
          <h2 className="text-xl font-semibold text-primary-text mb-3">Netplay DMCA Policy</h2>
          <p>
            Netplay respects the intellectual property rights of others and expects its users to do the same.
          </p>
          <p className="mt-2">
            In accordance with the Digital Millennium Copyright Act of 1998 ("DMCA"), we will respond expeditiously
            to claims of copyright infringement that are reported to the designated copyright agent identified below.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary-text mb-3">DMCA Notice of Alleged Infringement</h2>
          <p>
            If you believe that your copyrighted work has been copied in a way that constitutes copyright
            infringement and is accessible on Netplay, please notify our copyright agent as set forth
            in the DMCA. For your complaint to be valid under the DMCA, you must provide the following
            information when providing notice of the claimed copyright infringement:
          </p>

          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>
              A physical or electronic signature of a person authorized to act on behalf of the copyright owner.
            </li>
            <li>
              Identification of the copyrighted work claimed to have been infringed.
            </li>
            <li>
              Identification of the material that is claimed to be infringing or to be the subject of the
              infringing activity and that is to be removed or access to which is to be disabled, and
              information reasonably sufficient to permit Netplay to locate the material.
            </li>
            <li>
              Information reasonably sufficient to permit Netplay to contact the complaining party, such as
              an address, telephone number, and, if available, an electronic mail address.
            </li>
            <li>
              A statement that the complaining party has a good faith belief that use of the material in
              the manner complained of is not authorized by the copyright owner, its agent, or the law.
            </li>
            <li>
              A statement that the information in the notification is accurate, and under penalty of perjury,
              that the complaining party is authorized to act on behalf of the owner of an exclusive right
              that is allegedly infringed.
            </li>
          </ul>
        </section>

        <section>
          <p className="mb-3">
            The above information must be submitted as a written notification to the following Designated Agent:
          </p>

          <div className="p-4 bg-secondary-bg rounded-md">
            <p>Attn: DMCA Compliance</p>
            <p>Netplay Inc.</p>
            <p>Email: dmca@netplay.example.com</p>
          </div>

          <p className="mt-3">
            Please note that you may be liable for damages (including costs and attorneys' fees) if you
            materially misrepresent that material is infringing your copyright.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary-text mb-3">Counter-Notification</h2>
          <p>
            If you believe your material that was removed (or to which access was disabled) is not infringing,
            or that you have authorization from the copyright owner, the copyright owner's agent, or pursuant
            to the law, to upload and use the content in your material, you may send a counter-notification to
            the Designated Agent.
          </p>

          <p className="mt-2">
            A counter-notification must include the following:
          </p>

          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>
              Your physical or electronic signature.
            </li>
            <li>
              Identification of the material that has been removed or to which access has been disabled and
              the location at which the material appeared before it was removed or access to it was disabled.
            </li>
            <li>
              A statement under penalty of perjury that you have a good faith belief that the material was
              removed or disabled as a result of mistake or misidentification of the material to be removed
              or disabled.
            </li>
            <li>
              Your name, address, and telephone number, and a statement that you consent to the jurisdiction
              of the Federal District Court for the judicial district in which the address is located, or if
              your address is outside of the United States, for any judicial district in which Netplay may be
              found, and that you will accept service of process from the person who provided the DMCA
              notification or an agent of such person.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary-text mb-3">Policy Updates</h2>
          <p>
            Netplay reserves the right to update or modify this DMCA Policy at any time and from time to time
            without prior notice. Please review this policy periodically, and especially before you provide
            any information. Your continued use of the service after any changes to this policy will act as
            your acceptance of the changes.
          </p>
        </section>

        <div className="border-t border-border pt-6 mt-6">
          <p>Last Updated: March 2025</p>
        </div>
      </div>
    </div>
  );
}
