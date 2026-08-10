export const validation = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPassword: (password: string): boolean => {
    return password.length >= 6;
  },

  isValidName: (name: string): boolean => {
    return name.trim().length >= 3 && !/\d/.test(name);
  },

  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^\(?(\d{2})\)?[\s-]?(\d{4,5})[\s-]?(\d{4})$/;
    return phoneRegex.test(phone.replace(/\D/g, ""));
  },

  formatPhone: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length !== 11) return phone;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  },

  isPasswordMatch: (password: string, confirmation: string): boolean => {
    return password === confirmation && password.length >= 6;
  },

  getPasswordStrength: (password: string): 0 | 1 | 2 => {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) strength++;

    return Math.min(strength, 2) as 0 | 1 | 2;
  },
};
