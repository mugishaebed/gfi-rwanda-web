'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ApiError, useApiClient } from '@/app/lib/api-client';
import { useAuth } from '@/app/lib/auth-context';
import {
  calculateProfileProgress,
  clearProfileDraft,
  initialProfileFormData,
  readProfileDraft,
  writeProfileDraft,
  type ProfileFormData,
} from '../lib/profile-draft';

const inputClass =
  'mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#168a45]';

const fileInputClass =
  'mt-1 block w-full rounded-lg border border-dashed border-gray-300 bg-white px-3.5 py-4 text-sm text-gray-500';

const maxDocuments = 1;
const maxDocumentSize = 10 * 1024 * 1024;
const acceptedDocumentTypes = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
]);
const acceptedDocumentExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'];

function isAcceptedDocument(file: File) {
  const lowerName = file.name.toLowerCase();

  return (
    acceptedDocumentTypes.has(file.type) ||
    acceptedDocumentExtensions.some((extension) => lowerName.endsWith(extension))
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-semibold text-gray-800">
      {label}
      {children}
    </label>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5">
      <h2 className="text-base font-bold text-gray-950">{title}</h2>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

function appendIfPresent(payload: FormData, key: string, value: string) {
  const trimmed = value.trim();
  if (trimmed) payload.append(key, trimmed);
}

function isoDate(date: string) {
  return new Date(date).toISOString();
}

export default function ClientProfileCompletionForm() {
  const router = useRouter();
  const apiFetch = useApiClient();
  const { user, clientOnboardingStatus, refreshSession } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>(
    initialProfileFormData,
  );
  const [documents, setDocuments] = useState<File[]>([]);
  const [fileError, setFileError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);

  useEffect(() => {
    if (!user?.userId || draftLoaded) return;

    const draft = readProfileDraft(user.userId);
    if (draft) {
      setFormData(draft.formData);
    }

    setDraftLoaded(true);
  }, [draftLoaded, user?.userId]);

  useEffect(() => {
    if (!user?.userId || !draftLoaded || clientOnboardingStatus !== 'PENDING_PROFILE') {
      return;
    }

    writeProfileDraft(user.userId, {
      profileType: 'INDIVIDUAL',
      formData,
      updatedAt: new Date().toISOString(),
    });
  }, [
    clientOnboardingStatus,
    draftLoaded,
    formData,
    user?.userId,
  ]);

  const progress = useMemo(
    () => calculateProfileProgress(formData, user?.email),
    [formData, user?.email],
  );

  const updateField = <K extends keyof ProfileFormData>(
    field: K,
    value: ProfileFormData[K],
  ) => {
    setSubmitError('');
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length > maxDocuments) {
      setFileError('Upload one National ID document.');
      setDocuments([]);
      event.currentTarget.value = '';
      return;
    }

    const unsupportedFile = files.find((file) => !isAcceptedDocument(file));
    if (unsupportedFile) {
      setFileError('Documents must be PDF, JPEG, PNG, or WEBP.');
      setDocuments([]);
      event.currentTarget.value = '';
      return;
    }

    const oversizedFile = files.find((file) => file.size > maxDocumentSize);
    if (oversizedFile) {
      setFileError(`${oversizedFile.name} exceeds the 10MB per-file limit.`);
      setDocuments([]);
      event.currentTarget.value = '';
      return;
    }

    setFileError('');
    setSubmitError('');
    setDocuments(files);
  };

  const buildPayload = () => {
    if (documents.length === 0) {
      throw new Error('Upload your National ID document.');
    }

    const payload = new FormData();
    payload.append('type', 'INDIVIDUAL');
    payload.append('email', user?.email ?? '');
    payload.append('phone', formData.phone.trim());
    payload.append('address', formData.address.trim());
    payload.append('fullName', formData.fullName.trim());
    payload.append('nationalId', formData.nationalId.trim());
    payload.append('gender', formData.gender);
    payload.append('dateOfBirth', isoDate(formData.dateOfBirth));
    appendIfPresent(payload, 'nationality', formData.nationality);
    appendIfPresent(payload, 'maritalStatus', formData.maritalStatus);
    appendIfPresent(payload, 'occupation', formData.occupation);

    documents.forEach((document) => payload.append('documents', document));
    payload.append('documentLabels', JSON.stringify(['National ID']));

    return payload;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError('');
    setSubmitting(true);

    try {
      await apiFetch(
        '/v1/clients/me/complete-profile/individual',
        {
          method: 'POST',
          body: buildPayload(),
        },
      );
      if (user?.userId) clearProfileDraft(user.userId);
      await refreshSession();
      router.replace('/loan-portal');
    } catch (caught) {
      if (caught instanceof ApiError) {
        setSubmitError(caught.message);
      } else {
        setSubmitError(caught instanceof Error ? caught.message : 'Profile submission failed.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (clientOnboardingStatus === 'PENDING_APPROVAL') {
    const checkStatus = async () => {
      setCheckingStatus(true);
      await refreshSession();
      setCheckingStatus(false);
    };

    return (
      <section className="mx-auto max-w-2xl rounded-lg border border-amber-200 bg-amber-50 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
          Pending approval
        </p>
        <h1 className="mt-2 text-2xl font-bold text-amber-950">
          Your client profile is under review
        </h1>
        <p className="mt-3 text-sm leading-6 text-amber-800">
          A loan officer will approve your profile before loans are available.
        </p>
        <button
          type="button"
          onClick={checkStatus}
          disabled={checkingStatus}
          className="mt-5 rounded-lg bg-amber-900 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-amber-800 disabled:opacity-60"
        >
          {checkingStatus ? 'Checking...' : 'Check status'}
        </button>
      </section>
    );
  }

  if (clientOnboardingStatus === 'ACTIVE') {
    return (
      <section className="mx-auto max-w-2xl rounded-lg border border-emerald-200 bg-emerald-50 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Active profile
        </p>
        <h1 className="mt-2 text-2xl font-bold text-emerald-950">
          Your client profile is active
        </h1>
        <Link
          href="/loan-portal"
          className="mt-5 inline-flex rounded-lg bg-[#36e17b] px-4 py-2.5 text-sm font-bold text-gray-950 transition-colors hover:bg-[#20c968]"
        >
          Go to loans
        </Link>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#168a45]">
          Client Profile
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950">
          Complete your profile
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
          This profile will be reviewed by a loan officer before loan requests are
          enabled.
        </p>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-gray-950">
              Profile completion
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Your draft is saved automatically on this device.
            </p>
          </div>
          <p className="text-3xl font-bold text-gray-950">{progress}%</p>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-[#36e17b] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      {submitError && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <Section title="Contact details">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Email">
            <input
              type="email"
              required
              value={user?.email ?? ''}
              readOnly
              className={`${inputClass} bg-gray-50 text-gray-500`}
            />
          </Field>

          <Field label="Phone *">
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(event) => updateField('phone', event.target.value)}
              placeholder="+250788123456"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Address *">
          <input
            type="text"
            required
            value={formData.address}
            onChange={(event) => updateField('address', event.target.value)}
            placeholder="Kigali, Rwanda"
            className={inputClass}
          />
        </Field>
      </Section>

      <Section title="Individual details">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Full name *">
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(event) => updateField('fullName', event.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="National ID *">
            <input
              type="text"
              required
              value={formData.nationalId}
              onChange={(event) => updateField('nationalId', event.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Gender *">
            <select
              required
              value={formData.gender}
              onChange={(event) => updateField('gender', event.target.value)}
              className={inputClass}
            >
              <option value="">Select gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </Field>

          <Field label="Date of birth *">
            <input
              type="date"
              required
              value={formData.dateOfBirth}
              onChange={(event) => updateField('dateOfBirth', event.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Nationality">
            <input
              type="text"
              value={formData.nationality}
              onChange={(event) => updateField('nationality', event.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Marital status">
            <input
              type="text"
              value={formData.maritalStatus}
              onChange={(event) => updateField('maritalStatus', event.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Occupation">
            <input
              type="text"
              value={formData.occupation}
              onChange={(event) => updateField('occupation', event.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      <Section title="Supporting documents">
        <Field label="National ID *">
          <input
            type="file"
            required
            accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className={fileInputClass}
          />
        </Field>

        {fileError && <p className="text-sm text-red-600">{fileError}</p>}

        {documents.length > 0 && (
          <div className="space-y-3">
            {documents.map((document, index) => (
              <div
                key={`${document.name}-${index}`}
                className="rounded-lg border border-gray-200 p-4"
              >
                <p className="text-sm font-semibold text-gray-950">
                  National ID
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {document.name} ({(document.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            ))}
          </div>
        )}
      </Section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting || Boolean(fileError)}
          className="inline-flex items-center justify-center rounded-lg bg-[#36e17b] px-5 py-3 text-sm font-bold text-gray-950 transition-colors hover:bg-[#20c968] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Submitting...' : 'Submit profile'}
        </button>
      </div>
    </form>
  );
}
