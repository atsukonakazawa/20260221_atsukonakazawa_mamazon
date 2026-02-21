// app/page.js
export default function Page() {
  console.log('NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL);

  return (
    <div>
      <h1>ああHello Next.js (App Router)</h1>
      <p>API URL: {process.env.NEXT_PUBLIC_API_BASE_URL}</p>
    </div>
  );
}
