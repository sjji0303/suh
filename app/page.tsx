"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const SCHOOLS = ["계성고","경신고","용문고","대원외고"];

const Icon = ({type,size=20}:{type:string;size?:number}) => {
  const s:any = {width:size,height:size,strokeWidth:1.5,fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round"};
  const icons:any = {
    dashboard:<svg viewBox="0 0 24 24" {...s}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    grades:<svg viewBox="0 0 24 24" {...s}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>,
    assignment:<svg viewBox="0 0 24 24" {...s}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    settings:<svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
    logout:<svg viewBox="0 0 24 24" {...s}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    user:<svg viewBox="0 0 24 24" {...s}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    menu:<svg viewBox="0 0 24 24" {...s}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    close:<svg viewBox="0 0 24 24" {...s}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    test:<svg viewBox="0 0 24 24" {...s}><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
    left:<svg viewBox="0 0 24 24" {...s}><polyline points="15 18 9 12 15 6"/></svg>,
    right:<svg viewBox="0 0 24 24" {...s}><polyline points="9 18 15 12 9 6"/></svg>,
  };
  return icons[type]||null;
};

/* ───── SIGNUP ───── */
function SignupPage({onBack}:{onBack:()=>void}) {
  const [form,setForm]=useState({login_id:"",password:"",password2:"",name:"",role:"student",school:SCHOOLS[0],grade:1,phone:""});
  const [error,setError]=useState("");const [success,setSuccess]=useState(false);
  const set=(k:string,v:any)=>setForm(p=>({...p,[k]:v}));
  const handleSignup=async()=>{
    setError("");if(!form.login_id||!form.password||!form.name){setError("필수 항목을 입력하세요.");return;}
    if(form.password!==form.password2){setError("비밀번호 불일치");return;}
    const{data:ex}=await supabase.from("users").select("id").eq("login_id",form.login_id).single();
    if(ex){setError("이미 사용 중인 아이디");return;}
    await supabase.from("users").insert({login_id:form.login_id,password:form.password,name:form.name,role:form.role,school:form.school,grade:form.grade,phone:form.phone,status:"pending"});
    setSuccess(true);
  };
  if(success) return (<div className="min-h-screen bg-[#f0f2f8] flex items-center justify-center p-4"><div className="bg-white rounded-3xl p-10 w-full max-w-sm shadow-sm text-center"><div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-2xl">✓</div><h2 className="text-xl font-bold mb-2">가입 신청 완료</h2><p className="text-sm text-slate-400 mb-6">관리자 승인 후 로그인 가능</p><button onClick={onBack} className="w-full bg-[#6c63ff] text-white py-3 rounded-xl font-semibold text-sm">로그인으로</button></div></div>);
  return (<div className="min-h-screen bg-[#f0f2f8] flex items-center justify-center p-4"><div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-sm"><div className="text-center mb-6"><img src="/profile.png" alt="" className="w-16 h-16 rounded-2xl mx-auto mb-3"/><h1 className="text-lg font-bold text-slate-800">회원가입</h1></div><div className="flex gap-2 mb-4">{[{v:"student",l:"학생"},{v:"parent",l:"학부모"}].map(r=>(<button key={r.v} onClick={()=>set("role",r.v)} className={`flex-1 py-2 rounded-xl text-xs font-semibold ${form.role===r.v?"bg-[#6c63ff] text-white":"bg-slate-100 text-slate-400"}`}>{r.l}</button>))}</div><div className="space-y-3"><input className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/20 border-0" value={form.login_id} onChange={e=>set("login_id",e.target.value)} placeholder="아이디"/><div className="grid grid-cols-2 gap-2"><input type="password" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none border-0" value={form.password} onChange={e=>set("password",e.target.value)} placeholder="비밀번호"/><input type="password" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none border-0" value={form.password2} onChange={e=>set("password2",e.target.value)} placeholder="비밀번호 확인"/></div><input className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none border-0" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="이름"/><div className="grid grid-cols-2 gap-2"><select className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none border-0" value={form.school} onChange={e=>set("school",e.target.value)}>{SCHOOLS.map(s=><option key={s}>{s}</option>)}</select><select className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none border-0" value={form.grade} onChange={e=>set("grade",Number(e.target.value))}>{[1,2,3].map(g=><option key={g} value={g}>{g}학년</option>)}</select></div></div>{error&&<p className="text-red-400 text-xs mt-2">{error}</p>}<button onClick={handleSignup} className="w-full bg-[#6c63ff] text-white py-3 rounded-xl font-semibold text-sm mt-4">가입 신청</button><button onClick={onBack} className="w-full text-slate-400 text-xs mt-3">← 로그인으로</button></div></div>);
}

/* ───── ADMIN: TEST MANAGER ───── */
function AdminTestManager({students}:{students:any[]}) {
  const [tests,setTests]=useState<any[]>([]);
  const [selTest,setSelTest]=useState<any>(null);
  const [questions,setQuestions]=useState<any[]>([]);
  const [selStudent,setSelStudent]=useState<any>(null);
  const [results,setResults]=useState<any>({});
  const [info,setInfo]=useState<any>({});
  const [creating,setCreating]=useState(false);
  const [newTest,setNewTest]=useState({date:new Date().toISOString().split("T")[0],title:"",class_name:"",assignment:"",questionCount:15});
  const [newTopics,setNewTopics]=useState<string[]>([]);
  const [saving,setSaving]=useState(false);

  const fetchTests=async()=>{const{data}=await supabase.from("tests").select("*").order("date",{ascending:false});if(data)setTests(data);};
  useEffect(()=>{fetchTests();},[]);

  const loadTest=async(test:any)=>{
    setSelTest(test);setSelStudent(null);
    const{data:q}=await supabase.from("test_questions").select("*").eq("test_id",test.id).order("question_number");
    if(q)setQuestions(q);
  };

  const loadStudentData=async(student:any)=>{
    if(!selTest)return;
    setSelStudent(student);
    const{data:r}=await supabase.from("test_results").select("*").eq("test_id",selTest.id).eq("student_id",student.id);
    const map:any={};if(r)r.forEach((x:any)=>{map[x.question_number]=x.is_correct;});setResults(map);
    const{data:si}=await supabase.from("test_student_info").select("*").eq("test_id",selTest.id).eq("student_id",student.id).single();
    setInfo(si||{attendance:"출석",assignment_score:"",wrong_answer_score:"",clinic_time:"",comment:"",total_score:0,class_average:0,class_best:0});
  };

  const createTest=async()=>{
    if(!newTest.date||!newTest.title)return;
    const{data:t}=await supabase.from("tests").insert({date:newTest.date,title:newTest.title,class_name:newTest.class_name,assignment:newTest.assignment}).select().single();
    if(!t)return;
    const qs=Array.from({length:newTest.questionCount},(_,i)=>({test_id:t.id,question_number:i+1,topic:newTopics[i]||"",correct_rate:0}));
    await supabase.from("test_questions").insert(qs);
    setCreating(false);setNewTest({date:new Date().toISOString().split("T")[0],title:"",class_name:"",assignment:"",questionCount:15});setNewTopics([]);
    fetchTests();
  };

  const toggleAnswer=(qNum:number)=>{setResults((p:any)=>({...p,[qNum]:!p[qNum]}));};

  const saveStudentData=async()=>{
    if(!selTest||!selStudent)return;
    setSaving(true);
    await supabase.from("test_results").delete().eq("test_id",selTest.id).eq("student_id",selStudent.id);
    const rows=questions.map(q=>({test_id:selTest.id,student_id:selStudent.id,question_number:q.question_number,is_correct:!!results[q.question_number]}));
    if(rows.length>0)await supabase.from("test_results").insert(rows);

    const totalScore=Object.values(results).filter(Boolean).length;
    const{data:existing}=await supabase.from("test_student_info").select("id").eq("test_id",selTest.id).eq("student_id",selStudent.id).single();
    const payload={test_id:selTest.id,student_id:selStudent.id,total_score:totalScore,class_average:Number(info.class_average)||0,class_best:Number(info.class_best)||0,attendance:info.attendance||"출석",assignment_score:info.assignment_score||"",wrong_answer_score:info.wrong_answer_score||"",clinic_time:info.clinic_time||"",comment:info.comment||""};
    if(existing)await supabase.from("test_student_info").update(payload).eq("id",existing.id);
    else await supabase.from("test_student_info").insert(payload);

    // Update correct rates
    for(const q of questions){
      const{count}=await supabase.from("test_results").select("*",{count:"exact",head:true}).eq("test_id",selTest.id).eq("question_number",q.question_number).eq("is_correct",true);
      const{count:total}=await supabase.from("test_results").select("*",{count:"exact",head:true}).eq("test_id",selTest.id).eq("question_number",q.question_number);
      const rate=total&&total>0?Math.round(((count||0)/(total))*100):0;
      await supabase.from("test_questions").update({correct_rate:rate}).eq("id",q.id);
    }
    setSaving(false);alert("저장 완료!");
  };

  const active=students.filter((s:any)=>s.status==="active");

  if(creating) return (
    <div>
      <button onClick={()=>setCreating(false)} className="text-sm text-slate-400 mb-4 hover:text-slate-600">← 돌아가기</button>
      <h2 className="text-lg font-bold text-slate-800 mb-4">새 시험 만들기</h2>
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4 max-w-lg">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs font-semibold text-slate-500">날짜</label><input type="date" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm mt-1 border-0 focus:outline-none" value={newTest.date} onChange={e=>setNewTest(p=>({...p,date:e.target.value}))}/></div>
          <div><label className="text-xs font-semibold text-slate-500">시험명</label><input className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm mt-1 border-0 focus:outline-none" value={newTest.title} onChange={e=>setNewTest(p=>({...p,title:e.target.value}))} placeholder="3월 4주차 테스트"/></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs font-semibold text-slate-500">반</label><input className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm mt-1 border-0 focus:outline-none" value={newTest.class_name} onChange={e=>setNewTest(p=>({...p,class_name:e.target.value}))} placeholder="서서갈비T 국어반"/></div>
          <div><label className="text-xs font-semibold text-slate-500">문항 수</label><input type="number" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm mt-1 border-0 focus:outline-none" value={newTest.questionCount} onChange={e=>setNewTest(p=>({...p,questionCount:Number(e.target.value)||15}))}/></div>
        </div>
        <div><label className="text-xs font-semibold text-slate-500">과제</label><input className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm mt-1 border-0 focus:outline-none" value={newTest.assignment} onChange={e=>setNewTest(p=>({...p,assignment:e.target.value}))} placeholder="INSIGHT 50문항 풀어오기"/></div>
        <div><label className="text-xs font-semibold text-slate-500">단원명 (문항별)</label>
          <div className="mt-2 space-y-1 max-h-60 overflow-y-auto">
            {Array.from({length:newTest.questionCount},(_,i)=>(
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-slate-400 w-6 text-right">{i+1}</span>
                <input className="flex-1 bg-slate-50 rounded-lg px-3 py-2 text-xs border-0 focus:outline-none" value={newTopics[i]||""} onChange={e=>{const t=[...newTopics];t[i]=e.target.value;setNewTopics(t);}} placeholder="단원명"/>
              </div>
            ))}
          </div>
        </div>
        <button onClick={createTest} className="w-full bg-[#6c63ff] text-white py-3 rounded-xl font-semibold text-sm">시험 생성</button>
      </div>
    </div>
  );

  if(selTest&&selStudent) return (
    <div>
      <button onClick={()=>setSelStudent(null)} className="text-sm text-slate-400 mb-4 hover:text-slate-600">← 학생 목록으로</button>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">{selStudent.name} — {selTest.title}</h2>
          <p className="text-xs text-slate-400">{selTest.date} · {selStudent.school} {selStudent.grade}학년</p>
        </div>
        <button onClick={saveStudentData} disabled={saving} className="bg-[#6c63ff] text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">{saving?"저장 중...":"저장"}</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-sm text-slate-700 mb-3">문항별 정답 입력</h3>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {questions.map(q=>(
              <div key={q.question_number} className="flex items-center gap-3 py-1.5">
                <span className="text-xs text-slate-400 w-6 text-right">{q.question_number}</span>
                <span className="text-xs text-slate-500 flex-1 truncate">{q.topic||"—"}</span>
                <button onClick={()=>toggleAnswer(q.question_number)} className={`w-10 h-7 rounded-lg text-xs font-bold transition-colors ${results[q.question_number]?"bg-blue-100 text-blue-600":"bg-red-50 text-red-400"}`}>
                  {results[q.question_number]?"O":"X"}
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between">
            <span className="text-xs text-slate-400">맞은 개수</span>
            <span className="text-sm font-bold text-[#6c63ff]">{Object.values(results).filter(Boolean).length} / {questions.length}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-sm text-slate-700 mb-3">학생 정보</h3>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-[10px] font-semibold text-slate-400">출석/결석/지각</label><select className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0" value={info.attendance||"출석"} onChange={e=>setInfo((p:any)=>({...p,attendance:e.target.value}))}><option>출석</option><option>결석</option><option>지각</option></select></div>
              <div><label className="text-[10px] font-semibold text-slate-400">클리닉 참여시간</label><input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0" value={info.clinic_time||""} onChange={e=>setInfo((p:any)=>({...p,clinic_time:e.target.value}))} placeholder="(토) 11:00-14:30"/></div>
              <div><label className="text-[10px] font-semibold text-slate-400">과제 성취도</label><input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0" value={info.assignment_score||""} onChange={e=>setInfo((p:any)=>({...p,assignment_score:e.target.value}))} placeholder="90%"/></div>
              <div><label className="text-[10px] font-semibold text-slate-400">오답 성취도</label><input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0" value={info.wrong_answer_score||""} onChange={e=>setInfo((p:any)=>({...p,wrong_answer_score:e.target.value}))} placeholder="80%"/></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-sm text-slate-700 mb-3">점수 비교</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center"><p className="text-[10px] text-slate-400">학생 점수</p><p className="text-xl font-bold text-[#6c63ff]">{Object.values(results).filter(Boolean).length}</p></div>
              <div className="text-center"><p className="text-[10px] text-slate-400">반 평균</p><input className="w-full text-center bg-slate-50 rounded-lg py-1 text-sm border-0 font-semibold" value={info.class_average||""} onChange={e=>setInfo((p:any)=>({...p,class_average:e.target.value}))}/></div>
              <div className="text-center"><p className="text-[10px] text-slate-400">반 최고점</p><input className="w-full text-center bg-slate-50 rounded-lg py-1 text-sm border-0 font-semibold" value={info.class_best||""} onChange={e=>setInfo((p:any)=>({...p,class_best:e.target.value}))}/></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-sm text-slate-700 mb-2">개별 코멘트</h3>
            <textarea className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm border-0 focus:outline-none resize-none h-24" value={info.comment||""} onChange={e=>setInfo((p:any)=>({...p,comment:e.target.value}))} placeholder="학생에게 전할 코멘트를 입력하세요"/>
          </div>
        </div>
      </div>
    </div>
  );

  if(selTest) return (
    <div>
      <button onClick={()=>setSelTest(null)} className="text-sm text-slate-400 mb-4 hover:text-slate-600">← 시험 목록으로</button>
      <h2 className="text-lg font-bold text-slate-800 mb-1">{selTest.title}</h2>
      <p className="text-xs text-slate-400 mb-4">{selTest.date} · {selTest.class_name} · 과제: {selTest.assignment||"없음"}</p>
      <p className="text-sm font-semibold text-slate-600 mb-3">학생을 선택하여 성적을 입력하세요</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {active.map((s:any)=>(
          <button key={s.id} onClick={()=>loadStudentData(s)} className="bg-white rounded-xl p-4 shadow-sm text-left hover:ring-2 hover:ring-[#6c63ff]/30 transition-all">
            <p className="font-semibold text-sm text-slate-700">{s.name}</p>
            <p className="text-xs text-slate-400">{s.school} {s.grade}학년</p>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-slate-800">시험 관리</h2>
        <button onClick={()=>setCreating(true)} className="bg-[#6c63ff] text-white px-4 py-2 rounded-xl text-sm font-semibold">+ 새 시험</button>
      </div>
      {tests.length>0?(
        <div className="space-y-2">
          {tests.map((t:any)=>(
            <button key={t.id} onClick={()=>loadTest(t)} className="w-full bg-white rounded-xl p-4 shadow-sm text-left hover:ring-2 hover:ring-[#6c63ff]/30 transition-all flex justify-between items-center">
              <div><p className="font-semibold text-sm text-slate-700">{t.title}</p><p className="text-xs text-slate-400">{t.date} · {t.class_name}</p></div>
              <Icon type="right" size={16}/>
            </button>
          ))}
        </div>
      ):(
        <div className="bg-white rounded-2xl p-12 shadow-sm text-center"><p className="text-slate-400 text-sm">아직 시험이 없습니다</p></div>
      )}
    </div>
  );
}

/* ───── STUDENT: TEST VIEW ───── */
function StudentTestView({user}:{user:any}) {
  const [tests,setTests]=useState<any[]>([]);
  const [currentIdx,setCurrentIdx]=useState(0);
  const [questions,setQuestions]=useState<any[]>([]);
  const [results,setResults]=useState<any[]>([]);
  const [info,setInfo]=useState<any>(null);

  useEffect(()=>{
    (async()=>{
      const{data}=await supabase.from("tests").select("*").order("date",{ascending:false});
      if(data&&data.length>0){setTests(data);loadTestData(data[0]);}
    })();
  },[]);

  const loadTestData=async(test:any)=>{
    const[q,r,si]=await Promise.all([
      supabase.from("test_questions").select("*").eq("test_id",test.id).order("question_number"),
      supabase.from("test_results").select("*").eq("test_id",test.id).eq("student_id",user.student_id),
      supabase.from("test_student_info").select("*").eq("test_id",test.id).eq("student_id",user.student_id).single(),
    ]);
    if(q.data)setQuestions(q.data);
    if(r.data)setResults(r.data);
    setInfo(si.data||null);
  };

  const navigate=(dir:number)=>{
    const next=currentIdx+dir;
    if(next>=0&&next<tests.length){setCurrentIdx(next);loadTestData(tests[next]);}
  };

  const test=tests[currentIdx];
  if(!test) return <div className="bg-white rounded-2xl p-12 shadow-sm text-center"><p className="text-slate-400 text-sm">등록된 시험이 없습니다</p></div>;

  const resultMap:any={};results.forEach((r:any)=>{resultMap[r.question_number]=r.is_correct;});
  const correctCount=results.filter((r:any)=>r.is_correct).length;
  const wrongQuestions=questions.filter(q=>resultMap[q.question_number]===false).sort((a,b)=>a.correct_rate-b.correct_rate);
  const maxQ=Math.max(...questions.map(q=>q.correct_rate),1);

  return (
    <div>
      {/* Date Nav */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={()=>navigate(1)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><Icon type="left" size={18}/></button>
        <div className="text-center">
          <p className="text-lg font-bold text-slate-800">{test.date}</p>
          <p className="text-xs text-slate-400">{test.title} · {test.class_name}</p>
        </div>
        <button onClick={()=>navigate(-1)} className={`p-2 rounded-xl transition-colors ${currentIdx===0?"text-slate-200":"hover:bg-slate-100"}`} disabled={currentIdx===0}><Icon type="right" size={18}/></button>
      </div>

      {/* Student Info Bar */}
      {info&&(
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="text-center"><p className="text-[10px] text-slate-400">출석</p><p className={`text-sm font-bold ${info.attendance==="출석"?"text-green-600":info.attendance==="지각"?"text-amber-500":"text-red-500"}`}>{info.attendance}</p></div>
          <div className="text-center"><p className="text-[10px] text-slate-400">클리닉</p><p className="text-sm font-semibold text-slate-600">{info.clinic_time||"—"}</p></div>
          <div className="text-center"><p className="text-[10px] text-slate-400">과제 성취도</p><p className="text-sm font-semibold text-slate-600">{info.assignment_score||"—"}</p></div>
          <div className="text-center"><p className="text-[10px] text-slate-400">오답 성취도</p><p className="text-sm font-semibold text-slate-600">{info.wrong_answer_score||"—"}</p></div>
        </div>
      )}

      {results.length>0?(
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Questions Table */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-sm text-slate-700 mb-3">문항별 결과</h3>
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {questions.map(q=>(
                <div key={q.question_number} className="flex items-center gap-3 py-1.5">
                  <span className="text-xs text-slate-400 w-5 text-right">{q.question_number}</span>
                  <span className="text-xs text-slate-500 flex-1 truncate">{q.topic||"—"}</span>
                  <span className={`text-xs font-bold w-6 text-center ${resultMap[q.question_number]?"text-blue-600":"text-red-400"}`}>{resultMap[q.question_number]?"O":"X"}</span>
                  <span className="text-[10px] text-slate-400 w-10 text-right">{q.correct_rate}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart + Stats */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-sm text-slate-700 mb-3">정답률 차트</h3>
              <div className="flex items-end gap-1 h-32">
                {questions.map(q=>(
                  <div key={q.question_number} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t" style={{height:`${Math.max(q.correct_rate,3)}%`,background:resultMap[q.question_number]?"#6c63ff":"#ff6b6b"}}/>
                    <span className="text-[8px] text-slate-400">{q.question_number}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-2 justify-center">
                <span className="flex items-center gap-1 text-[10px] text-slate-400"><span className="w-2 h-2 rounded-full bg-[#6c63ff]"/>정답</span>
                <span className="flex items-center gap-1 text-[10px] text-slate-400"><span className="w-2 h-2 rounded-full bg-[#ff6b6b]"/>오답</span>
              </div>
            </div>

            {wrongQuestions.length>0&&(
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-semibold text-sm text-slate-700 mb-2">최다 오답 문항</h3>
                <div className="space-y-1">
                  {wrongQuestions.slice(0,5).map(q=>(
                    <div key={q.question_number} className="flex items-center gap-2 text-xs">
                      <span className="bg-red-50 text-red-500 font-bold w-6 h-6 rounded-lg flex items-center justify-center">{q.question_number}</span>
                      <span className="text-slate-600 flex-1">{q.topic||"—"}</span>
                      <span className="text-slate-400">정답률 {q.correct_rate}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {info&&(
              <>
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h3 className="font-semibold text-sm text-slate-700 mb-3">점수 비교</h3>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div><p className="text-[10px] text-slate-400">내 점수</p><p className="text-xl font-bold text-[#6c63ff]">{info.total_score}</p></div>
                    <div><p className="text-[10px] text-slate-400">반 평균</p><p className="text-xl font-bold text-slate-600">{info.class_average}</p></div>
                    <div><p className="text-[10px] text-slate-400">반 최고</p><p className="text-xl font-bold text-slate-600">{info.class_best}</p></div>
                  </div>
                </div>
                {info.comment&&(
                  <div className="bg-[#6c63ff]/5 rounded-2xl p-5">
                    <p className="text-xs font-semibold text-[#6c63ff] mb-1">선생님 코멘트</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{info.comment}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ):(
        <div className="bg-white rounded-2xl p-12 shadow-sm text-center"><p className="text-slate-400 text-sm">이 시험의 결과가 아직 입력되지 않았습니다</p></div>
      )}
    </div>
  );
}

/* ───── SETTINGS ───── */
function SettingsView({user}:{user:any}) {
  const [pw,setPw]=useState({current:"",new1:"",new2:""});const [msg,setMsg]=useState("");
  const changePw=async()=>{if(pw.new1!==pw.new2){setMsg("비밀번호 불일치");return;}const{error}=await supabase.from("users").update({password:pw.new1}).eq("id",user.id);setMsg(error?"오류 발생":"변경 완료!");setPw({current:"",new1:"",new2:""});};
  return (<div><h2 className="text-lg font-bold text-slate-800 mb-4">설정</h2><div className="bg-white rounded-2xl p-6 shadow-sm max-w-md"><h3 className="font-semibold text-sm text-slate-700 mb-4">비밀번호 변경</h3><div className="space-y-3"><input type="password" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm border-0 focus:outline-none" value={pw.new1} onChange={e=>setPw(p=>({...p,new1:e.target.value}))} placeholder="새 비밀번호"/><input type="password" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm border-0 focus:outline-none" value={pw.new2} onChange={e=>setPw(p=>({...p,new2:e.target.value}))} placeholder="새 비밀번호 확인"/></div>{msg&&<p className={`text-xs mt-2 ${msg.includes("완료")?"text-green-500":"text-red-400"}`}>{msg}</p>}<button onClick={changePw} className="mt-4 bg-[#6c63ff] text-white px-6 py-2.5 rounded-xl text-sm font-semibold">변경</button></div><div className="bg-white rounded-2xl p-6 shadow-sm max-w-md mt-4"><h3 className="font-semibold text-sm text-slate-700 mb-3">내 정보</h3><div className="text-sm space-y-2"><div className="flex justify-between py-2 border-b border-slate-50"><span className="text-slate-400">이름</span><span className="font-medium">{user.name}</span></div><div className="flex justify-between py-2 border-b border-slate-50"><span className="text-slate-400">아이디</span><span className="font-medium">{user.login_id}</span></div><div className="flex justify-between py-2"><span className="text-slate-400">역할</span><span className="font-medium">{user.role==="student"?"학생":user.role==="parent"?"학부모":"관리자"}</span></div></div></div></div>);
}

/* ───── ADMIN APPROVAL ───── */
function AdminApproval({users,fetchUsers}:{users:any[];fetchUsers:()=>void}) {
  const pending=users.filter((u:any)=>u.status==="pending");const approved=users.filter((u:any)=>u.status==="approved");
  const approve=async(id:number)=>{await supabase.from("users").update({status:"approved"}).eq("id",id);fetchUsers();};
  const reject=async(id:number)=>{if(confirm("거절?")){await supabase.from("users").delete().eq("id",id);fetchUsers();}};
  const removeUser=async(id:number)=>{if(confirm("삭제?")){await supabase.from("users").delete().eq("id",id);fetchUsers();}};
  const rl=(r:string)=>r==="admin"?"관리자":r==="student"?"학생":"학부모";
  return (<div><h2 className="text-lg font-bold text-slate-800 mb-4">계정 관리</h2>{pending.length>0&&<div className="mb-6"><p className="text-sm font-semibold text-amber-600 mb-3">대기 중 ({pending.length}건)</p>{pending.map((u:any)=>(<div key={u.id} className="bg-white rounded-2xl p-5 shadow-sm mb-2 flex justify-between items-center"><div><p className="font-medium text-sm">{u.name} <span className="text-xs text-slate-400">({u.login_id})</span></p><p className="text-xs text-slate-400">{rl(u.role)} · {u.school||""}</p></div><div className="flex gap-2"><button onClick={()=>approve(u.id)} className="bg-[#6c63ff] text-white px-4 py-2 rounded-xl text-xs font-semibold">승인</button><button onClick={()=>reject(u.id)} className="bg-slate-100 text-slate-500 px-3 py-2 rounded-xl text-xs">거절</button></div></div>))}</div>}<div className="bg-white rounded-2xl shadow-sm overflow-hidden"><table className="w-full text-sm"><thead><tr className="bg-slate-50">{["아이디","이름","역할",""].map(h=><th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400">{h}</th>)}</tr></thead><tbody>{approved.map((u:any)=>(<tr key={u.id} className="border-t border-slate-50"><td className="px-5 py-3 font-mono text-xs">{u.login_id}</td><td className="px-5 py-3 font-medium">{u.name}</td><td className="px-5 py-3"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.role==="admin"?"bg-red-50 text-red-500":"bg-blue-50 text-blue-500"}`}>{rl(u.role)}</span></td><td className="px-5 py-3 text-right">{u.role!=="admin"&&<button onClick={()=>removeUser(u.id)} className="text-xs text-slate-400 hover:text-red-500">삭제</button>}</td></tr>))}</tbody></table></div></div>);
}

/* ───── MAIN ───── */
export default function Home() {
  const [page,setPage]=useState<"login"|"signup">("login");
  const [user,setUser]=useState<any>(null);
  const [loginId,setLoginId]=useState("");const [loginPw,setLoginPw]=useState("");const [loginError,setLoginError]=useState("");
  const [tab,setTab]=useState("dashboard");const [mobileMenu,setMobileMenu]=useState(false);
  const [students,setStudents]=useState<any[]>([]);const [scores,setScores]=useState<any[]>([]);const [classes,setClasses]=useState<any[]>([]);const [notices,setNotices]=useState<any[]>([]);const [users,setUsers]=useState<any[]>([]);const [loading,setLoading]=useState(false);

  const fetchUsers=async()=>{const{data}=await supabase.from("users").select("*").order("created_at",{ascending:false});if(data)setUsers(data);};
  const fetchAll=async()=>{setLoading(true);const[s,sc,c,n,u]=await Promise.all([supabase.from("students").select("*").order("created_at",{ascending:false}),supabase.from("scores").select("*"),supabase.from("classes").select("*").order("time"),supabase.from("notices").select("*").order("created_at",{ascending:false}),supabase.from("users").select("*").order("created_at",{ascending:false})]);if(s.data)setStudents(s.data);if(sc.data)setScores(sc.data);if(c.data)setClasses(c.data);if(n.data)setNotices(n.data);if(u.data)setUsers(u.data);setLoading(false);};
  useEffect(()=>{if(user)fetchAll();},[user]);

  const handleLogin=async()=>{const{data}=await supabase.from("users").select("*").eq("login_id",loginId).eq("password",loginPw).single();if(!data){setLoginError("아이디 또는 비밀번호 오류");return;}if(data.status==="pending"){setLoginError("승인 대기 중");return;}setUser(data);setLoginError("");setTab("dashboard");};
  const logout=()=>{setUser(null);setLoginId("");setLoginPw("");setTab("dashboard");};
  const pendingCount=users.filter((u:any)=>u.status==="pending").length;

  if(page==="signup"&&!user) return <SignupPage onBack={()=>setPage("login")}/>;

  if(!user) return (
    <div className="min-h-screen bg-[#f0f2f8] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-10 w-full max-w-sm shadow-sm">
        <div className="text-center mb-8"><img src="/profile.png" alt="" className="w-20 h-20 rounded-2xl mx-auto mb-3 shadow-sm"/><h1 className="text-xl font-bold text-slate-800">서서갈비</h1><p className="text-xs text-slate-400 mt-1">국어 학원 관리 시스템</p></div>
        <div className="space-y-3"><input className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/20 border-0 placeholder:text-slate-300" value={loginId} onChange={e=>{setLoginId(e.target.value);setLoginError("");}} placeholder="아이디" onKeyDown={e=>e.key==="Enter"&&handleLogin()}/><input type="password" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/20 border-0 placeholder:text-slate-300" value={loginPw} onChange={e=>{setLoginPw(e.target.value);setLoginError("");}} placeholder="비밀번호" onKeyDown={e=>e.key==="Enter"&&handleLogin()}/></div>
        {loginError&&<p className="text-red-400 text-xs mt-2">{loginError}</p>}
        <button onClick={handleLogin} className="w-full bg-[#6c63ff] text-white py-3 rounded-xl font-semibold text-sm mt-4 hover:bg-[#5b54e6]">로그인</button>
        <button onClick={()=>setPage("signup")} className="w-full bg-slate-50 text-slate-500 py-2.5 rounded-xl font-semibold text-xs mt-2">회원가입</button>
        <p className="text-center text-[10px] text-slate-300 mt-4">admin / rnrdj1234 · student1 / 1234</p>
      </div>
    </div>
  );

  if(loading) return <div className="min-h-screen bg-[#f0f2f8] flex items-center justify-center"><img src="/profile.png" alt="" className="w-12 h-12 rounded-xl opacity-50 animate-pulse"/></div>;

  const isAdmin=user.role==="admin";
  const menuItems=isAdmin?[
    {id:"dashboard",icon:"test",label:"시험 관리"},
    {id:"approval",icon:"user",label:"계정 관리",badge:pendingCount},
    {id:"settings",icon:"settings",label:"설정"},
  ]:[
    {id:"dashboard",icon:"dashboard",label:"성적표"},
    {id:"settings",icon:"settings",label:"설정"},
  ];

  const sidebar=(mobile?:boolean)=>(
    <nav className={`${mobile?"":"flex-1"} space-y-1`}>
      {menuItems.map(m=>(
        <button key={m.id} onClick={()=>{setTab(m.id);if(mobile)setMobileMenu(false);}} className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${tab===m.id?"bg-[#6c63ff] text-white":"text-slate-500 hover:bg-slate-50"}`}>
          <Icon type={m.icon} size={18}/> {m.label}
          {m.badge&&m.badge>0?<span className="ml-auto bg-red-400 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{m.badge}</span>:null}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#f0f2f8] flex">
      <aside className="hidden lg:flex flex-col w-56 bg-white shadow-sm min-h-screen p-5 fixed left-0 top-0 bottom-0 z-40">
        <div className="flex items-center gap-3 mb-8"><img src="/profile.png" alt="" className="w-9 h-9 rounded-xl"/><span className="font-bold text-slate-800 text-sm">서서갈비</span></div>
        {sidebar()}
        <div className="pt-4 border-t border-slate-100 mt-4">
          <div className="flex items-center gap-3 mb-3 px-1"><div className="w-8 h-8 bg-[#6c63ff]/10 rounded-full flex items-center justify-center text-[#6c63ff]"><Icon type="user" size={14}/></div><div><p className="text-xs font-semibold text-slate-700">{user.name}</p><p className="text-[10px] text-slate-400">{isAdmin?"관리자":user.role==="student"?"학생":"학부모"}</p></div></div>
          <button onClick={logout} className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-50"><Icon type="logout" size={16}/> 로그아웃</button>
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-40 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2"><img src="/profile.png" alt="" className="w-7 h-7 rounded-lg"/><span className="font-bold text-sm">서서갈비</span></div>
        <button onClick={()=>setMobileMenu(!mobileMenu)}><Icon type={mobileMenu?"close":"menu"} size={22}/></button>
      </div>
      {mobileMenu&&<><div onClick={()=>setMobileMenu(false)} className="lg:hidden fixed inset-0 bg-black/30 z-40"/><div className="lg:hidden fixed right-0 top-0 bottom-0 w-64 bg-white z-50 p-5 shadow-xl"><div className="flex justify-between items-center mb-6"><span className="font-bold">메뉴</span><button onClick={()=>setMobileMenu(false)}><Icon type="close" size={20}/></button></div>{sidebar(true)}<button onClick={()=>{logout();setMobileMenu(false);}} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm text-red-400 mt-4"><Icon type="logout" size={16}/> 로그아웃</button></div></>}

      <main className="flex-1 lg:ml-56 pt-16 lg:pt-0"><div className="max-w-4xl mx-auto p-5 lg:p-8">
        {isAdmin&&tab==="dashboard"&&<AdminTestManager students={students}/>}
        {isAdmin&&tab==="approval"&&<AdminApproval users={users} fetchUsers={fetchUsers}/>}
        {!isAdmin&&tab==="dashboard"&&<StudentTestView user={user}/>}
        {tab==="settings"&&<SettingsView user={user}/>}
      </div></main>
    </div>
  );
}
