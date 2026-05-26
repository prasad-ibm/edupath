import { useSession } from '../../hooks/useSession';

export default function SaveSessionButton() {
  const { session, isSaving, save } = useSession();

  if (!session) return null;

  return (
    <button
      onClick={save}
      disabled={isSaving}
      className={`
        fixed bottom-6 right-6 z-50
        flex items-center gap-2
        px-4 py-2.5 rounded-full
        font-semibold text-sm text-white shadow-lg
        transition-all duration-200
        ${isSaving
          ? 'bg-green-400 cursor-not-allowed opacity-70'
          : 'bg-green-500 hover:bg-green-600 active:scale-95 cursor-pointer'}
      `}
      aria-label="Save session"
    >
      {isSaving ? (
        <>
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Saving…
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 3v4H8V3M12 11v6m-3-3h6" />
          </svg>
          Save Session
        </>
      )}
    </button>
  );
}
