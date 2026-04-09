import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="panel max-w-lg p-8 text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-[-0.05em]">
          Partida nao encontrada
        </h1>
        <p className="mt-3 text-sm text-muted">
          O identificador pedido nao existe na camada demo atual.
        </p>
        <Link href="/" className="accent-button mt-6 px-5 py-3 text-sm">
          Voltar para a agenda
        </Link>
      </div>
    </div>
  );
}

