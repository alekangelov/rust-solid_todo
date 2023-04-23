// @refresh reload
import { Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import { createGlobalStyles } from "solid-styled-components";
import { TodoToaster } from "./components/toasts";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";

const GlobalStyles = createGlobalStyles`
  @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
 :root {
  --primary: #0094FF;
  --background: #F8F8F8;
  --surface: #fff;
  --on-surface: #000;
  --on-primary: #fff;
}

.dark:root {
  --primary: #0094FF;
  --background: #0c0c0c;
  --surface: #000;
  --on-surface: #fff;
  --on-primary: #fff;
} 
  body {
    font-family: "Inter Tight", sans-serif;
    margin: 0;
font-size: 14px;
    background: var(--background);
    padding: 0;
color: var(--on-surface);
  }

  * {
    box-sizing: border-box;
  }
`;

export default function Root() {
  const queryClient = new QueryClient();
  return (
    <Html lang="en">
      <Head>
        <Title>SolidStart - Bare</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <TodoToaster />
        <GlobalStyles />
        <Suspense>
          <QueryClientProvider client={queryClient}>
            <ErrorBoundary>
              <Routes>
                <FileRoutes />
              </Routes>
            </ErrorBoundary>
          </QueryClientProvider>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
