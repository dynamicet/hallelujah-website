// Local design fixtures. These mappings are proposals, not hospital service claims.
const topics = [
  {name:'Allergies', aliases:['allergy'], area:'Care guidance', route:'guidance'},
  {name:'Asthma', aliases:[], area:'Care guidance', route:'guidance'},
  {name:'Back pain', aliases:['backache','aching back','back hurts'], area:'Physical therapy & rehabilitation', route:'appointment'},
  {name:'Diabetes', aliases:['blood sugar'], area:'Endocrinology', route:'appointment'},
  {name:'Digestive concerns', aliases:['stomach','digestion','stomach pain','stomach ache'], area:'Gastroenterology', route:'appointment'},
  {name:'Everyday wellbeing', aliases:['home remedies','self care','self-care'], area:'Everyday care', route:'selfcare'},
  {name:'Headaches', aliases:['headache'], area:'Care guidance', route:'guidance'},
  {name:'High blood pressure', aliases:['hypertension','blood pressure'], area:'Internal medicine', route:'appointment'},
  {name:'Joint pain', aliases:['aching joints'], area:'Orthopedics', route:'appointment'},
  {name:'Sleep concerns', aliases:['sleep','sleeping','difficulty sleeping'], area:'Care guidance', route:'guidance'},
  {name:'Thyroid concerns', aliases:['thyroid'], area:'Endocrinology', route:'appointment'},
  {name:'Vision concerns', aliases:['eyes','eye care','blurry vision'], area:'Ophthalmology', route:'appointment'},
];
const $ = (selector) => document.querySelector(selector);
const normalize = (text) => text.normalize('NFKC').toLocaleLowerCase('en').replace(/\s+/gu,' ').trim();
let selected = null, letter = '', query = '', visible = [], previousTrigger, page = 1;
let mobileMode = 'search';
const pageSize = 3;
const labels = {appointment:'Appointment options', guidance:'Start with a conversation', selfcare:'Everyday care guide'};
function renderAlphabet(){
  $('#alphabet').replaceChildren(...Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ', value=>{
    const button=document.createElement('button');button.type='button';button.textContent=value;
    button.disabled=!topics.some(topic=>topic.name.startsWith(value));button.setAttribute('aria-label',`Topics beginning with ${value}`);button.setAttribute('aria-pressed',String(letter===value));
    button.addEventListener('click',()=>{mobileMode='browse';letter=value;query='';page=1;$('#search').value='';render();if(matchMedia('(max-width:700px)').matches)$('#change-letter').focus();else [...document.querySelectorAll('#alphabet button')].find(item=>item.textContent===value)?.focus();});return button;
  }));
}
function render(){
  const active=Boolean(letter||query);
  $('#guide').classList.remove('is-reading');
  $('#guide').dataset.mobileMode=mobileMode;
  $('#mode-search').setAttribute('aria-pressed',String(mobileMode==='search'));
  $('#mode-browse').setAttribute('aria-pressed',String(mobileMode==='browse'));
  $('.guide-layout').classList.toggle('has-results',active);
  $('.guide-layout').classList.remove('editing-controls');
  $('#change-letter').hidden=!active||mobileMode!=='browse';
  $('#change-letter').textContent=letter?`Letter ${letter} · Change letter`:'Choose a letter instead';
  $('#change-letter').setAttribute('aria-expanded','false');
  visible=active?topics.filter(topic=>(!letter||topic.name.startsWith(letter))&&(!query||normalize([topic.name,...topic.aliases].join(' ')).includes(query))):[];
  page=Math.max(1,Math.min(page,Math.ceil(visible.length/pageSize)||1));
  renderAlphabet();
  $('#matches').hidden=!active;$('#reader').hidden=true;
  $('.guide-layout').classList.remove('reading');
  $('#matches-title').textContent=letter?'Topics & care':'Matching topics';
  $('#result-letter').textContent=letter;
  $('#result-letter').hidden=!letter;
  $('#result-count').textContent=active?`${visible.length} ${visible.length===1?'topic':'topics'}${query?` for “${$('#search').value.trim()}”`:''}`:'';
  $('#results').replaceChildren(...visible.slice((page-1)*pageSize,page*pageSize).map(topic=>{
    const button=document.createElement('button');button.type='button';button.className='topic';button.setAttribute('aria-controls','reader');
    const text=document.createElement('span'), name=document.createElement('span'), sub=document.createElement('small'), arrow=document.createElement('span');name.className='topic-title';name.textContent=topic.name;sub.textContent=labels[topic.route];arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');text.append(name,sub);button.append(text,arrow);
    button.addEventListener('click',()=>{selected=topic;previousTrigger=topic.name;$('#matches').hidden=true;$('#reader').hidden=false;$('.guide-layout').classList.add('reading');$('#guide').classList.add('is-reading');renderReader();$('#reader').focus({preventScroll:true});if(matchMedia('(max-width:700px)').matches)$('#reader').scrollIntoView({block:'nearest'});});return button;
  }));
  $('#pagination').hidden=visible.length<=pageSize;
  $('#page-position').textContent=`${page} of ${Math.ceil(visible.length/pageSize)||1}`;
  $('#previous').disabled=page===1;$('#next').disabled=page*pageSize>=visible.length;
  if(active&&!visible.length){
    const empty=document.createElement('div');empty.className='empty';const heading=document.createElement('strong');heading.textContent='No matching topics';const text=document.createElement('p');text.textContent='Try another word, or choose a letter.';const reset=document.createElement('button');reset.type='button';reset.textContent='Start over';reset.addEventListener('click',resetSearch);empty.append(heading,text,reset);$('#results').append(empty);
  }
}
function setTab(id,focus=false){
  for(const tab of document.querySelectorAll('[role=tab]')){const active=tab.id===`tab-${id}`;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;document.getElementById(tab.getAttribute('aria-controls')).hidden=!active;if(active&&focus)tab.focus();}
}
function renderReader(){
  $('#topic-title').textContent=selected.name;
  $('#read-more-topic').textContent=selected.name.toLowerCase();
  $('#full-guide-title').textContent=selected.name;
  $('#topic-summary').textContent=selected.route==='selfcare'?'Space for everyday health, with practical guidance and a clear route to help.':`A starting point for understanding ${selected?.name.toLowerCase()??'your concern'} and exploring your care options.`;
  $('#topic-intro').textContent=selected.route==='guidance'?'You can begin with a conversation. Ask for help finding the appropriate service and understanding what to do next.':'Start with what matters to you: the concern you want to understand, the questions you have and the support you are looking for.';
  $('#full-guide-summary').textContent=$('#topic-summary').textContent;
  const descriptions={appointment:`Explore care with ${selected?.area??'the care team'}.`,guidance:'Ask for help choosing the right service.',selfcare:'Explore everyday care and when to seek help.'};
  $('#care-description').textContent=descriptions[selected.route];
  $('#care-action').textContent=selected.route==='appointment'?'Request an appointment ↗':selected.route==='guidance'?'Call for guidance ↗':'Explore everyday care ↗';
  $('.care-secondary').hidden=selected.route==='guidance';
  setTab('overview');
  $('#reader').classList.remove('changing');requestAnimationFrame(()=>$('#reader').classList.add('changing'));
}
function resetSearch(){letter='';query='';page=1;selected=null;$('#search').value='';render();if(matchMedia('(max-width:700px)').matches&&mobileMode==='browse')$('#mode-browse').focus();else $('#search').focus();}
function handoff(route){
  const copy={appointment:[`Care for ${selected?.name.toLowerCase()??'your concern'}`,`Continue to an appointment request with ${selected?.area??'the care team'}. The request would carry the selected service forward without requiring you to repeat your search.`],guidance:['Start with a conversation','A call would connect you with staff who can help you choose a service. Phone guidance is distinct from a clinical phone consultation.'],selfcare:['Everyday care, with context','This route would open clinically reviewed self-care information, including its limits and when to seek help. This prototype contains no treatment instructions.']};
  $('#handoff-title').textContent=copy[route][0];$('#handoff-copy').textContent=copy[route][1];$('#handoff').showModal();
}
$('#search-form').addEventListener('submit',event=>{event.preventDefault();mobileMode='search';query=normalize($('#search').value);letter='';page=1;render();});
$('#search').addEventListener('input',()=>{mobileMode='search';query=normalize($('#search').value);letter='';page=1;render();});
for(const mode of ['search','browse'])$(`#mode-${mode}`).addEventListener('click',()=>{if(mobileMode===mode)return;mobileMode=mode;letter='';query='';page=1;selected=null;$('#search').value='';render();});
$('#reset').addEventListener('click',resetSearch);
$('#change-letter').addEventListener('click',()=>{const open=$('.guide-layout').classList.toggle('editing-controls');$('#change-letter').setAttribute('aria-expanded',String(open));if(open)[...document.querySelectorAll('#alphabet button')].find(button=>button.getAttribute('aria-pressed')==='true')?.focus();});
$('#header-guidance').addEventListener('click',()=>handoff('guidance'));
$('#previous').addEventListener('click',()=>{page--;render();$('#next').disabled?$('#previous').focus():$('#next').focus();});
$('#next').addEventListener('click',()=>{page++;render();$('#previous').focus();});
$('#back').addEventListener('click',()=>{render();const topic=[...document.querySelectorAll('.topic')].find(button=>button.querySelector('.topic-title').textContent===previousTrigger);topic?.focus();});
for(const tab of document.querySelectorAll('[role=tab]')){tab.addEventListener('click',()=>setTab(tab.getAttribute('aria-controls')));tab.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();setTab(event.key==='Home'?'overview':event.key==='End'?'prepare':tab.id==='tab-overview'?'prepare':'overview',true);}});}
$('#care-action').addEventListener('click',()=>handoff(selected.route));
$('#guidance').addEventListener('click',()=>handoff('guidance'));
$('#read-more').addEventListener('click',()=>{setTab('overview');$('#full-guide').showModal();$('#full-guide').scrollTop=0;});
$('#full-guide').addEventListener('close',()=>$('#read-more').focus({preventScroll:true}));
render();
