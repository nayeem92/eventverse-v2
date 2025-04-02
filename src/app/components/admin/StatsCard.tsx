// import { FC } from 'react';

// interface StatsCardProps {
//   title: string;
//   value: string | number;
//   variant?: 'primary' | 'success' | 'danger';
//   subtitle?: string;
//   icon: React.ReactNode; // Add the icon property
// }

// const StatsCard: FC<StatsCardProps> = ({ title, value, variant, subtitle }) => {
//   const bgClass = variant ? `text-white bg-${variant}` : '';
  
//   return (
//     <div className={`card dashboard-card mb-4 w-full rounded-lg shadow-lg ${bgClass}`}>
//       <div className="card-body">
//         <h5 className="card-title text-xl font-semibold">{title}</h5>
//         <h2 className="card-text">{value}</h2>
//         {subtitle && <small>{subtitle}</small>}
//       </div>
//     </div>
//   );
// };

// export default StatsCard;
import { FC } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  variant?: 'primary' | 'success' | 'danger';
  subtitle?: string;
  icon: React.ReactNode;
}

const StatsCard: FC<StatsCardProps> = ({ title, value, variant, subtitle, icon }) => {
  // Set background color based on the variant
  let bgClass = '';
  switch (variant) {
    case 'primary':
      bgClass = 'bg-blue-600';
      break;
    case 'success':
      bgClass = 'bg-green-600';
      break;
    case 'danger':
      bgClass = 'bg-red-600';
      break;
    default:
      bgClass = 'bg-gray-200'; // fallback
  }

  return (
    <div
      className={`w-full p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ${bgClass} text-white`}
    >
      <div className="flex items-center space-x-4">
        <div className="text-4xl">{icon}</div>
        <div>
          <h5 className="text-2xl font-semibold">{title}</h5>
          <h2 className="text-3xl font-bold">{value}</h2>
          {subtitle && <small className="text-sm">{subtitle}</small>}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
