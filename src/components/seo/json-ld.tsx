/**
 * Renders a JSON-LD structured-data <script>. Server-safe (no client JS).
 * Static-export compatible — the script is emitted into the prerendered HTML.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
