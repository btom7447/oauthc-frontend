export type NavItem = {
  label: string;
  url?: string;
  external?: boolean;
  children?: NavItem[];
};

export const navigation = {
  main: [
    { label: "Home", url: "/" },

    {
      label: "About",
      children: [
        { label: "About OAUTHC", url: "/about" },
        { label: "Departments & Centers", url: "/departments-centers" },
        { label: "Find a Doctor", url: "/doctors" },
        { label: "Locations", url: "/locations" },
        { label: "Our Schools", url: "/schools" },
      ],
    },

    {
      label: "Services",
      children: [
        { label: "Health Services", url: "/health-services" },
        { label: "Research and Ethics", url: "/research-ethics" },
        { label: "Diseases & Symptoms", url: "/diseases-symptoms" },
        { label: "Tests & Procedures", url: "/tests-procedures" },
      ],
    },

    {
      label: "Blog",
      url: "https://www.theoauthcblog.online/",
      external: true,
    },

    { label: "Contact", url: "/contact" },
  ],
};
