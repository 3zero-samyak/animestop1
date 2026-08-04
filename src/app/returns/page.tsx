import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <>
      <Header />
      <main>
        <article className="interior-page">
          <h1 className="interior-page-title">Returns & Exchanges</h1>
          
          <p className="interior-page-intro">
            Final return and exchange terms will be confirmed before physical AnimeStop collections become available.
          </p>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">ELIGIBLE REQUESTS</h2>
            <p>
              Future eligibility will depend on item condition, reason for request, and the time since original delivery. Detailed policies will be published when collections launch.
            </p>
          </section>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">DAMAGED OR INCORRECT ITEMS</h2>
            <p>
              Items that arrive damaged or incorrect should be reported as soon as possible. We will work with you to resolve the issue through replacement or refund.
            </p>
          </section>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">RETURNED ITEM CONDITION</h2>
            <p>
              Returns will generally require items to be in original condition with original packaging. Specific requirements will be clarified in the final policy.
            </p>
          </section>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">NON-ELIGIBLE REQUESTS</h2>
            <p>
              Certain items may not be eligible for return based on customization, limited availability, or other factors. These exceptions will be clearly communicated at the time of purchase.
            </p>
          </section>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">EXCHANGE REVIEW</h2>
            <p>
              Exchange requests will be reviewed based on availability and the original reason for return. Approval is not guaranteed for all requests.
            </p>
          </section>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">REFUND PROCESS</h2>
            <p>
              Refund timing and methods will depend on the original payment method and processing requirements. Specific timelines will be provided in the final policy.
            </p>
          </section>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">REQUESTING SUPPORT</h2>
            <p>
              For questions about returns or exchanges, contact AnimeStop support through the contact page.
            </p>
          </section>

          <div className="interior-page-links">
            <Link href="/contact" className="interior-page-link">
              Contact
              <ArrowRight size={18} />
            </Link>
            <Link href="/before-you-begin" className="interior-page-link">
              Before You Begin
              <ArrowRight size={18} />
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
