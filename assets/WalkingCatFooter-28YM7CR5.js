import{a as e}from"./rolldown-runtime-CNC7AqOf.js";import{c as t,l as n,o as r,s as i}from"./vendor-framer-motion-Dq5rXPG2.js";import{l as a}from"./index-C0C0PTuD.js";var o=e(n(),1),s=`/assets/cat_tiles-CKwd1cmH.png`,c=t();function l(){let{config:e}=a(),t=e?.catAccentColor||`#00E5FF`,n=e?.catMessage||`You've reached the end! The developer is out walking his cat.`,[l,d]=(0,o.useState)(!1),f=(0,o.useRef)(null);return(0,o.useEffect)(()=>{let e,t=!1,n=null,r=e=>{!t||!f.current||(n||=requestAnimationFrame(()=>{if(n=null,!f.current)return;let t=f.current.getBoundingClientRect(),r=t.left+t.width/2,i=t.top+t.height/2,a=Math.sqrt((e.clientX-r)**2+(e.clientY-i)**2);d(e=>a<150&&!e?!0:a>=150&&e?!1:e)}))};return f.current&&(e=new IntersectionObserver(e=>{t=e[0].isIntersecting},{threshold:0}),e.observe(f.current)),window.addEventListener(`mousemove`,r),()=>{window.removeEventListener(`mousemove`,r),e&&e.disconnect(),n&&cancelAnimationFrame(n)}},[]),(0,c.jsxs)(`div`,{className:`relative flex w-full flex-col items-center justify-center overflow-hidden py-24 opacity-80 transition-opacity duration-500 hover:opacity-100`,children:[(0,c.jsx)(`style`,{dangerouslySetInnerHTML:{__html:`
        :root {
          --cat-color: ${t};
        }
        
        @keyframes walk-animation {
          from { transform: translate(0px, 0px); }
          to { transform: translate(0px, -2400px); }
        }

        @keyframes sit-animation {
          from { transform: translate(-400px, 0px); }
          to { transform: translate(-400px, -1000px); }
        }

        .cat-container {
          width: 400px;
          height: 200px;
          overflow: hidden;
          position: relative;
        }

        .cat-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 1600px; /* full intrinsic width */
          height: 2591px; /* full intrinsic height */
          will-change: transform;
        }

        .walking .cat-image {
          animation: walk-animation 2s steps(12) infinite;
        }

        .sitting .cat-image {
          animation: sit-animation 0.8s steps(5) forwards;
        }

        @keyframes treadmill {
          0% { transform: translateX(0%); }
          100% { transform: translateX(50%); }
        }
        
        .treadmill-track {
          display: flex;
          width: 200%;
          margin-left: -100%;
          /* Move right to give illusion of cat walking left */
          animation: treadmill 2s infinite linear;
          will-change: transform;
        }
        
        .treadmill-paused {
          animation-play-state: paused;
        }
        
        .neon-glow {
          box-shadow: 0 0 8px var(--cat-color), 0 0 16px var(--cat-color)80;
          background-color: var(--cat-color);
        }
        
        .neon-text {
          color: var(--cat-color);
          text-shadow: 0 0 10px var(--cat-color)80, 0 0 20px var(--cat-color)40;
        }
        
        .neon-svg {
          fill: var(--cat-color);
          filter: drop-shadow(0 0 6px var(--cat-color)) drop-shadow(0 0 12px var(--cat-color)80);
        }
      `}}),(0,c.jsxs)(`div`,{className:`relative flex w-full max-w-md flex-col items-center justify-end`,ref:f,children:[(0,c.jsx)(`div`,{className:`pointer-events-none relative z-10 mb-[2px] flex h-[80px] w-full items-end justify-center`,children:(0,c.jsxs)(`div`,{className:`cat-container absolute bottom-0 origin-bottom ${l?`sitting`:`walking`}`,style:{transform:`scale(0.45)`},children:[(0,c.jsx)(i,{children:l&&(0,c.jsx)(r.div,{initial:{opacity:0,scale:.5,y:10},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.8,y:10},transition:{type:`spring`,stiffness:200,damping:15},className:`absolute right-20 top-10 z-50 rounded-2xl rounded-br-none border-4 border-[var(--cat-color)] bg-[#0A0A0A] px-6 py-3 font-mono text-3xl font-bold text-[var(--cat-color)] shadow-[0_0_15px_var(--cat-color)]`,children:(0,c.jsx)(r.div,{animate:{y:[0,-5,0]},transition:{duration:2,repeat:1/0,ease:`easeInOut`},children:`Meow!`})})}),(0,c.jsx)(`img`,{src:s,alt:`cat sprite`,width:1600,height:2591,className:`cat-image max-w-none`})]})}),(0,c.jsxs)(`div`,{className:`absolute bottom-0 left-0 flex h-16 w-full items-end overflow-hidden`,children:[(0,c.jsx)(`div`,{className:`pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-[#F8F9FA] via-transparent to-[#F8F9FA] dark:from-[#0A0A0A] dark:via-transparent dark:to-[#0A0A0A]`}),(0,c.jsxs)(`div`,{className:`treadmill-track relative z-0 ${l?`treadmill-paused`:``}`,children:[(0,c.jsxs)(`div`,{className:`relative flex w-1/2 items-end`,children:[(0,c.jsx)(`div`,{className:`neon-glow h-[1px] w-full`}),(0,c.jsxs)(`div`,{className:`absolute bottom-3 flex w-full justify-around pr-20 opacity-40`,children:[(0,c.jsx)(u,{className:`neon-svg h-3 w-3 rotate-12`}),(0,c.jsx)(u,{className:`neon-svg mt-3 h-3 w-3 rotate-12`}),(0,c.jsx)(u,{className:`neon-svg h-3 w-3 rotate-12`}),(0,c.jsx)(u,{className:`neon-svg mt-3 h-3 w-3 rotate-12`})]})]}),(0,c.jsxs)(`div`,{className:`relative flex w-1/2 items-end`,children:[(0,c.jsx)(`div`,{className:`neon-glow h-[1px] w-full`}),(0,c.jsxs)(`div`,{className:`absolute bottom-3 flex w-full justify-around pr-20 opacity-40`,children:[(0,c.jsx)(u,{className:`neon-svg h-3 w-3 rotate-12`}),(0,c.jsx)(u,{className:`neon-svg mt-3 h-3 w-3 rotate-12`}),(0,c.jsx)(u,{className:`neon-svg h-3 w-3 rotate-12`}),(0,c.jsx)(u,{className:`neon-svg mt-3 h-3 w-3 rotate-12`})]})]})]})]})]}),(0,c.jsx)(`p`,{className:`neon-text mt-8 max-w-sm px-4 text-center font-mono text-sm font-medium tracking-wide transition-all duration-700 md:text-base`,children:l?``:n})]})}function u({className:e}){return(0,c.jsxs)(`svg`,{viewBox:`0 0 24 24`,className:e,xmlns:`http://www.w3.org/2000/svg`,children:[(0,c.jsx)(`path`,{d:`M11 2a2 2 0 0 0-2 2v2a2 2 0 1 0 4 0V4a2 2 0 0 0-2-2z`}),(0,c.jsx)(`path`,{d:`M18.3 4.7a2 2 0 0 0-2.8 0l-1.4 1.4a2 2 0 0 0 2.8 2.8l1.4-1.4a2 2 0 0 0 0-2.8z`}),(0,c.jsx)(`path`,{d:`M5.7 4.7a2 2 0 0 1 2.8 0l1.4 1.4a2 2 0 0 1-2.8 2.8L5.7 7.5a2 2 0 0 1 0-2.8z`}),(0,c.jsx)(`path`,{d:`M12 11c-2.8 0-5 2.2-5 5s2.2 6 5 6 5-2.2 5-6-2.2-5-5-5z`})]})}export{l as t};