/**
 * Evita que uma Promise pendente deixe a UI em “loading infinito”.
 */
export function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  timeoutMessage = "A operação demorou demais. Verifique a conexão e tente de novo."
): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(timeoutMessage)), ms);
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      }
    );
  });
}
