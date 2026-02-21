import { useParams } from 'react-router-dom';

export function PortfolioPage() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Portfolio: {slug ?? '—'}</h1>
      <p className="text-muted-foreground">Portfolio view placeholder for slug.</p>
    </div>
  );
}
