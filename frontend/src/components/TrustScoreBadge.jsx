import React from 'react';
import { ShieldCheck } from 'lucide-react';

const TrustScoreBadge = ({ score = 75, showLabel = true }) => {
  let badgeStyle = 'bg-indigo-50 text-indigo-800 border-indigo-200/80';
  let iconColor = 'text-indigo-600';

  if (score < 80 && score >= 60) {
    badgeStyle = 'bg-purple-50 text-purple-800 border-purple-200/80';
    iconColor = 'text-purple-600';
  } else if (score < 60) {
    badgeStyle = 'bg-rose-50 text-rose-800 border-rose-200/80';
    iconColor = 'text-rose-600';
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeStyle} shadow-xs`}>
      <ShieldCheck className={`w-3.5 h-3.5 ${iconColor}`} />
      <span>{score}</span>
      {showLabel && <span className="opacity-75 font-normal">/ 100 Trust</span>}
    </div>
  );
};

export default TrustScoreBadge;
