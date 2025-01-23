import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

const getConcert = async (concertId: string): Promise<string | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Concert with ID: ${concertId}`);
    }, 100);
  });
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.concertId, "Missing concertId param");
  const concert = await getConcert(params.concertId);
  if (!concert) {
    throw new Response("Not Found", { status: 404 });
  }
  return json(concert);
};

export default function Concert() {
  const concert = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>{concert}</h1>
    </div>
  );
}
