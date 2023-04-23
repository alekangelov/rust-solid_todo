import { Title } from "solid-start";
import { HttpStatusCode } from "solid-start/server";

export default function NotFound() {

  return (
    <div>
      <main class="main" >
        <Title>Not Found</Title>
        <HttpStatusCode code={404} />
        <h1>Page Not Found</h1>
      </main>
    </div>
  );
}
