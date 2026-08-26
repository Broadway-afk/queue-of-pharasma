export function getDicebearAvatarUrl(seed: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`
}

export function resolvePawnImageUrl(pawn: {
  name: string
  imageUrl?: string
  generateAvatar?: boolean
}): string | undefined {
  const customUrl = pawn.imageUrl?.trim()
  if (customUrl) return customUrl

  if (pawn.generateAvatar !== false && pawn.name.trim()) {
    return getDicebearAvatarUrl(pawn.name.trim())
  }

  return undefined
}

export interface PawnFormData {
  name: string
  modifier: number
  maxHp: number
  ac: number
  imageUrl: string
  generateAvatar: boolean
}

export function preparePawnPayload(form: PawnFormData) {
  const customUrl = form.imageUrl.trim()

  return {
    name: form.name.trim(),
    modifier: form.modifier,
    maxHp: form.maxHp,
    ac: form.ac,
    imageUrl: customUrl || undefined,
    generateAvatar: customUrl ? false : form.generateAvatar
  }
}
