export interface Eraser {
  delete(fileName: string): Promise<void>
}
