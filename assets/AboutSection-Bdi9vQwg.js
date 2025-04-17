import{j as e,m as t,E as l,A as o,X as c,r as n}from"./index-B-kB_qAH.js";import{A as d}from"./award-B8rqQFtt.js";const h=()=>e.jsxs(t.div,{initial:{opacity:0,x:-20},whileInView:{opacity:1,x:0},viewport:{once:!0},className:"flex items-start space-x-6",children:[e.jsx(t.div,{whileHover:{scale:1.05},className:`relative w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 
          transition-transform hover:shadow-xl hover:shadow-white/10`,children:e.jsx("img",{src:"/profile.jpg",alt:"Profile",className:"w-full h-full object-cover"})}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-2xl font-bold mb-2",children:"DHEEPAK KARAN ES"}),e.jsx("p",{className:"text-gray-400",children:"Optimizing algorithms for scalability and efficiency."})]})]}),x=["Machine Learning","Deep Learning","Python","TensorFlow","PyTorch","Scikit-learn","Pandas","NumPy","Data Science"],m=()=>e.jsx(t.div,{initial:{opacity:0},whileInView:{opacity:1},viewport:{once:!0},className:"flex flex-wrap gap-2",children:x.map(i=>e.jsx("span",{className:"px-3 py-1.5 bg-white/5 rounded-lg text-sm text-gray-300 border border-white/10 hover:bg-white/10 transition-colors",children:i},i))}),p=({certification:i,onClick:s})=>e.jsxs(t.div,{whileHover:{scale:1.02},className:"bg-white/5 p-4 rounded-lg cursor-pointer border border-white/10 hover:bg-white/10 transition-colors",onClick:s,children:[e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsx(d,{className:"w-6 h-6 text-white"}),e.jsx(l,{className:"w-4 h-4 text-gray-400"})]}),e.jsx("h4",{className:"text-base font-semibold mt-2 mb-1 text-white",children:i.title}),e.jsx("p",{className:"text-gray-400 text-xs mb-1",children:i.issuer}),e.jsx("p",{className:"text-gray-500 text-xs",children:i.date})]}),f=({certification:i,onClose:s})=>i?e.jsx(o,{children:e.jsx(t.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:"fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4",onClick:s,children:e.jsxs(t.div,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},className:"bg-black/80 rounded-lg w-full max-w-2xl p-6 border border-white/10",onClick:a=>a.stopPropagation(),children:[e.jsxs("div",{className:"flex justify-between items-center mb-6",children:[e.jsx("h3",{className:"text-2xl font-bold text-white",children:i.title}),e.jsx("button",{onClick:s,className:"p-2 hover:bg-white/10 rounded-full transition-colors",children:e.jsx(c,{size:24,className:"text-white"})})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("img",{src:i.image,alt:i.title,className:"w-full h-48 object-cover rounded-lg mb-4"}),e.jsxs("div",{children:[e.jsx("p",{className:"text-gray-300 mb-4",children:i.description}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-gray-400",children:i.date}),e.jsxs("a",{href:i.verifyUrl,target:"_blank",rel:"noopener noreferrer",className:"flex items-center gap-2 text-white hover:text-gray-300",children:[e.jsx("span",{children:"Verify Badge"}),e.jsx(l,{size:16})]})]})]})]})]})})}):null,u=[{id:"1",title:"AWS Solutions Architect",issuer:"Amazon Web Services",date:"Dec 2023",description:"Professional certification for designing distributed systems on AWS.",image:"https://images.unsplash.com/photo-1451187580459-43490279c0fa?fit=crop&w=800&h=400",verifyUrl:"https://aws.amazon.com/verification"},{id:"2",title:"Google Cloud Professional",issuer:"Google Cloud",date:"Nov 2023",description:"Expert-level certification for Google Cloud Platform services.",image:"https://images.unsplash.com/photo-1484557985045-edf25e08da73?fit=crop&w=800&h=400",verifyUrl:"https://cloud.google.com/certification"},{id:"3",title:"Meta Frontend Developer",issuer:"Meta",date:"Oct 2023",description:"Advanced certification in modern frontend development practices.",image:"https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b?fit=crop&w=800&h=400",verifyUrl:"https://developers.facebook.com/certification"}],g=({onCertificationClick:i,selectedCertification:s})=>e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-xl font-semibold",children:"Certifications"}),e.jsx("div",{className:"grid grid-cols-2 gap-3 max-w-lg",children:u.map((a,r)=>e.jsx(t.div,{initial:{opacity:0,y:10},whileInView:{opacity:1,y:0},viewport:{once:!0},transition:{delay:r*.1},children:e.jsx(p,{certification:a,onClick:()=>i(a)})},a.id))}),e.jsx(f,{certification:s,onClose:()=>i(null)})]}),y=()=>{const[i,s]=n.useState(null);return e.jsx("section",{id:"about",className:"py-8 bg-black text-white",children:e.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative",children:[e.jsx(t.h2,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0},className:"text-4xl font-bold mb-8 text-center",children:"About Me"}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-8",children:[e.jsxs("div",{className:"space-y-6",children:[e.jsx(h,{}),e.jsxs("div",{className:"space-y-4",children:[e.jsx(t.p,{initial:{opacity:0},whileInView:{opacity:1},viewport:{once:!0},className:"text-lg text-gray-300",children:"Whispers of machines, tuned to the pulse of data, they dream in algorithms and sculpt the future. With minds entwined in neural whispers, they weave stories of intelligence unseen. In the symphony of code and cognition, they seek to unlock the mysteries of tomorrow through artificial vision."}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-3",children:"Technical Skills"}),e.jsx(m,{})]})]})]}),e.jsx(g,{onCertificationClick:s,selectedCertification:i})]})]})})};export{y as default};
