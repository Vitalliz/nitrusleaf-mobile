import { Redirect } from "expo-router";

/** Tela legada — cadastro de propriedade centralizado em add-property */
export default function RegisterProprietyRedirect() {
  return <Redirect href="/(tabs)/add-property" />;
}
