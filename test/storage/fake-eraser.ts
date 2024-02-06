import { Eraser } from '@/domain/application/storage/eraser'

interface Erase {
  fileName: string
}

export class FakeEraser implements Eraser {
  public items: Erase[] = []

  async delete(fileName: string): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.fileName === fileName)

    if (itemIndex >= 0) {
      this.items.splice(itemIndex, 1)
    }
  }
}
