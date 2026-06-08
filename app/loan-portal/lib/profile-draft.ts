export type ProfileType = 'INDIVIDUAL';

export type ProfileFormData = {
  phone: string;
  address: string;
  fullName: string;
  nationalId: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  maritalStatus: string;
  occupation: string;
};

export type ProfileDraft = {
  profileType: ProfileType;
  formData: ProfileFormData;
  updatedAt: string;
};

export const initialProfileFormData: ProfileFormData = {
  phone: '',
  address: '',
  fullName: '',
  nationalId: '',
  gender: '',
  dateOfBirth: '',
  nationality: '',
  maritalStatus: '',
  occupation: '',
};

function hasText(value: string | undefined) {
  return Boolean(value?.trim());
}

export function calculateProfileProgress(
  formData: ProfileFormData,
  email?: string | null,
) {
  const checks = [
    Boolean(email),
    hasText(formData.phone),
    hasText(formData.address),
    hasText(formData.fullName),
    hasText(formData.nationalId),
    hasText(formData.gender),
    hasText(formData.dateOfBirth),
  ];

  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
}

function draftKey(userId: string) {
  return `gfi_client_profile_draft_${userId}`;
}

export function readProfileDraft(userId: string): ProfileDraft | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = window.localStorage.getItem(draftKey(userId));
    if (!stored) return null;

    const parsed = JSON.parse(stored) as Partial<ProfileDraft>;

    return {
      profileType: 'INDIVIDUAL',
      formData: {
        ...initialProfileFormData,
        ...(parsed.formData ?? {}),
      },
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function writeProfileDraft(userId: string, draft: ProfileDraft) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(draftKey(userId), JSON.stringify(draft));
}

export function clearProfileDraft(userId: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(draftKey(userId));
}
