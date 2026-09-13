export const FAILURE_RATE = 0.2;

export function isSimulatedFailure(): boolean {
  return Math.random() < FAILURE_RATE;
}