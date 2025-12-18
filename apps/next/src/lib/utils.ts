export async function getApi() {
  const response = await fetch("/api");
  const data: { message: string; version: string } = await response.json();
  return data;
}

getApi();
