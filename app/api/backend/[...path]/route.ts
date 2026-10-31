import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

const SESSION_COOKIE_NAME = "token";
const SESSION_MAX_AGE = 60 * 60;

async function proxyRequest(request: NextRequest, context: RouteContext) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiBaseUrl) {
    return Response.json(
      { message: "A URL da API não está configurada." },
      { status: 500 },
    );
  }

  const { path } = await context.params;
  const upstreamUrl = new URL(apiBaseUrl);
  upstreamUrl.pathname = `${upstreamUrl.pathname.replace(/\/$/, "")}/${path
    .map(encodeURIComponent)
    .join("/")}`;
  upstreamUrl.search = request.nextUrl.search;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("content-type", contentType);
  }

  const sessionToken = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (sessionToken) {
    headers.set("cookie", `${SESSION_COOKIE_NAME}=${sessionToken}`);
  }

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : await request.arrayBuffer(),
      cache: "no-store",
      signal: AbortSignal.timeout(60_000),
    });
  } catch {
    return Response.json(
      { message: "Não foi possível conectar à API. Tente novamente." },
      { status: 502 },
    );
  }

  const responseHeaders = new Headers();
  const upstreamContentType = upstreamResponse.headers.get("content-type");
  if (upstreamContentType) {
    responseHeaders.set("content-type", upstreamContentType);
  }
  responseHeaders.set("cache-control", "no-store");

  const isLoginRequest =
    request.method === "POST" && path.join("/") === "owner/login";
  if (isLoginRequest && upstreamResponse.ok) {
    const tokenCookie = upstreamResponse.headers
      .getSetCookie()
      .find((cookie) => cookie.startsWith(`${SESSION_COOKIE_NAME}=`));

    if (!tokenCookie) {
      return Response.json(
        { message: "A API não retornou o cookie da sessão." },
        { status: 502 },
      );
    }

    const token = tokenCookie.slice(
      SESSION_COOKIE_NAME.length + 1,
      tokenCookie.indexOf(";") === -1
        ? undefined
        : tokenCookie.indexOf(";"),
    );
    if (!token) {
      return Response.json(
        { message: "A API retornou um cookie de sessão inválido." },
        { status: 502 },
      );
    }

    responseHeaders.append(
      "set-cookie",
      `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}${
        process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`,
    );
  } else if (upstreamResponse.status === 401) {
    responseHeaders.append(
      "set-cookie",
      `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${
        process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`,
    );
  }

  return new Response(
    upstreamResponse.status === 204 || upstreamResponse.status === 304
      ? null
      : await upstreamResponse.arrayBuffer(),
    {
      status: upstreamResponse.status,
      headers: responseHeaders,
    },
  );
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
