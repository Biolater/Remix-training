import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, redirect, json as json$1 } from "@remix-run/node";
import { RemixServer, useSubmit, useLoaderData, Meta, Links, Form, NavLink, Outlet, ScrollRestoration, Scripts, json, useNavigate, Link } from "@remix-run/react";
import * as isbotModule from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";
import invariant from "tiny-invariant";
import { useEffect } from "react";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  let prohibitOutOfOrderStreaming = isBotRequest(request.headers.get("user-agent")) || remixContext.isSpaMode;
  return prohibitOutOfOrderStreaming ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function isBotRequest(userAgent) {
  if (!userAgent) {
    return false;
  }
  if ("isbot" in isbotModule && typeof isbotModule.isbot === "function") {
    return isbotModule.isbot(userAgent);
  }
  if ("default" in isbotModule && typeof isbotModule.default === "function") {
    return isbotModule.default(userAgent);
  }
  return false;
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const appStylesHref = "/assets/app-BFkgwlLe.css";
const fakeContacts = {
  records: {},
  async getAll() {
    return Object.keys(fakeContacts.records).map((key) => fakeContacts.records[key]).sort(sortBy("-createdAt", "last"));
  },
  async get(id) {
    return fakeContacts.records[id] || null;
  },
  async create(values) {
    const id = values.id || Math.random().toString(36).substring(2, 9);
    const createdAt = (/* @__PURE__ */ new Date()).toISOString();
    const newContact = { id, createdAt, ...values };
    fakeContacts.records[id] = newContact;
    return newContact;
  },
  async set(id, values) {
    const contact = await fakeContacts.get(id);
    invariant(contact, `No contact found for ${id}`);
    const updatedContact = { ...contact, ...values };
    fakeContacts.records[id] = updatedContact;
    return updatedContact;
  },
  destroy(id) {
    delete fakeContacts.records[id];
    return null;
  }
};
async function getContacts(query) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  let contacts = await fakeContacts.getAll();
  if (query) {
    contacts = matchSorter(contacts, query, {
      keys: ["first", "last"]
    });
  }
  return contacts.sort(sortBy("last", "createdAt"));
}
async function createEmptyContact() {
  const contact = await fakeContacts.create({});
  return contact;
}
async function getContact(id) {
  return fakeContacts.get(id);
}
async function updateContact(id, updates) {
  const contact = await fakeContacts.get(id);
  if (!contact) {
    throw new Error(`No contact found for ${id}`);
  }
  await fakeContacts.set(id, { ...contact, ...updates });
  return contact;
}
async function deleteContact(id) {
  fakeContacts.destroy(id);
}
[
  {
    avatar: "https://sessionize.com/image/124e-400o400o2-wHVdAuNaxi8KJrgtN3ZKci.jpg",
    first: "Shruti",
    last: "Kapoor",
    twitter: "@shrutikapoor08"
  },
  {
    avatar: "https://sessionize.com/image/1940-400o400o2-Enh9dnYmrLYhJSTTPSw3MH.jpg",
    first: "Glenn",
    last: "Reyes",
    twitter: "@glnnrys"
  },
  {
    avatar: "https://sessionize.com/image/9273-400o400o2-3tyrUE3HjsCHJLU5aUJCja.jpg",
    first: "Ryan",
    last: "Florence"
  },
  {
    avatar: "https://sessionize.com/image/d14d-400o400o2-pyB229HyFPCnUcZhHf3kWS.png",
    first: "Oscar",
    last: "Newman",
    twitter: "@__oscarnewman"
  },
  {
    avatar: "https://sessionize.com/image/fd45-400o400o2-fw91uCdGU9hFP334dnyVCr.jpg",
    first: "Michael",
    last: "Jackson"
  },
  {
    avatar: "https://sessionize.com/image/b07e-400o400o2-KgNRF3S9sD5ZR4UsG7hG4g.jpg",
    first: "Christopher",
    last: "Chedeau",
    twitter: "@Vjeux"
  },
  {
    avatar: "https://sessionize.com/image/262f-400o400o2-UBPQueK3fayaCmsyUc1Ljf.jpg",
    first: "Cameron",
    last: "Matheson",
    twitter: "@cmatheson"
  },
  {
    avatar: "https://sessionize.com/image/820b-400o400o2-Ja1KDrBAu5NzYTPLSC3GW8.jpg",
    first: "Brooks",
    last: "Lybrand",
    twitter: "@BrooksLybrand"
  },
  {
    avatar: "https://sessionize.com/image/df38-400o400o2-JwbChVUj6V7DwZMc9vJEHc.jpg",
    first: "Alex",
    last: "Anderson",
    twitter: "@ralex1993"
  },
  {
    avatar: "https://sessionize.com/image/5578-400o400o2-BMT43t5kd2U1XstaNnM6Ax.jpg",
    first: "Kent C.",
    last: "Dodds",
    twitter: "@kentcdodds"
  },
  {
    avatar: "https://sessionize.com/image/c9d5-400o400o2-Sri5qnQmscaJXVB8m3VBgf.jpg",
    first: "Nevi",
    last: "Shah",
    twitter: "@nevikashah"
  },
  {
    avatar: "https://sessionize.com/image/2694-400o400o2-MYYTsnszbLKTzyqJV17w2q.png",
    first: "Andrew",
    last: "Petersen"
  },
  {
    avatar: "https://sessionize.com/image/907a-400o400o2-9TM2CCmvrw6ttmJiTw4Lz8.jpg",
    first: "Scott",
    last: "Smerchek",
    twitter: "@smerchek"
  },
  {
    avatar: "https://sessionize.com/image/08be-400o400o2-WtYGFFR1ZUJHL9tKyVBNPV.jpg",
    first: "Giovanni",
    last: "Benussi",
    twitter: "@giovannibenussi"
  },
  {
    avatar: "https://sessionize.com/image/f814-400o400o2-n2ua5nM9qwZA2hiGdr1T7N.jpg",
    first: "Igor",
    last: "Minar",
    twitter: "@IgorMinar"
  },
  {
    avatar: "https://sessionize.com/image/fb82-400o400o2-LbvwhTVMrYLDdN3z4iEFMp.jpeg",
    first: "Brandon",
    last: "Kish"
  },
  {
    avatar: "https://sessionize.com/image/fcda-400o400o2-XiYRtKK5Dvng5AeyC8PiUA.png",
    first: "Arisa",
    last: "Fukuzaki",
    twitter: "@arisa_dev"
  },
  {
    avatar: "https://sessionize.com/image/c8c3-400o400o2-PR5UsgApAVEADZRixV4H8e.jpeg",
    first: "Alexandra",
    last: "Spalato",
    twitter: "@alexadark"
  },
  {
    avatar: "https://sessionize.com/image/7594-400o400o2-hWtdCjbdFdLgE2vEXBJtyo.jpg",
    first: "Cat",
    last: "Johnson"
  },
  {
    avatar: "https://sessionize.com/image/5636-400o400o2-TWgi8vELMFoB3hB9uPw62d.jpg",
    first: "Ashley",
    last: "Narcisse",
    twitter: "@_darkfadr"
  },
  {
    avatar: "https://sessionize.com/image/6aeb-400o400o2-Q5tAiuzKGgzSje9ZsK3Yu5.JPG",
    first: "Edmund",
    last: "Hung",
    twitter: "@_edmundhung"
  },
  {
    avatar: "https://sessionize.com/image/30f1-400o400o2-wJBdJ6sFayjKmJycYKoHSe.jpg",
    first: "Clifford",
    last: "Fajardo",
    twitter: "@cliffordfajard0"
  },
  {
    avatar: "https://sessionize.com/image/6faa-400o400o2-amseBRDkdg7wSK5tjsFDiG.jpg",
    first: "Erick",
    last: "Tamayo",
    twitter: "@ericktamayo"
  },
  {
    avatar: "https://sessionize.com/image/feba-400o400o2-R4GE7eqegJNFf3cQ567obs.jpg",
    first: "Paul",
    last: "Bratslavsky",
    twitter: "@codingthirty"
  },
  {
    avatar: "https://sessionize.com/image/c315-400o400o2-spjM5A6VVfVNnQsuwvX3DY.jpg",
    first: "Pedro",
    last: "Cattori",
    twitter: "@pcattori"
  },
  {
    avatar: "https://sessionize.com/image/eec1-400o400o2-HkvWKLFqecmFxLwqR9KMRw.jpg",
    first: "Andre",
    last: "Landgraf",
    twitter: "@AndreLandgraf94"
  },
  {
    avatar: "https://sessionize.com/image/c73a-400o400o2-4MTaTq6ftC15hqwtqUJmTC.jpg",
    first: "Monica",
    last: "Powell",
    twitter: "@indigitalcolor"
  },
  {
    avatar: "https://sessionize.com/image/cef7-400o400o2-KBZUydbjfkfGACQmjbHEvX.jpeg",
    first: "Brian",
    last: "Lee",
    twitter: "@brian_dlee"
  },
  {
    avatar: "https://sessionize.com/image/f83b-400o400o2-Pyw3chmeHMxGsNoj3nQmWU.jpg",
    first: "Sean",
    last: "McQuaid",
    twitter: "@SeanMcQuaidCode"
  },
  {
    avatar: "https://sessionize.com/image/a9fc-400o400o2-JHBnWZRoxp7QX74Hdac7AZ.jpg",
    first: "Shane",
    last: "Walker",
    twitter: "@swalker326"
  },
  {
    avatar: "https://sessionize.com/image/6644-400o400o2-aHnGHb5Pdu3D32MbfrnQbj.jpg",
    first: "Jon",
    last: "Jensen",
    twitter: "@jenseng"
  }
].forEach((contact) => {
  fakeContacts.create({
    ...contact,
    id: `${contact.first.toLowerCase()}-${contact.last.toLocaleLowerCase()}`
  });
});
const loader$5 = async ({ request }) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return json({ contacts, q });
};
const action$3 = async () => {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
};
const links = () => [
  { rel: "stylesheet", href: appStylesHref }
];
function App() {
  const submit = useSubmit();
  const { contacts, q } = useLoaderData();
  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsxs("div", { id: "sidebar", children: [
        /* @__PURE__ */ jsx("h1", { children: "Remix Contacts" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(Form, { id: "search-form", role: "search", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                onChange: (event) => {
                  submit(event.currentTarget);
                },
                id: "q",
                "aria-label": "Search contacts",
                placeholder: "Search",
                defaultValue: q ?? "",
                type: "search",
                name: "q"
              }
            ),
            /* @__PURE__ */ jsx("div", { id: "search-spinner", "aria-hidden": true, hidden: true })
          ] }),
          /* @__PURE__ */ jsx(Form, { method: "post", children: /* @__PURE__ */ jsx("button", { type: "submit", children: "New" }) })
        ] }),
        /* @__PURE__ */ jsx("nav", { children: contacts.length ? /* @__PURE__ */ jsx("ul", { children: contacts.map((contact) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
          NavLink,
          {
            className: ({ isActive, isPending }) => isActive ? "active" : isPending ? "pending" : "",
            to: `contacts/${contact.id}`,
            children: [
              contact.first || contact.last ? /* @__PURE__ */ jsxs(Fragment, { children: [
                contact.first,
                " ",
                contact.last
              ] }) : /* @__PURE__ */ jsx("i", { children: "No Name" }),
              " ",
              contact.favorite ? /* @__PURE__ */ jsx("span", { children: "★" }) : null
            ]
          }
        ) }, contact.id)) }) : /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx("i", { children: "No contacts" }) }) })
      ] }),
      /* @__PURE__ */ jsx("div", { id: "detail", children: /* @__PURE__ */ jsx(Outlet, {}) }),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3,
  default: App,
  links,
  loader: loader$5
}, Symbol.toStringTag, { value: "Module" }));
const action$2 = async ({ params }) => {
  invariant(params.contactId, "Missing contactId param");
  await deleteContact(params.contactId);
  return redirect("/");
};
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2
}, Symbol.toStringTag, { value: "Module" }));
const action$1 = async ({ params, request }) => {
  invariant(params.contactId, "Missing contactId param");
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
};
const loader$4 = async ({ params }) => {
  invariant(params.contactId, "Missing contactId param");
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return json$1({ contact });
};
function EditContact() {
  const navigate = useNavigate();
  const { contact } = useLoaderData();
  return /* @__PURE__ */ jsxs(Form, { id: "contact-form", method: "post", children: [
    /* @__PURE__ */ jsxs("p", { children: [
      /* @__PURE__ */ jsx("span", { children: "Name" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          "aria-label": "First name",
          defaultValue: contact.first,
          name: "first",
          placeholder: "First",
          type: "text"
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          "aria-label": "Last name",
          defaultValue: contact.last,
          name: "last",
          placeholder: "Last",
          type: "text"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("label", { children: [
      /* @__PURE__ */ jsx("span", { children: "Twitter" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          defaultValue: contact.twitter,
          name: "twitter",
          placeholder: "@jack",
          type: "text"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("label", { children: [
      /* @__PURE__ */ jsx("span", { children: "Avatar URL" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          "aria-label": "Avatar URL",
          defaultValue: contact.avatar,
          name: "avatar",
          placeholder: "https://example.com/avatar.jpg",
          type: "text"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("label", { children: [
      /* @__PURE__ */ jsx("span", { children: "Notes" }),
      /* @__PURE__ */ jsx("textarea", { defaultValue: contact.notes, name: "notes", rows: 6 })
    ] }),
    /* @__PURE__ */ jsxs("p", { children: [
      /* @__PURE__ */ jsx("button", { type: "submit", children: "Save" }),
      /* @__PURE__ */ jsx("button", { onClick: () => navigate(-1), type: "button", children: "Cancel" })
    ] })
  ] }, contact.id);
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  default: EditContact,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
const getConcert = async (concertId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Concert with ID: ${concertId}`);
    }, 100);
  });
};
const loader$3 = async ({ params }) => {
  invariant(params.concertId, "Missing concertId param");
  const concert = await getConcert(params.concertId);
  if (!concert) {
    throw new Response("Not Found", { status: 404 });
  }
  return json$1(concert);
};
function Concert() {
  const concert = useLoaderData();
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { children: concert }) });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Concert,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
const loader$2 = async ({
  params
}) => {
  invariant(params.contactId, "Missing contactId param");
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return Response.json({ contact });
};
function Contact() {
  const { contact } = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { id: "contact", children: [
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
      "img",
      {
        alt: `${contact.first} ${contact.last} avatar`,
        src: contact.avatar
      },
      contact.avatar
    ) }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("h1", { children: [
        contact.first || contact.last ? /* @__PURE__ */ jsxs(Fragment, { children: [
          contact.first,
          " ",
          contact.last
        ] }) : /* @__PURE__ */ jsx("i", { children: "No Name" }),
        " ",
        /* @__PURE__ */ jsx(Favorite, { contact })
      ] }),
      contact.twitter ? /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx("a", { href: `https://twitter.com/${contact.twitter}`, children: contact.twitter }) }) : null,
      contact.notes ? /* @__PURE__ */ jsx("p", { children: contact.notes }) : null,
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Form, { action: "edit", children: /* @__PURE__ */ jsx("button", { type: "submit", children: "Edit" }) }),
        /* @__PURE__ */ jsx(
          Form,
          {
            action: "destroy",
            method: "post",
            onSubmit: (event) => {
              const response = confirm(
                "Please confirm you want to delete this record."
              );
              if (!response) {
                event.preventDefault();
              }
            },
            children: /* @__PURE__ */ jsx("button", { type: "submit", children: "Delete" })
          }
        )
      ] })
    ] })
  ] });
}
const Favorite = ({ contact }) => {
  const favorite = contact.favorite;
  return /* @__PURE__ */ jsx(Form, { method: "post", children: /* @__PURE__ */ jsx(
    "button",
    {
      "aria-label": favorite ? "Remove from favorites" : "Add to favorites",
      name: "favorite",
      value: favorite ? "false" : "true",
      children: favorite ? "★" : "☆"
    }
  ) });
};
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Contact,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
const CONCERTS = Array.from({ length: 20 });
const loader$1 = async () => ({ concerts: CONCERTS });
const addConcert = () => {
  CONCERTS.push("");
};
function Concerts() {
  const { concerts } = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { children: [
    concerts.map((_, i) => /* @__PURE__ */ jsxs(Link, { to: `/concerts/${i}`, children: [
      "Concert ",
      i
    ] }, i)),
    /* @__PURE__ */ jsx(Link, { to: "/concerts/add", children: /* @__PURE__ */ jsx("button", { children: "Add New" }) })
  ] });
}
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addConcert,
  default: Concerts,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
const action = async () => {
  await addConcert();
  return redirect("/concerts");
};
function AddConcert() {
  return /* @__PURE__ */ jsx(Form, { method: "post", children: /* @__PURE__ */ jsx("button", { type: "submit", children: "Add Concert" }) });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: AddConcert
}, Symbol.toStringTag, { value: "Module" }));
const getUser = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`User with ID: ${userId}`);
    }, 1);
  });
};
const loader = async ({ params }) => {
  invariant(params.userId, "Missing userId param");
  const user = await getUser(params.userId);
  if (!user) throw new Response("Not Found", { status: 404 });
  return json$1({ user });
};
function User() {
  const { user } = useLoaderData();
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { children: user }) });
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: User,
  loader
}, Symbol.toStringTag, { value: "Module" }));
function HelloWorld() {
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { children: "Hello World" }) });
}
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: HelloWorld
}, Symbol.toStringTag, { value: "Module" }));
function Index() {
  return /* @__PURE__ */ jsxs("p", { id: "index-page", children: [
    "This is a demo for Remix.",
    /* @__PURE__ */ jsx("br", {}),
    "Check out",
    " ",
    /* @__PURE__ */ jsx("a", { href: "https://remix.run", children: "the docs at remix.run" }),
    "."
  ] });
}
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DxCuXdLo.js", "imports": ["/assets/jsx-runtime-D5FwP9M8.js", "/assets/components-Bg2j0m6x.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-BFWZV3Rs.js", "imports": ["/assets/jsx-runtime-D5FwP9M8.js", "/assets/components-Bg2j0m6x.js"], "css": [] }, "routes/contacts.$contactId_.destroy": { "id": "routes/contacts.$contactId_.destroy", "parentId": "root", "path": "contacts/:contactId/destroy", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/contacts._contactId_.destroy-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/contacts.$contactId_.edit": { "id": "routes/contacts.$contactId_.edit", "parentId": "root", "path": "contacts/:contactId/edit", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/contacts._contactId_.edit-Ch1l13l9.js", "imports": ["/assets/jsx-runtime-D5FwP9M8.js", "/assets/components-Bg2j0m6x.js"], "css": [] }, "routes/concerts_.$concertId": { "id": "routes/concerts_.$concertId", "parentId": "root", "path": "concerts/:concertId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/concerts_._concertId-CF4FVBPX.js", "imports": ["/assets/jsx-runtime-D5FwP9M8.js", "/assets/components-Bg2j0m6x.js"], "css": [] }, "routes/contacts.$contactId": { "id": "routes/contacts.$contactId", "parentId": "root", "path": "contacts/:contactId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/contacts._contactId-C5kdo4PR.js", "imports": ["/assets/jsx-runtime-D5FwP9M8.js", "/assets/components-Bg2j0m6x.js"], "css": [] }, "routes/concerts_.add": { "id": "routes/concerts_.add", "parentId": "root", "path": "concerts/add", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/concerts_.add-BV_ivwev.js", "imports": ["/assets/jsx-runtime-D5FwP9M8.js", "/assets/components-Bg2j0m6x.js"], "css": [] }, "routes/users.$userId": { "id": "routes/users.$userId", "parentId": "root", "path": "users/:userId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/users._userId-BNo5PD5b.js", "imports": ["/assets/jsx-runtime-D5FwP9M8.js", "/assets/components-Bg2j0m6x.js"], "css": [] }, "routes/hello-world": { "id": "routes/hello-world", "parentId": "root", "path": "hello-world", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/hello-world-C3sXx1jC.js", "imports": ["/assets/jsx-runtime-D5FwP9M8.js"], "css": [] }, "routes/concerts": { "id": "routes/concerts", "parentId": "root", "path": "concerts", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/concerts-BFFQu5Dg.js", "imports": ["/assets/jsx-runtime-D5FwP9M8.js", "/assets/components-Bg2j0m6x.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-0Uvhv4gG.js", "imports": ["/assets/jsx-runtime-D5FwP9M8.js"], "css": [] } }, "url": "/assets/manifest-0dc90aef.js", "version": "0dc90aef" };
const mode = "production";
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "v3_fetcherPersist": false, "v3_relativeSplatPath": false, "v3_throwAbortReason": false, "v3_routeConfig": false, "v3_singleFetch": false, "v3_lazyRouteDiscovery": false, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/contacts.$contactId_.destroy": {
    id: "routes/contacts.$contactId_.destroy",
    parentId: "root",
    path: "contacts/:contactId/destroy",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/contacts.$contactId_.edit": {
    id: "routes/contacts.$contactId_.edit",
    parentId: "root",
    path: "contacts/:contactId/edit",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/concerts_.$concertId": {
    id: "routes/concerts_.$concertId",
    parentId: "root",
    path: "concerts/:concertId",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/contacts.$contactId": {
    id: "routes/contacts.$contactId",
    parentId: "root",
    path: "contacts/:contactId",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/concerts_.add": {
    id: "routes/concerts_.add",
    parentId: "root",
    path: "concerts/add",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/users.$userId": {
    id: "routes/users.$userId",
    parentId: "root",
    path: "users/:userId",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/hello-world": {
    id: "routes/hello-world",
    parentId: "root",
    path: "hello-world",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/concerts": {
    id: "routes/concerts",
    parentId: "root",
    path: "concerts",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route9
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
