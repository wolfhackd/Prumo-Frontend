import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "token";

function redirectToLogin(request: NextRequest, clearSession = false) {
  const response = NextResponse.redirect(new URL("/login", request.url));

  if (clearSession) {
    response.cookies.set(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      maxAge: 0,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return redirectToLogin(request);
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiBaseUrl) {
    return NextResponse.json(
      { message: "A URL da API não está configurada." },
      { status: 500 },
    );
  }

  let response: Response;
  try {
    response = await fetch(new URL("/auth/status", apiBaseUrl), {
      headers: { cookie: `${SESSION_COOKIE_NAME}=${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(65_000),
    });
  } catch {
    return NextResponse.json(
      { message: "Não foi possível validar sua sessão. Tente novamente." },
      { status: 503 },
    );
  }

  if (response.status === 401) {
    return redirectToLogin(request, true);
  }

  if (!response.ok) {
    return NextResponse.json(
      { message: `Não foi possível validar a sessão (HTTP ${response.status}).` },
      { status: 503 },
    );
  }

  let session: unknown;
  try {
    session = await response.json();
  } catch {
    return NextResponse.json(
      { message: "A API retornou uma resposta de sessão inválida." },
      { status: 503 },
    );
  }

  if (
    typeof session !== "object" ||
    session === null ||
    !("authenticated" in session) ||
    session.authenticated !== true ||
    !("user" in session) ||
    typeof session.user !== "object" ||
    session.user === null ||
    !("id" in session.user) ||
    typeof session.user.id !== "string"
  ) {
    return redirectToLogin(request, true);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
