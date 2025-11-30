import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/drizzle/db';
import { interviewSettings } from '@/lib/drizzle/db/schema';

async function updateSettings(formData: FormData) {
  'use server';

  const body: Record<string, any> = {};
  formData.forEach((value, key) => {
    if (value !== undefined && value !== null && value !== '') {
      body[key] = value;
    }
  });

  const result = await db
    .update(interviewSettings)
    .set(body)
    .where(eq(interviewSettings.id, 1))
    .returning();

  revalidatePath('/interview-settings');
}

export default async function InterviewSettingsPage() {
  const settings = await db
    .select()
    .from(interviewSettings)
    .where(eq(interviewSettings.id, 1))
    .limit(1);

  if (settings.length === 0) return <p>No settings found.</p>;

  const s = settings[0];

  return (
    <div className="mx-auto mt-10 max-w-3xl space-y-6">
      <h1 className="text-3xl font-semibold dark:text-white">Interview Settings</h1>

      <form
        action={updateSettings}
        className="mt-5 grid gap-4 rounded-xl border bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900"
      >
        {/* Company ID (read-only) */}
        <div className="flex flex-col">
          <label className="mb-1 dark:text-white">Company ID</label>
          <input
            type="text"
            name="companyId"
            defaultValue={s.companyId}
            readOnly
            className="rounded-lg border bg-neutral-100 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          />
        </div>

        {/* Interview Field */}
        <div className="flex flex-col">
          <label className="mb-1 dark:text-white">Interview Field</label>
          <input
            type="text"
            name="interviewField"
            defaultValue={s.interviewField}
            className="rounded-lg border bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          />
        </div>

        {/* Conversation Flow */}
        <div className="flex flex-col">
          <label className="mb-1 dark:text-white">Conversation Flow</label>
          <input
            type="text"
            name="conversationFlow"
            defaultValue={s.conversationFlow}
            className="rounded-lg border bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          />
        </div>

        <div className="flex items-center space-x-2">
          {/* Hidden input ensures a value is always sent */}
          <input type="hidden" name="includeHr" value="false" />

          <input
            type="checkbox"
            name="includeHr"
            value="true"
            defaultChecked={s.includeHr ?? false}
            className="h-4 w-4 accent-black dark:accent-white"
          />
          <label className="dark:text-white">Include HR</label>
        </div>

        <div className="flex items-center space-x-2">
          <input type="hidden" name="includeTechnical" value="false" />
          <input
            type="checkbox"
            name="includeTechnical"
            value="true"
            defaultChecked={s.includeTechnical ?? false}
            className="h-4 w-4 accent-black dark:accent-white"
          />
          <label className="dark:text-white">Include Technical</label>
        </div>

        {/* Strictness Level */}
        <div className="flex flex-col">
          <label className="mb-1 dark:text-white">Strictness Level</label>
          <input
            type="text"
            name="strictnessLevel"
            defaultValue={s.strictnessLevel ?? ''}
            className="rounded-lg border bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          />
        </div>

        {/* Voice */}
        <div className="flex flex-col">
          <label className="mb-1 dark:text-white">Voice</label>
          <input
            type="text"
            name="voice"
            defaultValue={s.voice ?? ''}
            className="rounded-lg border bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          />
        </div>

        {/* Language */}
        <div className="flex flex-col">
          <label className="mb-1 dark:text-white">Language</label>
          <input
            type="text"
            name="language"
            defaultValue={s.language ?? ''}
            className="rounded-lg border bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          />
        </div>

        <button
          type="submit"
          className="mt-4 rounded-lg bg-black py-2 text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          Update Settings
        </button>
      </form>
    </div>
  );
}
