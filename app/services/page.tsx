"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

const EASE = [0.22, 1, 0.36, 1] as const;

interface Service {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  image: { url: string };
  applicableFor: string[];
  features: string[];
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/services")
      .then(({ data }) => {
        const list =
          data?.data?.services ??
          (Array.isArray(data?.data) ? data.data : []);
        setServices(Array.isArray(list) ? list : []);
      })
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-charcoal px-5 pb-16 pt-36 md:px-10 lg:px-16">
        <div className="mx-auto max-w-[1480px]">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
            <p className="section-label text-champagne">What We Offer</p>
            <h1 className="section-title text-ivory">Our <em>Services.</em></h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-ivory/60">
              From product selection to professional installation, A4LIGHTS provides end-to-end support for every lighting project.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-[1480px] px-5 py-20 md:px-10 lg:px-16">
        {loading ? (
          <div className="space-y-20">
            {[0, 1, 2].map((i) => (
              <div key={i} className="grid gap-14 lg:grid-cols-2">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="space-y-4 py-6">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <EmptyState title="Services coming soon" description="Our team is preparing our service offerings. Check back shortly." />
        ) : (
          <div className="space-y-28">
            {(Array.isArray(services) ? services : []).map((service, index) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: EASE }}
                className={`grid gap-14 lg:grid-cols-2 ${index % 2 === 1 ? "lg:grid-flow-dense" : ""}`}
              >
                {/* Image */}
                <div className={`aspect-[4/3] overflow-hidden bg-muted ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                  {service.image?.url ? (
                    <img src={service.image.url} alt={service.title}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]" />
                  ) : (
                    <div className="h-full w-full bg-muted" />
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center">
                  {service.applicableFor.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {service.applicableFor.map((tag) => (
                        <span key={tag} className="border border-gold/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold">{tag}</span>
                      ))}
                    </div>
                  )}
                  <p className="section-label">Service</p>
                  <h2 className="font-serif text-4xl text-foreground">{service.title}</h2>
                  <p className="mt-5 text-sm leading-7 text-muted-foreground">{service.description}</p>

                  {service.features.length > 0 && (
                    <ul className="mt-6 space-y-3">
                      {service.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-sm text-foreground/80">
                          <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-gold" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-8">
                    <a href="#contact"
                      className="group inline-flex items-center gap-3 border-b border-foreground pb-1 text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:border-gold hover:text-gold">
                      <span>Request This Service</span>
                      <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
