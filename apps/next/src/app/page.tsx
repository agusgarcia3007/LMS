export default async function Home() {
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL!);
  const { message, version } = await response.json();
  return (
    <div>
      <h1>{message}</h1>
      <p>{version}</p>
    </div>
  );
}
