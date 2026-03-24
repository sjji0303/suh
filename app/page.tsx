"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import html2canvas from "html2canvas";

const Icon=({type,size=20}:{type:string;size?:number})=>{const s:any={width:size,height:size,strokeWidth:1.5,fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round"};const i:any={folder:<svg viewBox="0 0 24 24" {...s}><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,test:<svg viewBox="0 0 24 24" {...s}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,settings:<svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09"/></svg>,logout:<svg viewBox="0 0 24 24" {...s}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,user:<svg viewBox="0 0 24 24" {...s}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,menu:<svg viewBox="0 0 24 24" {...s}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,close:<svg viewBox="0 0 24 24" {...s}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,left:<svg viewBox="0 0 24 24" {...s}><polyline points="15 18 9 12 15 6"/></svg>,right:<svg viewBox="0 0 24 24" {...s}><polyline points="9 18 15 12 9 6"/></svg>,upload:<svg viewBox="0 0 24 24" {...s}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,plus:<svg viewBox="0 0 24 24" {...s}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,back:<svg viewBox="0 0 24 24" {...s}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,users:<svg viewBox="0 0 24 24" {...s}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/></svg>,home:<svg viewBox="0 0 24 24" {...s}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,search:<svg viewBox="0 0 24 24" {...s}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,bell:<svg viewBox="0 0 24 24" {...s}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,cart:<svg viewBox="0 0 24 24" {...s}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>,msg:<svg viewBox="0 0 24 24" {...s}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,coin:<svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="10"/><path d="M12 6v12M8 10h8M8 14h8"/></svg>};return i[type]||null;};
async function uploadImage(file:File,path:string){const ext=file.name.split(".").pop();const fn=`${path}_${Date.now()}.${ext}`;const{error}=await supabase.storage.from("images").upload(fn,file,{upsert:true});if(error){console.error("Upload error:",error);return null;}return supabase.storage.from("images").getPublicUrl(fn).data.publicUrl;}

/* ═══ LOGIN ═══ */
function LoginScreen({onLogin,settings}:{onLogin:(id:string,pw:string)=>Promise<string>;settings:any}){
  const[id,setId]=useState("");const[pw,setPw]=useState("");const[err,setErr]=useState("");const[ld,setLd]=useState(false);const[ready,setReady]=useState(false);
  const go=async()=>{setLd(true);setErr(await onLogin(id,pw));setLd(false);};
  const bg=(settings.background_image&&settings.background_image.length>5)?settings.background_image:"/lecture-bg.jpg";
  const pi=settings.profile_image||"/profile.png";const nm=settings.profile_name||"서정인 수학";const bio=(settings.profile_bio||"").split("\\n").join("\n");
  useEffect(()=>{setTimeout(()=>setReady(true),100);},[]);
  return(<div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
    {/* 배경 — 흐리게 + 어둡게 + 확대 */}
    <div className="absolute inset-0 z-0 scale-110" style={{backgroundImage:`url(${bg})`,backgroundSize:"cover",backgroundPosition:"center",filter:"blur(4px)"}}/>
    <div className="absolute inset-0 z-0 bg-gradient-to-br from-black/70 via-black/50 to-[#6c63ff]/20"/>
    {/* 장식 원형 글로우 */}
    <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#6c63ff]/20 rounded-full blur-3xl z-0"/>
    <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#6c63ff]/10 rounded-full blur-3xl z-0"/>

    {/* PC 레이아웃 */}
    <div className={`hidden md:flex relative z-10 w-full max-w-4xl gap-6 transition-all duration-700 ${ready?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}>
      {/* 왼쪽 프로필 카드 */}
      <div className="w-[320px] bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl text-center flex-shrink-0 border border-white/20">
        <div className="relative inline-block mb-5"><img src={pi} alt="" className="w-28 h-28 rounded-full shadow-2xl object-cover border-4 border-white/30"/><div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-400 rounded-full border-3 border-white shadow-lg"/></div>
        <h2 className="text-2xl font-bold text-white mb-2">{nm}</h2>
        <div className="w-12 h-0.5 bg-[#6c63ff] mx-auto mb-4 rounded-full"/>
        {bio&&<div className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{bio}</div>}
        <div className="mt-6 pt-5 border-t border-white/10">
          <p className="text-xs text-white/40">수학의 자신감을 키우는 곳</p>
        </div>
      </div>
      {/* 오른쪽 로그인 폼 */}
      <div className="flex-1 bg-white/95 backdrop-blur-xl rounded-3xl p-10 shadow-2xl flex flex-col justify-center">
        <div className="mb-8">
          <p className="text-sm text-[#6c63ff] font-semibold mb-2 tracking-wider">WELCOME</p>
          <h1 className="text-2xl font-bold mb-1"><span className="text-slate-800">흐릿한 시작을, </span><span className="text-[#6c63ff]">뚜렷한 선택으로</span></h1>
        </div>
        <div className="space-y-4 max-w-sm">
          <div><label className="text-xs font-semibold text-slate-500 mb-1.5 block">아이디</label><input className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/10 transition-all" value={id} onChange={e=>{setId(e.target.value);setErr("");}} placeholder="이름+학부모번호뒷4자리" onKeyDown={e=>e.key==="Enter"&&go()}/></div>
          <div><label className="text-xs font-semibold text-slate-500 mb-1.5 block">비밀번호</label><input type="password" className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/10 transition-all" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} placeholder="비밀번호" onKeyDown={e=>e.key==="Enter"&&go()}/></div>
          {err&&<p className="text-red-400 text-xs bg-red-50 px-3 py-2 rounded-lg">{err}</p>}
          <button onClick={go} disabled={ld} className="w-full bg-gradient-to-r from-[#6c63ff] to-[#5a52e0] text-white py-3.5 rounded-xl font-semibold text-sm disabled:opacity-50 shadow-lg shadow-[#6c63ff]/25 hover:shadow-xl hover:shadow-[#6c63ff]/30 transition-all active:scale-[0.98]">{ld?"로그인 중...":"로그인"}</button>
        </div>
      </div>
    </div>

    {/* 모바일 레이아웃 */}
    <div className={`md:hidden relative z-10 w-full max-w-sm transition-all duration-700 ${ready?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}>
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 text-center mb-4">
        <img src={pi} alt="" className="w-20 h-20 rounded-full mx-auto mb-3 shadow-xl object-cover border-3 border-white/30"/>
        <h2 className="text-xl font-bold text-white">{nm}</h2>
        <p className="text-xs text-white/50 mt-1">수학의 자신감을 키우는 곳</p>
      </div>
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-7 shadow-2xl">
        <p className="text-xs text-[#6c63ff] font-semibold mb-1 tracking-wider">WELCOME</p>
        <h1 className="text-lg font-bold mb-5"><span className="text-slate-800">흐릿한 시작을, </span><span className="text-[#6c63ff]">뚜렷한 선택으로</span></h1>
        <div className="space-y-3">
          <input className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6c63ff] transition-all" value={id} onChange={e=>{setId(e.target.value);setErr("");}} placeholder="아이디" onKeyDown={e=>e.key==="Enter"&&go()}/>
          <input type="password" className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6c63ff] transition-all" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} placeholder="비밀번호" onKeyDown={e=>e.key==="Enter"&&go()}/>
        </div>
        {err&&<p className="text-red-400 text-xs bg-red-50 px-3 py-2 rounded-lg mt-2">{err}</p>}
        <button onClick={go} disabled={ld} className="w-full bg-gradient-to-r from-[#6c63ff] to-[#5a52e0] text-white py-3 rounded-xl font-semibold text-sm mt-4 shadow-lg shadow-[#6c63ff]/25 active:scale-[0.98] transition-all">{ld?"로그인 중...":"로그인"}</button>
      </div>
    </div>
  </div>);
}

/* ═══ STUDENT VIEW ═══ */
const dayNames=["일","월","화","수","목","금","토"];
function fmtDate(d:string){try{const dt=new Date(d+"T00:00:00");return`${d} (${dayNames[dt.getDay()]})`;}catch{return d;}}

function StudentView({user,logout}:{user:any;logout:()=>void}){
  const[tab,setTab]=useState("grades");const[tests,setTests]=useState<any[]>([]);const[idx,setIdx]=useState(0);const[questions,setQuestions]=useState<any[]>([]);const[results,setResults]=useState<any[]>([]);const[info,setInfo]=useState<any>(null);const[mm,setMm]=useState(false);const[pw,setPw]=useState({n1:"",n2:""});const[pwMsg,setPwMsg]=useState("");
  const[rankHistory,setRankHistory]=useState<{date:string;rank:number;total:number}[]>([]);
  useEffect(()=>{(async()=>{
    // 학생이 속한 반의 시험만 가져오기
    const{data:cm}=await supabase.from("class_members").select("class_group_id").eq("user_id",user.id);
    if(!cm||cm.length===0){setTests([]);return;}
    const gids=cm.map((c:any)=>c.class_group_id);
    const{data}=await supabase.from("tests").select("*").in("class_group_id",gids).order("date",{ascending:false});
    if(data&&data.length>0){setTests(data);ld(data[0]);}
    // 등수 변화 히스토리 로드
    const{data:allInfo}=await supabase.from("test_student_info").select("test_id, rank").eq("student_id",user.id).not("rank","is",null);
    if(allInfo&&data){
      const testMap:any={};data.forEach((t:any)=>{testMap[t.id]=t;});
      // 각 시험의 총 인원수도 가져오기
      const hist:any[]=[];
      for(const si of allInfo){
        const t=testMap[si.test_id];if(!t)continue;
        const{count}=await supabase.from("test_student_info").select("*",{count:"exact",head:true}).eq("test_id",si.test_id).not("rank","is",null);
        hist.push({date:t.date,rank:si.rank,total:count||0});
      }
      hist.sort((a:any,b:any)=>a.date.localeCompare(b.date));
      setRankHistory(hist);
    }
  })();},[]);
  const ld=async(t:any)=>{const sid=user.id;const[q,r,si]=await Promise.all([supabase.from("test_questions").select("*").eq("test_id",t.id).order("question_number"),supabase.from("test_results").select("*").eq("test_id",t.id).eq("student_id",sid),supabase.from("test_student_info").select("*").eq("test_id",t.id).eq("student_id",sid).single()]);if(q.data)setQuestions(q.data);if(r.data)setResults(r.data);setInfo(si.data||null);};
  const nav=(d:number)=>{const n=idx+d;if(n>=0&&n<tests.length){setIdx(n);ld(tests[n]);}};
  const chPw=async()=>{if(pw.n1!==pw.n2){setPwMsg("불일치");return;}await supabase.from("users").update({password:pw.n1}).eq("id",user.id);setPwMsg("변경 완료!");setPw({n1:"",n2:""});};
  const[notices,setNotices]=useState<any[]>([]);
  const[myExams,setMyExams]=useState<any[]>([]);const[showExamAdd,setShowExamAdd]=useState(false);
  const[examForm,setExamForm]=useState({exam_type:"모의고사",exam_name:"",subject:"수학",score:"",total:"",grade:"",memo:"",exam_date:"",q1:"",q2:"",q3:""});
  const[inquiries,setInquiries]=useState<any[]>([]);const[showInqAdd,setShowInqAdd]=useState(false);const[inqForm,setInqForm]=useState({title:"",content:""});const[inqImg,setInqImg]=useState<File|null>(null);const inqImgRef=useRef<HTMLInputElement>(null);
  const[shopItems,setShopItems]=useState<any[]>([]);const[myTokens,setMyTokens]=useState(user.tokens||0);const[purchases,setPurchases]=useState<any[]>([]);
  const fTokens=async()=>{const{data}=await supabase.from("users").select("tokens").eq("id",user.id).single();if(data)setMyTokens(data.tokens||0);};
  useEffect(()=>{if(tab==="notice"){(async()=>{
    const{data:cm}=await supabase.from("class_members").select("class_group_id").eq("user_id",user.id);
    if(!cm||cm.length===0)return;
    const gids=cm.map((c:any)=>c.class_group_id);
    const{data}=await supabase.from("class_notices").select("*, class_groups(name)").in("class_group_id",gids).order("created_at",{ascending:false});
    if(data)setNotices(data);
  })();}if(tab==="myexam"){(async()=>{const{data}=await supabase.from("student_exams").select("*").eq("user_id",user.id).order("exam_date",{ascending:false});if(data)setMyExams(data);})();}if(tab==="inquiry"){(async()=>{const{data}=await supabase.from("inquiries").select("*").eq("user_id",user.id).order("created_at",{ascending:false});if(data)setInquiries(data);})();}if(tab==="shop"){(async()=>{const{data}=await supabase.from("shop_items").select("*").eq("active",true).order("created_at");if(data)setShopItems(data);const{data:p}=await supabase.from("purchases").select("*, shop_items(name)").eq("user_id",user.id).order("created_at",{ascending:false});if(p)setPurchases(p);fTokens();})();}},[tab]);
  const addExam=async()=>{if(!examForm.score)return;const payload={user_id:user.id,exam_type:examForm.exam_type,exam_name:examForm.exam_name,subject:examForm.subject,score:examForm.score,total:examForm.total,grade:examForm.grade,memo:JSON.stringify({q1:examForm.q1,q2:examForm.q2,q3:examForm.q3}),exam_date:examForm.exam_date||""};await supabase.from("student_exams").insert(payload);setExamForm({exam_type:"모의고사",exam_name:"",subject:"수학",score:"",total:"",grade:"",memo:"",exam_date:"",q1:"",q2:"",q3:""});setShowExamAdd(false);const{data}=await supabase.from("student_exams").select("*").eq("user_id",user.id).order("created_at",{ascending:false});if(data)setMyExams(data);};
  const delExam=async(id:number)=>{if(!confirm("삭제?"))return;await supabase.from("student_exams").delete().eq("id",id);const{data}=await supabase.from("student_exams").select("*").eq("user_id",user.id).order("created_at",{ascending:false});if(data)setMyExams(data);};
  const addInquiry=async()=>{if(!inqForm.content)return;let imgUrl="";if(inqImg){imgUrl=await uploadImage(inqImg,`inquiry_${user.id}`)||"";}await supabase.from("inquiries").insert({user_id:user.id,title:inqForm.title,content:inqForm.content+(imgUrl?`\n[IMG]${imgUrl}[/IMG]`:"")});setInqForm({title:"",content:""});setInqImg(null);setShowInqAdd(false);const{data}=await supabase.from("inquiries").select("*").eq("user_id",user.id).order("created_at",{ascending:false});if(data)setInquiries(data);};
  const buyItem=async(item:any)=>{if(myTokens<item.price){alert("서서갈비가 부족합니다!");return;}if(!confirm(`${item.name}을(를) ${item.price} 서서갈비로 구매할까요?`))return;await supabase.from("users").update({tokens:myTokens-item.price}).eq("id",user.id);await supabase.from("purchases").insert({user_id:user.id,item_id:item.id,price:item.price});await supabase.from("token_logs").insert({user_id:user.id,amount:-item.price,reason:`상점 구매: ${item.name}`});fTokens();const{data:p}=await supabase.from("purchases").select("*, shop_items(name)").eq("user_id",user.id).order("created_at",{ascending:false});if(p)setPurchases(p);};
  const test=tests[idx];const rm:any={};results.forEach((r:any)=>{rm[r.question_number]=r.is_correct;});
  const wrong=test?questions.filter(q=>rm[q.question_number]===false).sort((a,b)=>a.correct_rate-b.correct_rate):[];
  const mis=[{id:"grades",icon:"test",label:"성적표"},{id:"notice",icon:"bell",label:"공지사항"},{id:"inquiry",icon:"msg",label:"문의사항"},{id:"myexam",icon:"folder",label:"시험 결과"},{id:"shop",icon:"cart",label:"상점"},{id:"settings",icon:"settings",label:"설정"}];
  return(<div className="min-h-screen bg-white flex">
    <aside className="hidden lg:flex flex-col w-56 border-r border-slate-100 min-h-screen p-4 fixed left-0 top-0 bottom-0 z-40"><div className="flex items-center gap-2 mb-6 px-2"><img src="/logo.png" alt="" className="h-8 object-contain"/></div><nav className="flex-1 space-y-1">{mis.map(m=>(<button key={m.id} onClick={()=>setTab(m.id)} className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium ${tab===m.id?"bg-slate-100 text-slate-900":"text-slate-500 hover:bg-slate-50"}`}><Icon type={m.icon} size={18}/>{m.label}</button>))}</nav><div className="border-t border-slate-100 pt-3"><div className="px-2 mb-2"><p className="text-xs font-semibold">{user.name}</p><p className="text-[10px] text-slate-400">{user.school||""}</p></div><button onClick={logout} className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-50"><Icon type="logout" size={16}/>로그아웃</button></div></aside>
    <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-100 z-40 px-4 py-3 flex justify-between items-center"><img src="/logo.png" alt="" className="h-6"/><button onClick={()=>setMm(!mm)}><Icon type={mm?"close":"menu"} size={22}/></button></div>
    {mm&&<><div onClick={()=>setMm(false)} className="lg:hidden fixed inset-0 bg-black/30 z-40"/><div className="lg:hidden fixed right-0 top-0 bottom-0 w-64 bg-white z-50 p-5 shadow-xl"><div className="flex justify-between items-center mb-6"><span className="font-bold">메뉴</span><button onClick={()=>setMm(false)}><Icon type="close" size={20}/></button></div><nav className="space-y-1">{mis.map(m=>(<button key={m.id} onClick={()=>{setTab(m.id);setMm(false);}} className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium ${tab===m.id?"bg-slate-100 text-slate-900":"text-slate-500"}`}><Icon type={m.icon} size={18}/>{m.label}</button>))}</nav><button onClick={()=>{logout();setMm(false);}} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm text-red-400 mt-4"><Icon type="logout" size={16}/>로그아웃</button></div></>}
    <main className="flex-1 lg:ml-56 pt-14 lg:pt-0 pb-20 lg:pb-0"><div className="max-w-3xl mx-auto p-4 sm:p-5 lg:p-8">
      {tab==="grades"&&<div>{test?<><div className="flex items-center justify-between mb-2"><button onClick={()=>nav(1)} className="p-2 hover:bg-slate-100 rounded-xl"><Icon type="left" size={20}/></button><div className="text-center"><p className="text-xl font-bold">{fmtDate(test.date)}</p><p className="text-sm text-slate-400">{test.title}</p></div><div className="flex items-center gap-1"><button onClick={()=>nav(-1)} className={`p-2 rounded-xl ${idx===0?"text-slate-200":"hover:bg-slate-100"}`} disabled={idx===0}><Icon type="right" size={20}/></button></div></div>
        {/* 학생 정보 + 공유 */}
        <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><span className="text-xs text-[#6c63ff] bg-[#6c63ff]/10 px-2.5 py-1 rounded-lg font-semibold">{test.class_name||""}</span><span className="text-sm font-semibold text-slate-700">{user.school||""} {user.name}</span></div><button onClick={async()=>{try{if(navigator.share){await navigator.share({title:`${user.name} 성적표 - ${test.title}`,text:`${user.name} | ${test.title}\n점수: ${info?.total_score||0}점 | 반평균: ${info?.class_average||0}점\n${window.location.href}`,});} else{await navigator.clipboard.writeText(`${user.name} | ${test.title}\n점수: ${info?.total_score||0}점 | 반평균: ${info?.class_average||0}점`);alert("성적 정보가 복사되었습니다!");}}catch{}}} className="text-xs text-slate-400 hover:text-[#6c63ff] flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg"><Icon type="upload" size={14}/>공유</button></div>
        {results.length>0?<>
          {/* 1. 출석/클리닉/과제/오답 성취도 */}
          {info&&<div className="bg-slate-50 rounded-2xl p-4 mb-4 grid grid-cols-2 sm:grid-cols-4 gap-3"><div className="text-center"><p className="text-xs text-slate-400">출석</p><p className={`text-base font-bold ${info.attendance==="출석"?"text-green-600":info.attendance==="영상"?"text-amber-500":"text-red-500"}`}>{info.attendance||"—"}</p></div><div className="text-center"><p className="text-xs text-slate-400">클리닉</p><p className="text-base font-semibold text-slate-600">{info.clinic_time||"—"}</p></div><div className="text-center"><p className="text-xs text-slate-400">과제 성취도</p><p className="text-base font-semibold text-slate-600">{info.assignment_score||"—"}</p></div><div className="text-center"><p className="text-xs text-slate-400">오답 성취도</p><p className="text-base font-semibold text-slate-600">{info.wrong_answer_score||"—"}</p></div></div>}
          {/* 2. 개인 코멘트 */}
          {info?.comment&&<div className="bg-[#6c63ff]/5 rounded-2xl p-5 mb-4"><p className="text-sm font-semibold text-[#6c63ff] mb-1">개인 코멘트</p><p className="text-base text-slate-700 leading-relaxed whitespace-pre-line">{info.comment}</p></div>}
          {/* 3. 2단: 왼쪽 문항별 결과 / 오른쪽 점수+등수변화 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-50 rounded-2xl p-5"><h3 className="font-semibold text-base mb-3">문항별 결과</h3><div className="space-y-1.5">{questions.map(q=>(<div key={q.question_number} className="flex items-center gap-3 py-1"><span className="text-sm text-slate-400 w-6 text-right">{q.question_number}</span><span className="text-sm text-slate-500 flex-1 truncate">{q.topic||"—"}</span><span className={`text-sm font-bold w-7 text-center ${rm[q.question_number]?"text-blue-600":"text-red-400"}`}>{rm[q.question_number]?"O":"X"}</span><span className="text-xs text-slate-400 w-12 text-right">{q.correct_rate}%</span></div>))}</div></div>
            <div className="space-y-4">
              {info&&<div className="bg-slate-50 rounded-2xl p-5"><div className="grid grid-cols-2 gap-3 text-center"><div><p className="text-xs text-slate-400">내 점수</p><p className="text-2xl font-bold text-[#6c63ff]">{info.total_score}<span className="text-sm font-semibold">점</span></p></div><div><p className="text-xs text-slate-400">반 평균</p><p className="text-2xl font-bold text-slate-600">{info.class_average}<span className="text-sm font-semibold">점</span></p></div><div><p className="text-xs text-slate-400">표준편차</p><p className="text-2xl font-bold text-slate-600">{info.std_dev||"—"}<span className="text-sm font-semibold">{info.std_dev?"점":""}</span></p></div><div><p className="text-xs text-slate-400">최고</p><p className="text-2xl font-bold text-slate-600">{info.class_best}<span className="text-sm font-semibold">점</span></p></div></div></div>}
              {rankHistory.length>=1&&(()=>{
                const data=rankHistory.map(h=>({date:h.date,value:h.total-h.rank+1,rank:h.rank,total:h.total}));
                const maxVal=Math.max(...data.map(d=>d.total),1);
                const w=320;const h=160;const px=40;const py=25;const gw=w-px*2;const gh=h-py*2;
                const points=data.map((d,i)=>{const x=data.length===1?w/2:px+(gw/(data.length-1))*i;const y=py+gh-(d.value/maxVal)*gh;return{x,y,...d};});
                const line=points.length>1?points.map((p,i)=>(i===0?"M":"L")+`${p.x},${p.y}`).join(" "):"";
                const prev=points.length>=2?points[points.length-2]:null;
                const diff=prev?prev.rank-points[points.length-1].rank:0;
                return(<div className="bg-slate-50 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-base">등수 변화</h3>
                    {prev&&diff!==0&&<span className={`text-sm font-bold px-3 py-1 rounded-lg ${diff>0?"bg-green-50 text-green-600":"bg-red-50 text-red-500"}`}>{diff>0?"📈 저번보다 잘봄":"📉 저번보다 못봄"}</span>}
                    {prev&&diff===0&&<span className="text-sm font-bold px-3 py-1 rounded-lg bg-slate-100 text-slate-500">— 저번이랑 비슷</span>}
                    {!prev&&<span className="text-xs text-slate-400">시험 2회 이상부터 추이 표시</span>}
                  </div>
                  <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{maxHeight:"180px"}}>
                    {[0,0.5,1].map(r=>(<line key={r} x1={px} y1={py+gh*(1-r)} x2={w-px} y2={py+gh*(1-r)} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4"/>))}
                    <defs><linearGradient id="rankGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6c63ff" stopOpacity="0.15"/><stop offset="100%" stopColor="#6c63ff" stopOpacity="0"/></linearGradient></defs>
                    {line&&<><path d={`${line} L${points[points.length-1].x},${py+gh} L${points[0].x},${py+gh} Z`} fill="url(#rankGrad)"/>
                    <path d={line} fill="none" stroke="#6c63ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></>}
                    {points.map((p,i)=>(<g key={i}>
                      <circle cx={p.x} cy={p.y} r="5" fill="white" stroke="#6c63ff" strokeWidth="2.5"/>
                      <text x={p.x} y={h-4} textAnchor="middle" fontSize="9" fill="#94a3b8">{p.date.slice(5)}</text>
                    </g>))}
                  </svg>
                </div>);
              })()}
            </div>
          </div>
          {/* 4. 하단 풀폭: 정답률 → 최다오답 */}
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-2xl p-5"><h3 className="font-semibold text-base mb-3">정답률</h3><div className="flex items-end gap-1 h-36">{questions.map(q=>{const rate=q.correct_rate||0;const isCorrect=rm[q.question_number];return(<div key={q.question_number} className="flex-1 flex flex-col items-center gap-1"><div className="w-full flex flex-col justify-end h-24 relative"><div className="w-full rounded-t transition-all" style={{height:`${Math.max(rate,4)}%`,background:isCorrect?"#6c63ff":"#ff6b6b"}}/></div><span className="text-[9px] text-slate-500 leading-none font-semibold">{q.question_number}</span><span className="text-[8px] text-slate-400 leading-none">{rate}%</span></div>);})}</div></div>
            {wrong.length>0&&<div className="bg-slate-50 rounded-2xl p-5"><h3 className="font-semibold text-base mb-4">최다 오답 TOP 3</h3><div className="flex justify-center gap-6">{wrong.slice(0,3).map((q:any)=>{const rate=q.correct_rate||0;const circumference=2*Math.PI*36;const filled=circumference*(rate/100);const empty=circumference-filled;return(<div key={q.question_number} className="flex flex-col items-center gap-2"><div className="relative w-22 h-22"><svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90"><circle cx="40" cy="40" r="36" fill="none" stroke="#f1f5f9" strokeWidth="6"/><circle cx="40" cy="40" r="36" fill="none" stroke="#ff6b6b" strokeWidth="6" strokeDasharray={`${filled} ${empty}`} strokeLinecap="round"/></svg><div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-xl font-bold text-slate-700">{q.question_number}</span><span className="text-[10px] text-slate-400">번</span></div></div><div className="text-center"><p className="text-sm font-semibold text-red-400">{rate}%</p><p className="text-xs text-slate-400 max-w-[80px] truncate">{q.topic||"—"}</p></div></div>);})}</div></div>}
          </div>
        </>:<div className="bg-slate-50 rounded-2xl p-12 text-center text-slate-400 text-sm">결과 미입력</div>}
      </>:<div className="bg-slate-50 rounded-2xl p-12 text-center text-slate-400">시험 없음</div>}</div>}
      {tab==="myexam"&&<div>
        <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">📝 시험 결과</h2><button onClick={()=>setShowExamAdd(true)} className="bg-[#6c63ff] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1"><Icon type="plus" size={14}/>성적 입력</button></div>
        {showExamAdd&&<div className="bg-slate-50 rounded-2xl p-5 mb-4 space-y-3">
          {/* 시험 유형 선택 */}
          <div><label className="text-xs font-semibold text-slate-500">시험 유형</label><div className="flex gap-2 mt-1">{["모의고사","내신"].map(t=>(<button key={t} onClick={()=>setExamForm(p=>({...p,exam_type:t,exam_name:"",subject:t==="내신"?"수학":"수학"}))} className={`px-4 py-2 rounded-xl text-sm font-semibold ${examForm.exam_type===t?"bg-[#6c63ff] text-white":"bg-white text-slate-500 border border-slate-200"}`}>{t}</button>))}</div></div>

          {examForm.exam_type==="모의고사"&&<>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-semibold text-slate-500">몇월 모의고사</label><select className="w-full bg-white rounded-xl px-4 py-2.5 text-sm mt-1 border border-slate-200" value={examForm.exam_name} onChange={e=>setExamForm(p=>({...p,exam_name:e.target.value}))}><option value="">선택</option>{[3,4,6,7,9,10,11].map(m=>(<option key={m} value={`${m}월 모의고사`}>{m}월 모의고사</option>))}</select></div>
              <div><label className="text-xs font-semibold text-slate-500">과목</label><select className="w-full bg-white rounded-xl px-4 py-2.5 text-sm mt-1 border border-slate-200" value={examForm.subject} onChange={e=>setExamForm(p=>({...p,subject:e.target.value}))}>{["국어","수학","영어","과탐","사탐"].map(s=>(<option key={s}>{s}</option>))}</select></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-semibold text-slate-500">점수 *</label><input className="w-full bg-white rounded-xl px-4 py-2.5 text-sm mt-1 border border-slate-200" value={examForm.score} onChange={e=>setExamForm(p=>({...p,score:e.target.value}))} placeholder="85"/></div>
              <div><label className="text-xs font-semibold text-slate-500">등급</label><select className="w-full bg-white rounded-xl px-4 py-2.5 text-sm mt-1 border border-slate-200" value={examForm.grade} onChange={e=>setExamForm(p=>({...p,grade:e.target.value}))}><option value="">선택</option>{[1,2,3,4,5,6,7,8,9].map(g=>(<option key={g} value={`${g}등급`}>{g}등급</option>))}</select></div>
            </div>
          </>}

          {examForm.exam_type==="내신"&&<>
            <div><label className="text-xs font-semibold text-slate-500">시험 구분</label><select className="w-full bg-white rounded-xl px-4 py-2.5 text-sm mt-1 border border-slate-200" value={examForm.exam_name} onChange={e=>setExamForm(p=>({...p,exam_name:e.target.value}))}><option value="">선택</option><option>1학기 중간</option><option>1학기 기말</option><option>2학기 중간</option><option>2학기 기말</option></select></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-semibold text-slate-500">수학 점수 *</label><input className="w-full bg-white rounded-xl px-4 py-2.5 text-sm mt-1 border border-slate-200" value={examForm.score} onChange={e=>setExamForm(p=>({...p,score:e.target.value}))} placeholder="85"/></div>
              <div><label className="text-xs font-semibold text-slate-500">등급</label><select className="w-full bg-white rounded-xl px-4 py-2.5 text-sm mt-1 border border-slate-200" value={examForm.grade} onChange={e=>setExamForm(p=>({...p,grade:e.target.value}))}><option value="">선택</option>{[1,2,3,4,5,6,7,8,9].map(g=>(<option key={g} value={`${g}등급`}>{g}등급</option>))}</select></div>
            </div>
          </>}

          {/* 공통 질문 */}
          <div><label className="text-xs font-semibold text-slate-500">수학 성적이 올랐나요?</label><input className="w-full bg-white rounded-xl px-4 py-2.5 text-sm mt-1 border border-slate-200" value={examForm.q1} onChange={e=>setExamForm(p=>({...p,q1:e.target.value}))} placeholder="예: 저번보다 10점 올랐어요"/></div>
          <div><label className="text-xs font-semibold text-slate-500">공부에 가장 큰 고민은?</label><input className="w-full bg-white rounded-xl px-4 py-2.5 text-sm mt-1 border border-slate-200" value={examForm.q2} onChange={e=>setExamForm(p=>({...p,q2:e.target.value}))} placeholder="예: 시간이 부족해요"/></div>
          <div><label className="text-xs font-semibold text-slate-500">하고 싶은 말</label><input className="w-full bg-white rounded-xl px-4 py-2.5 text-sm mt-1 border border-slate-200" value={examForm.q3} onChange={e=>setExamForm(p=>({...p,q3:e.target.value}))} placeholder="자유롭게 적어주세요"/></div>
          <div className="flex gap-2"><button onClick={addExam} className="bg-[#6c63ff] text-white px-4 py-2 rounded-xl text-xs font-semibold">저장</button><button onClick={()=>setShowExamAdd(false)} className="text-xs text-slate-400">취소</button></div>
        </div>}
        {myExams.length>0?<div className="space-y-3">{myExams.map((ex:any)=>{let memoObj:any={};try{memoObj=JSON.parse(ex.memo||"{}");}catch{}return(<div key={ex.id} className="bg-slate-50 rounded-2xl p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1"><span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${ex.exam_type==="모의고사"?"bg-amber-50 text-amber-600":"bg-blue-50 text-blue-600"}`}>{ex.exam_type}</span>{ex.exam_name&&<span className="text-xs text-slate-500">{ex.exam_name}</span>}</div>
              <p className="font-semibold text-sm">{ex.subject}</p>
              <div className="flex items-center gap-3 mt-1"><span className="text-lg font-bold text-[#6c63ff]">{ex.score}점</span>{ex.grade&&<span className="text-sm font-semibold text-slate-500">{ex.grade}</span>}</div>
              {(memoObj.q1||memoObj.q2||memoObj.q3)&&<div className="mt-2 space-y-1 text-xs text-slate-500">{memoObj.q1&&<p>📈 {memoObj.q1}</p>}{memoObj.q2&&<p>🤔 {memoObj.q2}</p>}{memoObj.q3&&<p>💬 {memoObj.q3}</p>}</div>}
            </div>
            <button onClick={()=>delExam(ex.id)} className="text-xs text-slate-300 hover:text-red-500">삭제</button>
          </div>
        </div>);})}</div>:<div className="bg-slate-50 rounded-2xl p-12 text-center text-slate-400">시험 성적을 입력해보세요</div>}
      </div>}
      {tab==="notice"&&<div><h2 className="text-xl font-bold mb-4">📢 공지사항</h2>{notices.length>0?<div className="space-y-3">{notices.map((n:any)=>{const isNew=n.created_at&&(Date.now()-new Date(n.created_at).getTime())<24*60*60*1000;return(<div key={n.id} className="bg-slate-50 rounded-2xl p-5"><div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><h3 className="font-semibold text-base">{n.title||"공지"}</h3>{isNew&&<span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">N</span>}</div><div className="flex items-center gap-2"><span className="text-xs text-[#6c63ff] bg-[#6c63ff]/10 px-2 py-0.5 rounded-lg">{n.class_groups?.name||""}</span><span className="text-xs text-slate-400">{n.created_at?.slice(0,10)}</span></div></div><p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{n.content}</p></div>);})}</div>:<div className="bg-slate-50 rounded-2xl p-12 text-center text-slate-400">공지사항이 없습니다</div>}</div>}
      {tab==="inquiry"&&<div>
        <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">💬 문의사항</h2><button onClick={()=>setShowInqAdd(true)} className="bg-[#6c63ff] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1"><Icon type="plus" size={14}/>문의하기</button></div>
        {showInqAdd&&<div className="bg-slate-50 rounded-2xl p-5 mb-4 space-y-3">
          <div><label className="text-xs font-semibold text-slate-500">제목</label><input className="w-full bg-white rounded-xl px-4 py-2.5 text-sm mt-1 border border-slate-200" value={inqForm.title} onChange={e=>setInqForm(p=>({...p,title:e.target.value}))} placeholder="문의 제목"/></div>
          <div><label className="text-xs font-semibold text-slate-500">내용</label><textarea className="w-full bg-white rounded-xl px-4 py-3 text-sm mt-1 border border-slate-200 resize-none h-28" value={inqForm.content} onChange={e=>setInqForm(p=>({...p,content:e.target.value}))} placeholder="문의 내용을 적어주세요"/></div>
          <div><label className="text-xs font-semibold text-slate-500">이미지 첨부</label><div className="flex items-center gap-2 mt-1"><button onClick={()=>inqImgRef.current?.click()} className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-500">{inqImg?inqImg.name:"이미지 선택"}</button><input ref={inqImgRef} type="file" accept="image/*" className="hidden" onChange={e=>{if(e.target.files?.[0])setInqImg(e.target.files[0]);}}/>{inqImg&&<button onClick={()=>setInqImg(null)} className="text-xs text-red-400">삭제</button>}</div></div>
          <div className="flex gap-2"><button onClick={addInquiry} className="bg-[#6c63ff] text-white px-4 py-2 rounded-xl text-xs font-semibold">등록</button><button onClick={()=>{setShowInqAdd(false);setInqImg(null);}} className="text-xs text-slate-400">취소</button></div>
        </div>}
        {inquiries.length>0?<div className="space-y-3">{inquiries.map((q:any)=>{const isNew=q.created_at&&(Date.now()-new Date(q.created_at).getTime())<24*60*60*1000;const hasReply=!!q.reply;const imgMatch=q.content?.match(/\[IMG\](.*?)\[\/IMG\]/);const cleanContent=q.content?.replace(/\[IMG\].*?\[\/IMG\]/g,"").trim();const replyImg=q.reply?.match(/\[IMG\](.*?)\[\/IMG\]/);const cleanReply=q.reply?.replace(/\[IMG\].*?\[\/IMG\]/g,"").trim();return(<div key={q.id} className="bg-slate-50 rounded-2xl p-5"><div className="flex justify-between mb-2"><div className="flex items-center gap-2"><h3 className="font-semibold text-sm">{q.title||"문의"}</h3>{isNew&&<span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">N</span>}<span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${hasReply?"bg-green-50 text-green-600":"bg-amber-50 text-amber-600"}`}>{hasReply?"답변 완료":"답변 대기중"}</span></div><span className="text-xs text-slate-400">{q.created_at?.slice(0,10)}</span></div><p className="text-sm text-slate-600 whitespace-pre-line">{cleanContent}</p>{imgMatch&&<img src={imgMatch[1]} alt="" className="mt-2 rounded-xl max-h-48 object-contain"/>}{hasReply&&<div className="mt-3 bg-[#6c63ff]/5 rounded-xl p-3"><p className="text-xs font-semibold text-[#6c63ff] mb-1">답변</p><p className="text-sm text-slate-700 whitespace-pre-line">{cleanReply}</p>{replyImg&&<img src={replyImg[1]} alt="" className="mt-2 rounded-xl max-h-48 object-contain"/>}</div>}</div>);})}</div>:<div className="bg-slate-50 rounded-2xl p-12 text-center text-slate-400">문의사항이 없습니다</div>}
      </div>}
      {tab==="shop"&&<div>
        <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">🏪 상점</h2><div className="bg-[#6c63ff]/10 px-4 py-2 rounded-xl"><span className="text-sm font-bold text-[#6c63ff]">🥩 {myTokens} 서서갈비</span></div></div>
        {shopItems.length>0?<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">{shopItems.map((item:any)=>(<div key={item.id} className="bg-slate-50 rounded-2xl p-5"><h3 className="font-semibold text-base mb-1">{item.name}</h3>{item.description&&<p className="text-xs text-slate-400 mb-3">{item.description}</p>}<div className="flex items-center justify-between"><span className="text-sm font-bold text-[#6c63ff]">🥩 {item.price}</span><button onClick={()=>buyItem(item)} className="bg-[#6c63ff] text-white px-4 py-1.5 rounded-xl text-xs font-semibold">구매</button></div></div>))}</div>:<div className="bg-slate-50 rounded-2xl p-8 text-center text-slate-400 text-sm mb-6">상점 준비 중</div>}
        {purchases.length>0&&<div><h3 className="font-semibold text-sm mb-3">구매 내역</h3><div className="space-y-2">{purchases.map((p:any)=>(<div key={p.id} className="bg-slate-50 rounded-xl px-4 py-3 flex justify-between items-center"><span className="text-sm">{p.shop_items?.name||"아이템"}</span><div className="text-right"><span className="text-xs font-bold text-[#6c63ff]">-{p.price} 🥩</span><p className="text-[10px] text-slate-400">{p.created_at?.slice(0,10)}</p></div></div>))}</div></div>}
      </div>}
      {tab==="settings"&&<div><h2 className="text-xl font-bold mb-4">설정</h2><div className="bg-slate-50 rounded-2xl p-6 max-w-md"><h3 className="font-semibold text-sm mb-4">비밀번호 변경</h3><div className="space-y-3"><input type="password" className="w-full bg-white rounded-xl px-4 py-3 text-sm border border-slate-200 focus:outline-none" value={pw.n1} onChange={e=>setPw(p=>({...p,n1:e.target.value}))} placeholder="새 비밀번호"/><input type="password" className="w-full bg-white rounded-xl px-4 py-3 text-sm border border-slate-200 focus:outline-none" value={pw.n2} onChange={e=>setPw(p=>({...p,n2:e.target.value}))} placeholder="확인"/></div>{pwMsg&&<p className={`text-xs mt-2 ${pwMsg.includes("완료")?"text-green-500":"text-red-400"}`}>{pwMsg}</p>}<button onClick={chPw} className="mt-4 bg-slate-800 text-white px-6 py-2.5 rounded-xl text-sm font-semibold">변경</button></div></div>}
    </div></main>
    {/* 모바일 하단 탭바 */}
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-40 flex justify-around py-2 px-1 safe-area-pb">{mis.map(m=>(<button key={m.id} onClick={()=>setTab(m.id)} className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-medium relative ${tab===m.id?"text-[#6c63ff]":"text-slate-400"}`}><Icon type={m.icon} size={20}/>{m.label}{m.id==="notice"&&notices.some(n=>n.created_at&&(Date.now()-new Date(n.created_at).getTime())<24*60*60*1000)&&<span className="absolute -top-0.5 right-0.5 bg-red-500 text-white text-[7px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">N</span>}</button>))}</nav>
    </div>);
}

/* ═══ ADMIN: STUDENT MANAGER + EXCEL IMPORT ═══ */
function AdminStudentManager({users,fetchUsers,groups}:{users:any[];fetchUsers:()=>void;groups:any[]}){
  const[showAdd,setShowAdd]=useState(false);const[form,setForm]=useState({name:"",school:"",parent_phone:"",student_phone:"",class_ids:[] as number[]});
  const[showImport,setShowImport]=useState(false);const[importText,setImportText]=useState("");
  const[editStu,setEditStu]=useState<any>(null);const[editForm,setEditForm]=useState({name:"",school:"",parent_phone:"",student_phone:""});
  const students=users.filter((u:any)=>u.role==="student"&&u.status==="approved");
  const fileRef=useRef<HTMLInputElement>(null);

  const addStudent=async()=>{
    if(!form.name||!form.parent_phone)return;
    const last4=form.parent_phone.slice(-4);const lid=form.name+last4;
    const{data:ex}=await supabase.from("users").select("id").eq("login_id",lid).single();
    if(ex){alert("이미 존재: "+lid);return;}
    const{data:nu}=await supabase.from("users").insert({login_id:lid,password:last4,name:form.name,role:"student",school:form.school,parent_phone:form.parent_phone,student_phone:form.student_phone,phone:form.student_phone,status:"approved"}).select().single();
    if(nu&&form.class_ids.length>0){for(const cid of form.class_ids){await supabase.from("class_members").insert({user_id:nu.id,class_group_id:cid});}}
    setForm({name:"",school:"",parent_phone:"",student_phone:"",class_ids:[]});setShowAdd(false);fetchUsers();
  };

  const importFromText=async()=>{
    const lines=importText.trim().split("\n").filter(l=>l.trim());let count=0;
    for(const line of lines){
      const parts=line.split("\t").length>1?line.split("\t"):line.split(",");
      if(parts.length<2)continue;
      const name=parts[0]?.trim();const school=parts[1]?.trim()||"";const pPhone=parts[2]?.trim()||"";const sPhone=parts[3]?.trim()||"";
      if(!name||!pPhone)continue;
      const last4=pPhone.slice(-4);const lid=name+last4;
      const{data:ex}=await supabase.from("users").select("id").eq("login_id",lid).single();
      if(ex)continue;
      await supabase.from("users").insert({login_id:lid,password:last4,name,role:"student",school,parent_phone:pPhone,student_phone:sPhone,phone:sPhone,status:"approved"});
      count++;
    }
    alert(`${count}명 추가 완료!`);setImportText("");setShowImport(false);fetchUsers();
  };

  const removeStudent=async(id:number)=>{if(!confirm("삭제?"))return;await supabase.from("users").delete().eq("id",id);fetchUsers();};
  const saveEditStu=async()=>{if(!editStu)return;const{name,school,parent_phone,student_phone}=editForm;if(!name||!parent_phone){alert("이름과 학부모 연락처는 필수입니다.");return;}const last4=parent_phone.slice(-4);const lid=name+last4;await supabase.from("users").update({name,school,parent_phone,student_phone,phone:student_phone,login_id:lid,password:last4}).eq("id",editStu.id);setEditStu(null);fetchUsers();};
  const startEdit=(s:any)=>{setEditStu(s);setEditForm({name:s.name||"",school:s.school||"",parent_phone:s.parent_phone||"",student_phone:s.student_phone||s.phone||""});};
  const toggleClass=(cid:number)=>{setForm(p=>({...p,class_ids:p.class_ids.includes(cid)?p.class_ids.filter(x=>x!==cid):[...p.class_ids,cid]}));};

  return(<div>
    <div className="flex justify-between items-center mb-4 flex-wrap gap-2"><h2 className="text-lg font-bold">👨‍🎓 학생 관리</h2><div className="flex gap-2"><button onClick={()=>setShowImport(true)} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-semibold">📋 엑셀 붙여넣기</button><button onClick={()=>setShowAdd(true)} className="bg-[#6c63ff] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1"><Icon type="plus" size={14}/>학생 추가</button></div></div>

    {showImport&&<div className="bg-white rounded-2xl p-5 shadow-sm mb-4 border border-amber-200">
      <h3 className="font-semibold text-sm mb-2">📋 엑셀에서 붙여넣기</h3>
      <p className="text-xs text-slate-400 mb-3">엑셀에서 이름, 학교, 학부모연락처, 학생연락처 순서로 복사 후 붙여넣기 (탭 또는 쉼표 구분)</p>
      <textarea className="w-full bg-slate-50 rounded-xl px-4 py-3 text-xs border-0 resize-none h-32 font-mono focus:outline-none" value={importText} onChange={e=>setImportText(e.target.value)} placeholder={"김민서\t경기여고\t01012345678\t01098765432\n박지성\t단대부고\t01011112222\t01033334444"}/>
      <div className="flex gap-2 mt-3"><button onClick={importFromText} className="bg-[#6c63ff] text-white px-4 py-2 rounded-xl text-xs font-semibold">일괄 추가</button><button onClick={()=>setShowImport(false)} className="text-xs text-slate-400">취소</button></div>
    </div>}

    {showAdd&&<div className="bg-white rounded-2xl p-5 shadow-sm mb-4 border border-[#6c63ff]/20">
      <h3 className="font-semibold text-sm mb-3">새 학생</h3>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div><label className="text-[10px] font-semibold text-slate-400">이름 *</label><input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div>
        <div><label className="text-[10px] font-semibold text-slate-400">학교</label><input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0" value={form.school} onChange={e=>setForm(p=>({...p,school:e.target.value}))}/></div>
        <div><label className="text-[10px] font-semibold text-slate-400">학부모 연락처 *</label><input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0" value={form.parent_phone} onChange={e=>setForm(p=>({...p,parent_phone:e.target.value}))} placeholder="01064382222"/></div>
        <div><label className="text-[10px] font-semibold text-slate-400">학생 연락처</label><input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0" value={form.student_phone} onChange={e=>setForm(p=>({...p,student_phone:e.target.value}))}/></div>
      </div>
      {groups.length>0&&<div className="mb-3"><label className="text-[10px] font-semibold text-slate-400">소속 반</label><div className="flex flex-wrap gap-2 mt-1">{groups.map(g=>(<button key={g.id} onClick={()=>toggleClass(g.id)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${form.class_ids.includes(g.id)?"bg-[#6c63ff] text-white":"bg-slate-100 text-slate-500"}`}>{g.name}</button>))}</div></div>}
      {form.name&&form.parent_phone&&<p className="text-xs text-slate-400 mb-3">아이디: <b className="text-[#6c63ff]">{form.name}{form.parent_phone.slice(-4)}</b> / 비번: <b>{form.parent_phone.slice(-4)}</b></p>}
      <div className="flex gap-2"><button onClick={addStudent} className="bg-[#6c63ff] text-white px-4 py-2 rounded-xl text-xs font-semibold">추가</button><button onClick={()=>setShowAdd(false)} className="text-xs text-slate-400">취소</button></div>
    </div>}

    {editStu&&<div className="bg-white rounded-2xl p-5 shadow-sm mb-4 border border-amber-200">
      <h3 className="font-semibold text-sm mb-3">✏️ 학생 정보 수정 — {editStu.name}</h3>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div><label className="text-[10px] font-semibold text-slate-400">이름 *</label><input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0" value={editForm.name} onChange={e=>setEditForm(p=>({...p,name:e.target.value}))}/></div>
        <div><label className="text-[10px] font-semibold text-slate-400">학교</label><input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0" value={editForm.school} onChange={e=>setEditForm(p=>({...p,school:e.target.value}))}/></div>
        <div><label className="text-[10px] font-semibold text-slate-400">학부모 연락처 *</label><input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0" value={editForm.parent_phone} onChange={e=>setEditForm(p=>({...p,parent_phone:e.target.value}))}/></div>
        <div><label className="text-[10px] font-semibold text-slate-400">학생 연락처</label><input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0" value={editForm.student_phone} onChange={e=>setEditForm(p=>({...p,student_phone:e.target.value}))}/></div>
      </div>
      {editForm.name&&editForm.parent_phone&&<p className="text-xs text-slate-400 mb-3">변경될 아이디: <b className="text-[#6c63ff]">{editForm.name}{editForm.parent_phone.slice(-4)}</b> / 비번: <b>{editForm.parent_phone.slice(-4)}</b></p>}
      <div className="flex gap-2"><button onClick={saveEditStu} className="bg-[#6c63ff] text-white px-4 py-2 rounded-xl text-xs font-semibold">저장</button><button onClick={()=>setEditStu(null)} className="text-xs text-slate-400">취소</button></div>
    </div>}

    <div className="bg-white rounded-2xl shadow-sm overflow-x-auto"><table className="w-full text-sm"><thead><tr className="bg-slate-50">{["이름","학교","아이디","학부모","학생",""].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400">{h}</th>)}</tr></thead><tbody>{students.map((s:any)=>(<tr key={s.id} className="border-t border-slate-50 hover:bg-slate-50/50"><td className="px-4 py-3 font-semibold">{s.name}</td><td className="px-4 py-3 text-xs text-slate-500">{s.school||"—"}</td><td className="px-4 py-3 font-mono text-xs text-[#6c63ff]">{s.login_id}</td><td className="px-4 py-3 text-xs text-slate-500">{s.parent_phone||"—"}</td><td className="px-4 py-3 text-xs text-slate-500">{s.student_phone||s.phone||"—"}</td><td className="px-4 py-3 text-right flex gap-2 justify-end"><button onClick={()=>startEdit(s)} className="text-xs text-slate-300 hover:text-[#6c63ff]">수정</button><button onClick={()=>removeStudent(s.id)} className="text-xs text-slate-300 hover:text-red-500">삭제</button></td></tr>))}{students.length===0&&<tr><td colSpan={6} className="text-center py-10 text-slate-400 text-sm">학생을 추가하세요</td></tr>}</tbody></table></div>
  </div>);
}

/* ═══ ADMIN: CLASS + EXCEL TEST (with auto stats) ═══ */
function AdminClassManager({users}:{users:any[]}){
  const[groups,setGroups]=useState<any[]>([]);const[selG,setSelG]=useState<any>(null);const[members,setMembers]=useState<any[]>([]);const[tests,setTests]=useState<any[]>([]);const[selT,setSelT]=useState<any>(null);const[qs,setQs]=useState<any[]>([]);const[grid,setGrid]=useState<any>({});const[ig,setIg]=useState<any>({});const[saving,setSaving]=useState(false);const[saveMsg,setSaveMsg]=useState("");
  const[newGN,setNewGN]=useState("");const[showNG,setShowNG]=useState(false);const[ntf,setNtf]=useState({date:"",title:"",qCount:15,assignment:""});const[ntp,setNtp]=useState<string[]>([]);const[showNT,setShowNT]=useState(false);const[showAM,setShowAM]=useState(false);const[searchM,setSearchM]=useState("");
  const[editGN,setEditGN]=useState("");const[editingGId,setEditingGId]=useState<number|null>(null);
  const[editTest,setEditTest]=useState<any>(null);const[editTF,setEditTF]=useState({date:"",title:"",assignment:""});
  const[capId,setCapId]=useState<number|null>(null);
  const capRef=useRef<HTMLDivElement>(null);

  // 성적표 이미지 캡쳐
  const captureReport=async(uid:number)=>{
    setCapId(uid);
    await new Promise(r=>setTimeout(r,300));
    if(!capRef.current)return;
    try{
      const canvas=await html2canvas(capRef.current,{backgroundColor:"#ffffff",scale:2,useCORS:true});
      canvas.toBlob(async(blob)=>{
        if(!blob)return;
        try{await navigator.clipboard.write([new ClipboardItem({"image/png":blob})]);alert("성적표 이미지가 클립보드에 복사되었습니다!");}
        catch{const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`성적표_${members.find(m=>m.user_id===uid)?.users?.name||"학생"}.png`;a.click();URL.revokeObjectURL(url);}
      },"image/png");
    }catch(e){alert("캡쳐 실패");}
    setCapId(null);
  };
  const approved=users.filter((u:any)=>u.status==="approved"&&u.role!=="admin");
  const fG=async()=>{const{data}=await supabase.from("class_groups").select("*").order("created_at");if(data)setGroups(data);};
  const fM=async(gid:number)=>{const{data}=await supabase.from("class_members").select("*, users:user_id(*)").eq("class_group_id",gid);if(data)setMembers(data);return data||[];};
  const fT=async(gid:number)=>{const{data}=await supabase.from("tests").select("*").eq("class_group_id",gid).order("date",{ascending:false});if(data)setTests(data);};
  useEffect(()=>{fG();},[]);

  // 반 선택 — useEffect 없이 직접 호출
  const selectGroup=async(g:any)=>{setSelG(g);setSelT(null);setGrid({});setIg({});setQs([]);setMembers([]);setTests([]);if(g){await fM(g.id);await fT(g.id);}};

  const cG=async()=>{if(!newGN)return;await supabase.from("class_groups").insert({name:newGN});setNewGN("");setShowNG(false);fG();};
  const dG=async(id:number)=>{if(!confirm("삭제?"))return;await supabase.from("class_groups").delete().eq("id",id);if(selG?.id===id){setSelG(null);setMembers([]);setTests([]);setSelT(null);}fG();};
  const renameG=async(id:number)=>{if(!editGN.trim())return;await supabase.from("class_groups").update({name:editGN.trim()}).eq("id",id);setEditingGId(null);setEditGN("");fG();if(selG?.id===id)setSelG((prev:any)=>prev?{...prev,name:editGN.trim()}:prev);};
  const aM=async(uid:number)=>{if(!selG)return;await supabase.from("class_members").insert({class_group_id:selG.id,user_id:uid});fM(selG.id);};
  const rM=async(id:number)=>{await supabase.from("class_members").delete().eq("id",id);if(selG)fM(selG.id);};
  const cT=async()=>{if(!selG||!ntf.date)return;const title=`${ntf.date} ${selG.name}`;const{data:t}=await supabase.from("tests").insert({date:ntf.date,title,class_group_id:selG.id,class_name:selG.name,assignment:""}).select().single();if(!t)return;const rows=Array.from({length:15},(_,i)=>({test_id:t.id,question_number:i+1,topic:"",correct_rate:0}));await supabase.from("test_questions").insert(rows);setShowNT(false);setNtf({date:"",title:"",qCount:15,assignment:""});setNtp([]);fT(selG.id);};

  // 시험 수정
  const updateTest=async()=>{if(!editTest)return;await supabase.from("tests").update({date:editTF.date,title:editTF.title,assignment:editTF.assignment}).eq("id",editTest.id);setEditTest(null);if(selG)fT(selG.id);if(selT?.id===editTest.id)setSelT((prev:any)=>prev?{...prev,date:editTF.date,title:editTF.title,assignment:editTF.assignment}:prev);};
  // 시험 삭제
  const deleteTest=async(tid:number)=>{if(!confirm("이 시험과 모든 결과를 삭제할까요?"))return;await supabase.from("test_student_info").delete().eq("test_id",tid);await supabase.from("test_results").delete().eq("test_id",tid);await supabase.from("test_questions").delete().eq("test_id",tid);await supabase.from("tests").delete().eq("id",tid);if(selT?.id===tid)setSelT(null);if(selG)fT(selG.id);};

  const loadGrid=async(test:any)=>{setSelT(test);setSaveMsg("");const{data:q}=await supabase.from("test_questions").select("*").eq("test_id",test.id).order("question_number");if(q)setQs(q);const{data:res}=await supabase.from("test_results").select("*").eq("test_id",test.id);const{data:infos}=await supabase.from("test_student_info").select("*").eq("test_id",test.id);const g:any={};const ig2:any={};members.forEach((m:any)=>{const uid=m.user_id;ig2[uid]={attendance:"",clinic_time:"",assignment_score:"",wrong_answer_score:"",comment:"",student_id:uid};});if(res)res.forEach((r:any)=>{const uid=members.find((m:any)=>m.user_id===r.student_id)?.user_id;if(uid!==undefined)g[`${uid}-${r.question_number}`]=r.is_correct?1:0;});if(infos)infos.forEach((si:any)=>{const uid=members.find((m:any)=>m.user_id===si.student_id)?.user_id;if(uid!==undefined)ig2[uid]={...ig2[uid],...si};});setGrid(g);setIg(ig2);};

  const setC=(uid:number,qn:number,val:string)=>{const k=`${uid}-${qn}`;setGrid((p:any)=>{const n={...p};if(val==="")delete n[k];else n[k]=Number(val);return n;});};
  const setIC=(uid:number,key:string,val:string)=>{setIg((p:any)=>({...p,[uid]:{...p[uid],[key]:val}}));};
  const getS=(uid:number)=>{let c=0;qs.forEach(q=>{if(grid[`${uid}-${q.question_number}`]===1)c++;});return c;};
  const hasA=(uid:number)=>qs.some(q=>grid[`${uid}-${q.question_number}`]!==undefined);

  const saveAll=async()=>{
    if(!selT)return;setSaving(true);setSaveMsg("");
    const errors:string[]=[];
    const testId=selT.id;
    const scores:number[]=[];
    members.forEach((m:any)=>{const uid=m.user_id;if(hasA(uid))scores.push(getS(uid));});
    const avg=scores.length>0?(scores.reduce((a,b)=>a+b,0)/scores.length):0;
    const best=scores.length>0?Math.max(...scores):0;
    const stdDev=scores.length>1?Math.sqrt(scores.reduce((a,b)=>a+Math.pow(b-avg,2),0)/scores.length):0;
    const avgR=Math.round(avg*10)/10;const stdR=Math.round(stdDev*10)/10;

    for(const m of members){
      const uid=m.user_id;const sid=uid;
      const{error:delErr}=await supabase.from("test_results").delete().eq("test_id",testId).eq("student_id",sid);
      if(delErr)errors.push("결과삭제:"+delErr.message);
      const rows:any[]=[];qs.forEach(q=>{const v=grid[`${uid}-${q.question_number}`];if(v!==undefined)rows.push({test_id:testId,student_id:sid,question_number:q.question_number,is_correct:v===1});});
      if(rows.length>0){const{error:insErr}=await supabase.from("test_results").insert(rows);if(insErr)errors.push("결과저장:"+insErr.message);}
      const sc=getS(uid);const inf=ig[uid]||{};
      const pay={test_id:testId,student_id:sid,total_score:sc,class_average:avgR,class_best:best,std_dev:stdR,attendance:inf.attendance||"",assignment_score:inf.assignment_score||"",wrong_answer_score:inf.wrong_answer_score||"",clinic_time:inf.clinic_time||"",comment:inf.comment||""};
      const{data:ex}=await supabase.from("test_student_info").select("id").eq("test_id",testId).eq("student_id",sid).single();
      if(ex){const{error:upErr}=await supabase.from("test_student_info").update(pay).eq("id",ex.id);if(upErr)errors.push("정보수정:"+upErr.message);}
      else{const{error:inErr}=await supabase.from("test_student_info").insert(pay);if(inErr)errors.push("정보저장:"+inErr.message);}
    }
    for(const q of qs){const{count:c}=await supabase.from("test_results").select("*",{count:"exact",head:true}).eq("test_id",testId).eq("question_number",q.question_number).eq("is_correct",true);const{count:t}=await supabase.from("test_results").select("*",{count:"exact",head:true}).eq("test_id",testId).eq("question_number",q.question_number);const r=t&&t>0?Math.round(((c||0)/t)*100):0;const{error:qErr}=await supabase.from("test_questions").update({correct_rate:r}).eq("id",q.id);if(qErr)errors.push("문항업데이트:"+qErr.message);}
    // 등수 계산 및 저장
    const ranked=members.filter((m:any)=>hasA(m.user_id)).map((m:any)=>({uid:m.user_id,score:getS(m.user_id)})).sort((a,b)=>b.score-a.score);
    for(let i=0;i<ranked.length;i++){const rank=i+1;const{error:rkErr}=await supabase.from("test_student_info").update({rank}).eq("test_id",testId).eq("student_id",ranked[i].uid);if(rkErr)errors.push("등수저장:"+rkErr.message);}
    if(errors.length>0)setSaveMsg("❌ "+errors.slice(0,3).join(" | "));
    else setSaveMsg("✅ 저장 완료!");
    setSaving(false);
  };

  // 문항수 변경
  const changeQCount=async(newCount:number)=>{
    if(!selT||newCount<1||newCount>50)return;
    const cur=qs.length;
    if(newCount>cur){
      const rows=Array.from({length:newCount-cur},(_,i)=>({test_id:selT.id,question_number:cur+i+1,topic:"",correct_rate:0}));
      await supabase.from("test_questions").insert(rows);
    }else if(newCount<cur){
      for(let i=newCount+1;i<=cur;i++){await supabase.from("test_questions").delete().eq("test_id",selT.id).eq("question_number",i);}
    }
    const{data:q}=await supabase.from("test_questions").select("*").eq("test_id",selT.id).order("question_number");if(q)setQs(q);
  };
  // 단원명 저장
  const saveTopic=async(qId:number,topic:string)=>{await supabase.from("test_questions").update({topic}).eq("id",qId);};

  // Excel view
  if(selT&&selG){
    const scores=members.filter((m:any)=>hasA(m.user_id)).map((m:any)=>getS(m.user_id));
    const avg=scores.length>0?(scores.reduce((a,b)=>a+b,0)/scores.length):0;
    const best=scores.length>0?Math.max(...scores):0;
    const stdDev=scores.length>1?Math.sqrt(scores.reduce((a,b)=>a+Math.pow(b-avg,2),0)/scores.length):0;
    return(<div>
      <button onClick={()=>setSelT(null)} className="flex items-center gap-1 text-sm text-slate-400 mb-3"><Icon type="back" size={16}/>돌아가기</button>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2"><div><h2 className="text-lg font-bold">{selT.title}</h2><p className="text-xs text-slate-400">{fmtDate(selT.date)} · 과제: {selT.assignment||"없음"}</p></div><div className="flex items-center gap-3"><button onClick={saveAll} disabled={saving} className="bg-[#6c63ff] text-white px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50">{saving?"저장 중...":"💾 전체 저장"}</button>{saveMsg&&<span className={`text-sm font-semibold ${saveMsg.includes("완료")?"text-green-500":"text-red-500"}`}>{saveMsg}</span>}</div></div>
      <div className="bg-white rounded-2xl shadow-sm mb-4 overflow-x-auto"><table className="text-xs border-collapse w-full"><thead><tr className="bg-slate-50"><th className="sticky left-0 bg-slate-50 z-10 px-3 py-2 text-left font-semibold text-slate-500 min-w-[60px]">이름</th><th className="px-2 py-2 font-semibold text-slate-500 min-w-[50px]">총점</th>{qs.map(q=><th key={q.question_number} className="px-1 py-2 font-semibold text-slate-400 min-w-[32px] text-center">{q.question_number}</th>)}</tr></thead><tbody>{members.map((m:any)=>{const uid=m.user_id;const usr=m.users;const sc=getS(uid);const ans=hasA(uid);return(<tr key={uid} className="border-b border-slate-50"><td className="sticky left-0 bg-white z-10 px-3 py-2 font-semibold text-slate-700">{usr?.name||"?"}</td><td className="px-2 py-2 text-center font-bold text-[#6c63ff]">{ans?sc:"미응시"}</td>{qs.map(q=>{const k=`${uid}-${q.question_number}`;const v=grid[k];return(<td key={q.question_number} className="px-0.5 py-1 text-center"><input className={`w-7 h-7 text-center rounded font-bold text-xs border focus:outline-none focus:ring-1 focus:ring-[#6c63ff] ${v===1?"bg-blue-50 border-blue-200 text-blue-600":v===0?"bg-red-50 border-red-200 text-red-500":"bg-white border-slate-200"}`} value={v===undefined?"":v} onChange={e=>{const val=e.target.value;if(val===""||val==="0"||val==="1")setC(uid,q.question_number,val);}} maxLength={1}/></td>);})}</tr>);})}</tbody></table></div>
      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto mb-4"><table className="text-xs border-collapse w-full"><thead><tr className="bg-slate-50"><th className="sticky left-0 bg-slate-50 z-10 px-3 py-2 text-left font-semibold text-slate-500 min-w-[60px]">이름</th><th className="px-2 py-2 font-semibold text-slate-500">출석</th><th className="px-2 py-2 font-semibold text-slate-500">클리닉</th><th className="px-2 py-2 font-semibold text-slate-500">과제 성취도</th><th className="px-2 py-2 font-semibold text-slate-500">오답 성취도</th><th className="px-2 py-2 font-semibold text-slate-500 min-w-[280px]">개인 코멘트</th></tr></thead><tbody>{members.map((m:any)=>{const uid=m.user_id;const usr=m.users;const inf=ig[uid]||{};return(<tr key={uid} className="border-b border-slate-50"><td className="sticky left-0 bg-white z-10 px-3 py-2 font-semibold"><div className="flex items-center gap-1">{usr?.name||"?"}{inf.attendance!=="결석"&&<button onClick={()=>captureReport(uid)} className="text-[9px] text-slate-300 hover:text-[#6c63ff] bg-slate-50 px-1.5 py-0.5 rounded">📷</button>}</div></td><td className="px-1 py-1"><select className="bg-slate-50 rounded-lg px-2 py-1.5 text-xs border-0 w-full" value={inf.attendance||""} onChange={e=>setIC(uid,"attendance",e.target.value)}><option value="">—</option><option>출석</option><option>결석</option><option>영상</option></select></td><td className="px-1 py-1"><input className="bg-slate-50 rounded-lg px-2 py-1.5 text-xs border-0 w-full" value={inf.clinic_time||""} onChange={e=>setIC(uid,"clinic_time",e.target.value)}/></td><td className="px-1 py-1"><input className="bg-slate-50 rounded-lg px-2 py-1.5 text-xs border-0 w-full" value={inf.assignment_score||""} onChange={e=>setIC(uid,"assignment_score",e.target.value)}/></td><td className="px-1 py-1"><input className="bg-slate-50 rounded-lg px-2 py-1.5 text-xs border-0 w-full" value={inf.wrong_answer_score||""} onChange={e=>setIC(uid,"wrong_answer_score",e.target.value)}/></td><td className="px-1 py-1"><textarea className="bg-slate-50 rounded-lg px-2 py-1.5 text-xs border-0 w-full resize-none h-16" value={inf.comment||""} onChange={e=>setIC(uid,"comment",e.target.value)} placeholder="개인 코멘트"/></td></tr>);})}</tbody></table></div>
      <div className="bg-white rounded-2xl shadow-sm p-5"><h3 className="font-semibold text-sm mb-3">자동 계산 통계 (실시간)</h3><div className="grid grid-cols-3 gap-4 max-w-md"><div className="bg-slate-50 rounded-xl p-3 text-center"><p className="text-[10px] text-slate-400">반 평균</p><p className="text-xl font-bold text-[#6c63ff]">{(Math.round(avg*10)/10).toFixed(1)}</p></div><div className="bg-slate-50 rounded-xl p-3 text-center"><p className="text-[10px] text-slate-400">표준편차</p><p className="text-xl font-bold text-slate-600">{(Math.round(stdDev*10)/10).toFixed(1)}</p></div><div className="bg-slate-50 rounded-xl p-3 text-center"><p className="text-[10px] text-slate-400">최고점</p><p className="text-xl font-bold text-slate-600">{best}</p></div></div></div>
      <div className="bg-white rounded-2xl shadow-sm p-5 mt-4"><div className="flex items-center justify-between mb-3"><h3 className="font-semibold text-sm">문항 설정</h3><div className="flex items-center gap-2"><label className="text-xs text-slate-400">문항수</label><input type="number" className="w-16 bg-slate-50 rounded-lg px-2 py-1.5 text-sm border-0 text-center font-semibold" value={qs.length} onChange={e=>{const v=Number(e.target.value);if(v>=1&&v<=50)changeQCount(v);}}/></div></div><div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{qs.map(q=>(<div key={q.id} className="flex items-center gap-1.5"><span className="text-xs text-slate-400 w-5 text-right font-semibold">{q.question_number}</span><input className="flex-1 bg-slate-50 rounded-lg px-2 py-1.5 text-xs border-0" defaultValue={q.topic||""} placeholder="단원명" onBlur={e=>saveTopic(q.id,e.target.value)}/></div>))}</div></div>
      {/* 숨겨진 성적표 캡쳐 영역 */}
      {capId!==null&&(()=>{const m=members.find((m:any)=>m.user_id===capId);if(!m)return null;const usr=m.users;const uid=m.user_id;const sc=getS(uid);const inf=ig[uid]||{};const rm2:any={};qs.forEach(q=>{const v=grid[`${uid}-${q.question_number}`];if(v!==undefined)rm2[q.question_number]=v===1;});const wrong2=qs.filter(q=>rm2[q.question_number]===false).sort((a,b)=>(a.correct_rate||0)-(b.correct_rate||0));
      return(<div style={{position:"fixed",left:"-9999px",top:0}}><div ref={capRef} style={{width:"420px",padding:"24px",background:"white",fontFamily:"sans-serif"}}>
        <div style={{textAlign:"center",marginBottom:"16px"}}><p style={{fontSize:"18px",fontWeight:"bold"}}>{fmtDate(selT.date)}</p><p style={{fontSize:"12px",color:"#94a3b8"}}>{selT.title}</p></div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}><div style={{display:"flex",gap:"8px",alignItems:"center"}}><span style={{fontSize:"11px",background:"#f0edff",color:"#6c63ff",padding:"2px 8px",borderRadius:"8px",fontWeight:"bold"}}>{selT.class_name||""}</span><span style={{fontSize:"13px",fontWeight:"bold"}}>{usr?.school||""} {usr?.name}</span></div></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"8px",background:"#f8fafc",borderRadius:"16px",padding:"12px",marginBottom:"12px"}}>
          <div style={{textAlign:"center"}}><p style={{fontSize:"10px",color:"#94a3b8"}}>출석</p><p style={{fontSize:"14px",fontWeight:"bold",color:inf.attendance==="출석"?"#16a34a":"#ef4444"}}>{inf.attendance||"—"}</p></div>
          <div style={{textAlign:"center"}}><p style={{fontSize:"10px",color:"#94a3b8"}}>클리닉</p><p style={{fontSize:"14px",fontWeight:"600"}}>{inf.clinic_time||"—"}</p></div>
          <div style={{textAlign:"center"}}><p style={{fontSize:"10px",color:"#94a3b8"}}>과제</p><p style={{fontSize:"14px",fontWeight:"600"}}>{inf.assignment_score||"—"}</p></div>
          <div style={{textAlign:"center"}}><p style={{fontSize:"10px",color:"#94a3b8"}}>오답</p><p style={{fontSize:"14px",fontWeight:"600"}}>{inf.wrong_answer_score||"—"}</p></div>
        </div>
        {inf.comment&&<div style={{background:"#f5f3ff",borderRadius:"16px",padding:"12px",marginBottom:"12px"}}><p style={{fontSize:"11px",fontWeight:"bold",color:"#6c63ff",marginBottom:"4px"}}>개인 코멘트</p><p style={{fontSize:"13px",color:"#334155",whiteSpace:"pre-line"}}>{inf.comment}</p></div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"12px"}}>
          <div style={{background:"#f8fafc",borderRadius:"16px",padding:"12px",textAlign:"center"}}><p style={{fontSize:"10px",color:"#94a3b8"}}>내 점수</p><p style={{fontSize:"24px",fontWeight:"bold",color:"#6c63ff"}}>{sc}<span style={{fontSize:"12px"}}>점</span></p></div>
          <div style={{background:"#f8fafc",borderRadius:"16px",padding:"12px",textAlign:"center"}}><p style={{fontSize:"10px",color:"#94a3b8"}}>반 평균</p><p style={{fontSize:"24px",fontWeight:"bold",color:"#475569"}}>{(Math.round(avg*10)/10).toFixed(1)}<span style={{fontSize:"12px"}}>점</span></p></div>
        </div>
        <div style={{background:"#f8fafc",borderRadius:"16px",padding:"12px",marginBottom:"12px"}}><p style={{fontSize:"13px",fontWeight:"bold",marginBottom:"8px"}}>문항별 결과</p>{qs.map(q=>(<div key={q.question_number} style={{display:"flex",alignItems:"center",gap:"8px",padding:"3px 0"}}><span style={{fontSize:"12px",color:"#94a3b8",width:"20px",textAlign:"right"}}>{q.question_number}</span><span style={{fontSize:"12px",color:"#64748b",flex:1}}>{q.topic||"—"}</span><span style={{fontSize:"12px",fontWeight:"bold",color:rm2[q.question_number]?"#2563eb":"#f87171",width:"20px",textAlign:"center"}}>{rm2[q.question_number]?"O":"X"}</span><span style={{fontSize:"10px",color:"#94a3b8",width:"36px",textAlign:"right"}}>{q.correct_rate}%</span></div>))}</div>
        {wrong2.length>0&&<div style={{background:"#f8fafc",borderRadius:"16px",padding:"12px"}}><p style={{fontSize:"13px",fontWeight:"bold",marginBottom:"8px"}}>최다 오답</p>{wrong2.slice(0,3).map(q=>(<div key={q.question_number} style={{display:"flex",alignItems:"center",gap:"8px",padding:"2px 0"}}><span style={{background:"#fef2f2",color:"#ef4444",fontWeight:"bold",width:"24px",height:"24px",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px"}}>{q.question_number}</span><span style={{flex:1,fontSize:"12px"}}>{q.topic||"—"}</span><span style={{fontSize:"11px",color:"#94a3b8"}}>{q.correct_rate}%</span></div>))}</div>}
      </div></div>);})()}
    </div>);
  }

  // Group detail
  if(selG){
    const filtered=approved.filter(u=>!members.some((m:any)=>m.user_id===u.id)).filter(u=>!searchM||u.name?.includes(searchM)||u.school?.includes(searchM));
    return(<div>
      <button onClick={()=>selectGroup(null)} className="flex items-center gap-1 text-sm text-slate-400 mb-3"><Icon type="back" size={16}/>반 목록</button>
      <div className="flex items-center gap-2 mb-4">{editingGId===selG.id?<div className="flex items-center gap-2"><input className="bg-slate-50 rounded-lg px-3 py-1.5 text-lg font-bold border border-slate-200 focus:outline-none focus:border-[#6c63ff]" value={editGN} onChange={e=>setEditGN(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")renameG(selG.id);if(e.key==="Escape"){setEditingGId(null);setEditGN("");}}} autoFocus/><button onClick={()=>renameG(selG.id)} className="text-xs text-[#6c63ff] font-semibold bg-[#6c63ff]/10 px-3 py-1.5 rounded-lg">확인</button><button onClick={()=>{setEditingGId(null);setEditGN("");}} className="text-xs text-slate-400">취소</button></div>:<><h2 className="text-lg font-bold">📁 {selG.name}</h2><button onClick={()=>{setEditingGId(selG.id);setEditGN(selG.name);}} className="text-xs text-slate-400 hover:text-[#6c63ff]">✏️ 수정</button></>}</div>
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-4"><div className="flex justify-between items-center mb-3"><h3 className="font-semibold text-sm">학생 ({members.length}명)</h3><button onClick={()=>setShowAM(!showAM)} className="text-xs text-[#6c63ff] font-semibold">+ 학생 추가</button></div><div className="flex flex-wrap gap-2">{members.map((m:any)=>(<div key={m.id} className="bg-slate-50 rounded-lg px-3 py-1.5 text-xs flex items-center gap-2"><span className="font-medium">{m.users?.name}</span><button onClick={()=>rM(m.id)} className="text-red-300 hover:text-red-500">×</button></div>))}{members.length===0&&<p className="text-slate-400 text-xs">학생 추가 필요</p>}</div></div>
      {showAM&&<div className="bg-white rounded-2xl p-5 shadow-sm mb-4"><h3 className="font-semibold text-sm mb-3">학생 검색 / 추가</h3><div className="flex items-center gap-2 mb-3 bg-slate-50 rounded-xl px-3 py-2"><Icon type="search" size={16}/><input className="flex-1 bg-transparent text-sm border-0 focus:outline-none" value={searchM} onChange={e=>setSearchM(e.target.value)} placeholder="이름 또는 학교로 검색"/></div><div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto">{filtered.map((u:any)=>(<button key={u.id} onClick={()=>aM(u.id)} className="bg-slate-50 rounded-lg p-3 text-left hover:bg-blue-50 text-xs"><p className="font-semibold">{u.name}</p><p className="text-slate-400">{u.school||""}</p></button>))}{filtered.length===0&&<p className="text-slate-400 text-xs col-span-3">결과 없음</p>}</div></div>}
      <div className="flex justify-between items-center mb-3"><h3 className="font-semibold text-sm">시험</h3><button onClick={()=>{setShowNT(true);setNtf(p=>({...p,date:new Date().toISOString().split("T")[0]}));}} className="bg-[#6c63ff] text-white px-4 py-2 rounded-xl text-xs font-semibold">+ 새 시험</button></div>
      {showNT&&<div className="bg-white rounded-2xl p-5 shadow-sm mb-4 flex gap-3 items-end"><div className="flex-1"><label className="text-xs font-semibold text-slate-500">시험 날짜</label><input type="date" className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={ntf.date} onChange={e=>setNtf(p=>({...p,date:e.target.value}))}/></div><button onClick={cT} className="bg-[#6c63ff] text-white px-5 py-2.5 rounded-xl text-xs font-semibold">생성</button><button onClick={()=>setShowNT(false)} className="text-xs text-slate-400 pb-1">취소</button></div>}
      <div className="space-y-2">{tests.map(t=>(<div key={t.id} className="bg-white rounded-xl p-4 shadow-sm hover:ring-2 hover:ring-[#6c63ff]/30">
        {editTest?.id===t.id?<div className="space-y-3">
          <h3 className="font-semibold text-sm">✏️ 시험 수정</h3>
          <div className="grid grid-cols-2 gap-3"><div><label className="text-xs font-semibold text-slate-500">날짜</label><input type="date" className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={editTF.date} onChange={e=>setEditTF(p=>({...p,date:e.target.value}))}/></div><div><label className="text-xs font-semibold text-slate-500">시험명</label><input className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={editTF.title} onChange={e=>setEditTF(p=>({...p,title:e.target.value}))}/></div></div>
          <div><label className="text-xs font-semibold text-slate-500">과제</label><input className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={editTF.assignment} onChange={e=>setEditTF(p=>({...p,assignment:e.target.value}))}/></div>
          <div className="flex gap-2"><button onClick={updateTest} className="bg-[#6c63ff] text-white px-4 py-2 rounded-xl text-xs font-semibold">저장</button><button onClick={()=>setEditTest(null)} className="text-xs text-slate-400">취소</button></div>
        </div>:<div className="flex justify-between items-center">
          <button onClick={()=>loadGrid(t)} className="flex-1 text-left"><p className="font-semibold text-sm">{t.title}</p><p className="text-xs text-slate-400">{fmtDate(t.date)}{t.assignment?` · 과제: ${t.assignment}`:""}</p></button>
          <div className="flex items-center gap-2 ml-2"><button onClick={(e)=>{e.stopPropagation();setEditTest(t);setEditTF({date:t.date,title:t.title,assignment:t.assignment||""});}} className="text-xs text-slate-300 hover:text-[#6c63ff]">수정</button><button onClick={(e)=>{e.stopPropagation();deleteTest(t.id);}} className="text-xs text-slate-300 hover:text-red-500">삭제</button><Icon type="right" size={16}/></div>
        </div>}
      </div>))}{tests.length===0&&<div className="bg-white rounded-2xl p-8 shadow-sm text-center text-slate-400 text-sm">시험 추가 필요</div>}</div>
    </div>);
  }

  // Group list
  return(<div>
    <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">📁 반 관리</h2><button onClick={()=>setShowNG(true)} className="bg-[#6c63ff] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1"><Icon type="plus" size={14}/>새 반</button></div>
    {showNG&&<div className="bg-white rounded-2xl p-5 shadow-sm mb-4 flex gap-3 items-end"><div className="flex-1"><label className="text-xs font-semibold text-slate-500">반 이름</label><input className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={newGN} onChange={e=>setNewGN(e.target.value)} placeholder="수학 정규반"/></div><button onClick={cG} className="bg-[#6c63ff] text-white px-4 py-2.5 rounded-xl text-xs font-semibold">만들기</button></div>}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{groups.map(g=>(<div key={g.id} className="bg-white rounded-xl p-5 shadow-sm hover:ring-2 hover:ring-[#6c63ff]/20 cursor-pointer" onClick={()=>selectGroup(g)}><div className="flex justify-between items-start"><div className="flex items-center gap-2"><Icon type="folder" size={20}/>{editingGId===g.id?<div className="flex items-center gap-1" onClick={e=>e.stopPropagation()}><input className="bg-slate-50 rounded-lg px-2 py-1 text-sm border border-slate-200 focus:outline-none focus:border-[#6c63ff] w-36" value={editGN} onChange={e=>setEditGN(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")renameG(g.id);if(e.key==="Escape"){setEditingGId(null);setEditGN("");}}} autoFocus/><button onClick={()=>renameG(g.id)} className="text-xs text-[#6c63ff] font-semibold">확인</button><button onClick={()=>{setEditingGId(null);setEditGN("");}} className="text-xs text-slate-400">취소</button></div>:<span className="font-semibold">{g.name}</span>}</div><div className="flex gap-2" onClick={e=>e.stopPropagation()}><button onClick={()=>{setEditingGId(g.id);setEditGN(g.name);}} className="text-slate-300 hover:text-[#6c63ff] text-xs">수정</button><button onClick={()=>dG(g.id)} className="text-slate-300 hover:text-red-400 text-xs">삭제</button></div></div></div>))}{groups.length===0&&<div className="bg-white rounded-2xl p-12 shadow-sm text-center text-slate-400 text-sm col-span-2">반을 만들어 보세요!</div>}</div>
  </div>);
}

/* ═══ ADMIN: NOTICE MANAGER ═══ */
function AdminNoticeManager({groups}:{groups:any[]}){
  const[notices,setNotices]=useState<any[]>([]);const[showAdd,setShowAdd]=useState(false);
  const[form,setForm]=useState({class_group_id:0,title:"",content:""});
  const fN=async()=>{const{data}=await supabase.from("class_notices").select("*, class_groups(name)").order("created_at",{ascending:false});if(data)setNotices(data);};
  useEffect(()=>{fN();},[]);
  const addNotice=async()=>{if(!form.class_group_id||!form.content)return;await supabase.from("class_notices").insert({class_group_id:form.class_group_id,title:form.title,content:form.content});setForm({class_group_id:0,title:"",content:""});setShowAdd(false);fN();};
  const delNotice=async(id:number)=>{if(!confirm("삭제?"))return;await supabase.from("class_notices").delete().eq("id",id);fN();};
  return(<div>
    <div className="flex justify-between items-center mb-4 flex-wrap gap-2"><h2 className="text-lg font-bold">📢 공지사항 관리</h2><button onClick={()=>setShowAdd(true)} className="bg-[#6c63ff] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1"><Icon type="plus" size={14}/>새 공지</button></div>
    {showAdd&&<div className="bg-white rounded-2xl p-5 shadow-sm mb-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><label className="text-xs font-semibold text-slate-500">반 선택</label><select className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={form.class_group_id} onChange={e=>setForm(p=>({...p,class_group_id:Number(e.target.value)}))}><option value={0}>반을 선택하세요</option>{groups.map(g=>(<option key={g.id} value={g.id}>{g.name}</option>))}</select></div>
        <div><label className="text-xs font-semibold text-slate-500">제목</label><input className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="공지 제목"/></div>
      </div>
      <div><label className="text-xs font-semibold text-slate-500">내용</label><textarea className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm mt-1 border-0 resize-none h-28" value={form.content} onChange={e=>setForm(p=>({...p,content:e.target.value}))} placeholder="공지 내용을 입력하세요"/></div>
      <div className="flex gap-2"><button onClick={addNotice} className="bg-[#6c63ff] text-white px-4 py-2 rounded-xl text-xs font-semibold">등록</button><button onClick={()=>setShowAdd(false)} className="text-xs text-slate-400">취소</button></div>
    </div>}
    <div className="space-y-3">{notices.map((n:any)=>(<div key={n.id} className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between mb-2"><div><h3 className="font-semibold text-sm">{n.title||"공지"}</h3><div className="flex items-center gap-2 mt-1"><span className="text-xs text-[#6c63ff] bg-[#6c63ff]/10 px-2 py-0.5 rounded-lg">{n.class_groups?.name||""}</span><span className="text-xs text-slate-400">{n.created_at?.slice(0,10)}</span></div></div><button onClick={()=>delNotice(n.id)} className="text-xs text-slate-300 hover:text-red-500">삭제</button></div>
      <p className="text-sm text-slate-600 whitespace-pre-line">{n.content}</p>
    </div>))}{notices.length===0&&<div className="bg-white rounded-2xl p-12 shadow-sm text-center text-slate-400 text-sm">공지사항을 작성해보세요</div>}</div>
  </div>);
}

/* ═══ ADMIN: STUDENT EXAM VIEWER ═══ */
function AdminExamViewer({users}:{users:any[]}){
  const[exams,setExams]=useState<any[]>([]);const[filter,setFilter]=useState("");const[typeFilter,setTypeFilter]=useState("");
  const fE=async()=>{const{data}=await supabase.from("student_exams").select("*, users:user_id(name, school)").order("created_at",{ascending:false});if(data)setExams(data);};
  useEffect(()=>{fE();},[]);
  const filtered=exams.filter(e=>{const name=e.users?.name||"";const match=!filter||name.includes(filter);const tMatch=!typeFilter||e.exam_type===typeFilter;return match&&tMatch;});
  return(<div>
    <h2 className="text-lg font-bold mb-4">📊 학생 시험 성적</h2>
    <div className="flex flex-wrap gap-2 mb-4">
      <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm"><Icon type="search" size={16}/><input className="bg-transparent text-sm border-0 focus:outline-none w-32" value={filter} onChange={e=>setFilter(e.target.value)} placeholder="이름 검색"/></div>
      <select className="bg-white rounded-xl px-3 py-2 text-sm shadow-sm border-0" value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}><option value="">전체</option><option>모의고사</option><option>내신</option></select>
    </div>
    {filtered.length>0?<div className="bg-white rounded-2xl shadow-sm overflow-x-auto"><table className="w-full text-sm"><thead><tr className="bg-slate-50">{["이름","학교","유형","구분","과목","점수","등급","성적변화","고민","하고싶은말"].map(h=><th key={h} className="px-3 py-3 text-left text-xs font-semibold text-slate-400 whitespace-nowrap">{h}</th>)}</tr></thead><tbody>{filtered.map((e:any)=>{let memoObj:any={};try{memoObj=JSON.parse(e.memo||"{}");}catch{}return(<tr key={e.id} className="border-t border-slate-50 hover:bg-slate-50/50"><td className="px-3 py-2.5 font-semibold whitespace-nowrap">{e.users?.name||"?"}</td><td className="px-3 py-2.5 text-xs text-slate-500">{e.users?.school||"—"}</td><td className="px-3 py-2.5"><span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${e.exam_type==="모의고사"?"bg-amber-50 text-amber-600":"bg-blue-50 text-blue-600"}`}>{e.exam_type}</span></td><td className="px-3 py-2.5 text-xs">{e.exam_name||"—"}</td><td className="px-3 py-2.5 text-xs">{e.subject}</td><td className="px-3 py-2.5 font-bold text-[#6c63ff]">{e.score}점</td><td className="px-3 py-2.5 text-xs">{e.grade||"—"}</td><td className="px-3 py-2.5 text-xs text-slate-500 max-w-[120px]">{memoObj.q1||"—"}</td><td className="px-3 py-2.5 text-xs text-slate-500 max-w-[120px]">{memoObj.q2||"—"}</td><td className="px-3 py-2.5 text-xs text-slate-500 max-w-[120px]">{memoObj.q3||"—"}</td></tr>);})}</tbody></table></div>:<div className="bg-white rounded-2xl p-12 shadow-sm text-center text-slate-400 text-sm">학생이 입력한 성적이 없습니다</div>}
  </div>);
}

/* ═══ ADMIN: INQUIRY MANAGER ═══ */
function AdminInquiryManager({onReply}:{onReply?:()=>void}){
  const[inqs,setInqs]=useState<any[]>([]);const[replyId,setReplyId]=useState<number|null>(null);const[replyText,setReplyText]=useState("");const[replyImg,setReplyImg]=useState<File|null>(null);const replyImgRef=useRef<HTMLInputElement>(null);
  const fI=async()=>{const{data}=await supabase.from("inquiries").select("*, users:user_id(name)").order("created_at",{ascending:false});if(data)setInqs(data);};
  useEffect(()=>{fI();},[]);
  const saveReply=async(id:number)=>{let imgUrl="";if(replyImg){imgUrl=await uploadImage(replyImg,`reply_${id}`)||"";}const finalReply=replyText+(imgUrl?`\n[IMG]${imgUrl}[/IMG]`:"");await supabase.from("inquiries").update({reply:finalReply}).eq("id",id);setReplyId(null);setReplyText("");setReplyImg(null);fI();if(onReply)onReply();};
  const delInq=async(id:number)=>{if(!confirm("삭제?"))return;await supabase.from("inquiries").delete().eq("id",id);fI();};
  return(<div><h2 className="text-lg font-bold mb-4">💬 문의사항 관리</h2>{inqs.length>0?<div className="space-y-3">{inqs.map((q:any)=>{const isNew=q.created_at&&(Date.now()-new Date(q.created_at).getTime())<24*60*60*1000;const hasReply=!!q.reply;const imgMatch=q.content?.match(/\[IMG\](.*?)\[\/IMG\]/);const cleanContent=q.content?.replace(/\[IMG\].*?\[\/IMG\]/g,"").trim();const replyImgMatch=q.reply?.match(/\[IMG\](.*?)\[\/IMG\]/);const cleanReply=q.reply?.replace(/\[IMG\].*?\[\/IMG\]/g,"").trim();return(<div key={q.id} className="bg-white rounded-2xl p-5 shadow-sm">
    <div className="flex justify-between mb-2"><div className="flex items-center gap-2"><span className="text-xs font-bold text-[#6c63ff] bg-[#6c63ff]/10 px-2 py-0.5 rounded-lg">{q.users?.name||"?"}</span><span className="text-xs text-slate-400">{q.created_at?.slice(0,10)}</span>{isNew&&<span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">N</span>}<span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${hasReply?"bg-green-50 text-green-600":"bg-amber-50 text-amber-600"}`}>{hasReply?"답변 완료":"답변 대기중"}</span></div><button onClick={()=>delInq(q.id)} className="text-xs text-slate-300 hover:text-red-500">삭제</button></div>
    <h3 className="font-semibold text-sm mb-1">{q.title||"문의"}</h3><p className="text-sm text-slate-600 whitespace-pre-line mb-2">{cleanContent}</p>{imgMatch&&<img src={imgMatch[1]} alt="" className="rounded-xl max-h-48 object-contain mb-3"/>}
    {hasReply?<div className="bg-[#6c63ff]/5 rounded-xl p-3"><p className="text-xs font-semibold text-[#6c63ff] mb-1">내 답변</p><p className="text-sm text-slate-700 whitespace-pre-line">{cleanReply}</p>{replyImgMatch&&<img src={replyImgMatch[1]} alt="" className="mt-2 rounded-xl max-h-48 object-contain"/>}<button onClick={()=>{setReplyId(q.id);setReplyText(cleanReply||"");}} className="text-xs text-slate-400 mt-2">수정</button></div>:replyId===q.id?<div className="space-y-2"><textarea className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm border-0 resize-none h-20" value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="답변을 작성하세요"/><div className="flex items-center gap-2"><button onClick={()=>replyImgRef.current?.click()} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-500">{replyImg?replyImg.name:"이미지 첨부"}</button><input ref={replyImgRef} type="file" accept="image/*" className="hidden" onChange={e=>{if(e.target.files?.[0])setReplyImg(e.target.files[0]);}}/>{replyImg&&<button onClick={()=>setReplyImg(null)} className="text-xs text-red-400">삭제</button>}</div><div className="flex gap-2"><button onClick={()=>saveReply(q.id)} className="bg-[#6c63ff] text-white px-4 py-1.5 rounded-xl text-xs font-semibold">답변</button><button onClick={()=>{setReplyId(null);setReplyImg(null);}} className="text-xs text-slate-400">취소</button></div></div>:<button onClick={()=>{setReplyId(q.id);setReplyText("");}} className="text-xs text-[#6c63ff] font-semibold">답변하기</button>}
  </div>);})}</div>:<div className="bg-white rounded-2xl p-12 shadow-sm text-center text-slate-400 text-sm">문의가 없습니다</div>}</div>);
}

/* ═══ ADMIN: TOKEN MANAGER ═══ */
function AdminTokenManager({users,fetchUsers}:{users:any[];fetchUsers:()=>void}){
  const students=users.filter((u:any)=>u.role==="student"&&u.status==="approved");
  const[amount,setAmount]=useState<{[k:number]:string}>({});const[reason,setReason]=useState<{[k:number]:string}>({});
  const giveToken=async(uid:number)=>{const amt=Number(amount[uid]||0);if(!amt)return;const u=students.find(s=>s.id===uid);const cur=u?.tokens||0;await supabase.from("users").update({tokens:cur+amt}).eq("id",uid);await supabase.from("token_logs").insert({user_id:uid,amount:amt,reason:reason[uid]||"관리자 지급"});setAmount(p=>({...p,[uid]:""}));setReason(p=>({...p,[uid]:""}));fetchUsers();};
  return(<div><h2 className="text-lg font-bold mb-4">🥩 서서갈비 관리</h2><div className="bg-white rounded-2xl shadow-sm overflow-x-auto"><table className="w-full text-sm"><thead><tr className="bg-slate-50"><th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">이름</th><th className="px-4 py-3 text-xs font-semibold text-slate-400">보유</th><th className="px-4 py-3 text-xs font-semibold text-slate-400">지급량</th><th className="px-4 py-3 text-xs font-semibold text-slate-400">사유</th><th className="px-4 py-3"></th></tr></thead><tbody>{students.map((s:any)=>(<tr key={s.id} className="border-t border-slate-50"><td className="px-4 py-2.5 font-semibold">{s.name}</td><td className="px-4 py-2.5 text-center font-bold text-[#6c63ff]">{s.tokens||0}</td><td className="px-4 py-2.5"><input type="number" className="w-16 bg-slate-50 rounded-lg px-2 py-1.5 text-xs border-0 text-center" value={amount[s.id]||""} onChange={e=>setAmount(p=>({...p,[s.id]:e.target.value}))} placeholder="0"/></td><td className="px-4 py-2.5"><input className="bg-slate-50 rounded-lg px-2 py-1.5 text-xs border-0 w-full" value={reason[s.id]||""} onChange={e=>setReason(p=>({...p,[s.id]:e.target.value}))} placeholder="사유"/></td><td className="px-4 py-2.5"><button onClick={()=>giveToken(s.id)} className="bg-[#6c63ff] text-white px-3 py-1 rounded-lg text-xs font-semibold">지급</button></td></tr>))}</tbody></table></div></div>);
}

/* ═══ ADMIN: SHOP MANAGER ═══ */
function AdminShopManager(){
  const[items,setItems]=useState<any[]>([]);const[showAdd,setShowAdd]=useState(false);const[form,setForm]=useState({name:"",description:"",price:0});
  const fI=async()=>{const{data}=await supabase.from("shop_items").select("*").order("created_at");if(data)setItems(data);};
  useEffect(()=>{fI();},[]);
  const addItem=async()=>{if(!form.name||!form.price)return;await supabase.from("shop_items").insert(form);setForm({name:"",description:"",price:0});setShowAdd(false);fI();};
  const toggleItem=async(id:number,active:boolean)=>{await supabase.from("shop_items").update({active:!active}).eq("id",id);fI();};
  const delItem=async(id:number)=>{if(!confirm("삭제?"))return;await supabase.from("shop_items").delete().eq("id",id);fI();};
  return(<div><div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">🏪 상점 관리</h2><button onClick={()=>setShowAdd(true)} className="bg-[#6c63ff] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1"><Icon type="plus" size={14}/>상품 추가</button></div>
    {showAdd&&<div className="bg-white rounded-2xl p-5 shadow-sm mb-4 space-y-3"><div className="grid grid-cols-2 gap-3"><div><label className="text-xs font-semibold text-slate-500">상품명</label><input className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div><div><label className="text-xs font-semibold text-slate-500">가격 (서서갈비)</label><input type="number" className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={form.price} onChange={e=>setForm(p=>({...p,price:Number(e.target.value)}))}/></div></div><div><label className="text-xs font-semibold text-slate-500">설명</label><input className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))}/></div><div className="flex gap-2"><button onClick={addItem} className="bg-[#6c63ff] text-white px-4 py-2 rounded-xl text-xs font-semibold">추가</button><button onClick={()=>setShowAdd(false)} className="text-xs text-slate-400">취소</button></div></div>}
    <div className="space-y-2">{items.map((item:any)=>(<div key={item.id} className={`bg-white rounded-xl p-4 shadow-sm flex justify-between items-center ${!item.active?"opacity-50":""}`}><div><p className="font-semibold text-sm">{item.name}</p><p className="text-xs text-slate-400">{item.description||"설명 없음"} · 🥩 {item.price}</p></div><div className="flex gap-2"><button onClick={()=>toggleItem(item.id,item.active)} className="text-xs text-slate-400">{item.active?"비활성":"활성"}</button><button onClick={()=>delItem(item.id)} className="text-xs text-slate-300 hover:text-red-500">삭제</button></div></div>))}{items.length===0&&<div className="bg-white rounded-2xl p-12 shadow-sm text-center text-slate-400 text-sm">상품을 추가하세요</div>}</div>
  </div>);
}

/* ═══ ADMIN SITE SETTINGS ═══ */
function AdminSiteSettings({settings,fetchSettings}:{settings:any;fetchSettings:()=>void}){
  const[name,setName]=useState(settings.profile_name||"");const[bio,setBio]=useState(settings.profile_bio||"");const[upl,setUpl]=useState("");const[msg,setMsg]=useState("");const pRef=useRef<HTMLInputElement>(null);const bRef=useRef<HTMLInputElement>(null);
  const saveMeta=async()=>{await supabase.from("site_settings").update({value:name}).eq("key","profile_name");await supabase.from("site_settings").update({value:bio}).eq("key","profile_bio");setMsg("저장!");fetchSettings();};
  const up=async(file:File,key:string)=>{setUpl(key);const url=await uploadImage(file,key);if(url){await supabase.from("site_settings").update({value:url}).eq("key",key);fetchSettings();}setUpl("");};
  return(<div><h2 className="text-lg font-bold mb-4">로그인 화면 설정</h2><div className="grid grid-cols-1 lg:grid-cols-2 gap-4"><div className="bg-white rounded-2xl p-6 shadow-sm"><h3 className="font-semibold text-sm mb-4">프로필</h3><div className="flex items-center gap-4 mb-4"><img src={settings.profile_image||"/profile.png"} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-slate-100"/><button onClick={()=>pRef.current?.click()} className="bg-[#6c63ff] text-white px-4 py-2 rounded-xl text-xs font-semibold">{upl==="profile_image"?"...":"사진 변경"}</button><input ref={pRef} type="file" accept="image/*" className="hidden" onChange={e=>{if(e.target.files?.[0])up(e.target.files[0],"profile_image");}}/></div><div className="space-y-3"><div><label className="text-xs font-semibold text-slate-500">이름</label><input className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm mt-1 border-0" value={name} onChange={e=>setName(e.target.value)}/></div><div><label className="text-xs font-semibold text-slate-500">약력 (\\n = 줄바꿈)</label><textarea className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm mt-1 border-0 resize-none h-28" value={bio} onChange={e=>setBio(e.target.value)}/></div></div><button onClick={saveMeta} className="mt-3 bg-[#6c63ff] text-white px-6 py-2.5 rounded-xl text-sm font-semibold">저장</button>{msg&&<span className="text-xs text-green-500 ml-2">{msg}</span>}</div><div className="bg-white rounded-2xl p-6 shadow-sm"><h3 className="font-semibold text-sm mb-4">배경</h3><div className="rounded-xl overflow-hidden mb-4 bg-slate-100 h-[200px]">{settings.background_image&&settings.background_image.length>5?<img src={settings.background_image} alt="" className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center text-slate-300 text-sm">없음</div>}</div><button onClick={()=>bRef.current?.click()} className="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold">{upl==="background_image"?"...":"배경 변경"}</button><input ref={bRef} type="file" accept="image/*" className="hidden" onChange={e=>{if(e.target.files?.[0])up(e.target.files[0],"background_image");}}/></div></div></div>);
}

/* ═══ MAIN ═══ */
export default function Home(){
  const[user,setUser]=useState<any>(null);const[tab,setTab]=useState("classes");const[mm,setMm]=useState(false);
  const[users,setUsers]=useState<any[]>([]);const[groups,setGroups]=useState<any[]>([]);const[loading,setLoading]=useState(false);const[initializing,setInitializing]=useState(true);
  const[unansweredInq,setUnansweredInq]=useState(0);
  const[settings,setSettings]=useState<any>({profile_name:"서정인 수학",profile_bio:"",profile_image:"",background_image:""});
  const fU=async()=>{const{data}=await supabase.from("users").select("*").order("created_at",{ascending:false});if(data)setUsers(data);};
  const fG=async()=>{const{data}=await supabase.from("class_groups").select("*").order("created_at");if(data)setGroups(data);};
  const fInqCount=async()=>{const{count}=await supabase.from("inquiries").select("*",{count:"exact",head:true}).or("reply.is.null,reply.eq.");if(count)setUnansweredInq(count);else setUnansweredInq(0);};
  const fS=async()=>{const{data}=await supabase.from("site_settings").select("*");if(data){const s:any={};data.forEach((r:any)=>{s[r.key]=r.value;});setSettings(s);}};
  useEffect(()=>{fS();
    // 새로고침 시 로그인 복원
    try{const saved=window.localStorage.getItem("suhsuh_user");if(saved){const u=JSON.parse(saved);if(u&&u.id){(async()=>{const{data}=await supabase.from("users").select("*").eq("id",u.id).single();if(data&&data.status!=="pending"){setUser(data);setTab(data.role==="admin"?"classes":"grades");}setInitializing(false);})();return;}}
    }catch{}setInitializing(false);
  },[]);
  useEffect(()=>{if(user){setLoading(true);Promise.all([fU(),fG(),fInqCount()]).then(()=>setLoading(false));window.localStorage.setItem("suhsuh_user",JSON.stringify({id:user.id}));}else{window.localStorage.removeItem("suhsuh_user");}},[user]);

  const handleLogin=async(id:string,pw:string):Promise<string>=>{const{data}=await supabase.from("users").select("*").eq("login_id",id).eq("password",pw).single();if(!data)return"아이디 또는 비밀번호 오류";if(data.status==="pending")return"승인 대기 중";setUser(data);setTab(data.role==="admin"?"classes":"grades");return"";};
  const logout=()=>{setUser(null);setTab("classes");};

  if(initializing)return<div className="min-h-screen bg-[#f0f2f8] flex items-center justify-center"><img src="/logo.png" alt="" className="h-10 opacity-50 animate-pulse"/></div>;
  if(!user)return<LoginScreen onLogin={handleLogin} settings={settings}/>;
  if(loading)return<div className="min-h-screen bg-[#f0f2f8] flex items-center justify-center"><img src="/logo.png" alt="" className="h-10 opacity-50 animate-pulse"/></div>;
  if(user.role!=="admin")return<StudentView user={user} logout={logout}/>;

  const mi=[{id:"classes",icon:"folder",label:"반 / 시험"},{id:"students",icon:"users",label:"학생 관리"},{id:"exams",icon:"test",label:"시험 성적"},{id:"tokens",icon:"coin",label:"서서갈비"},{id:"shop",icon:"cart",label:"상점 관리"},{id:"notices",icon:"bell",label:"공지사항"},{id:"inquiries",icon:"msg",label:"문의사항"},{id:"site",icon:"upload",label:"로그인 화면"},{id:"settings",icon:"settings",label:"설정"}];
  const navEl=(mob?:boolean)=>(<nav className={`${mob?"":"flex-1"} space-y-1`}>{mi.map(m=>(<button key={m.id} onClick={()=>{setTab(m.id);if(mob)setMm(false);if(m.id==="inquiries")fInqCount();}} className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors relative ${tab===m.id?"bg-[#6c63ff] text-white":"text-slate-500 hover:bg-slate-50"}`}><Icon type={m.icon} size={18}/>{m.label}{m.id==="inquiries"&&unansweredInq>0&&<span className="bg-red-500 text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center ml-auto">{unansweredInq}</span>}</button>))}</nav>);

  return(<div className="min-h-screen bg-[#f0f2f8] flex">
    <aside className="hidden lg:flex flex-col w-56 bg-white shadow-sm min-h-screen p-5 fixed left-0 top-0 bottom-0 z-40"><div className="flex items-center gap-3 mb-8"><img src="/logo.png" alt="" className="h-7 object-contain"/><span className="font-bold text-slate-800 text-sm">서정인 수학</span></div>{navEl()}<div className="pt-4 border-t border-slate-100 mt-4"><div className="flex items-center gap-3 mb-3 px-1"><div className="w-8 h-8 bg-[#6c63ff]/10 rounded-full flex items-center justify-center text-[#6c63ff]"><Icon type="user" size={14}/></div><div><p className="text-xs font-semibold">{user.name}</p><p className="text-[10px] text-slate-400">관리자</p></div></div><button onClick={logout} className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-50"><Icon type="logout" size={16}/>로그아웃</button></div></aside>
    <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-40 px-4 py-3 flex justify-between items-center"><div className="flex items-center gap-2"><img src="/logo.png" alt="" className="h-6 object-contain"/><span className="font-bold text-sm">서정인 수학</span></div><button onClick={()=>setMm(!mm)}><Icon type={mm?"close":"menu"} size={22}/></button></div>
    {mm&&<><div onClick={()=>setMm(false)} className="lg:hidden fixed inset-0 bg-black/30 z-40"/><div className="lg:hidden fixed right-0 top-0 bottom-0 w-64 bg-white z-50 p-5 shadow-xl"><div className="flex justify-between items-center mb-6"><span className="font-bold">메뉴</span><button onClick={()=>setMm(false)}><Icon type="close" size={20}/></button></div>{navEl(true)}<button onClick={()=>{logout();setMm(false);}} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm text-red-400 mt-4"><Icon type="logout" size={16}/>로그아웃</button></div></>}
    <main className="flex-1 lg:ml-56 pt-16 lg:pt-0"><div className="max-w-5xl mx-auto p-5 lg:p-8">
      {tab==="classes"&&<AdminClassManager users={users}/>}
      {tab==="students"&&<AdminStudentManager users={users} fetchUsers={fU} groups={groups}/>}
      {tab==="exams"&&<AdminExamViewer users={users}/>}
      {tab==="tokens"&&<AdminTokenManager users={users} fetchUsers={fU}/>}
      {tab==="shop"&&<AdminShopManager/>}
      {tab==="notices"&&<AdminNoticeManager groups={groups}/>}
      {tab==="inquiries"&&<AdminInquiryManager onReply={fInqCount}/>}
      {tab==="site"&&<AdminSiteSettings settings={settings} fetchSettings={fS}/>}
      {tab==="settings"&&<div><h2 className="text-lg font-bold mb-4">설정</h2><div className="bg-white rounded-2xl p-6 shadow-sm max-w-md"><p className="text-sm text-slate-500">관리자 비밀번호: Supabase에서 변경</p></div></div>}
    </div></main>
  </div>);
}
