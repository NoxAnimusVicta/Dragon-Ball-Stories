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
      return {angle,dx:Math.cos(angle),dy:Math.sin(angle),x:center.x+Math.cos(angle)*179*scale,y:center.y+Math.sin(angle)*179*scale};
    });
    const canvas = document.createElement('canvas'); canvas.className='wish-effects'; canvas.setAttribute('aria-hidden','true');
    const ratio = Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(width*ratio); canvas.height=Math.round(height*ratio);
    screen.append(canvas);
    const ctx=canvas.getContext('2d');
    if (!ctx) { finish(); return; }
    ctx.scale(ratio,ratio);
    // Rasterise gradients once. Reusing textures keeps the same glow without
    // asking a phone to shade seven large radial gradients on every frame.
    function texture(size, paint) {
      const image=document.createElement('canvas');image.width=image.height=size;
      const brush=image.getContext('2d');paint(brush,size);return image;
    }
    const glow=texture(512,(brush,size)=>{
      const r=size/2,g=brush.createRadialGradient(r,r,r*.12,r,r,r);
      g.addColorStop(0,'rgba(255,255,235,1)');g.addColorStop(.22,'rgba(255,238,124,.85)');
      g.addColorStop(.5,'rgba(255,180,15,.38)');g.addColorStop(1,'rgba(255,170,0,0)');
      brush.fillStyle=g;brush.fillRect(0,0,size,size);
    });
    const spheres=[['#ffe27a','#ffb41d','#db7209'],['#ffe27a','#ffd849','#db7209'],
      ['#fffef3','#ffd849','#db7209'],['#fffef3','#fff5b2','#ffd13a']].map(colors=>texture(256,(brush,size)=>{
      const r=size/2-2,c=size/2,g=brush.createRadialGradient(c-r*.25,c-r*.3,r*.05,c,c,r);
      colors.forEach((color,i)=>g.addColorStop([0,.64,1][i],color));brush.fillStyle=g;
      brush.beginPath();brush.arc(c,c,r,0,Math.PI*2);brush.fill();
    }));
    const stars=starLayouts.map(layout=>texture(256,(brush,size)=>{
      brush.translate(size/2,size/2);brush.scale(126/35,126/35);brush.fillStyle='#bc2c16';
      for(const [sx,sy] of layout){brush.beginPath();for(let k=0;k<10;k++){
        const a=-Math.PI/2+k*Math.PI/5,d=k%2?2.15:5;
        const x=sx+Math.cos(a)*d,y=sy+Math.sin(a)*d;k?brush.lineTo(x,y):brush.moveTo(x,y);
      }brush.closePath();brush.fill();}
    }));
    const rim=texture(256,(brush,size)=>{
      brush.strokeStyle='rgba(143,62,8,.7)';brush.lineWidth=1.5*126/radius;
      brush.beginPath();brush.arc(size/2,size/2,126,0,Math.PI*2);brush.stroke();
    });
    const spikes=texture(512,(brush,size)=>{
      brush.translate(size/2,size/2);brush.fillStyle='#fffbd6';const r=size/5.4;
      for(let k=0;k<4;k++){brush.rotate(Math.PI/2);brush.beginPath();brush.moveTo(-r*.09,0);
        brush.lineTo(0,-r*2.7);brush.lineTo(r*.09,0);brush.closePath();brush.fill();}
    });
    const backdrop=document.createElement('canvas');backdrop.width=canvas.width;backdrop.height=canvas.height;
    backdrop.className='wish-effects';backdrop.style.zIndex='1';
    const backgroundBrush=backdrop.getContext('2d');backgroundBrush.scale(ratio,ratio);
    const background=backgroundBrush.createRadialGradient(width*.5,height*.48,0,width*.5,height*.48,Math.max(width,height)*.78);
    background.addColorStop(0,'#ffbd39');background.addColorStop(.46,'#f99015');background.addColorStop(1,'#ed6610');
    backgroundBrush.fillStyle=background;backgroundBrush.fillRect(0,0,width,height);screen.append(backdrop);
    const distance=Math.hypot(width,height)+radius*8;
    const duration=2050, animations=[];
    // All charge and ball motion runs on compositor layers. The only canvas
    // repainted during playback is the brief, changing shape of the flight tails.
    function frames(sample) {
      const times=new Set([0,920,1040,1230,1420,1680,1880,duration]);
      for(let t=0;t<duration;t+=24)times.add(t);
      return [...times].sort((a,b)=>a-b).map(t=>({offset:t/duration,...sample(t)}));
    }
    function motion(node,sample) {
      const animation=node.animate(frames(sample),{duration,fill:'both',easing:'linear'});
      animation.pause();animations.push(animation);
    }
    function sprite(parent,source,x,y,size,z=0) {
      const node=document.createElement('canvas');node.width=source.width;node.height=source.height;
      node.getContext('2d').drawImage(source,0,0);node.setAttribute('aria-hidden','true');
      Object.assign(node.style,{position:'absolute',left:`${x-size/2}px`,top:`${y-size/2}px`,width:`${size}px`,height:`${size}px`,pointerEvents:'none',zIndex:String(z),willChange:'transform, opacity'});
      parent.append(node);return node;
    }
    const burst=sprite(screen,glow,center.x,center.y,orbit.width*1.56,2);
    motion(burst,t=>({opacity:Math.sin(clamp((t-920)/500)*Math.PI)*.25}));
    motion(backdrop,t=>({opacity:1-smooth((t-1230)/650)}));
    origins.forEach((o,index)=>{
      const group=document.createElement('div');group.setAttribute('aria-hidden','true');
      Object.assign(group.style,{position:'absolute',left:`${o.x}px`,top:`${o.y}px`,width:'0',height:'0',zIndex:'3',willChange:'transform',pointerEvents:'none'});screen.append(group);
      motion(group,t=>{const charge=smooth(t/920),departure=clamp((t-1040)/640),travel=departure**3*distance;
        return {transform:`translate3d(${o.dx*travel}px,${o.dy*travel}px,0) scale(${1+.13*Math.sin(charge*Math.PI/2)-.23*departure})`};});
      const halo=sprite(group,glow,0,0,radius*7);
      motion(halo,t=>{const charge=smooth(t/920);return {opacity:charge*.92,transform:`scale(${(1.7+charge*1.8)/3.5})`};});
      const extent=radius*128/126;
      spheres.forEach((source,i)=>{
        const core=sprite(group,source,0,0,extent*2);
        if(i)motion(core,t=>({opacity:smooth((smooth(t/920)-[0,.28,.43,.73][i])/.14)}));
      });
      const edge=sprite(group,rim,0,0,extent*2);motion(edge,t=>({opacity:1-smooth(t/920)}));
      const marks=sprite(group,stars[index],0,0,extent*2);motion(marks,t=>({opacity:1-smooth((smooth(t/920)-.34)/.5)}));
      const flare=sprite(group,spikes,0,0,radius*5.4);
      motion(flare,t=>{const rays=smooth((smooth(t/920)-.55)/.45)*(1-clamp((t-1040)/640));
        return {opacity:rays*.7,transform:`scale(${(2.1+rays*.6)/2.7})`};});
    });
    // Let the tap prompt dissolve into the charge instead of disappearing at
    // the SVG-to-animation handoff. Use the same compositor timeline as the balls.
    motion(screen.querySelector('.wish-center'),t=>{
      const fade=smooth(t/480);
      return {opacity:1-fade,transform:`scale(${1+fade*.06})`};
    });
    motion(screen.querySelector('#launch-title'),t=>({opacity:1-smooth(t/400)}));
    screen.classList.add('granting');
    // Start all layers on the same timeline after their first paint; audio was
    // already unlocked synchronously by the original tap.
    let begun;
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
      if (elapsed>=duration) {finish();return;}
      // The charge phase needs no canvas drawing or full-screen repaint.
      if(elapsed>=1040&&elapsed<=1750){
        ctx.clearRect(0,0,width,height);
        const departure=clamp((elapsed-1040)/640),travel=departure**3*distance;
        const r=radius*(1.13-.23*departure);
        origins.forEach(o=>{
          const x=o.x+o.dx*travel,y=o.y+o.dy*travel,margin=r*12;
          if(x < -margin || x > width+margin || y < -margin || y > height+margin)return;
          trail(x,y,o.angle,Math.min(travel*.72,r*10),r,smooth(departure*5));
        });
      }else if(elapsed>1750){canvas.style.visibility='hidden';}
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(time=>{
      begun=time;
      for(const animation of animations){animation.play();animation.startTime=document.timeline.currentTime;}
      requestAnimationFrame(draw);
    });
  }

  function launch() {
    if (entering) return; entering=true;
    document.body.classList.remove('launch-pending'); document.body.classList.add('launch-entering');
    // Run inside the actual release gesture, without waiting for a synthetic click.
    document.dispatchEvent(new CustomEvent('launch-adventure'));
    trigger.setAttribute('aria-disabled','true');
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches||document.body.classList.contains('motion-paused');
    if(reduced){finish();return;}
    try{animate();}catch{finish();}
  }
  let held=null;
  function inside(point) {
    const box=trigger.getBoundingClientRect();
    return point.clientX>=box.left&&point.clientX<=box.right&&point.clientY>=box.top&&point.clientY<=box.bottom;
  }
  function cancelPress() {
    held=null;
    if(!entering)trigger.classList.remove('is-pressed');
  }
  function release(point) {
    held=null;
    if(inside(point))launch();else cancelPress();
  }
  // Safari delivers touchend directly, even when hover/focus handling consumes
  // the subsequent compatibility click. Keep audio in that trusted release event.
  trigger.addEventListener('touchstart',event=>{
    if(entering)return;
    if(event.touches.length!==1){cancelPress();return;}
    if(held)return;
    held={kind:'touch',id:event.changedTouches[0].identifier};
    trigger.classList.add('is-pressed');
  },{passive:true});
  window.addEventListener('touchmove',event=>{
    if(held?.kind!=='touch')return;
    const touch=[...event.changedTouches].find(t=>t.identifier===held.id);
    if(touch)trigger.classList.toggle('is-pressed',inside(touch));
  },{passive:true});
  window.addEventListener('touchend',event=>{
    if(held?.kind!=='touch')return;
    const touch=[...event.changedTouches].find(t=>t.identifier===held.id);
    if(touch)release(touch);
  },{passive:true});
  window.addEventListener('touchcancel',()=>{if(held?.kind==='touch')cancelPress();},{passive:true});
  trigger.addEventListener('pointerdown',event=>{
    if(entering||event.pointerType==='touch'||!event.isPrimary||event.button!==0||held)return;
    held={kind:'pointer',id:event.pointerId};trigger.classList.add('is-pressed');
  });
  window.addEventListener('pointermove',event=>{
    if(held?.kind==='pointer'&&event.pointerId===held.id)trigger.classList.toggle('is-pressed',inside(event));
  });
  window.addEventListener('pointerup',event=>{
    if(held?.kind==='pointer'&&event.pointerId===held.id)release(event);
  });
  window.addEventListener('pointercancel',event=>{
    if(held?.kind==='pointer'&&event.pointerId===held.id)cancelPress();
  });
  window.addEventListener('blur',cancelPress);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelPress();});
  trigger.addEventListener('blur',()=>{if(!held)cancelPress();});
  trigger.addEventListener('keydown',event=>{
    if(!entering&&(event.key===' '||event.key==='Enter'))trigger.classList.add('is-pressed');
  });
  trigger.addEventListener('contextmenu',event=>event.preventDefault());
  // Keyboard and assistive technology retain native button activation. Physical
  // pointer clicks are already handled on release and must never launch twice.
  trigger.addEventListener('click',event=>{
    if(event.detail===0&&!event.pointerType&&!held)launch();
  });
})();
