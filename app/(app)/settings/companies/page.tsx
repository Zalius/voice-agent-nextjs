
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/drizzle/db";
import { companies } from "@/lib/drizzle/db/schema";

async function createCompany(formData: FormData) {
  "use server";

  const companyId = formData.get("companyId") as string;
  const companyName = formData.get("companyName") as string;

  if (!companyId || !companyName) return;

  await db.insert(companies).values({
    companyId,
    companyName,
  });

  revalidatePath("/companies");
}

export default async function CompaniesPage(props: PageProps<"/settings/companies">) {
  const list = await db.select().from(companies);

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-10">
    <h1 className="text-3xl font-semibold dark:text-white">Companies</h1>

    {/* Create Form */}
    <div className="border rounded-xl p-6 bg-white dark:bg-neutral-900 dark:border-neutral-700">
      <h3 className="text-lg font-medium mb-4 dark:text-white">Create New Company</h3>

      <form action={createCompany} className="space-y-4">
        <input
          type="text"
          name="companyId"
          placeholder="Company ID"
          required
          className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
        />

        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          required
          className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
        />

        <button
          type="submit"
          className="w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200"
        >
          Create
        </button>
      </form>
    </div>

    {/* Companies Table */}
    <div className="border rounded-xl overflow-hidden bg-white dark:bg-neutral-900 dark:border-neutral-700">
      <table className="w-full border-collapse">
        <thead className="bg-neutral-100 dark:bg-neutral-800 text-left dark:text-white">
          <tr>
            <th className="border-b dark:border-neutral-700 px-4 py-3">ID</th>
            <th className="border-b dark:border-neutral-700 px-4 py-3">Company ID</th>
            <th className="border-b dark:border-neutral-700 px-4 py-3">Company Name</th>
          </tr>
        </thead>

        <tbody>
          {list.map((c) => (
            <tr
              key={c.id}
              className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
            >
              <td className="border-b dark:border-neutral-700 px-4 py-3 dark:text-white">
                {c.id}
              </td>
              <td className="border-b dark:border-neutral-700 px-4 py-3">
                <Link
                  href={`/settings/companies/${c.companyId}`}
                  className="text-blue-600 underline dark:text-blue-400"
                >
                  {c.companyId}
                </Link>
              </td>
              <td className="border-b dark:border-neutral-700 px-4 py-3 dark:text-white">
                {c.companyName}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
}
