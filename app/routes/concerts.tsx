import { Form, Link, useLoaderData } from "@remix-run/react";

const CONCERTS = Array.from({ length: 20 });


export const loader = async () => ({ concerts: CONCERTS });

export const addConcert = () => {
  CONCERTS.push("");
};

export default function Concerts() {
  const { concerts } = useLoaderData<typeof loader>();
  return (
    <div>
      {concerts.map((_, i) => (
        <Link to={`/concerts/${i}`} key={i}>
          Concert {i}
        </Link>
      ))}

      <Link to="/concerts/add">
        <button>Add New</button>
      </Link>
    </div>
  );
}
