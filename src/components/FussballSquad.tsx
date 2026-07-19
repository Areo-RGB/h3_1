export default function FussballSquad({ squadId = "e47da4e5-b91e-47a4-a8b9-0f87caf7118f" }: { squadId?: string }) {
  const workerUrl = "https://fussball-proxy.paziske.workers.dev";
  return (
    <iframe
      src={`${workerUrl}/widget/squad/${squadId}`}
      title="FUSSBALL.de Squad"
      loading="lazy"
      style={{ width: "100%", minHeight: "600px", border: "none" }}
    />
  );
}
