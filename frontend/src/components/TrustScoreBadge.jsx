import React from 'react';
import { ShieldCheck } from 'lucide-react';

const TrustScoreBadge = ({ score = 75, showLabel = true }) => {
  let badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let iconColor = 'text-emerald-600';

  if (score < 80 && score >= 60) {
    badgeStyle = 'bg-sky-50 text-sky-800 border-sky-200';
    iconColor = 'text-sky-600';
  } else if (score < 60) {
    badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200';
    iconColor = 'text-amber-600';
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeStyle} shadow-2xs`}>
      <ShieldCheck className={`w-3.5 h-3.5 ${iconColor}`} />
      <span>{score}</span>
      {showLabel && <span className="text-slate-500 font-normal">/ 100 Trust</span>}
    </div>
  );
};

export default TrustScoreBadge;
