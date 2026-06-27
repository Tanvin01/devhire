import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const RECRUITER_PATHS = ["/dashboard/recruiter"];
const SEEKER_PATHS = ["/dashboard/seeker"];
const PROTECTED_PATHS = ["/dashboard"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (session) {
    const isRecruiterPath = RECRUITER_PATHS.some((p) => pathname.startsWith(p));
    const isSeekerPath = SEEKER_PATHS.some((p) => pathname.startsWith(p));

    if (isRecruiterPath && session.user.role !== "RECRUITER") {
      return NextResponse.redirect(new URL("/dashboard/seeker", req.url));
    }
    if (isSeekerPath && session.user.role !== "SEEKER") {
      return NextResponse.redirect(new URL("/dashboard/recruiter", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
