"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const SCHOOLS = ["계성고","경신고","용문고","대원외고"];

function Modal({open,onClose,title,children}:{open:boolean;onClose:()=>void;title:string;children:React.ReactNode}) {
  if(!open) return null;
  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000] p-4">
      <div onClick={e=>e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-[520px] max-h-[85vh] overflow-auto shadow-2xl">
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 text-xl hover:text-gray-600">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function StudentHome({students,scores,notices}:{students:any[];scores:any[];notices:any[]}) {
  const active = students.filter((s:any)=>s.status==="active");
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 rounded-2xl p-7 text-white relative overflow-hidden">
        <div className="absolute -top-5 -right-5 w-28 h-28 bg-white/5 rounded-full"/>
        <p className="text-slate-400 text-sm">맛있게, 확실하게, 그리고</p>
        <h2 className="text-2xl font-black mt-1">🥩 서서갈비로 국어하기</h2>
        <p className="text-slate-400 text-sm mt-1">서서갈비 국어 T 학생 페이지</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-bold mb-3">📢 공지사항</h3>
        {notices.map((n:any)=>(
          <div key={n.id} className="py-2 border-b border-gray-100 flex justify-between">
            <span className="text-sm font-semibold text-slate-700">{n.title}</span>
            <span className="text-xs text-gray-400">{n.date}</span>
          </div>
        ))}
        {notices.length===0&&<div className="text-center py-4 text-gray-400 text-sm">공지사항이 없습니다</div>}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold">수업 후기</h3>
          <span className="text-xs text-blue-500 font-semibold cursor-pointer">후기 작성 &gt;</span>
        </div>
        <div className="text-center py-4">
          <div className="bg-yellow-50 rounded-lg px-4 py-3 inline-block text-sm text-yellow-800">
            🎁 후기 작성 시 <b>200P</b> 지급! 베스트 선정 시 <b>500P</b> 추가!
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-bold">🏆 재원생 현황</h3>
        <p className="text-xs text-gray-400 mb-3">총 {active.length}명</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {active.slice(0,6).map((s:any)=>(
            <div key={s.id} className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="font-bold text-sm">{s.name} <span className="text-xs text-gray-400 font-normal">{s.school} {s.grade}학년</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentGrades({scores}:{scores:any[]}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-bold mb-4">📊 성적 목록</h3>
      {scores.length>0?(
        <div className="space-y-2">
          {scores.map((s:any)=>(
            <div key={s.id} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
              <div><div className="text-sm font-bold">{s.exam}</div><div className="text-xs text-gray-500">{s.subject}</div></div>
              <div className="text-right">
                {s.score&&<div className="text-lg font-black text-blue-600">{s.score}점</div>}
                {s.rank&&<div className={`text-xs font-bold ${s.rank===1?"text-red-500":"text-gray-500"}`}>{s.rank}등급</div>}
              </div>
            </div>
          ))}
        </div>
      ):(
        <div className="text-center py-10 text-gray-400">등록된 성적이 없습니다</div>
      )}
    </div>
  );
}

function AdminDashboard({students,classes}:{students:any[];classes:any[]}) {
  const active=students.filter((s:any)=>s.status==="active");
  const bySchool=SCHOOLS.map(sc=>({name:sc,count:active.filter((s:any)=>s.school===sc).length}));
  const sat=new Date();sat.setDate(sat.getDate()+(6-sat.getDay()));
  const sun=new Date(sat);sun.setDate(sat.getDate()+1);
  return (
    <div>
      <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 rounded-2xl p-7 text-white relative overflow-hidden mb-4">
        <div className="absolute -top-5 -right-5 w-28 h-28 bg-white/5 rounded-full"/>
        <p className="text-slate-400 text-sm">맛있게, 확실하게, 그리고</p>
        <h2 className="text-2xl font-black mt-1">🥩 서서갈비로 국어하기</h2>
        <p className="text-slate-400 text-sm mt-1">국어 서서갈비 T 관리 페이지</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold mb-3">전체 현황</h3>
            <div className="bg-blue-50 rounded-lg p-3 mb-3 flex items-center gap-2">
              <span className="text-lg">👥</span>
              <span className="text-blue-800 font-black text-lg">재원생 {active.length}명</span>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {bySchool.map(s=>(
                <div key={s.name} className="text-center p-2 border border-gray-200 rounded-lg">
                  <div className="text-sm font-bold">{s.name}</div>
                  <div className="text-sm text-gray-500">{s.count}명</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <span className="bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold">📋 조교 3명</span>
              <span className="bg-red-50 border border-red-200 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold">👨‍🏫 선생님 2명</span>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {cat:"학생 및 소통",items:["✅ 가입 승인","🔒 비밀번호 변경","✏️ 정보 수정"],color:"text-blue-500 border-blue-500"},
              {cat:"학생 관리",items:["📣 공지","🩺 클리닉 관리","📝 과제 관리","❓ 질문 관리"],color:"text-purple-500 border-purple-500"},
              {cat:"수업 및 성적",items:["📅 수업/시험","📊 시험 성적","📄 수업 레포트"],color:"text-amber-500 border-amber-500"},
              {cat:"운영 관리",items:["👤 조교 근무","💬 문자 발송"],color:"text-emerald-500 border-emerald-500"},
            ].map(g=>(
              <div key={g.cat} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className={`text-xs font-bold mb-3 pb-2 border-b-2 ${g.color}`}>{g.cat}</div>
                <div className="space-y-1">
                  {g.items.map(it=>(
                    <button key={it} className="w-full text-left text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg px-2.5 py-2 transition-colors">{it}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="font-bold text-sm mb-2">🩺 클리닉 일정</h4>
            <div className="text-center py-3 text-gray-400 text-sm">예정된 클리닉이 없습니다</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="font-bold text-sm mb-3">📚 이번 주 수업</h4>
            {[{label:`${sat.getMonth()+1}/${sat.getDate()}(토)`,day:"토"},{label:`${sun.getMonth()+1}/${sun.getDate()}(일)`,day:"일"}].map(d=>(
              <div key={d.day} className="mb-3">
                <div className="text-sm font-bold text-gray-700 mb-2">{d.label}</div>
                {classes.filter((c:any)=>c.day===d.day).map((c:any)=>(
                  <div key={c.id} className="flex items-center gap-2 py-1 pl-3 mb-1" style={{borderLeft:`3px solid ${c.color}`}}>
                    <span className="text-xs font-bold">{c.time}</span>
                    <span className="text-xs text-gray-600">{c.title}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="font-bold text-sm mb-2">📝 시험 일정</h4>
            <div className="text-center py-3 text-gray-400 text-sm">예정된 시험이 없습니다</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminStudents({students,setStudents,fetchStudents}:{students:any[];setStudents:any;fetchStudents:()=>void}) {
  const [search,setSearch]=useState("");
  const [filterSchool,setFilterSchool]=useState("all");
  const [modal,setModal]=useState<string|null>(null);
  const [form,setForm]=useState<any>({});
  const filtered=students.filter((s:any)=>{
    const ms=s.name.includes(search)||s.school.includes(search);
    const mf=filterSchool==="all"||s.school===filterSchool;
    return ms&&mf&&s.status==="active";
  });
  const openAdd=()=>{setForm({name:"",school:SCHOOLS[0],grade:1,number:"",phone:"",parent_name:"",parent_phone:"",parent_relation:"어머니"});setModal("add");};
  const openEdit=(s:any)=>{setForm({...s});setModal("edit");};
  const save=async()=>{
    if(!form.name)return;
    if(modal==="add"){
      await supabase.from("students").insert({
        name:form.name,school:form.school,grade:form.grade,
        number:Number(form.number)||0,phone:form.phone,
        parent_name:form.parent_name,parent_phone:form.parent_phone,
        parent_relation:form.parent_relation,status:"active"
      });
    } else {
      await supabase.from("students").update({
        name:form.name,school:form.school,grade:form.grade,
        number:Number(form.number)||0,phone:form.phone,
        parent_name:form.parent_name,parent_phone:form.parent_phone,
        parent_relation:form.parent_relation
      }).eq("id",form.id);
    }
    setModal(null);
    fetchStudents();
  };
  const remove=async(id:number)=>{
    if(confirm("정말 삭제하시겠습니까?")){
      await supabase.from("students").delete().eq("id",id);
      fetchStudents();
    }
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex gap-2">
          <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-52 focus:outline-none focus:border-blue-500" placeholder="🔍 이름 또는 학교로 검색..." value={search} onChange={e=>setSearch(e.target.value)}/>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={filterSchool} onChange={e=>setFilterSchool(e.target.value)}>
            <option value="all">전체 학교</option>
            {SCHOOLS.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700" onClick={openAdd}>+ 학생 추가</button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {["이름","학교","학년","번호","연락처","학부모","학부모 연락처",""].map(h=>(
                <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 border-b-2 border-gray-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s:any)=>(
              <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-bold">{s.name}</td>
                <td className="px-4 py-3"><span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-full">{s.school}</span></td>
                <td className="px-4 py-3 text-gray-500">{s.grade}학년</td>
                <td className="px-4 py-3 text-gray-500">{s.number}번</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{s.phone}</td>
                <td className="px-4 py-3 font-semibold">{s.parent_name}</td>
                <td className="px-4 py-3 text-blue-600 text-xs">{s.parent_phone}</td>
                <td className="px-4 py-3 text-right">
                  <button className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-semibold mr-1 hover:bg-gray-200" onClick={()=>openEdit(s)}>수정</button>
                  <button className="bg-red-50 text-red-500 px-2 py-1 rounded text-xs font-semibold hover:bg-red-100" onClick={()=>remove(s.id)}>삭제</button>
                </td>
              </tr>
            ))}
            {filtered.length===0&&<tr><td colSpan={8} className="text-center py-10 text-gray-400">학생이 없습니다</td></tr>}
          </tbody>
        </table>
      </div>
      <Modal open={!!modal} onClose={()=>setModal(null)} title={modal==="add"?"새 학생 등록":"학생 정보 수정"}>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs font-bold text-gray-600">이름</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-blue-500" value={form.name||""} onChange={e=>setForm((p:any)=>({...p,name:e.target.value}))}/></div>
          <div><label className="text-xs font-bold text-gray-600">학교</label><select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-blue-500" value={form.school||""} onChange={e=>setForm((p:any)=>({...p,school:e.target.value}))}>{SCHOOLS.map(s=><option key={s}>{s}</option>)}</select></div>
          <div><label className="text-xs font-bold text-gray-600">학년</label><select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-blue-500" value={form.grade||1} onChange={e=>setForm((p:any)=>({...p,grade:Number(e.target.value)}))}>{[1,2,3].map(g=><option key={g} value={g}>{g}학년</option>)}</select></div>
          <div><label className="text-xs font-bold text-gray-600">번호</label><input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-blue-500" value={form.number||""} onChange={e=>setForm((p:any)=>({...p,number:e.target.value}))}/></div>
          <div className="col-span-2"><label className="text-xs font-bold text-gray-600">연락처</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-blue-500" value={form.phone||""} onChange={e=>setForm((p:any)=>({...p,phone:e.target.value}))} placeholder="010-0000-0000"/></div>
        </div>
        <div className="border-t border-dashed border-gray-200 mt-4 pt-4">
          <p className="text-xs font-bold text-gray-500 mb-3">👨‍👩‍👧 학부모 정보</p>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-bold text-gray-600">이름</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-blue-500" value={form.parent_name||""} onChange={e=>setForm((p:any)=>({...p,parent_name:e.target.value}))}/></div>
            <div><label className="text-xs font-bold text-gray-600">관계</label><select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-blue-500" value={form.parent_relation||"어머니"} onChange={e=>setForm((p:any)=>({...p,parent_relation:e.target.value}))}>{["어머니","아버지","조부모","기타"].map(r=><option key={r}>{r}</option>)}</select></div>
            <div className="col-span-2"><label className="text-xs font-bold text-gray-600">연락처</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-blue-500" value={form.parent_phone||""} onChange={e=>setForm((p:any)=>({...p,parent_phone:e.target.value}))} placeholder="010-0000-0000"/></div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-semibold" onClick={()=>setModal(null)}>취소</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50" disabled={!form.name} onClick={save}>저장</button>
        </div>
      </Modal>
    </div>
  );
}

export default function Home() {
  const [user,setUser]=useState<{role:string;name:string}|null>(null);
  const [loginId,setLoginId]=useState("");
  const [loginPw,setLoginPw]=useState("");
  const [loginError,setLoginError]=useState("");
  const [adminTab,setAdminTab]=useState("dashboard");
  const [studentTab,setStudentTab]=useState("home");
  const [sidebarOpen,setSidebarOpen]=useState(false);
  const [students,setStudents]=useState<any[]>([]);
  const [scores,setScores]=useState<any[]>([]);
  const [classes,setClasses]=useState<any[]>([]);
  const [notices,setNotices]=useState<any[]>([]);
  const [loading,setLoading]=useState(false);

  const fetchStudents=async()=>{
    const {data}=await supabase.from("students").select("*").order("created_at",{ascending:false});
    if(data) setStudents(data);
  };
  const fetchAll=async()=>{
    setLoading(true);
    const [s,sc,c,n]=await Promise.all([
      supabase.from("students").select("*").order("created_at",{ascending:false}),
      supabase.from("scores").select("*"),
      supabase.from("classes").select("*").order("time"),
      supabase.from("notices").select("*").order("created_at",{ascending:false}),
    ]);
    if(s.data) setStudents(s.data);
    if(sc.data) setScores(sc.data);
    if(c.data) setClasses(c.data);
    if(n.data) setNotices(n.data);
    setLoading(false);
  };

  useEffect(()=>{if(user) fetchAll();},[user]);

  const handleLogin=()=>{
    if(loginId==="admin"&&loginPw==="rnrdj1234"){setUser({role:"admin",name:"관리자님"});setLoginError("");}
    else if(loginId==="student"&&loginPw==="1234"){setUser({role:"student",name:"박승우"});setLoginError("");}
    else setLoginError("아이디 또는 비밀번호가 올바르지 않습니다.");
  };

  if(!user) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-10 w-96 shadow-2xl">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🥩</div>
          <h1 className="text-2xl font-black text-slate-900">서서갈비</h1>
          <p className="text-sm text-gray-400 mt-1">국어 학원 관리 시스템</p>
        </div>
        <div className="mb-3">
          <label className="text-xs font-bold text-gray-500">아이디</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm mt-1 focus:outline-none focus:border-blue-500" value={loginId} onChange={e=>{setLoginId(e.target.value);setLoginError("");}} placeholder="아이디를 입력하세요" onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
        </div>
        <div className="mb-5">
          <label className="text-xs font-bold text-gray-500">비밀번호</label>
          <input type="password" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm mt-1 focus:outline-none focus:border-blue-500" value={loginPw} onChange={e=>{setLoginPw(e.target.value);setLoginError("");}} placeholder="비밀번호를 입력하세요" onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
        </div>
        {loginError&&<p className="text-red-500 text-xs font-semibold mb-3">{loginError}</p>}
        <button onClick={handleLogin} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-bold text-base">로그인</button>
        <div className="text-center mt-5 text-xs text-gray-400 leading-relaxed">관리자: admin / rnrdj1234<br/>학생 테스트: student / 1234</div>
      </div>
    </div>
  );

  if(loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-3">🥩</div>
        <p className="text-gray-500 font-semibold">데이터를 불러오는 중...</p>
      </div>
    </div>
  );

  if(user.role==="student") {
    const tabs=[{id:"home",icon:"🏠",label:"홈"},{id:"grades",icon:"📊",label:"성적"},{id:"ai",icon:"💎",label:"AI"},{id:"info",icon:"🔔",label:"안내/자료"},{id:"game",icon:"🎮",label:"게임"}];
    return (
      <div className="min-h-screen bg-gray-100 pb-20">
        <div className="bg-slate-900 px-5 py-3 flex justify-between items-center text-white">
          <span className="font-bold">🥩 서서갈비</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{user.name}</span>
            <button onClick={()=>setUser(null)} className="bg-slate-800 text-gray-400 border border-slate-700 px-3 py-1 rounded text-xs">로그아웃</button>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 pt-4">
          {studentTab==="home"&&<StudentHome students={students} scores={scores} notices={notices}/>}
          {studentTab==="grades"&&<StudentGrades scores={scores}/>}
          {!["home","grades"].includes(studentTab)&&(
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400">🚧 준비 중인 기능입니다</div>
          )}
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 pb-3 z-50">
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setStudentTab(t.id)} className={`flex flex-col items-center gap-0.5 px-3 py-1 ${studentTab===t.id?"text-blue-600":"text-gray-400"}`}>
              <span className="text-xl">{t.icon}</span>
              <span className="text-[10px] font-bold">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-slate-900 px-5 py-3 flex justify-between items-center text-white sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={()=>setSidebarOpen(!sidebarOpen)} className="text-xl">☰</button>
          <span className="font-bold text-sm">🥩 서서갈비 T 관리 페이지</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{user.name} (관리자)</span>
          <button onClick={()=>setUser(null)} className="bg-slate-800 text-gray-300 border border-slate-700 px-3 py-1 rounded text-xs font-semibold">로그아웃</button>
        </div>
      </div>
      {sidebarOpen&&<div onClick={()=>setSidebarOpen(false)} className="fixed inset-0 bg-black/40 z-[300]"/>}
      <div className={`fixed left-0 top-0 bottom-0 w-72 bg-white z-[400] transition-transform duration-300 overflow-y-auto shadow-xl ${sidebarOpen?"translate-x-0":"-translate-x-full"}`}>
        <div className="p-5">
          <div className="flex justify-between items-center">
            <div><div className="font-bold">⭐ 관리자 메뉴</div><div className="text-xs text-gray-400">{user.name}</div></div>
            <button onClick={()=>setSidebarOpen(false)} className="bg-red-50 w-8 h-8 rounded-full text-red-500 flex items-center justify-center text-sm">✕</button>
          </div>
        </div>
        <div className="px-3 pb-5">
          {[{id:"dashboard",icon:"🏠",label:"대시보드"},{id:"students",icon:"👨‍🎓",label:"학생 관리"}].map(m=>(
            <button key={m.id} onClick={()=>{setAdminTab(m.id);setSidebarOpen(false);}} className={`flex items-center gap-2 w-full px-3 py-3 rounded-lg text-sm font-bold mb-1 ${adminTab===m.id?"bg-blue-50 text-blue-600":"text-gray-600 hover:bg-gray-50"}`}>
              {m.icon} {m.label}
            </button>
          ))}
          {[
            {cat:"학생 및 소통",items:[{id:"approve",icon:"✅",label:"가입 승인"},{id:"info",icon:"✏️",label:"정보 수정"}]},
            {cat:"수업 및 성적",items:[{id:"schedule",icon:"📅",label:"수업/시험 일정"},{id:"grades",icon:"📊",label:"시험 성적"},{id:"report",icon:"📄",label:"수업 레포트"}]},
            {cat:"운영 관리",items:[{id:"ta",icon:"👤",label:"조교 근무"},{id:"sms",icon:"💬",label:"문자 발송"}]},
          ].map(g=>(
            <div key={g.cat} className="mt-3">
              <div className="text-[10px] font-bold text-gray-400 px-3 py-1 uppercase">{g.cat}</div>
              {g.items.map(it=>(
                <button key={it.id} onClick={()=>{setAdminTab(it.id);setSidebarOpen(false);}} className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-semibold ${adminTab===it.id?"bg-blue-50 text-blue-600":"text-gray-500 hover:bg-gray-50"}`}>
                  {it.icon} {it.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-5">
        {adminTab==="dashboard"&&<AdminDashboard students={students} classes={classes}/>}
        {adminTab==="students"&&<AdminStudents students={students} setStudents={setStudents} fetchStudents={fetchStudents}/>}
        {!["dashboard","students"].includes(adminTab)&&(
          <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
            <div className="text-4xl mb-3">🚧</div>
            <h3 className="font-bold text-lg">준비 중인 기능입니다</h3>
            <p className="text-sm text-gray-400 mt-1">이 기능은 곧 추가될 예정입니다</p>
          </div>
        )}
      </div>
      {!sidebarOpen&&(
        <button onClick={()=>setSidebarOpen(true)} className="fixed left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-amber-400 text-white text-lg shadow-lg flex items-center justify-center z-50">☰</button>
      )}
    </div>
  );
}
