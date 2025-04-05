import Link from "next/link";

export default function Error() {
  return (
    <>
      <main className="grid min-h-full place-items-center bg-background px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            An error occurred
          </h1>
          <p className="mt-6 text-base leading-7 text-muted-foreground">
            Oops, something went wrong. Please try again later.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/"
              className="rounded-md bg-foreground px-3.5 py-2.5 text-sm font-semibold text-background hover:bg-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            >
              Go back to home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
