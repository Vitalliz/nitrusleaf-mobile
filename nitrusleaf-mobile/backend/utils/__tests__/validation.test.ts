import { validation } from "../validation";

describe("validation", () => {
  describe("isValidEmail", () => {
    it("aceita e-mail válido e rejeita inválido", () => {
      expect(validation.isValidEmail("user@nitrusleaf.com")).toBe(true);
      expect(validation.isValidEmail("invalido")).toBe(false);
    });
  });

  describe("isValidPassword", () => {
    it("exige no mínimo 6 caracteres", () => {
      expect(validation.isValidPassword("123456")).toBe(true);
      expect(validation.isValidPassword("12345")).toBe(false);
    });
  });

  describe("isValidName", () => {
    it("rejeita nomes com números", () => {
      expect(validation.isValidName("Maria")).toBe(true);
      expect(validation.isValidName("Ana2")).toBe(false);
    });
  });

  describe("formatPhone", () => {
    it("formata telefone brasileiro com 11 dígitos", () => {
      expect(validation.formatPhone("11987654321")).toBe("(11) 98765-4321");
    });
  });
});
