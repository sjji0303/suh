"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

const SCHOOLS = ["계성고","경신고","용문고","대원외고"];
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL||"";

const Icon = ({type,size=20}:{type:string;size?:number}) => {
  const s:any = {width:size,height:size,strokeWidth:1.5,fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round"};
  const icons:any = {
    dashboard:<svg viewBox="0 0 24 24" {...s}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    test:<svg viewBox="0 0 24 24" {...s}><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
    settings:<svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
    logout:<svg viewBox="0 0 24 24" {...s}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    user:<svg viewBox="0 0 24 24" {...s}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    menu:<svg viewBox="0 0 24 24" {...s}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    close:<svg viewBox="0 0 24 24" {...s}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    left:<svg viewBox="0 0 24 24" {...s}><polyline points="15 18 9 12 15 6"/></svg>,
    right:<svg viewBox="0 0 24 24" {...s}><polyline points="9 18 15 12 9 6"/></svg>,
    upload:<svg viewBox="0 0 24 24" {...s}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  };
  return icons[type]||null;
};

/* helper: upload image to supabase storage */
async function uploadImage(file:File,path:string):Promise<string|null>{
  const ext=file.name.split(".").pop();
  const fileName=`${path}_${Date.now()}.${ext}`;
  const{error}=await supabase.storage.from("images").upload(fileName,file,{upsert:true});
  if(error){console.error(error);return null;}
  const{data}=supabase.storage.from("images").getPublicUrl(fileName);
  return data.publicUrl;
}

/* ───── LOGIN SCREEN ───── */
function LoginScreen({onLogin,onSignup,settings}:{onLogin:(id:string,pw:string)=>Promise<string>;onSignup:()=>void;settings:any}) {
  const [id,setId]=useState("");const [pw,setPw]=useState("");const [err,setErr]=useState("");const [loading,setLoading]=useState(false);
  const handle=async()=>{setLoading(true);const e=await onLogin(id,pw);setErr(e);setLoading(false);};
  const bg=settings.background_image||"";
  const profileImg=settings.profile_image||"/profile.png";
  const name=settings.profile_name||"서서갈비 T";
  const bio=(settings.profile_bio||"").split("\\n").join("\n");

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background */}
      {bg?<div className="absolute inset-0 z-0"><img src={bg} alt="" className="w-full h-full object-cover"/><div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"/></div>
      :<div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600"/>}

      {/* PC Layout: 2 panels */}
      <div className="hidden md:flex relative z-10 w-full max-w-4xl gap-5">
        {/* Profile Card */}
        <div className="w-[340px] bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-xl text-center flex-shrink-0">
          <img src={profileImg} alt="" className="w-28 h-28 rounded-full mx-auto mb-4 shadow-lg object-cover border-4 border-white"/>
          <h2 className="text-xl font-bold text-slate-800 mb-2">{name}</h2>
          <div className="w-10 h-0.5 bg-slate-300 mx-auto mb-4"/>
          {bio&&<div className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">{bio}</div>}
        </div>

        {/* Login Form */}
        <div className="flex-1 bg-white/95 backdrop-blur-md rounded-3xl p-10 shadow-xl flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-1">맛있게, 확실하게,</h1>
            <h1 className="text-2xl font-bold text-[#6c63ff] mb-3">서서갈비로 국어하기</h1>
            <p className="text-sm text-slate-400">로그인하여 시작하세요</p>
          </div>
          <div className="space-y-4 max-w-sm">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">아이디</label>
              <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors" value={id} onChange={e=>{setId(e.target.value);setErr("");}} placeholder="아이디를 입력하세요" onKeyDown={e=>e.key==="Enter"&&handle()}/>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">비밀번호</label>
              <input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} placeholder="비밀번호를 입력하세요" onKeyDown={e=>e.key==="Enter"&&handle()}/>
            </div>
            {err&&<p className="text-red-400 text-xs">{err}</p>}
            <button onClick={handle} disabled={loading} className="w-full bg-slate-800 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-slate-900 transition-colors disabled:opacity-50">{loading?"로그인 중...":"로그인"}</button>
            <div className="flex justify-center gap-4 pt-2">
              <button onClick={onSignup} className="text-xs text-slate-400 hover:text-[#6c63ff]">회원가입</button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout: stacked */}
      <div className="md:hidden relative z-10 w-full max-w-sm">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-xl">
          <div className="text-center mb-6">
            <img src={profileImg} alt="" className="w-20 h-20 rounded-full mx-auto mb-3 shadow-lg object-cover border-4 border-white"/>
            <h2 className="text-lg font-bold text-slate-800">{name}</h2>
            <p className="text-xs text-slate-400 mt-1">서서갈비 국어 학원</p>
          </div>
          <div className="space-y-3">
            <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6c63ff]" value={id} onChange={e=>{setId(e.target.value);setErr("");}} placeholder="아이디" onKeyDown={e=>e.key==="Enter"&&handle()}/>
            <input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6c63ff]" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} placeholder="비밀번호" onKeyDown={e=>e.key==="Enter"&&handle()}/>
          </div>
          {err&&<p className="text-red-400 text-xs mt-2">{err}</p>}
          <button onClick={handle} disabled={loading} className="w-full bg-slate-800 text-white py-3 rounded-xl font-semibold text-sm mt-4">{loading?"로그인 중...":"로그인"}</button>
          <button onClick={onSignup} className="w-full text-slate-400 text-xs mt-3">회원가입</button>
        </div>
      </div>
    </div>
  );
}

/* ───── SIGNUP ───── */
function SignupPage({onBack}:{onBack:()=>void}) {
  const [form,setForm]=useState({login_id:"",password:"",password2:"",name:"",role:"student",school:SCHOOLS[0],grade:1,phone:""});
  const [error,setError]=useState("");const [success,setSuccess]=useState(false);
  const set=(k:string,v:any)=>setForm(p=>({...p,[k]:v}));
  const handle=async()=>{
    setError("");if(!form.login_id||!form.password||!form.name){setError("필수 항목을 입력하세요.");return;}
    if(form.password!==form.password2){setError("비밀번호 불일치");return;}
    const{data:ex}=await supabase.from("users").select("id").eq("login_id",form.login_id).single();
    if(ex){setError("이미 사용 중인 아이디");return;}
    await supabase.from("users").insert({login_id:form.login_id,password:form.password,name:form.name,role:form.role,school:form.school,grade:form.grade,phone:form.phone,status:"pending"});
    setSuccess(true);
  };
  if(success) return (<div className="min-h-screen bg-[#f0f2f8] flex items-center justify-center p-4"><div className="bg-white rounded-3xl p-10 w-full max-w-sm shadow-sm text-center"><div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-2xl">✓</div><h2 className="text-xl font-bold mb-2">가입 신청 완료</h2><p className="text-sm text-slate-400 mb-6">관리자 승인 후 로그인 가능</p><button onClick={onBack} className="w-full bg-[#6c63ff] text-white py-3 rounded-xl font-semibold text-sm">로그인으로</button></div></div>);
  return (<div className="min-h-screen bg-[#f0f2f8] flex items-center justify-center p-4"><div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-sm"><div className="text-center mb-6"><h1 className="text-lg font-bold text-slate-800">회원가입</h1></div><div className="flex gap-2 mb-4">{[{v:"student",l:"학생"},{v:"parent",l:"학부모"}].map(r=>(<button key={r.v} onClick={()=>set("role",r.v)} className={`flex-1 py-2 rounded-xl text-xs font-semibold ${form.role===r.v?"bg-[#6c63ff] text-white":"bg-slate-100 text-slate-400"}`}>{r.l}</button>))}</div><div className="space-y-3"><input className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none border-0" value={form.login_id} onChange={e=>set("login_id",e.target.value)} placeholder="아이디"/><div className="grid grid-cols-2 gap-2"><input type="password" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none border-0" value={form.password} onChange={e=>set("password",e.target.value)} placeholder="비밀번호"/><input type="password" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none border-0" value={form.password2} onChange={e=>set("password2",e.target.value)} placeholder="비밀번호 확인"/></div><input className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none border-0" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="이름"/><div className="grid grid-cols-2 gap-2"><select className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none border-0" value={form.school} onChange={e=>set("school",e.target.value)}>{SCHOOLS.map(s=><option key={s}>{s}</option>)}</select><select className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none border-0" value={form.grade} onChange={e=>set("grade",Number(e.target.value))}>{[1,2,3].map(g=><option key={g} value={g}>{g}학년</option>)}</select></div></div>{error&&<p className="text-red-400 text-xs mt-2">{error}</p>}<button onClick={handle} className="w-full bg-[#6c63ff] text-white py-3 rounded-xl font-semibold text-sm mt-4">가입 신청</button><button onClick={onBack} className="w-full text-slate-400 text-xs mt-3">← 로그인으로</button></div></div>);
}

/* ───── ADMIN: SITE SETTINGS ───── */
function AdminSiteSettings({settings,fetchSettings}:{settings:any;fetchSettings:()=>void}) {
  const [name,setName]=useState(settings.profile_name||"");
  const [bio,setBio]=useState(settings.profile_bio||"");
  const [uploading,setUploading]=useState("");
  const [msg,setMsg]=useState("");
  const profileRef=useRef<HTMLInputElement>(null);
  const bgRef=useRef<HTMLInputElement>(null);

  const saveMeta=async()=>{
    await supabase.from("site_settings").update({value:name}).eq("key","profile_name");
    await supabase.from("site_settings").update({value:bio}).eq("key","profile_bio");
    setMsg("저장 완료!");fetchSettings();
  };

  const handleUpload=async(file:File,key:string)=>{
    setUploading(key);
    const url=await uploadImage(file,key);
    if(url){await supabase.from("site_settings").update({value:url}).eq("key",key);fetchSettings();}
    setUploading("");
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-4">로그인 화면 설정</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-sm text-slate-700 mb-4">프로필</h3>
          <div className="flex items-center gap-4 mb-4">
            <img src={settings.profile_image||"/profile.png"} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-slate-100"/>
            <div>
              <button onClick={()=>profileRef.current?.click()} className="bg-[#6c63ff] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1" disabled={uploading==="profile_image"}>
                <Icon type="upload" size={14}/> {uploading==="profile_image"?"업로드 중...":"사진 변경"}
              </button>
              <input ref={profileRef} type="file" accept="image/*" className="hidden" onChange={e=>{if(e.target.files?.[0])handleUpload(e.target.files[0],"profile_image");}}/>
            </div>
          </div>
          <div className="space-y-3">
            <div><label className="text-xs font-semibold text-slate-500">이름 / 직함</label><input className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm mt-1 border-0 focus:outline-none" value={name} onChange={e=>setName(e.target.value)} placeholder="서서갈비 T"/></div>
            <div><label className="text-xs font-semibold text-slate-500">약력 (줄바꿈: \n)</label><textarea className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm mt-1 border-0 focus:outline-none resize-none h-28" value={bio} onChange={e=>setBio(e.target.value)} placeholder="서서갈비 국어 학원\n맛있게, 확실하게"/></div>
          </div>
          <button onClick={saveMeta} className="mt-3 bg-[#6c63ff] text-white px-6 py-2.5 rounded-xl text-sm font-semibold">저장</button>
          {msg&&<span className="text-xs text-green-500 ml-2">{msg}</span>}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-sm text-slate-700 mb-4">배경 이미지</h3>
          <div className="relative rounded-xl overflow-hidden mb-4 bg-slate-100" style={{height:200}}>
            {settings.background_image?<img src={settings.background_image} alt="" className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center text-slate-300 text-sm">배경 이미지 없음</div>}
          </div>
          <button onClick={()=>bgRef.current?.click()} className="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1" disabled={uploading==="background_image"}>
            <Icon type="upload" size={14}/> {uploading==="background_image"?"업로드 중...":"배경 변경"}
          </button>
          <input ref={bgRef} type="file" accept="image/*" className="hidden" onChange={e=>{if(e.target.files?.[0])handleUpload(e.target.files[0],"background_image");}}/>
          <p className="text-[10px] text-slate-400 mt-2">권장: 1920x1080 이상, 학원 수업 사진 등</p>
        </div>
      </div>
    </div>
  );
}

/* ───── ADMIN TEST MANAGER (compact) ───── */
function AdminTestManager({students}:{students:any[]}) {
  const [tests,setTests]=useState<any[]>([]);const [selTest,setSelTest]=useState<any>(null);const [questions,setQuestions]=useState<any[]>([]);const [selStudent,setSelStudent]=useState<any>(null);const [results,setResults]=useState<any>({});const [info,setInfo]=useState<any>({});const [creating,setCreating]=useState(false);const [newTest,setNewTest]=useState({date:new Date().toISOString().split("T")[0],title:"",class_name:"",assignment:"",questionCount:15});const [newTopics,setNewTopics]=useState<string[]>([]);const [saving,setSaving]=useState(false);
  const fetchTests=async()=>{const{data}=await supabase.from("tests").select("*").order("date",{ascending:false});if(data)setTests(data);};
  useEffect(()=>{fetchTests();},[]);
  const loadTest=async(t:any)=>{setSelTest(t);setSelStudent(null);const{data:q}=await supabase.from("test_questions").select("*").eq("test_id",t.id).order("question_number");if(q)setQuestions(q);};
  const loadStudent=async(s:any)=>{if(!selTest)return;setSelStudent(s);const{data:r}=await supabase.from("test_results").select("*").eq("test_id",selTest.id).eq("student_id",s.id);const m:any={};if(r)r.forEach((x:any)=>{m[x.question_number]=x.is_correct;});setResults(m);const{data:si}=await supabase.from("test_student_info").select("*").eq("test_id",selTest.id).eq("student_id",s.id).single();setInfo(si||{attendance:"출석",assignment_score:"",wrong_answer_score:"",clinic_time:"",comment:"",total_score:0,class_average:0,class_best:0});};
  const createTest=async()=>{if(!newTest.date||!newTest.title)return;const{data:t}=await supabase.from("tests").insert({date:newTest.date,title:newTest.title,class_name:newTest.class_name,assignment:newTest.assignment}).select().single();if(!t)return;const qs=Array.from({length:newTest.questionCount},(_,i)=>({test_id:t.id,question_number:i+1,topic:newTopics[i]||"",correct_rate:0}));await supabase.from("test_questions").insert(qs);setCreating(false);fetchTests();};
  const toggle=(n:number)=>{setResults((p:any)=>({...p,[n]:!p[n]}));};
  const saveStudent=async()=>{if(!selTest||!selStudent)return;setSaving(true);await supabase.from("test_results").delete().eq("test_id",selTest.id).eq("student_id",selStudent.id);const rows=questions.map(q=>({test_id:selTest.id,student_id:selStudent.id,question_number:q.question_number,is_correct:!!results[q.question_number]}));if(rows.length>0)await supabase.from("test_results").insert(rows);const ts=Object.values(results).filter(Boolean).length;const{data:ex}=await supabase.from("test_student_info").select("id").eq("test_id",selTest.id).eq("student_id",selStudent.id).single();const p={test_id:selTest.id,student_id:selStudent.id,total_score:ts,class_average:Number(info.class_average)||0,class_best:Number(info.class_best)||0,attendance:info.attendance||"출석",assignment_score:info.assignment_score||"",wrong_answer_score:info.wrong_answer_score||"",clinic_time:info.clinic_time||"",comment:info.comment||""};if(ex)await supabase.from("test_student_info").update(p).eq("id",ex.id);else await supabase.from("test_student_info").insert(p);for(const q of questions){const{count:c}=await supabase.from("test_results").select("*",{count:"exact",head:true}).eq("test_id",selTest.id).eq("question_number",q.question_number).eq("is_correct",true);const{count:tot}=await supabase.from("test_results").select("*",{count:"exact",head:true}).eq("test_id",selTest.id).eq("question_number",q.question_number);const rate=tot&&tot>0?Math.round(((c||0)/tot)*100):0;await supabase.from("test_questions").update({correct_rate:rate}).eq("id",q.id);}setSaving(false);alert("저장 완료!");};
  const active=students.filter((s:any)=>s.status==="active");

  if(creating) return (<div><button onClick={()=>setCreating(false)} className="text-sm text-slate-400 mb-4">← 돌아가기</button><h2 className="text-lg font-bold mb-4">새 시험</h2><div className="bg-white rounded-2xl p-6 shadow-sm space-y-4 max-w-lg"><div className="grid grid-cols-2 gap-3"><div><label className="text-xs font-semibold text-slate-500">날짜</label><input type="date" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm mt-1 border-0" value={newTest.date} onChange={e=>setNewTest(p=>({...p,date:e.target.value}))}/></div><div><label className="text-xs font-semibold text-slate-500">시험명</label><input className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm mt-1 border-0" value={newTest.title} onChange={e=>setNewTest(p=>({...p,title:e.target.value}))} placeholder="3월 4주차 테스트"/></div></div><div className="grid grid-cols-2 gap-3"><div><label className="text-xs font-semibold text-slate-500">반</label><input className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm mt-1 border-0" value={newTest.class_name} onChange={e=>setNewTest(p=>({...p,class_name:e.target.value}))}/></div><div><label className="text-xs font-semibold text-slate-500">문항수</label><input type="number" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm mt-1 border-0" value={newTest.questionCount} onChange={e=>setNewTest(p=>({...p,questionCount:Number(e.target.value)||15}))}/></div></div><div><label className="text-xs font-semibold text-slate-500">과제</label><input className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm mt-1 border-0" value={newTest.assignment} onChange={e=>setNewTest(p=>({...p,assignment:e.target.value}))}/></div><div><label className="text-xs font-semibold text-slate-500">단원명</label><div className="mt-2 space-y-1 max-h-48 overflow-y-auto">{Array.from({length:newTest.questionCount},(_,i)=>(<div key={i} className="flex items-center gap-2"><span className="text-xs text-slate-400 w-5 text-right">{i+1}</span><input className="flex-1 bg-slate-50 rounded-lg px-3 py-1.5 text-xs border-0" value={newTopics[i]||""} onChange={e=>{const t=[...newTopics];t[i]=e.target.value;setNewTopics(t);}}/></div>))}</div></div><button onClick={createTest} className="w-full bg-[#6c63ff] text-white py-3 rounded-xl font-semibold text-sm">생성</button></div></div>);

  if(selTest&&selStudent) return (<div><button onClick={()=>setSelStudent(null)} className="text-sm text-slate-400 mb-4">← 학생 목록</button><div className="flex items-center justify-between mb-4"><div><h2 className="text-lg font-bold">{selStudent.name} — {selTest.title}</h2><p className="text-xs text-slate-400">{selTest.date}</p></div><button onClick={saveStudent} disabled={saving} className="bg-[#6c63ff] text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">{saving?"저장 중...":"저장"}</button></div><div className="grid grid-cols-1 lg:grid-cols-2 gap-4"><div className="bg-white rounded-2xl p-5 shadow-sm"><h3 className="font-semibold text-sm mb-3">문항별 O/X</h3><div className="space-y-1 max-h-80 overflow-y-auto">{questions.map(q=>(<div key={q.question_number} className="flex items-center gap-3 py-1"><span className="text-xs text-slate-400 w-5 text-right">{q.question_number}</span><span className="text-xs text-slate-500 flex-1 truncate">{q.topic||"—"}</span><button onClick={()=>toggle(q.question_number)} className={`w-10 h-7 rounded-lg text-xs font-bold ${results[q.question_number]?"bg-blue-100 text-blue-600":"bg-red-50 text-red-400"}`}>{results[q.question_number]?"O":"X"}</button></div>))}</div><div className="mt-3 pt-3 border-t border-slate-100 flex justify-between"><span className="text-xs text-slate-400">맞은 개수</span><span className="text-sm font-bold text-[#6c63ff]">{Object.values(results).filter(Boolean).length}/{questions.length}</span></div></div><div className="space-y-4"><div className="bg-white rounded-2xl p-5 shadow-sm"><h3 className="font-semibold text-sm mb-3">학생 정보</h3><div className="grid grid-cols-2 gap-3"><div><label className="text-[10px] font-semibold text-slate-400">출석</label><select className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0" value={info.attendance||"출석"} onChange={e=>setInfo((p:any)=>({...p,attendance:e.target.value}))}><option>출석</option><option>결석</option><option>지각</option></select></div><div><label className="text-[10px] font-semibold text-slate-400">클리닉</label><input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0" value={info.clinic_time||""} onChange={e=>setInfo((p:any)=>({...p,clinic_time:e.target.value}))}/></div><div><label className="text-[10px] font-semibold text-slate-400">과제 성취도</label><input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0" value={info.assignment_score||""} onChange={e=>setInfo((p:any)=>({...p,assignment_score:e.target.value}))}/></div><div><label className="text-[10px] font-semibold text-slate-400">오답 성취도</label><input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0" value={info.wrong_answer_score||""} onChange={e=>setInfo((p:any)=>({...p,wrong_answer_score:e.target.value}))}/></div></div></div><div className="bg-white rounded-2xl p-5 shadow-sm"><h3 className="font-semibold text-sm mb-3">점수</h3><div className="grid grid-cols-3 gap-3"><div className="text-center"><p className="text-[10px] text-slate-400">학생</p><p className="text-xl font-bold text-[#6c63ff]">{Object.values(results).filter(Boolean).length}</p></div><div className="text-center"><p className="text-[10px] text-slate-400">반 평균</p><input className="w-full text-center bg-slate-50 rounded-lg py-1 text-sm border-0 font-semibold" value={info.class_average||""} onChange={e=>setInfo((p:any)=>({...p,class_average:e.target.value}))}/></div><div className="text-center"><p className="text-[10px] text-slate-400">최고점</p><input className="w-full text-center bg-slate-50 rounded-lg py-1 text-sm border-0 font-semibold" value={info.class_best||""} onChange={e=>setInfo((p:any)=>({...p,class_best:e.target.value}))}/></div></div></div><div className="bg-white rounded-2xl p-5 shadow-sm"><h3 className="font-semibold text-sm mb-2">코멘트</h3><textarea className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm border-0 resize-none h-20" value={info.comment||""} onChange={e=>setInfo((p:any)=>({...p,comment:e.target.value}))} placeholder="학생 개별 코멘트"/></div></div></div></div>);

  if(selTest) return (<div><button onClick={()=>setSelTest(null)} className="text-sm text-slate-400 mb-4">← 시험 목록</button><h2 className="text-lg font-bold mb-1">{selTest.title}</h2><p className="text-xs text-slate-400 mb-4">{selTest.date} · {selTest.class_name}</p><div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{active.map((s:any)=>(<button key={s.id} onClick={()=>loadStudent(s)} className="bg-white rounded-xl p-4 shadow-sm text-left hover:ring-2 hover:ring-[#6c63ff]/30"><p className="font-semibold text-sm">{s.name}</p><p className="text-xs text-slate-400">{s.school} {s.grade}학년</p></button>))}</div></div>);

  return (<div><div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">시험 관리</h2><button onClick={()=>setCreating(true)} className="bg-[#6c63ff] text-white px-4 py-2 rounded-xl text-sm font-semibold">+ 새 시험</button></div>{tests.length>0?<div className="space-y-2">{tests.map(t=>(<button key={t.id} onClick={()=>loadTest(t)} className="w-full bg-white rounded-xl p-4 shadow-sm text-left hover:ring-2 hover:ring-[#6c63ff]/30 flex justify-between items-center"><div><p className="font-semibold text-sm">{t.title}</p><p className="text-xs text-slate-400">{t.date} · {t.class_name}</p></div><Icon type="right" size={16}/></button>))}</div>:<div className="bg-white rounded-2xl p-12 shadow-sm text-center text-slate-400 text-sm">시험이 없습니다</div>}</div>);
}

/* ───── STUDENT TEST VIEW ───── */
function StudentTestView({user}:{user:any}) {
  const [tests,setTests]=useState<any[]>([]);const [idx,setIdx]=useState(0);const [questions,setQuestions]=useState<any[]>([]);const [results,setResults]=useState<any[]>([]);const [info,setInfo]=useState<any>(null);
  useEffect(()=>{(async()=>{const{data}=await supabase.from("tests").select("*").order("date",{ascending:false});if(data&&data.length>0){setTests(data);load(data[0]);}})();},[]);
  const load=async(t:any)=>{const[q,r,si]=await Promise.all([supabase.from("test_questions").select("*").eq("test_id",t.id).order("question_number"),supabase.from("test_results").select("*").eq("test_id",t.id).eq("student_id",user.student_id),supabase.from("test_student_info").select("*").eq("test_id",t.id).eq("student_id",user.student_id).single()]);if(q.data)setQuestions(q.data);if(r.data)setResults(r.data);setInfo(si.data||null);};
  const nav=(d:number)=>{const n=idx+d;if(n>=0&&n<tests.length){setIdx(n);load(tests[n]);}};
  const test=tests[idx];
  if(!test) return <div className="bg-white rounded-2xl p-12 shadow-sm text-center text-slate-400 text-sm">시험이 없습니다</div>;
  const rm:any={};results.forEach((r:any)=>{rm[r.question_number]=r.is_correct;});
  const wrong=questions.filter(q=>rm[q.question_number]===false).sort((a,b)=>a.correct_rate-b.correct_rate);

  return (<div>
    <div className="flex items-center justify-between mb-4"><button onClick={()=>nav(1)} className="p-2 hover:bg-slate-100 rounded-xl"><Icon type="left" size={18}/></button><div className="text-center"><p className="text-lg font-bold">{test.date}</p><p className="text-xs text-slate-400">{test.title}</p></div><button onClick={()=>nav(-1)} className={`p-2 rounded-xl ${idx===0?"text-slate-200":"hover:bg-slate-100"}`} disabled={idx===0}><Icon type="right" size={18}/></button></div>
    {info&&<div className="bg-white rounded-2xl p-4 shadow-sm mb-4 grid grid-cols-2 sm:grid-cols-4 gap-3"><div className="text-center"><p className="text-[10px] text-slate-400">출석</p><p className={`text-sm font-bold ${info.attendance==="출석"?"text-green-600":info.attendance==="지각"?"text-amber-500":"text-red-500"}`}>{info.attendance}</p></div><div className="text-center"><p className="text-[10px] text-slate-400">클리닉</p><p className="text-sm font-semibold text-slate-600">{info.clinic_time||"—"}</p></div><div className="text-center"><p className="text-[10px] text-slate-400">과제</p><p className="text-sm font-semibold text-slate-600">{info.assignment_score||"—"}</p></div><div className="text-center"><p className="text-[10px] text-slate-400">오답</p><p className="text-sm font-semibold text-slate-600">{info.wrong_answer_score||"—"}</p></div></div>}
    {results.length>0?<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl p-5 shadow-sm"><h3 className="font-semibold text-sm mb-3">문항별 결과</h3><div className="space-y-1 max-h-72 overflow-y-auto">{questions.map(q=>(<div key={q.question_number} className="flex items-center gap-3 py-1"><span className="text-xs text-slate-400 w-5 text-right">{q.question_number}</span><span className="text-xs text-slate-500 flex-1 truncate">{q.topic||"—"}</span><span className={`text-xs font-bold w-6 text-center ${rm[q.question_number]?"text-blue-600":"text-red-400"}`}>{rm[q.question_number]?"O":"X"}</span><span className="text-[10px] text-slate-400 w-10 text-right">{q.correct_rate}%</span></div>))}</div></div>
      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm"><h3 className="font-semibold text-sm mb-3">정답률</h3><div className="flex items-end gap-1 h-28">{questions.map(q=>(<div key={q.question_number} className="flex-1 flex flex-col items-center gap-1"><div className="w-full rounded-t" style={{height:`${Math.max(q.correct_rate,3)}%`,background:rm[q.question_number]?"#6c63ff":"#ff6b6b"}}/><span className="text-[7px] text-slate-400">{q.question_number}</span></div>))}</div><div className="flex gap-4 mt-2 justify-center"><span className="flex items-center gap-1 text-[10px] text-slate-400"><span className="w-2 h-2 rounded-full bg-[#6c63ff]"/>정답</span><span className="flex items-center gap-1 text-[10px] text-slate-400"><span className="w-2 h-2 rounded-full bg-[#ff6b6b]"/>오답</span></div></div>
        {wrong.length>0&&<div className="bg-white rounded-2xl p-5 shadow-sm"><h3 className="font-semibold text-sm mb-2">최다 오답</h3>{wrong.slice(0,5).map(q=>(<div key={q.question_number} className="flex items-center gap-2 text-xs py-1"><span className="bg-red-50 text-red-500 font-bold w-6 h-6 rounded-lg flex items-center justify-center">{q.question_number}</span><span className="flex-1">{q.topic||"—"}</span><span className="text-slate-400">{q.correct_rate}%</span></div>))}</div>}
        {info&&<><div className="bg-white rounded-2xl p-5 shadow-sm"><h3 className="font-semibold text-sm mb-3">점수 비교</h3><div className="grid grid-cols-3 gap-3 text-center"><div><p className="text-[10px] text-slate-400">내 점수</p><p className="text-xl font-bold text-[#6c63ff]">{info.total_score}</p></div><div><p className="text-[10px] text-slate-400">반 평균</p><p className="text-xl font-bold text-slate-600">{info.class_average}</p></div><div><p className="text-[10px] text-slate-400">반 최고</p><p className="text-xl font-bold text-slate-600">{info.class_best}</p></div></div></div>{info.comment&&<div className="bg-[#6c63ff]/5 rounded-2xl p-5"><p className="text-xs font-semibold text-[#6c63ff] mb-1">선생님 코멘트</p><p className="text-sm text-slate-700 leading-relaxed">{info.comment}</p></div>}</>}
      </div>
    </div>:<div className="bg-white rounded-2xl p-12 shadow-sm text-center text-slate-400 text-sm">결과가 아직 입력되지 않았습니다</div>}
  </div>);
}

/* ───── SETTINGS ───── */
function SettingsView({user}:{user:any}) {
  const [pw,setPw]=useState({new1:"",new2:""});const [msg,setMsg]=useState("");
  const save=async()=>{if(pw.new1!==pw.new2){setMsg("비밀번호 불일치");return;}await supabase.from("users").update({password:pw.new1}).eq("id",user.id);setMsg("변경 완료!");setPw({new1:"",new2:""});};
  return (<div><h2 className="text-lg font-bold mb-4">설정</h2><div className="bg-white rounded-2xl p-6 shadow-sm max-w-md"><h3 className="font-semibold text-sm mb-4">비밀번호 변경</h3><div className="space-y-3"><input type="password" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm border-0" value={pw.new1} onChange={e=>setPw(p=>({...p,new1:e.target.value}))} placeholder="새 비밀번호"/><input type="password" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm border-0" value={pw.new2} onChange={e=>setPw(p=>({...p,new2:e.target.value}))} placeholder="확인"/></div>{msg&&<p className={`text-xs mt-2 ${msg.includes("완료")?"text-green-500":"text-red-400"}`}>{msg}</p>}<button onClick={save} className="mt-4 bg-[#6c63ff] text-white px-6 py-2.5 rounded-xl text-sm font-semibold">변경</button></div><div className="bg-white rounded-2xl p-6 shadow-sm max-w-md mt-4"><h3 className="font-semibold text-sm mb-3">내 정보</h3><div className="text-sm space-y-2"><div className="flex justify-between py-2 border-b border-slate-50"><span className="text-slate-400">이름</span><span className="font-medium">{user.name}</span></div><div className="flex justify-between py-2 border-b border-slate-50"><span className="text-slate-400">아이디</span><span className="font-medium">{user.login_id}</span></div><div className="flex justify-between py-2"><span className="text-slate-400">역할</span><span className="font-medium">{user.role==="student"?"학생":user.role==="parent"?"학부모":"관리자"}</span></div></div></div></div>);
}

/* ───── ADMIN APPROVAL ───── */
function AdminApproval({users,fetchUsers}:{users:any[];fetchUsers:()=>void}) {
  const pending=users.filter((u:any)=>u.status==="pending");const approved=users.filter((u:any)=>u.status==="approved");
  const approve=async(id:number)=>{await supabase.from("users").update({status:"approved"}).eq("id",id);fetchUsers();};
  const reject=async(id:number)=>{if(confirm("거절?")){await supabase.from("users").delete().eq("id",id);fetchUsers();}};
  const del=async(id:number)=>{if(confirm("삭제?")){await supabase.from("users").delete().eq("id",id);fetchUsers();}};
  const rl=(r:string)=>r==="admin"?"관리자":r==="student"?"학생":"학부모";
  return (<div><h2 className="text-lg font-bold mb-4">계정 관리</h2>{pending.length>0&&<div className="mb-6"><p className="text-sm font-semibold text-amber-600 mb-3">대기 ({pending.length})</p>{pending.map(u=>(<div key={u.id} className="bg-white rounded-2xl p-5 shadow-sm mb-2 flex justify-between items-center"><div><p className="font-medium text-sm">{u.name} <span className="text-xs text-slate-400">({u.login_id})</span></p><p className="text-xs text-slate-400">{rl(u.role)}</p></div><div className="flex gap-2"><button onClick={()=>approve(u.id)} className="bg-[#6c63ff] text-white px-4 py-2 rounded-xl text-xs font-semibold">승인</button><button onClick={()=>reject(u.id)} className="bg-slate-100 text-slate-500 px-3 py-2 rounded-xl text-xs">거절</button></div></div>))}</div>}<div className="bg-white rounded-2xl shadow-sm overflow-hidden"><table className="w-full text-sm"><thead><tr className="bg-slate-50">{["아이디","이름","역할",""].map(h=><th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400">{h}</th>)}</tr></thead><tbody>{approved.map(u=>(<tr key={u.id} className="border-t border-slate-50"><td className="px-5 py-3 font-mono text-xs">{u.login_id}</td><td className="px-5 py-3 font-medium">{u.name}</td><td className="px-5 py-3"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.role==="admin"?"bg-red-50 text-red-500":"bg-blue-50 text-blue-500"}`}>{rl(u.role)}</span></td><td className="px-5 py-3 text-right">{u.role!=="admin"&&<button onClick={()=>del(u.id)} className="text-xs text-slate-400 hover:text-red-500">삭제</button>}</td></tr>))}</tbody></table></div></div>);
}

/* ───── MAIN ───── */
export default function Home() {
  const [page,setPage]=useState<"login"|"signup">("login");
  const [user,setUser]=useState<any>(null);
  const [tab,setTab]=useState("dashboard");const [mobileMenu,setMobileMenu]=useState(false);
  const [students,setStudents]=useState<any[]>([]);const [users,setUsers]=useState<any[]>([]);const [loading,setLoading]=useState(false);
  const [settings,setSettings]=useState<any>({profile_name:"서서갈비 T",profile_bio:"",profile_image:"",background_image:""});

  const fetchUsers=async()=>{const{data}=await supabase.from("users").select("*").order("created_at",{ascending:false});if(data)setUsers(data);};
  const fetchSettings=async()=>{const{data}=await supabase.from("site_settings").select("*");if(data){const s:any={};data.forEach((r:any)=>{s[r.key]=r.value;});setSettings(s);}};
  const fetchAll=async()=>{setLoading(true);const[s,u]=await Promise.all([supabase.from("students").select("*").order("created_at",{ascending:false}),supabase.from("users").select("*").order("created_at",{ascending:false})]);if(s.data)setStudents(s.data);if(u.data)setUsers(u.data);setLoading(false);};
  useEffect(()=>{fetchSettings();},[]);
  useEffect(()=>{if(user)fetchAll();},[user]);

  const handleLogin=async(id:string,pw:string):Promise<string>=>{
    const{data}=await supabase.from("users").select("*").eq("login_id",id).eq("password",pw).single();
    if(!data)return "아이디 또는 비밀번호 오류";
    if(data.status==="pending")return "승인 대기 중입니다";
    setUser(data);setTab("dashboard");return "";
  };
  const logout=()=>{setUser(null);setTab("dashboard");};
  const pendingCount=users.filter((u:any)=>u.status==="pending").length;

  if(page==="signup"&&!user) return <SignupPage onBack={()=>setPage("login")}/>;
  if(!user) return <LoginScreen onLogin={handleLogin} onSignup={()=>setPage("signup")} settings={settings}/>;
  if(loading) return <div className="min-h-screen bg-[#f0f2f8] flex items-center justify-center"><img src={settings.profile_image||"/profile.png"} alt="" className="w-12 h-12 rounded-xl opacity-50 animate-pulse"/></div>;

  const isAdmin=user.role==="admin";
  const menuItems=isAdmin?[
    {id:"dashboard",icon:"test",label:"시험 관리"},
    {id:"approval",icon:"user",label:"계정 관리",badge:pendingCount},
    {id:"site",icon:"upload",label:"로그인 화면 설정"},
    {id:"settings",icon:"settings",label:"설정"},
  ]:[
    {id:"dashboard",icon:"dashboard",label:"성적표"},
    {id:"settings",icon:"settings",label:"설정"},
  ];

  const nav=(mobile?:boolean)=>(<nav className={`${mobile?"":"flex-1"} space-y-1`}>{menuItems.map(m=>(<button key={m.id} onClick={()=>{setTab(m.id);if(mobile)setMobileMenu(false);}} className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${tab===m.id?"bg-[#6c63ff] text-white":"text-slate-500 hover:bg-slate-50"}`}><Icon type={m.icon} size={18}/> {m.label}{m.badge&&m.badge>0?<span className="ml-auto bg-red-400 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{m.badge}</span>:null}</button>))}</nav>);

  return (
    <div className="min-h-screen bg-[#f0f2f8] flex">
      <aside className="hidden lg:flex flex-col w-56 bg-white shadow-sm min-h-screen p-5 fixed left-0 top-0 bottom-0 z-40">
        <div className="flex items-center gap-3 mb-8"><img src={settings.profile_image||"/profile.png"} alt="" className="w-9 h-9 rounded-xl object-cover"/><span className="font-bold text-slate-800 text-sm">서서갈비</span></div>
        {nav()}
        <div className="pt-4 border-t border-slate-100 mt-4">
          <div className="flex items-center gap-3 mb-3 px-1"><div className="w-8 h-8 bg-[#6c63ff]/10 rounded-full flex items-center justify-center text-[#6c63ff]"><Icon type="user" size={14}/></div><div><p className="text-xs font-semibold text-slate-700">{user.name}</p><p className="text-[10px] text-slate-400">{isAdmin?"관리자":user.role==="student"?"학생":"학부모"}</p></div></div>
          <button onClick={logout} className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-50"><Icon type="logout" size={16}/> 로그아웃</button>
        </div>
      </aside>
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-40 px-4 py-3 flex justify-between items-center"><div className="flex items-center gap-2"><img src={settings.profile_image||"/profile.png"} alt="" className="w-7 h-7 rounded-lg object-cover"/><span className="font-bold text-sm">서서갈비</span></div><button onClick={()=>setMobileMenu(!mobileMenu)}><Icon type={mobileMenu?"close":"menu"} size={22}/></button></div>
      {mobileMenu&&<><div onClick={()=>setMobileMenu(false)} className="lg:hidden fixed inset-0 bg-black/30 z-40"/><div className="lg:hidden fixed right-0 top-0 bottom-0 w-64 bg-white z-50 p-5 shadow-xl"><div className="flex justify-between items-center mb-6"><span className="font-bold">메뉴</span><button onClick={()=>setMobileMenu(false)}><Icon type="close" size={20}/></button></div>{nav(true)}<button onClick={()=>{logout();setMobileMenu(false);}} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm text-red-400 mt-4"><Icon type="logout" size={16}/> 로그아웃</button></div></>}
      <main className="flex-1 lg:ml-56 pt-16 lg:pt-0"><div className="max-w-4xl mx-auto p-5 lg:p-8">
        {isAdmin&&tab==="dashboard"&&<AdminTestManager students={students}/>}
        {isAdmin&&tab==="approval"&&<AdminApproval users={users} fetchUsers={fetchUsers}/>}
        {isAdmin&&tab==="site"&&<AdminSiteSettings settings={settings} fetchSettings={fetchSettings}/>}
        {!isAdmin&&tab==="dashboard"&&<StudentTestView user={user}/>}
        {tab==="settings"&&<SettingsView user={user}/>}
      </div></main>
    </div>
  );
}
