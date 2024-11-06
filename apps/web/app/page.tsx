import Schema from "@repo/schema/json";

export default function Home() {
  return (
    <div>
      {JSON.stringify(Schema)}
      <main>Hello World</main>
    </div>
  );
}
