export type ToolRoute = 'character' | 'names' | 'status'

export function getToolFromHash(hash: string): ToolRoute {
  if (hash === '#/names') return 'names'
  return hash === '#/status' ? 'status' : 'character'
}
