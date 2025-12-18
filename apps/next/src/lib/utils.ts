export async function getApi() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api`);
  const data: { message: string; version: string } = await response.json();
  return data;
}

getApi();
