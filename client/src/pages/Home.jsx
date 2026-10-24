import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <main className="grid min-h-svh place-items-center bg-[#f7f2e9] px-8 text-center text-[#26302a]">
      <div className="max-w-sm">
        <p className="text-xs tracking-[0.3em] text-[#b08d57] uppercase">Digital Wedding Invitations</p>
        <h1 className="mt-4 font-serif text-4xl">Every couple, their own link.</h1>
        <p className="mt-4 text-sm text-[#5d675f]">
          Guests open their invitation from the personal link they received. Try the demos:
        </p>
        <div className="mt-6 flex justify-center gap-4 text-sm underline underline-offset-4">
          <Link to="/i/demo01">Design v1</Link>
          <Link to="/i/demo02">Design v2</Link>
          <Link to="/admin">Admin</Link>
        </div>
      </div>
    </main>
  )
}
