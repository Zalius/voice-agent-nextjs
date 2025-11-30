import { revalidatePath } from 'next/cache';
import { notFound, redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/drizzle/db';
import { companies } from '@/lib/drizzle/db/schema';

async function updateCompany(companyId: string, formData: FormData) {
  'use server';

  const name = formData.get('companyName') as string;

  await db.update(companies).set({ companyName: name }).where(eq(companies.companyId, companyId));

  revalidatePath(`/settings/companies/${companyId}`);
}

async function deleteCompany(companyId: string) {
  'use server';

  await db.delete(companies).where(eq(companies.companyId, companyId));

  redirect('/settings/companies');
}

export default async function CompanyDetails(props: PageProps<'/settings/companies/[companyId]'>) {
  const { companyId } = await props.params;

  const record = await db.select().from(companies).where(eq(companies.companyId, companyId));

  if (record.length === 0) return notFound();

  const item = record[0];

  return (
    <div className="mx-auto mt-10 max-w-lg space-y-8">
      <h1 className="text-3xl font-semibold dark:text-white">Company: {item.companyId}</h1>

      {/* Update Company */}
      <div className="rounded-xl border bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900">
        <h3 className="mb-4 text-lg font-medium dark:text-white">Update Company</h3>

        <form action={updateCompany.bind(null, item.companyId)} className="space-y-4">
          <input
            type="text"
            name="companyName"
            defaultValue={item.companyName}
            required
            className="w-full rounded-lg border bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-black py-2 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            Update
          </button>
        </form>
      </div>

      {/* Delete Company */}
      <div className="rounded-xl border bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900">
        <h3 className="mb-4 text-lg font-medium dark:text-white">Danger Zone</h3>

        <form action={deleteCompany.bind(null, item.companyId)}>
          <button
            type="submit"
            className="w-full rounded-lg border border-red-600 py-2 text-red-600 transition hover:bg-red-600 hover:text-white dark:border-red-400 dark:text-red-400 dark:hover:bg-red-400 dark:hover:text-black"
          >
            Delete Company
          </button>
        </form>
      </div>
    </div>
  );
}
