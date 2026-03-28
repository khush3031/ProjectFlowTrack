export default function ActivityIcon({ icon, color, size = 16 }) {
  let paths = null

  switch (icon) {
    case 'plus':
      paths = (
        <>
          <line x1="8" y1="3" x2="8" y2="13"/>
          <line x1="3" y1="8" x2="13" y2="8"/>
        </>
      )
      break
    case 'edit':
      paths = <path d="M11 2L14 5L5 14H2V11L11 2Z"/>
      break
    case 'trash':
      paths = (
        <>
          <polyline points="3,6 13,6"/>
          <path d="M5 6V14H11V6"/>
          <path d="M7 6V4H9V6"/>
        </>
      )
      break
    case 'status':
      paths = (
        <>
          <polyline points="1,4 1,1 4,1"/>
          <polyline points="15,12 15,15 12,15"/>
          <path d="M1 1 A7 7 0 0 1 14 8"/>
          <path d="M15 15 A7 7 0 0 1 2 8"/>
        </>
      )
      break
    case 'priority':
      paths = (
        <>
          <line x1="8" y1="2" x2="8" y2="10"/>
          <polyline points="5,5 8,2 11,5"/>
          <line x1="5" y1="12" x2="11" y2="12"/>
          <line x1="5" y1="14" x2="9" y2="14"/>
        </>
      )
      break
    case 'user':
      paths = (
        <>
          <circle cx="8" cy="5" r="3"/>
          <path d="M2 14 C2 11 5 9 8 9 C11 9 14 11 14 14"/>
        </>
      )
      break
    case 'calendar':
      paths = (
        <>
          <rect x="2" y="3" width="12" height="12" rx="1"/>
          <line x1="2" y1="7" x2="14" y2="7"/>
          <line x1="6" y1="1" x2="6" y2="5"/>
          <line x1="10" y1="1" x2="10" y2="5"/>
        </>
      )
      break
    case 'text':
      paths = (
        <>
          <line x1="3" y1="5" x2="13" y2="5"/>
          <line x1="3" y1="8" x2="13" y2="8"/>
          <line x1="3" y1="11" x2="9" y2="11"/>
        </>
      )
      break
    case 'comment':
      paths = (
        <path d="M14 10 C14 12 12 13 10 13 L6 13 L3 15 L3 13 C2 13 2 12 2 11 L2 6 C2 4 3 3 5 3 L11 3 C13 3 14 4 14 6 Z"/>
      )
      break
    default:
      paths = <circle cx="8" cy="8" r="4" />
  }

  return (
    <svg width={size} height={size} viewBox="0 0 16 16"
      fill="none" stroke={color} strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round">
      {paths}
    </svg>
  )
}
