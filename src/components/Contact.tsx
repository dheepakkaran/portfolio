import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Send, MapPin, Clock, CheckCircle } from 'lucide-react';

const purposes = [
  { value: 'collaborate', label: '🤝 Want to Collaborate' },
  { value: 'project', label: '💡 Project Discussion' },
  { value: 'mentoring', label: '🎓 Mentoring / Guidance' },
  { value: 'opportunity', label: '🚀 Job / Internship Opportunity' },
  { value: 'research', label: '🔬 Research Partnership' },
  { value: 'other', label: '💬 Just Say Hello' },
];

interface Props {
  onBack: () => void;
}

export const Contact = ({ onBack }: Props) => {
  const [form, setForm] = useState({ name: '', email: '', purpose: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `[${purposes.find(p => p.value === form.purpose)?.label ?? form.purpose}] from ${form.name}`;
    const body = `Name: ${form.name}\nEmail: ${form.email}\nPurpose: ${form.purpose}\n\n${form.message}`;
    window.open(`mailto:dheepakkaranes@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  };

  return (
    <section className="min-h-screen flex flex-col justify-center pt-20 pb-8">
      <div className="container mx-auto px-6 md:px-16">

        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-xs uppercase tracking-widest mb-6 md:mb-10 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </motion.button>

        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-16"
        >
          {/* LEFT — Info & Availability */}
          <div className="flex flex-col gap-5 md:gap-7 justify-center">
            <div>
              <motion.p variants={item} className="text-gray-500 uppercase tracking-[0.35em] text-xs mb-2">
                Contact
              </motion.p>
              <motion.h2 variants={item} className="text-3xl md:text-5xl font-bold text-white leading-tight">
                Let's Build<br />
                <span className="text-gray-500">Something.</span>
              </motion.h2>
            </div>

            <motion.div variants={item} className="w-14 h-[2px] bg-white" />

            <motion.p variants={item} className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Whether it's a collaboration, a project idea, mentoring, or just a conversation about AI —
              I'm always open to connecting with driven people.
            </motion.p>

            {/* Contact details */}
            <motion.div variants={item} className="flex flex-col gap-2.5">
              <a
                href="mailto:dheepakkaranes@gmail.com"
                className="flex items-center gap-3 text-gray-400 hover:text-white text-sm transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0" />
                dheepakkaranes@gmail.com
              </a>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 shrink-0" />
                Boston, MA — Northeastern University
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Clock className="w-4 h-4 shrink-0" />
                EST (UTC −5) · Typically replies within 24 hrs
              </div>
            </motion.div>

            {/* Availability — hidden on mobile to save space, shown on desktop */}
            <motion.div
              variants={item}
              className="hidden md:flex rounded-xl border border-white/10 bg-white/[0.03] p-4 flex-col gap-3"
            >
              <p className="text-white text-xs uppercase tracking-widest">Current Availability</p>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Open to Internships', status: true },
                  { label: 'Open to Research Collaborations', status: true },
                  { label: 'Available for Mentoring', status: true },
                  { label: 'Freelance / Contract Projects', status: true },
                ].map((a) => (
                  <div key={a.label} className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${a.status ? 'bg-green-400' : 'bg-gray-600'}`} />
                    <span className="text-gray-400 text-xs">{a.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Mobile availability — compact pills */}
            <motion.div variants={item} className="flex md:hidden flex-wrap gap-2">
              {[
                'Internships',
                'Research',
                'Mentoring',
                'Freelance',
              ].map((label) => (
                <span key={label} className="flex items-center gap-1.5 text-[11px] text-gray-400 border border-white/10 bg-white/5 px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                  {label}
                </span>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Form */}
          <motion.div variants={item} className="flex flex-col justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">

              {/* Name + Email — single col on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-600 text-[10px] uppercase tracking-wider">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-600 text-[10px] uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
              </div>

              {/* Purpose */}
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-600 text-[10px] uppercase tracking-wider">Purpose</label>
                <select
                  name="purpose"
                  required
                  value={form.purpose}
                  onChange={handleChange}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-white/30 transition-colors appearance-none"
                  style={{ color: form.purpose ? 'white' : '#4b5563' }}
                >
                  <option value="" disabled style={{ background: '#111' }}>Select a purpose...</option>
                  {purposes.map((p) => (
                    <option key={p.value} value={p.value} style={{ background: '#111', color: 'white' }}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-600 text-[10px] uppercase tracking-wider">Message</label>
                <textarea
                  name="message"
                  required
                  rows={3}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me what's on your mind..."
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors mt-1"
              >
                {sent
                  ? <><CheckCircle className="w-4 h-4" /> Opening your mail client...</>
                  : <><Send className="w-4 h-4" /> Send Message</>
                }
              </button>

              <p className="text-gray-600 text-[10px] text-center">
                This will open your default mail client with the message pre-filled.
              </p>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
