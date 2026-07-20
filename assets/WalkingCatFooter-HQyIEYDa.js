import{a as e}from"./rolldown-runtime-CNC7AqOf.js";import{c as t,s as n}from"./vendor-framer-motion-lHs1mEaC.js";import{n as r}from"./index-CcF1UDLG.js";var i=e(t(),1),a=`/assets/cat_tiles-CKwd1cmH.png`,o=n();function s(){let{config:e}=r(),t=e?.catAccentColor||`#00E5FF`,n=e?.catMessage||`You've reached the end! The developer is out walking his cat.`,[s,l]=(0,i.useState)(!1),u=(0,i.useRef)(null);return(0,i.useEffect)(()=>{let e=e=>{if(!u.current)return;let t=u.current.getBoundingClientRect(),n=t.left+t.width/2,r=t.top+t.height/2,i=Math.sqrt((e.clientX-n)**2+(e.clientY-r)**2);l(e=>i<150&&!e?!0:i>=150&&e?!1:e)};return window.addEventListener(`mousemove`,e),()=>window.removeEventListener(`mousemove`,e)},[]),(0,o.jsxs)(`div`,{className:`relative flex w-full flex-col items-center justify-center overflow-hidden py-24 opacity-80 transition-opacity duration-500 hover:opacity-100`,children:[(0,o.jsx)(`style`,{dangerouslySetInnerHTML:{__html:`
        :root {
          --cat-color: ${t};
        }
        
        @keyframes walk-animation {
          from { background-position: 0 0; }
          to { background-position: 0 -2400px; }
        }

        @keyframes sit-animation {
          from { background-position: -400px 0; }
          to { background-position: -400px -1000px; }
        }

        .cat-sprite {
          width: 400px;
          height: 200px;
          background: url("${a}") 0 0 no-repeat;
        }

        .walking {
          animation: walk-animation 2s steps(12) infinite;
        }

        .sitting {
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
      `}}),(0,o.jsxs)(`div`,{className:`relative flex w-full max-w-md flex-col items-center justify-end`,ref:u,children:[(0,o.jsx)(`div`,{className:`pointer-events-none relative z-10 mb-[2px] flex h-[80px] w-full items-end justify-center`,children:(0,o.jsx)(`div`,{className:`cat-sprite absolute bottom-0 origin-bottom ${s?`sitting`:`walking`}`,style:{transform:`scale(0.45)`}})}),(0,o.jsxs)(`div`,{className:`absolute bottom-0 left-0 flex h-16 w-full items-end overflow-hidden`,children:[(0,o.jsx)(`div`,{className:`pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-white via-transparent to-white dark:from-[#0A0A0A] dark:via-transparent dark:to-[#0A0A0A]`}),(0,o.jsxs)(`div`,{className:`treadmill-track relative z-0 ${s?`treadmill-paused`:``}`,children:[(0,o.jsxs)(`div`,{className:`relative flex w-1/2 items-end`,children:[(0,o.jsx)(`div`,{className:`neon-glow h-[1px] w-full`}),(0,o.jsxs)(`div`,{className:`absolute bottom-3 flex w-full justify-around pr-20 opacity-40`,children:[(0,o.jsx)(c,{className:`neon-svg h-3 w-3 rotate-12`}),(0,o.jsx)(c,{className:`neon-svg mt-3 h-3 w-3 rotate-12`}),(0,o.jsx)(c,{className:`neon-svg h-3 w-3 rotate-12`}),(0,o.jsx)(c,{className:`neon-svg mt-3 h-3 w-3 rotate-12`})]})]}),(0,o.jsxs)(`div`,{className:`relative flex w-1/2 items-end`,children:[(0,o.jsx)(`div`,{className:`neon-glow h-[1px] w-full`}),(0,o.jsxs)(`div`,{className:`absolute bottom-3 flex w-full justify-around pr-20 opacity-40`,children:[(0,o.jsx)(c,{className:`neon-svg h-3 w-3 rotate-12`}),(0,o.jsx)(c,{className:`neon-svg mt-3 h-3 w-3 rotate-12`}),(0,o.jsx)(c,{className:`neon-svg h-3 w-3 rotate-12`}),(0,o.jsx)(c,{className:`neon-svg mt-3 h-3 w-3 rotate-12`})]})]})]})]})]}),(0,o.jsx)(`p`,{className:`neon-text mt-8 max-w-sm px-4 text-center font-mono text-sm font-medium tracking-wide transition-all duration-700 md:text-base`,children:s?`Meow?`:n})]})}function c({className:e}){return(0,o.jsxs)(`svg`,{viewBox:`0 0 24 24`,className:e,xmlns:`http://www.w3.org/2000/svg`,children:[(0,o.jsx)(`path`,{d:`M11 2a2 2 0 0 0-2 2v2a2 2 0 1 0 4 0V4a2 2 0 0 0-2-2z`}),(0,o.jsx)(`path`,{d:`M18.3 4.7a2 2 0 0 0-2.8 0l-1.4 1.4a2 2 0 0 0 2.8 2.8l1.4-1.4a2 2 0 0 0 0-2.8z`}),(0,o.jsx)(`path`,{d:`M5.7 4.7a2 2 0 0 1 2.8 0l1.4 1.4a2 2 0 0 1-2.8 2.8L5.7 7.5a2 2 0 0 1 0-2.8z`}),(0,o.jsx)(`path`,{d:`M12 11c-2.8 0-5 2.2-5 5s2.2 6 5 6 5-2.2 5-6-2.2-5-5-5z`})]})}export{s as t};