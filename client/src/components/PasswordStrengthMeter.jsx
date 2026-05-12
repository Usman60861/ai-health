import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PasswordStrengthMeter({ password }) {
  const [strength, setStrength] = useState(0);
  const [strengthLevel, setStrengthLevel] = useState('weak');
  const [checks, setChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  useEffect(() => {
    if (!password) {
      setStrength(0);
      setStrengthLevel('weak');
      setChecks({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      });
      return;
    }

    let score = 0;
    const newChecks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    // Calculate score
    if (newChecks.length) score += 20;
    if (newChecks.uppercase) score += 20;
    if (newChecks.lowercase) score += 20;
    if (newChecks.number) score += 20;
    if (newChecks.special) score += 20;

    // Bonus for longer passwords
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;

    // Penalty for common patterns
    const commonPatterns = [/123456/, /password/i, /qwerty/i, /abc123/i];
    for (const pattern of commonPatterns) {
      if (pattern.test(password)) {
        score = Math.max(0, score - 30);
        break;
      }
    }

    setChecks(newChecks);
    setStrength(Math.min(100, score));

    // Determine level
    if (score >= 80) setStrengthLevel('strong');
    else if (score >= 60) setStrengthLevel('medium');
    else if (score >= 40) setStrengthLevel('fair');
    else setStrengthLevel('weak');
  }, [password]);

  const getColor = () => {
    switch (strengthLevel) {
      case 'strong': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'fair': return 'bg-orange-500';
      default: return 'bg-red-500';
    }
  };

  const getTextColor = () => {
    switch (strengthLevel) {
      case 'strong': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'fair': return 'text-orange-400';
      default: return 'text-red-400';
    }
  };

  if (!password) return null;

  return (
    <div className="mt-3 space-y-3">
      {/* Strength Bar */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-white/70 text-sm">Password Strength</span>
          <span className={`text-sm font-semibold ${getTextColor()}`}>
            {strengthLevel.charAt(0).toUpperCase() + strengthLevel.slice(1)}
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${strength}%` }}
            transition={{ duration: 0.3 }}
            className={`h-full ${getColor()}`}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-1">
        <CheckItem checked={checks.length} text="At least 8 characters" />
        <CheckItem checked={checks.uppercase} text="One uppercase letter (A-Z)" />
        <CheckItem checked={checks.lowercase} text="One lowercase letter (a-z)" />
        <CheckItem checked={checks.number} text="One number (0-9)" />
        <CheckItem checked={checks.special} text="One special character (!@#$%)" />
      </div>
    </div>
  );
}

function CheckItem({ checked, text }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
        checked ? 'bg-green-500' : 'bg-white/10'
      }`}>
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className={`text-sm ${checked ? 'text-white' : 'text-white/50'}`}>
        {text}
      </span>
    </div>
  );
}
