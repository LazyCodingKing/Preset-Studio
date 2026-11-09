const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const source=fs.readFileSync(require('node:path').join(__dirname,'../dist/backend.js'),'utf8');
function fixture(){
 let handler; const sent=[],calls=[]; const preset={id:'p',name:'Preset',provider:'loom',engine:'classic',cache_revision:3,parameters:{temperature:.5},prompt_order:[],prompts:{},metadata:{}};
 const spindle={onFrontendMessage:fn=>handler=fn,sendToFrontend:(msg,user)=>sent.push({msg,user}),presets:{list:async()=>({data:[preset]}),get:async()=>preset,getActive:async()=>({preset_id:'p',block_states:{a:false}}),create:async x=>(calls.push(['create',x]),{...x,id:'new',cache_revision:1}),update:async(id,x)=>(calls.push(['update',id,x]),{...preset,...x})},chats:{list:async()=>({data:[]}),getActive:async()=>null},connections:{list:async()=>[]},userStorage:{getJson:async()=>null,setJson:async()=>{}},assemble:async x=>(calls.push(['assemble',x]),{messages:[{role:'system',content:'assembled'}],breakdown:[]}),generate:{dryRun:async x=>({messages:[],parameters:{},input:x}),quietStream:async function*(x){calls.push(['stream',x]);yield {type:'token',token:'Hello'};yield {type:'done',content:'Hello',usage:{total_tokens:2}}}}};
 vm.runInNewContext(source,{spindle,AbortController});
 return {handler,sent,calls,preset,spindle};
}
test('draft test assembles unsaved blocks and appends custom text without mutating chat',async()=>{const f=fixture();const p={...f.preset,prompt_order:[{id:'a',enabled:false}]};await f.handler({action:'run',requestId:'r',chatId:'c',customMessage:'New turn',preset:p},'u');const a=f.calls.find(x=>x[0]==='assemble')[1];const s=f.calls.find(x=>x[0]==='stream')[1];assert.equal(a.blocks[0].enabled,false);assert.equal(s.messages[1].content,'New turn');assert.equal(s.parameters.temperature,.5);assert.deepEqual(f.sent.map(x=>x.msg.type),['assembled','token','result']);assert.ok(f.sent.every(x=>x.user==='u'))});
test('save updates with expected revision, and copy creates',async()=>{const f=fixture();await f.handler({action:'save',requestId:'a',preset:f.preset},'u');await f.handler({action:'save',requestId:'b',preset:f.preset,copy:true},'u');assert.equal(f.calls[0][2].expected_cache_revision,3);assert.equal(f.calls[1][0],'create');assert.equal(f.calls[1][1].id,undefined)});
test('preview requires chat and surfaces the error',async()=>{const f=fixture();await f.handler({action:'preview',requestId:'r',preset:f.preset},'u');assert.equal(f.sent[0].msg.type,'error');assert.match(f.sent[0].msg.error,/Select a chat/)});

test('operator-scoped requests carry the originating user through every API',async()=>{
 const f=fixture(); const user='operator-user'; const check=id=>assert.equal(id,user); const s=f.spindle;
 s.presets.list=async o=>(check(o.userId),{data:[]}); s.chats.list=async o=>(check(o.userId),{data:[]}); s.chats.getActive=async id=>(check(id),null); s.connections.list=async id=>(check(id),[]); s.userStorage.getJson=async (_p,o)=>(check(o.userId),null); s.userStorage.setJson=async (_p,_v,o)=>check(o.userId);
 s.presets.get=async (_id,u)=>(check(u),f.preset); s.presets.getActive=async (_id,u)=>(check(u),{}); s.presets.create=async (_p,u)=>(check(u),f.preset); s.presets.update=async (_id,_p,u)=>(check(u),f.preset); s.assemble=async (_input,u)=>(check(u),{messages:[],breakdown:[]}); s.generate.dryRun=async (_input,u)=>(check(u),{}); s.generate.quietStream=async function*(input){check(input.userId);yield {type:'done',content:'ok'}};
 for(const [action,extra] of [['load',{}],['get',{id:'p'}],['active',{chatId:'c'}],['draft',{draft:{}}],['save',{preset:f.preset}],['save',{preset:f.preset,copy:true}],['dry',{chatId:'c'}],['preview',{chatId:'c',preset:f.preset}],['run',{chatId:'c',preset:f.preset}]]){await f.handler({action,requestId:action+Math.random(),...extra},user); assert.notEqual(f.sent.at(-1).msg.type,'error',`${action}: ${f.sent.at(-1).msg.error}`)}
});

test('template library is isolated by user and survives later reads',async()=>{
 const f=fixture();const storage=new Map();
 f.spindle.userStorage.getJson=async (_path,opts)=>storage.get(opts.userId) ?? opts.fallback;
 f.spindle.userStorage.setJson=async (_path,value,opts)=>{storage.set(opts.userId,structuredClone(value))};
 const template={id:'t1',name:'Style',entries:[{block:{id:'b',name:'Tone',content:'Write vividly'},values:{tone:'warm'}}]};
 await f.handler({action:'template-save',requestId:'1',template},'alice');
 await f.handler({action:'load',requestId:'2'},'bob');
 assert.equal(f.sent.at(-1).msg.data.templates.length,0);
 await f.handler({action:'load',requestId:'3'},'alice');
 assert.equal(f.sent.at(-1).msg.data.templates[0].entries[0].values.tone,'warm');
 await f.handler({action:'template-delete',requestId:'4',id:'t1'},'alice');
 assert.equal(f.sent.at(-1).msg.data.length,0);
});

test('translation protects nested macros and uses the requesting user connection',async()=>{
 const f=fixture();let seen;
 f.spindle.generate.quiet=async input=>{seen=input;const body=JSON.parse(input.messages[1].content);assert.equal(body.target_language,'English');assert.ok(!body.text.includes('{{'));return {content:body.text.replace('Bonjour','Hello')}};
 await f.handler({action:'translate',requestId:'t',text:'Bonjour {{if::{{char}}}}',language:'English',connectionId:'c'},'alice');
 assert.equal(seen.userId,'alice');assert.equal(seen.connection_id,'c');assert.equal(f.sent.at(-1).msg.data.content,'Hello {{if::{{char}}}}');
});
test('translation rejects output that loses a protected macro',async()=>{
 const f=fixture();f.spindle.generate.quiet=async()=>({content:'Hello'});
 await f.handler({action:'translate',requestId:'t',text:'Bonjour {{char}}',language:'English'},'alice');
 assert.equal(f.sent.at(-1).msg.type,'error');assert.match(f.sent.at(-1).msg.error,/protected macro/);
});

test('translation preferences persist per user',async()=>{
 const f=fixture();const saved=new Map();
 f.spindle.userStorage.setJson=async (path,value,opts)=>saved.set(`${opts.userId}:${path}`,value);
 f.spindle.userStorage.getJson=async (path,opts)=>saved.get(`${opts.userId}:${path}`) ?? opts.fallback;
 await f.handler({action:'preferences',requestId:'p',translationLanguage:'French',translationConnection:'conn'},'alice');
 await f.handler({action:'load',requestId:'l'},'alice');
 assert.equal(f.sent.at(-1).msg.data.preferences.translationLanguage,'French');
 assert.equal(f.sent.at(-1).msg.data.preferences.translationConnection,'conn');
 await f.handler({action:'load',requestId:'l2'},'bob');
 assert.equal(f.sent.at(-1).msg.data.preferences.translationLanguage,undefined);
});

test('translation rejects a truncated response instead of offering it as complete',async()=>{
 const f=fixture();f.spindle.generate.quiet=async()=>({content:'Part of the translation',finish_reason:'length'});
 await f.handler({action:'translate',requestId:'t',text:'Long prompt',language:'English'},'alice');
 assert.equal(f.sent.at(-1).msg.type,'error');assert.match(f.sent.at(-1).msg.error,/before completing/);
});
