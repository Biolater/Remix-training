import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

const getUser = async (userId: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`User with ID: ${userId}`);
    }, 1);
  });
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.userId, "Missing userId param");
  const user = await getUser(params.userId);
  if (!user) throw new Response("Not Found", { status: 404 });
  return json({ user });
};

export default function User() {
  const { user } = useLoaderData<typeof loader>()
  return (
    <div>
      <h1>{user}</h1>
    </div>
  );
}
