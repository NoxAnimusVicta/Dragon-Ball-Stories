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
  function prepareScene() {
    const duration=2350, animations=[], geometry={radius:35,distance:1000};
    const surface=document.createElement('div');surface.className='wish-surface';surface.setAttribute('aria-hidden','true');screen.prepend(surface);
    const stage=document.createElement('span');stage.className='wish-balls';stage.setAttribute('aria-hidden','true');trigger.prepend(stage);
    function texture(width,height,paint) {
      const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
      paint(canvas.getContext('2d'),width,height);return canvas;
    }
    const glow=texture(512,512,(ctx,w)=>{
      const r=w/2,g=ctx.createRadialGradient(r,r,r*.12,r,r,r);
      g.addColorStop(0,'#ffffeb');g.addColorStop(.22,'rgba(255,238,124,.85)');
      g.addColorStop(.5,'rgba(255,180,15,.38)');g.addColorStop(1,'rgba(255,170,0,0)');
      ctx.fillStyle=g;ctx.fillRect(0,0,w,w);
    });
    const cores=starLayouts.map(layout=>texture(256,256,(ctx,w)=>{
      const c=w/2,r=126,g=ctx.createRadialGradient(c-r*.32,c-r*.48,0,c-r*.32,c-r*.48,r*1.52);
      g.addColorStop(0,'#fff7b4');g.addColorStop(.32,'#ffcd43');g.addColorStop(.72,'#f58a08');g.addColorStop(1,'#c55005');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(c,c,r,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#7e300d';ctx.lineWidth=2*r/35;ctx.stroke();
      ctx.translate(c,c);ctx.scale(r/35,r/35);ctx.fillStyle='#b72b18';
      for(const [sx,sy] of layout){ctx.beginPath();for(let k=0;k<10;k++){
        const angle=-Math.PI/2+k*Math.PI/5,d=k%2?2.15:5;
        const x=sx+Math.cos(angle)*d,y=sy+Math.sin(angle)*d;k?ctx.lineTo(x,y):ctx.moveTo(x,y);
      }ctx.closePath();ctx.fill();}
    }));
    const lit=texture(256,256,(ctx,w)=>{
      const c=w/2,r=126,g=ctx.createRadialGradient(c-r*.25,c-r*.3,r*.05,c,c,r);
      g.addColorStop(0,'#fffef3');g.addColorStop(.64,'#fff5b2');g.addColorStop(1,'#ffd13a');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(c,c,r,0,Math.PI*2);ctx.fill();
    });
    const spikes=texture(512,512,(ctx,w)=>{
      ctx.translate(w/2,w/2);ctx.fillStyle='#fffbd6';const r=w/5.4;
      for(let k=0;k<4;k++){ctx.rotate(Math.PI/2);ctx.beginPath();ctx.moveTo(-r*.09,0);
        ctx.lineTo(0,-r*2.7);ctx.lineTo(r*.09,0);ctx.closePath();ctx.fill();}
    });
    const tail=texture(896,192,(ctx)=>{
      ctx.translate(800,96);ctx.scale(80,80);
      const g=ctx.createLinearGradient(-10,0,1,0);
      g.addColorStop(0,'rgba(255,158,0,0)');g.addColorStop(.45,'rgba(255,202,36,.25)');
      g.addColorStop(.86,'rgba(255,237,139,.85)');g.addColorStop(1,'#fffef1');
      ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-10,0);ctx.quadraticCurveTo(-2.2,-.7,.2,-.86);
      ctx.arc(.2,0,.86,-Math.PI/2,Math.PI/2);ctx.quadraticCurveTo(-2.2,.7,-10,0);ctx.fill();
      ctx.fillStyle='#fffde4';ctx.globalAlpha=.8;ctx.beginPath();ctx.moveTo(-7.8,0);ctx.lineTo(0,-.2);
      ctx.lineTo(.45,0);ctx.lineTo(0,.2);ctx.closePath();ctx.fill();
    });
    function layer(parent,source,extent=1,className='wish-sprite') {
      const node=document.createElement('canvas');node.className=className;
      node.width=source.width;node.height=source.height;node.getContext('2d').drawImage(source,0,0);
      Object.assign(node.style,{left:`${(1-extent)*50}%`,top:`${(1-extent)*50}%`,width:`${extent*100}%`,height:`${extent*100}%`});
      parent.append(node);return node;
    }
    function frames(sample) {
      const times=new Set([0,80,600,800,1080,1040,1230,1420,1680,2200,duration]);
      for(let t=0;t<duration;t+=32)times.add(t);
      return [...times].sort((a,b)=>a-b).map(t=>({offset:t/duration,...sample(t)}));
    }
    function motion(node,sample) {
      const animation=node.animate(frames(sample),{duration,fill:'both',easing:'linear'});
      animation.pause();animation.currentTime=0;animations.push({animation,sample});return animation;
    }
    const charge=t=>smooth(t/1080),departure=t=>clamp((t-1040)/640);
    const size=t=>1+.13*Math.sin(charge(t)*Math.PI/2)-.23*departure(t);
    motion(surface,t=>({opacity:1-smooth((t-1300)/900)}));
    motion(screen.querySelector('.wish-grain'),t=>({opacity:.19*(1-smooth(t/900))}));
    const bloom=layer(stage,glow,1.56,'wish-sprite wish-bloom');
    motion(bloom,t=>({opacity:Math.sin(clamp((t-940)/500)*Math.PI)*.25}));
    cores.forEach((core,index)=>{
      const angle=-Math.PI/2+index*Math.PI*2/7,dx=Math.cos(angle),dy=Math.sin(angle);
      const group=document.createElement('span');group.className='wish-orb';
      Object.assign(group.style,{left:`${(260+dx*179-35)/520*100}%`,top:`${(260+dy*179-35)/520*100}%`});stage.append(group);
      motion(group,t=>{const travel=departure(t)**3*geometry.distance;
        return {transform:`translate3d(${dx*travel}px,${dy*travel}px,0) scale(${size(t)})`};});
      const trailAxis=document.createElement('span');trailAxis.className='wish-tail-axis';trailAxis.style.transform=`rotate(${angle}rad)`;group.append(trailAxis);
      const trail=layer(trailAxis,tail);Object.assign(trail.style,{left:'-450%',top:'-10%',width:'560%',height:'120%',transformOrigin:'89.285714% 50%'});
      motion(trail,t=>{const d=departure(t),travel=d**3*geometry.distance,length=clamp(travel*.72/(geometry.radius*size(t)*10));
        return {opacity:smooth(d*5),transform:`scaleX(${length})`};});
      const halo=layer(group,glow,3.5);
      motion(halo,t=>({opacity:charge(t)*.92,transform:`scale(${(1.7+charge(t)*1.8)/3.5})`}));
      const body=layer(group,core,128/126,'wish-sprite wish-body');
      motion(body,t=>({opacity:1-smooth((t-620)/380)}));
      const light=layer(group,lit,128/126);
      motion(light,t=>({opacity:smooth(t/800)}));
      const flare=layer(group,spikes,2.7);
      motion(flare,t=>{const rays=smooth((t-560)/520)*(1-departure(t));
        return {opacity:rays*.7,transform:`scale(${(2.1+rays*.6)/2.7})`};});
    });
    motion(screen.querySelector('.wish-center'),t=>{
      const fade=smooth((t-80)/600);return {opacity:1-fade,transform:`scale(${1+fade*.06})`};
    });
    motion(screen.querySelector('#launch-title'),t=>({opacity:1-smooth((t-80)/520)}));
    function resize() {
      if(entering)return;
      const box=screen.getBoundingClientRect();geometry.radius=trigger.getBoundingClientRect().width*35/520;
      geometry.distance=Math.hypot(box.width,box.height)+geometry.radius*8;
      for(const {animation,sample} of animations)animation.effect.setKeyframes(frames(sample));
    }
    resize();
    const observer=new ResizeObserver(resize);observer.observe(screen);observer.observe(trigger);
    screen.classList.add('scene-ready');
    return {start(){
      observer.disconnect();screen.classList.add('granting');
      const start=document.timeline.currentTime;
      // Everything is already painted and prepared. Release only starts a
      // shared compositor timeline; there is no replacement artwork or draw loop.
      for(const {animation} of animations){animation.play();animation.startTime=start;}
      animations[0].animation.finished.then(finish).catch(finish);
    }};
  }
  let sequence;
  try{sequence=prepareScene();}catch{/* Native launch remains usable if effects are unavailable. */}

  function launch() {
    if (entering) return; entering=true;
    document.body.classList.remove('launch-pending'); document.body.classList.add('launch-entering');
    // Run inside the actual release gesture, without waiting for a synthetic click.
    document.dispatchEvent(new CustomEvent('launch-adventure'));
    trigger.setAttribute('aria-disabled','true');
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches||document.body.classList.contains('motion-paused');
    if(reduced){finish();return;}
    try{if(sequence)sequence.start();else finish();}catch{finish();}
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
