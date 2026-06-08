'use client';

import { useCallback, useEffect, useState, type SVGProps } from 'react';
import { ApiError, useApiClient } from '@/app/lib/api-client';

type IconProps = SVGProps<SVGSVGElement>;

type ProfileValue =
  | string
  | number
  | boolean
  | null
  | ProfileValue[]
  | { [key: string]: ProfileValue | undefined };

type ProfileRecord = Record<string, ProfileValue | undefined>;

type ClientProfileResponse = {
  user: ProfileRecord;
  client: (ProfileRecord & {
    individual?: ProfileRecord | null;
    business?: ProfileRecord | null;
    documents?: ProfileValue[];
  }) | null;
};

function isRecord(value: ProfileValue | undefined): value is ProfileRecord {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function formatDate(value: string, includeTime = true) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) return value;

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return parsed.toLocaleString('en-RW', options);
}

function formatPrimitive(value: string | number | boolean | null, label?: string) {
  if (value === null) return 'None';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') return value.toLocaleString('en-RW');

  if (!value.trim()) return 'None';
  if (label && /date of birth/i.test(label)) {
    return formatDate(value, false);
  }

  if (label && /date|created at|updated at|approved at/i.test(label)) {
    return formatDate(value);
  }

  if (/^[A-Z0-9_]+$/.test(value) && value.includes('_')) {
    return value.replaceAll('_', ' ').toLowerCase();
  }

  return value;
}

function getValue(record: ProfileRecord | null | undefined, keys: string[]) {
  if (!record) return undefined;

  for (const key of keys) {
    const value = record[key];
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) continue;
    if (isRecord(value)) continue;
    return value;
  }

  return undefined;
}

function getFieldValue(
  user: ProfileRecord,
  client: ClientProfileResponse['client'] | null,
  label: string,
  keys: Array<readonly [ProfileRecord | null | undefined, string[]]>,
) {
  for (const [record, keyList] of keys) {
    const value = getValue(record, keyList);
    if (value !== undefined) {
      return formatPrimitive(value, label);
    }
  }

  return 'None';
}

function getAvatarLetters(value: string) {
  return value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function iconBase({ className, ...props }: IconProps) {
  return {
    ...props,
    'aria-hidden': true,
    className: `h-8 w-8 ${className ?? ''}`,
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.8,
    viewBox: '0 0 24 24',
  };
}

function UserIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <circle cx="12" cy="7.5" r="3.5" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

function MailIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </svg>
  );
}

function PhoneIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <path d="M6.6 4.5 9.2 7c.6.6.7 1.5.2 2.2l-1 1.5a12.5 12.5 0 0 0 5 5l1.5-1c.7-.5 1.7-.4 2.2.2l2.4 2.5c.5.5.6 1.3.1 1.9-.8 1-2 1.6-3.3 1.4C9.4 19.7 4.3 14.6 3.3 7.8 3.1 6.5 3.7 5.3 4.7 4.5c.6-.5 1.4-.5 1.9 0z" />
    </svg>
  );
}

function IdIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <path d="M7 3.5h7l5 5V20a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 20V5a1.5 1.5 0 0 1 1.5-1.5z" />
      <path d="M14 3.5V9h5" />
      <path d="M8.5 13h7" />
      <path d="M8.5 17h5" />
    </svg>
  );
}

function MapPinIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <path d="M19 10.5c0 5.2-7 10-7 10s-7-4.8-7-10a7 7 0 1 1 14 0z" />
      <circle cx="12" cy="10.5" r="2.2" />
    </svg>
  );
}

function CalendarIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <rect x="4" y="5" width="16" height="16" rx="3" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M4 10h16" />
    </svg>
  );
}

function EditIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <path d="m14.5 5.5 4 4" />
      <path d="M4 20h4l10.5-10.5a2.8 2.8 0 0 0-4-4L4 16v4z" />
    </svg>
  );
}

function LoadingProfile() {
  return (
    <div className="space-y-6">
      <div className="h-24 animate-pulse rounded-3xl bg-white" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-36 animate-pulse rounded-3xl bg-white" />
        <div className="h-36 animate-pulse rounded-3xl bg-white" />
        <div className="h-36 animate-pulse rounded-3xl bg-white" />
      </div>
    </div>
  );
}

export default function ClientProfileDetails() {
  const apiFetch = useApiClient();
  const [profile, setProfile] = useState<ClientProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch<ClientProfileResponse>(
        '/v1/clients/me/profile',
      );
      setProfile(response);
    } catch (caught) {
      setError(
        caught instanceof ApiError || caught instanceof Error
          ? caught.message
          : 'Failed to load profile.',
      );
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  if (loading) return <LoadingProfile />;

  if (error) {
    return (
      <div className="space-y-6">
        <section className="rounded-lg border border-red-100 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </section>
      </div>
    );
  }

  if (!profile) return null;

  const { user, client } = profile;

  const fields = [
    {
      icon: UserIcon,
      label: 'Full Name',
      value: getFieldValue(user, client, 'Full Name', [
        [user, ['fullName', 'name']],
        [client?.individual ?? null, ['fullName', 'name']],
        [client?.business ?? null, ['businessName', 'name']],
      ]),
    },
    {
      icon: MailIcon,
      label: 'Email',
      value: getFieldValue(user, client, 'Email', [[user, ['email']]]),
    },
    {
      icon: CalendarIcon,
      label: 'Date of Birth',
      value: getFieldValue(user, client, 'Date of Birth', [
        [user, ['dateOfBirth', 'dob']],
        [client?.individual ?? null, ['dateOfBirth', 'dob']],
        [client?.business ?? null, ['dateOfBirth', 'dob']],
      ]),
    },
    {
      icon: IdIcon,
      label: 'ID Number',
      value: getFieldValue(user, client, 'ID Number', [
        [user, ['nationalId', 'idNumber', 'taxId', 'registrationNumber']],
        [client, ['nationalId', 'idNumber', 'registrationNumber', 'taxId']],
        [client?.individual ?? null, ['nationalId', 'idNumber']],
        [client?.business ?? null, ['registrationNumber']],
      ]),
    },
    {
      icon: PhoneIcon,
      label: 'Phone Number',
      value: getFieldValue(user, client, 'Phone Number', [
        [user, ['phone', 'number', 'mobile', 'telephone']],
        [client, ['phone', 'number', 'mobile', 'telephone']],
        [client?.individual ?? null, ['phone', 'mobile', 'telephone']],
        [client?.business ?? null, ['phone', 'mobile', 'telephone']],
      ]),
    },
    {
      icon: MapPinIcon,
      label: 'Address',
      value: getFieldValue(user, client, 'Address', [
        [user, ['address']],
        [client, ['address']],
      ]),
    },
  ];

  const profileName = fields[0].value || 'Profile';
  const startDate = getFieldValue(user, client, 'Start Date', [
    [user, ['createdAt', 'joinedAt', 'startDate']],
    [client, ['createdAt', 'joinedAt', 'startDate']],
  ]);

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#d9f9ea] via-[#edfdf4] to-[#f4fff7] p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#ecfdf3] ring-4 ring-white">
              <div className="flex h-full w-full items-center justify-center bg-[#d9f9ea] text-3xl font-bold text-green-900">
                {getAvatarLetters(profileName)}
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-950">
                  My Profile
                </h1>
                <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
                  Verified Profile
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                Start Date: {startDate}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 px-7 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-950">
              Profile details
            </h2>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 text-base font-semibold text-gray-600 transition hover:text-gray-950"
          >
            <EditIcon className="h-5 w-5" />
            Edit
          </button>
        </div>

        <div className="grid gap-x-14 gap-y-12 px-7 py-7 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((field) => {
            const Icon = field.icon;

            return (
              <div
                key={field.label}
                className="flex min-w-0 items-start gap-5"
              >
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center text-gray-500">
                  <Icon />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-medium text-gray-500">
                    {field.label}
                  </p>
                  <p className="mt-1 text-xl font-semibold leading-snug text-gray-950">
                    {field.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
