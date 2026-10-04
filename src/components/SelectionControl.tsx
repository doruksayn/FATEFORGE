import { RANDOM, type RandomOption } from '../types/character.ts'

export interface SelectionControlProps<T extends string> {
  id: string
  label: string
  value: RandomOption<T>
  options: readonly T[]
  disabled: boolean
  onChange: (value: RandomOption<T>) => void
}

export function SelectionControl<T extends string>({ id, label, value, options, disabled, onChange }: SelectionControlProps<T>) {
  const isRandom = value === RANDOM

  return (
    <label className={`selection-control${isRandom ? ' is-random' : ' is-locked'}`} htmlFor={id}>
      <span className="selection-label">{label}</span>
      <span className="select-wrap">
        <select id={id} value={value} disabled={disabled} aria-describedby={`${id}-state`} onChange={(event) => onChange(event.currentTarget.value as RandomOption<T>)}>
          <option value={RANDOM}>Random</option>
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </span>
      <span className="selection-state" id={`${id}-state`}>
        <span aria-hidden="true">{isRandom ? '◌' : '◆'}</span>
        {isRandom ? 'Chosen at random' : 'Locked'}
      </span>
    </label>
  )
}
