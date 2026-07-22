// Functional departments for the top nav — grouped by what the customer is
// trying to DO (take food out, serve drinks, set a table, clean up), the way
// WebstaurantStore's masthead nav works. Each department maps to one or more
// of the type-based categories used by the "Shop by Category" grid and the
// shop sidebar. The type categories stay the source of truth for products;
// departments are just a higher-level lens over them.
export const DEPARTMENTS = [
  {
    key: "dept-takeout",
    label: "Take-Out & Delivery",
    categories: ["togo-hinged", "plastic-containers", "paper-togo", "paper-containers", "sushi"]
  },
  {
    key: "dept-drinkware",
    label: "Cups, Lids & Straws",
    categories: ["hot-cups", "cold-cups", "portion-cups", "straws"]
  },
  {
    key: "dept-tabletop",
    label: "Tabletop & Serving",
    categories: ["plates", "cutlery", "napkins"]
  },
  {
    key: "dept-bags-wrap",
    label: "Bags & Wrap",
    categories: ["bags", "wrap-foil"]
  },
  {
    key: "dept-janitorial",
    label: "Janitorial & Safety",
    categories: ["gloves", "tissue", "supplies"]
  }
];

const DEPT_BY_KEY = new Map(DEPARTMENTS.map((d) => [d.key, d]));

// The department object for a filter key, or null when the key isn't a
// department (i.e. it's "all" or a single type-category).
export function departmentForKey(key) {
  return DEPT_BY_KEY.get(key) ?? null;
}

// A Set of member category keys for a department filter, or null when the
// filter isn't a department — lets the shop treat both filter kinds uniformly.
export function categorySet(key) {
  const dept = DEPT_BY_KEY.get(key);
  return dept ? new Set(dept.categories) : null;
}
