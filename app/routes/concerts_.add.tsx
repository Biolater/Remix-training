import { Form } from "@remix-run/react";
import { redirect } from "@remix-run/node"; // Correct import
import { addConcert } from "./concerts"; // Ensure this function is defined and imported

export const action = async () => {
    await addConcert(); // Ensure this function is asynchronous if it involves I/O operations
  return redirect("/concerts");
};

export default function AddConcert() {
  return (
    <Form method="post">
      <button type="submit">Add Concert</button>
    </Form>
  );
}
