export function InviteLoading() {
  return (
    <div className="grid min-h-svh place-items-center bg-[#f7f2e9]" role="status" aria-label="Loading invitation">
      <div className="size-10 animate-spin rounded-full border border-[#b08d57]/30 border-t-[#b08d57]" />
    </div>
  )
}

export function InviteMessage({ title, body }) {
  return (
    <div className="grid min-h-svh place-items-center bg-[#f7f2e9] px-8 text-center text-[#26302a]">
      <div className="max-w-sm">
        <p className="text-xs tracking-[0.3em] text-[#b08d57] uppercase">Wedding Invitation</p>
        <h1 className="mt-4 font-serif text-3xl">{title}</h1>
        <p className="mt-3 text-sm text-[#5d675f]">{body}</p>
      </div>
    </div>
  )
}
