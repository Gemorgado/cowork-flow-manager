
import React, { useEffect, useState } from 'react';
import PlanCatalog from '@/components/services/catalog/PlanCatalog';
import { supabase } from "@/integrations/supabase/client";
import { Service } from '@/types';
import { services as mockServices } from '@/mock/services';

const Services = () => {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [loading, setLoading] = useState(true);

  // Fetch services from Supabase
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        // Fetch services
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .order('name');
        
        if (servicesError) {
          console.error('Error fetching services:', servicesError);
          return;
        }

        // Fetch benefits for each service
        const { data: benefitsData, error: benefitsError } = await supabase
          .from('service_benefits')
          .select(`
            service_id,
            benefit:benefit_id (id, name, description)
          `);
        
        if (benefitsError) {
          console.error('Error fetching benefits:', benefitsError);
          return;
        }

        // Fetch prices for each service
        const { data: pricesData, error: pricesError } = await supabase
          .from('plan_prices')
          .select('*')
          .order('price');
        
        if (pricesError) {
          console.error('Error fetching prices:', pricesError);
          return;
        }

        // Map benefits to services
        const benefitsByService = benefitsData?.reduce<Record<string, any[]>>((acc, item) => {
          if (!acc[item.service_id]) {
            acc[item.service_id] = [];
          }
          if (item.benefit) {
            acc[item.service_id].push(item.benefit);
          }
          return acc;
        }, {});

        // Map prices to services
        const pricesByService = pricesData?.reduce<Record<string, any[]>>((acc, price) => {
          if (!acc[price.service_id]) {
            acc[price.service_id] = [];
          }
          acc[price.service_id].push(price);
          return acc;
        }, {});

        // Combine data into services
        const mappedServices: Service[] = (servicesData || []).map(service => ({
          id: service.id,
          name: service.name,
          description: service.description,
          type: service.type,
          benefits: (benefitsByService?.[service.id] || []).map(benefit => ({
            id: benefit.id,
            name: benefit.name,
            description: benefit.description
          })),
          prices: (pricesByService?.[service.id] || []).map(price => ({
            id: price.id,
            serviceId: price.service_id,
            period: price.period,
            price: price.price,
            installments: price.installments || undefined,
            discount: price.discount || undefined
          }))
        }));

        // If we have mapped services, use them, otherwise fall back to mock data
        if (mappedServices.length > 0) {
          setServices(mappedServices);
        }
      } catch (error) {
        console.error('Error fetching services data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 dark:bg-white text-white dark:text-neutral-950">
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <PlanCatalog services={services} />
      )}
    </div>
  );
};

export default Services;
