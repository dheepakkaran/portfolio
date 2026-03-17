import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight } from 'lucide-react';

interface Command {
  input: string;
  output: string;
  isHtml?: boolean;
}

interface Props {
  onBack: () => void;
}

const files = ['about.txt', 'skills.txt', 'contact.txt', 'projects/', 'socials.txt', 'resume.txt'];

const projectsList = [
  {
    title: 'PLC-Based Water Cooling System for Power Generators',
    description: 'Control system prototype for efficient heat removal and power stability',
    tags: ['PLC', 'Ladder Logic', 'LOGO Soft'],
    github: '#',
    demo: '#',
  },
  {
    title: 'Stock Revenue Insights',
    description: 'Stock and revenue analysis of Tesla and GameStop using Python',
    tags: ['Python', 'BeautifulSoup', 'yfinance'],
    github: 'https://github.com/dheepakkaran/dheepakkaran',
    demo: '#',
  },
  {
    title: 'Subscription Microservices',
    description: 'Subscription microservice with AWS and optimization',
    tags: ['Spring Boot', 'Java', 'AWS'],
    github: '#',
    demo: '#',
  },
  {
    title: 'Demo Project',
    description: 'This is a sample project for demonstration purposes.',
    tags: ['Demo', 'Placeholder'],
    github: '#',
    demo: '#',
  },
];

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function handleCommand(cmd: string, onExit: () => void): { output: string; isHtml?: boolean } {
  const command = cmd.trim();

  switch (command) {
    case 'help':
      return { output: `Available commands:\n  whoami            - About me, education, work\n  cat skills.txt    - My technical skills\n  cat socials.txt   - My social links\n  ls projects       - List projects\n  cat projects/<project>.txt - Show project details\n  cat resume.txt    - Download my resume\n  clear             - Clear the terminal\n  exit              - Go back to intro\n\nType 'allcmds' to see all available commands.` };
    case 'allcmds':
      return { output: `All Commands:\n  whoami            - About me, education, work\n  cat skills.txt    - My technical skills\n  cat socials.txt   - My social links\n  ls                - List files and folders\n  ls -l             - List files (detailed)\n  pwd               - Print working directory\n  date              - Show current date and time\n  echo <text>       - Print text\n  man <command>     - Show help for a command\n  uname -a          - Show system info\n  ls projects       - List projects\n  cat projects/<project>.txt - Show project details\n  cat resume.txt    - Download my resume\n  clear             - Clear the terminal\n  exit              - Go back to intro\n  fortune           - Get a random quote\n  cowsay <text>     - Cow says your text\n  motd              - Message of the day\n  uptime            - Show uptime\n  random            - Get a random number` };
    case 'fortune': {
      const fortunes = [
        "Curiosity didn't kill me, it built me.",
        "Hunger beats talent when talent sleeps.",
        "A closed door only means there's another one waiting.",
        "Success is not born from comfort, but from chaos and courage.",
        "You're not where you come from, you're what you rise to become.",
      ];
      return { output: fortunes[Math.floor(Math.random() * fortunes.length)] };
    }
    case 'motd':
      return { output: "Welcome to Dheepak's OS! Every setback is a setup for a comeback." };
    case 'uptime':
      return { output: `Uptime: ${Math.floor((Date.now() - window.performance.timing.navigationStart) / 1000)} seconds` };
    case 'random':
      return { output: `Random number: ${Math.floor(Math.random() * 100000)}` };
    case 'exit':
      onExit();
      return { output: '' };
    case 'ls':
      return { output: files.join('  ') };
    case 'ls -l':
      return { output: `-rw-r--r-- 1 dheepak users  1.2K about.txt\n-rw-r--r-- 1 dheepak users  2.1K skills.txt\n-rw-r--r-- 1 dheepak users  0.7K contact.txt\ndrwxr-xr-x 2 dheepak users  4.0K projects\n-rw-r--r-- 1 dheepak users  0.5K socials.txt\n-rw-r--r-- 1 dheepak users  0.9K resume.txt` };
    case 'pwd':
      return { output: '/home/dheepak' };
    case 'date':
      return { output: new Date().toString() };
    case 'uname -a':
      return { output: 'Linux dheepak-os 6.4.0-portfolio #1 SMP PREEMPT x86_64 GNU/Linux' };
    case 'whoami':
      return { output: `Name: Dheepak Karan\n\nEducation:\n- MS in Electrical and Computer Engineering, Northeastern University\n  (Concentration: Computer Vision, Machine Learning, Algorithms)\n- BE in Electrical and Electronics Engineering\n\nWork Experience:\n- Java Developer at Guardian India (MNC)\n- AI/ML Projects: Policy recommendation chatbot, scalable microservices\n\nExpertise:\n- Machine Learning, Deep Learning, Computer Vision\n- Backend Development (Spring Boot, FastAPI, Flask)\n- Data Engineering, Cloud Integrations` };
    case 'cat skills.txt':
      return { output: `Backend & Frameworks\n- Spring Boot, Flask, FastAPI\n\nMachine Learning & Deep Learning\n- Scikit-learn, XGBoost, TensorFlow, Keras, PyTorch, Hugging Face\n\nComputer Vision\n- OpenCV, Pillow, YOLOv5 / YOLOv8\n\nData\n- NumPy, Pandas, Matplotlib, Seaborn, Plotly\n\nNLP\n- Spacy, NLTK, Hugging Face Transformers\n\nML Tracking\n- MLflow, Weights & Biases, DVC, TensorBoard\n\nCloud & Deployment\n- AWS S3 / SQS / SageMaker, Docker, Jenkins, Streamlit, Gradio` };
    case 'cat contact.txt':
      return { output: 'Email: dheepakkaranes@gmail.com' };
    case 'cat socials.txt':
      return {
        output: `<a href="https://www.linkedin.com/in/dheepak-karan-es/" target="_blank" rel="noopener noreferrer">LinkedIn</a> | <a href="https://github.com/dheepakkaran" target="_blank" rel="noopener noreferrer">GitHub</a> | <a href="https://x.com/dheepakkaran" target="_blank" rel="noopener noreferrer">X (Twitter)</a> | <a href="https://leetcode.com/u/___ka__ran___/" target="_blank" rel="noopener noreferrer">LeetCode</a> | <a href="https://www.hackerrank.com/dheepakkaranes" target="_blank" rel="noopener noreferrer">HackerRank</a> | <a href="https://medium.com/@dheepakkaranes" target="_blank" rel="noopener noreferrer">Medium</a>`,
        isHtml: true,
      };
    case 'cat resume.txt':
      return {
        output: `<a href="/portfolio/assets/resume.pdf" target="_blank" rel="noopener noreferrer">Click here to open / download my resume (PDF)</a>`,
        isHtml: true,
      };
    case 'ls projects':
      return { output: projectsList.map((p, i) => `${i + 1}. ${slugify(p.title)}.txt`).join('  ') };
    default: {
      if (command.startsWith('cowsay ')) {
        const text = command.slice(7);
        return { output: `  ${'_'.repeat(text.length + 2)}\n< ${text} >\n  ${'-'.repeat(text.length + 2)}\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||` };
      }
      if (command.startsWith('echo ')) return { output: command.slice(5) };
      if (command.startsWith('man ')) {
        const manCmd = command.slice(4).trim();
        const manMap: Record<string, string> = {
          ls: 'ls - list directory contents',
          'ls -l': 'ls -l - list directory contents in long format',
          cat: 'cat - concatenate and display file content',
          whoami: 'whoami - print effective username',
          pwd: 'pwd - print name of current/working directory',
          date: 'date - print or set the system date and time',
          uname: 'uname -a - print system information',
          clear: 'clear - clear the terminal screen',
          exit: 'exit - go back to intro',
        };
        return { output: manMap[manCmd] ?? `No manual entry for ${manCmd}` };
      }
      const projectMatch = command.match(/^cat projects\/(.+)\.txt$/);
      if (projectMatch) {
        const key = projectMatch[1];
        let project = null;
        if (/^\d+$/.test(key)) {
          const idx = parseInt(key, 10) - 1;
          if (idx >= 0 && idx < projectsList.length) project = projectsList[idx];
        } else {
          project = projectsList.find((p) => slugify(p.title) === key.replace(/\.txt$/, ''));
        }
        if (project) {
          let out = `Title: ${project.title}\nDescription: ${project.description}\nTags: ${project.tags.join(', ')}`;
          if (project.github && project.github !== '#') out += `\nGitHub: ${project.github}`;
          if (project.demo && project.demo !== '#') out += `\nDemo: ${project.demo}`;
          return { output: out };
        }
        return { output: `Project not found. Use 'ls projects' to see available projects.` };
      }
      return { output: `Command not found: ${command}. Type 'help' for available commands.` };
    }
  }
}

const quickCmds = ['help', 'whoami', 'ls', 'cat skills.txt', 'cat socials.txt', 'fortune', 'clear', 'exit'];

export const TerminalSection = ({ onBack }: Props) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Command[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    if (trimmed === 'clear') {
      setHistory([]);
      setInput('');
      setCommandHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(null);
      return;
    }

    const result = handleCommand(trimmed, onBack);
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(null);
    if (result.output !== '') {
      setHistory((prev) => [...prev, { input: trimmed, output: result.output, isHtml: result.isHtml }]);
    }
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      setHistoryIndex((prev) => {
        const idx = prev === null ? commandHistory.length - 1 : prev - 1;
        if (idx >= 0) { setInput(commandHistory[idx]); return idx; }
        return prev;
      });
    } else if (e.key === 'ArrowDown') {
      setHistoryIndex((prev) => {
        if (prev === null) return null;
        const idx = prev + 1;
        if (idx < commandHistory.length) { setInput(commandHistory[idx]); return idx; }
        setInput(''); return null;
      });
    }
  };

  return (
    <section className="min-h-screen flex flex-col pt-20 pb-4">
      <div className="container mx-auto px-4 md:px-16 flex flex-col h-full flex-1">

        {/* Header */}
        <div className="flex items-center justify-between mb-3 md:mb-6">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-xs uppercase tracking-widest transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </motion.button>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-500 uppercase tracking-[0.35em] text-xs mb-1"
        >
          Terminal
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="text-xl md:text-4xl font-bold text-white mb-3 md:mb-6"
        >
          Dheepak's OS.
        </motion.h2>

        {/* Terminal body */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex-1 rounded-xl border border-white/10 bg-black/60 backdrop-blur-sm overflow-hidden flex flex-col"
          style={{ minHeight: '55vh' }}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 px-3 md:px-4 py-2.5 border-b border-white/10 bg-white/5">
            <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/70" />
            <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/70" />
            <span className="ml-2 text-[11px] md:text-xs text-gray-500 font-mono">dheepak@portfolio ~</span>
          </div>

          {/* Output */}
          <div
            ref={terminalRef}
            className="flex-1 p-3 md:p-4 overflow-y-auto font-mono text-xs md:text-sm text-gray-200"
          >
            <div className="mb-3 text-green-400 text-xs md:text-sm">
              Welcome to Dheepak's OS! Type <span className="text-white">'help'</span> for commands.
            </div>

            {history.map((cmd, i) => (
              <div key={i} className="mb-2.5">
                <div className="flex items-center gap-1.5 text-green-400">
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs md:text-sm">{cmd.input}</span>
                </div>
                {cmd.isHtml ? (
                  <div
                    className="mt-1 whitespace-pre-wrap text-gray-300 pl-5 text-xs md:text-sm [&_a]:text-blue-400 [&_a]:underline"
                    dangerouslySetInnerHTML={{ __html: cmd.output }}
                  />
                ) : (
                  <div className="mt-1 whitespace-pre-wrap text-gray-300 pl-5 text-xs md:text-sm break-words">{cmd.output}</div>
                )}
              </div>
            ))}

            {/* Input line */}
            <form
              onSubmit={(e) => { e.preventDefault(); submit(input); }}
              className="flex items-center gap-1.5 text-green-400"
            >
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-white caret-green-400 text-xs md:text-sm"
                style={{ fontSize: '16px' }}
                autoComplete="off"
                spellCheck={false}
              />
            </form>
          </div>
        </motion.div>

        {/* Mobile quick-tap commands */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex md:hidden gap-2 overflow-x-auto pt-3 pb-1 scrollbar-hide"
        >
          {quickCmds.map((cmd) => (
            <button
              key={cmd}
              onClick={() => submit(cmd)}
              className="shrink-0 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-[11px] font-mono active:bg-white/15 transition-colors"
            >
              {cmd}
            </button>
          ))}
        </motion.div>

      </div>
    </section>
  );
};
