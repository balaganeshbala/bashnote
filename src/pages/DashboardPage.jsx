import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto pt-16 text-center space-y-6">
      <h1 className="text-3xl font-bold text-white">Welcome back, {user?.displayName?.split(" ")[0]}.</h1>
      <p className="text-gray-400 max-w-md mx-auto">
        BashNote is your private vault for storing important personal information — bank details, documents, credentials, and anything else you want to keep organised and within reach.
      </p>

      <div className="flex justify-center pt-4">
        <VaultIllustration />
      </div>
    </div>
  );
}

function VaultIllustration() {
  return (
    <svg width="320" height="240" viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background glow */}
      <ellipse cx="160" cy="200" rx="120" ry="16" fill="#4f6ef7" fillOpacity="0.08" />

      {/* Bottom card */}
      <rect x="48" y="100" width="224" height="120" rx="12" fill="#1e2235" stroke="#2d3555" strokeWidth="1.5" />

      {/* Middle card */}
      <rect x="36" y="82" width="224" height="120" rx="12" fill="#222840" stroke="#353d60" strokeWidth="1.5" />

      {/* Top card (main) */}
      <rect x="24" y="64" width="224" height="120" rx="12" fill="#262d4a" stroke="#3b4470" strokeWidth="1.5" />

      {/* Card header bar */}
      <rect x="24" y="64" width="224" height="36" rx="12" fill="#2e3660" />
      <rect x="24" y="88" width="224" height="12" fill="#2e3660" />

      {/* Header dots */}
      <circle cx="48" cy="82" r="5" fill="#4f6ef7" fillOpacity="0.7" />
      <circle cx="64" cy="82" r="5" fill="#4f6ef7" fillOpacity="0.4" />
      <circle cx="80" cy="82" r="5" fill="#4f6ef7" fillOpacity="0.2" />

      {/* Field rows */}
      {/* Row 1 */}
      <rect x="44" y="116" width="60" height="8" rx="4" fill="#3b4470" />
      <rect x="116" y="116" width="112" height="8" rx="4" fill="#4f6ef7" fillOpacity="0.5" />

      {/* Row 2 */}
      <rect x="44" y="136" width="60" height="8" rx="4" fill="#3b4470" />
      <rect x="116" y="136" width="80" height="8" rx="4" fill="#3b4470" />

      {/* Row 3 — sensitive (dots) */}
      <rect x="44" y="156" width="60" height="8" rx="4" fill="#3b4470" />
      <circle cx="120" cy="160" r="3" fill="#6b7280" />
      <circle cx="130" cy="160" r="3" fill="#6b7280" />
      <circle cx="140" cy="160" r="3" fill="#6b7280" />
      <circle cx="150" cy="160" r="3" fill="#6b7280" />
      <circle cx="160" cy="160" r="3" fill="#6b7280" />
      <circle cx="170" cy="160" r="3" fill="#6b7280" />

      {/* Lock icon — top right of card */}
      <rect x="210" y="72" width="22" height="20" rx="4" fill="#4f6ef7" fillOpacity="0.15" stroke="#4f6ef7" strokeWidth="1.2" />
      <path d="M216 72v-4a5 5 0 0 1 10 0v4" stroke="#4f6ef7" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="221" cy="80" r="2" fill="#4f6ef7" />
      <rect x="220" y="80" width="2" height="4" rx="1" fill="#4f6ef7" />
    </svg>
  );
}
