type Props = {
  className?: string
  size?: number
}

export function PublicationsLogo({ className, size = 36 }: Props) {
  return (
    <img
      className={className}
      src="/publications-logo.svg"
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
    />
  )
}
