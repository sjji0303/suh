"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

const Icon=({type,size=20}:{type:string;size?:number})=>{const s:any={width:size,height:size,strokeWidth:1.5,fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round"};const i:any={folder:<svg viewBox="0 0 24 24" {...s}><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,test:<svg viewBox="0 0 24 24" {...s}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,settings:<svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09"/></svg>,logout:<svg viewBox="0 0 24 24" {...s}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,user:<svg viewBox="0 0 24 24" {...s}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,menu:<svg viewBox="0 0 24 24" {...s}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,close:<svg viewBox="0 0 24 24" {...s}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,left:<svg viewBox="0 0 24 24" {...s}><polyline points="15 18 9 12 15 6"/></svg>,right:<svg viewBox="0 0 24 24" {...s}><polyline points="9 18 15 12 9 6"/></svg>,upload:<svg viewBox="0 0 24 24" {...s}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,plus:<svg viewBox="0 0 24 24" {...s}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,back:<svg viewBox="0 0 24 24" {...s}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,users:<svg viewBox="0 0 24 24" {...s}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,home:<svg viewBox="0 0 24 24" {...s}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>};return i[type]||null;};
async function uploadImage(file:File,path:string){const ext=file.name.split(".").pop();const fn=`${path}_${Date.now()}.${ext}`;const{error}=await supabase.storage.from("images").upload(fn,file,{upsert:true});if(error)return null;return supabase.storage.from("images").getPublicUrl(fn).data.publicUrl;}

/* ═══ LOGIN ═══ */
function LoginScreen({onLogin,settings}:{onLogin:(id:string,pw:string)=>Promise<string>;settings:any}){
  const[id,setId]=useState("");const[pw,setPw]=useState("");const[err,setErr]=useState("");const[ld,setLd]=useState(false);
  const go=async()=>{setLd(true);setErr(await onLogin(id,pw));setLd(false);};
  const bg=settings.background_image||"";const pi=settings.profile_image||"/profile.png";const nm=settings.profile_name||"서서갈비 T";const bio=(settings.profile_bio||"").split("\\n").join("\n");
  return(<div className="min-h-screen relative flex items-center justify-center p-4">
    {bg?<div className="absolute inset-0 z-0" style={{backgroundImage:`url(${bg})`,backgroundSize:"cover",backgroundPosition:"center"}}><div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"/></div>:<div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600"/>}
    {/* PC */}
    <div className="hidden md:flex relative z-10 w-full max-w-4xl gap-5">
      <div className="w-[340px] bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-xl text-center flex-shrink-0">
        <img src={pi} alt="" className="w-28 h-28 rounded-full mx-auto mb-4 shadow-lg object-cover border-4 border-white"/>
        <h2 className="text-xl font-bold text-slate-800 mb-2">{nm}</h2>
        <div className="w-10 h-0.5 bg-slate-300 mx-auto mb-4"/>{bio&&<div className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">{bio}</div>}
      </div>
      <div className="flex-1 bg-white/95 backdrop-blur-md rounded-3xl p-10 shadow-xl flex flex-col justify-center">
        <div className="mb-8"><h1 className="text-2xl font-bold text-slate-800 mb-1">맛있게, 확실하게,</h1><h1 className="text-2xl font-bold text-[#6c63ff] mb-3">서서갈비로 수학하기</h1><p className="text-sm text-slate-400">로그인하여 시작하세요</p></div>
        <div className="space-y-4 max-w-sm">
          <div><label className="text-xs font-semibold text-slate-500 mb-1 block">아이디</label><input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6c63ff]" value={id} onChange={e=>{setId(e.target.value);setErr("");}} placeholder="이름+학부모번호뒷4자리" onKeyDown={e=>e.key==="Enter"&&go()}/></div>
          <div><label className="text-xs font-semibold text-slate-500 mb-1 block">비밀번호</label><input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6c63ff]" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} placeholder="비밀번호" onKeyDown={e=>e.key==="Enter"&&go()}/></div>
          {err&&<p className="text-red-400 text-xs">{err}</p>}
          <button onClick={go} disabled={ld} className="w-full bg-slate-800 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-slate-900 disabled:opacity-50">{ld?"...":"로그인"}</button>
        </div>
      </div>
    </div>
    {/* Mobile */}
    <div className="md:hidden relative z-10 w-full max-w-sm">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-6"><img src={pi} alt="" className="w-20 h-20 rounded-full mx-auto mb-3 shadow-lg object-cover border-4 border-white"/><h2 className="text-lg font-bold text-slate-800">{nm}</h2><p className="text-xs text-slate-400 mt-1">서서갈비 수학학원</p></div>
        <div className="space-y-3"><input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6c63ff]" value={id} onChange={e=>{setId(e.target.value);setErr("");}} placeholder="아이디" onKeyDown={e=>e.key==="Enter"&&go()}/><input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6c63ff]" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} placeholder="비밀번호" onKeyDown={e=>e.key==="Enter"&&go()}/></div>
        {err&&<p className="text-red-400 text-xs mt-2">{err}</p>}
        <button onClick={go} disabled={ld} className="w-full bg-slate-800 text-white py-3 rounded-xl font-semibold text-sm mt-4">{ld?"...":"로그인"}</button>
      </div>
    </div>
  </div>);
}

/* ═══ STUDENT VIEW (QANDA STYLE) ═══ */
function StudentView({user,logout,settings}:{user:any;logout:()=>void;settings:any}){
  const[tab,setTab]=useState("home");const[tests,setTests]=useState<any[]>([]);const[idx,setIdx]=useState(0);const[questions,setQuestions]=useState<any[]>([]);const[results,setResults]=useState<any[]>([]);const[info,setInfo]=useState<any>(null);const[mm,setMm]=useState(false);
  const[pw,setPw]=useState({n1:"",n2:""});const[pwMsg,setPwMsg]=useState("");

  useEffect(()=>{(async()=>{const{data}=await supabase.from("tests").select("*").order("date",{ascending:false});if(data&&data.length>0){setTests(data);loadTest(data[0]);}})();},[]);
  const loadTest=async(t:any)=>{const[q,r,si]=await Promise.all([supabase.from("test_questions").select("*").eq("test_id",t.id).order("question_number"),supabase.from("test_results").select("*").eq("test_id",t.id).eq("student_id",user.student_id||user.id),supabase.from("test_student_info").select("*").eq("test_id",t.id).eq("student_id",user.student_id||user.id).single()]);if(q.data)setQuestions(q.data);if(r.data)setResults(r.data);setInfo(si.data||null);};
  const nav=(d:number)=>{const n=idx+d;if(n>=0&&n<tests.length){setIdx(n);loadTest(tests[n]);}};
  const changePw=async()=>{if(pw.n1!==pw.n2){setPwMsg("불일치");return;}if(pw.n1.length<4){setPwMsg("4자 이상");return;}await supabase.from("users").update({password:pw.n1}).eq("id",user.id);setPwMsg("변경 완료!");setPw({n1:"",n2:""});};

  const test=tests[idx];
  const rm:any={};results.forEach((r:any)=>{rm[r.question_number]=r.is_correct;});
  const wrong=test?questions.filter(q=>rm[q.question_number]===false).sort((a,b)=>a.correct_rate-b.correct_rate):[];

  const menuItems=[{id:"home",icon:"home",label:"홈"},{id:"grades",icon:"test",label:"성적표"},{id:"settings",icon:"settings",label:"설정"}];

  return(<div className="min-h-screen bg-white flex">
    {/* Sidebar - PC */}
    <aside className="hidden lg:flex flex-col w-56 border-r border-slate-100 min-h-screen p-4 fixed left-0 top-0 bottom-0 z-40">
      <div className="flex items-center gap-2 mb-6 px-2"><img src="/logo.png" alt="logo" className="h-8 object-contain"/></div>
      <nav className="flex-1 space-y-1">
        {menuItems.map(m=>(<button key={m.id} onClick={()=>setTab(m.id)} className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${tab===m.id?"bg-slate-100 text-slate-900":"text-slate-500 hover:bg-slate-50"}`}><Icon type={m.icon} size={18}/>{m.label}</button>))}
      </nav>
      <div className="border-t border-slate-100 pt-3">
        <div className="px-2 mb-2"><p className="text-xs font-semibold text-slate-700">{user.name}</p><p className="text-[10px] text-slate-400">{user.school||""}</p></div>
        <button onClick={logout} className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-50"><Icon type="logout" size={16}/>로그아웃</button>
      </div>
    </aside>
    {/* Mobile header */}
    <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-100 z-40 px-4 py-3 flex justify-between items-center">
      <img src="/logo.png" alt="logo" className="h-6 object-contain"/>
      <button onClick={()=>setMm(!mm)}><Icon type={mm?"close":"menu"} size={22}/></button>
    </div>
    {mm&&<><div onClick={()=>setMm(false)} className="lg:hidden fixed inset-0 bg-black/30 z-40"/><div className="lg:hidden fixed right-0 top-0 bottom-0 w-64 bg-white z-50 p-5 shadow-xl"><div className="flex justify-between items-center mb-6"><span className="font-bold">메뉴</span><button onClick={()=>setMm(false)}><Icon type="close" size={20}/></button></div><nav className="space-y-1">{menuItems.map(m=>(<button key={m.id} onClick={()=>{setTab(m.id);setMm(false);}} className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium ${tab===m.id?"bg-slate-100 text-slate-900":"text-slate-500"}`}><Icon type={m.icon} size={18}/>{m.label}</button>))}</nav><button onClick={()=>{logout();setMm(false);}} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm text-red-400 mt-4"><Icon type="logout" size={16}/>로그아웃</button></div></>}

    {/* Content */}
    <main className="flex-1 lg:ml-56 pt-14 lg:pt-0">
      <div className="max-w-3xl mx-auto p-5 lg:p-8">
        {tab==="home"&&(<div>
          <div className="text-center py-12">
            <h1 className="text-xl font-bold text-slate-800 mb-2">안녕하세요, {user.name}님!</h1>
            <p className="text-sm text-slate-400">서서갈비 수학학원에 오신 것을 환영합니다</p>
          </div>
          {info&&<div className="bg-slate-50 rounded-2xl p-5 mb-4">
            <h3 className="font-semibold text-sm mb-3">최근 시험 요약</h3>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div><p className="text-[10px] text-slate-400">점수</p><p className="text-lg font-bold text-[#6c63ff]">{info.total_score}</p></div>
              <div><p className="text-[10px] text-slate-400">반 평균</p><p className="text-lg font-bold text-slate-600">{info.class_average}</p></div>
              <div><p className="text-[10px] text-slate-400">출석</p><p className={`text-sm font-bold ${info.attendance==="출석"?"text-green-600":"text-red-500"}`}>{info.attendance||"—"}</p></div>
              <div><p className="text-[10px] text-slate-400">과제</p><p className="text-sm font-bold text-slate-600">{info.assignment_score||"—"}</p></div>
            </div>
          </div>}
        </div>)}

        {tab==="grades"&&(<div>
          {test?<>
            <div className="flex items-center justify-between mb-4"><button onClick={()=>nav(1)} className="p-2 hover:bg-slate-100 rounded-xl"><Icon type="left" size={18}/></button><div className="text-center"><p className="text-lg font-bold">{test.date}</p><p className="text-xs text-slate-400">{test.title}</p></div><button onClick={()=>nav(-1)} className={`p-2 rounded-xl ${idx===0?"text-slate-200":"hover:bg-slate-100"}`} disabled={idx===0}><Icon type="right" size={18}/></button></div>
            {info&&<div className="bg-slate-50 rounded-2xl p-4 mb-4 grid grid-cols-2 sm:grid-cols-4 gap-3"><div className="text-center"><p className="text-[10px] text-slate-400">출석</p><p className={`text-sm font-bold ${info.attendance==="출석"?"text-green-600":info.attendance==="지각"?"text-amber-500":"text-red-500"}`}>{info.attendance||"—"}</p></div><div className="text-center"><p className="text-[10px] text-slate-400">클리닉</p><p className="text-sm font-semibold text-slate-600">{info.clinic_time||"—"}</p></div><div className="text-center"><p className="text-[10px] text-slate-400">과제</p><p className="text-sm font-semibold text-slate-600">{info.assignment_score||"—"}</p></div><div className="text-center"><p className="text-[10px] text-slate-400">오답</p><p className="text-sm font-semibold text-slate-600">{info.wrong_answer_score||"—"}</p></div></div>}
            {results.length>0?<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-5"><h3 className="font-semibold text-sm mb-3">문항별 결과</h3><div className="space-y-1 max-h-72 overflow-y-auto">{questions.map(q=>(<div key={q.question_number} className="flex items-center gap-3 py-1"><span className="text-xs text-slate-400 w-5 text-right">{q.question_number}</span><span className="text-xs text-slate-500 flex-1 truncate">{q.topic||"—"}</span><span className={`text-xs font-bold w-6 text-center ${rm[q.question_number]?"text-blue-600":"text-red-400"}`}>{rm[q.question_number]?"O":"X"}</span><span className="text-[10px] text-slate-400 w-10 text-right">{q.correct_rate}%</span></div>))}</div></div>
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-2xl p-5"><h3 className="font-semibold text-sm mb-3">정답률</h3><div className="flex items-end gap-1 h-28">{questions.map(q=>(<div key={q.question_number} className="flex-1 flex flex-col items-center gap-1"><div className="w-full rounded-t" style={{height:`${Math.max(q.correct_rate,3)}%`,background:rm[q.question_number]?"#6c63ff":"#ff6b6b"}}/><span className="text-[7px] text-slate-400">{q.question_number}</span></div>))}</div></div>
                {wrong.length>0&&<div className="bg-slate-50 rounded-2xl p-5"><h3 className="font-semibold text-sm mb-2">최다 오답</h3>{wrong.slice(0,5).map(q=>(<div key={q.question_number} className="flex items-center gap-2 text-xs py-1"><span className="bg-red-50 text-red-500 font-bold w-6 h-6 rounded-lg flex items-center justify-center">{q.question_number}</span><span className="flex-1">{q.topic||"—"}</span><span className="text-slate-400">{q.correct_rate}%</span></div>))}</div>}
                {info&&<><div className="bg-slate-50 rounded-2xl p-5"><div className="grid grid-cols-3 gap-3 text-center"><div><p className="text-[10px] text-slate-400">내 점수</p><p className="text-xl font-bold text-[#6c63ff]">{info.total_score}</p></div><div><p className="text-[10px] text-slate-400">반 평균</p><p className="text-xl font-bold text-slate-600">{info.class_average}</p></div><div><p className="text-[10px] text-slate-400">최고</p><p className="text-xl font-bold text-slate-600">{info.class_best}</p></div></div></div>{info.comment&&<div className="bg-[#6c63ff]/5 rounded-2xl p-5"><p className="text-xs font-semibold text-[#6c63ff] mb-1">선생님 코멘트</p><p className="text-sm text-slate-700 leading-relaxed">{info.comment}</p></div>}</>}
              </div>
            </div>:<div className="bg-slate-50 rounded-2xl p-12 text-center text-slate-400 text-sm">결과 미입력</div>}
          </>:<div className="bg-slate-50 rounded-2xl p-12 text-center text-slate-400">시험이 없습니다</div>}
        </div>)}

        {tab==="settings"&&(<div>
          <h2 className="text-lg font-bold mb-4">설정</h2>
          <div className="bg-slate-50 rounded-2xl p-6 max-w-md">
            <h3 className="font-semibold text-sm mb-4">비밀번호 변경</h3>
            <div className="space-y-3"><input type="password" className="w-full bg-white rounded-xl px-4 py-3 text-sm border border-slate-200 focus:outline-none focus:border-[#6c63ff]" value={pw.n1} onChange={e=>setPw(p=>({...p,n1:e.target.value}))} placeholder="새 비밀번호"/><input type="password" className="w-full bg-white rounded-xl px-4 py-3 text-sm border border-slate-200 focus:outline-none focus:border-[#6c63ff]" value={pw.n2} onChange={e=>setPw(p=>({...p,n2:e.target.value}))} placeholder="확인"/></div>
            {pwMsg&&<p className={`text-xs mt-2 ${pwMsg.includes("완료")?"text-green-500":"text-red-400"}`}>{pwMsg}</p>}
            <button onClick={changePw} className="mt-4 bg-slate-800 text-white px-6 py-2.5 rounded-xl text-sm font-semibold">변경</button>
          </div>
          <div className="bg-slate-50 rounded-2xl p-6 max-w-md mt-4">
            <h3 className="font-semibold text-sm mb-3">내 정보</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between py-2 border-b border-slate-200"><span className="text-slate-400">이름</span><span className="font-medium">{user.name}</span></div>
              <div className="flex justify-between py-2 border-b border-slate-200"><span className="text-slate-400">아이디</span><span className="font-medium">{user.login_id}</span></div>
              <div className="flex justify-between py-2"><span className="text-slate-400">학교</span><span className="font-medium">{user.school||"—"}</span></div>
            </div>
          </div>
        </div>)}
      </div>
    </main>
  </div>);
}

/* ═══ ADMIN: STUDENT MANAGER ═══ */
function AdminStudentManager({users,fetchUsers,groups}:{users:any[];fetchUsers:()=>void;groups:any[]}){
  const[showAdd,setShowAdd]=useState(false);const[form,setForm]=useState({name:"",school:"",parent_phone:"",student_phone:"",class_ids:[] as number[]});
  const students=users.filter((u:any)=>u.role==="student"&&u.status==="approved");

  const addStudent=async()=>{
    if(!form.name||!form.parent_phone)return;
    const last4=form.parent_phone.slice(-4);
    const loginId=form.name+last4;
    const{data:ex}=await supabase.from("users").select("id").eq("login_id",loginId).single();
    if(ex){alert("이미 존재하는 아이디: "+loginId);return;}
    const{data:newUser}=await supabase.from("users").insert({login_id:loginId,password:last4,name:form.name,role:"student",school:form.school,parent_phone:form.parent_phone,student_phone:form.student_phone,phone:form.student_phone,status:"approved"}).select().single();
    if(newUser&&form.class_ids.length>0){
      const rows=form.class_ids.map(cid=>({user_id:newUser.id,class_group_id:cid}));
      await supabase.from("class_members").insert(rows);
    }
    setForm({name:"",school:"",parent_phone:"",student_phone:"",class_ids:[]});setShowAdd(false);fetchUsers();
  };

  const removeStudent=async(id:number)=>{if(!confirm("삭제?"))return;await supabase.from("users").delete().eq("id",id);fetchUsers();};

  const toggleClass=(cid:number)=>{setForm(p=>({...p,class_ids:p.class_ids.includes(cid)?p.class_ids.filter(x=>x!==cid):[...p.class_ids,cid]}));};

  return(<div>
    <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">👨‍🎓 학생 관리</h2><button onClick={()=>setShowAdd(true)} className="bg-[#6c63ff] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1"><Icon type="plus" size={14}/>학생 추가</button></div>

    {showAdd&&<div className="bg-white rounded-2xl p-5 shadow-sm mb-4 border border-[#6c63ff]/20">
      <h3 className="font-semibold text-sm mb-3">새 학생 추가</h3>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div><label className="text-[10px] font-semibold text-slate-400">이름 *</label><input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0 focus:outline-none" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="학생 이름"/></div>
        <div><label className="text-[10px] font-semibold text-slate-400">학교</label><input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0 focus:outline-none" value={form.school} onChange={e=>setForm(p=>({...p,school:e.target.value}))} placeholder="직접 입력"/></div>
        <div><label className="text-[10px] font-semibold text-slate-400">학부모 연락처 *</label><input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0 focus:outline-none" value={form.parent_phone} onChange={e=>setForm(p=>({...p,parent_phone:e.target.value}))} placeholder="01064382222"/></div>
        <div><label className="text-[10px] font-semibold text-slate-400">학생 연락처</label><input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0 focus:outline-none" value={form.student_phone} onChange={e=>setForm(p=>({...p,student_phone:e.target.value}))} placeholder="01012345678"/></div>
      </div>
      {groups.length>0&&<div className="mb-3"><label className="text-[10px] font-semibold text-slate-400">소속 반 (복수 선택)</label><div className="flex flex-wrap gap-2 mt-1">{groups.map(g=>(<button key={g.id} onClick={()=>toggleClass(g.id)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${form.class_ids.includes(g.id)?"bg-[#6c63ff] text-white":"bg-slate-100 text-slate-500"}`}>{g.name}</button>))}</div></div>}
      {form.name&&form.parent_phone&&<p className="text-xs text-slate-400 mb-3">자동 생성 아이디: <b className="text-[#6c63ff]">{form.name}{form.parent_phone.slice(-4)}</b> / 비밀번호: <b>{form.parent_phone.slice(-4)}</b></p>}
      <div className="flex gap-2"><button onClick={addStudent} className="bg-[#6c63ff] text-white px-4 py-2 rounded-xl text-xs font-semibold">추가</button><button onClick={()=>setShowAdd(false)} className="text-xs text-slate-400">취소</button></div>
    </div>}

    <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead><tr className="bg-slate-50">{["이름","학교","아이디","학부모 연락처","학생 연락처",""].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400">{h}</th>)}</tr></thead>
        <tbody>{students.map((s:any)=>(<tr key={s.id} className="border-t border-slate-50 hover:bg-slate-50/50">
          <td className="px-4 py-3 font-semibold">{s.name}</td>
          <td className="px-4 py-3 text-slate-500 text-xs">{s.school||"—"}</td>
          <td className="px-4 py-3 font-mono text-xs text-[#6c63ff]">{s.login_id}</td>
          <td className="px-4 py-3 text-xs text-slate-500">{s.parent_phone||"—"}</td>
          <td className="px-4 py-3 text-xs text-slate-500">{s.student_phone||s.phone||"—"}</td>
          <td className="px-4 py-3 text-right"><button onClick={()=>removeStudent(s.id)} className="text-xs text-slate-300 hover:text-red-500">삭제</button></td>
        </tr>))}{students.length===0&&<tr><td colSpan={6} className="text-center py-10 text-slate-400 text-sm">학생을 추가하세요</td></tr>}</tbody>
      </table>
    </div>
  </div>);
}

/* ═══ ADMIN: CLASS + EXCEL TEST ═══ */
function AdminClassManager({users}:{users:any[]}){
  const[groups,setGroups]=useState<any[]>([]);const[selGroup,setSelGroup]=useState<any>(null);const[members,setMembers]=useState<any[]>([]);const[tests,setTests]=useState<any[]>([]);const[selTest,setSelTest]=useState<any>(null);const[questions,setQuestions]=useState<any[]>([]);const[grid,setGrid]=useState<any>({});const[infoGrid,setInfoGrid]=useState<any>({});const[saving,setSaving]=useState(false);const[newGroupName,setNewGroupName]=useState("");const[showNewGroup,setShowNewGroup]=useState(false);const[newTestForm,setNewTestForm]=useState({date:"",title:"",qCount:15,assignment:""});const[newTopics,setNewTopics]=useState<string[]>([]);const[showNewTest,setShowNewTest]=useState(false);const[showAddMember,setShowAddMember]=useState(false);
  const approved=users.filter((u:any)=>u.status==="approved"&&u.role!=="admin");
  const fetchGroups=async()=>{const{data}=await supabase.from("class_groups").select("*").order("created_at");if(data)setGroups(data);};
  const fetchMembers=async(gid:number)=>{const{data}=await supabase.from("class_members").select("*, users:user_id(*)").eq("class_group_id",gid);if(data)setMembers(data);};
  const fetchTests=async(gid:number)=>{const{data}=await supabase.from("tests").select("*").eq("class_group_id",gid).order("date",{ascending:false});if(data)setTests(data);};
  useEffect(()=>{fetchGroups();},[]);
  useEffect(()=>{if(selGroup){fetchMembers(selGroup.id);fetchTests(selGroup.id);}else{setMembers([]);setTests([]);}setSelTest(null);},[selGroup]);
  const createGroup=async()=>{if(!newGroupName)return;await supabase.from("class_groups").insert({name:newGroupName});setNewGroupName("");setShowNewGroup(false);fetchGroups();};
  const deleteGroup=async(id:number)=>{if(!confirm("삭제?"))return;await supabase.from("class_groups").delete().eq("id",id);if(selGroup?.id===id)setSelGroup(null);fetchGroups();};
  const addMember=async(uid:number)=>{if(!selGroup)return;await supabase.from("class_members").insert({class_group_id:selGroup.id,user_id:uid});fetchMembers(selGroup.id);};
  const removeMember=async(id:number)=>{await supabase.from("class_members").delete().eq("id",id);if(selGroup)fetchMembers(selGroup.id);};
  const createTest=async()=>{if(!selGroup||!newTestForm.date)return;const title=newTestForm.title||`${newTestForm.date} ${selGroup.name}`;const{data:t}=await supabase.from("tests").insert({date:newTestForm.date,title,class_group_id:selGroup.id,class_name:selGroup.name,assignment:newTestForm.assignment}).select().single();if(!t)return;const qs=Array.from({length:newTestForm.qCount},(_,i)=>({test_id:t.id,question_number:i+1,topic:newTopics[i]||"",correct_rate:0}));await supabase.from("test_questions").insert(qs);setShowNewTest(false);setNewTestForm({date:"",title:"",qCount:15,assignment:""});setNewTopics([]);fetchTests(selGroup.id);};
  const loadTestGrid=async(test:any)=>{setSelTest(test);const{data:q}=await supabase.from("test_questions").select("*").eq("test_id",test.id).order("question_number");if(q)setQuestions(q);const mids=members.map((m:any)=>m.user_id);const{data:res}=await supabase.from("test_results").select("*").eq("test_id",test.id);const{data:infos}=await supabase.from("test_student_info").select("*").eq("test_id",test.id);const g:any={};const ig:any={};mids.forEach(uid=>{const u=members.find((m:any)=>m.user_id===uid)?.users;ig[uid]={attendance:"",clinic_time:"",assignment_score:"",wrong_answer_score:"",comment:"",total_score:0,class_average:0,class_best:0,student_id:u?.student_id||uid};});if(res)res.forEach((r:any)=>{const uid=members.find((m:any)=>m.users?.student_id===r.student_id||m.user_id===r.student_id)?.user_id;if(uid!==undefined)g[`${uid}-${r.question_number}`]=r.is_correct?1:0;});if(infos)infos.forEach((si:any)=>{const uid=members.find((m:any)=>m.users?.student_id===si.student_id||m.user_id===si.student_id)?.user_id;if(uid!==undefined)ig[uid]={...ig[uid],...si};});setGrid(g);setInfoGrid(ig);};
  const setCell=(uid:number,qn:number,val:string)=>{const k=`${uid}-${qn}`;setGrid((p:any)=>{const n={...p};if(val==="")delete n[k];else n[k]=Number(val);return n;});};
  const setIC=(uid:number,key:string,val:string)=>{setInfoGrid((p:any)=>({...p,[uid]:{...p[uid],[key]:val}}));};
  const getScore=(uid:number)=>{let c=0;questions.forEach(q=>{if(grid[`${uid}-${q.question_number}`]===1)c++;});return c;};
  const hasAny=(uid:number)=>questions.some(q=>grid[`${uid}-${q.question_number}`]!==undefined);
  const saveAll=async()=>{if(!selTest)return;setSaving(true);for(const m of members){const uid=m.user_id;const sid=m.users?.student_id||uid;await supabase.from("test_results").delete().eq("test_id",selTest.id).eq("student_id",sid);const rows:any[]=[];questions.forEach(q=>{const v=grid[`${uid}-${q.question_number}`];if(v!==undefined)rows.push({test_id:selTest.id,student_id:sid,question_number:q.question_number,is_correct:v===1});});if(rows.length>0)await supabase.from("test_results").insert(rows);const sc=getScore(uid);const inf=infoGrid[uid]||{};const pay={test_id:selTest.id,student_id:sid,total_score:sc,class_average:Number(inf.class_average)||0,class_best:Number(inf.class_best)||0,attendance:inf.attendance||"",assignment_score:inf.assignment_score||"",wrong_answer_score:inf.wrong_answer_score||"",clinic_time:inf.clinic_time||"",comment:inf.comment||""};const{data:ex}=await supabase.from("test_student_info").select("id").eq("test_id",selTest.id).eq("student_id",sid).single();if(ex)await supabase.from("test_student_info").update(pay).eq("id",ex.id);else await supabase.from("test_student_info").insert(pay);}for(const q of questions){const{count:c}=await supabase.from("test_results").select("*",{count:"exact",head:true}).eq("test_id",selTest.id).eq("question_number",q.question_number).eq("is_correct",true);const{count:t}=await supabase.from("test_results").select("*",{count:"exact",head:true}).eq("test_id",selTest.id).eq("question_number",q.question_number);const r=t&&t>0?Math.round(((c||0)/t)*100):0;await supabase.from("test_questions").update({correct_rate:r}).eq("id",q.id);}setSaving(false);alert("저장 완료!");};

  if(selTest&&selGroup)return(<div>
    <button onClick={()=>setSelTest(null)} className="flex items-center gap-1 text-sm text-slate-400 mb-3"><Icon type="back" size={16}/>돌아가기</button>
    <div className="flex items-center justify-between mb-4"><div><h2 className="text-lg font-bold">{selTest.title}</h2><p className="text-xs text-slate-400">{selTest.date} · 과제: {selTest.assignment||"없음"}</p></div><button onClick={saveAll} disabled={saving} className="bg-[#6c63ff] text-white px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50">{saving?"저장 중...":"💾 전체 저장"}</button></div>
    <div className="bg-white rounded-2xl shadow-sm mb-4 overflow-x-auto"><table className="text-xs border-collapse w-full"><thead><tr className="bg-slate-50"><th className="sticky left-0 bg-slate-50 z-10 px-3 py-2 text-left font-semibold text-slate-500 min-w-[60px]">이름</th><th className="px-2 py-2 font-semibold text-slate-500 min-w-[50px]">총점</th>{questions.map(q=><th key={q.question_number} className="px-1 py-2 font-semibold text-slate-400 min-w-[32px] text-center">{q.question_number}</th>)}</tr></thead><tbody>{members.map((m:any)=>{const uid=m.user_id;const usr=m.users;const sc=getScore(uid);const ans=hasAny(uid);return(<tr key={uid} className="border-b border-slate-50 hover:bg-blue-50/30"><td className="sticky left-0 bg-white z-10 px-3 py-2 font-semibold text-slate-700">{usr?.name||"?"}</td><td className="px-2 py-2 text-center font-bold text-[#6c63ff]">{ans?sc:"미응시"}</td>{questions.map(q=>{const k=`${uid}-${q.question_number}`;const v=grid[k];return(<td key={q.question_number} className="px-0.5 py-1 text-center"><input className={`w-7 h-7 text-center rounded font-bold text-xs border focus:outline-none focus:ring-1 focus:ring-[#6c63ff] ${v===1?"bg-blue-50 border-blue-200 text-blue-600":v===0?"bg-red-50 border-red-200 text-red-500":"bg-white border-slate-200"}`} value={v===undefined?"":v} onChange={e=>{const val=e.target.value;if(val===""||val==="0"||val==="1")setCell(uid,q.question_number,val);}} maxLength={1}/></td>);})}</tr>);})}</tbody></table></div>
    <div className="bg-white rounded-2xl shadow-sm overflow-x-auto"><table className="text-xs border-collapse w-full"><thead><tr className="bg-slate-50"><th className="sticky left-0 bg-slate-50 z-10 px-3 py-2 text-left font-semibold text-slate-500 min-w-[60px]">이름</th><th className="px-2 py-2 font-semibold text-slate-500">출석</th><th className="px-2 py-2 font-semibold text-slate-500">클리닉</th><th className="px-2 py-2 font-semibold text-slate-500">과제</th><th className="px-2 py-2 font-semibold text-slate-500">오답</th><th className="px-2 py-2 font-semibold text-slate-500 min-w-[200px]">코멘트</th></tr></thead><tbody>{members.map((m:any)=>{const uid=m.user_id;const usr=m.users;const inf=infoGrid[uid]||{};return(<tr key={uid} className="border-b border-slate-50"><td className="sticky left-0 bg-white z-10 px-3 py-2 font-semibold">{usr?.name||"?"}</td><td className="px-1 py-1"><select className="bg-slate-50 rounded-lg px-2 py-1.5 text-xs border-0 w-full" value={inf.attendance||""} onChange={e=>setIC(uid,"attendance",e.target.value)}><option value="">—</option><option>출석</option><option>결석</option><option>지각</option></select></td><td className="px-1 py-1"><input className="bg-slate-50 rounded-lg px-2 py-1.5 text-xs border-0 w-full" value={inf.clinic_time||""} onChange={e=>setIC(uid,"clinic_time",e.target.value)}/></td><td className="px-1 py-1"><input className="bg-slate-50 rounded-lg px-2 py-1.5 text-xs border-0 w-full" value={inf.assignment_score||""} onChange={e=>setIC(uid,"assignment_score",e.target.value)}/></td><td className="px-1 py-1"><input className="bg-slate-50 rounded-lg px-2 py-1.5 text-xs border-0 w-full" value={inf.wrong_answer_score||""} onChange={e=>setIC(uid,"wrong_answer_score",e.target.value)}/></td><td className="px-1 py-1"><input className="bg-slate-50 rounded-lg px-2 py-1.5 text-xs border-0 w-full" value={inf.comment||""} onChange={e=>setIC(uid,"comment",e.target.value)}/></td></tr>);})}</tbody></table></div>
    <div className="bg-white rounded-2xl shadow-sm p-5 mt-4"><h3 className="font-semibold text-sm mb-3">반 평균 / 최고점</h3><div className="grid grid-cols-2 gap-3 max-w-xs"><div><label className="text-[10px] text-slate-400">반 평균</label><input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm border-0" value={infoGrid[members[0]?.user_id]?.class_average||""} onChange={e=>{const v=e.target.value;setInfoGrid((p:any)=>{const n={...p};members.forEach((m:any)=>{n[m.user_id]={...n[m.user_id],class_average:v};});return n;});}}/></div><div><label className="text-[10px] text-slate-400">최고점</label><input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm border-0" value={infoGrid[members[0]?.user_id]?.class_best||""} onChange={e=>{const v=e.target.value;setInfoGrid((p:any)=>{const n={...p};members.forEach((m:any)=>{n[m.user_id]={...n[m.user_id],class_best:v};});return n;});}}/></div></div></div>
  </div>);

  if(selGroup)return(<div>
    <button onClick={()=>setSelGroup(null)} className="flex items-center gap-1 text-sm text-slate-400 mb-3"><Icon type="back" size={16}/>반 목록</button>
    <h2 className="text-lg font-bold mb-4">📁 {selGroup.name}</h2>
    <div className="bg-white rounded-2xl p-5 shadow-sm mb-4"><div className="flex justify-between items-center mb-3"><h3 className="font-semibold text-sm">학생 ({members.length}명)</h3><button onClick={()=>setShowAddMember(!showAddMember)} className="text-xs text-[#6c63ff] font-semibold">+ 학생 추가</button></div><div className="flex flex-wrap gap-2">{members.map((m:any)=>(<div key={m.id} className="bg-slate-50 rounded-lg px-3 py-1.5 text-xs flex items-center gap-2"><span className="font-medium">{m.users?.name}</span><button onClick={()=>removeMember(m.id)} className="text-red-300 hover:text-red-500">×</button></div>))}{members.length===0&&<p className="text-slate-400 text-xs">학생 추가 필요</p>}</div></div>
    {showAddMember&&<div className="bg-white rounded-2xl p-5 shadow-sm mb-4"><h3 className="font-semibold text-sm mb-3">학생 선택</h3><div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{approved.filter(u=>!members.some((m:any)=>m.user_id===u.id)).map((u:any)=>(<button key={u.id} onClick={()=>addMember(u.id)} className="bg-slate-50 rounded-lg p-3 text-left hover:bg-blue-50 text-xs"><p className="font-semibold">{u.name}</p><p className="text-slate-400">{u.school||""}</p></button>))}</div></div>}
    <div className="flex justify-between items-center mb-3"><h3 className="font-semibold text-sm">시험</h3><button onClick={()=>{setShowNewTest(true);setNewTestForm(p=>({...p,date:new Date().toISOString().split("T")[0]}));}} className="bg-[#6c63ff] text-white px-4 py-2 rounded-xl text-xs font-semibold">+ 새 시험</button></div>
    {showNewTest&&<div className="bg-white rounded-2xl p-5 shadow-sm mb-4 space-y-3"><div className="grid grid-cols-2 gap-3"><div><label className="text-xs font-semibold text-slate-500">날짜</label><input type="date" className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={newTestForm.date} onChange={e=>setNewTestForm(p=>({...p,date:e.target.value}))}/></div><div><label className="text-xs font-semibold text-slate-500">시험명</label><input className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={newTestForm.title} onChange={e=>setNewTestForm(p=>({...p,title:e.target.value}))}/></div></div><div className="grid grid-cols-2 gap-3"><div><label className="text-xs font-semibold text-slate-500">문항수</label><input type="number" className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={newTestForm.qCount} onChange={e=>setNewTestForm(p=>({...p,qCount:Number(e.target.value)||15}))}/></div><div><label className="text-xs font-semibold text-slate-500">과제</label><input className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={newTestForm.assignment} onChange={e=>setNewTestForm(p=>({...p,assignment:e.target.value}))}/></div></div><div><label className="text-xs font-semibold text-slate-500">단원명</label><div className="mt-1 grid grid-cols-2 gap-1 max-h-40 overflow-y-auto">{Array.from({length:newTestForm.qCount},(_,i)=>(<div key={i} className="flex items-center gap-1"><span className="text-[10px] text-slate-400 w-4 text-right">{i+1}</span><input className="flex-1 bg-slate-50 rounded-lg px-2 py-1 text-xs border-0" value={newTopics[i]||""} onChange={e=>{const t=[...newTopics];t[i]=e.target.value;setNewTopics(t);}}/></div>))}</div></div><div className="flex gap-2"><button onClick={createTest} className="bg-[#6c63ff] text-white px-4 py-2 rounded-xl text-xs font-semibold">생성</button><button onClick={()=>setShowNewTest(false)} className="text-xs text-slate-400">취소</button></div></div>}
    <div className="space-y-2">{tests.map(t=>(<button key={t.id} onClick={()=>loadTestGrid(t)} className="w-full bg-white rounded-xl p-4 shadow-sm text-left hover:ring-2 hover:ring-[#6c63ff]/30 flex justify-between items-center"><div><p className="font-semibold text-sm">{t.title}</p><p className="text-xs text-slate-400">{t.date}</p></div><Icon type="right" size={16}/></button>))}{tests.length===0&&<div className="bg-white rounded-2xl p-8 shadow-sm text-center text-slate-400 text-sm">시험 추가 필요</div>}</div>
  </div>);

  return(<div>
    <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">📁 반 관리</h2><button onClick={()=>setShowNewGroup(true)} className="bg-[#6c63ff] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1"><Icon type="plus" size={14}/>새 반</button></div>
    {showNewGroup&&<div className="bg-white rounded-2xl p-5 shadow-sm mb-4 flex gap-3 items-end"><div className="flex-1"><label className="text-xs font-semibold text-slate-500">반 이름</label><input className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={newGroupName} onChange={e=>setNewGroupName(e.target.value)} placeholder="수학 정규반"/></div><button onClick={createGroup} className="bg-[#6c63ff] text-white px-4 py-2.5 rounded-xl text-xs font-semibold">만들기</button></div>}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{groups.map(g=>(<div key={g.id} className="bg-white rounded-xl p-5 shadow-sm hover:ring-2 hover:ring-[#6c63ff]/20 cursor-pointer" onClick={()=>setSelGroup(g)}><div className="flex justify-between items-start"><div className="flex items-center gap-2"><Icon type="folder" size={20}/><span className="font-semibold">{g.name}</span></div><button onClick={e=>{e.stopPropagation();deleteGroup(g.id);}} className="text-slate-300 hover:text-red-400 text-xs">삭제</button></div></div>))}{groups.length===0&&<div className="bg-white rounded-2xl p-12 shadow-sm text-center text-slate-400 text-sm col-span-2">반을 만들어 보세요!</div>}</div>
  </div>);
}

/* ═══ ADMIN SITE SETTINGS ═══ */
function AdminSiteSettings({settings,fetchSettings}:{settings:any;fetchSettings:()=>void}){
  const[name,setName]=useState(settings.profile_name||"");const[bio,setBio]=useState(settings.profile_bio||"");const[upl,setUpl]=useState("");const[msg,setMsg]=useState("");const pRef=useRef<HTMLInputElement>(null);const bRef=useRef<HTMLInputElement>(null);
  const saveMeta=async()=>{await supabase.from("site_settings").update({value:name}).eq("key","profile_name");await supabase.from("site_settings").update({value:bio}).eq("key","profile_bio");setMsg("저장!");fetchSettings();};
  const up=async(file:File,key:string)=>{setUpl(key);const url=await uploadImage(file,key);if(url){await supabase.from("site_settings").update({value:url}).eq("key",key);fetchSettings();}setUpl("");};
  return(<div><h2 className="text-lg font-bold mb-4">로그인 화면 설정</h2><div className="grid grid-cols-1 lg:grid-cols-2 gap-4"><div className="bg-white rounded-2xl p-6 shadow-sm"><h3 className="font-semibold text-sm mb-4">프로필</h3><div className="flex items-center gap-4 mb-4"><img src={settings.profile_image||"/profile.png"} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-slate-100"/><button onClick={()=>pRef.current?.click()} className="bg-[#6c63ff] text-white px-4 py-2 rounded-xl text-xs font-semibold">{upl==="profile_image"?"...":"사진 변경"}</button><input ref={pRef} type="file" accept="image/*" className="hidden" onChange={e=>{if(e.target.files?.[0])up(e.target.files[0],"profile_image");}}/></div><div className="space-y-3"><div><label className="text-xs font-semibold text-slate-500">이름</label><input className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm mt-1 border-0" value={name} onChange={e=>setName(e.target.value)}/></div><div><label className="text-xs font-semibold text-slate-500">약력 (\\n = 줄바꿈)</label><textarea className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm mt-1 border-0 resize-none h-28" value={bio} onChange={e=>setBio(e.target.value)}/></div></div><button onClick={saveMeta} className="mt-3 bg-[#6c63ff] text-white px-6 py-2.5 rounded-xl text-sm font-semibold">저장</button>{msg&&<span className="text-xs text-green-500 ml-2">{msg}</span>}</div><div className="bg-white rounded-2xl p-6 shadow-sm"><h3 className="font-semibold text-sm mb-4">배경 이미지</h3><div className="rounded-xl overflow-hidden mb-4 bg-slate-100 h-[200px]">{settings.background_image?<img src={settings.background_image} alt="" className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center text-slate-300 text-sm">없음</div>}</div><button onClick={()=>bRef.current?.click()} className="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold">{upl==="background_image"?"...":"배경 변경"}</button><input ref={bRef} type="file" accept="image/*" className="hidden" onChange={e=>{if(e.target.files?.[0])up(e.target.files[0],"background_image");}}/></div></div></div>);
}

/* ═══ MAIN ═══ */
export default function Home(){
  const[user,setUser]=useState<any>(null);const[tab,setTab]=useState("classes");const[mm,setMm]=useState(false);
  const[users,setUsers]=useState<any[]>([]);const[groups,setGroups]=useState<any[]>([]);const[loading,setLoading]=useState(false);
  const[settings,setSettings]=useState<any>({profile_name:"서서갈비 T",profile_bio:"",profile_image:"",background_image:""});
  const fetchUsers=async()=>{const{data}=await supabase.from("users").select("*").order("created_at",{ascending:false});if(data)setUsers(data);};
  const fetchGroups=async()=>{const{data}=await supabase.from("class_groups").select("*").order("created_at");if(data)setGroups(data);};
  const fetchSettings=async()=>{const{data}=await supabase.from("site_settings").select("*");if(data){const s:any={};data.forEach((r:any)=>{s[r.key]=r.value;});setSettings(s);}};
  useEffect(()=>{fetchSettings();},[]);
  useEffect(()=>{if(user){setLoading(true);Promise.all([fetchUsers(),fetchGroups()]).then(()=>setLoading(false));};},[user]);

  const handleLogin=async(id:string,pw:string):Promise<string>=>{const{data}=await supabase.from("users").select("*").eq("login_id",id).eq("password",pw).single();if(!data)return"아이디 또는 비밀번호 오류";if(data.status==="pending")return"승인 대기 중";setUser(data);setTab(data.role==="admin"?"classes":"home");return"";};
  const logout=()=>{setUser(null);setTab("classes");};

  if(!user)return<LoginScreen onLogin={handleLogin} settings={settings}/>;
  if(loading)return<div className="min-h-screen bg-[#f0f2f8] flex items-center justify-center"><img src="/logo.png" alt="" className="h-10 opacity-50 animate-pulse"/></div>;
  if(user.role!=="admin")return<StudentView user={user} logout={logout} settings={settings}/>;

  // Admin
  const mi=[{id:"classes",icon:"folder",label:"반 / 시험"},{id:"students",icon:"users",label:"학생 관리"},{id:"site",icon:"upload",label:"로그인 화면"},{id:"settings",icon:"settings",label:"설정"}];
  const navEl=(mob?:boolean)=>(<nav className={`${mob?"":"flex-1"} space-y-1`}>{mi.map(m=>(<button key={m.id} onClick={()=>{setTab(m.id);if(mob)setMm(false);}} className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${tab===m.id?"bg-[#6c63ff] text-white":"text-slate-500 hover:bg-slate-50"}`}><Icon type={m.icon} size={18}/>{m.label}</button>))}</nav>);

  return(<div className="min-h-screen bg-[#f0f2f8] flex">
    <aside className="hidden lg:flex flex-col w-56 bg-white shadow-sm min-h-screen p-5 fixed left-0 top-0 bottom-0 z-40">
      <div className="flex items-center gap-3 mb-8"><img src="/logo.png" alt="" className="h-7 object-contain"/><span className="font-bold text-slate-800 text-sm">서서갈비</span></div>
      {navEl()}
      <div className="pt-4 border-t border-slate-100 mt-4"><div className="flex items-center gap-3 mb-3 px-1"><div className="w-8 h-8 bg-[#6c63ff]/10 rounded-full flex items-center justify-center text-[#6c63ff]"><Icon type="user" size={14}/></div><div><p className="text-xs font-semibold">{user.name}</p><p className="text-[10px] text-slate-400">관리자</p></div></div><button onClick={logout} className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-50"><Icon type="logout" size={16}/>로그아웃</button></div>
    </aside>
    <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-40 px-4 py-3 flex justify-between items-center"><div className="flex items-center gap-2"><img src="/logo.png" alt="" className="h-6 object-contain"/><span className="font-bold text-sm">서서갈비</span></div><button onClick={()=>setMm(!mm)}><Icon type={mm?"close":"menu"} size={22}/></button></div>
    {mm&&<><div onClick={()=>setMm(false)} className="lg:hidden fixed inset-0 bg-black/30 z-40"/><div className="lg:hidden fixed right-0 top-0 bottom-0 w-64 bg-white z-50 p-5 shadow-xl"><div className="flex justify-between items-center mb-6"><span className="font-bold">메뉴</span><button onClick={()=>setMm(false)}><Icon type="close" size={20}/></button></div>{navEl(true)}<button onClick={()=>{logout();setMm(false);}} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm text-red-400 mt-4"><Icon type="logout" size={16}/>로그아웃</button></div></>}
    <main className="flex-1 lg:ml-56 pt-16 lg:pt-0"><div className="max-w-5xl mx-auto p-5 lg:p-8">
      {tab==="classes"&&<AdminClassManager users={users}/>}
      {tab==="students"&&<AdminStudentManager users={users} fetchUsers={fetchUsers} groups={groups}/>}
      {tab==="site"&&<AdminSiteSettings settings={settings} fetchSettings={fetchSettings}/>}
      {tab==="settings"&&<div><h2 className="text-lg font-bold mb-4">설정</h2><div className="bg-white rounded-2xl p-6 shadow-sm max-w-md"><p className="text-sm text-slate-500">관리자 계정의 비밀번호는 Supabase에서 직접 변경하세요.</p></div></div>}
    </div></main>
  </div>);
}
