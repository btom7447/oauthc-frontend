"use client";

import { useState } from "react";
import { User, Mail, Tag, MessageSquare, Send, CheckCircle } from "lucide-react";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const labelCls =
  "block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5";

const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/10 backdrop-blur-sm px-4 py-3 pl-11 text-lg text-white placeholder-gray-400 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition";

function Field({ children }: { children: React.ReactNode }) {
  return <div className="relative flex flex-col">{children}</div>;
}

function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute left-3 top-[2.35rem] text-gray-300">
      {children}
    </span>
  );
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    setSubmitted(true);
  };

  return (
    <section
      className="relative w-full py-20 px-6 md:px-12 overflow-hidden bg-[url('/images/booking-form/form-poster.png')] bg-cover bg-center"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-950/70" />

      <div className="relative max-w-7xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <div className="text-center">
          <p className="text-red-500 uppercase text-xl font-semibold tracking-wide">
            Send Us a Message
          </p>
          <h2 className="text-white text-3xl md:text-5xl font-semibold font-yeseva mt-2">
            Contact Us
          </h2>
          <p className="mt-3 text-gray-400 text-lg max-w-2xl mx-auto">
            Have a question, complaint, or feedback? Fill in the form below and
            our team will get back to you as soon as possible.
          </p>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-green-900/30 flex items-center justify-center">
              <CheckCircle size={32} className="text-green-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-white text-2xl font-semibold font-yeseva">
              Message Sent
            </h3>
            <p className="text-gray-400 text-base max-w-sm">
              Thank you for reaching out. We&apos;ve received your message and will
              respond within 24–48 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-6 max-w-3xl mx-auto w-full">
            {/* Name + Email */}
            <div className="grid md:grid-cols-2 gap-6">
              <Field>
                <label className={labelCls}>Full Name</label>
                <FieldIcon>
                  <User size={16} />
                </FieldIcon>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={inputCls}
                  required
                />
              </Field>

              <Field>
                <label className={labelCls}>Email Address</label>
                <FieldIcon>
                  <Mail size={16} />
                </FieldIcon>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={inputCls}
                  required
                />
              </Field>
            </div>

            {/* Subject */}
            <Field>
              <label className={labelCls}>Subject</label>
              <FieldIcon>
                <Tag size={16} />
              </FieldIcon>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="What is your message about?"
                className={inputCls}
                required
              />
            </Field>

            {/* Message */}
            <Field>
              <label className={labelCls}>Message</label>
              <FieldIcon>
                <MessageSquare size={16} />
              </FieldIcon>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={6}
                placeholder="Write your message here..."
                className={`${inputCls} resize-none`}
                required
              />
            </Field>

            <hr className="border-white/10" />

            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full md:w-fit md:px-12 py-3.5 bg-green-900 hover:bg-green-800 active:scale-95 text-white font-semibold rounded-lg transition"
            >
              <Send size={16} />
              Send Message
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
