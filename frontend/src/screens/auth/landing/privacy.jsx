import Footer from "../../../components/landing/home/footer";
import Navbar from "../../../components/landing/navbar";
import React from "react";

const Privacy = () => {
  return (
    <div>
      <Navbar />
      <div
        style={{ backgroundImage: `url('/assets/about/banner.svg')` }}
        className="max-w-[1440px] flex flex-col justify-center w-full h-[400px] md:h-[300px] mx-auto relative"
      >
        <div className="w-[90%] sm:w-[80%] mx-auto flex">
          <div className="flex flex-col justify-start items-center mr-auto">
            <h1 className="text-white text-3xl font-semibold mb-3 tracking-wide">
              Privacy Policy
            </h1>
            <p className="text-white font-medium text-sm">
              Your privacy and data security are our top priorities
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <p className="text-sm text-gray-600 mb-6">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text_black mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                Vocalli AI ("we", "us", or "our") is committed to protecting your privacy and the privacy 
                of your patients. This Privacy Policy explains how we collect, use, disclose, and safeguard 
                your information when you use our AI-powered medical documentation platform. Please read this 
                policy carefully to understand our practices regarding your data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text_black mb-4">
                2. Information We Collect
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                We collect information that you provide directly to us and information that is automatically 
                collected when you use our services:
              </p>
              <h3 className="text-xl font-semibold text-text_black mb-3 mt-4">
                2.1 Information You Provide
              </h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 font-light space-y-2">
                <li>Account information (name, email address, professional credentials)</li>
                <li>Patient information and medical records</li>
                <li>Audio recordings and transcriptions of patient-provider conversations</li>
                <li>Medical documentation and notes</li>
                <li>Payment and billing information</li>
                <li>Communication preferences and support requests</li>
              </ul>
              <h3 className="text-xl font-semibold text-text_black mb-3 mt-4">
                2.2 Automatically Collected Information
              </h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 font-light space-y-2">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, features used, time spent)</li>
                <li>Log files and error reports</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text_black mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 font-light space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process and transcribe audio recordings</li>
                <li>Generate and organize medical documentation</li>
                <li>Integrate with Electronic Health Record (EHR) systems</li>
                <li>Process payments and manage subscriptions</li>
                <li>Send you service updates, security alerts, and support messages</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Detect, prevent, and address technical issues and security threats</li>
                <li>Comply with legal obligations and enforce our Terms and Conditions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text_black mb-4">
                4. Patient Health Information (PHI) and HIPAA Compliance
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                We understand the critical importance of protecting Patient Health Information (PHI). 
                Our platform is designed to comply with the Health Insurance Portability and Accountability 
                Act (HIPAA) and other applicable healthcare privacy laws:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 font-light space-y-2">
                <li>All PHI is encrypted both in transit and at rest</li>
                <li>Access to PHI is restricted to authorized healthcare professionals only</li>
                <li>We maintain comprehensive audit logs of all data access and modifications</li>
                <li>We have implemented administrative, physical, and technical safeguards</li>
                <li>We enter into Business Associate Agreements (BAAs) with healthcare providers as required</li>
                <li>All employees and contractors are trained on HIPAA compliance requirements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text_black mb-4">
                5. Data Sharing and Disclosure
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information or patient data. We may share 
                information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 font-light space-y-2">
                <li><strong>With Your Consent:</strong> When you explicitly authorize us to share information</li>
                <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in operating our platform (all bound by confidentiality agreements)</li>
                <li><strong>EHR Integration:</strong> To integrate with Electronic Health Record systems as authorized by you</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets (with notice to users)</li>
                <li><strong>Protection of Rights:</strong> To protect our rights, property, or safety, or that of our users</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text_black mb-4">
                6. Data Security
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 font-light space-y-2">
                <li>End-to-end encryption for all data transmissions</li>
                <li>Encryption at rest for all stored data</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Multi-factor authentication for account access</li>
                <li>Secure data centers with physical access controls</li>
                <li>Regular backups and disaster recovery procedures</li>
                <li>Employee training on data security best practices</li>
              </ul>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                However, no method of transmission over the Internet or electronic storage is 100% secure. 
                While we strive to use commercially acceptable means to protect your information, we cannot 
                guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text_black mb-4">
                7. Data Retention
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                We retain your information for as long as necessary to provide our services and comply with 
                legal obligations. Specifically:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 font-light space-y-2">
                <li>Account information is retained while your account is active</li>
                <li>Patient records are retained in accordance with applicable healthcare record retention laws</li>
                <li>Audio recordings and transcriptions are retained as specified in your service agreement</li>
                <li>Upon account termination, we may retain certain information as required by law or for legitimate business purposes</li>
                <li>You may request deletion of your data subject to legal and contractual obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text_black mb-4">
                8. Your Rights and Choices
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                You have certain rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 font-light space-y-2">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your information (subject to legal requirements)</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Opt-Out:</strong> Opt-out of certain communications and data processing activities</li>
                <li><strong>Account Settings:</strong> Update your account preferences and privacy settings</li>
              </ul>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                To exercise these rights, please contact us using the information provided in the Contact 
                section below.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text_black mb-4">
                9. Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                We use cookies and similar tracking technologies to enhance your experience, analyze usage 
                patterns, and improve our services. You can control cookie preferences through your browser 
                settings, though this may affect certain features of our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text_black mb-4">
                10. Children's Privacy
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                Our services are intended for use by licensed healthcare professionals and are not directed 
                to individuals under the age of 18. We do not knowingly collect personal information from 
                children. If you believe we have inadvertently collected information from a child, please 
                contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text_black mb-4">
                11. International Data Transfers
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                Your information may be transferred to and processed in countries other than your country 
                of residence. We ensure that appropriate safeguards are in place to protect your information 
                in accordance with this Privacy Policy and applicable data protection laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text_black mb-4">
                12. Changes to This Privacy Policy
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices or 
                legal requirements. We will notify you of any material changes by posting the new Privacy Policy 
                on this page and updating the "Last Updated" date. We encourage you to review this policy 
                periodically.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text_black mb-4">
                13. Contact Information
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data 
                practices, please contact us at:
              </p>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                <strong>Email:</strong> support@vocalli.ai<br />
                <strong>Address:</strong> [Company Address]<br />
                <strong>Phone:</strong> [Contact Number]
              </p>
            </section>

            <div className="mt-10 p-6 bg-light_blue rounded-lg">
              <p className="text-sm text-gray-700 font-light">
                By using Vocalli AI, you acknowledge that you have read and understood this Privacy Policy. 
                Your continued use of our services constitutes acceptance of this policy and any updates to it.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
