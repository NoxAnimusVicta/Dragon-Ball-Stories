'use strict';
(() => {
  const screen = document.getElementById('launch-dialog');
  const trigger = document.getElementById('launch-adventure');
  let entering = false;
  screen.close(); screen.showModal(); trigger.focus({preventScroll:true});
  screen.addEventListener('cancel', event => event.preventDefault());
  const clamp = value => Math.max(0, Math.min(1, value));
  const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
  const starLayouts = [
    [[0,0]], [[-8,0],[8,0]], [[0,-8],[-9,7],[9,7]],
    [[-8,-8],[8,-8],[-8,8],[8,8]], [[-10,-10],[10,-10],[0,0],[-10,10],[10,10]],
    [[-10,-11],[10,-11],[-10,0],[10,0],[-10,11],[10,11]],
    [[0,0],...Array.from({length:6},(_,i)=>[Math.cos(i*Math.PI/3)*16,Math.sin(i*Math.PI/3)*16])]
  ];
  function finish() {
    document.querySelector('meta[name="theme-color"]').content = '#133441';
    document.documentElement.classList.remove('launch-theme');
    screen.close(); screen.remove();
    document.body.classList.remove('launch-entering');
    document.getElementById('main').focus({preventScroll:true});
  }
  function animate() {
    const bounds = screen.getBoundingClientRect();
    const orbit = screen.querySelector('.wish-orbit').getBoundingClientRect();
    const width = bounds.width, height = bounds.height;
    const center = {x:orbit.left-bounds.left+orbit.width/2,y:orbit.top-bounds.top+orbit.height/2};
    const scale = orbit.width/520, radius = 35*scale;
    const origins = Array.from({length:7},(_,i)=>{
      const angle = -Math.PI/2+i*Math.PI*2/7;
      return {angle,x:center.x+Math.cos(angle)*179*scale,y:center.y+Math.sin(angle)*179*scale};
    });
    const canvas = document.createElement('canvas'); canvas.className='wish-effects'; canvas.setAttribute('aria-hidden','true');
    const ratio = Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(width*ratio); canvas.height=Math.round(height*ratio);
    screen.append(canvas);
    const ctx=canvas.getContext('2d');
    if (!ctx) { finish(); return; }
    ctx.scale(ratio,ratio);
    screen.classList.add('granting');
    const begun=performance.now();
    const distance=Math.hypot(width,height)+radius*8;
    function halo(x,y,r,strength) {
      const g=ctx.createRadialGradient(x,y,r*.12,x,y,r);
      g.addColorStop(0,`rgba(255,255,235,${strength})`);
      g.addColorStop(.22,`rgba(255,238,124,${strength*.85})`);
      g.addColorStop(.5,`rgba(255,180,15,${strength*.38})`);
      g.addColorStop(1,'rgba(255,170,0,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
    }
    function trail(x,y,angle,length,r,alpha) {
      ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.globalAlpha=alpha;
      const g=ctx.createLinearGradient(-length,0,r,0);
      g.addColorStop(0,'rgba(255,158,0,0)');g.addColorStop(.45,'rgba(255,202,36,.25)');g.addColorStop(.86,'rgba(255,237,139,.85)');g.addColorStop(1,'#fffef1');
      ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-length,0);ctx.quadraticCurveTo(-length*.22,-r*.7,r*.2,-r*.86);ctx.arc(r*.2,0,r*.86,-Math.PI/2,Math.PI/2);ctx.quadraticCurveTo(-length*.22,r*.7,-length,0);ctx.fill();
      ctx.fillStyle='#fffde4';ctx.globalAlpha*=.8;ctx.beginPath();ctx.moveTo(-length*.78,0);ctx.lineTo(0,-r*.2);ctx.lineTo(r*.45,0);ctx.lineTo(0,r*.2);ctx.closePath();ctx.fill();ctx.restore();
    }
    function draw(time) {
      if (!screen.isConnected) return;
      const elapsed=time-begun;
      if (elapsed>=2050) {finish();return;}
      ctx.clearRect(0,0,width,height);
      const reveal=smooth((elapsed-1230)/650);
      ctx.globalAlpha=1-reveal;
      const background=ctx.createRadialGradient(width*.5,height*.48,0,width*.5,height*.48,Math.max(width,height)*.78);
      background.addColorStop(0,'#ffbd39');background.addColorStop(.46,'#f99015');background.addColorStop(1,'#ed6610');
      ctx.fillStyle=background;ctx.fillRect(0,0,width,height);ctx.globalAlpha=1;
      const charge=smooth(elapsed/920);
      const departure=clamp((elapsed-1040)/640);
      const travel=departure*departure*departure*distance;
      const sphereScale=1+.13*Math.sin(charge*Math.PI/2)-.23*departure;
      // One broad light bloom at release, without a full-screen white flash.
      const burst=Math.sin(clamp((elapsed-920)/500)*Math.PI);
      if(burst>0)halo(center.x,center.y,orbit.width*.78,burst*.25);
      origins.forEach((o,index)=>{
        const x=o.x+Math.cos(o.angle)*travel,y=o.y+Math.sin(o.angle)*travel,r=radius*sphereScale;
        if(departure>0)trail(x,y,o.angle,Math.min(travel*.72,r*10),r,smooth(departure*5));
        if(charge>0)halo(x,y,r*(1.7+charge*1.8),charge*.92);
        // Keep a saturated amber edge until the release; the core becomes true white-gold.
        const sphere=ctx.createRadialGradient(x-r*.25,y-r*.3,r*.05,x,y,r);
        sphere.addColorStop(0,charge>.5?'#fffef3':'#ffe27a');
        sphere.addColorStop(.64,charge>.8?'#fff5b2':charge>.35?'#ffd849':'#ffb41d');
        sphere.addColorStop(1,charge>.8?'#ffd13a':'#db7209');
        ctx.fillStyle=sphere;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle=`rgba(143,62,8,${.7*(1-charge)})`;ctx.lineWidth=1.5;ctx.stroke();
        ctx.globalAlpha=1-smooth((charge-.34)/.5);ctx.fillStyle='#bc2c16';
        for(const [sx,sy] of starLayouts[index]) {
          ctx.beginPath();for(let k=0;k<10;k++){const a=-Math.PI/2+k*Math.PI/5,d=(k%2?2.15:5)*scale*sphereScale;const px=x+sx*scale*sphereScale+Math.cos(a)*d,py=y+sy*scale*sphereScale+Math.sin(a)*d;k?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();ctx.fill();
        }
        ctx.globalAlpha=1;
        // Narrow luminous spikes make the peak feel energetic instead of foggy.
        const rays=smooth((charge-.55)/.45)*(1-departure);
        if(rays>0){ctx.save();ctx.translate(x,y);ctx.fillStyle='#fffbd6';ctx.globalAlpha=rays*.7;for(let k=0;k<4;k++){ctx.rotate(Math.PI/2);ctx.beginPath();ctx.moveTo(-r*.09,0);ctx.lineTo(0,-r*(2.1+rays*.6));ctx.lineTo(r*.09,0);ctx.closePath();ctx.fill();}ctx.restore();}
      });
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }
  trigger.addEventListener('click', () => {
    if (entering) return; entering=true;
    document.body.classList.remove('launch-pending'); document.body.classList.add('launch-entering');
    document.dispatchEvent(new CustomEvent('launch-adventure'));
    trigger.setAttribute('aria-disabled','true');
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches||document.body.classList.contains('motion-paused');
    if(reduced){finish();return;}
    try{animate();}catch{finish();}
  });
})();
