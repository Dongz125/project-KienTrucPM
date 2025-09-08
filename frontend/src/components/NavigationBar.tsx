import { Link } from "react-router";

function NavLink(props: { href: string; label: string; active?: string }) {
  if (props.href == props.active) {
    return (
      <Link
        to={props.href}
        className="px-4 py-2 rounded-md border border-black"
      >
        {props.label}
      </Link>
    );
  }

  return (
    <Link
      to={props.href}
      className="px-4 py-2 border rounded-md border-transparent hover:border-black"
    >
      {props.label}
    </Link>
  );
}

export default function NavigationBar(props: { active?: string }) {
  const links = [
    {
      href: "/",
      label: "Home",
    },
    {
      href: "/login",
      label: "Login",
    },
    {
      href: "/register",
      label: "Register",
    },
    {
      href: "/crawl",
      label: "Crawler",
    },
    {
      href: "/sentiment",
      label: "Sentiment",
    },
  ];

  return (
    <nav className="py-2 px-4 text-center w-full items-center justify-center flex flex-row gap-2">
      {links.map((link) => (
        <NavLink {...link} active={props.active} />
      ))}
    </nav>
  );
}
