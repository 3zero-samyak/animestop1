import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ShippingPage() {
  return (
    <>
      <Header />
      <main>
        <article className="interior-page">
          <h1 className="interior-page-title">Shipping & Delivery</h1>
          
          <p className="interior-page-intro">
            Shipping information will apply when AnimeStop enables physical collection orders.
          </p>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">ORDER PREPARATION</h2>
            <p>
              Preparation time will depend on the specific item and its finishing requirements. Each build is treated with care to ensure it meets AnimeStop quality standards.
            </p>
          </section>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">DELIVERY LOCATIONS</h2>
            <p>
              Delivery availability will depend on location and carrier support. Initial launches may be limited to specific regions while we establish reliable fulfillment partnerships.
            </p>
          </section>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">SHIPPING CHARGES</h2>
            <p>
              Shipping costs will depend on destination, size, weight, and order value. Specific rates will be confirmed at checkout when commerce is enabled.
            </p>
          </section>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">TRACKING</h2>
            <p>
              Tracking information will be supplied when supported by the carrier. You will receive updates as your order moves through preparation and shipping stages.
            </p>
          </section>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">DELIVERY INSPECTION</h2>
            <p>
              We recommend inspecting the package condition upon delivery. If the outer packaging appears damaged, note it with the carrier and contact AnimeStop support.
            </p>
          </section>

          <section className="interior-page-section">
            <h2 className="interior-page-section-title">DELAYED OR UNDELIVERED ORDERS</h2>
            <p>
              For concerns about shipping delays or delivery issues, contact AnimeStop support. We will work with carriers to resolve delivery challenges.
            </p>
          </section>

          <div className="interior-page-links">
            <Link href="/contact" className="interior-page-link">
              Contact AnimeStop
              <ArrowRight size={18} />
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
