import { memo } from 'react'

function HeaderInner({ connectionStatus }) {
  const isActive = connectionStatus === 'connected'

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-dark px-10 py-3 bg-background-dark sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="size-8 text-primary">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              clipRule="evenodd"
              d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold leading-tight tracking-tight">
          Fruit Detection &amp; Nutrition
        </h2>
      </div>
      <div className="flex flex-1 justify-end gap-8">
        <nav className="flex items-center gap-9">
          <a className="text-sm font-medium hover:text-primary transition-colors" href="#">
            Dashboard
          </a>
          <a className="text-sm font-medium hover:text-primary transition-colors" href="#">
            History
          </a>
          <a className="text-sm font-medium hover:text-primary transition-colors" href="#">
            Settings
          </a>
        </nav>
        <button
          className={`flex min-w-[120px] items-center justify-center rounded-lg h-10 px-4 text-sm font-bold tracking-tight ${
            isActive
              ? 'bg-primary text-background-dark'
              : 'bg-border-dark text-white/60'
          }`}
        >
          <span className="truncate">
            System: {isActive ? 'Active' : 'Offline'}
          </span>
        </button>
      </div>
    </header>
  )
}

export const Header = memo(HeaderInner)
