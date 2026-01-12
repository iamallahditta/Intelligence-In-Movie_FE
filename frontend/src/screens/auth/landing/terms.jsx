import Footer from "../../../components/landing/home/footer";
import Navbar from "../../../components/landing/navbar";
import React from "react";

const Terms = () => {
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
              Terms & Conditions
            </h1>
            <p className="text-white font-medium text-sm">
              Please read these terms carefully before using our platform
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
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                By accessing and using Vocalli AI ("the Platform", "we", "us", or "our"), 
                you accept and agree to be bound by these Terms and Conditions. If you do not 
                agree to these terms, please do not use our services. These terms apply to all 
                users, including healthcare professionals, medical practitioners, and any other 
                individuals or entities accessing the Platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text_black mb-4">
                2. Description of Service
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                Vocalli AI is an AI-powered medical documentation platform designed to assist 
                healthcare professionals in transcribing, organizing, and managing patient-provider 
                conversations. Our service includes real-time transcription, AI-powered summarization, 
                and integration capabilities with Electronic Health Record (EHR) systems. The Platform 
                is intended for use by licensed healthcare professionals and medical institutions only.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text_black mb-4">
                3. User Accounts and Registration
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                To access certain features of the Platform, you must create an account. You agree to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 font-light space-y-2">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Verify your professional credentials as required by the Platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text_black mb-4">
                4. Medical and Professional Use
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                The Platform is designed for use by licensed healthcare professionals. By using 
                Vocalli AI, you acknowledge and agree that:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 font-light space-y-2">
                <li>You are a licensed healthcare professional or authorized to use the Platform on behalf of a licensed professional</li>
                <li>You will use the Platform in compliance with all applicable medical, legal, and regulatory requirements</li>
                <li>You are solely responsible for the accuracy and completeness of all medical documentation</li>
                <li>The Platform serves as a documentation tool and does not replace professional medical judgment</li>
                <li>You will review and verify all AI-generated content before use in patient care</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text_black mb-4">
                5. Patient Data and Privacy
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                The protection of patient information is of utmost importance. You agree to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 font-light space-y-2">
                <li>Comply with all applicable privacy laws, including HIPAA, when using the Platform</li>
                <li>Obtain necessary patient consents before recording or transcribing patient conversations</li>
                <li>Use the Platform only for authorized medical documentation purposes</li>
                <li>Not share, disclose, or misuse patient information obtained through the Platform</li>
                <li>Report any suspected data breaches or security incidents immediately</li>
              </ul>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                Our Privacy Policy, which is incorporated by reference, provides detailed information 
                about how we collect, use, and protect patient data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text_black mb-4">
                6. Intellectual Property Rights
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                All content, features, and functionality of the Platform, including but not limited 
                to text, graphics, logos, software, and AI algorithms, are owned by Vocalli AI or its 
                licensors and are protected by copyright, trademark, and other intellectual property laws. 
                You may not reproduce, distribute, modify, or create derivative works from any content 
                without our express written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text_black mb-4">
                7. User-Generated Content
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                You retain ownership of all content you create, upload, or generate using the Platform. 
                However, by using the Platform, you grant us a limited, non-exclusive license to use, 
                process, and store your content solely for the purpose of providing and improving our 
                services. You represent and warrant that you have all necessary rights to grant this license.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text_black mb-4">
                8. Prohibited Uses
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                You agree not to use the Platform:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 font-light space-y-2">
                <li>For any unlawful purpose or in violation of any applicable laws or regulations</li>
                <li>To transmit any malicious code, viruses, or harmful software</li>
                <li>To attempt to gain unauthorized access to any part of the Platform</li>
                <li>To interfere with or disrupt the Platform's operation or security</li>
                <li>To impersonate any person or entity or misrepresent your affiliation</li>
                <li>To use automated systems to access the Platform without authorization</li>
                <li>To reverse engineer, decompile, or disassemble any part of the Platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text_black mb-4">
                9. Subscription and Payment Terms
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                Certain features of the Platform may require a paid subscription. By subscribing, you agree to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 font-light space-y-2">
                <li>Pay all fees associated with your subscription plan</li>
                <li>Automatic renewal of your subscription unless cancelled</li>
                <li>Price changes with at least 30 days' notice</li>
                <li>No refunds for partial subscription periods unless required by law</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text_black mb-4">
                10. Disclaimers and Limitations of Liability
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
                EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, 
                ERROR-FREE, OR COMPLETELY SECURE. AI-GENERATED CONTENT MAY CONTAIN ERRORS AND MUST BE 
                REVIEWED AND VERIFIED BY LICENSED HEALTHCARE PROFESSIONALS.
              </p>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, VOCALLI AI SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE PLATFORM.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text_black mb-4">
                11. Indemnification
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                You agree to indemnify, defend, and hold harmless Vocalli AI, its officers, directors, 
                employees, and agents from any claims, damages, losses, liabilities, and expenses 
                (including legal fees) arising from your use of the Platform, violation of these Terms, 
                or infringement of any rights of another party.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text_black mb-4">
                12. Termination
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                We reserve the right to suspend or terminate your account and access to the Platform 
                at any time, with or without cause or notice, for any reason including violation of 
                these Terms. Upon termination, your right to use the Platform will immediately cease, 
                and we may delete your account and data in accordance with our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text_black mb-4">
                13. Changes to Terms
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of 
                material changes via email or through the Platform. Your continued use of the Platform 
                after such modifications constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text_black mb-4">
                14. Governing Law and Dispute Resolution
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                These Terms shall be governed by and construed in accordance with applicable laws. 
                Any disputes arising from these Terms or your use of the Platform shall be resolved 
                through binding arbitration in accordance with the rules of the applicable arbitration 
                association, except where prohibited by law.
              </p>
            </section>

            {/* <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text_black mb-4">
                15. Contact Information
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                <strong>Email:</strong> legal@vocalliai.com<br />
                <strong>Address:</strong> [Company Address]<br />
                <strong>Phone:</strong> [Contact Number]
              </p>
            </section> */}

            <div className="mt-10 p-6 bg-light_blue rounded-lg">
              <p className="text-sm text-gray-700 font-light">
                By using Vocalli AI, you acknowledge that you have read, understood, and agree to 
                be bound by these Terms and Conditions. If you do not agree to these terms, please 
                discontinue use of the Platform immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
