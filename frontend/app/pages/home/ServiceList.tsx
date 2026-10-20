import React from 'react';

interface ServiceListProps {
  services: string[];
  onSelectService: (service: string) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({ services, onSelectService }) => {
  if (!Array.isArray(services)) {
    return <div>No services available</div>;
  }

  return (
    <div>
      <h3>Services:</h3>
      <ul>
        {services.map(service => (
          <li key={service} onClick={() => onSelectService(service)} style={{ cursor: 'pointer' }}>
            {service}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceList;
