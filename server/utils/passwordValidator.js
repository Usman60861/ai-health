// Password strength validation utility

export const validatePassword = (password) => {
  const errors = [];
  const warnings = [];
  let strength = 0;

  // Minimum length check
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else {
    strength += 20;
  }

  // Maximum length check
  if (password.length > 128) {
    errors.push('Password must not exceed 128 characters');
  }

  // Uppercase letter check
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    strength += 20;
  }

  // Lowercase letter check
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    strength += 20;
  }

  // Number check
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    strength += 20;
  }

  // Special character check
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    warnings.push('Consider adding special characters for stronger password');
  } else {
    strength += 20;
  }

  // Additional strength bonuses
  if (password.length >= 12) {
    strength += 10;
  }
  if (password.length >= 16) {
    strength += 10;
  }

  // Common password patterns check
  const commonPatterns = [
    /^123456/,
    /password/i,
    /qwerty/i,
    /abc123/i,
    /admin/i,
    /letmein/i,
    /welcome/i,
    /monkey/i,
    /dragon/i,
    /master/i
  ];

  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      errors.push('Password contains common patterns. Please choose a more unique password');
      strength = Math.max(0, strength - 30);
      break;
    }
  }

  // Sequential characters check
  if (/(.)\1{2,}/.test(password)) {
    warnings.push('Avoid repeating characters');
    strength = Math.max(0, strength - 10);
  }

  // Determine strength level
  let strengthLevel = 'weak';
  if (strength >= 80) strengthLevel = 'strong';
  else if (strength >= 60) strengthLevel = 'medium';
  else if (strength >= 40) strengthLevel = 'fair';

  return {
    isValid: errors.length === 0,
    strength: Math.min(100, strength),
    strengthLevel,
    errors,
    warnings
  };
};

export const getPasswordRequirements = () => {
  return [
    'At least 8 characters long',
    'Contains uppercase letter (A-Z)',
    'Contains lowercase letter (a-z)',
    'Contains number (0-9)',
    'Special characters recommended (!@#$%^&*)'
  ];
};
