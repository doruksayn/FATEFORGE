export type ToolRoute = 'character' | 'names'

export function getToolFromHash(hash: string): ToolRoute {
  return hash === '#/names' ? 'names' : 'character'
}
