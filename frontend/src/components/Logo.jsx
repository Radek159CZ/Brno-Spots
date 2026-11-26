// Minimal logo: the two spires of the Petrov cathedral in Brno.
// Drawn with `currentColor`, so its colour is set from CSS (`color: ...`).
// The same-colour stroke with round joins softens all the corners.
export default function Logo({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <g fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
        <path d="M5.5 21V10.5L8 2.5l2.5 8V21z" />
        <path d="M10.5 21v-5.5l1.5-2 1.5 2V21z" />
        <path d="M13.5 21V10.5l2.5-8 2.5 8V21z" />
      </g>
    </svg>
  )
}
