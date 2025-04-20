// src/components/shared/StatusBadge.js
import { FiClock, FiCheckCircle, FiTruck } from 'react-icons/fi';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    preparing: { color: 'bg-yellow-100 text-yellow-800', icon: <FiClock className="mr-1" /> },
    'on-the-way': { color: 'bg-blue-100 text-blue-800', icon: <FiTruck className="mr-1" /> },
    delivered: { color: 'bg-green-100 text-green-800', icon: <FiCheckCircle className="mr-1" /> },
    processing: { color: 'bg-purple-100 text-purple-800', icon: <FiClock className="mr-1" /> }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[status]?.color || 'bg-gray-100 text-gray-800'}`}>
      {statusConfig[status]?.icon}
      {status.replace('-', ' ')}
    </span>
  );
};

export default StatusBadge;