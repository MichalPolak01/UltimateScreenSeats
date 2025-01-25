export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "UltimateScreenSeats",
  description: "Browse movies and book your tickets!",
  navItems: [
    {
      label: "Seanse",
      href: "/showings",
      authRequired: false
    },
    {
      label: "Filmy",
      href: "/movies",
      authRequired: false
    }
  ],
  navAdminItems: [
    {
      label: "Seanse",
      href: "/showings",
      authRequired: false
    },
    {
      label: "Filmy",
      href: "/movies",
      authRequired: false
    },
    {
      label: "Zarządzanie kinem",
      href: "/dashboard",
      authRequired: true
    }
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
      authRequired: false
    },
    {
      label: "Seanse",
      href: "/showings",
      authRequired: false
    },
    {
      label: "Filmy",
      href: "/movies",
      authRequired: false
    },
    {
      label: "Ustwaienia profilowe",
      href: "/profile",
      authRequired: true
    },
    {
      label: "Logowanie",
      href: "/login",
      authRequired: false
    },
    {
      label: "Rejestracja",
      href: "/register",
      authRequired: false
    },
    {
      label: "Logout",
      href: "/logout",
      authRequired: true
    }
  ],
  navMenuAuth: [
    {
      label: "Login",
      href: "/login"
    },
    {
      label: "Register",
      href: "/register"
    }
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
