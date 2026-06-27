import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const session = await auth();

  // Redirect if already logged in
  if (session) {
    const role = session.user.role;
    if (role === "employer") {
      redirect("/dashboard/listings");
    } else if (role === "candidate") {
      redirect("/jobs");
    }
  }

  async function handleLogin(formData: FormData) {
    "use server";
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      // Get session after sign in to determine role-based redirect
      const session = await auth();
      if (session) {
        const role = session.user.role;
        if (role === "employer") {
          redirect("/dashboard/listings");
        } else if (role === "candidate") {
          redirect("/jobs");
        }
      }
    } catch (error) {
      // Handle error
      redirect("/login?error=CredentialsSignin");
    }
  }

  const error = searchParams.error === "CredentialsSignin";

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Invalid username or password
        </div>
      )}

      <form action={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}