import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const ToxicityBadge = ({ label, isToxic }) => {
  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
        isToxic
          ? 'bg-red-100 text-red-700 border border-red-200'
          : 'bg-green-100 text-green-700 border border-green-200'
      }`}
    >
      {isToxic ? (
        <AlertTriangle className="h-4 w-4" />
      ) : (
        <CheckCircle className="h-4 w-4" />
      )}
      <span>
        {isToxic ? `Toxic to ${label}` : `Safe for ${label}`}
      </span>
    </div>
  );
};

export default ToxicityBadge;
