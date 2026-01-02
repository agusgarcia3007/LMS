export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Tenant Not Found</h1>
      <p className="mt-4 text-muted-foreground">
        The requested tenant could not be found.
      </p>
    </div>
  );
}
