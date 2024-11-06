import parser from "@repo/parser";
import Schema from "@repo/schema/json";
export default function Home() {
  return (
    <div>
      {parser()}
      {JSON.stringify(Schema)}
      <main>Hello World</main>
    </div>
  );
}
