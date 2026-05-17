import { validation } from "../validation";

describe("validation", () => {
  it("valida e-mail", () => {
    expect(validation.isValidEmail("user@nitrusleaf.com")).toBe(true);
    expect(validation.isValidEmail("invalido")).toBe(false);
  });

  it("valida senha com mínimo de 6 caracteres", () => {
    expect(validation.isValidPassword("123456")).toBe(true);
    expect(validation.isValidPassword("12345")).toBe(false);
  });

  it("valida nome sem números", () => {
    expect(validation.isValidName("Maria")).toBe(true);
    expect(validation.isValidName("Ana2")).toBe(false);
  });

  it("formata telefone brasileiro com 11 dígitos", () => {
    expect(validation.formatPhone("11987654321")).toBe("(11) 98765-4321");
  });
});
