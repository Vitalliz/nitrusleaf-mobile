let exclusiveDepth = 0;

export function beginAuthProfileWrite(): void {
  exclusiveDepth += 1;
}

export function endAuthProfileWrite(): void {
  exclusiveDepth = Math.max(0, exclusiveDepth - 1);
}

export function isAuthProfileWriteInProgress(): boolean {
  return exclusiveDepth > 0;
}
