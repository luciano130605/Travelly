type IconName =
  | 'plane'
  | 'weather'
  | 'visa'
  | 'transport'
  | 'act'
  | 'pack'
  | 'money'
  | 'check'

const PATHS: Record<IconName, string> = {
  plane: 'M2 13l20-8-6 16-4-6-10-2zM12 15l10-10',
  weather: 'M7 18a4 4 0 010-8 5 5 0 019.6 1A3.5 3.5 0 0116.5 18H7z',
  visa: 'M5 3h14v18H5zM9 8h6M9 12h6M9 16h3',
  transport: 'M5 4h14v12H5zM5 11h14M8 20l1-4M16 20l-1-4',
  act: 'M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11zM12 7v6',
  pack: 'M6 8h12v12H6zM9 8V5h6v3M6 13h12',
  money: 'M3 7h18v10H3zM12 9.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z',
  check: 'M5 12l5 5 9-10',
}

interface IconProps {
  name: IconName
  size?: number
  stroke?: string
  strokeWidth?: number
}

export default function Icon({
  name,
  size = 20,
  stroke = 'currentColor',
  strokeWidth = 1.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
