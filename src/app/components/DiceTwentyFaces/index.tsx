type DiceIconProps = {
  size?: number // tamanho em rem (ex: 4 = 4rem)
  className?: string
}

export default function DiceIcon({ size = 4, className = '' }: DiceIconProps) {
  return (
    <img
      src="/icons/dice-twenty-faces-twenty.png"
      alt="D20"
      style={{ width: `${size}rem`, height: `${size}rem` }}
      className={className}
    />
  )
}
