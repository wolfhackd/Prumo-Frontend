import type { Business } from "../establishments";
import Link from "next/link";
import { ArrowIcon, PinIcon } from "./search-icons";

type BusinessCardProps = {
  business: Business;
};

export default function BusinessCard({ business }: BusinessCardProps) {
  return (
    <article className="find-card">
      <div
        className={`find-card-art find-art-${business.tone}`}
        aria-hidden="true"
      >
        <span>{business.initials}</span>
        <i>✳</i>
      </div>
      <div className="find-card-main">
        <div className="find-card-title-row">
          <div>
            <span className="find-card-category">{business.category}</span>
            <h3>{business.name}</h3>
          </div>
          <span className="find-rating">
            <span aria-hidden="true">★</span> {business.rating}
          </span>
        </div>
        <p className="find-card-location">
          <PinIcon />
          {business.detail}
        </p>
        <div className="find-card-footer">
          <div className="find-service-summary">
            <span>Serviço em destaque</span>
            <strong>{business.service}</strong>
          </div>
          <div className="find-price">
            <strong>{business.price}</strong>
            <span>· {business.duration}</span>
          </div>
          <Link
            className="find-card-action"
            href={`/buscar/${encodeURIComponent(business.establishmentId ?? business.initials)}`}
          >
            Veja todos os serviços
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </article>
  );
}
