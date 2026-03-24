"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const SCHOOLS = ["계성고","경신고","용문고","대원외고"];

/* ───── ICONS (SVG) ───── */
const Icon = ({type,size=20}:{type:string;size?:number}) => {
  const s = {width:size,height:size,strokeWidth:1.5,fill:"none",stroke:"currentColor",strokeLinecap:"round" as const,strokeLinejoin:"round" as const};
  switch(type){
    case "dashboard": return <svg viewBox="0 0 24 24" {...s}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
    case "grades": return <svg viewBox="0 0 24 24" {...s}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>;
    case "assignment": return <svg viewBox="0 0 24 24" {...s}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
    case "settings": return <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;
    case "logout": return <svg viewBox="0 0 24 24" {...s}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
    case "user": return <svg viewBox="0 0 24 24" {...s}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
    case "menu": return <svg viewBox="0 0 24 24" {...s}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
    case "close": return <svg viewBox="0 0 24 24" {...s}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
    default: return null;
  }
};

/* ───── SIGNUP ───── */
function SignupPage({onBack}:{onBack:()=>void}) {
  const [form,setForm]=useState({login_id:"",password:"",password2:"",name:"",role:"student",school:SCHOOLS[0],grade:1,phone:""});
  const [error,setError]=useState("");
  const [success,setSuccess]=useState(false);
  const set=(k:string,v:any)=>setForm(p=>({...p,[k]:v}));
  const handleSignup=async()=>{
    setError("");
    if(!form.login_id||!form.password||!form.name){setError("모든 필수 항목을 입력해주세요.");return;}
    if(form.password!==form.password2){setError("비밀번호가 일치하지 않습니다.");return;}
    if(form.login_id.length<3){setError("아이디는 3자 이상이어야 합니다.");return;}
    const{data:ex}=await supabase.from("users").select("id").eq("login_id",form.login_id).single();
    if(ex){setError("이미 사용 중인 아이디입니다.");return;}
    const{error:ie}=await supabase.from("users").insert({login_id:form.login_id,password:form.password,name:form.name,role:form.role,school:form.school,grade:form.grade,phone:form.phone,status:"pending"});
    if(ie){setError("오류가 발생했습니다.");return;}
    setSuccess(true);
  };
  if(success) return (
    <div className="min-h-screen bg-[#f0f2f8] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-10 w-full max-w-sm shadow-sm text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-2xl">✓</div>
        <h2 className="text-xl font-bold mb-2 text-slate-800">가입 신청 완료</h2>
        <p className="text-sm text-slate-400 mb-6">관리자 승인 후 로그인 가능합니다</p>
        <button onClick={onBack} className="w-full bg-[#6c63ff] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#5b54e6] transition-colors">로그인으로 돌아가기</button>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen bg-[#f0f2f8] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-sm">
        <div className="text-center mb-6">
          <img src="/profile.png" alt="" className="w-16 h-16 rounded-2xl mx-auto mb-3 shadow-sm"/>
          <h1 className="text-lg font-bold text-slate-800">회원가입</h1>
        </div>
        <div className="flex gap-2 mb-4">
          {[{v:"student",l:"학생"},{v:"parent",l:"학부모"}].map(r=>(
            <button key={r.v} onClick={()=>set("role",r.v)} className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${form.role===r.v?"bg-[#6c63ff] text-white":"bg-slate-100 text-slate-400"}`}>{r.l}</button>
          ))}
        </div>
        <div className="space-y-3">
          <input className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/20 border-0" value={form.login_id} onChange={e=>set("login_id",e.target.value)} placeholder="아이디"/>
          <div className="grid grid-cols-2 gap-2">
            <input type="password" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/20 border-0" value={form.password} onChange={e=>set("password",e.target.value)} placeholder="비밀번호"/>
            <input type="password" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/20 border-0" value={form.password2} onChange={e=>set("password2",e.target.value)} placeholder="비밀번호 확인"/>
          </div>
          <input className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/20 border-0" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="이름"/>
          <div className="grid grid-cols-2 gap-2">
            <select className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none border-0" value={form.school} onChange={e=>set("school",e.target.value)}>{SCHOOLS.map(s=><option key={s}>{s}</option>)}</select>
            <select className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none border-0" value={form.grade} onChange={e=>set("grade",Number(e.target.value))}>{[1,2,3].map(g=><option key={g} value={g}>{g}학년</option>)}</select>
          </div>
          <input className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/20 border-0" value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="연락처 (선택)"/>
        </div>
        {error&&<p className="text-red-400 text-xs mt-2">{error}</p>}
        <button onClick={handleSignup} className="w-full bg-[#6c63ff] text-white py-3 rounded-xl font-semibold text-sm mt-4 hover:bg-[#5b54e6] transition-colors">가입 신청</button>
        <button onClick={onBack} className="w-full text-slate-400 text-xs mt-3 hover:text-slate-600">← 로그인으로</button>
      </div>
    </div>
  );
}

/* ───── DASHBOARD VIEW ───── */
function DashboardView({user,scores,students}:{user:any;scores:any[];students:any[]}) {
  const myScores = user.student_id ? scores.filter((s:any)=>s.student_id===user.student_id) : [];
  const avg = myScores.length>0 ? Math.round(myScores.filter((s:any)=>s.score).reduce((a:number,b:any)=>a+b.score,0)/myScores.filter((s:any)=>s.score).length) : 0;
  const bestRank = myScores.length>0 ? Math.min(...myScores.filter((s:any)=>s.rank).map((s:any)=>s.rank)) : 0;
  return (
    <div>
      <div className="bg-[#ffeadb] rounded-2xl p-6 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">안녕하세요, {user.name}님! 👋</h2>
          <p className="text-sm text-slate-500 mt-1">{myScores.length>0?`최근 성적: ${myScores[0]?.exam}`:"아직 등록된 성적이 없어요"}</p>
        </div>
        <img src="/profile.png" alt="" className="w-16 h-16 rounded-2xl shadow-sm hidden sm:block"/>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-slate-400 font-medium mb-1">평균 점수</p>
          <p className="text-3xl font-bold text-[#6c63ff]">{avg||"—"}<span className="text-sm text-slate-400 font-normal ml-1">점</span></p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-slate-400 font-medium mb-1">최고 등급</p>
          <p className="text-3xl font-bold text-[#ff6b6b]">{bestRank||"—"}<span className="text-sm text-slate-400 font-normal ml-1">등급</span></p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-slate-400 font-medium mb-1">응시 횟수</p>
          <p className="text-3xl font-bold text-[#51cf66]">{myScores.length}<span className="text-sm text-slate-400 font-normal ml-1">회</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm text-slate-700">최근 성적</h3>
            <span className="text-xs text-[#6c63ff] font-medium cursor-pointer">더보기 →</span>
          </div>
          {myScores.length>0?myScores.slice(0,4).map((s:any,i:number)=>(
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${s.rank===1?"bg-[#6c63ff]":s.rank===2?"bg-[#51cf66]":"bg-slate-300"}`}/>
                <div>
                  <p className="text-sm font-medium text-slate-700">{s.exam}</p>
                  <p className="text-xs text-slate-400">{s.subject}</p>
                </div>
              </div>
              <div className="text-right">
                {s.score&&<span className="text-sm font-bold text-slate-700">{s.score}점</span>}
                {s.rank&&<span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${s.rank===1?"bg-[#6c63ff]/10 text-[#6c63ff]":"bg-slate-100 text-slate-500"}`}>{s.rank}등급</span>}
              </div>
            </div>
          )):(
            <p className="text-center text-slate-400 text-sm py-8">등록된 성적이 없습니다</p>
          )}
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm text-slate-700">과제 성취도</h3>
            <span className="text-xs text-[#6c63ff] font-medium cursor-pointer">더보기 →</span>
          </div>
          <div className="space-y-4">
            {["국어","문학","독서"].map((subj,i)=>{
              const pct = [85,72,90][i];
              return (
                <div key={subj}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-600">{subj}</span>
                    <span className="text-sm font-semibold text-slate-700">{pct}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{width:`${pct}%`,background:i===0?"#6c63ff":i===1?"#ff6b6b":"#51cf66"}}/>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 p-4 bg-slate-50 rounded-xl">
            <p className="text-xs font-semibold text-slate-500 mb-1">📝 선생님 코멘트</p>
            <p className="text-sm text-slate-600 leading-relaxed">전반적으로 잘 하고 있어요! 문학 영역에서 좀 더 분석력을 키우면 1등급 충분히 가능합니다. 화이팅!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───── GRADES DETAIL ───── */
function GradesDetail({user,scores}:{user:any;scores:any[]}) {
  const my = user.student_id ? scores.filter((s:any)=>s.student_id===user.student_id) : scores;
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-4">성적 상세</h2>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {my.length>0?(
          <table className="w-full text-sm">
            <thead><tr className="bg-slate-50">{["시험","과목","점수","등급","유형"].map(h=><th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400">{h}</th>)}</tr></thead>
            <tbody>
              {my.map((s:any,i:number)=>(
                <tr key={i} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 font-medium text-slate-700">{s.exam}</td>
                  <td className="px-5 py-4 text-slate-500">{s.subject}</td>
                  <td className="px-5 py-4">{s.score?<span className="font-bold text-[#6c63ff]">{s.score}점</span>:<span className="text-slate-300">—</span>}</td>
                  <td className="px-5 py-4">{s.rank?<span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.rank===1?"bg-[#6c63ff]/10 text-[#6c63ff]":s.rank<=3?"bg-green-50 text-green-600":"bg-slate-100 text-slate-500"}`}>{s.rank}등급</span>:"—"}</td>
                  <td className="px-5 py-4">{s.type==="improvement"&&<span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600">향상</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ):(
          <div className="p-12 text-center text-slate-400">등록된 성적이 없습니다</div>
        )}
      </div>
    </div>
  );
}

/* ───── ASSIGNMENT DETAIL ───── */
function AssignmentDetail({user}:{user:any}) {
  const assignments = [
    {id:1,title:"비문학 독해 연습 20문항",subject:"독서",due:"2026-03-28",status:"완료",score:90},
    {id:2,title:"현대시 분석 리포트",subject:"문학",due:"2026-03-30",status:"진행중",score:null},
    {id:3,title:"INSIGHT 추가과제 50문항",subject:"국어",due:"2026-04-02",status:"미제출",score:null},
    {id:4,title:"오답노트 정리",subject:"국어",due:"2026-03-25",status:"완료",score:85},
    {id:5,title:"화법과작문 기출 풀이",subject:"화법과작문",due:"2026-04-05",status:"미제출",score:null},
  ];
  const statusStyle=(s:string)=>s==="완료"?"bg-green-50 text-green-600":s==="진행중"?"bg-blue-50 text-blue-600":"bg-slate-100 text-slate-400";
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-4">과제 상세</h2>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-[#51cf66]">{assignments.filter(a=>a.status==="완료").length}</p>
          <p className="text-xs text-slate-400 mt-1">완료</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-[#6c63ff]">{assignments.filter(a=>a.status==="진행중").length}</p>
          <p className="text-xs text-slate-400 mt-1">진행중</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-[#ff6b6b]">{assignments.filter(a=>a.status==="미제출").length}</p>
          <p className="text-xs text-slate-400 mt-1">미제출</p>
        </div>
      </div>
      <div className="space-y-3">
        {assignments.map(a=>(
          <div key={a.id} className="bg-white rounded-2xl p-5 shadow-sm flex justify-between items-center">
            <div>
              <p className="font-medium text-sm text-slate-700">{a.title}</p>
              <p className="text-xs text-slate-400 mt-1">{a.subject} · 마감: {a.due}</p>
            </div>
            <div className="flex items-center gap-3">
              {a.score&&<span className="text-sm font-bold text-[#6c63ff]">{a.score}점</span>}
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyle(a.status)}`}>{a.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───── SETTINGS ───── */
function SettingsView({user}:{user:any}) {
  const [pw,setPw]=useState({current:"",new1:"",new2:""});
  const [msg,setMsg]=useState("");
  const changePw=async()=>{
    if(pw.new1!==pw.new2){setMsg("새 비밀번호가 일치하지 않습니다.");return;}
    if(pw.new1.length<4){setMsg("비밀번호는 4자 이상이어야 합니다.");return;}
    const{error}=await supabase.from("users").update({password:pw.new1}).eq("id",user.id);
    if(!error){setMsg("비밀번호가 변경되었습니다!");setPw({current:"",new1:"",new2:""});}
    else setMsg("오류가 발생했습니다.");
  };
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-4">설정</h2>
      <div className="bg-white rounded-2xl p-6 shadow-sm max-w-md">
        <h3 className="font-semibold text-sm text-slate-700 mb-4">비밀번호 변경</h3>
        <div className="space-y-3">
          <input type="password" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/20 border-0" value={pw.current} onChange={e=>setPw(p=>({...p,current:e.target.value}))} placeholder="현재 비밀번호"/>
          <input type="password" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/20 border-0" value={pw.new1} onChange={e=>setPw(p=>({...p,new1:e.target.value}))} placeholder="새 비밀번호"/>
          <input type="password" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/20 border-0" value={pw.new2} onChange={e=>setPw(p=>({...p,new2:e.target.value}))} placeholder="새 비밀번호 확인"/>
        </div>
        {msg&&<p className={`text-xs mt-2 ${msg.includes("변경")?"text-green-500":"text-red-400"}`}>{msg}</p>}
        <button onClick={changePw} className="mt-4 bg-[#6c63ff] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#5b54e6] transition-colors">변경하기</button>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm max-w-md mt-4">
        <h3 className="font-semibold text-sm text-slate-700 mb-3">내 정보</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-slate-50"><span className="text-slate-400">이름</span><span className="font-medium text-slate-700">{user.name}</span></div>
          <div className="flex justify-between py-2 border-b border-slate-50"><span className="text-slate-400">아이디</span><span className="font-medium text-slate-700">{user.login_id}</span></div>
          <div className="flex justify-between py-2 border-b border-slate-50"><span className="text-slate-400">역할</span><span className="font-medium text-slate-700">{user.role==="student"?"학생":user.role==="parent"?"학부모":"관리자"}</span></div>
          <div className="flex justify-between py-2"><span className="text-slate-400">학교</span><span className="font-medium text-slate-700">{user.school||"—"}</span></div>
        </div>
      </div>
    </div>
  );
}

/* ───── ADMIN APPROVAL ───── */
function AdminApproval({users,fetchUsers}:{users:any[];fetchUsers:()=>void}) {
  const pending=users.filter((u:any)=>u.status==="pending");
  const approved=users.filter((u:any)=>u.status==="approved");
  const approve=async(id:number)=>{await supabase.from("users").update({status:"approved"}).eq("id",id);fetchUsers();};
  const reject=async(id:number)=>{if(confirm("거절하시겠습니까?")){await supabase.from("users").delete().eq("id",id);fetchUsers();}};
  const removeUser=async(id:number)=>{if(confirm("삭제하시겠습니까?")){await supabase.from("users").delete().eq("id",id);fetchUsers();}};
  const roleLabel=(r:string)=>r==="admin"?"관리자":r==="student"?"학생":"학부모";
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-4">가입 승인 / 계정 관리</h2>
      {pending.length>0&&(
        <div className="mb-6">
          <p className="text-sm font-semibold text-amber-600 mb-3">대기 중 ({pending.length}건)</p>
          {pending.map((u:any)=>(
            <div key={u.id} className="bg-white rounded-2xl p-5 shadow-sm mb-2 flex justify-between items-center">
              <div><p className="font-medium text-sm">{u.name} <span className="text-xs text-slate-400">({u.login_id})</span></p><p className="text-xs text-slate-400">{roleLabel(u.role)} · {u.school||""} {u.grade?u.grade+"학년":""}</p></div>
              <div className="flex gap-2">
                <button onClick={()=>approve(u.id)} className="bg-[#6c63ff] text-white px-4 py-2 rounded-xl text-xs font-semibold">승인</button>
                <button onClick={()=>reject(u.id)} className="bg-slate-100 text-slate-500 px-3 py-2 rounded-xl text-xs font-semibold">거절</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="text-sm font-semibold text-slate-500 mb-3">전체 계정 ({approved.length}명)</p>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-slate-50">{["아이디","이름","역할",""].map(h=><th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400">{h}</th>)}</tr></thead>
          <tbody>
            {approved.map((u:any)=>(
              <tr key={u.id} className="border-t border-slate-50 hover:bg-slate-50/50">
                <td className="px-5 py-3 font-mono text-xs">{u.login_id}</td>
                <td className="px-5 py-3 font-medium">{u.name}</td>
                <td className="px-5 py-3"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.role==="admin"?"bg-red-50 text-red-500":u.role==="student"?"bg-blue-50 text-blue-500":"bg-green-50 text-green-500"}`}>{roleLabel(u.role)}</span></td>
                <td className="px-5 py-3 text-right">{u.role!=="admin"&&<button onClick={()=>removeUser(u.id)} className="text-xs text-slate-400 hover:text-red-500">삭제</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ───── MAIN ───── */
export default function Home() {
  const [page,setPage]=useState<"login"|"signup">("login");
  const [user,setUser]=useState<any>(null);
  const [loginId,setLoginId]=useState("");
  const [loginPw,setLoginPw]=useState("");
  const [loginError,setLoginError]=useState("");
  const [tab,setTab]=useState("dashboard");
  const [mobileMenu,setMobileMenu]=useState(false);
  const [students,setStudents]=useState<any[]>([]);
  const [scores,setScores]=useState<any[]>([]);
  const [classes,setClasses]=useState<any[]>([]);
  const [notices,setNotices]=useState<any[]>([]);
  const [users,setUsers]=useState<any[]>([]);
  const [loading,setLoading]=useState(false);

  const fetchUsers=async()=>{const{data}=await supabase.from("users").select("*").order("created_at",{ascending:false});if(data)setUsers(data);};
  const fetchAll=async()=>{
    setLoading(true);
    const[s,sc,c,n,u]=await Promise.all([
      supabase.from("students").select("*").order("created_at",{ascending:false}),
      supabase.from("scores").select("*"),
      supabase.from("classes").select("*").order("time"),
      supabase.from("notices").select("*").order("created_at",{ascending:false}),
      supabase.from("users").select("*").order("created_at",{ascending:false}),
    ]);
    if(s.data)setStudents(s.data);if(sc.data)setScores(sc.data);if(c.data)setClasses(c.data);if(n.data)setNotices(n.data);if(u.data)setUsers(u.data);
    setLoading(false);
  };
  useEffect(()=>{if(user)fetchAll();},[user]);

  const handleLogin=async()=>{
    const{data}=await supabase.from("users").select("*").eq("login_id",loginId).eq("password",loginPw).single();
    if(!data){setLoginError("아이디 또는 비밀번호가 올바르지 않습니다.");return;}
    if(data.status==="pending"){setLoginError("승인 대기 중입니다.");return;}
    setUser(data);setLoginError("");setTab("dashboard");
  };
  const logout=()=>{setUser(null);setLoginId("");setLoginPw("");setLoginError("");setTab("dashboard");};
  const pendingCount=users.filter((u:any)=>u.status==="pending").length;

  if(page==="signup"&&!user) return <SignupPage onBack={()=>setPage("login")}/>;

  if(!user) return (
    <div className="min-h-screen bg-[#f0f2f8] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-10 w-full max-w-sm shadow-sm">
        <div className="text-center mb-8">
          <img src="/profile.png" alt="" className="w-20 h-20 rounded-2xl mx-auto mb-3 shadow-sm"/>
          <h1 className="text-xl font-bold text-slate-800">서서갈비</h1>
          <p className="text-xs text-slate-400 mt-1">국어 학원 관리 시스템</p>
        </div>
        <div className="space-y-3">
          <input className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/20 border-0 placeholder:text-slate-300" value={loginId} onChange={e=>{setLoginId(e.target.value);setLoginError("");}} placeholder="아이디" onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
          <input type="password" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/20 border-0 placeholder:text-slate-300" value={loginPw} onChange={e=>{setLoginPw(e.target.value);setLoginError("");}} placeholder="비밀번호" onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
        </div>
        {loginError&&<p className="text-red-400 text-xs mt-2">{loginError}</p>}
        <button onClick={handleLogin} className="w-full bg-[#6c63ff] text-white py-3 rounded-xl font-semibold text-sm mt-4 hover:bg-[#5b54e6] transition-colors">로그인</button>
        <button onClick={()=>setPage("signup")} className="w-full bg-slate-50 text-slate-500 py-2.5 rounded-xl font-semibold text-xs mt-2 hover:bg-slate-100 transition-colors">회원가입</button>
        <p className="text-center text-[10px] text-slate-300 mt-4">admin / rnrdj1234 · student1 / 1234</p>
      </div>
    </div>
  );

  if(loading) return <div className="min-h-screen bg-[#f0f2f8] flex items-center justify-center"><div className="text-center"><img src="/profile.png" alt="" className="w-12 h-12 rounded-xl mx-auto mb-3 opacity-50 animate-pulse"/><p className="text-slate-400 text-sm">불러오는 중...</p></div></div>;

  const isAdmin=user.role==="admin";
  const menuItems=isAdmin?[
    {id:"dashboard",icon:"dashboard",label:"대시보드"},
    {id:"approval",icon:"user",label:"가입 승인",badge:pendingCount},
    {id:"settings",icon:"settings",label:"설정"},
  ]:[
    {id:"dashboard",icon:"dashboard",label:"대시보드"},
    {id:"grades",icon:"grades",label:"성적 상세"},
    {id:"assignments",icon:"assignment",label:"과제 상세"},
    {id:"settings",icon:"settings",label:"설정"},
  ];

  return (
    <div className="min-h-screen bg-[#f0f2f8] flex">
      {/* SIDEBAR — DESKTOP */}
      <aside className="hidden lg:flex flex-col w-60 bg-white shadow-sm min-h-screen p-5 fixed left-0 top-0 bottom-0 z-40">
        <div className="flex items-center gap-3 mb-8">
          <img src="/profile.png" alt="" className="w-9 h-9 rounded-xl shadow-sm"/>
          <span className="font-bold text-slate-800">서서갈비</span>
        </div>
        <nav className="flex-1 space-y-1">
          {menuItems.map(m=>(
            <button key={m.id} onClick={()=>setTab(m.id)} className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${tab===m.id?"bg-[#6c63ff] text-white":"text-slate-500 hover:bg-slate-50"}`}>
              <Icon type={m.icon} size={18}/> {m.label}
              {m.badge&&m.badge>0?<span className="ml-auto bg-red-400 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{m.badge}</span>:null}
            </button>
          ))}
        </nav>
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-8 h-8 bg-[#6c63ff]/10 rounded-full flex items-center justify-center text-[#6c63ff]"><Icon type="user" size={16}/></div>
            <div><p className="text-xs font-semibold text-slate-700">{user.name}</p><p className="text-[10px] text-slate-400">{isAdmin?"관리자":user.role==="student"?"학생":"학부모"}</p></div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-50 transition-colors">
            <Icon type="logout" size={16}/> 로그아웃
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-40 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/profile.png" alt="" className="w-7 h-7 rounded-lg"/>
          <span className="font-bold text-sm text-slate-800">서서갈비</span>
        </div>
        <button onClick={()=>setMobileMenu(!mobileMenu)} className="text-slate-500"><Icon type={mobileMenu?"close":"menu"} size={22}/></button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenu&&(
        <>
          <div onClick={()=>setMobileMenu(false)} className="lg:hidden fixed inset-0 bg-black/30 z-40"/>
          <div className="lg:hidden fixed right-0 top-0 bottom-0 w-64 bg-white z-50 p-5 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-slate-800">메뉴</span>
              <button onClick={()=>setMobileMenu(false)} className="text-slate-400"><Icon type="close" size={20}/></button>
            </div>
            <nav className="space-y-1">
              {menuItems.map(m=>(
                <button key={m.id} onClick={()=>{setTab(m.id);setMobileMenu(false);}} className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${tab===m.id?"bg-[#6c63ff] text-white":"text-slate-500"}`}>
                  <Icon type={m.icon} size={18}/> {m.label}
                  {m.badge&&m.badge>0?<span className="ml-auto bg-red-400 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{m.badge}</span>:null}
                </button>
              ))}
            </nav>
            <button onClick={()=>{logout();setMobileMenu(false);}} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm text-red-400 mt-4 hover:bg-red-50">
              <Icon type="logout" size={16}/> 로그아웃
            </button>
          </div>
        </>
      )}

      {/* CONTENT */}
      <main className="flex-1 lg:ml-60 pt-16 lg:pt-0">
        <div className="max-w-4xl mx-auto p-5 lg:p-8">
          {tab==="dashboard"&&(isAdmin
            ?<AdminApproval users={users} fetchUsers={fetchUsers}/>
            :<DashboardView user={user} scores={scores} students={students}/>
          )}
          {tab==="grades"&&<GradesDetail user={user} scores={scores}/>}
          {tab==="assignments"&&<AssignmentDetail user={user}/>}
          {tab==="approval"&&<AdminApproval users={users} fetchUsers={fetchUsers}/>}
          {tab==="settings"&&<SettingsView user={user}/>}
        </div>
      </main>
    </div>
  );
}
