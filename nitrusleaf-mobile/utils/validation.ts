// Utilitários de validação

export const validation = {
  /**
   * Validar email
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validar senha (mínimo 6 caracteres)
   */
  isValidPassword: (password: string): boolean => {
    return password.length >= 6;
  },

  /**
   * Validar nome (mínimo 3 caracteres, sem números)
   */
  isValidName: (name: string): boolean => {
    return name.trim().length >= 3 && !/\d/.test(name);
  },

  /**
   * Validar telefone (formato brasileiro: (XX) XXXXX-XXXX)
   */
  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^\(?(\d{2})\)?[\s-]?(\d{4,5})[\s-]?(\d{4})$/;
    return phoneRegex.test(phone.replace(/\D/g, ""));
  },

  /**
   * Formatar telefone para (XX) XXXXX-XXXX
   */
  formatPhone: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length !== 11) return phone;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  },

  /**
   * Validar senhas iguais
   */
  isPasswordMatch: (password: string, confirmation: string): boolean => {
    return password === confirmation && password.length >= 6;
  },

  /**
   * Validar força da senha
   * 0 = fraca, 1 = média, 2 = forte
   */
  getPasswordStrength: (password: string): 0 | 1 | 2 => {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) strength++;

    return Math.min(strength, 2) as 0 | 1 | 2;
  },
};