'use client';

import { useState } from 'react';

const inputClass =
  'rounded-2xl border border-gray-200 px-4 py-3.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#36e17b]';

export default function ContactForm() {
  const [phone, setPhone] = useState('');

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-8 md:p-10">
      <form className="grid gap-7">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-900">Full name</span>
            <input
              type="text"
              placeholder="Your full name"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-900">Email address</span>
            <input
              type="email"
              placeholder="you@example.com"
              className={inputClass}
            />
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-900">Phone number</span>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="+250 7xx xxx xxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^\d+\s]/g, ''))}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-900">Enquiry type</span>
            <select className="rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition-colors focus:border-[#36e17b]">
              <option value="">Select a topic</option>
              <option>Green Financing</option>
              <option>Consultancy Services</option>
              <option>Partnership Opportunity</option>
              <option>General Enquiry</option>
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-900">Organisation</span>
          <input
            type="text"
            placeholder="Company or organisation name"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-900">Project details</span>
          <textarea
            rows={5}
            placeholder="Tell us about your goals, timeline, and the support you need."
            className="resize-none rounded-2xl border border-gray-200 px-4 py-4 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#36e17b]"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-full border border-[#36e17b] px-8 py-3.5 font-medium text-[#36e17b] transition-colors hover:bg-[#36e17b] hover:text-white"
        >
          Send enquiry
        </button>
      </form>
    </div>
  );
}
