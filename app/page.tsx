"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

const Icon=({type,size=20}:{type:string;size?:number})=>{const s:any={width:size,height:size,strokeWidth:1.5,fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round"};const i:any={folder:<svg viewBox="0 0 24 24" {...s}><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,test:<svg viewBox="0 0 24 24" {...s}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,settings:<svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09"/></svg>,logout:<svg viewBox="0 0 24 24" {...s}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,user:<svg viewBox="0 0 24 24" {...s}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,menu:<svg viewBox="0 0 24 24" {...s}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,close:<svg viewBox="0 0 24 24" {...s}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,left:<svg viewBox="0 0 24 24" {...s}><polyline points="15 18 9 12 15 6"/></svg>,right:<svg viewBox="0 0 24 24" {...s}><polyline points="9 18 15 12 9 6"/></svg>,upload:<svg viewBox="0 0 24 24" {...s}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,plus:<svg viewBox="0 0 24 24" {...s}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,back:<svg viewBox="0 0 24 24" {...s}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,users:<svg viewBox="0 0 24 24" {...s}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/></svg>,home:<svg viewBox="0 0 24 24" {...s}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,search:<svg viewBox="0 0 24 24" {...s}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,bell:<svg viewBox="0 0 24 24" {...s}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,cart:<svg viewBox="0 0 24 24" {...s}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>,msg:<svg viewBox="0 0 24 24" {...s}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,coin:<svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="10"/><path d="M12 6v12M8 10h8M8 14h8"/></svg>,play:<svg viewBox="0 0 24 24" {...s}><polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none"/></svg>};return i[type]||null;};
async function uploadImage(file:File,path:string){const ext=file.name.split(".").pop()||"jpg";const safePath=path.replace(/[^a-zA-Z0-9_-]/g,"_");const fn=`${safePath}_${Date.now()}.${ext}`;const{error}=await supabase.storage.from("images").upload(fn,file,{upsert:true,contentType:file.type});if(error){console.error("Upload error:",error);alert("이미지 업로드 실패: "+error.message);return null;}return supabase.storage.from("images").getPublicUrl(fn).data.publicUrl;}
async function sendNotif(userId:number,type:string,message:string){await supabase.from("notifications").insert({user_id:userId,type,message});}

/* ═══ LOGIN ═══ */
function LoginScreen({onLogin,settings}:{onLogin:(id:string,pw:string)=>Promise<string>;settings:any}){
  const[id,setId]=useState("");const[pw,setPw]=useState("");const[err,setErr]=useState("");const[ld,setLd]=useState(false);const[ready,setReady]=useState(false);
  const[reviews,setReviews]=useState<any[]>([]);
  useEffect(()=>{setTimeout(()=>setReady(true),100);(async()=>{const{data}=await supabase.from("reviews").select("*").eq("is_featured",true).order("created_at",{ascending:false}).limit(20);if(data){/* 성적향상 사례 우선 + 랜덤 셔플 */const shuffle=(a:any[])=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;};const up=shuffle(data.filter(r=>r.best_grade&&r.best_grade.trim()));const normal=shuffle(data.filter(r=>!r.best_grade||!r.best_grade.trim()));setReviews([...up,...normal]);}})();},[]);
  const go=async()=>{setLd(true);setErr(await onLogin(id,pw));setLd(false);};
  const bg=(settings.background_image&&settings.background_image.length>5)?settings.background_image:"/lecture-bg.jpg";
  const pi=settings.profile_image||"/profile.png";const nm=settings.profile_name||"서정인 수학";const bioLines=(settings.profile_bio||"").split(/[\\n\n]+/).filter(Boolean);
  return(<div className="min-h-screen relative flex flex-col overflow-y-auto overflow-x-hidden bg-[#faf9f7]">
    {/* 원본 배경 이미지 재적용 및 덜 흐릿하게 */}
    <div className="fixed inset-0 z-0 scale-105" style={{backgroundImage:`url(${bg})`,backgroundSize:"cover",backgroundPosition:"center",filter:"blur(3px)"}}/>
    <div className="fixed inset-0 z-0" style={{background:"linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(250,249,247,0.5) 100%)"}}/>
    <div className="fixed inset-0 z-0 opacity-20" style={{backgroundImage: "radial-gradient(#AA8C2C 0.5px, transparent 0.5px)", backgroundSize: "32px 32px"}} />

    <style>{`
      /* 최고급 명조체(Nanum Myeongjo) 추가 임포트 */
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Nanum+Myeongjo:wght@400;700;800&family=Noto+Sans+KR:wght@300;400;500;600&family=Montserrat:wght@300;400;500;600&display=swap');

      :root {
        --c-gold: #D4AF37;
        --c-gold-light: #F3E5AB;
        --c-gold-deep: #AA8C2C;
        --c-bg: #faf9f7;
        --font-sans: 'Noto Sans KR', 'Montserrat', sans-serif;
        --font-serif: 'Playfair Display', 'Nanum Myeongjo', serif;
      }

      body {
        margin: 0;
        font-family: var(--font-sans);
        background: var(--c-bg);
      }

      @keyframes shimmerSlide { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
      @keyframes floatAnim { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

      .shimmer-btn {
        background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.7) 50%, transparent 70%);
        background-size: 300% 100%;
        animation: shimmerSlide 5s ease-in-out infinite;
      }

      .btn-gold {
        background: linear-gradient(135deg, #DFBE52 0%, #D4AF37 50%, #B5952F 100%);
        color: #fff;
        box-shadow: 0 4px 18px rgba(212,175,55,0.3);
        transition: all 0.3s ease;
      }
      .btn-gold:hover {
        box-shadow: 0 8px 24px rgba(212,175,55,0.5);
        transform: translateY(-2px);
      }

      .glass-card, .glass-card-strong {
        position: relative;
        overflow: hidden;
      }
      .glass-card::after, .glass-card-strong::after {
        content: "";
        position: absolute;
        top: 0; left: -150%; width: 50%; height: 100%;
        background: linear-gradient(to right, transparent, rgba(255,255,255,0.9), transparent);
        transform: skewX(-25deg);
        animation: loginShimmerAnim 6s infinite cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
        z-index: 1;
      }
      @keyframes loginShimmerAnim {
        0% { left: -150%; opacity: 0; }
        15% { opacity: 1; }
        50% { left: 200%; opacity: 0; }
        100% { left: 200%; opacity: 0; }
      }
      .glass-card {
        background: linear-gradient(145deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%);
        backdrop-filter: blur(32px) saturate(200%);
        -webkit-backdrop-filter: blur(32px) saturate(200%);
        border: 1px solid rgba(255,255,255,1);
        box-shadow: 0 20px 60px rgba(0,0,0,0.08), inset 0 2px 5px rgba(255,255,255,1);
      }
      .glass-card-strong {
        background: linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.6) 100%);
        backdrop-filter: blur(48px) saturate(200%);
        -webkit-backdrop-filter: blur(48px) saturate(200%);
        border: 1px solid rgba(255,255,255,1);
        box-shadow: 0 30px 80px rgba(212,175,55,0.15), inset 0 2px 6px rgba(255,255,255,1);
      }

      .lux-input {
        background: rgba(255,255,255,0.9);
        border: 1px solid rgba(255,255,255,0.8);
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.03);
        transition: all 0.3s;
      }
      .lux-input:focus {
        border-color: #D4AF37 !important;
        background: #fff;
        box-shadow: 0 0 0 3px rgba(212,175,55,0.2), inset 0 2px 4px rgba(0,0,0,0.02) !important;
      }
    `}</style>
    {/* 골드 빛망울 포인트 */}
    <div className="absolute z-0 rounded-full pointer-events-none opacity-50 mix-blend-multiply" style={{width:"800px",height:"800px",top:"-10%",right:"-10%",background:"radial-gradient(circle,rgba(212,175,55,0.15) 0%,transparent 70%)",filter:"blur(80px)"}}/>
    <div className="absolute z-0 rounded-full pointer-events-none opacity-50 mix-blend-multiply" style={{width:"600px",height:"600px",bottom:"-15%",left:"-5%",background:"radial-gradient(circle,rgba(212,175,55,0.12) 0%,transparent 70%)",filter:"blur(80px)"}}/>

    {/* 메인 영역 */}
    <div className="flex flex-col items-center justify-start md:justify-center pt-12 md:pt-16 px-4 relative z-10 w-full flex-shrink-0">
      {/* PC */}
      <div className={`hidden md:flex w-full max-w-4xl gap-8 transition-all duration-1000 ${ready?"opacity-100 translate-y-0":"opacity-0 translate-y-12"}`}>
        <div className="w-[320px] flex-shrink-0 rounded-[36px] p-8 flex flex-col glass-card" style={{animation: "floatAnim 6s ease-in-out infinite"}}>
          <div className="text-center mb-6 relative z-10">
            <div className="relative inline-block mb-5">
              <img src={pi} alt="" className="w-[168px] h-[168px] rounded-full shadow-2xl object-cover transition-transform duration-500 hover:scale-105" style={{border:"4px solid rgba(212,175,55,0.8)", padding:"5px", background:"#fff", margin:"0 auto"}}/>
            </div>
            <h2 className="text-2xl mb-2" style={{fontFamily:"var(--font-serif)", fontWeight:800, color:"#111"}}>{nm}</h2>
            <div className="flex items-center justify-center gap-2 mb-4"><div className="h-px w-12" style={{background:"linear-gradient(90deg,transparent,#D4AF37,transparent)"}}/><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" style={{boxShadow:"0 0 8px rgba(212,175,55,0.8)"}}/><div className="h-px w-12" style={{background:"linear-gradient(90deg,transparent,#D4AF37,transparent)"}}/></div>
          </div>
          {bioLines.length>0&&<div className="text-[13px] leading-relaxed text-center px-4 text-[#444] relative z-10">
            {bioLines.map((line:string, i:number)=><span key={i} className="block">{line}</span>)}
          </div>}
          <div className="mt-auto pt-6 border-t text-center relative z-10" style={{borderColor:"rgba(212,175,55,0.3)"}}><p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#AA8C2C]">AGREESUH</p></div>
        </div>
        <div className="flex-1 rounded-[36px] p-10 flex flex-col justify-center glass-card-strong relative overflow-hidden">
          <div className="mb-8 pl-5 border-l-[3px] border-[#D4AF37]" style={{position: "relative", zIndex: 10}}>
            <p className="text-[11px] font-bold tracking-[0.25em] uppercase mb-3 text-[#AA8C2C]">AGREESUH</p>
            <h1 style={{fontFamily:"var(--font-serif)",fontSize:"2.4rem",lineHeight:1.4, letterSpacing:"-0.02em"}}>
              <span style={{color:"#444", fontWeight:400}}>흐릿한 시작을,</span><br/>
              <strong style={{background:"linear-gradient(135deg, #B5952F 0%, #D4AF37 50%, #AA8C2C 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent", fontWeight:800}}>뚜렷한 선택으로.</strong>
            </h1>
          </div>
          <div className="space-y-4 max-w-[360px] pl-5 relative z-10">
            <div><label className="text-[11px] font-bold tracking-widest uppercase mb-2 block text-[#555]">아이디</label><input className="lux-input w-full rounded-2xl px-5 py-3.5 text-sm outline-none text-[#222]" value={id} onChange={e=>{setId(e.target.value);setErr("");}} placeholder="예: 서정인1234 (이름+학부모번호뒷4자리)" onKeyDown={e=>e.key==="Enter"&&go()}/></div>
            <div><label className="text-[11px] font-bold tracking-widest uppercase mb-2 block text-[#555]">비밀번호</label><input type="password" className="lux-input w-full rounded-2xl px-5 py-3.5 text-sm outline-none text-[#222]" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} placeholder="학부모번호뒷4자리" onKeyDown={e=>e.key==="Enter"&&go()}/></div>
            {err&&<p className="text-xs px-3 py-2 rounded-xl text-red-500 bg-red-50 text-center">{err}</p>}
            <button onClick={go} disabled={ld} className="btn-gold w-full mt-4 py-4 rounded-2xl font-bold text-[13px] relative overflow-hidden disabled:opacity-70 uppercase tracking-[0.2em] shadow-lg"><span className="relative z-10 drop-shadow-md">{ld?"Authenticating...":"SIGN IN"}</span><span className="shimmer-btn absolute inset-0 pointer-events-none"/></button>
          </div>
        </div>
      </div>
      
      {/* 모바일 (완전한 중심 정렬의 애플 리퀴드 글래스 스타일) */}
      <div className={`md:hidden w-full max-w-sm transition-all duration-1000 ${ready?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}>
        <div className="rounded-[36px] p-6 glass-card-strong relative overflow-hidden flex flex-col items-center">
          
          <div className="text-center mt-2 mb-5 relative z-10 w-full">
            <div className="relative inline-block mb-4">
              <img src={pi} alt="" className="w-[100px] h-[100px] rounded-full object-cover transition-transform duration-500 hover:scale-105" style={{border:"3px solid rgba(212,175,55,0.8)", padding:"3px", background:"#fff", margin:"0 auto", boxShadow:"0 8px 24px rgba(212,175,55,0.2)"}}/>
            </div>
            <h2 className="text-[20px] mb-2" style={{fontFamily:"var(--font-serif)", fontWeight:800, color:"#111"}}>{nm}</h2>
            <div className="flex items-center justify-center gap-2 mb-3"><div className="h-px w-8" style={{background:"linear-gradient(90deg,transparent,#D4AF37,transparent)"}}/><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" style={{boxShadow:"0 0 8px rgba(212,175,55,0.8)"}}/><div className="h-px w-8" style={{background:"linear-gradient(90deg,transparent,#D4AF37,transparent)"}}/></div>
            {bioLines.length>0&&<div className="text-[12px] leading-relaxed text-[#555] font-medium px-4">
              {bioLines.map((line:string, i:number)=><span key={i} className="block">{line}</span>)}
            </div>}
          </div>

          <div className="text-center mb-6 relative z-10 w-full">
            <h1 style={{fontFamily:"var(--font-serif)",fontSize:"1.4rem",lineHeight:1.4,letterSpacing:"-0.02em",whiteSpace:"nowrap"}}>
              <span style={{fontWeight:300,color:"#aaa"}}>흐릿한 시작이, </span><strong style={{fontWeight:800,background:"linear-gradient(135deg,#B5952F 0%,#D4AF37 50%,#AA8C2C 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>확실한 실력으로.</strong>
            </h1>
            <p className="text-[8px] font-bold tracking-[0.25em] uppercase mt-2 text-[#AA8C2C]">AGREESUH</p>
          </div>

          <div className="w-full space-y-3 relative z-10 px-1">
            <input className="lux-input w-full rounded-2xl px-5 py-3.5 text-[13px] outline-none text-[#222] font-medium placeholder-[#888]" value={id} onChange={e=>{setId(e.target.value);setErr("");}} placeholder="예: 서정인1234 (이름+학부모번호뒷4자리)" onKeyDown={e=>e.key==="Enter"&&go()}/>
            <input type="password" className="lux-input w-full rounded-2xl px-5 py-3.5 text-[13px] outline-none text-[#222] font-medium placeholder-[#888]" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} placeholder="예: 1234 (학부모번호뒷4자리)" onKeyDown={e=>e.key==="Enter"&&go()}/>
          </div>
          {err&&<p className="w-full text-xs px-3 py-2 rounded-xl mt-3 text-red-500 bg-red-50 text-center relative z-10 mx-1">{err}</p>}
          <button onClick={go} disabled={ld} className="btn-gold w-full mt-5 py-4 rounded-2xl font-bold text-[13px] relative overflow-hidden disabled:opacity-70 tracking-[0.15em] shadow-lg relative z-10 mx-1"><span className="relative z-10 drop-shadow-md">{ld?"Authenticating...":"SIGN IN"}</span><span className="shimmer-btn absolute inset-0 pointer-events-none"/></button>
        </div>
      </div>
    </div>

    {/* 후기 슬라이더 */}
    {reviews.length>0&&<div className={`relative z-10 mt-6 md:mt-auto pb-8 pt-0 w-full transition-all duration-1000 ${ready?"opacity-100":"opacity-0"}`}>
      <p className="text-center text-[10px] font-bold tracking-[0.3em] uppercase mb-3 text-[#AA8C2C] opacity-90 drop-shadow-sm">Student Reviews</p>
      <div className="overflow-hidden">
        <div className="flex gap-3 review-scroll pl-4">
          {[...reviews,...reviews,...reviews].map((r:any,i:number)=>{const hasBestGrade=r.best_grade&&r.best_grade.trim();const animals=["🦊","🐶","🐱","🐰","🐦","🐯","🦁"];const animalIcon=animals[i%animals.length];return(<div key={i} className="w-[200px] flex-shrink-0 rounded-[22px] p-3.5 cursor-default transition-all duration-300 glass-card" style={{borderColor:hasBestGrade?"rgba(212,175,55,0.7)":"rgba(212,175,55,0.3)",boxShadow:hasBestGrade?"0 12px 40px rgba(212,175,55,0.15),inset 0 1px 0 rgba(255,255,255,1)":"0 8px 30px rgba(0,0,0,0.05)"}}>
            <div className="flex items-center gap-2 mb-2"><div className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] bg-white border border-[#D4AF37]/50 shadow-md">{animalIcon}</div><div><span className="text-[11.5px] font-bold text-[#111] block leading-none pb-0.5" style={{fontFamily:"var(--font-sans)"}}>{r.display_name||"학생"}</span><span className="text-[8px] text-[#888]">{r.display_school||""}</span></div>{!hasBestGrade&&<div className="ml-auto"><span className="text-[8px] px-1.5 py-0.5 rounded-md font-bold bg-[#faf9f7] text-[#666] border border-[#ddd]">수강생</span></div>}</div>
            {hasBestGrade&&<div className="mb-2"><span className="text-[8.5px] font-bold px-2 py-0.5 rounded-full text-white shadow-md inline-block tracking-wide" style={{background:"linear-gradient(135deg,#DFBE52,#AA8C2C)"}}>🏆 성적 향상 · {r.best_grade}</span></div>}
            {r.keywords&&<div className="flex flex-wrap gap-1 mb-2">{r.keywords.split(",").slice(0,3).map((kw:string,ki:number)=>(<span key={ki} className="text-[8px] font-bold px-1.5 py-0.5 rounded-md text-[#AA8C2C] bg-[#D4AF37]/10 border border-[#D4AF37]/25 mix-blend-multiply">#{kw}</span>))}</div>}
            <p className="text-[10px] leading-[1.5] review-clamp text-[#333] font-medium">{r.content}</p>
          </div>)})}
        </div>
      </div>
      <style>{`
        .review-scroll{animation:reviewScroll ${Math.max(reviews.length*8,30)}s linear infinite;}
        .review-scroll:hover{animation-play-state:paused;}
        @keyframes reviewScroll{0%{transform:translateX(0)}100%{transform:translateX(calc(-212px * ${reviews.length}))}}
        .review-clamp{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}
      `}</style>
    </div>}
  </div>);
}

/* ═══ STUDENT VIEW ═══ */
const dayNames=["일","월","화","수","목","금","토"];
function fmtDate(d:string){try{const dt=new Date(d+"T00:00:00");return`${d} (${dayNames[dt.getDay()]})`;}catch{return d;}}

function StudentView({user,logout}:{user:any;logout:()=>void}){
  const[_tab,_setTab]=useState("grades");const setTab=(t:string)=>{_setTab(t);window.scrollTo(0,0);};const tab=_tab;const[tests,setTests]=useState<any[]>([]);const[idx,setIdx]=useState(0);const[questions,setQuestions]=useState<any[]>([]);const[results,setResults]=useState<any[]>([]);const[info,setInfo]=useState<any>(null);const[mm,setMm]=useState(false);const[pw,setPw]=useState({n1:"",n2:""});const[pwMsg,setPwMsg]=useState("");
  const[rankHistory,setRankHistory]=useState<{date:string;rank:number;total:number}[]>([]);
  const[calTests,setCalTests]=useState<any[]>([]);
  const[calMonth,setCalMonth]=useState(()=>{const n=new Date();return{y:n.getFullYear(),m:n.getMonth()};});
  const[topWrong,setTopWrong]=useState<any[]>([]);
  const[showConfetti,setShowConfetti]=useState(false);
  const confettiRef=useRef<HTMLCanvasElement>(null);
  const prevTabRef=useRef<string>("");
  const currentTestRef=useRef<any>(null);
  // confetti 실행 함수
  const fireConfetti=()=>{
    setShowConfetti(true);
    setTimeout(()=>{
      const canvas=confettiRef.current;if(!canvas)return;
      canvas.width=window.innerWidth;canvas.height=window.innerHeight;
      const ctx=canvas.getContext("2d");if(!ctx)return;
      const pieces:any[]=[];
      const colors=["#D4AF37","#FFE566","#FF6B6B","#4ECDC4","#A78BFA","#F97316","#34D399","#60A5FA","#F472B6"];
      for(let i=0;i<160;i++){pieces.push({x:Math.random()*canvas.width,y:-20-Math.random()*200,w:6+Math.random()*8,h:10+Math.random()*12,r:Math.random()*Math.PI*2,dr:0.1+Math.random()*0.3,dx:(Math.random()-0.5)*3,dy:2+Math.random()*4,color:colors[Math.floor(Math.random()*colors.length)],alpha:1});}
      let frame=0;
      const draw=()=>{
        ctx.clearRect(0,0,canvas.width,canvas.height);
        pieces.forEach(p=>{
          ctx.save();ctx.globalAlpha=p.alpha;ctx.translate(p.x+p.w/2,p.y+p.h/2);ctx.rotate(p.r);
          ctx.fillStyle=p.color;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore();
          p.x+=p.dx;p.y+=p.dy;p.r+=p.dr;p.dy+=0.05;
          if(frame>60)p.alpha=Math.max(0,p.alpha-0.015);
        });
        frame++;
        if(frame<160)requestAnimationFrame(draw);else setShowConfetti(false);
      };
      requestAnimationFrame(draw);
    },50);
  };
  const[notifs,setNotifs]=useState<any[]>([]);const[showNotif,setShowNotif]=useState(false);
  const unreadCount=notifs.filter(n=>!n.is_read).length;
  const fNotifs=async()=>{const{data}=await supabase.from("notifications").select("*").eq("user_id",user.id).order("created_at",{ascending:false}).limit(30);if(data){const prev=notifs;setNotifs(data);const hasNewGrade=data.some((n:any)=>!n.is_read&&n.type==="grade");const hadNewGrade=prev.some((n:any)=>!n.is_read&&n.type==="grade");if(hasNewGrade&&!hadNewGrade&&currentTestRef.current){ld(currentTestRef.current);}}};

  const markAllRead=async()=>{await supabase.from("notifications").update({is_read:true}).eq("user_id",user.id).eq("is_read",false);fNotifs();};
  useEffect(()=>{fNotifs();},[]);
  // 30초마다 현재 시험 정답률 재조회 → 최다오답 항상 최신 유지
  useEffect(()=>{
    const timer=setInterval(()=>{if(currentTestRef.current)ld(currentTestRef.current);},30000);
    return()=>clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  // 등수 향상 시 confetti (퍼센타일 기준, 5% 초과 상승)
  useEffect(()=>{
    if(rankHistory.length>=2){
      const last=rankHistory[rankHistory.length-1];
      const prev=rankHistory[rankHistory.length-2];
      const lastPct=last.total<=1?50:Math.round(((last.total-last.rank)/(last.total-1))*100);
      const prevPct=prev.total<=1?50:Math.round(((prev.total-prev.rank)/(prev.total-1))*100);
      if(lastPct-prevPct>5){fireConfetti();}
    }
  },[rankHistory]);
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
    // 공지사항 초기 로드 (N 뱃지용)
    const{data:noticeData}=await supabase.from("class_notices").select("*, class_groups(name)").in("class_group_id",gids).order("created_at",{ascending:false});
    if(noticeData)setNotices(noticeData);
  })();},[]);
  const ld=async(t:any)=>{
    currentTestRef.current=t;
    const sid=user.id;
    const[q,r,si]=await Promise.all([
      supabase.from("test_questions").select("*").eq("test_id",t.id).order("question_number"),
      supabase.from("test_results").select("*").eq("test_id",t.id).eq("student_id",sid),
      supabase.from("test_student_info").select("*").eq("test_id",t.id).eq("student_id",sid).single()
    ]);
    if(q.data)setQuestions(q.data);
    if(r.data){
      setResults(r.data);
      // 학생이 틀린 문제 번호 추출
      const wrongNums=r.data.filter((x:any)=>!x.is_correct).map((x:any)=>x.question_number);
      if(wrongNums.length>0&&q.data){
        // DB에서 정답률 낮은 순으로 정렬 → 학생이 틀린 것만 필터 → TOP3
        const sorted=[...q.data]
          .filter((x:any)=>wrongNums.includes(x.question_number))
          .sort((a:any,b:any)=>(a.correct_rate||0)-(b.correct_rate||0));
        setTopWrong(sorted.slice(0,3));
      } else {
        setTopWrong([]);
      }
    }
    setInfo(si.data||null);
  };
  // 성적표 탭 진입 시 현재 시험 재로드 → 최다오답 최신화
  useEffect(()=>{
    if(tab==="grades"&&prevTabRef.current!=="grades"&&currentTestRef.current){
      ld(currentTestRef.current);
    }
    prevTabRef.current=tab;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[tab]);
  const nav=(d:number)=>{const n=idx+d;if(n>=0&&n<tests.length){setIdx(n);ld(tests[n]);}};
  const chPw=async()=>{if(pw.n1!==pw.n2){setPwMsg("불일치");return;}await supabase.from("users").update({password:pw.n1}).eq("id",user.id);setPwMsg("변경 완료!");setPw({n1:"",n2:""});};
  const[notices,setNotices]=useState<any[]>([]);
  const[myExams,setMyExams]=useState<any[]>([]);const[showExamAdd,setShowExamAdd]=useState(false);
  const[examForm,setExamForm]=useState({exam_type:"모의고사",exam_name:"",subject:"",score:"",total:"",grade:"",memo:"",exam_date:"",q1:"",q2:"",q3:"",kor_score:"",kor_grade:"",math_score:"",math_grade:"",eng_score:"",eng_grade:"",sci_score:"",sci_grade:"",soc_score:"",soc_grade:""});
  const[inquiries,setInquiries]=useState<any[]>([]);const[showInqAdd,setShowInqAdd]=useState(false);const[inqForm,setInqForm]=useState({title:"",content:""});const[inqImg,setInqImg]=useState<File|null>(null);const inqImgRef=useRef<HTMLInputElement>(null);
  const[shopItems,setShopItems]=useState<any[]>([]);const[myTokens,setMyTokens]=useState(user.tokens||0);const[purchases,setPurchases]=useState<any[]>([]);
  const[myReview,setMyReview]=useState<any>(null);const[showReviewForm,setShowReviewForm]=useState(false);const[reviewForm,setReviewForm]=useState({best_grade:"",kw1:"",kw2:"",kw3:"",content:""});
  const kwOptions=["흥미유발","관리","발문해석","좋은자료","기발한풀이","이해가잘되는해설","친근함","열정","소통","꼼꼼함"];
  const fTokens=async()=>{const{data}=await supabase.from("users").select("tokens").eq("id",user.id).single();if(data)setMyTokens(data.tokens||0);};
  useEffect(()=>{if(tab==="calendar"){(async()=>{const{data:cm}=await supabase.from("class_members").select("class_group_id").eq("user_id",user.id);const gids=cm?cm.map((c:any)=>c.class_group_id):[];// 공통(class_group_id=null) + 내 반 일정
      const{data:common}=await supabase.from("calendar_events").select("*").is("class_group_id",null).order("date",{ascending:true});const{data:mine}=gids.length>0?await supabase.from("calendar_events").select("*").in("class_group_id",gids).order("date",{ascending:true}):{data:[]};const merged=[...(common||[]),...(mine||[])].sort((a,b)=>a.date.localeCompare(b.date));setCalTests(merged);})();}
    if(tab==="notice"){(async()=>{
    const{data:cm}=await supabase.from("class_members").select("class_group_id").eq("user_id",user.id);
    if(!cm||cm.length===0)return;
    const gids=cm.map((c:any)=>c.class_group_id);
    const{data}=await supabase.from("class_notices").select("*, class_groups(name)").in("class_group_id",gids).order("created_at",{ascending:false});
    if(data)setNotices(data);
  })();}if(tab==="myexam"){(async()=>{const{data}=await supabase.from("student_exams").select("*").eq("user_id",user.id).order("exam_date",{ascending:false});if(data)setMyExams(data);})();}if(tab==="inquiry"){(async()=>{const{data}=await supabase.from("inquiries").select("*").eq("user_id",user.id).order("created_at",{ascending:false});if(data)setInquiries(data);})();}if(tab==="shop"){(async()=>{const{data}=await supabase.from("shop_items").select("*").eq("active",true).order("created_at");if(data)setShopItems(data);const{data:p}=await supabase.from("purchases").select("*, shop_items(name)").eq("user_id",user.id).order("created_at",{ascending:false});if(p)setPurchases(p);fTokens();})();}if(tab==="review"){(async()=>{const{data}=await supabase.from("reviews").select("*").eq("user_id",user.id).single();if(data){setMyReview(data);const kws=data.keywords?data.keywords.split(","):[];setReviewForm({best_grade:data.best_grade||"",kw1:kws[0]||"",kw2:kws[1]||"",kw3:kws[2]||"",content:data.content||""});}else{setMyReview(null);setReviewForm({best_grade:"",kw1:"",kw2:"",kw3:"",content:""});}})();}},[tab]);
  const addExam=async()=>{
    const isM=examForm.exam_type==="모의고사";
    if(isM&&!examForm.math_score)return;if(!isM&&!examForm.score)return;
    const subjects=isM?JSON.stringify({국어:{score:examForm.kor_score,grade:examForm.kor_grade},수학:{score:examForm.math_score,grade:examForm.math_grade},영어:{score:examForm.eng_score,grade:examForm.eng_grade},과학:{score:examForm.sci_score,grade:examForm.sci_grade},사회:{score:examForm.soc_score,grade:examForm.soc_grade}}):"";
    const payload={user_id:user.id,exam_type:examForm.exam_type,exam_name:examForm.exam_name,subject:isM?"전과목":"수학",score:isM?examForm.math_score:examForm.score,total:isM?subjects:"",grade:isM?examForm.math_grade:examForm.grade,memo:JSON.stringify({q1:examForm.q1,q2:examForm.q2,q3:examForm.q3}),exam_date:""};
    await supabase.from("student_exams").insert(payload);
    setExamForm({exam_type:examForm.exam_type,exam_name:"",subject:"",score:"",total:"",grade:"",memo:"",exam_date:"",q1:"",q2:"",q3:"",kor_score:"",kor_grade:"",math_score:"",math_grade:"",eng_score:"",eng_grade:"",sci_score:"",sci_grade:"",soc_score:"",soc_grade:""});
    const{data}=await supabase.from("student_exams").select("*").eq("user_id",user.id).order("created_at",{ascending:false});if(data)setMyExams(data);
  };
  const delExam=async(id:number)=>{if(!confirm("삭제?"))return;await supabase.from("student_exams").delete().eq("id",id);const{data}=await supabase.from("student_exams").select("*").eq("user_id",user.id).order("created_at",{ascending:false});if(data)setMyExams(data);};
  const[editExamId,setEditExamId]=useState<number|null>(null);const[editExamForm,setEditExamForm]=useState({exam_type:"모의고사",exam_name:"",score:"",grade:"",q1:"",q2:"",q3:"",kor_score:"",kor_grade:"",math_score:"",math_grade:"",eng_score:"",eng_grade:"",sci_score:"",sci_grade:"",soc_score:"",soc_grade:""});
  const startEditExam=(ex:any)=>{let memoObj:any={};try{memoObj=JSON.parse(ex.memo||"{}");}catch{}let subjects:any={};try{if(ex.total&&ex.total.startsWith("{"))subjects=JSON.parse(ex.total);}catch{}setEditExamId(ex.id);setEditExamForm({exam_type:ex.exam_type||"모의고사",exam_name:ex.exam_name||"",score:ex.score||"",grade:ex.grade||"",q1:memoObj.q1||"",q2:memoObj.q2||"",q3:memoObj.q3||"",kor_score:subjects["국어"]?.score||"",kor_grade:subjects["국어"]?.grade||"",math_score:subjects["수학"]?.score||ex.score||"",math_grade:subjects["수학"]?.grade||ex.grade||"",eng_score:subjects["영어"]?.score||"",eng_grade:subjects["영어"]?.grade||"",sci_score:subjects["과학"]?.score||"",sci_grade:subjects["과학"]?.grade||"",soc_score:subjects["사회"]?.score||"",soc_grade:subjects["사회"]?.grade||""});};
  const saveEditExam=async()=>{if(!editExamId)return;const isM=editExamForm.exam_type==="모의고사";const subjects=isM?JSON.stringify({국어:{score:editExamForm.kor_score,grade:editExamForm.kor_grade},수학:{score:editExamForm.math_score,grade:editExamForm.math_grade},영어:{score:editExamForm.eng_score,grade:editExamForm.eng_grade},과학:{score:editExamForm.sci_score,grade:editExamForm.sci_grade},사회:{score:editExamForm.soc_score,grade:editExamForm.soc_grade}}):"";const payload={exam_type:editExamForm.exam_type,exam_name:editExamForm.exam_name,subject:isM?"전과목":"수학",score:isM?editExamForm.math_score:editExamForm.score,total:isM?subjects:"",grade:isM?editExamForm.math_grade:editExamForm.grade,memo:JSON.stringify({q1:editExamForm.q1,q2:editExamForm.q2,q3:editExamForm.q3})};await supabase.from("student_exams").update(payload).eq("id",editExamId);setEditExamId(null);const{data}=await supabase.from("student_exams").select("*").eq("user_id",user.id).order("created_at",{ascending:false});if(data)setMyExams(data);};
  const addInquiry=async()=>{if(!inqForm.content)return;let imgUrl="";if(inqImg){imgUrl=await uploadImage(inqImg,`inquiry_${user.id}`)||"";}await supabase.from("inquiries").insert({user_id:user.id,title:inqForm.title,content:inqForm.content+(imgUrl?`\n[IMG]${imgUrl}[/IMG]`:"")});setInqForm({title:"",content:""});setInqImg(null);setShowInqAdd(false);const{data}=await supabase.from("inquiries").select("*").eq("user_id",user.id).order("created_at",{ascending:false});if(data)setInquiries(data);};
  const buyItem=async(item:any)=>{if(myTokens<item.price){alert("서서갈비가 부족합니다!");return;}if(!confirm(`${item.name}을(를) ${item.price} 서서갈비로 구매할까요?`))return;await supabase.from("users").update({tokens:myTokens-item.price}).eq("id",user.id);await supabase.from("purchases").insert({user_id:user.id,item_id:item.id,price:item.price});await supabase.from("token_logs").insert({user_id:user.id,amount:-item.price,reason:`상점 구매: ${item.name}`});fTokens();const{data:p}=await supabase.from("purchases").select("*, shop_items(name)").eq("user_id",user.id).order("created_at",{ascending:false});if(p)setPurchases(p);};
  const saveReview=async()=>{if(!reviewForm.content)return;const kws=[reviewForm.kw1,reviewForm.kw2,reviewForm.kw3].filter(Boolean);const payload={user_id:user.id,best_grade:reviewForm.best_grade,keywords:kws.join(","),content:reviewForm.content};if(myReview){await supabase.from("reviews").update(payload).eq("id",myReview.id);}else{await supabase.from("reviews").insert(payload);}const{data}=await supabase.from("reviews").select("*").eq("user_id",user.id).single();if(data)setMyReview(data);setShowReviewForm(false);alert("후기가 저장되었습니다!");};
  const deleteReview=async()=>{if(!myReview)return;if(!confirm("후기를 삭제할까요?"))return;await supabase.from("reviews").delete().eq("id",myReview.id);setMyReview(null);setReviewForm({best_grade:"",kw1:"",kw2:"",kw3:"",content:""});setShowReviewForm(false);};
  const deleteInquiry=async(id:number)=>{if(!confirm("문의를 삭제할까요?"))return;await supabase.from("inquiries").delete().eq("id",id);const{data}=await supabase.from("inquiries").select("*").eq("user_id",user.id).order("created_at",{ascending:false});if(data)setInquiries(data);};
  const[editInqId,setEditInqId]=useState<number|null>(null);const[editInqForm,setEditInqForm]=useState({title:"",content:""});
  const[editInqImg,setEditInqImg]=useState<File|null>(null);const[editInqKeepImg,setEditInqKeepImg]=useState(true);const editInqImgRef=useRef<HTMLInputElement>(null);
  const startEditInq=(q:any)=>{const clean=q.content?.replace(/\[IMG\].*?\[\/IMG\]/g,"").trim()||"";setEditInqId(q.id);setEditInqForm({title:q.title||"",content:clean});setEditInqImg(null);setEditInqKeepImg(true);};
  const saveEditInq=async()=>{if(!editInqId||!editInqForm.content)return;let imgUrl="";if(editInqImg){imgUrl=await uploadImage(editInqImg,`inquiry_edit_${editInqId}`)||"";}const orig=inquiries.find((q:any)=>q.id===editInqId);const oldImgMatch=orig?.content?.match(/\[IMG\](.*?)\[\/IMG\]/);let imgPart="";if(imgUrl)imgPart=`\n[IMG]${imgUrl}[/IMG]`;else if(editInqKeepImg&&oldImgMatch)imgPart=`\n[IMG]${oldImgMatch[1]}[/IMG]`;await supabase.from("inquiries").update({title:editInqForm.title,content:editInqForm.content+imgPart}).eq("id",editInqId);setEditInqId(null);setEditInqImg(null);const{data}=await supabase.from("inquiries").select("*").eq("user_id",user.id).order("created_at",{ascending:false});if(data)setInquiries(data);};
  const test=tests[idx];const rm:any={};results.forEach((r:any)=>{rm[r.question_number]=r.is_correct;});
  const mis=[{id:"grades",icon:"test",label:"성적표"},{id:"calendar",icon:"home",label:"캘린더"},{id:"notice",icon:"bell",label:"공지사항"},{id:"inquiry",icon:"msg",label:"문의사항"},{id:"shorts",icon:"play",label:"서정인T 쇼츠"},{id:"shop",icon:"cart",label:"상점"}];
  return(<div className="min-h-screen flex" style={{background:"linear-gradient(135deg,#faf9f7 0%,#ffffff 40%,#fdfbf6 100%)",fontFamily:"var(--font-sans)"}}>
    <style>{`
      .ios-glass-card {
        /* 투명한 리퀴드 글라스 배경 */
        background: linear-gradient(
          145deg,
          rgba(255,255,255,0.62) 0%,
          rgba(255,255,255,0.35) 50%,
          rgba(255,255,255,0.55) 100%
        );
        backdrop-filter: blur(36px) saturate(200%) brightness(1.04);
        -webkit-backdrop-filter: blur(36px) saturate(200%) brightness(1.04);
        border-radius: 22px;
        position: relative;
        overflow: hidden;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        /* 골드 테두리 + 내부 하이라이트 */
        border: 1px solid rgba(212,175,55,0.55);
        box-shadow:
          0 0 0 1px rgba(255,255,255,0.55),
          0 8px 32px rgba(212,175,55,0.10),
          0 2px 8px rgba(0,0,0,0.04),
          inset 0 1px 0 rgba(255,255,255,0.88),
          inset 0 -1px 0 rgba(212,175,55,0.12);
      }
      .ios-glass-card:hover {
        transform: translateY(-2px);
        border-color: rgba(212,175,55,0.8);
        box-shadow:
          0 0 0 1px rgba(255,255,255,0.7),
          0 16px 48px rgba(212,175,55,0.16),
          0 4px 12px rgba(0,0,0,0.06),
          inset 0 1px 0 rgba(255,255,255,0.95),
          inset 0 -1px 0 rgba(212,175,55,0.18);
      }
      /* 상단 유리 하이라이트 */
      .ios-glass-card::before {
        content: "";
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 45%;
        background: linear-gradient(180deg,
          rgba(255,255,255,0.5) 0%,
          rgba(255,255,255,0) 100%);
        border-radius: 22px 22px 0 0;
        pointer-events: none;
        z-index: 1;
      }
      /* 빛 쉬머 */
      .ios-glass-card::after {
        content: "";
        position: absolute;
        top: 0; left: -150%; width: 45%; height: 100%;
        background: linear-gradient(to right,
          transparent,
          rgba(255,255,255,0.65),
          transparent);
        transform: skewX(-20deg);
        animation: iosShimmerAnim 7s infinite cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
        z-index: 2;
      }
      @keyframes iosShimmerAnim {
        0%   { left: -150%; opacity: 0; }
        10%  { opacity: 1; }
        45%  { left: 200%; opacity: 0; }
        100% { left: 200%; opacity: 0; }
      }
      .grade-label {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: #AA8C2C;
        text-shadow: 0 1px 4px rgba(212,175,55,0.3);
        margin-bottom: 5px;
      }
      @media (min-width: 640px) {
        .grade-label { font-size: 11px; letter-spacing: 0.12em; margin-bottom: 6px; }
      }
      .grade-value-sm {
        font-size: 15px;
        font-weight: 700;
        letter-spacing: -0.01em;
        color: #1e293b;
        line-height: 1.3;
        word-break: keep-all;
      }
      .grade-value {
        font-size: 15px;
        font-weight: 700;
        letter-spacing: -0.01em;
        color: #1e293b;
        line-height: 1.2;
        word-break: keep-all;
        overflow-wrap: break-word;
      }
      @media (min-width: 640px) {
        .grade-value { font-size: 15px; }
        .grade-value-sm { font-size: 15px; }
      }
      @media (min-width: 1024px) {
        .grade-value { font-size: 15px; }
        .grade-value-sm { font-size: 15px; }
      }
      .grade-stat {
        font-size: 15px;
        font-weight: 700;
        letter-spacing: -0.01em;
        color: #1e293b;
        line-height: 1.2;
      }
      .shimmer-action-btn {
        background: linear-gradient(135deg, #DFBE52 0%, #D4AF37 50%, #B5952F 100%);
        box-shadow: 0 4px 14px rgba(212,175,55,0.35);
        transition: all 0.2s ease;
      }
      .shimmer-action-btn:hover {
        box-shadow: 0 6px 20px rgba(212,175,55,0.5);
        transform: translateY(-1px);
      }
    `}</style>
    {/* 🎉 Confetti Canvas */}
    {showConfetti&&<canvas ref={confettiRef} className="fixed inset-0 pointer-events-none z-[9999]" style={{width:"100%",height:"100%"}}/>}
    <aside className="hidden lg:flex flex-col w-64 min-h-screen p-3 fixed left-0 top-0 bottom-0 z-40">
      <div className="flex-1 rounded-3xl p-5 flex flex-col m-2 border" style={{background:"rgba(255,255,255,0.92)",backdropFilter:"blur(32px)",WebkitBackdropFilter:"blur(32px)",border:"1px solid rgba(212,175,55,0.08)",boxShadow:"var(--c-shadow-card)"}}>
        <div className="flex items-center justify-between mb-6 px-1"><div className="rounded-2xl px-3 py-1.5" style={{background:"rgba(212,175,55,0.15)"}}><img src="/logo.png" alt="" className="h-5 object-contain opacity-70"/></div><button onClick={()=>{setShowNotif(!showNotif);if(!showNotif)markAllRead();}} className="relative p-1.5 rounded-xl transition-all" style={{color:"var(--c-gold)"}}><Icon type="bell" size={18}/>{unreadCount>0&&<span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{unreadCount}</span>}</button></div>
        <div className="px-2 mb-4 flex items-center gap-2"><span className="text-sm">🔥</span><span className="text-[11px] font-semibold" style={{color:"var(--c-gold)",fontWeight:600}}>{myTokens} 서서갈비</span><div className="ml-auto h-px flex-1" style={{background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.15),transparent)"}}/></div>
        <nav className="flex-1 space-y-0.5">{mis.map(m=>(<button key={m.id} onClick={()=>setTab(m.id)} className={`luxury-nav-btn flex items-center gap-3 w-full px-3.5 py-2.5 rounded-2xl text-sm font-medium ${tab===m.id?"active":"text-slate-500"}`}><span className="shimmer-nav"/><Icon type={m.icon} size={18}/>{m.label}</button>))}</nav>
        <div className="pt-4 mt-4" style={{borderTop:"1px solid rgba(212,175,55,0.08)"}}><div className="px-1 mb-3"><p className="text-xs font-semibold" style={{color:"var(--c-text-primary)",fontWeight:600}}>{user.name}</p><p className="text-[10px]" style={{color:"var(--c-text-muted)",letterSpacing:"0.02em"}}>{user.school||""}</p></div><button onClick={()=>setTab("review")} className={`luxury-nav-btn flex items-center gap-2 w-full px-3 py-2 rounded-2xl text-sm transition-colors ${tab==="review"?"active":"text-slate-500"}`}><Icon type="msg" size={16}/>후기 작성</button><button onClick={()=>setTab("myexam")} className={`luxury-nav-btn flex items-center gap-2 w-full px-3 py-2 rounded-2xl text-sm transition-colors ${tab==="myexam"?"active":"text-slate-500"}`}><Icon type="folder" size={16}/>시험결과 작성</button><button onClick={()=>setTab("changepw")} className="luxury-nav-btn flex items-center gap-2 w-full px-3 py-2 rounded-2xl text-sm transition-colors" style={{color:"var(--c-text-secondary)"}}><Icon type="settings" size={16}/>비밀번호 변경</button><button onClick={logout} className="luxury-nav-btn flex items-center gap-2 w-full px-3 py-2 rounded-2xl text-sm transition-colors" style={{color:"rgba(200,80,80,0.7)"}}><Icon type="logout" size={16}/>로그아웃</button></div>
      </div>
    </aside>
    <div className="lux-topbar lg:hidden fixed top-0 left-0 right-0 z-40 px-4 py-3 flex justify-between items-center"><button onClick={()=>setMm(!mm)} className="p-1 rounded-xl transition-colors" style={{color:"var(--c-text-primary)"}}><Icon type={mm?"close":"menu"} size={22}/></button><div className="flex items-center gap-2"><div className="flex items-center gap-1 px-2.5 py-1 rounded-xl" style={{background:"rgba(212,175,55,0.12)"}}><span style={{fontSize:"13px",lineHeight:1}}>🔥</span><span className="text-[11px] font-bold" style={{color:"var(--c-gold)",fontFamily:"'Montserrat',sans-serif",fontWeight:700}}>{myTokens} 서서갈비</span></div><span className="text-[11px] font-semibold" style={{color:"var(--c-text-primary)",fontFamily:"'Montserrat',sans-serif",fontWeight:600}}>{user.name}</span><button onClick={()=>{setShowNotif(!showNotif);if(!showNotif)markAllRead();}} className="relative p-1.5 rounded-xl transition-colors" style={{color:"var(--c-gold)"}}><Icon type="bell" size={18}/>{unreadCount>0&&<span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{unreadCount}</span>}</button></div></div>
    {mm&&<><div onClick={()=>setMm(false)} className="lg:hidden fixed inset-0 z-40" style={{background:"rgba(10,8,20,0.4)",backdropFilter:"blur(4px)"}}/><div className="lg:hidden fixed left-0 top-2 bottom-2 w-64 z-50 rounded-r-3xl p-5 flex flex-col" style={{background:"rgba(250,249,255,0.98)",backdropFilter:"blur(32px)",WebkitBackdropFilter:"blur(32px)",boxShadow:"8px 0 40px rgba(212,175,55,0.1)",borderRight:"1px solid rgba(212,175,55,0.08)"}}><div className="flex justify-between items-center mb-6"><span className="font-semibold" style={{fontFamily:"'Playfair Display',serif"}}>메뉴</span><button onClick={()=>setMm(false)}><Icon type="close" size={20}/></button></div><nav className="flex-1 space-y-0.5">{mis.map(m=>(<button key={m.id} onClick={()=>{setTab(m.id);setMm(false);}} className={`luxury-nav-btn flex items-center gap-3 w-full px-3.5 py-2.5 rounded-2xl text-sm font-medium ${tab===m.id?"active":"text-slate-500"}`}><span className="shimmer-nav"/><Icon type={m.icon} size={18}/>{m.label}</button>))}</nav><div className="pt-3 mt-2 space-y-0.5" style={{borderTop:"1px solid rgba(212,175,55,0.08)"}}><button onClick={()=>{setTab("review");setMm(false);}} className={`luxury-nav-btn flex items-center gap-2 w-full px-3 py-2.5 rounded-2xl text-sm ${tab==="review"?"active":"text-slate-500"}`}><Icon type="msg" size={16}/>후기 작성</button><button onClick={()=>{setTab("myexam");setMm(false);}} className={`luxury-nav-btn flex items-center gap-2 w-full px-3 py-2.5 rounded-2xl text-sm ${tab==="myexam"?"active":"text-slate-500"}`}><Icon type="folder" size={16}/>시험결과 작성</button><button onClick={()=>{setTab("changepw");setMm(false);}} className="luxury-nav-btn flex items-center gap-2 w-full px-3 py-2.5 rounded-2xl text-sm" style={{color:"var(--c-text-secondary)"}}><Icon type="settings" size={16}/>비밀번호 변경</button><button onClick={()=>{logout();setMm(false);}} className="luxury-nav-btn flex items-center gap-2 w-full px-3 py-2.5 rounded-2xl text-sm mt-1" style={{color:"rgba(200,80,80,0.7)"}}><Icon type="logout" size={16}/>로그아웃</button></div></div></>}
    {/* 알림 패널 */}
    {showNotif&&<><div onClick={()=>setShowNotif(false)} className="fixed inset-0 z-40" style={{background:"rgba(10,8,20,0.15)",backdropFilter:"blur(2px)"}}/><div className="fixed right-2 top-14 lg:left-14 lg:top-4 lg:right-auto w-80 max-h-[70vh] z-50 overflow-hidden rounded-2xl border" style={{background:"rgba(250,249,255,0.98)",backdropFilter:"blur(32px)",WebkitBackdropFilter:"blur(32px)",border:"1px solid rgba(212,175,55,0.1)",boxShadow:"0 12px 40px rgba(212,175,55,0.12),0 2px 8px rgba(212,175,55,0.06)"}}><div className="flex items-center justify-between px-4 py-3" style={{borderBottom:"1px solid rgba(212,175,55,0.1)",background:"linear-gradient(135deg,rgba(212,175,55,0.03),rgba(212,175,55,0.02))"}}><h3 className="font-semibold text-sm" style={{fontFamily:"'Playfair Display',serif",color:"#1a1628"}}>🔔 알림</h3><button onClick={()=>setShowNotif(false)} className="transition-colors" style={{color:"rgba(130,120,150,0.6)"}}><Icon type="close" size={16}/></button></div><div className="overflow-y-auto max-h-[60vh]">{notifs.length>0?notifs.map((n:any)=>(<div key={n.id} className="px-4 py-3" style={{borderBottom:"1px solid rgba(212,175,55,0.06)",background:n.is_read?"transparent":"rgba(212,175,55,0.03)"}}><div className="flex items-start gap-2"><div className="flex-1"><p className="text-sm" style={{color:"#1a1628",fontFamily:"'Montserrat',sans-serif"}}>{n.message}</p><p className="text-[10px] mt-0.5" style={{color:"rgba(130,120,150,0.6)",fontFamily:"'Montserrat',sans-serif"}}>{n.created_at?.slice(0,10)} {n.created_at?.slice(11,16)}</p></div>{!n.is_read&&<span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{background:"var(--c-gold)"}}/>}</div></div>)):<div className="p-8 text-center text-sm" style={{color:"rgba(130,120,150,0.5)",fontFamily:"'Montserrat',sans-serif"}}>알림이 없습니다</div>}</div></div></>}
    <main className="flex-1 lg:ml-64 pt-14 lg:pt-0"><div className="max-w-3xl mx-auto p-4 sm:p-5 lg:p-8">
      {tab==="grades"&&<div>{test?<><div className="flex items-center justify-between mb-2"><button onClick={()=>nav(1)} className="p-2 hover:bg-slate-100 rounded-xl"><Icon type="left" size={20}/></button><div className="text-center"><p className="text-xl font-bold">{fmtDate(test.date)}</p></div><div className="flex items-center gap-1"><button onClick={()=>nav(-1)} className={`p-2 rounded-xl ${idx===0?"text-slate-200":"hover:bg-slate-100"}`} disabled={idx===0}><Icon type="right" size={20}/></button></div></div>
        {/* 학생 정보 + 공유 */}
        <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><span className="text-xs text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-lg font-semibold">{test.class_name||""}</span><span className="text-sm font-semibold text-slate-700">{user.school||""} {user.name}</span></div><button onClick={async()=>{try{if(navigator.share){await navigator.share({title:`${user.name} 성적표 - ${test.title}`,text:`${user.name} | ${test.title}\n점수: ${info?.total_score||0}점 | 반평균: ${info?.class_average||0}점\n${window.location.href}`,});} else{await navigator.clipboard.writeText(`${user.name} | ${test.title}\n점수: ${info?.total_score||0}점 | 반평균: ${info?.class_average||0}점`);alert("성적 정보가 복사되었습니다!");}}catch{}}} className="text-xs text-slate-400 hover:text-[#D4AF37] flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg"><Icon type="upload" size={14}/>공유</button></div>
        {results.length>0?<>
          {/* 1. 출석/클리닉/과제/오답 성취도 */}
          {info&&<div className="ios-glass-card p-4 sm:p-6 mb-5 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-4"><div className="text-center"><p className="grade-label">출석</p><p className={`grade-value ${info.attendance==="출석"?"text-green-600":info.attendance==="영상"?"text-amber-500":"text-red-500"}`}>{info.attendance||"—"}</p></div><div className="text-center"><p className="grade-label">클리닉</p><p className="grade-value-sm">{info.clinic_time||"—"}</p></div><div className="text-center"><p className="grade-label">과제 성취도</p><p className="grade-value-sm">{(()=>{const r=info.assignment_score||"";if(!r)return"—";if(r.startsWith("미제출"))return"미제출";const hasB=r.includes("추가과제");const num=r.replace("+ 추가과제 👍","").replace("+추가과제👍","").replace(/%/g,"").trim();return num?(num+"% "+(hasB?"+ 추가과제 👍":"")):"—";})()}</p></div><div className="text-center"><p className="grade-label">오답 성취도</p><p className="grade-value">{(()=>{const r=info.wrong_answer_score||"";if(!r)return"—";if(r.startsWith("미제출"))return"미제출";return r.replace(/%/g,"").trim()+"%";})()}</p></div></div>}
          {/* 2. 개인 코멘트 */}
          {info?.comment&&<div className="ios-glass-card p-5 sm:p-6 mb-5 relative group text-center"><p className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-[#D4AF37] mb-2 opacity-90 group-hover:opacity-100 transition-opacity">선생님 코멘트</p><p className="text-[14px] sm:text-[16px] text-slate-800 leading-relaxed font-semibold whitespace-pre-line relative z-10 drop-shadow-sm">{info.comment}</p></div>}
          {/* 3. 점수 + 등수변화 */}
          <div className="space-y-5 mb-5">
                {info&&<div className="ios-glass-card p-5 sm:p-6 relative z-10"><div className="grid grid-cols-2 gap-y-4 gap-x-3 text-center"><div><p className="grade-label">내 점수</p><p className="text-2xl font-bold leading-none tracking-tight" style={{color:"#D4AF37",textShadow:"0 2px 10px rgba(212,175,55,0.2)"}}>{info.total_score}<span className="text-sm font-bold ml-1 text-slate-400">점</span></p></div><div><p className="grade-label">반 평균</p><p className="grade-stat mt-1">{info.class_average}<span className="text-xs font-bold ml-1 text-slate-400">점</span></p></div><div><p className="grade-label">표준편차</p><p className="grade-stat mt-1">{info.std_dev||"—"}<span className="text-xs font-bold ml-1 text-slate-400">{info.std_dev?"점":""}</span></p></div><div><p className="grade-label">최고 점수</p><p className="grade-stat mt-1">{info.class_best}<span className="text-xs font-bold ml-1 text-slate-400">점</span></p></div></div></div>}
                {rankHistory.length>=1&&(()=>{
                  // 퍼센타일 계산
                  const pcts=rankHistory.map(h=>h.total<=1?50:Math.round(((h.total-h.rank)/(h.total-1))*100));
                  // 첫 시험=0 기준, 이후 diff 누적
                  const deltas:number[]=pcts.map((p,i)=>i===0?0:p-pcts[i-1]);
                  const cumulative:number[]=[0];
                  for(let i=1;i<deltas.length;i++)cumulative.push(cumulative[i-1]+deltas[i]);
                  // 상태 판단 (마지막 delta 기준, ±5% 이내 유지)
                  const lastDelta=deltas[deltas.length-1];
                  const status=rankHistory.length<2?"first":Math.abs(lastDelta)<=5?"maintain":lastDelta>0?"up":"down";
                  // SVG 계산 — 중앙=0, 위=+, 아래=-
                  const w=320;const svgH=140;const px=24;const py=20;const gw=w-px*2;const gh=svgH-py*2;
                  const maxAbs=Math.max(...cumulative.map(Math.abs),10);
                  const toY=(v:number)=>py+gh/2-(v/maxAbs)*(gh/2-4);
                  const points=cumulative.map((v,i)=>({x:cumulative.length===1?w/2:px+(gw/(cumulative.length-1))*i,y:toY(v),date:rankHistory[i].date,delta:deltas[i]}));
                  const line=points.length>1?points.map((p,i)=>(i===0?"M":"L")+`${p.x},${p.y}`).join(" "):"";
                  const midY=toY(0);
                  const cardStyle:React.CSSProperties={background:"linear-gradient(145deg,rgba(255,255,255,0.62) 0%,rgba(255,255,255,0.35) 50%,rgba(255,255,255,0.55) 100%)",backdropFilter:"blur(36px) saturate(200%)",WebkitBackdropFilter:"blur(36px) saturate(200%)",borderRadius:"22px",border:"1px solid rgba(212,175,55,0.55)",boxShadow:"0 0 0 1px rgba(255,255,255,0.55),0 8px 32px rgba(212,175,55,0.10),inset 0 1px 0 rgba(255,255,255,0.88)",padding:"20px 24px",display:"flex",flexDirection:"column" as const,gap:"14px"};
                  return(<div style={cardStyle}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <h3 className="font-semibold text-base">등수 변화</h3>
                      {status==="up"&&<span onClick={fireConfetti} className="text-sm font-bold px-3 py-1 rounded-lg bg-green-50 text-green-600 cursor-pointer select-none">🎉 저번보다 올랐어요</span>}
                      {status==="down"&&<span className="text-sm font-bold px-3 py-1 rounded-lg bg-red-50 text-red-500">📉 저번보다 내렸어요</span>}
                      {status==="maintain"&&<span className="text-sm font-bold px-3 py-1 rounded-lg bg-slate-100 text-slate-500">— 저번이랑 비슷해요</span>}
                      {status==="first"&&<span className="text-xs text-slate-400">시험 2회 이상부터 추이 표시</span>}
                    </div>
                    <svg viewBox={`0 0 ${w} ${svgH}`} style={{width:"100%",maxHeight:"130px",display:"block"}}>
                      {/* 가운데 기준선 */}
                      <line x1={px} y1={midY} x2={w-px} y2={midY} stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="5 3"/>
                      <text x={px-2} y={midY+3} textAnchor="end" fontSize="7" fill="#cbd5e1">0</text>
                      <defs><linearGradient id="rankGradUp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22c55e" stopOpacity="0.15"/><stop offset="100%" stopColor="#22c55e" stopOpacity="0"/></linearGradient><linearGradient id="rankGradDown" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ef4444" stopOpacity="0"/><stop offset="100%" stopColor="#ef4444" stopOpacity="0.12"/></linearGradient></defs>
                      {line&&<path d={`${line} L${points[points.length-1].x},${midY} L${points[0].x},${midY} Z`} fill={lastDelta>=0?"url(#rankGradUp)":"url(#rankGradDown)"}/>}
                      {line&&<path d={line} fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>}
                      {points.map((p,i)=>(
                        <g key={i}>
                          <circle cx={p.x} cy={p.y} r="5" fill="white" stroke={i===0?"#94a3b8":p.delta>0?"#22c55e":p.delta<0?"#ef4444":"#D4AF37"} strokeWidth="2.5"/>
                          <text x={p.x} y={svgH-2} textAnchor="middle" fontSize="8" fill="#94a3b8">{p.date.slice(5)}</text>
                        </g>
                      ))}
                    </svg>
                  </div>);
              })()}
          </div>
          {/* 4. 정답률 → 최다오답 */}
          <div className="space-y-4 mb-5">
            <div className="ios-glass-card p-5">
              <h3 className="font-semibold text-base mb-3">정답률</h3>
              {(()=>{
                const hasSec=test.has_sections&&questions.some(q=>q.section&&q.section!=="common");
                const commonQs=hasSec?questions.filter(q=>!q.section||q.section==="common"):questions;
                const mySection=info?.selected_section||"";
                const optQs=hasSec&&mySection?questions.filter(q=>q.section===mySection):[];
                const renderBar=(qList:any[])=><div className="flex items-end gap-1 h-36">{qList.map(q=>{const rate=q.correct_rate||0;const step=Math.min(Math.floor(rate/10),9);const colors=["#ef4444","#f97316","#fb923c","#fbbf24","#a3e635","#84cc16","#34d399","#22d3ee","#60a5fa","#3b82f6"];return(<div key={q.question_number} className="flex-1 flex flex-col items-center gap-1"><div className="w-full flex flex-col justify-end h-24 relative"><div className="w-full rounded-t transition-all" style={{height:`${Math.max(rate,4)}%`,background:colors[step]}}/></div><span className="text-[9px] text-slate-500 leading-none font-semibold">{q.question_number}</span><span className="text-[8px] text-slate-400 leading-none">{rate}%</span></div>);})}</div>;
                if(!hasSec)return renderBar(questions);
                return(<>
                  <p className="text-[10px] font-bold text-slate-400 mb-1">공통 문항</p>
                  {renderBar(commonQs)}
                  {optQs.length>0&&<><p className="text-[10px] font-bold text-slate-400 mt-3 mb-1">{test.section1_name&&mySection==="opt1"?test.section1_name:test.section2_name||"선택"} 문항</p>{renderBar(optQs)}</>}
                  {!mySection&&<p className="text-xs text-slate-400 mt-2 text-center">선택문항 정보가 없습니다</p>}
                </>);
              })()}
            </div>
            {(()=>{const top3=[...questions].filter(q=>results.length>0&&rm[q.question_number]===false).sort((a,b)=>(a.correct_rate||0)-(b.correct_rate||0)).slice(0,3);return top3.length>0&&<div className="ios-glass-card p-5"><h3 className="font-semibold text-base mb-4">최다 오답 TOP 3</h3><div className="flex justify-center gap-6">{top3.map((q:any)=>{const rate=q.correct_rate||0;const circumference=2*Math.PI*36;const filled=circumference*(rate/100);const empty=circumference-filled;return(<div key={q.question_number} className="flex flex-col items-center gap-2"><div className="relative w-22 h-22"><svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90"><circle cx="40" cy="40" r="36" fill="none" stroke="#f1f5f9" strokeWidth="6"/><circle cx="40" cy="40" r="36" fill="none" stroke="#ff6b6b" strokeWidth="6" strokeDasharray={`${filled} ${empty}`} strokeLinecap="round"/></svg><div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-xl font-bold text-slate-700">{q.question_number}</span><span className="text-[10px] text-slate-400">번</span></div></div><div className="text-center"><p className="text-sm font-semibold text-red-400">{rate}%</p><p className="text-xs text-slate-400 max-w-[80px] truncate">{q.topic||"—"}</p></div></div>);})}</div></div>;})()} 
          </div>
          {/* 5. 맨 밑: 문항별 결과 */}
          <div className="ios-glass-card p-4 sm:p-6">
            <h3 className="font-extrabold text-lg mb-4 tracking-tight text-slate-800 flex items-center justify-between">문항별 결과 <span className="text-[10px] bg-slate-100 px-2 py-1 tracking-widest text-slate-400 rounded-lg uppercase">Questions</span></h3>
            <div className="space-y-1.5 relative z-10">
              {(()=>{
                const hasSec=test.has_sections&&questions.some(q=>q.section&&q.section!=="common");
                const mySection=info?.selected_section||"";
                const visibleQs=hasSec?questions.filter(q=>!q.section||q.section==="common"||q.section===mySection):questions;
                const renderQ=(q:any,secLabel?:string)=>{const rate=q.correct_rate||0;const isCorrect=rm[q.question_number];const isCool=isCorrect&&rate<30;const isCry=!isCorrect&&rate>=80;return(<div key={q.question_number} className="flex items-center gap-3 py-1.5 border-b border-slate-100/50 hover:bg-slate-50/50 rounded-lg px-2 transition-colors last:border-0"><span className="text-[13px] font-bold text-slate-400 w-6 text-right">{q.question_number}</span><span className="text-[13.5px] font-semibold text-slate-600 flex-1 text-center">{q.topic||"—"}</span><span className="text-base w-6 text-center">{isCool?"😎":isCry?"😭":""}</span><span className={`text-[15px] pb-0.5 font-extrabold w-8 text-center drop-shadow-sm ${isCorrect?"text-[#D4AF37]":"text-red-400"}`}>{isCorrect?"O":"X"}</span><span className="text-xs font-bold text-slate-400 w-12 text-right opacity-80">{rate}%</span></div>);};
                if(!hasSec)return visibleQs.map(q=>renderQ(q));
                const commonQs=questions.filter(q=>!q.section||q.section==="common");
                const optQs=mySection?questions.filter(q=>q.section===mySection):[];
                return(<>
                  {commonQs.length>0&&<><div className="text-[10px] font-bold text-slate-400 px-2 pb-1">공통 문항</div>{commonQs.map(q=>renderQ(q))}</>}
                  {optQs.length>0&&<><div className="text-[10px] font-bold text-slate-400 px-2 pt-2 pb-1">{mySection==="opt1"?(test.section1_name||"선택1"):(test.section2_name||"선택2")} 문항</div>{optQs.map(q=>renderQ(q))}</>}
                </>);
              })()}
            </div>
          </div>
        </>:<div className="ios-glass-card p-12 text-center text-slate-400 text-sm">결과 미입력</div>}
      </>:<div className="ios-glass-card p-12 text-center text-slate-400">시험 없음</div>}</div>}
      {tab==="calendar"&&(()=>{
        const today=new Date();
        const {y,m}=calMonth;
        const firstDay=new Date(y,m,1).getDay();
        const daysInMonth=new Date(y,m+1,0).getDate();
        const monthStr=`${y}-${String(m+1).padStart(2,"0")}`;
        const testsThisMonth=calTests.filter(t=>t.date?.startsWith(monthStr));
        const testMap:Record<number,any[]>={};
        testsThisMonth.forEach(t=>{const d=Number(t.date?.split("-")[2]);if(!testMap[d])testMap[d]=[];testMap[d].push(t);});
        // 다음 시험
        const upcoming=calTests.filter(t=>t.date&&t.date>=today.toISOString().slice(0,10)).slice(0,3);
        const cells:any[]=[];for(let i=0;i<firstDay;i++)cells.push(null);for(let d=1;d<=daysInMonth;d++)cells.push(d);
        while(cells.length%7!==0)cells.push(null);
        return(<div>
          <h2 className="text-xl font-bold mb-4">📅 캘린더</h2>
          {/* 다음 시험 배너 */}
          {upcoming.length>0&&<div className="ios-glass-card p-4 mb-5">
            <p className="text-xs font-bold text-[#D4AF37] tracking-widest uppercase mb-3">다가오는 시험</p>
            <div className="space-y-2">
              {upcoming.map((t:any)=>{
                const dt=new Date(t.date+"T00:00:00");
                const diff=Math.ceil((dt.getTime()-today.setHours(0,0,0,0))/(1000*60*60*24));
                return(<div key={t.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0" style={{background:"linear-gradient(135deg,#D4AF37,#B5952F)"}}>
                    <span className="text-white text-[10px] font-bold">{String(dt.getMonth()+1).padStart(2,"0")}월</span>
                    <span className="text-white text-lg font-bold leading-none">{dt.getDate()}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-700">{t.title}</p>
                    <p className="text-xs text-slate-400">{t.class_group_id?t.class_name||"":"전체"} · {["일","월","화","수","목","금","토"][dt.getDay()]}요일</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${diff===0?"bg-red-50 text-red-500":diff<=7?"bg-amber-50 text-amber-600":"bg-slate-100 text-slate-500"}`}>
                    {diff===0?"오늘":diff===1?"내일":`D-${diff}`}
                  </span>
                </div>);
              })}
            </div>
          </div>}
          {/* 캘린더 */}
          <div className="ios-glass-card p-4">
            <div className="flex items-center justify-between mb-4">
              <button onClick={()=>setCalMonth(p=>{const d=new Date(p.y,p.m-1);return{y:d.getFullYear(),m:d.getMonth()};})} className="p-2 hover:bg-slate-100 rounded-xl"><Icon type="left" size={18}/></button>
              <p className="font-bold text-base">{y}년 {m+1}월</p>
              <button onClick={()=>setCalMonth(p=>{const d=new Date(p.y,p.m+1);return{y:d.getFullYear(),m:d.getMonth()};})} className="p-2 hover:bg-slate-100 rounded-xl"><Icon type="right" size={18}/></button>
            </div>
            <div className="grid grid-cols-7 mb-2">
              {["일","월","화","수","목","금","토"].map((d,i)=>(
                <div key={d} className={`text-center text-[11px] font-bold py-1 ${i===0?"text-red-400":i===6?"text-blue-400":"text-slate-400"}`}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-1">
              {cells.map((d,i)=>{
                const isToday=d&&y===today.getFullYear()&&m===today.getMonth()&&d===today.getDate();
                const tests=d?testMap[d]||[]:[];
                const dow=i%7;
                return(<div key={i} className="min-h-[52px] rounded-xl p-1 relative" style={{background:isToday?"rgba(212,175,55,0.08)":""}}>
                  {d&&<span className={`text-xs font-semibold block text-center mb-0.5 w-6 h-6 rounded-full flex items-center justify-center mx-auto ${isToday?"bg-[#D4AF37] text-white":dow===0?"text-red-400":dow===6?"text-blue-400":"text-slate-600"}`}>{d}</span>}
                  {tests.map((t:any,ti:number)=>(
                    <div key={ti} className="text-[9px] font-semibold px-1 py-0.5 rounded mb-0.5 truncate text-white" style={{background:"linear-gradient(135deg,#D4AF37,#B5952F)"}} title={t.title}>{t.title}</div>
                  ))}
                </div>);
              })}
            </div>
          </div>
        </div>);
      })()}
      {tab==="myexam"&&<div>
        <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">📝 시험 결과</h2><button onClick={()=>{setShowExamAdd(true);setEditExamId(null);}} className="shimmer-action-btn text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 shadow-md transition-all" style={{background:"linear-gradient(135deg,#D4AF37,#B5952F)",boxShadow:"0 4px 14px rgba(212,175,55,0.4)"}}><Icon type="plus" size={15}/>성적 입력</button></div>
        {showExamAdd&&<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 mb-4 shadow-sm border border-slate-100/50 space-y-4">
          {/* 시험 유형 선택 */}
          <div><label className="text-xs font-semibold text-slate-500">시험 유형</label><div className="flex gap-2 mt-1">{["모의고사","내신"].map(t=>(<button key={t} onClick={()=>setExamForm(p=>({...p,exam_type:t,exam_name:"",score:"",grade:""}))} className={`px-4 py-2 rounded-xl text-sm font-semibold ${examForm.exam_type===t?"bg-[#D4AF37] text-white":"bg-white text-slate-500 border border-slate-200"}`}>{t}</button>))}</div></div>

          {examForm.exam_type==="모의고사"&&<>
            <div><label className="text-xs font-semibold text-slate-500">몇월</label><select className="w-full bg-white rounded-xl px-4 py-2.5 text-sm mt-1 border border-slate-200" value={examForm.exam_name} onChange={e=>setExamForm(p=>({...p,exam_name:e.target.value}))}><option value="">선택</option>{[3,4,6,7,9,10,11].map(m=>(<option key={m} value={`${m}월`}>{m}월</option>))}</select></div>
            {/* 과목별 표 */}
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
              <table className="w-full text-xs"><thead><tr className="bg-gradient-to-r from-[#D4AF37]/5 to-[#D4AF37]/10"><th className="py-2.5 w-10 text-[10px] font-bold text-slate-500"></th>{["국어","수학","영어","과학","사회"].map(s=>(<th key={s} className="py-2.5 text-[11px] font-bold text-slate-600">{s}</th>))}</tr></thead><tbody>
              <tr className="border-t border-slate-100"><td className="py-2 text-center text-[10px] font-bold text-slate-400">등급</td>
                {[{k:"kor_grade"},{k:"math_grade"},{k:"eng_grade"},{k:"sci_grade"},{k:"soc_grade"}].map(c=>(<td key={c.k} className="py-1 px-0.5"><select className="w-full bg-slate-50 rounded-lg py-1.5 text-[11px] border-0 text-center font-semibold appearance-none" value={(examForm as any)[c.k]||""} onChange={e=>setExamForm(p=>({...p,[c.k]:e.target.value}))}><option value="">-</option>{[1,2,3,4,5,6,7,8,9].map(g=>(<option key={g} value={`${g}`}>{g}</option>))}</select></td>))}
              </tr>
              <tr className="border-t border-slate-100"><td className="py-2 text-center text-[10px] font-bold text-slate-400">점수</td>
                {[{k:"kor_score"},{k:"math_score"},{k:"eng_score"},{k:"sci_score"},{k:"soc_score"}].map(c=>(<td key={c.k} className="py-1 px-0.5"><input className="w-full bg-slate-50 rounded-lg py-1.5 text-[11px] border-0 text-center font-semibold" value={(examForm as any)[c.k]||""} onChange={e=>setExamForm(p=>({...p,[c.k]:e.target.value}))} placeholder="—"/></td>))}
              </tr>
              </tbody></table>
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
          <div className="flex gap-2"><button onClick={addExam} className="bg-[#D4AF37] text-white px-5 py-2 rounded-xl text-xs font-semibold">✓ 저장하고 계속 입력</button><button onClick={()=>setShowExamAdd(false)} className="text-xs text-slate-400 px-3 py-2 rounded-xl bg-slate-100">닫기</button></div>
        </div>}
        {myExams.length>0?<div className="space-y-3">{myExams.map((ex:any)=>{let memoObj:any={};try{memoObj=JSON.parse(ex.memo||"{}");}catch{}let subjects:any=null;try{if(ex.total&&ex.total.startsWith("{"))subjects=JSON.parse(ex.total);}catch{}return(<div key={ex.id} className="ios-glass-card p-4">
          {editExamId===ex.id?<div className="space-y-4">
            <h3 className="font-semibold text-sm text-slate-700">✏️ 시험 결과 수정</h3>
            <div><label className="text-xs font-semibold text-slate-500">시험 유형</label><div className="flex gap-2 mt-1">{["모의고사","내신"].map(t=>(<button key={t} onClick={()=>setEditExamForm(p=>({...p,exam_type:t}))} className={`px-4 py-2 rounded-xl text-sm font-semibold ${editExamForm.exam_type===t?"bg-[#D4AF37] text-white":"bg-white text-slate-500 border border-slate-200"}`}>{t}</button>))}</div></div>
            {editExamForm.exam_type==="모의고사"&&<>
              <div><label className="text-xs font-semibold text-slate-500">몇월</label><select className="w-full bg-white rounded-xl px-4 py-2.5 text-sm mt-1 border border-slate-200" value={editExamForm.exam_name} onChange={e=>setEditExamForm(p=>({...p,exam_name:e.target.value}))}><option value="">선택</option>{[3,4,6,7,9,10,11].map(m=>(<option key={m} value={`${m}월`}>{m}월</option>))}</select></div>
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm"><table className="w-full text-xs"><thead><tr className="bg-gradient-to-r from-[#D4AF37]/5 to-[#D4AF37]/10"><th className="py-2.5 w-10 text-[10px] font-bold text-slate-500"></th>{["국어","수학","영어","과학","사회"].map(s=>(<th key={s} className="py-2.5 text-[11px] font-bold text-slate-600">{s}</th>))}</tr></thead><tbody>
              <tr className="border-t border-slate-100"><td className="py-2 text-center text-[10px] font-bold text-slate-400">등급</td>{[{k:"kor_grade"},{k:"math_grade"},{k:"eng_grade"},{k:"sci_grade"},{k:"soc_grade"}].map(c=>(<td key={c.k} className="py-1 px-0.5"><select className="w-full bg-slate-50 rounded-lg py-1.5 text-[11px] border-0 text-center font-semibold appearance-none" value={(editExamForm as any)[c.k]||""} onChange={e=>setEditExamForm(p=>({...p,[c.k]:e.target.value}))}><option value="">-</option>{[1,2,3,4,5,6,7,8,9].map(g=>(<option key={g} value={`${g}`}>{g}</option>))}</select></td>))}</tr>
              <tr className="border-t border-slate-100"><td className="py-2 text-center text-[10px] font-bold text-slate-400">점수</td>{[{k:"kor_score"},{k:"math_score"},{k:"eng_score"},{k:"sci_score"},{k:"soc_score"}].map(c=>(<td key={c.k} className="py-1 px-0.5"><input className="w-full bg-slate-50 rounded-lg py-1.5 text-[11px] border-0 text-center font-semibold" value={(editExamForm as any)[c.k]||""} onChange={e=>setEditExamForm(p=>({...p,[c.k]:e.target.value}))} placeholder="—"/></td>))}</tr>
              </tbody></table></div>
            </>}
            {editExamForm.exam_type==="내신"&&<>
              <div><label className="text-xs font-semibold text-slate-500">시험 구분</label><select className="w-full bg-white rounded-xl px-4 py-2.5 text-sm mt-1 border border-slate-200" value={editExamForm.exam_name} onChange={e=>setEditExamForm(p=>({...p,exam_name:e.target.value}))}><option value="">선택</option><option>1학기 중간</option><option>1학기 기말</option><option>2학기 중간</option><option>2학기 기말</option></select></div>
              <div className="grid grid-cols-2 gap-3"><div><label className="text-xs font-semibold text-slate-500">수학 점수</label><input className="w-full bg-white rounded-xl px-4 py-2.5 text-sm mt-1 border border-slate-200" value={editExamForm.score} onChange={e=>setEditExamForm(p=>({...p,score:e.target.value}))} placeholder="85"/></div><div><label className="text-xs font-semibold text-slate-500">등급</label><select className="w-full bg-white rounded-xl px-4 py-2.5 text-sm mt-1 border border-slate-200" value={editExamForm.grade} onChange={e=>setEditExamForm(p=>({...p,grade:e.target.value}))}><option value="">선택</option>{[1,2,3,4,5,6,7,8,9].map(g=>(<option key={g} value={`${g}등급`}>{g}등급</option>))}</select></div></div>
            </>}
            <div><label className="text-xs font-semibold text-slate-500">수학 성적이 올랐나요?</label><input className="w-full bg-white rounded-xl px-4 py-2.5 text-sm mt-1 border border-slate-200" value={editExamForm.q1} onChange={e=>setEditExamForm(p=>({...p,q1:e.target.value}))} placeholder="예: 저번보다 10점 올랐어요"/></div>
            <div><label className="text-xs font-semibold text-slate-500">공부에 가장 큰 고민은?</label><input className="w-full bg-white rounded-xl px-4 py-2.5 text-sm mt-1 border border-slate-200" value={editExamForm.q2} onChange={e=>setEditExamForm(p=>({...p,q2:e.target.value}))} placeholder="예: 시간이 부족해요"/></div>
            <div><label className="text-xs font-semibold text-slate-500">하고 싶은 말</label><input className="w-full bg-white rounded-xl px-4 py-2.5 text-sm mt-1 border border-slate-200" value={editExamForm.q3} onChange={e=>setEditExamForm(p=>({...p,q3:e.target.value}))} placeholder="자유롭게 적어주세요"/></div>
            <div className="flex gap-2"><button onClick={saveEditExam} className="bg-[#D4AF37] text-white px-4 py-2 rounded-xl text-xs font-semibold">저장</button><button onClick={()=>setEditExamId(null)} className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-2.5 py-1 rounded-lg bg-slate-100 transition-colors">취소</button></div>
          </div>:
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1"><span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${ex.exam_type==="모의고사"?"bg-amber-50 text-amber-600":"bg-blue-50 text-blue-600"}`}>{ex.exam_type}</span>{ex.exam_name&&<span className="text-xs text-slate-500">{ex.exam_name}</span>}</div>
              {subjects?<div className="mt-2 bg-gradient-to-r from-slate-50 to-white rounded-xl overflow-hidden border border-slate-100 shadow-sm"><table className="w-full text-xs"><thead><tr className="bg-gradient-to-r from-[#D4AF37]/5 to-[#D4AF37]/10"><th className="py-2 w-10 text-[10px] font-bold text-slate-400"></th>{["국어","수학","영어","과학","사회"].map(s=>(<th key={s} className="py-2 text-[10px] font-bold text-slate-600">{s}</th>))}</tr></thead><tbody><tr><td className="py-1.5 text-center text-[10px] font-bold text-slate-400">등급</td>{["국어","수학","영어","과학","사회"].map(s=>(<td key={s} className="py-1.5 text-center font-bold text-[#D4AF37]">{subjects[s]?.grade||"—"}</td>))}</tr><tr className="border-t border-slate-50"><td className="py-1.5 text-center text-[10px] font-bold text-slate-400">점수</td>{["국어","수학","영어","과학","사회"].map(s=>(<td key={s} className="py-1.5 text-center">{subjects[s]?.score||"—"}</td>))}</tr></tbody></table></div>:<><p className="font-semibold text-sm">{ex.subject}</p><div className="flex items-center gap-3 mt-1"><span className="text-lg font-bold text-[#D4AF37]">{ex.score}점</span>{ex.grade&&<span className="text-sm font-semibold text-slate-500">{ex.grade}</span>}</div></>}
              {(memoObj.q1||memoObj.q2||memoObj.q3)&&<div className="mt-2 space-y-1 text-xs text-slate-500">{memoObj.q1&&<p>📈 {memoObj.q1}</p>}{memoObj.q2&&<p>🤔 {memoObj.q2}</p>}{memoObj.q3&&<p>💬 {memoObj.q3}</p>}</div>}
            </div>
            <div className="flex items-center gap-2 ml-2 flex-shrink-0"><button onClick={()=>{setEditExamId(ex.id);startEditExam(ex);setShowExamAdd(false);}} className="text-xs font-semibold text-slate-700 hover:text-[#D4AF37] transition-colors px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#D4AF37]/10">수정</button><button onClick={()=>delExam(ex.id)} className="text-xs font-semibold text-slate-700 hover:text-red-500 transition-colors px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50">삭제</button></div>
          </div>}
        </div>);})}</div>:<div className="ios-glass-card p-12 text-center text-slate-400">시험 성적을 입력해보세요</div>}
      </div>}
      {tab==="notice"&&<div><h2 className="text-xl font-bold mb-4">📢 공지사항</h2>{notices.length>0?<div className="space-y-3">{notices.map((n:any,ni:number)=>{const isNew=n.created_at&&(Date.now()-new Date(n.created_at).getTime())<24*60*60*1000;const nImg=n.content?.match(/\[IMG\](.*?)\[\/IMG\]/);const nClean=n.content?.replace(/\[IMG\].*?\[\/IMG\]/g,"").trim();const postNum=notices.length-ni;return(<div key={n.id} className="ios-glass-card p-5" style={{wordBreak:"break-word",overflowWrap:"break-word"}}>
          {/* 1행: 번호 / N / 반 이름 / 날짜 */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[11px] font-bold text-slate-500">#{postNum}</span>
            {isNew&&<span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">N</span>}
            <span className="text-xs text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-lg font-semibold">{n.class_groups?.name||""}</span>
            <span className="text-xs text-slate-400 ml-auto">{n.created_at?.slice(0,10)}</span>
          </div>
          {/* 2행: 제목 */}
          <h3 className="font-bold text-sm text-slate-800 mb-2 pb-2" style={{borderBottom:"1px solid rgba(212,175,55,0.1)"}}>{n.title||"공지"}</h3>
          {/* 3행: 내용 */}
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap break-words" style={{maxWidth:"100%",overflowWrap:"break-word"}}>{nClean}</p>
          {nImg&&<img src={nImg[1]} alt="" className="mt-3 rounded-xl max-h-64 object-contain" style={{maxWidth:"100%"}}/>}
        </div>);})}</div>:<div className="ios-glass-card p-12 text-center text-slate-400">공지사항이 없습니다</div>}</div>}
      {tab==="inquiry"&&<div>
        <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">💬 문의사항</h2><button onClick={()=>setShowInqAdd(true)} className="shimmer-action-btn text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1  transition-all"><Icon type="plus" size={14}/>문의하기</button></div>
        {showInqAdd&&<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 mb-4 shadow-sm border border-slate-100/50 space-y-3">
          <div><label className="text-xs font-semibold text-slate-500">제목</label><input className="w-full bg-white rounded-xl px-4 py-2.5 text-sm mt-1 border border-slate-200" value={inqForm.title} onChange={e=>setInqForm(p=>({...p,title:e.target.value}))} placeholder="문의 제목"/></div>
          <div><label className="text-xs font-semibold text-slate-500">내용</label><textarea className="w-full bg-white rounded-xl px-4 py-3 text-sm mt-1 border border-slate-200 resize-none h-28" value={inqForm.content} onChange={e=>setInqForm(p=>({...p,content:e.target.value}))} placeholder="문의 내용을 적어주세요"/></div>
          <div><label className="text-xs font-semibold text-slate-500">이미지 첨부</label><div className="flex items-center gap-2 mt-1"><button onClick={()=>inqImgRef.current?.click()} className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-500">{inqImg?inqImg.name:"이미지 선택"}</button><input ref={inqImgRef} type="file" accept="image/*" className="hidden" onChange={e=>{if(e.target.files?.[0])setInqImg(e.target.files[0]);}}/>{inqImg&&<button onClick={()=>setInqImg(null)} className="text-xs text-red-400">삭제</button>}</div></div>
          <div className="flex gap-2"><button onClick={addInquiry} className="bg-[#D4AF37] text-white px-4 py-2 rounded-xl text-xs font-semibold">등록</button><button onClick={()=>{setShowInqAdd(false);setInqImg(null);}} className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-2.5 py-1 rounded-lg bg-slate-100 transition-colors">취소</button></div>
        </div>}
        {inquiries.length>0?<div className="space-y-3">{inquiries.map((q:any,qi:number)=>{const isNew=q.created_at&&(Date.now()-new Date(q.created_at).getTime())<24*60*60*1000;const hasReply=!!q.reply;const imgMatch=q.content?.match(/\[IMG\](.*?)\[\/IMG\]/);const cleanContent=q.content?.replace(/\[IMG\].*?\[\/IMG\]/g,"").trim();const replyImg=q.reply?.match(/\[IMG\](.*?)\[\/IMG\]/);const cleanReply=q.reply?.replace(/\[IMG\].*?\[\/IMG\]/g,"").trim();const postNum=inquiries.length-qi;return(<div key={q.id} className="ios-glass-card p-5">
          {editInqId===q.id?<div className="space-y-3">
            <div><label className="text-xs font-semibold text-slate-500">제목</label><input className="w-full bg-white rounded-xl px-4 py-2.5 text-sm mt-1 border border-slate-200" value={editInqForm.title} onChange={e=>setEditInqForm(p=>({...p,title:e.target.value}))} placeholder="문의 제목"/></div>
            <div><label className="text-xs font-semibold text-slate-500">내용</label><textarea className="w-full bg-white rounded-xl px-4 py-3 text-sm mt-1 border border-slate-200 resize-none h-28" value={editInqForm.content} onChange={e=>setEditInqForm(p=>({...p,content:e.target.value}))} placeholder="문의 내용"/></div>
            {imgMatch&&editInqKeepImg&&!editInqImg&&<div className="bg-slate-50 rounded-xl p-3"><p className="text-xs font-semibold text-slate-500 mb-2">📎 현재 이미지</p><img src={imgMatch[1]} alt="" className="rounded-xl max-h-32 object-contain mb-2"/><button onClick={()=>setEditInqKeepImg(false)} className="text-xs font-semibold text-red-500 px-2.5 py-1 rounded-lg bg-red-50">이미지 삭제</button></div>}
            {imgMatch&&!editInqKeepImg&&!editInqImg&&<div className="bg-red-50 rounded-xl p-2.5 text-xs text-red-400 font-semibold">기존 이미지가 삭제됩니다 <button onClick={()=>setEditInqKeepImg(true)} className="ml-2 text-slate-500 underline">취소</button></div>}
            <div><label className="text-xs font-semibold text-slate-500">이미지 {editInqImg?"변경":"추가"}</label><div className="flex items-center gap-2 mt-1"><button onClick={()=>editInqImgRef.current?.click()} className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-500">{editInqImg?`📎 ${editInqImg.name}`:"이미지 선택"}</button><input ref={editInqImgRef} type="file" accept="image/*" className="hidden" onChange={e=>{if(e.target.files?.[0]){setEditInqImg(e.target.files[0]);setEditInqKeepImg(false);}}}/>{editInqImg&&<button onClick={()=>{setEditInqImg(null);setEditInqKeepImg(!!imgMatch);}} className="text-xs text-red-400">제거</button>}</div>{editInqImg&&<img src={URL.createObjectURL(editInqImg)} alt="" className="mt-2 rounded-xl max-h-32 object-contain"/>}</div>
            <div className="flex gap-2"><button onClick={saveEditInq} className="bg-[#D4AF37] text-white px-4 py-2 rounded-xl text-xs font-semibold">저장</button><button onClick={()=>{setEditInqId(null);setEditInqImg(null);}} className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-2.5 py-1 rounded-lg bg-slate-100 transition-colors">취소</button></div>
          </div>:<>
            {/* 1행: 번호 / N / 상태 / 날짜 / 수정·삭제 */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[11px] font-bold text-slate-500">#{postNum}</span>
              {isNew&&<span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">N</span>}
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${hasReply?"bg-green-50 text-green-600":"bg-amber-50 text-amber-600"}`}>{hasReply?"답변 완료":"답변 대기중"}</span>
              <span className="text-xs text-slate-400 ml-auto">{q.created_at?.slice(0,10)}</span>
              {!hasReply&&<button onClick={()=>startEditInq(q)} className="text-xs font-semibold text-slate-700 hover:text-[#D4AF37] transition-colors px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-[#D4AF37]/10">수정</button>}
              <button onClick={()=>deleteInquiry(q.id)} className="text-xs font-semibold text-slate-700 hover:text-red-500 transition-colors px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-red-50">삭제</button>
            </div>
            {/* 2행: 제목 + 학생 이름 */}
            <div className="flex items-center gap-2 mb-2 pb-2" style={{borderBottom:"1px solid rgba(212,175,55,0.1)"}}>
              <h3 className="font-bold text-sm text-slate-800">{q.title||"문의"}</h3>
              <span className="text-xs font-semibold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-lg ml-auto flex-shrink-0">{user.login_id||user.name}</span>
            </div>
            {/* 3행: 내용 */}
            <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">{cleanContent}</p>
            {imgMatch&&<img src={imgMatch[1]} alt="" className="mt-2 rounded-xl max-h-48 object-contain"/>}
            {hasReply&&<div className="mt-3 bg-[#D4AF37]/5 rounded-xl p-3 border border-[#D4AF37]/10"><p className="text-xs font-semibold text-[#D4AF37] mb-1">✏️ 답변</p><p className="text-sm text-slate-700 whitespace-pre-line">{cleanReply}</p>{replyImg&&<img src={replyImg[1]} alt="" className="mt-2 rounded-xl max-h-48 object-contain"/>}</div>}
          </>}
        </div>);})}</div>:<div className="ios-glass-card p-12 text-center text-slate-400">문의사항이 없습니다</div>}
      </div>}
      {tab==="shop"&&<div>
        <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">🏪 상점</h2><div className="bg-amber-50 px-4 py-2 rounded-xl"><span className="text-sm font-bold text-amber-600">🔥 {myTokens} 서서갈비</span></div></div>
        <ShopNoticeBox/>
        {shopItems.length>0?<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">{shopItems.map((item:any)=>(<div key={item.id} className="ios-glass-card p-5"><h3 className="font-semibold text-base mb-1">{item.name}</h3>{item.description&&<p className="text-xs text-slate-400 mb-3">{item.description}</p>}<div className="flex items-center justify-between"><span className="text-sm font-bold text-amber-600">🔥 {item.price}</span><button onClick={()=>buyItem(item)} className="bg-[#D4AF37] text-white px-4 py-1.5 rounded-xl text-xs font-semibold">구매</button></div></div>))}</div>:<div className="bg-slate-50 rounded-2xl p-8 text-center text-slate-400 text-sm mb-6">상점 준비 중</div>}
        {purchases.length>0&&<div><h3 className="font-semibold text-sm mb-3">구매 내역</h3><div className="space-y-2">{purchases.map((p:any)=>(<div key={p.id} className="bg-slate-50 rounded-xl px-4 py-3 flex justify-between items-center"><span className="text-sm">{p.shop_items?.name||"아이템"}</span><div className="text-right"><span className="text-xs font-bold text-amber-600">-{p.price} 🔥</span><p className="text-[10px] text-slate-400">{p.created_at?.slice(0,10)}</p></div></div>))}</div></div>}
      </div>}
      {tab==="shorts"&&<div>
        <div className="mb-5"><h2 className="text-xl font-bold">▶ 서정인T 쇼츠</h2><p className="text-xs text-slate-400 mt-1">서정인 수학 유튜브 쇼츠</p></div>
        <ShortsGrid/>
        <div className="mt-5 text-center"><a href="https://www.youtube.com/@agreesuh/shorts" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2.5 rounded-2xl text-sm font-semibold shadow-md shadow-red-500/20 hover:shadow-lg transition-all"><svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M23.498 6.186a2.832 2.832 0 00-1.991-2.006C19.691 3.592 12 3.592 12 3.592s-7.691 0-9.507.588A2.832 2.832 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.832 2.832 0 001.991 2.006C4.309 20.408 12 20.408 12 20.408s7.691 0 9.507-.588a2.832 2.832 0 001.991-2.006C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/><path d="M9.545 15.568V8.432L15.818 12z" fill="#282828"/></svg>더 많은 영상 보기</a></div>
      </div>}
      {tab==="review"&&<div>
        <div className="flex justify-between items-center mb-5"><h2 className="text-xl font-bold">✍️ 수강 후기</h2>{!showReviewForm&&<button onClick={()=>setShowReviewForm(true)} className="shimmer-action-btn text-white px-4 py-2 rounded-2xl text-xs font-semibold">{myReview?"수정하기":"후기 작성"}</button>}</div>
        {showReviewForm?<div className="ios-glass-card p-6 space-y-5">
          <div><label className="text-sm font-semibold text-slate-700 mb-2 block">📈 성적이 제일 많이 올랐을 때는?</label><input className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm border-0 focus:ring-2 focus:ring-[#D4AF37]/20 transition-all" value={reviewForm.best_grade} onChange={e=>setReviewForm(p=>({...p,best_grade:e.target.value}))} placeholder="예: 1학년 1학기 기말고사, 500등 → 100등"/><p className="text-[10px] text-slate-400 mt-1">예: 60점 → 100점, 혹은 500등 → 100등</p></div>
          <div><label className="text-sm font-semibold text-slate-700 mb-2 block">⭐ 서정인 쌤의 장점 (순위별 선택)</label>
            <div className="space-y-2">
              {[{label:"1순위",key:"kw1"},{label:"2순위",key:"kw2"},{label:"3순위",key:"kw3"}].map(r=>(<div key={r.key} className="flex items-center gap-3"><span className={`text-xs font-bold w-12 text-center py-1 rounded-lg ${r.key==="kw1"?"bg-amber-100 text-amber-600":r.key==="kw2"?"bg-slate-100 text-slate-500":"bg-orange-50 text-orange-400"}`}>{r.label}</span><select className="flex-1 bg-slate-50 rounded-xl px-4 py-2.5 text-sm border-0 focus:ring-2 focus:ring-[#D4AF37]/20" value={(reviewForm as any)[r.key]} onChange={e=>setReviewForm(p=>({...p,[r.key]:e.target.value}))}><option value="">선택해주세요</option>{kwOptions.filter(kw=>kw===(reviewForm as any)[r.key]||![reviewForm.kw1,reviewForm.kw2,reviewForm.kw3].includes(kw)).map(kw=>(<option key={kw} value={kw}>#{kw}</option>))}</select></div>))}
            </div>
          </div>
          <div><label className="text-sm font-semibold text-slate-700 mb-2 block">💬 수강 후기</label><textarea className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm border-0 resize-none h-32 focus:ring-2 focus:ring-[#D4AF37]/20 transition-all" value={reviewForm.content} onChange={e=>setReviewForm(p=>({...p,content:e.target.value}))} placeholder="서정인 수학을 수강하면서 느낀 점을 자유롭게 적어주세요"/></div>
          <div className="flex gap-2"><button onClick={saveReview} className="shimmer-action-btn text-white px-6 py-2.5 rounded-xl text-sm font-semibold">저장</button><button onClick={()=>setShowReviewForm(false)} className="text-xs text-slate-400 px-4 py-2.5">취소</button></div>
        </div>:myReview?<div className="ios-glass-card p-6">
          {myReview.best_grade&&<div className="mb-4"><p className="text-xs font-semibold text-slate-400 mb-1">📈 성적 향상</p><p className="text-sm font-bold text-slate-700">{myReview.best_grade}</p></div>}
          {myReview.keywords&&<div className="mb-4"><p className="text-xs font-semibold text-slate-400 mb-2">⭐ 장점 순위</p><div className="flex flex-wrap gap-2">{myReview.keywords.split(",").map((kw:string,i:number)=>(<span key={kw} className={`px-3 py-1 rounded-full text-xs font-semibold ${i===0?"bg-amber-100 text-amber-600":i===1?"bg-slate-100 text-slate-500":"bg-orange-50 text-orange-400"}`}>{i+1}순위 #{kw}</span>))}</div></div>}
          <div><p className="text-xs font-semibold text-slate-400 mb-1">💬 수강 후기</p><p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{myReview.content}</p></div>
          <div className="flex items-center justify-between mt-4"><p className="text-[10px] text-slate-400">{myReview.created_at?.slice(0,10)} 작성</p><div className="flex items-center gap-2"><button onClick={()=>setShowReviewForm(true)} className="text-xs font-semibold text-slate-700 hover:text-[#D4AF37] transition-colors px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#D4AF37]/10">수정</button><button onClick={deleteReview} className="text-xs font-semibold text-slate-700 hover:text-red-500 transition-colors px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50">삭제</button></div></div>
        </div>:<div className="ios-glass-card p-12 text-center"><p className="text-slate-400 text-sm mb-3">아직 후기를 작성하지 않았습니다</p><button onClick={()=>setShowReviewForm(true)} className="shimmer-action-btn text-white px-5 py-2 rounded-xl text-sm font-semibold">후기 작성하기</button></div>}
      </div>}
      {tab==="changepw"&&<div><h2 className="text-xl font-bold mb-4">🔒 비밀번호 변경</h2><div className="ios-glass-card p-6 max-w-md"><div className="space-y-3"><input type="password" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm border-0 focus:ring-2 focus:ring-[#D4AF37]/20" value={pw.n1} onChange={e=>setPw(p=>({...p,n1:e.target.value}))} placeholder="새 비밀번호"/><input type="password" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm border-0 focus:ring-2 focus:ring-[#D4AF37]/20" value={pw.n2} onChange={e=>setPw(p=>({...p,n2:e.target.value}))} placeholder="새 비밀번호 확인"/></div>{pwMsg&&<p className={`text-xs mt-2 ${pwMsg.includes("완료")?"text-green-500":"text-red-400"}`}>{pwMsg}</p>}<button onClick={chPw} className="shimmer-action-btn mt-4 text-white px-6 py-2.5 rounded-xl text-sm font-semibold">변경</button></div></div>}
    </div></main>
  </div>);
}

/* ═══ ADMIN: STUDENT MANAGER + EXCEL IMPORT ═══ */
function AdminStudentManager({users,fetchUsers,groups}:{users:any[];fetchUsers:()=>void;groups:any[]}){
  const[showAdd,setShowAdd]=useState(false);const[form,setForm]=useState({name:"",school:"",parent_phone:"",student_phone:"",class_ids:[] as number[]});
  const[showImport,setShowImport]=useState(false);const[importText,setImportText]=useState("");
  const[editStu,setEditStu]=useState<any>(null);const[editForm,setEditForm]=useState({name:"",school:"",parent_phone:"",student_phone:""});
  const[checked,setChecked]=useState<Set<number>>(new Set());const[bulkDeleting,setBulkDeleting]=useState(false);
  const[stuGroups,setStuGroups]=useState<Record<number,number[]>>({});
  const loadStuGroups=async()=>{const{data}=await supabase.from("class_members").select("user_id,class_group_id");if(data){const m:Record<number,number[]>={};data.forEach((r:any)=>{if(!m[r.user_id])m[r.user_id]=[];m[r.user_id].push(r.class_group_id);});setStuGroups(m);}};
  useEffect(()=>{loadStuGroups();},[]);
  const students=users.filter((u:any)=>u.role==="student"&&u.status==="approved");
  const sortedStudents=[...students].sort((a:any,b:any)=>{
    const aGids=stuGroups[a.id]||[];const bGids=stuGroups[b.id]||[];
    const aIdx=aGids.length>0?Math.min(...aGids.map((id:number)=>groups.findIndex((g:any)=>g.id===id)).filter(i=>i>=0)):9999;
    const bIdx=bGids.length>0?Math.min(...bGids.map((id:number)=>groups.findIndex((g:any)=>g.id===id)).filter(i=>i>=0)):9999;
    if(aIdx!==bIdx)return aIdx-bIdx;
    return(a.name||"").localeCompare(b.name||"",'ko');
  });
  const fileRef=useRef<HTMLInputElement>(null);

  const toggleCheck=(id:number)=>{setChecked(prev=>{const n=new Set(prev);if(n.has(id))n.delete(id);else n.add(id);return n;});};
  const toggleAll=()=>{if(checked.size===sortedStudents.length)setChecked(new Set());else setChecked(new Set(sortedStudents.map((s:any)=>s.id)));};
  const bulkDelete=async()=>{if(checked.size===0)return;if(!confirm(`선택한 ${checked.size}명의 학생을 삭제할까요?\n이 작업은 되돌릴 수 없습니다.`))return;setBulkDeleting(true);for(const id of checked){await supabase.from("users").delete().eq("id",id);}setChecked(new Set());setBulkDeleting(false);fetchUsers();};

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
    <div className="flex justify-between items-center mb-4 flex-wrap gap-2"><h2 className="text-lg font-bold">👨‍🎓 학생 관리</h2><div className="flex gap-2">{checked.size>0&&<button onClick={bulkDelete} disabled={bulkDeleting} className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 shadow-md shadow-red-500/20 hover:bg-red-600 transition-all disabled:opacity-50">{bulkDeleting?`삭제 중... (${checked.size})`:`🗑️ ${checked.size}명 삭제`}</button>}<button onClick={()=>setShowImport(true)} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-semibold">📋 엑셀 붙여넣기</button><button onClick={()=>setShowAdd(true)} className="admin-btn px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"><Icon type="plus" size={14}/>학생 추가</button></div></div>

    {showImport&&<div className="bg-white rounded-2xl p-5 shadow-sm mb-4 border border-amber-200">
      <h3 className="font-semibold text-sm mb-2">📋 엑셀에서 붙여넣기</h3>
      <p className="text-xs text-slate-400 mb-3">엑셀에서 이름, 학교, 학부모연락처, 학생연락처 순서로 복사 후 붙여넣기 (탭 또는 쉼표 구분)</p>
      <textarea className="w-full bg-slate-50 rounded-xl px-4 py-3 text-xs border-0 resize-none h-32 font-mono focus:outline-none" value={importText} onChange={e=>setImportText(e.target.value)} placeholder={"김민서\t경기여고\t01012345678\t01098765432\n박지성\t단대부고\t01011112222\t01033334444"}/>
      <div className="flex gap-2 mt-3"><button onClick={importFromText} className="bg-[#D4AF37] text-white px-4 py-2 rounded-xl text-xs font-semibold">일괄 추가</button><button onClick={()=>setShowImport(false)} className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-2.5 py-1 rounded-lg bg-slate-100 transition-colors">취소</button></div>
    </div>}

    {showAdd&&<div className="bg-white rounded-2xl p-5 shadow-sm mb-4 border border-[#D4AF37]/20">
      <h3 className="font-semibold text-sm mb-3">새 학생</h3>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div><label className="text-[10px] font-semibold text-slate-400">이름 *</label><input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div>
        <div><label className="text-[10px] font-semibold text-slate-400">학교</label><input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0" value={form.school} onChange={e=>setForm(p=>({...p,school:e.target.value}))}/></div>
        <div><label className="text-[10px] font-semibold text-slate-400">학부모 연락처 *</label><input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0" value={form.parent_phone} onChange={e=>setForm(p=>({...p,parent_phone:e.target.value}))} placeholder="01064382222"/></div>
        <div><label className="text-[10px] font-semibold text-slate-400">학생 연락처</label><input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0" value={form.student_phone} onChange={e=>setForm(p=>({...p,student_phone:e.target.value}))}/></div>
      </div>
      {groups.length>0&&<div className="mb-3"><label className="text-[10px] font-semibold text-slate-400">소속 반</label><div className="flex flex-wrap gap-2 mt-1">{groups.map(g=>(<button key={g.id} onClick={()=>toggleClass(g.id)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${form.class_ids.includes(g.id)?"bg-[#D4AF37] text-white":"bg-slate-100 text-slate-500"}`}>{g.name}</button>))}</div></div>}
      {form.name&&form.parent_phone&&<p className="text-xs text-slate-400 mb-3">아이디: <b className="text-[#D4AF37]">{form.name}{form.parent_phone.slice(-4)}</b> / 비번: <b>{form.parent_phone.slice(-4)}</b></p>}
      <div className="flex gap-2"><button onClick={addStudent} className="bg-[#D4AF37] text-white px-4 py-2 rounded-xl text-xs font-semibold">추가</button><button onClick={()=>setShowAdd(false)} className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-2.5 py-1 rounded-lg bg-slate-100 transition-colors">취소</button></div>
    </div>}

    {editStu&&<div className="bg-white rounded-2xl p-5 shadow-sm mb-4 border border-amber-200">
      <h3 className="font-semibold text-sm mb-3">✏️ 학생 정보 수정 — {editStu.name}</h3>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div><label className="text-[10px] font-semibold text-slate-400">이름 *</label><input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0" value={editForm.name} onChange={e=>setEditForm(p=>({...p,name:e.target.value}))}/></div>
        <div><label className="text-[10px] font-semibold text-slate-400">학교</label><input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0" value={editForm.school} onChange={e=>setEditForm(p=>({...p,school:e.target.value}))}/></div>
        <div><label className="text-[10px] font-semibold text-slate-400">학부모 연락처 *</label><input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0" value={editForm.parent_phone} onChange={e=>setEditForm(p=>({...p,parent_phone:e.target.value}))}/></div>
        <div><label className="text-[10px] font-semibold text-slate-400">학생 연락처</label><input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0" value={editForm.student_phone} onChange={e=>setEditForm(p=>({...p,student_phone:e.target.value}))}/></div>
      </div>
      {editForm.name&&editForm.parent_phone&&<p className="text-xs text-slate-400 mb-3">변경될 아이디: <b className="text-[#D4AF37]">{editForm.name}{editForm.parent_phone.slice(-4)}</b> / 비번: <b>{editForm.parent_phone.slice(-4)}</b></p>}
      <div className="flex gap-2"><button onClick={saveEditStu} className="bg-[#D4AF37] text-white px-4 py-2 rounded-xl text-xs font-semibold">저장</button><button onClick={()=>setEditStu(null)} className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-2.5 py-1 rounded-lg bg-slate-100 transition-colors">취소</button></div>
    </div>}

    <div className="bg-white rounded-2xl shadow-sm overflow-x-auto"><table className="w-full text-sm"><thead><tr className="bg-slate-50"><th className="px-3 py-3 text-left w-10"><input type="checkbox" checked={sortedStudents.length>0&&checked.size===sortedStudents.length} onChange={toggleAll} className="w-4 h-4 rounded border-slate-300 text-[#D4AF37] cursor-pointer accent-[#D4AF37]"/></th>{["이름","반","학교","아이디","학부모","학생",""].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400">{h}</th>)}</tr></thead><tbody>{sortedStudents.map((s:any)=>{const gids=stuGroups[s.id]||[];const sGroups=groups.filter((g:any)=>gids.includes(g.id));return(<tr key={s.id} className={`border-t border-slate-50 transition-colors ${checked.has(s.id)?"bg-red-50/50":"hover:bg-slate-50/50"}`}><td className="px-3 py-3"><input type="checkbox" checked={checked.has(s.id)} onChange={()=>toggleCheck(s.id)} className="w-4 h-4 rounded border-slate-300 text-[#D4AF37] cursor-pointer accent-[#D4AF37]"/></td><td className="px-4 py-3 font-semibold">{s.login_id||s.name}</td><td className="px-3 py-2"><div className="flex flex-wrap gap-1">{sGroups.length>0?sGroups.map((g:any)=>(<span key={g.id} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#AA8C2C] whitespace-nowrap">{g.name}</span>)):<span className="text-[10px] text-slate-300">미배정</span>}</div></td><td className="px-4 py-3 text-xs text-slate-500">{s.school||"—"}</td><td className="px-4 py-3 font-mono text-xs text-[#D4AF37]">{s.login_id}</td><td className="px-4 py-3 text-xs text-slate-500">{s.parent_phone||"—"}</td><td className="px-4 py-3 text-xs text-slate-500">{s.student_phone||s.phone||"—"}</td><td className="px-4 py-3 text-right flex gap-2 justify-end"><button onClick={()=>startEdit(s)} className="text-xs font-semibold text-slate-700 hover:text-[#D4AF37] transition-colors px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#D4AF37]/10">수정</button><button onClick={()=>removeStudent(s.id)} className="text-xs font-semibold text-slate-700 hover:text-red-500 transition-colors px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50">삭제</button></td></tr>)})}{sortedStudents.length===0&&<tr><td colSpan={8} className="text-center py-10 text-slate-400 text-sm">학생을 추가하세요</td></tr>}</tbody></table></div>
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
  // 선택문항 설정 state
  const[secCfg,setSecCfg]=useState({has_sections:false,common_count:0,section1_name:"선택1",section2_name:"선택2",section1_count:0,section2_count:0});
  const[showSecCfg,setShowSecCfg]=useState(false);

  // 성적표 이미지 캡쳐
  const[capComputedRates,setCapComputedRates]=useState<Record<number,number>>({});
  const captureReport=async(uid:number)=>{
    const computedRates:Record<number,number>={};
    for(const q of qs){
      const qn=q.question_number;let correct=0;let total=0;
      for(const mem of members){const k=`${mem.user_id}-${qn}`;const v=grid[k];if(v===1||v===0){total++;if(v===1)correct++;}}
      computedRates[qn]=total>0?Math.round((correct/total)*100):(q.correct_rate||0);
    }
    setCapComputedRates(computedRates);
    setCapId(uid);
    await new Promise(r=>setTimeout(r,600));
    if(!capRef.current){setCapId(null);return;}
    // 캡쳐 전: 글래스 효과 제거 style 임시 주입
    const styleEl=document.createElement("style");
    styleEl.id="cap-override";
    styleEl.textContent=`
      #cap-area .ios-glass-card, #cap-area .ios-glass-card::before, #cap-area .ios-glass-card::after {
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        animation: none !important;
        background: #ffffff !important;
        box-shadow: 0 1px 4px rgba(0,0,0,0.08) !important;
      }
      #cap-area { background: #f8fafc !important; }
    `;
    document.head.appendChild(styleEl);
    await new Promise(r=>setTimeout(r,80));
    try{
      const html2canvas=(await import("html2canvas")).default;
      const canvas=await html2canvas(capRef.current,{backgroundColor:"#f0f2f8",scale:2,useCORS:true,logging:false,allowTaint:true,removeContainer:true,imageTimeout:0,onclone:(doc)=>{Array.from(doc.styleSheets).forEach(ss=>{try{Array.from(ss.cssRules||[]).forEach((rule:any,i)=>{try{const txt=rule.cssText||"";if(txt.includes("lab(")||txt.includes("oklch(")||txt.includes("lch(")||txt.includes("color(")){ss.deleteRule(i);}}catch{}});}catch{}});}});
      const blob:Blob=await new Promise(r=>canvas.toBlob(b=>r(b!),"image/png"));
      if(!blob){setCapId(null);return;}
      try{await navigator.clipboard.write([new ClipboardItem({"image/png":blob})]);alert("📷 성적표 이미지가 클립보드에 복사되었습니다!\n카톡에서 Ctrl+V로 붙여넣기 하세요.");}
      catch{
        const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`성적표_${members.find(m=>m.user_id===uid)?.users?.name||"학생"}.png`;document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);alert("📷 성적표 이미지가 다운로드되었습니다!");
      }
    }catch(e){console.error("캡쳐 오류:",e);alert("캡쳐 실패: "+e);}
    // 캡쳐 후: style 제거
    document.getElementById("cap-override")?.remove();
    setCapId(null);
  };
  const approved=users.filter((u:any)=>u.status==="approved"&&u.role!=="admin");
  const fG=async()=>{const{data}=await supabase.from("class_groups").select("*").order("created_at");if(data)setGroups(data);};
  const fM=async(gid:number)=>{const{data}=await supabase.from("class_members").select("*, users:user_id(*)").eq("class_group_id",gid);if(data){const sorted=[...data].sort((a:any,b:any)=>(a.users?.name||"").localeCompare(b.users?.name||"",'ko'));setMembers(sorted);return sorted;}return[];};
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

  const loadGrid=async(test:any)=>{
    setSelT(test);setSaveMsg("");
    // 선택문항 설정 로드
    setSecCfg({has_sections:test.has_sections||false,common_count:test.common_count||0,section1_name:test.section1_name||"선택1",section2_name:test.section2_name||"선택2",section1_count:test.section1_count||0,section2_count:test.section2_count||0});
    const{data:q}=await supabase.from("test_questions").select("*").eq("test_id",test.id).order("question_number");if(q)setQs(q);const{data:res}=await supabase.from("test_results").select("*").eq("test_id",test.id);const{data:infos}=await supabase.from("test_student_info").select("*").eq("test_id",test.id);const g:any={};const ig2:any={};members.forEach((m:any)=>{const uid=m.user_id;ig2[uid]={attendance:"",clinic_time:"",assignment_score:"",wrong_answer_score:"",comment:"",student_id:uid,selected_section:""};});if(res)res.forEach((r:any)=>{const uid=members.find((m:any)=>m.user_id===r.student_id)?.user_id;if(uid!==undefined)g[`${uid}-${r.question_number}`]=r.is_correct?1:0;});if(infos)infos.forEach((si:any)=>{const uid=members.find((m:any)=>m.user_id===si.student_id)?.user_id;if(uid!==undefined)ig2[uid]={...ig2[uid],...si};});setGrid(g);setIg(ig2);
  };

  const setC=(uid:number,qn:number,val:string)=>{const k=`${uid}-${qn}`;setGrid((p:any)=>{const n={...p};if(val==="")delete n[k];else n[k]=Number(val);return n;});};
  const setIC=(uid:number,key:string,val:string)=>{setIg((p:any)=>({...p,[uid]:{...p[uid],[key]:val}}));};
  const getS=(uid:number)=>{let c=0;const selSec2=ig[uid]?.selected_section||"";qs.forEach(q=>{const qSec=q.section||"common";if(secCfg.has_sections&&qSec!=="common"&&qSec!==selSec2)return;if(grid[`${uid}-${q.question_number}`]===1)c++;});return c;};
  const hasA=(uid:number)=>qs.some(q=>grid[`${uid}-${q.question_number}`]!==undefined);
  // 실시간 문항별 정답률 (grid/ig 변경 즉시 반영)
  const liveRates:Record<number,{correct:number;total:number;rate:number}>=(() => {
    const r:Record<number,{correct:number;total:number;rate:number}>={};
    qs.forEach(q=>{
      const qn=q.question_number;const qSec=q.section||"common";
      let total=0,correct=0;
      members.forEach((m:any)=>{
        const uid=m.user_id;const v=grid[`${uid}-${qn}`];
        if(v===undefined)return;
        if(secCfg.has_sections&&qSec!=="common"){if((ig[uid]?.selected_section||"")!==qSec)return;}
        total++;if(v===1)correct++;
      });
      r[qn]={correct,total,rate:total>0?Math.round((correct/total)*100):0};
    });
    return r;
  })();

  // 드래그 선택 상태
  const[selCells,setSelCells]=useState<Set<string>>(new Set());
  const[dragging,setDragging]=useState(false);
  const dragStart=useRef<string|null>(null);
  const dragEnd=useRef<string|null>(null);
  const getCellRange=(a:string,b:string)=>{const[ar,ac]=a.split("-").map(Number);const[br,bc]=b.split("-").map(Number);const r1=Math.min(ar,br),r2=Math.max(ar,br),c1=Math.min(ac,bc),c2=Math.max(ac,bc);const s=new Set<string>();for(let r=r1;r<=r2;r++)for(let c=c1;c<=c2;c++)s.add(`${r}-${c}`);return s;};
  const onCellMouseDown=(ri:number,ci:number)=>{const k=`${ri}-${ci}`;dragStart.current=k;dragEnd.current=k;setSelCells(new Set([k]));setDragging(true);};
  const onCellMouseEnter=(ri:number,ci:number)=>{if(!dragging||!dragStart.current)return;const k=`${ri}-${ci}`;dragEnd.current=k;setSelCells(getCellRange(dragStart.current,k));};
  const onCellMouseUp=()=>{setDragging(false);};
  useEffect(()=>{const up=()=>{setDragging(false);};window.addEventListener("mouseup",up);return()=>window.removeEventListener("mouseup",up);},[]);
  // 선택된 셀에 일괄 값 적용
  const applyToSelected=(val:string)=>{if(selCells.size<=1)return;setGrid((p:any)=>{const n={...p};selCells.forEach(ck=>{const[ri2,ci2]=ck.split("-").map(Number);const m2=members[ri2];const q2=qs[ci2];if(!m2||!q2)return;const gk=`${m2.user_id}-${q2.question_number}`;if(val==="")delete n[gk];else n[gk]=Number(val);});return n;});};
  // 셀 키보드 핸들러 (화살표 + 즉시 덮어쓰기 + 드래그 삭제)
  const cellKeyDown=(e:React.KeyboardEvent<HTMLInputElement>,ri:number,ci:number,uid:number,qn:number)=>{
    const ar={ArrowUp:[-1,0],ArrowDown:[1,0],ArrowLeft:[0,-1],ArrowRight:[0,1]}[e.key] as [number,number]|undefined;
    if(ar){e.preventDefault();const nr=ri+ar[0],nc=ci+ar[1];const next=document.querySelector(`input[data-grid-row="${nr}"][data-grid-col="${nc}"]`) as HTMLInputElement;if(next){next.focus();next.select();}return;}
    if(e.key==="0"||e.key==="1"){e.preventDefault();setC(uid,qn,e.key);if(selCells.size>1)applyToSelected(e.key);
      // 자동으로 오른쪽 이동
      const next=document.querySelector(`input[data-grid-row="${ri}"][data-grid-col="${ci+1}"]`) as HTMLInputElement;if(next){next.focus();next.select();}return;}
    if(e.key==="Delete"||e.key==="Backspace"){e.preventDefault();setC(uid,qn,"");if(selCells.size>1)applyToSelected("");return;}
  };

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
    const pay={test_id:testId,student_id:sid,total_score:sc,class_average:avgR,class_best:best,std_dev:stdR,attendance:inf.attendance||"",assignment_score:inf.assignment_score||"",wrong_answer_score:inf.wrong_answer_score||"",clinic_time:inf.clinic_time||"",comment:inf.comment||"",selected_section:inf.selected_section||""};
      const{data:ex}=await supabase.from("test_student_info").select("id").eq("test_id",testId).eq("student_id",sid).single();
      if(ex){const{error:upErr}=await supabase.from("test_student_info").update(pay).eq("id",ex.id);if(upErr)errors.push("정보수정:"+upErr.message);}
      else{const{error:inErr}=await supabase.from("test_student_info").insert(pay);if(inErr)errors.push("정보저장:"+inErr.message);}
    }
    // 정답률 계산 — 공통문항은 전체, 선택문항은 해당 선택지 응시자만
    for(const q of qs){
      const qn=q.question_number;
      const sec=q.section||"common";
      let respondents:number[];
      if(!secCfg.has_sections||sec==="common"){
        // 공통: 이 문항에 답한 학생 전체
        respondents=members.filter((m:any)=>grid[`${m.user_id}-${qn}`]!==undefined).map((m:any)=>m.user_id);
      } else {
        // 선택지: 해당 선택지를 선택한 학생만
        respondents=members.filter((m:any)=>{const inf2=ig[m.user_id]||{};return inf2.selected_section===sec&&grid[`${m.user_id}-${qn}`]!==undefined;}).map((m:any)=>m.user_id);
      }
      const correct=respondents.filter(uid=>grid[`${uid}-${qn}`]===1).length;
      const total=respondents.length;
      const r=total>0?Math.round((correct/total)*100):0;
      const{error:qErr}=await supabase.from("test_questions").update({correct_rate:r,section:sec}).eq("id",q.id);
      if(qErr)errors.push("문항업데이트:"+qErr.message);
    }
    // 등수 계산 및 저장
    const ranked=members.filter((m:any)=>hasA(m.user_id)).map((m:any)=>({uid:m.user_id,score:getS(m.user_id)})).sort((a,b)=>b.score-a.score);
    for(let i=0;i<ranked.length;i++){const rank=i+1;const{error:rkErr}=await supabase.from("test_student_info").update({rank}).eq("test_id",testId).eq("student_id",ranked[i].uid);if(rkErr)errors.push("등수저장:"+rkErr.message);}
    if(errors.length>0)setSaveMsg("❌ "+errors.slice(0,3).join(" | "));
    else{setSaveMsg("✅ 저장 완료!");
      // 정답률 재조회 → qs state 업데이트 (항상 question_number 순으로)
      const{data:freshQs}=await supabase.from("test_questions").select("*").eq("test_id",testId).order("question_number",{ascending:true});
      if(freshQs)setQs(freshQs);
      // 알림 발송 → 학생 뷰에서 fNotifs 감지 → ld() 재호출 → questions 갱신 → wrong 재계산
      for(const m of members){if(hasA(m.user_id))await sendNotif(m.user_id,"grade",`📊 새 성적표: ${selT.title}`);}
      // 자동 서서갈비 지급 (오답/과제 성취도 기준)
      try{
        const{data:stData}=await supabase.from("site_settings").select("*");const st:any={};if(stData)stData.forEach((r:any)=>{st[r.key]=r.value;});
        const autoEnabled=st.auto_token_enabled!=="false";
        if(autoEnabled){
          const wrongPct=Number(st.auto_wrong_pct||70);const wrongReward=Number(st.auto_wrong_reward||1);
          const assignPct=Number(st.auto_assign_pct||70);const assignReward=Number(st.auto_assign_reward||1);
          for(const m of members){
            const uid=m.user_id;if(!hasA(uid))continue;const inf=ig[uid]||{};
            const wrongVal=(inf.wrong_answer_score||"").startsWith("미제출")?0:parseFloat(String(inf.wrong_answer_score||"0").replace(/%/g,""));
            const assignVal=(inf.assignment_score||"").startsWith("미제출")?0:parseFloat(String(inf.assignment_score||"0").replace(/[^0-9.]/g,""));
            let totalReward=0;const reasons:string[]=[];
            // 고정 reason 키: 시험ID 기반 (퍼센트 값 무관하게 시험당 1회만)
            const wrongKey=`자동:오답성취도(test_${testId})`;
            const assignKey=`자동:과제성취도(test_${testId})`;
            // 오답 성취도 체크
            if(wrongVal>=wrongPct&&wrongReward>0){
              const{data:dupW}=await supabase.from("token_logs").select("id").eq("user_id",uid).like("reason",`자동:오답성취도(test_${testId})%`).single();
              if(!dupW){totalReward+=wrongReward;reasons.push(`오답 ${wrongVal}%`);}
            }
            // 과제 성취도 체크
            if(assignVal>=assignPct&&assignReward>0){
              const{data:dupA}=await supabase.from("token_logs").select("id").eq("user_id",uid).like("reason",`자동:과제성취도(test_${testId})%`).single();
              if(!dupA){totalReward+=assignReward;reasons.push(`과제 ${assignVal}%`);}
            }
            if(totalReward>0){
              const{data:uData}=await supabase.from("users").select("tokens").eq("id",uid).single();const curTokens=uData?.tokens||0;
              await supabase.from("users").update({tokens:curTokens+totalReward}).eq("id",uid);
              if(reasons.some(r=>r.startsWith("오답")))await supabase.from("token_logs").insert({user_id:uid,amount:wrongReward,reason:wrongKey});
              if(reasons.some(r=>r.startsWith("과제")))await supabase.from("token_logs").insert({user_id:uid,amount:assignReward,reason:assignKey});
              await sendNotif(uid,"token",`🥩 서서갈비 ${totalReward}개 자동 지급! (${reasons.join(", ")})`);
            }
          }
        }
      }catch(e){console.error("자동지급 오류:",e);}
    }
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
  // 선택문항 설정 저장
  const saveSecCfg=async()=>{
    if(!selT)return;
    const totalQ=qs.length;
    const secCount=Math.floor((totalQ-secCfg.common_count)/2);
    const s1c=secCount;const s2c=secCount;
    const cfg={...secCfg,section1_count:s1c,section2_count:s2c};
    await supabase.from("tests").update({has_sections:cfg.has_sections,common_count:cfg.common_count,section1_name:cfg.section1_name,section2_name:cfg.section2_name,section1_count:s1c,section2_count:s2c}).eq("id",selT.id);
    if(cfg.has_sections){
      const commonEnd=cfg.common_count;
      const sec1End=commonEnd+s1c;
      // 병렬로 한번에 업데이트해서 순서 문제 방지
      await Promise.all(qs.map(q=>{
        const qn=q.question_number;
        const sec=qn<=commonEnd?"common":qn<=sec1End?"opt1":"opt2";
        return supabase.from("test_questions").update({section:sec}).eq("id",q.id);
      }));
      setSecCfg(p=>({...p,section1_count:s1c,section2_count:s2c}));
    } else {
      // 선택문항 OFF → 모든 문항 section 초기화
      await Promise.all(qs.map(q=>supabase.from("test_questions").update({section:"common"}).eq("id",q.id)));
    }
    // 항상 question_number 순으로 재조회
    const{data:freshQ}=await supabase.from("test_questions").select("*").eq("test_id",selT.id).order("question_number",{ascending:true});
    if(freshQ)setQs(freshQ);
    setShowSecCfg(false);
    alert(`저장 완료! 공통 ${cfg.common_count}문항 · 선택1 ${s1c}문항 · 선택2 ${s2c}문항`);
  };

  // Excel view
  if(selT&&selG){
    const scores=members.filter((m:any)=>hasA(m.user_id)).map((m:any)=>getS(m.user_id));
    const avg=scores.length>0?(scores.reduce((a,b)=>a+b,0)/scores.length):0;
    const best=scores.length>0?Math.max(...scores):0;
    const stdDev=scores.length>1?Math.sqrt(scores.reduce((a,b)=>a+Math.pow(b-avg,2),0)/scores.length):0;
    return(<div>
      <button onClick={()=>setSelT(null)} className="flex items-center gap-1 text-sm text-slate-400 mb-3"><Icon type="back" size={16}/>돌아가기</button>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2"><div><h2 className="text-lg font-bold">{selT.title}</h2><p className="text-xs text-slate-400">{fmtDate(selT.date)} · 과제: {selT.assignment||"없음"}</p></div><div className="flex items-center gap-3"><button onClick={saveAll} disabled={saving} className="bg-[#D4AF37] text-white px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50">{saving?"저장 중...":"💾 전체 저장"}</button>{saveMsg&&<span className={`text-sm font-semibold ${saveMsg.includes("완료")?"text-green-500":"text-red-500"}`}>{saveMsg}</span>}</div></div>
      <div className="bg-white rounded-2xl shadow-sm mb-4 overflow-x-auto" onMouseUp={onCellMouseUp} style={{userSelect:"none"}}><table className="text-xs border-collapse w-full"><thead><tr className="bg-slate-50"><th className="sticky left-0 bg-slate-50 z-10 px-3 py-2 text-left font-semibold text-slate-500 min-w-[80px]">이름</th><th className="px-2 py-2 font-semibold text-slate-500 min-w-[50px]">총점</th>{secCfg.has_sections&&<th className="px-2 py-2 font-semibold text-slate-500 min-w-[60px]">선택지</th>}{qs.map(q=>{const sec=q.section||"common";const bg=secCfg.has_sections?(sec==="opt1"?"#dbeafe":sec==="opt2"?"#dcfce7":""):"";;return(<th key={q.question_number} className="px-0.5 py-2 font-semibold text-slate-400 min-w-[26px] text-center" style={{background:bg,borderRadius:"4px"}}>{q.question_number}</th>);})}</tr>
        <tr className="bg-blue-50/40 border-b border-blue-100"><td className="sticky left-0 bg-blue-50/60 z-10 px-3 py-1 text-[9px] font-bold text-blue-400">정답률</td><td className="px-2 py-1 text-center text-[9px] text-slate-300">—</td>{secCfg.has_sections&&<td className="px-2 py-1"/>}{qs.map(q=>{const lr=liveRates[q.question_number];const rate=lr?.rate??0;const total=lr?.total??0;const color=rate>=80?"#22c55e":rate>=50?"#3b82f6":rate>=30?"#f97316":"#ef4444";return(<td key={q.question_number} className="px-0.5 py-1 text-center">{total>0?<span className="text-[9px] font-bold" style={{color}}>{rate}%</span>:<span className="text-[9px] text-slate-200">—</span>}</td>);})}</tr>
      </thead><tbody>{members.map((m:any,ri:number)=>{const uid=m.user_id;const usr=m.users;const sc=getS(uid);const ans=hasA(uid);const selSec=ig[uid]?.selected_section||"";return(<tr key={uid} className="border-b border-slate-50"><td className="sticky left-0 bg-white z-10 px-3 py-2 font-semibold text-slate-700">{usr?.login_id||usr?.name||"?"}</td><td className="px-2 py-2 text-center font-bold text-[#D4AF37]">{ans?sc:"미응시"}</td>{secCfg.has_sections&&<td className="px-1 py-1"><select className="bg-slate-50 rounded-lg px-1 py-1 text-[10px] border-0 w-full font-semibold" value={selSec} onChange={e=>setIC(uid,"selected_section",e.target.value)}><option value="">미선택</option><option value="opt1">{secCfg.section1_name}</option><option value="opt2">{secCfg.section2_name}</option></select></td>}{qs.map((q,ci:number)=>{const k=`${uid}-${q.question_number}`;const v=grid[k];const cellKey=`${ri}-${ci}`;const isSel=selCells.has(cellKey);const qSec=q.section||"common";
        // 선택지 문항: 본인이 선택한 선택지만 활성. 미선택이면 선택지 모두 비활성
        const isDisabled=secCfg.has_sections&&qSec!=="common"&&(selSec===""||selSec!==qSec);return(<td key={q.question_number} className="px-0.5 py-1 text-center" style={{opacity:isDisabled?0.15:1}} onMouseDown={isDisabled?undefined:()=>onCellMouseDown(ri,ci)} onMouseEnter={isDisabled?undefined:()=>onCellMouseEnter(ri,ci)}><input data-grid-row={ri} data-grid-col={ci} readOnly disabled={isDisabled} className={`w-6 h-6 text-center rounded font-bold text-[10px] border cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#D4AF37] ${isSel?"ring-2 ring-[#D4AF37] border-[#D4AF37]":v===1?"bg-blue-50 border-blue-200 text-blue-600":v===0?"bg-red-50 border-red-200 text-red-500":"bg-white border-slate-200"}`} value={v===undefined?"":v} onKeyDown={isDisabled?undefined:e=>cellKeyDown(e,ri,ci,uid,q.question_number)} onFocus={e=>e.target.select()}/></td>);})}</tr>);})}</tbody></table>{selCells.size>1&&<div className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/5 border-t border-[#D4AF37]/10"><span className="text-xs text-[#D4AF37] font-semibold">{selCells.size}개 선택됨</span><button onClick={()=>applyToSelected("1")} className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg text-xs font-bold">전체 O</button><button onClick={()=>applyToSelected("0")} className="bg-red-50 text-red-500 px-2.5 py-1 rounded-lg text-xs font-bold">전체 X</button><button onClick={()=>{applyToSelected("");setSelCells(new Set());}} className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg text-xs font-bold">전체 삭제</button><button onClick={()=>setSelCells(new Set())} className="text-xs text-slate-400 ml-auto">선택 해제</button></div>}</div>
      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto mb-4"><table className="text-xs border-collapse w-full"><thead><tr className="bg-slate-50"><th className="sticky left-0 bg-slate-50 z-10 px-3 py-2 text-left font-semibold text-slate-500 min-w-[80px]">이름</th><th className="px-2 py-2 font-semibold text-slate-500">출석</th><th className="px-2 py-2 font-semibold text-slate-500">클리닉</th><th className="px-2 py-2 font-semibold text-slate-500">과제 성취도</th><th className="px-2 py-2 font-semibold text-slate-500">오답 성취도</th><th className="px-2 py-2 font-semibold text-slate-500 min-w-[280px]">개인 코멘트</th></tr></thead><tbody>{members.map((m:any)=>{const uid=m.user_id;const usr=m.users;const inf=ig[uid]||{};return(<tr key={uid} className="border-b border-slate-50"><td className="sticky left-0 bg-white z-10 px-3 py-2 font-semibold"><div className="flex items-center gap-1">{usr?.login_id||usr?.name||"?"}{(inf.attendance==="출석"||inf.attendance==="영상")&&<button onClick={()=>captureReport(uid)} className="text-[9px] font-semibold text-slate-600 hover:text-[#D4AF37] bg-slate-100 px-1.5 py-0.5 rounded transition-colors">📷</button>}</div></td><td className="px-1 py-1"><select className="bg-slate-50 rounded-lg px-2 py-1.5 text-xs border-0 w-full" value={inf.attendance||""} onChange={e=>setIC(uid,"attendance",e.target.value)}><option value="">—</option><option>출석</option><option>결석</option><option>영상</option></select></td><td className="px-1 py-1" style={{minWidth:"140px"}}><div className="flex flex-col gap-1">
  <select className="bg-slate-50 rounded-lg px-2 py-1.5 text-xs border-0 w-full" value={(()=>{const v=inf.clinic_time||"";if(v.startsWith("참석"))return"참석";if(v.startsWith("불참"))return"불참";return"";})()}
    onChange={e=>{const sel=e.target.value;if(sel==="참석"){setIC(uid,"clinic_time","참석");}else if(sel==="불참"){setIC(uid,"clinic_time","불참");}else{setIC(uid,"clinic_time","");}}}>
    <option value="">선택 안 함</option><option value="참석">참석</option><option value="불참">불참</option>
  </select>
  {(inf.clinic_time||"").startsWith("참석")&&<input className="bg-slate-50 rounded-lg px-2 py-1 text-[10px] border-0 w-full" placeholder="(예)금2:20-5:30"
    value={(inf.clinic_time||"").replace(/^참석\s*/,"").replace(/^\(|\)$/g,"").trim()}
    onChange={e=>{setIC(uid,"clinic_time",e.target.value?"참석 ("+e.target.value+")":"참석");}}/>}
</div></td>
<td className="px-1 py-1" style={{minWidth:"110px"}}><div className="flex flex-col gap-1">
  <input className="bg-slate-50 rounded-lg px-2 py-1.5 text-xs border-0 w-full" placeholder="(예)90"
    disabled={(inf.assignment_score||"").startsWith("미제출")}
    value={(inf.assignment_score||"").startsWith("미제출")?"":((inf.assignment_score||"").replace("+ 추가과제 👍","").trim())}
    onChange={e=>{const hasB=(inf.assignment_score||"").includes("추가과제");setIC(uid,"assignment_score",e.target.value.trim()+(hasB?"+ 추가과제 👍":""));}}
    style={{opacity:(inf.assignment_score||"").startsWith("미제출")?0.35:1}}/>
  <div className="flex gap-2 px-0.5">
    <label className="flex items-center gap-1 cursor-pointer">
      <input type="checkbox" className="w-3 h-3 accent-[#D4AF37]"
        checked={(inf.assignment_score||"").includes("추가과제")}
        disabled={(inf.assignment_score||"").startsWith("미제출")}
        onChange={e=>{const s=(inf.assignment_score||"").replace("+ 추가과제 👍","").trim();setIC(uid,"assignment_score",s+(e.target.checked?"+ 추가과제 👍":""));}}/>
      <span className="text-[10px] text-slate-400">추가👍</span>
    </label>
    <label className="flex items-center gap-1 cursor-pointer">
      <input type="checkbox" className="w-3 h-3 accent-red-400"
        checked={(inf.assignment_score||"").startsWith("미제출")}
        onChange={e=>{setIC(uid,"assignment_score",e.target.checked?"미제출":"");}}/>
      <span className="text-[10px] text-slate-400">미제출</span>
    </label>
  </div>
</div></td>
<td className="px-1 py-1" style={{minWidth:"100px"}}><div className="flex flex-col gap-1">
  <input className="bg-slate-50 rounded-lg px-2 py-1.5 text-xs border-0 w-full" placeholder="(예)50"
    disabled={(inf.wrong_answer_score||"").startsWith("미제출")}
    value={(inf.wrong_answer_score||"").startsWith("미제출")?"":((inf.wrong_answer_score||"").trim())}
    onChange={e=>setIC(uid,"wrong_answer_score",e.target.value.trim())}
    style={{opacity:(inf.wrong_answer_score||"").startsWith("미제출")?0.35:1}}/>
  <label className="flex items-center gap-1 cursor-pointer px-0.5">
    <input type="checkbox" className="w-3 h-3 accent-red-400"
      checked={(inf.wrong_answer_score||"").startsWith("미제출")}
      onChange={e=>{setIC(uid,"wrong_answer_score",e.target.checked?"미제출":"");}}/>
    <span className="text-[10px] text-slate-400">미제출</span>
  </label>
</div></td><td className="px-1 py-1"><textarea className="bg-slate-50 rounded-lg px-2 py-1.5 text-xs border-0 w-full resize-none h-16" value={inf.comment||""} onChange={e=>setIC(uid,"comment",e.target.value)} placeholder="개인 코멘트"/></td></tr>);})}</tbody></table></div>
      <div className="bg-white rounded-2xl shadow-sm p-5"><h3 className="font-semibold text-sm mb-3">자동 계산 통계 (실시간)</h3><div className="grid grid-cols-3 gap-4 max-w-md"><div className="bg-slate-50 rounded-xl p-3 text-center"><p className="text-[10px] text-slate-400">반 평균</p><p className="text-xl font-bold text-[#D4AF37]">{(Math.round(avg*10)/10).toFixed(1)}</p></div><div className="bg-slate-50 rounded-xl p-3 text-center"><p className="text-[10px] text-slate-400">표준편차</p><p className="text-xl font-bold text-slate-600">{(Math.round(stdDev*10)/10).toFixed(1)}</p></div><div className="bg-slate-50 rounded-xl p-3 text-center"><p className="text-[10px] text-slate-400">최고점</p><p className="text-xl font-bold text-slate-600">{best}</p></div></div></div>
      <div className="bg-white rounded-2xl shadow-sm p-5 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">문항 설정</h3>
          <div className="flex items-center gap-3">
            <button onClick={()=>setShowSecCfg(!showSecCfg)} className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${secCfg.has_sections?"bg-blue-50 text-blue-600":"bg-slate-100 text-slate-500"}`}>⚙️ 선택문항 {secCfg.has_sections?"ON":"OFF"}</button>
            <label className="text-xs text-slate-400">문항수</label>
            <input type="number" className="w-16 bg-slate-50 rounded-lg px-2 py-1.5 text-sm border-0 text-center font-semibold" value={qs.length} onChange={e=>{const v=Number(e.target.value);if(v>=1&&v<=50)changeQCount(v);}}/>
          </div>
        </div>
        {/* 선택문항 설정 패널 */}
        {showSecCfg&&<div className="mb-4 p-4 bg-blue-50 rounded-2xl space-y-3 border border-blue-100">
          <p className="text-xs font-bold text-blue-700">📋 선택문항 구조 설정</p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={secCfg.has_sections} onChange={e=>setSecCfg(p=>({...p,has_sections:e.target.checked}))} className="w-4 h-4 accent-blue-500"/>
            <span className="text-xs font-semibold text-slate-700">선택문항 사용</span>
          </label>
          {secCfg.has_sections&&(()=>{
            const totalQ=qs.length;
            const secCount=Math.floor((totalQ-secCfg.common_count)/2);
            return(<>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[10px] font-semibold text-slate-500 block mb-1">전체 문항 수</label><input type="number" readOnly className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm border border-blue-100 text-center font-bold text-slate-500" value={totalQ}/></div>
                <div><label className="text-[10px] font-semibold text-slate-500 block mb-1">공통 문항 수</label><input type="number" className="w-full bg-white rounded-lg px-3 py-2 text-sm border border-blue-200 text-center font-semibold" value={secCfg.common_count} onChange={e=>setSecCfg(p=>({...p,common_count:Number(e.target.value),section1_count:Math.floor((totalQ-Number(e.target.value))/2),section2_count:Math.floor((totalQ-Number(e.target.value))/2)}))}/></div>
              </div>
              <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-xl border border-blue-100">
                <div>
                  <p className="text-[10px] font-bold text-blue-500 mb-2">선택1 ({secCfg.common_count+1}번 ~ {secCfg.common_count+secCount}번, {secCount}문항)</p>
                  <input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm border border-blue-200 font-semibold" placeholder="예) 확률과 통계" value={secCfg.section1_name} onChange={e=>setSecCfg(p=>({...p,section1_name:e.target.value}))}/>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-green-500 mb-2">선택2 ({secCfg.common_count+secCount+1}번 ~ {totalQ}번, {secCount}문항)</p>
                  <input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm border border-green-200 font-semibold" placeholder="예) 미적분" value={secCfg.section2_name} onChange={e=>setSecCfg(p=>({...p,section2_name:e.target.value}))}/>
                </div>
              </div>
              <p className="text-[10px] text-blue-400">공통 {secCfg.common_count}문항 · 선택1 {secCount}문항 · 선택2 {secCount}문항 = 총 {totalQ}문항</p>
            </>);
          })()}
          <button onClick={saveSecCfg} className="bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold">저장 및 문항 자동 분류</button>
        </div>}
        {/* 문항별 단원명 — 선택문항이면 두 컬럼으로 분리 */}
        {secCfg.has_sections?(()=>{
          const commonQs=qs.filter(q=>!q.section||q.section==="common");
          const opt1Qs=qs.filter(q=>q.section==="opt1");
          const opt2Qs=qs.filter(q=>q.section==="opt2");
          const topicInput=(q:any,color:string)=>(
            <div key={q.id} className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 w-5 text-right font-semibold">{q.question_number}</span>
              <input className="flex-1 bg-slate-50 rounded-lg px-2 py-1.5 text-xs border-0" defaultValue={q.topic||""} placeholder="단원명" onBlur={e=>saveTopic(q.id,e.target.value)} style={{borderLeft:`2px solid ${color}`}}/>
            </div>
          );
          return(<>
            {commonQs.length>0&&<><p className="text-[10px] font-bold text-slate-400 mt-1 mb-1">공통 문항</p><div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{commonQs.map(q=>topicInput(q,"#e2e8f0"))}</div></>}
            <div className="grid grid-cols-2 gap-4 mt-3">
              {opt1Qs.length>0&&<div><p className="text-[10px] font-bold text-blue-500 mb-1">{secCfg.section1_name} 문항</p><div className="space-y-1.5">{opt1Qs.map(q=>topicInput(q,"#3b82f6"))}</div></div>}
              {opt2Qs.length>0&&<div><p className="text-[10px] font-bold text-green-500 mb-1">{secCfg.section2_name} 문항</p><div className="space-y-1.5">{opt2Qs.map(q=>topicInput(q,"#22c55e"))}</div></div>}
            </div>
          </>);
        })()
        :<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{qs.map(q=>(<div key={q.id} className="flex items-center gap-1.5"><span className="text-xs text-slate-400 w-5 text-right font-semibold">{q.question_number}</span><input className="flex-1 bg-slate-50 rounded-lg px-2 py-1.5 text-xs border-0" defaultValue={q.topic||""} placeholder="단원명" onBlur={e=>saveTopic(q.id,e.target.value)}/></div>))}</div>}
      </div>
      {/* 숨겨진 성적표 캡쳐 영역 */}
      {capId!==null&&(()=>{const m=members.find((m:any)=>m.user_id===capId);if(!m)return null;const usr=m.users;const uid=m.user_id;const sc=getS(uid);const inf=ig[uid]||{};
      const mySelSec=inf.selected_section||"";
      const capQs=selT.has_sections?qs.filter(q=>{const sec=q.section||"common";return sec==="common"||(mySelSec&&sec===mySelSec);}):qs;
      const rm2:any={};capQs.forEach(q=>{const v=grid[`${uid}-${q.question_number}`];if(v!==undefined)rm2[q.question_number]=v===1;});
      const wrong2=capQs.filter(q=>rm2[q.question_number]===false).sort((a,b)=>(capComputedRates[a.question_number]??a.correct_rate??0)-(capComputedRates[b.question_number]??b.correct_rate??0));
      const capSecName=mySelSec==="opt1"?(selT.section1_name||"선택1"):mySelSec==="opt2"?(selT.section2_name||"선택2"):"";
      // 컨테이너: 440px, 패딩 20px×2 → 콘텐츠 400px
      // 카드 패딩 16px×2 → 카드 내부 368px → 차트는 368px
      const CONT=440;const PAD=20;const CPAD=16;const chartW=CONT-PAD*2-CPAD*2;
      const card:React.CSSProperties={background:"#ffffff",borderRadius:"16px",padding:`${CPAD}px`,marginBottom:"12px",boxShadow:"0 1px 6px rgba(0,0,0,0.07)",overflow:"hidden",boxSizing:"border-box" as const};
      return(
        <div style={{position:"fixed",left:"-9999px",top:0,pointerEvents:"none",zIndex:-1}}>
          <div ref={capRef} style={{width:`${CONT}px`,padding:`${PAD}px`,background:"#f0f2f8",fontFamily:"'Apple SD Gothic Neo','Malgun Gothic','Noto Sans KR',sans-serif",boxSizing:"border-box"}}>
            {/* 날짜 + 학생 정보 */}
            <div style={{textAlign:"center",marginBottom:"14px"}}>
              <p style={{fontSize:"20px",fontWeight:"bold",margin:"0 0 6px 0",color:"#1e293b"}}>{fmtDate(selT.date)}</p>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"6px"}}>
                <span style={{fontSize:"11px",background:"rgba(212,175,55,0.15)",color:"#D4AF37",padding:"2px 10px",borderRadius:"8px",fontWeight:"700"}}>{selT.class_name||""}</span>
                <span style={{fontSize:"13px",fontWeight:"600",color:"#334155"}}>{usr?.school||""} {usr?.name}</span>
              </div>
            </div>
            {/* 출석/클리닉/과제/오답 */}
            <div style={{...card,display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"8px",textAlign:"center"}}>
              <div><p style={{fontSize:"10px",color:"#94a3b8",margin:"0 0 3px 0"}}>출석</p><p style={{fontSize:"16px",fontWeight:"bold",margin:0,color:inf.attendance==="출석"?"#16a34a":inf.attendance==="영상"?"#d97706":"#ef4444"}}>{inf.attendance||"—"}</p></div>
              <div><p style={{fontSize:"10px",color:"#94a3b8",margin:"0 0 3px 0"}}>클리닉</p><p style={{fontSize:"13px",fontWeight:"600",margin:0}}>{inf.clinic_time||"—"}</p></div>
              <div><p style={{fontSize:"10px",color:"#94a3b8",margin:"0 0 3px 0"}}>과제</p><p style={{fontSize:"13px",fontWeight:"600",margin:0}}>{(()=>{const r=inf.assignment_score||"";if(!r)return"—";if(r.startsWith("미제출"))return"미제출";const num=r.replace("+ 추가과제 👍","").replace("+추가과제👍","").replace(/%/g,"").trim();return num?num+"%":"—";})()}</p></div>
              <div><p style={{fontSize:"10px",color:"#94a3b8",margin:"0 0 3px 0"}}>오답</p><p style={{fontSize:"13px",fontWeight:"600",margin:0}}>{(()=>{const r=inf.wrong_answer_score||"";if(!r)return"—";if(r.startsWith("미제출"))return"미제출";return r.replace(/%/g,"").trim()+"%";})()}</p></div>
            </div>
            {/* 개인 코멘트 */}
            {inf.comment&&<div style={{...card,textAlign:"center"}}>
              <p style={{fontSize:"10px",fontWeight:"bold",letterSpacing:"0.1em",textTransform:"uppercase",color:"#D4AF37",marginBottom:"6px"}}>선생님 코멘트</p>
              <p style={{fontSize:"14px",color:"#334155",lineHeight:1.6,margin:0,whiteSpace:"pre-line"}}>{inf.comment}</p>
            </div>}
            {/* 점수 4칸 */}
            <div style={{...card,display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"8px",textAlign:"center"}}>
              <div><p style={{fontSize:"10px",color:"#94a3b8",margin:"0 0 3px 0"}}>내 점수</p><p style={{fontSize:"26px",fontWeight:"bold",color:"#D4AF37",margin:0}}>{sc}<span style={{fontSize:"13px",color:"#94a3b8",fontWeight:"normal"}}>점</span></p></div>
              <div><p style={{fontSize:"10px",color:"#94a3b8",margin:"0 0 3px 0"}}>반 평균</p><p style={{fontSize:"20px",fontWeight:"bold",color:"#475569",margin:0}}>{(Math.round(avg*10)/10).toFixed(1)}<span style={{fontSize:"12px",color:"#94a3b8",fontWeight:"normal"}}>점</span></p></div>
              <div><p style={{fontSize:"10px",color:"#94a3b8",margin:"0 0 3px 0"}}>표준편차</p><p style={{fontSize:"20px",fontWeight:"bold",color:"#475569",margin:0}}>{(Math.round(stdDev*10)/10).toFixed(1)}<span style={{fontSize:"12px",color:"#94a3b8",fontWeight:"normal"}}>점</span></p></div>
              <div><p style={{fontSize:"10px",color:"#94a3b8",margin:"0 0 3px 0"}}>최고</p><p style={{fontSize:"20px",fontWeight:"bold",color:"#475569",margin:0}}>{best}<span style={{fontSize:"12px",color:"#94a3b8",fontWeight:"normal"}}>점</span></p></div>
            </div>
            {/* 문항별 결과 */}
            <div style={card}>
              <p style={{fontSize:"15px",fontWeight:"800",marginBottom:"10px",color:"#1e293b"}}>문항별 결과{capSecName&&<span style={{fontSize:"10px",color:"#94a3b8",fontWeight:"normal",marginLeft:"6px"}}>공통 + {capSecName}</span>}</p>
              {capQs.map(q=>{const rate=capComputedRates[q.question_number]??q.correct_rate??0;const isCorrect=rm2[q.question_number];const isCool=isCorrect&&rate<30;const isCry=!isCorrect&&rate>=80;return(
                <div key={q.question_number} style={{display:"flex",alignItems:"center",gap:"8px",padding:"4px 0",borderBottom:"1px solid rgba(0,0,0,0.04)"}}>
                  <span style={{fontSize:"12px",fontWeight:"bold",color:"#94a3b8",width:"20px",textAlign:"right",flexShrink:0}}>{q.question_number}</span>
                  <span style={{fontSize:"12px",color:"#64748b",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{q.topic||"—"}</span>
                  <span style={{fontSize:"14px",width:"20px",textAlign:"center",flexShrink:0}}>{isCool?"😎":isCry?"😭":""}</span>
                  <span style={{fontSize:"15px",fontWeight:"800",color:isCorrect?"#D4AF37":"#f87171",width:"24px",textAlign:"center",flexShrink:0}}>{isCorrect?"O":"X"}</span>
                  <span style={{fontSize:"10px",color:"#94a3b8",width:"32px",textAlign:"right",flexShrink:0}}>{rate}%</span>
                </div>
              );})}
            </div>
            {/* 정답률 차트 */}
            <div style={card}>
              <p style={{fontSize:"15px",fontWeight:"700",marginBottom:"10px",color:"#1e293b"}}>정답률</p>
              {(()=>{
                const barH=70;const labelH=36;const n=capQs.length;const barW=Math.max(10,Math.floor((chartW-(n-1)*2)/n));const gap=n>1?(chartW-barW*n)/(n-1):0;const dense=barW<16;
                return(<svg width={chartW} height={barH+labelH} style={{display:"block",overflow:"visible",maxWidth:"100%"}}>
                  {capQs.map((q,i)=>{const rate=capComputedRates[q.question_number]??q.correct_rate??0;const isCorrect=rm2[q.question_number];const bh=Math.max(3,Math.round(barH*(rate/100)));const x=i*(barW+gap);const cx=x+barW/2;return(
                    <g key={q.question_number}>
                      <rect x={x} y={barH-bh} width={barW} height={bh} rx={2} fill={isCorrect?"#D4AF37":"#ff6b6b"}/>
                      {dense?(<><text transform={`rotate(-45,${cx},${barH+8})`} x={cx} y={barH+8} textAnchor="end" fontSize={8} fill="#64748b" fontWeight="600">{q.question_number}</text><text transform={`rotate(-45,${cx},${barH+20})`} x={cx} y={barH+20} textAnchor="end" fontSize={7} fill="#94a3b8">{rate}%</text></>):(<><text x={cx} y={barH+13} textAnchor="middle" fontSize={9} fill="#64748b" fontWeight="600">{q.question_number}</text><text x={cx} y={barH+26} textAnchor="middle" fontSize={8} fill="#94a3b8">{rate}%</text></>)}
                    </g>
                  );})}
                </svg>);
              })()}
            </div>
            {/* 최다 오답 TOP 3 */}
            {wrong2.length>0&&<div style={card}>
              <p style={{fontSize:"15px",fontWeight:"700",marginBottom:"12px",color:"#1e293b"}}>최다 오답 TOP 3</p>
              <div style={{display:"flex",justifyContent:"center",gap:"24px"}}>
                {wrong2.slice(0,3).map(q=>{const rate=capComputedRates[q.question_number]??q.correct_rate??0;const circ=2*Math.PI*30;const filled=circ*(rate/100);const empty=circ-filled;return(
                  <div key={q.question_number} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"6px"}}>
                    <svg viewBox="0 0 68 68" width="56" height="56" style={{transform:"rotate(-90deg)"}}>
                      <circle cx="34" cy="34" r="30" fill="none" stroke="#f1f5f9" strokeWidth="5"/>
                      <circle cx="34" cy="34" r="30" fill="none" stroke="#ff6b6b" strokeWidth="5" strokeDasharray={`${filled} ${empty}`} strokeLinecap="round"/>
                    </svg>
                    <div style={{marginTop:"-42px",marginBottom:"14px",textAlign:"center"}}><p style={{fontSize:"14px",fontWeight:"bold",color:"#334155",margin:0}}>{q.question_number}</p><p style={{fontSize:"8px",color:"#94a3b8",margin:0}}>번</p></div>
                    <p style={{fontSize:"11px",fontWeight:"600",color:"#f87171",margin:0}}>{rate}%</p>
                    <p style={{fontSize:"10px",color:"#94a3b8",margin:0}}>{q.topic||"—"}</p>
                  </div>
                );})}
              </div>
            </div>}
          </div>
        </div>
      );})()}
    </div>);
  }

  // Group detail
  if(selG){
    const filtered=approved.filter(u=>!members.some((m:any)=>m.user_id===u.id)).filter(u=>!searchM||u.name?.includes(searchM)||u.login_id?.includes(searchM)||u.school?.includes(searchM));
    return(<div>
      <button onClick={()=>selectGroup(null)} className="flex items-center gap-1 text-sm text-slate-400 mb-3"><Icon type="back" size={16}/>반 목록</button>
      <div className="flex items-center gap-2 mb-4">{editingGId===selG.id?<div className="flex items-center gap-2"><input className="bg-slate-50 rounded-lg px-3 py-1.5 text-lg font-bold border border-slate-200 focus:outline-none focus:border-[#D4AF37]" value={editGN} onChange={e=>setEditGN(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")renameG(selG.id);if(e.key==="Escape"){setEditingGId(null);setEditGN("");}}} autoFocus/><button onClick={()=>renameG(selG.id)} className="text-xs text-[#D4AF37] font-semibold bg-[#D4AF37]/10 px-3 py-1.5 rounded-lg">확인</button><button onClick={()=>{setEditingGId(null);setEditGN("");}} className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-2.5 py-1 rounded-lg bg-slate-100 transition-colors">취소</button></div>:<><h2 className="text-lg font-bold">📁 {selG.name}</h2><button onClick={()=>{setEditingGId(selG.id);setEditGN(selG.name);}} className="text-xs font-semibold text-slate-700 hover:text-[#D4AF37] transition-colors px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-[#D4AF37]/10">✏️ 수정</button></>}</div>
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-4"><div className="flex justify-between items-center mb-3"><h3 className="font-semibold text-sm">학생 ({members.length}명)</h3><button onClick={()=>setShowAM(!showAM)} className="text-xs text-[#D4AF37] font-semibold">+ 학생 추가</button></div><div className="flex flex-wrap gap-2">{members.map((m:any)=>(<div key={m.id} className="bg-slate-50 rounded-lg px-3 py-1.5 text-xs flex items-center gap-2"><span className="font-medium">{m.users?.login_id||m.users?.name}</span><button onClick={()=>rM(m.id)} className="text-xs font-semibold text-slate-700 hover:text-red-500 transition-colors px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-red-50 !px-1.5">×</button></div>))}{members.length===0&&<p className="text-slate-400 text-xs">학생 추가 필요</p>}</div></div>
      {showAM&&<div className="bg-white rounded-2xl p-5 shadow-sm mb-4"><h3 className="font-semibold text-sm mb-3">학생 검색 / 추가</h3><div className="flex items-center gap-2 mb-3 bg-slate-50 rounded-xl px-3 py-2"><Icon type="search" size={16}/><input className="flex-1 bg-transparent text-sm border-0 focus:outline-none" value={searchM} onChange={e=>setSearchM(e.target.value)} placeholder="이름, 아이디 또는 학교로 검색"/></div><div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto">{filtered.map((u:any)=>(<button key={u.id} onClick={()=>aM(u.id)} className="bg-slate-50 rounded-lg p-3 text-left hover:bg-blue-50 text-xs"><p className="font-semibold">{u.login_id||u.name}</p><p className="text-slate-400">{u.school||""}</p></button>))}{filtered.length===0&&<p className="text-slate-400 text-xs col-span-3">결과 없음</p>}</div></div>}
      <div className="flex justify-between items-center mb-3"><h3 className="font-semibold text-sm">시험</h3><button onClick={()=>{setShowNT(true);setNtf(p=>({...p,date:new Date().toISOString().split("T")[0]}));}} className="bg-[#D4AF37] text-white px-4 py-2 rounded-xl text-xs font-semibold">+ 새 시험</button></div>
      {showNT&&<div className="bg-white rounded-2xl p-5 shadow-sm mb-4 flex gap-3 items-end"><div className="flex-1"><label className="text-xs font-semibold text-slate-500">시험 날짜</label><input type="date" className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={ntf.date} onChange={e=>setNtf(p=>({...p,date:e.target.value}))}/></div><button onClick={cT} className="bg-[#D4AF37] text-white px-5 py-2.5 rounded-xl text-xs font-semibold">생성</button><button onClick={()=>setShowNT(false)} className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-2.5 py-1 rounded-lg bg-slate-100 transition-colors">취소</button></div>}
      <div className="space-y-2">{tests.map(t=>(<div key={t.id} className="bg-white rounded-xl p-4 shadow-sm hover:ring-2 hover:ring-[#D4AF37]/30">
        {editTest?.id===t.id?<div className="space-y-3">
          <h3 className="font-semibold text-sm">✏️ 시험 수정</h3>
          <div className="grid grid-cols-2 gap-3"><div><label className="text-xs font-semibold text-slate-500">날짜</label><input type="date" className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={editTF.date} onChange={e=>setEditTF(p=>({...p,date:e.target.value}))}/></div><div><label className="text-xs font-semibold text-slate-500">시험명</label><input className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={editTF.title} onChange={e=>setEditTF(p=>({...p,title:e.target.value}))}/></div></div>
          <div><label className="text-xs font-semibold text-slate-500">과제</label><input className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={editTF.assignment} onChange={e=>setEditTF(p=>({...p,assignment:e.target.value}))}/></div>
          <div className="flex gap-2"><button onClick={updateTest} className="bg-[#D4AF37] text-white px-4 py-2 rounded-xl text-xs font-semibold">저장</button><button onClick={()=>setEditTest(null)} className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-2.5 py-1 rounded-lg bg-slate-100 transition-colors">취소</button></div>
        </div>:<div className="flex justify-between items-center">
          <button onClick={()=>loadGrid(t)} className="flex-1 text-left"><p className="font-semibold text-sm">{t.title}</p><p className="text-xs text-slate-400">{fmtDate(t.date)}{t.assignment?` · 과제: ${t.assignment}`:""}</p></button>
          <div className="flex items-center gap-2 ml-2"><button onClick={(e)=>{e.stopPropagation();setEditTest(t);setEditTF({date:t.date,title:t.title,assignment:t.assignment||""});}} className="text-xs font-semibold text-slate-700 hover:text-[#D4AF37] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#D4AF37]/10 transition-colors">수정</button><button onClick={(e)=>{e.stopPropagation();deleteTest(t.id);}} className="text-xs font-semibold text-slate-700 hover:text-red-500 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50 transition-colors">삭제</button><Icon type="right" size={16}/></div>
        </div>}
      </div>))}{tests.length===0&&<div className="bg-white rounded-2xl p-8 shadow-sm text-center text-slate-400 text-sm">시험 추가 필요</div>}</div>
    </div>);
  }

  // Group list
  return(<div>
    <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">📁 반 관리</h2><button onClick={()=>setShowNG(true)} className="admin-btn px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"><Icon type="plus" size={14}/>새 반</button></div>
    {showNG&&<div className="bg-white rounded-2xl p-5 shadow-sm mb-4 flex gap-3 items-end"><div className="flex-1"><label className="text-xs font-semibold text-slate-500">반 이름</label><input className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={newGN} onChange={e=>setNewGN(e.target.value)} placeholder="수학 정규반"/></div><button onClick={cG} className="bg-[#D4AF37] text-white px-4 py-2.5 rounded-xl text-xs font-semibold">만들기</button></div>}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{groups.map(g=>(<div key={g.id} className="bg-white rounded-xl p-5 shadow-sm hover:ring-2 hover:ring-[#D4AF37]/20 cursor-pointer" onClick={()=>selectGroup(g)}><div className="flex justify-between items-start"><div className="flex items-center gap-2"><Icon type="folder" size={20}/>{editingGId===g.id?<div className="flex items-center gap-1" onClick={e=>e.stopPropagation()}><input className="bg-slate-50 rounded-lg px-2 py-1 text-sm border border-slate-200 focus:outline-none focus:border-[#D4AF37] w-36" value={editGN} onChange={e=>setEditGN(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")renameG(g.id);if(e.key==="Escape"){setEditingGId(null);setEditGN("");}}} autoFocus/><button onClick={()=>renameG(g.id)} className="text-xs text-[#D4AF37] font-semibold">확인</button><button onClick={()=>{setEditingGId(null);setEditGN("");}} className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-2.5 py-1 rounded-lg bg-slate-100 transition-colors">취소</button></div>:<span className="font-semibold">{g.name}</span>}</div><div className="flex gap-2" onClick={e=>e.stopPropagation()}><button onClick={()=>{setEditingGId(g.id);setEditGN(g.name);}} className="text-xs font-semibold text-slate-700 hover:text-[#D4AF37] px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-[#D4AF37]/10 transition-colors">수정</button><button onClick={()=>dG(g.id)} className="text-xs font-semibold text-slate-700 hover:text-red-500 px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-red-50 transition-colors">삭제</button></div></div></div>))}{groups.length===0&&<div className="bg-white rounded-2xl p-12 shadow-sm text-center text-slate-400 text-sm col-span-2">반을 만들어 보세요!</div>}</div>
  </div>);
}

/* ═══ ADMIN: NOTICE MANAGER ═══ */
/* ═══ ADMIN: CALENDAR MANAGER ═══ */
function AdminCalendarManager({groups}:{groups:any[]}){
  const[events,setEvents]=useState<any[]>([]);
  const[form,setForm]=useState({date:"",title:"",memo:"",class_group_id:"" as string|number});
  const[editId,setEditId]=useState<number|null>(null);
  const[editForm,setEditForm]=useState({date:"",title:"",memo:"",class_group_id:"" as string|number});

  const fE=async()=>{
    const{data:common}=await supabase.from("calendar_events").select("*, class_groups(name)").is("class_group_id",null).order("date",{ascending:true});
    const{data:classed}=await supabase.from("calendar_events").select("*, class_groups(name)").not("class_group_id","is",null).order("date",{ascending:true});
    setEvents([...(common||[]),...(classed||[])].sort((a,b)=>a.date.localeCompare(b.date)));
  };
  useEffect(()=>{fE();},[]);

  const addEvent=async()=>{
    if(!form.date||!form.title)return;
    await supabase.from("calendar_events").insert({date:form.date,title:form.title,memo:form.memo||null,class_group_id:form.class_group_id===""?null:Number(form.class_group_id)});
    setForm({date:"",title:"",memo:"",class_group_id:""});fE();
  };
  const delEvent=async(id:number)=>{if(!confirm("삭제?"))return;await supabase.from("calendar_events").delete().eq("id",id);fE();};
  const startEdit=(e:any)=>{setEditId(e.id);setEditForm({date:e.date,title:e.title,memo:e.memo||"",class_group_id:e.class_group_id===null?"":e.class_group_id});};
  const saveEdit=async()=>{if(!editId)return;await supabase.from("calendar_events").update({date:editForm.date,title:editForm.title,memo:editForm.memo||null,class_group_id:editForm.class_group_id===""?null:Number(editForm.class_group_id)}).eq("id",editId);setEditId(null);fE();};

  const GroupSelect=({value,onChange}:{value:string|number;onChange:(v:string|number)=>void})=>(
    <select className="w-full bg-slate-50 rounded-xl px-3 py-2 text-sm border-0" value={String(value)} onChange={e=>onChange(e.target.value)}>
      <option value="">전체 공통</option>
      {groups.map(g=>(<option key={g.id} value={String(g.id)}>{g.name}</option>))}
    </select>
  );

  // 월별 그룹핑
  const grouped:Record<string,any[]>={};
  events.forEach(e=>{const k=e.date?.slice(0,7)||"";if(!grouped[k])grouped[k]=[];grouped[k].push(e);});

  return(<div>
    <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">📅 캘린더 관리</h2></div>
    {/* 추가 폼 */}
    <div className="bg-white rounded-2xl p-5 shadow-sm mb-6 border border-[#D4AF37]/10">
      <h3 className="font-semibold text-sm mb-3">+ 새 일정 추가</h3>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div><label className="text-[10px] font-semibold text-slate-400">날짜 *</label><input type="date" className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))}/></div>
        <div><label className="text-[10px] font-semibold text-slate-400">대상 반</label><div className="mt-1"><GroupSelect value={form.class_group_id} onChange={v=>setForm(p=>({...p,class_group_id:v}))}/></div></div>
      </div>
      <div className="mb-3"><label className="text-[10px] font-semibold text-slate-400">제목 *</label><input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0" placeholder="예) 3월 모의고사, 클리닉 일정" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))}/></div>
      <div className="mb-3"><label className="text-[10px] font-semibold text-slate-400">메모 (선택)</label><input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm mt-1 border-0" placeholder="추가 설명" value={form.memo} onChange={e=>setForm(p=>({...p,memo:e.target.value}))}/></div>
      <button onClick={addEvent} className="bg-[#D4AF37] text-white px-5 py-2 rounded-xl text-xs font-semibold">추가</button>
    </div>
    {/* 일정 목록 */}
    <div className="space-y-5">
      {Object.keys(grouped).sort().map(month=>{
        const [y,m]=month.split("-");
        return(<div key={month}>
          <p className="text-xs font-bold text-slate-400 mb-2 px-1">{y}년 {Number(m)}월</p>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {grouped[month].map((e:any,i:number)=>(
              <div key={e.id} className={`p-4 ${i>0?"border-t border-slate-50":""}`}>
                {editId===e.id?(
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input type="date" className="bg-slate-50 rounded-lg px-3 py-2 text-sm border-0" value={editForm.date} onChange={ev=>setEditForm(p=>({...p,date:ev.target.value}))}/>
                      <GroupSelect value={editForm.class_group_id} onChange={v=>setEditForm(p=>({...p,class_group_id:v}))}/>
                    </div>
                    <input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm border-0" value={editForm.title} onChange={ev=>setEditForm(p=>({...p,title:ev.target.value}))}/>
                    <input className="w-full bg-slate-50 rounded-lg px-3 py-2 text-sm border-0" placeholder="메모" value={editForm.memo} onChange={ev=>setEditForm(p=>({...p,memo:ev.target.value}))}/>
                    <div className="flex gap-2"><button onClick={saveEdit} className="bg-[#D4AF37] text-white px-4 py-1.5 rounded-lg text-xs font-semibold">저장</button><button onClick={()=>setEditId(null)} className="bg-slate-100 text-slate-500 px-4 py-1.5 rounded-lg text-xs font-semibold">취소</button></div>
                  </div>
                ):(
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0" style={{background:"linear-gradient(135deg,#D4AF37,#B5952F)"}}>
                      <span className="text-white text-[10px] font-bold leading-none">{e.date?.slice(5,7)}월</span>
                      <span className="text-white text-base font-bold leading-none">{Number(e.date?.slice(8,10))}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-slate-700 truncate">{e.title}</p>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${e.class_group_id?"bg-blue-50 text-blue-500":"bg-[#D4AF37]/10 text-[#AA8C2C]"}`}>{e.class_group_id?e.class_groups?.name||"반":"전체"}</span>
                      </div>
                      {e.memo&&<p className="text-xs text-slate-400 truncate">{e.memo}</p>}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={()=>startEdit(e)} className="text-xs text-slate-500 hover:text-[#D4AF37] px-2 py-1 rounded-lg bg-slate-100 hover:bg-[#D4AF37]/10">수정</button>
                      <button onClick={()=>delEvent(e.id)} className="text-xs text-slate-500 hover:text-red-500 px-2 py-1 rounded-lg bg-slate-100 hover:bg-red-50">삭제</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>);
      })}
      {events.length===0&&<div className="bg-white rounded-2xl p-10 text-center text-slate-400 text-sm shadow-sm">등록된 일정이 없습니다</div>}
    </div>
  </div>);
}

function AdminNoticeManager({groups}:{groups:any[]}){
  const[notices,setNotices]=useState<any[]>([]);const[showAdd,setShowAdd]=useState(false);
  const[form,setForm]=useState({class_group_id:0,title:"",content:""});const[noticeImg,setNoticeImg]=useState<File|null>(null);const noticeImgRef=useRef<HTMLInputElement>(null);
  const[editNoticeId,setEditNoticeId]=useState<number|null>(null);const[editNoticeForm,setEditNoticeForm]=useState({title:"",content:""});
  const[editNoticeImg,setEditNoticeImg]=useState<File|null>(null);const[editNoticeKeepImg,setEditNoticeKeepImg]=useState(true);const editNoticeImgRef=useRef<HTMLInputElement>(null);
  const fN=async()=>{const{data}=await supabase.from("class_notices").select("*, class_groups(name)").order("created_at",{ascending:false});if(data)setNotices(data);};
  useEffect(()=>{fN();},[]);
  const addNotice=async()=>{if(!form.class_group_id||!form.content)return;let imgUrl="";if(noticeImg){imgUrl=await uploadImage(noticeImg,`notice_${form.class_group_id}`)||"";}const finalContent=form.content+(imgUrl?`\n[IMG]${imgUrl}[/IMG]`:"");await supabase.from("class_notices").insert({class_group_id:form.class_group_id,title:form.title,content:finalContent});const{data:cms}=await supabase.from("class_members").select("user_id").eq("class_group_id",form.class_group_id);if(cms)for(const cm of cms){await sendNotif(cm.user_id,"notice",`📢 새 공지: ${form.title||"공지사항"}`);}setForm({class_group_id:0,title:"",content:""});setNoticeImg(null);setShowAdd(false);fN();};
  const delNotice=async(id:number)=>{if(!confirm("삭제?"))return;await supabase.from("class_notices").delete().eq("id",id);fN();};
  const startEditNotice=(n:any)=>{const clean=n.content?.replace(/\[IMG\].*?\[\/IMG\]/g,"").trim()||"";setEditNoticeId(n.id);setEditNoticeForm({title:n.title||"",content:clean});setEditNoticeImg(null);setEditNoticeKeepImg(true);};
  const saveEditNotice=async()=>{if(!editNoticeId)return;let imgUrl="";if(editNoticeImg){imgUrl=await uploadImage(editNoticeImg,`notice_edit_${editNoticeId}`)||"";}const orig=notices.find(n=>n.id===editNoticeId);const oldImgMatch=orig?.content?.match(/\[IMG\](.*?)\[\/IMG\]/);let imgPart="";if(imgUrl)imgPart=`\n[IMG]${imgUrl}[/IMG]`;else if(editNoticeKeepImg&&oldImgMatch)imgPart=`\n[IMG]${oldImgMatch[1]}[/IMG]`;await supabase.from("class_notices").update({title:editNoticeForm.title,content:editNoticeForm.content+imgPart}).eq("id",editNoticeId);setEditNoticeId(null);setEditNoticeImg(null);fN();};
  return(<div>
    <div className="flex justify-between items-center mb-4 flex-wrap gap-2"><h2 className="text-lg font-bold">📢 공지사항 관리</h2><button onClick={()=>setShowAdd(true)} className="admin-btn px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"><Icon type="plus" size={14}/>새 공지</button></div>
    {showAdd&&<div className="bg-white rounded-2xl p-5 shadow-sm mb-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><label className="text-xs font-semibold text-slate-500">반 선택</label><select className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={form.class_group_id} onChange={e=>setForm(p=>({...p,class_group_id:Number(e.target.value)}))}><option value={0}>반을 선택하세요</option>{groups.map(g=>(<option key={g.id} value={g.id}>{g.name}</option>))}</select></div>
        <div><label className="text-xs font-semibold text-slate-500">제목</label><input className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="공지 제목"/></div>
      </div>
      <div><label className="text-xs font-semibold text-slate-500">내용</label><textarea className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm mt-1 border-0 resize-none h-28" value={form.content} onChange={e=>setForm(p=>({...p,content:e.target.value}))} placeholder="공지 내용을 입력하세요"/></div>
      <div><label className="text-xs font-semibold text-slate-500">이미지 첨부</label><div className="flex items-center gap-2 mt-1"><button onClick={()=>noticeImgRef.current?.click()} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-500">{noticeImg?noticeImg.name:"이미지 선택"}</button><input ref={noticeImgRef} type="file" accept="image/*" className="hidden" onChange={e=>{if(e.target.files?.[0])setNoticeImg(e.target.files[0]);}}/>{noticeImg&&<button onClick={()=>setNoticeImg(null)} className="text-xs text-red-400">삭제</button>}</div></div>
      <div className="flex gap-2"><button onClick={addNotice} className="bg-[#D4AF37] text-white px-4 py-2 rounded-xl text-xs font-semibold">등록</button><button onClick={()=>{setShowAdd(false);setNoticeImg(null);}} className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-2.5 py-1 rounded-lg bg-slate-100 transition-colors">취소</button></div>
    </div>}
    <div className="space-y-3">{notices.map((n:any)=>{const nImgMatch=n.content?.match(/\[IMG\](.*?)\[\/IMG\]/);const cleanNoticeContent=n.content?.replace(/\[IMG\].*?\[\/IMG\]/g,"").trim();return(<div key={n.id} className="bg-white rounded-2xl p-5 shadow-sm">
      {editNoticeId===n.id?<div className="space-y-3">
        <div><label className="text-xs font-semibold text-slate-500">제목</label><input className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={editNoticeForm.title} onChange={e=>setEditNoticeForm(p=>({...p,title:e.target.value}))}/></div>
        <div><label className="text-xs font-semibold text-slate-500">내용</label><textarea className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm mt-1 border-0 resize-none h-28" value={editNoticeForm.content} onChange={e=>setEditNoticeForm(p=>({...p,content:e.target.value}))}/></div>
        {/* 기존 이미지 */}
        {nImgMatch&&editNoticeKeepImg&&!editNoticeImg&&<div className="bg-slate-50 rounded-xl p-3"><p className="text-xs font-semibold text-slate-500 mb-2">📎 현재 이미지</p><img src={nImgMatch[1]} alt="" className="rounded-xl max-h-32 object-contain mb-2"/><button onClick={()=>setEditNoticeKeepImg(false)} className="text-xs font-semibold text-red-500 hover:text-red-600 px-2.5 py-1 rounded-lg bg-red-50">이미지 삭제</button></div>}
        {nImgMatch&&!editNoticeKeepImg&&!editNoticeImg&&<div className="bg-red-50 rounded-xl p-3 text-xs text-red-400 font-semibold">기존 이미지가 삭제됩니다 <button onClick={()=>setEditNoticeKeepImg(true)} className="ml-2 text-slate-500 underline">취소</button></div>}
        {/* 새 이미지 추가 */}
        <div><label className="text-xs font-semibold text-slate-500">이미지 {editNoticeImg?"변경":"추가"}</label><div className="flex items-center gap-2 mt-1"><button onClick={()=>editNoticeImgRef.current?.click()} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-600 font-medium">{editNoticeImg?`📎 ${editNoticeImg.name}`:"이미지 선택"}</button><input ref={editNoticeImgRef} type="file" accept="image/*" className="hidden" onChange={e=>{if(e.target.files?.[0]){setEditNoticeImg(e.target.files[0]);setEditNoticeKeepImg(false);}}}/>{editNoticeImg&&<button onClick={()=>{setEditNoticeImg(null);setEditNoticeKeepImg(!!nImgMatch);}} className="text-xs text-red-400 font-semibold">제거</button>}</div>{editNoticeImg&&<img src={URL.createObjectURL(editNoticeImg)} alt="" className="mt-2 rounded-xl max-h-32 object-contain"/>}</div>
        <div className="flex gap-2"><button onClick={saveEditNotice} className="bg-[#D4AF37] text-white px-4 py-2 rounded-xl text-xs font-semibold">저장</button><button onClick={()=>{setEditNoticeId(null);setEditNoticeImg(null);}} className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-2.5 py-1 rounded-lg bg-slate-100 transition-colors">취소</button></div>
      </div>:<>
        <div className="flex items-start justify-between mb-2"><div><h3 className="font-semibold text-sm">{n.title||"공지"}</h3><div className="flex items-center gap-2 mt-1"><span className="text-xs text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-lg">{n.class_groups?.name||""}</span><span className="text-xs text-slate-400">{n.created_at?.slice(0,10)}</span></div></div><div className="flex items-center gap-2"><button onClick={()=>startEditNotice(n)} className="text-xs font-semibold text-slate-700 hover:text-[#D4AF37] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#D4AF37]/10 transition-colors">수정</button><button onClick={()=>delNotice(n.id)} className="text-xs font-semibold text-slate-700 hover:text-red-500 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50 transition-colors">삭제</button></div></div>
        <p className="text-sm text-slate-600 whitespace-pre-line">{cleanNoticeContent}</p>{nImgMatch&&<img src={nImgMatch[1]} alt="" className="mt-3 rounded-xl max-h-64 object-contain"/>}
      </>}
    </div>);})}{notices.length===0&&<div className="bg-white rounded-2xl p-12 shadow-sm text-center text-slate-400 text-sm">공지사항을 작성해보세요</div>}</div>
  </div>);
}

/* ═══ ADMIN: STUDENT EXAM VIEWER ═══ */
function AdminExamViewer({users}:{users:any[]}){
  const[exams,setExams]=useState<any[]>([]);const[filter,setFilter]=useState("");const[typeFilter,setTypeFilter]=useState("");
  const fE=async()=>{const{data}=await supabase.from("student_exams").select("*, users:user_id(name, school, login_id)").order("created_at",{ascending:false});if(data)setExams(data);};
  useEffect(()=>{fE();},[]);
  const filtered=exams.filter(e=>{const name=e.users?.name||"";const lid=e.users?.login_id||"";const match=!filter||name.includes(filter)||lid.includes(filter);const tMatch=!typeFilter||e.exam_type===typeFilter;return match&&tMatch;});
  return(<div>
    <h2 className="text-lg font-bold mb-4">📊 학생 시험 성적</h2>
    <div className="flex flex-wrap gap-2 mb-4">
      <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm"><Icon type="search" size={16}/><input className="bg-transparent text-sm border-0 focus:outline-none w-32" value={filter} onChange={e=>setFilter(e.target.value)} placeholder="이름 검색"/></div>
      <select className="bg-white rounded-xl px-3 py-2 text-sm shadow-sm border-0" value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}><option value="">전체</option><option>모의고사</option><option>내신</option></select>
    </div>
    {filtered.length>0?<div className="space-y-3">{filtered.map((e:any)=>{let memoObj:any={};try{memoObj=JSON.parse(e.memo||"{}");}catch{}let subjects:any=null;try{if(e.total&&e.total.startsWith("{"))subjects=JSON.parse(e.total);}catch{}return(<div key={e.id} className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3"><span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-lg">{e.users?.login_id||e.users?.name||"?"}</span><span className="text-xs text-slate-400">{e.users?.school||""}</span><span className={`text-xs font-bold px-2 py-0.5 rounded-lg ml-auto ${e.exam_type==="모의고사"?"bg-amber-50 text-amber-600":"bg-blue-50 text-blue-600"}`}>{e.exam_type}</span>{e.exam_name&&<span className="text-xs text-slate-500">{e.exam_name}</span>}</div>
      {subjects?<div className="mb-3"><div className="bg-gradient-to-r from-slate-50 to-white rounded-xl overflow-hidden border border-slate-100 shadow-sm"><table className="w-full text-xs"><thead><tr className="bg-gradient-to-r from-[#D4AF37]/5 to-[#D4AF37]/10"><th className="py-2 w-10 text-[10px] font-bold text-slate-400"></th>{["국어","수학","영어","과학","사회"].map(s=>(<th key={s} className="py-2 text-[11px] font-bold text-slate-600">{s}</th>))}</tr></thead><tbody><tr><td className="py-1.5 text-center text-[10px] font-bold text-slate-400">등급</td>{["국어","수학","영어","과학","사회"].map(s=>(<td key={s} className="py-1.5 text-center font-bold text-[#D4AF37]">{subjects[s]?.grade||"—"}</td>))}</tr><tr className="border-t border-slate-50"><td className="py-1.5 text-center text-[10px] font-bold text-slate-400">점수</td>{["국어","수학","영어","과학","사회"].map(s=>(<td key={s} className="py-1.5 text-center">{subjects[s]?.score||"—"}</td>))}</tr></tbody></table></div></div>:<div className="mb-3"><div className="flex items-center gap-3"><span className="text-sm font-semibold">{e.subject}</span><span className="text-lg font-bold text-[#D4AF37]">{e.score}점</span>{e.grade&&<span className="text-sm font-semibold text-slate-500">{e.grade}</span>}</div></div>}
      {(memoObj.q1||memoObj.q2||memoObj.q3)&&<div className="space-y-1 text-xs text-slate-500">{memoObj.q1&&<p>📈 {memoObj.q1}</p>}{memoObj.q2&&<p>🤔 {memoObj.q2}</p>}{memoObj.q3&&<p>💬 {memoObj.q3}</p>}</div>}
    </div>);})}</div>:<div className="bg-white rounded-2xl p-12 shadow-sm text-center text-slate-400 text-sm">학생이 입력한 성적이 없습니다</div>}
  </div>);
}

/* ═══ ADMIN: INQUIRY MANAGER ═══ */
function AdminInquiryManager({onReply}:{onReply?:()=>void}){
  const[inqs,setInqs]=useState<any[]>([]);const[replyId,setReplyId]=useState<number|null>(null);const[replyText,setReplyText]=useState("");const[replyImg,setReplyImg]=useState<File|null>(null);const replyImgRef=useRef<HTMLInputElement>(null);
  const fI=async()=>{const{data}=await supabase.from("inquiries").select("*, users:user_id(name)").order("created_at",{ascending:false});if(data)setInqs(data);};
  useEffect(()=>{fI();},[]);
  const saveReply=async(id:number)=>{let imgUrl="";if(replyImg){imgUrl=await uploadImage(replyImg,`reply_${id}`)||"";}const finalReply=replyText+(imgUrl?`\n[IMG]${imgUrl}[/IMG]`:"");await supabase.from("inquiries").update({reply:finalReply}).eq("id",id);const inq=inqs.find(q=>q.id===id);if(inq)await sendNotif(inq.user_id,"reply","💬 문의사항에 답변이 달렸습니다");setReplyId(null);setReplyText("");setReplyImg(null);fI();if(onReply)onReply();};
  const delInq=async(id:number)=>{if(!confirm("삭제?"))return;await supabase.from("inquiries").delete().eq("id",id);fI();};
  return(<div><h2 className="text-lg font-bold mb-4">💬 문의사항 관리</h2>{inqs.length>0?<div className="space-y-3">{inqs.map((q:any)=>{const isNew=q.created_at&&(Date.now()-new Date(q.created_at).getTime())<24*60*60*1000;const hasReply=!!q.reply;const imgMatch=q.content?.match(/\[IMG\](.*?)\[\/IMG\]/);const cleanContent=q.content?.replace(/\[IMG\].*?\[\/IMG\]/g,"").trim();const replyImgMatch=q.reply?.match(/\[IMG\](.*?)\[\/IMG\]/);const cleanReply=q.reply?.replace(/\[IMG\].*?\[\/IMG\]/g,"").trim();return(<div key={q.id} className="bg-white rounded-2xl p-5 shadow-sm">
    <div className="flex justify-between mb-2"><div className="flex items-center gap-2"><span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-lg">{q.users?.name||"?"}</span><span className="text-xs text-slate-400">{q.created_at?.slice(0,10)}</span>{isNew&&<span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">N</span>}<span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${hasReply?"bg-green-50 text-green-600":"bg-amber-50 text-amber-600"}`}>{hasReply?"답변 완료":"답변 대기중"}</span></div><button onClick={()=>delInq(q.id)} className="text-xs font-semibold text-slate-700 hover:text-red-500 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50 transition-colors">삭제</button></div>
    <h3 className="font-semibold text-sm mb-1">{q.title||"문의"}</h3><p className="text-sm text-slate-600 whitespace-pre-line mb-2">{cleanContent}</p>{imgMatch&&<img src={imgMatch[1]} alt="" className="rounded-xl max-h-48 object-contain mb-3"/>}
    {hasReply?<div className="bg-[#D4AF37]/5 rounded-xl p-3"><p className="text-xs font-semibold text-[#D4AF37] mb-1">내 답변</p>{replyId===q.id?<div className="space-y-2 mt-2"><textarea className="w-full bg-white rounded-xl px-4 py-3 text-sm border border-slate-200 resize-none h-20" value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="답변을 수정하세요"/><div className="flex items-center gap-2"><button onClick={()=>replyImgRef.current?.click()} className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-500">{replyImg?replyImg.name:"이미지 첨부"}</button><input ref={replyImgRef} type="file" accept="image/*" className="hidden" onChange={e=>{if(e.target.files?.[0])setReplyImg(e.target.files[0]);}}/>{replyImg&&<button onClick={()=>setReplyImg(null)} className="text-xs text-red-400">삭제</button>}</div><div className="flex gap-2"><button onClick={()=>saveReply(q.id)} className="bg-[#D4AF37] text-white px-4 py-1.5 rounded-xl text-xs font-semibold">저장</button><button onClick={()=>{setReplyId(null);setReplyImg(null);}} className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-2.5 py-1 rounded-lg bg-slate-100 transition-colors">취소</button></div></div>:<><p className="text-sm text-slate-700 whitespace-pre-line">{cleanReply}</p>{replyImgMatch&&<img src={replyImgMatch[1]} alt="" className="mt-2 rounded-xl max-h-48 object-contain"/>}<button onClick={()=>{setReplyId(q.id);setReplyText(cleanReply||"");setReplyImg(null);}} className="text-xs font-semibold text-slate-700 hover:text-[#D4AF37] transition-colors px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#D4AF37]/10 mt-2">수정</button></>}</div>:replyId===q.id?<div className="space-y-2"><textarea className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm border-0 resize-none h-20" value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="답변을 작성하세요"/><div className="flex items-center gap-2"><button onClick={()=>replyImgRef.current?.click()} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-500">{replyImg?replyImg.name:"이미지 첨부"}</button><input ref={replyImgRef} type="file" accept="image/*" className="hidden" onChange={e=>{if(e.target.files?.[0])setReplyImg(e.target.files[0]);}}/>{replyImg&&<button onClick={()=>setReplyImg(null)} className="text-xs text-red-400">삭제</button>}</div><div className="flex gap-2"><button onClick={()=>saveReply(q.id)} className="bg-[#D4AF37] text-white px-4 py-1.5 rounded-xl text-xs font-semibold">답변</button><button onClick={()=>{setReplyId(null);setReplyImg(null);}} className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-2.5 py-1 rounded-lg bg-slate-100 transition-colors">취소</button></div></div>:<button onClick={()=>{setReplyId(q.id);setReplyText("");}} className="text-xs font-semibold text-slate-700 hover:text-[#D4AF37] transition-colors px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#D4AF37]/10">답변하기</button>}
  </div>);})}</div>:<div className="bg-white rounded-2xl p-12 shadow-sm text-center text-slate-400 text-sm">문의가 없습니다</div>}</div>);
}

/* ═══ ADMIN: TOKEN MANAGER ═══ */
function AdminTokenManager({users,fetchUsers}:{users:any[];fetchUsers:()=>void}){
  const students=users.filter((u:any)=>u.role==="student"&&u.status==="approved");
  const[amount,setAmount]=useState<{[k:number]:string}>({});const[reason,setReason]=useState<{[k:number]:string}>({});
  const[logs,setLogs]=useState<any[]>([]);
  const[groups,setGroups]=useState<any[]>([]);const[batchGroup,setBatchGroup]=useState(0);const[batchAmt,setBatchAmt]=useState("");const[batchReason,setBatchReason]=useState("");const[batchLoading,setBatchLoading]=useState(false);
  // 자동지급 설정
  const[autoSettings,setAutoSettings]=useState({wrong_pct:"70",wrong_reward:"1",assign_pct:"70",assign_reward:"1",enabled:true});const[autoMsg,setAutoMsg]=useState("");
  const userMap:any={};users.forEach(u=>{userMap[u.id]=u.name;});
  const fLogs=async()=>{const{data}=await supabase.from("token_logs").select("*").order("created_at",{ascending:false}).limit(50);if(data)setLogs(data);};
  const fGroups=async()=>{const{data}=await supabase.from("class_groups").select("*").order("created_at");if(data)setGroups(data);};
  const loadAutoSettings=async()=>{const{data}=await supabase.from("site_settings").select("*");if(data){const s:any={};data.forEach((r:any)=>{s[r.key]=r.value;});setAutoSettings({wrong_pct:s.auto_wrong_pct||"70",wrong_reward:s.auto_wrong_reward||"1",assign_pct:s.auto_assign_pct||"70",assign_reward:s.auto_assign_reward||"1",enabled:s.auto_token_enabled!=="false"});}};
  useEffect(()=>{fLogs();fGroups();loadAutoSettings();},[]);
  const saveAutoSettings=async()=>{const pairs=[["auto_wrong_pct",autoSettings.wrong_pct],["auto_wrong_reward",autoSettings.wrong_reward],["auto_assign_pct",autoSettings.assign_pct],["auto_assign_reward",autoSettings.assign_reward],["auto_token_enabled",autoSettings.enabled?"true":"false"]];for(const[k,v] of pairs){const{data:ex}=await supabase.from("site_settings").select("id").eq("key",k).single();if(ex)await supabase.from("site_settings").update({value:v}).eq("key",k);else await supabase.from("site_settings").insert({key:k,value:v});}setAutoMsg("저장 완료!");setTimeout(()=>setAutoMsg(""),2000);};
  const giveToken=async(uid:number,subtract?:boolean)=>{const amt=Number(amount[uid]||0);if(!amt||amt<=0)return;const u=students.find(s=>s.id===uid);const cur=u?.tokens||0;const newVal=subtract?Math.max(0,cur-amt):cur+amt;await supabase.from("users").update({tokens:newVal}).eq("id",uid);const rsn=reason[uid]||(subtract?"관리자 차감":"관리자 지급");await supabase.from("token_logs").insert({user_id:uid,amount:subtract?-amt:amt,reason:rsn});await sendNotif(uid,"token",subtract?`🥩 서서갈비 ${amt}개 차감 (${rsn})`:`🥩 서서갈비 ${amt}개 지급! (${rsn})`);setAmount(p=>({...p,[uid]:""}));setReason(p=>({...p,[uid]:""}));fetchUsers();fLogs();};
  const batchGive=async()=>{if(!batchGroup||!batchAmt)return;const amt=Number(batchAmt);if(!amt||amt<=0)return;setBatchLoading(true);const{data:cms}=await supabase.from("class_members").select("user_id").eq("class_group_id",batchGroup);if(cms){const rsn=batchReason||"반 일괄 지급";for(const cm of cms){const u=users.find((u:any)=>u.id===cm.user_id);const cur=u?.tokens||0;await supabase.from("users").update({tokens:cur+amt}).eq("id",cm.user_id);await supabase.from("token_logs").insert({user_id:cm.user_id,amount:amt,reason:rsn});await sendNotif(cm.user_id,"token",`🥩 서서갈비 ${amt}개 지급! (${rsn})`);}alert(`${cms.length}명에게 ${amt}개씩 지급 완료!`);}setBatchGroup(0);setBatchAmt("");setBatchReason("");setBatchLoading(false);fetchUsers();fLogs();};
  return(<div><h2 className="text-lg font-bold mb-4">🥩 서서갈비 관리</h2>
    {/* 자동지급 설정 */}
    <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
      <div className="flex items-center justify-between mb-3"><h3 className="font-semibold text-sm">⚙️ 자동 지급 설정</h3><label className="flex items-center gap-2 cursor-pointer"><span className="text-xs text-slate-400">{autoSettings.enabled?"켜짐":"꺼짐"}</span><div onClick={()=>setAutoSettings(p=>({...p,enabled:!p.enabled}))} className={`w-10 h-5 rounded-full relative transition-colors ${autoSettings.enabled?"bg-[#D4AF37]":"bg-slate-300"}`}><div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${autoSettings.enabled?"left-5.5":"left-0.5"}`} style={{left:autoSettings.enabled?22:2}}/></div></label></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-50 rounded-xl p-4"><p className="text-xs font-semibold text-slate-600 mb-2">📝 오답 성취도 기준</p><div className="flex items-center gap-2"><input type="number" className="w-16 bg-white rounded-lg px-2 py-1.5 text-sm border border-slate-200 text-center" value={autoSettings.wrong_pct} onChange={e=>setAutoSettings(p=>({...p,wrong_pct:e.target.value}))}/><span className="text-xs text-slate-400">% 이상이면</span><input type="number" className="w-16 bg-white rounded-lg px-2 py-1.5 text-sm border border-slate-200 text-center" value={autoSettings.wrong_reward} onChange={e=>setAutoSettings(p=>({...p,wrong_reward:e.target.value}))}/><span className="text-xs text-slate-400">개 지급</span></div></div>
        <div className="bg-slate-50 rounded-xl p-4"><p className="text-xs font-semibold text-slate-600 mb-2">📋 과제 성취도 기준</p><div className="flex items-center gap-2"><input type="number" className="w-16 bg-white rounded-lg px-2 py-1.5 text-sm border border-slate-200 text-center" value={autoSettings.assign_pct} onChange={e=>setAutoSettings(p=>({...p,assign_pct:e.target.value}))}/><span className="text-xs text-slate-400">% 이상이면</span><input type="number" className="w-16 bg-white rounded-lg px-2 py-1.5 text-sm border border-slate-200 text-center" value={autoSettings.assign_reward} onChange={e=>setAutoSettings(p=>({...p,assign_reward:e.target.value}))}/><span className="text-xs text-slate-400">개 지급</span></div></div>
      </div>
      <div className="flex items-center gap-2 mt-3"><button onClick={saveAutoSettings} className="bg-[#D4AF37] text-white px-4 py-2 rounded-xl text-xs font-semibold">설정 저장</button>{autoMsg&&<span className="text-xs text-green-500 font-semibold">{autoMsg}</span>}<p className="text-[10px] text-slate-400 ml-auto">시험 저장 시 자동 적용 · 중복 지급 없음</p></div>
    </div>
    {/* 반 일괄 지급 */}
    <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
      <h3 className="font-semibold text-sm mb-3">🏫 반 일괄 지급</h3>
      <div className="flex flex-wrap items-end gap-3">
        <div><label className="text-[10px] font-semibold text-slate-400">반 선택</label><select className="w-full bg-slate-50 rounded-xl px-3 py-2 text-sm mt-1 border-0" value={batchGroup} onChange={e=>setBatchGroup(Number(e.target.value))}><option value={0}>반을 선택하세요</option>{groups.map(g=>(<option key={g.id} value={g.id}>{g.name}</option>))}</select></div>
        <div><label className="text-[10px] font-semibold text-slate-400">수량</label><input type="number" className="w-20 bg-slate-50 rounded-xl px-3 py-2 text-sm mt-1 border-0 text-center" value={batchAmt} onChange={e=>setBatchAmt(e.target.value)} placeholder="0"/></div>
        <div className="flex-1"><label className="text-[10px] font-semibold text-slate-400">사유</label><input className="w-full bg-slate-50 rounded-xl px-3 py-2 text-sm mt-1 border-0" value={batchReason} onChange={e=>setBatchReason(e.target.value)} placeholder="예: 출석 보상"/></div>
        <button onClick={batchGive} disabled={batchLoading||!batchGroup||!batchAmt} className="admin-btn px-5 py-2 rounded-xl text-xs font-semibold disabled:opacity-50">{batchLoading?"지급 중...":"일괄 지급"}</button>
      </div>
    </div>
    {/* 개별 지급 */}
    <div className="bg-white rounded-2xl shadow-sm overflow-x-auto mb-6"><table className="w-full text-sm"><thead><tr className="bg-slate-50"><th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">이름</th><th className="px-4 py-3 text-xs font-semibold text-slate-400">보유</th><th className="px-4 py-3 text-xs font-semibold text-slate-400">수량</th><th className="px-4 py-3 text-xs font-semibold text-slate-400">사유</th><th className="px-4 py-3"></th></tr></thead><tbody>{students.map((s:any)=>(<tr key={s.id} className="border-t border-slate-50"><td className="px-4 py-2.5 font-semibold">{s.login_id||s.name}</td><td className="px-4 py-2.5 text-center font-bold text-amber-600">{s.tokens||0} 🔥</td><td className="px-4 py-2.5"><input type="number" className="w-20 bg-slate-50 rounded-lg px-2 py-1.5 text-xs border-0 text-center" value={amount[s.id]||""} onChange={e=>setAmount(p=>({...p,[s.id]:e.target.value}))} placeholder="0"/></td><td className="px-4 py-2.5"><input className="bg-slate-50 rounded-lg px-2 py-1.5 text-xs border-0 w-full" value={reason[s.id]||""} onChange={e=>setReason(p=>({...p,[s.id]:e.target.value}))} placeholder="사유"/></td><td className="px-4 py-2.5"><div className="flex gap-1"><button onClick={()=>giveToken(s.id)} className="bg-[#D4AF37] text-white px-3 py-1 rounded-lg text-xs font-semibold">지급</button><button onClick={()=>giveToken(s.id,true)} className="bg-red-50 text-red-500 px-3 py-1 rounded-lg text-xs font-semibold">차감</button></div></td></tr>))}</tbody></table></div>
    <h3 className="font-semibold text-sm mb-3">지급/차감 내역</h3>
    <div className="bg-white rounded-2xl shadow-sm overflow-x-auto"><table className="w-full text-sm"><thead><tr className="bg-slate-50"><th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">날짜</th><th className="px-4 py-3 text-xs font-semibold text-slate-400">이름</th><th className="px-4 py-3 text-xs font-semibold text-slate-400">수량</th><th className="px-4 py-3 text-xs font-semibold text-slate-400">사유</th></tr></thead><tbody>{logs.map((l:any)=>(<tr key={l.id} className="border-t border-slate-50"><td className="px-4 py-2 text-xs text-slate-400">{l.created_at?.slice(0,10)}</td><td className="px-4 py-2 text-sm font-semibold">{userMap[l.user_id]||"?"}</td><td className={`px-4 py-2 text-sm font-bold text-center ${l.amount>0?"text-[#D4AF37]":"text-red-500"}`}>{l.amount>0?"+":""}{l.amount} 🥩</td><td className="px-4 py-2 text-xs text-slate-500">{l.reason||"—"}</td></tr>))}{logs.length===0&&<tr><td colSpan={4} className="text-center py-8 text-slate-400 text-sm">내역 없음</td></tr>}</tbody></table></div>
  </div>);
}

/* ═══ ADMIN: SHOP MANAGER ═══ */
function AdminShopManager({onProcess}:{onProcess?:()=>void}){
  const[items,setItems]=useState<any[]>([]);const[showAdd,setShowAdd]=useState(false);const[form,setForm]=useState({name:"",description:"",price:0});
  const[purchases,setPurchases]=useState<any[]>([]);
  const[shopNotice,setShopNotice]=useState("");const[shopNoticeSaved,setShopNoticeSaved]=useState("");const[noticeSaving,setNoticeSaving]=useState(false);
  const fI=async()=>{const{data}=await supabase.from("shop_items").select("*").order("created_at");if(data)setItems(data);};
  const fP=async()=>{const{data}=await supabase.from("purchases").select("*, users:user_id(name), shop_items(name)").order("created_at",{ascending:false});if(data)setPurchases(data);};
  const fNotice=async()=>{const{data}=await supabase.from("site_settings").select("value").eq("key","shop_notice").single();if(data?.value){setShopNotice(data.value);setShopNoticeSaved(data.value);}};
  useEffect(()=>{fI();fP();fNotice();},[]);
  const saveNotice=async()=>{setNoticeSaving(true);const{data:ex}=await supabase.from("site_settings").select("id").eq("key","shop_notice").single();if(ex){await supabase.from("site_settings").update({value:shopNotice}).eq("key","shop_notice");}else{await supabase.from("site_settings").insert({key:"shop_notice",value:shopNotice});}setShopNoticeSaved(shopNotice);setNoticeSaving(false);};
  const addItem=async()=>{if(!form.name||!form.price)return;await supabase.from("shop_items").insert(form);setForm({name:"",description:"",price:0});setShowAdd(false);fI();};
  const toggleItem=async(id:number,active:boolean)=>{await supabase.from("shop_items").update({active:!active}).eq("id",id);fI();};
  const delItem=async(id:number)=>{if(!confirm("삭제?"))return;await supabase.from("shop_items").delete().eq("id",id);fI();};
  const processOrder=async(id:number,status:string)=>{await supabase.from("purchases").update({status}).eq("id",id);fP();if(onProcess)onProcess();};
  const pending=purchases.filter(p=>p.status==="pending"||!p.status);
  const done=purchases.filter(p=>p.status==="done");
  return(<div><div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">🏪 상점 관리</h2><button onClick={()=>setShowAdd(true)} className="admin-btn px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"><Icon type="plus" size={14}/>상품 추가</button></div>

    {/* 상점 상단 안내 편집 */}
    <div className="bg-white rounded-2xl p-5 shadow-sm mb-6 border-l-4" style={{borderLeftColor:"#D4AF37"}}>
      <h3 className="font-semibold text-sm mb-1 flex items-center gap-2">📌 상점 상단 안내 <span className="text-[10px] font-normal text-slate-400">(학생 상점 화면 맨 위에 표시됩니다)</span></h3>
      <textarea className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm mt-2 border-0 resize-none h-28 focus:ring-2 focus:ring-[#D4AF37]/20 outline-none" value={shopNotice} onChange={e=>setShopNotice(e.target.value)} placeholder="예: 서서갈비 사용법, 구매 안내, 주의사항 등을 자유롭게 적어주세요.&#10;내용이 없으면 학생에게 표시되지 않습니다."/>
      <div className="flex items-center gap-3 mt-2"><button onClick={saveNotice} disabled={noticeSaving} className="admin-btn px-5 py-2 rounded-xl text-xs font-semibold disabled:opacity-60">{noticeSaving?"저장 중...":"저장"}</button>{shopNoticeSaved===shopNotice&&shopNoticeSaved&&<span className="text-xs text-green-500">✓ 저장됨</span>}</div>
    </div>
    {showAdd&&<div className="bg-white rounded-2xl p-5 shadow-sm mb-4 space-y-3"><div className="grid grid-cols-2 gap-3"><div><label className="text-xs font-semibold text-slate-500">상품명</label><input className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div><div><label className="text-xs font-semibold text-slate-500">가격 (서서갈비)</label><input type="number" className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={form.price} onChange={e=>setForm(p=>({...p,price:Number(e.target.value)}))}/></div></div><div><label className="text-xs font-semibold text-slate-500">설명</label><input className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))}/></div><div className="flex gap-2"><button onClick={addItem} className="bg-[#D4AF37] text-white px-4 py-2 rounded-xl text-xs font-semibold">추가</button><button onClick={()=>setShowAdd(false)} className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-2.5 py-1 rounded-lg bg-slate-100 transition-colors">취소</button></div></div>}

    {/* 미처리 주문 */}
    {pending.length>0&&<div className="mb-6"><h3 className="font-semibold text-sm mb-3 text-amber-600">📦 미처리 주문 ({pending.length}건)</h3><div className="space-y-2">{pending.map((p:any)=>(<div key={p.id} className="bg-amber-50 rounded-xl p-4 flex justify-between items-center"><div><p className="font-semibold text-sm">{p.users?.name||"?"} — {p.shop_items?.name||"아이템"}</p><p className="text-xs text-slate-400">{p.created_at?.slice(0,10)} · 🥩 {p.price}</p></div><div className="flex gap-2"><button onClick={()=>processOrder(p.id,"done")} className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-semibold">처리 완료</button><button onClick={()=>processOrder(p.id,"cancelled")} className="bg-red-50 text-red-500 px-3 py-1 rounded-lg text-xs font-semibold">취소</button></div></div>))}</div></div>}

    {/* 상품 목록 */}
    <h3 className="font-semibold text-sm mb-3">상품 목록</h3>
    <div className="space-y-2 mb-6">{items.map((item:any)=>(<div key={item.id} className={`bg-white rounded-xl p-4 shadow-sm flex justify-between items-center ${!item.active?"opacity-50":""}`}><div><p className="font-semibold text-sm">{item.name}</p><p className="text-xs text-slate-400">{item.description||"설명 없음"} · 🥩 {item.price}</p></div><div className="flex gap-2"><button onClick={()=>toggleItem(item.id,item.active)} className="text-xs font-semibold text-slate-700 hover:text-[#D4AF37] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#D4AF37]/10 transition-colors">{item.active?"비활성":"활성"}</button><button onClick={()=>delItem(item.id)} className="text-xs font-semibold text-slate-700 hover:text-red-500 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50 transition-colors">삭제</button></div></div>))}{items.length===0&&<div className="bg-white rounded-2xl p-12 shadow-sm text-center text-slate-400 text-sm">상품을 추가하세요</div>}</div>

    {/* 처리 완료 내역 */}
    {done.length>0&&<div><h3 className="font-semibold text-sm mb-3">처리 완료 내역</h3><div className="space-y-2">{done.slice(0,20).map((p:any)=>(<div key={p.id} className="bg-slate-50 rounded-xl px-4 py-3 flex justify-between items-center"><div><p className="text-sm">{p.users?.name||"?"} — {p.shop_items?.name||""}</p><p className="text-[10px] text-slate-400">{p.created_at?.slice(0,10)}</p></div><span className="text-xs text-green-500 font-semibold">✓ 완료</span></div>))}</div></div>}
  </div>);
}

/* ═══ SHOP NOTICE BOX (학생용 읽기) ═══ */
function ShopNoticeBox(){
  const[notice,setNotice]=useState<string>("");
  useEffect(()=>{(async()=>{const{data}=await supabase.from("site_settings").select("value").eq("key","shop_notice").single();if(data?.value)setNotice(data.value);})();},[]);
  if(!notice||!notice.trim())return null;
  return(<div className="mb-5 rounded-2xl p-4 border" style={{background:"linear-gradient(135deg,rgba(212,175,55,0.06),rgba(212,175,55,0.03))",border:"1px solid rgba(212,175,55,0.25)",wordBreak:"break-word",overflowWrap:"break-word"}}><div className="flex items-center gap-2 mb-2"><span style={{fontSize:"15px"}}>📌</span><p className="text-xs font-bold" style={{color:"var(--c-gold)",fontFamily:"'Montserrat',sans-serif",letterSpacing:"0.05em"}}>상점 안내</p></div><p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{notice}</p></div>);
}

/* ═══ SHORTS GRID ═══ */
function ShortsGrid(){
  const[shorts,setShorts]=useState<any[]>([]);const[playing,setPlaying]=useState<string|null>(null);
  useEffect(()=>{(async()=>{const{data}=await supabase.from("shorts").select("*").order("created_at",{ascending:false});if(data)setShorts(data);})();},[]);
  if(shorts.length===0)return(<div className="ios-glass-card p-12 text-center text-slate-400 text-sm">영상 준비 중입니다</div>);
  return(<>{playing&&<div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={()=>setPlaying(null)}><div className="relative w-full max-w-sm" style={{aspectRatio:"9/16"}} onClick={e=>e.stopPropagation()}><iframe src={`https://www.youtube.com/embed/${playing}?autoplay=1&loop=1`} className="w-full h-full rounded-2xl" allow="autoplay; encrypted-media" allowFullScreen/><button onClick={()=>setPlaying(null)} className="absolute -top-3 -right-3 bg-white w-8 h-8 rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:text-red-500 transition-colors"><Icon type="close" size={16}/></button></div></div>}
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">{shorts.map((s:any)=>(<button key={s.id} onClick={()=>setPlaying(s.video_id)} className="group relative bg-black rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:scale-[1.02]" style={{aspectRatio:"9/16"}}><img src={`https://img.youtube.com/vi/${s.video_id}/0.jpg`} alt={s.title} className="absolute inset-0 w-full h-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"/><div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg"><svg viewBox="0 0 24 24" width="20" height="20" fill="#D4AF37"><polygon points="8 5 20 12 8 19"/></svg></div></div>{s.title&&<p className="absolute bottom-2 left-2 right-2 text-[10px] text-white font-semibold leading-tight line-clamp-2">{s.title}</p>}</button>))}</div></>);
}

/* ═══ ADMIN: REVIEW MANAGER ═══ */
function AdminReviewViewer(){
  const[reviews,setReviews]=useState<any[]>([]);const[showAdd,setShowAdd]=useState(false);
  const[form,setForm]=useState({display_name:"",display_school:"",best_grade:"",keywords:"",content:""});
  const[editId,setEditId]=useState<number|null>(null);const[editForm,setEditForm]=useState({display_name:"",display_school:"",best_grade:"",keywords:"",content:""});
  const fR=async()=>{const{data}=await supabase.from("reviews").select("*").eq("is_featured",true).order("created_at",{ascending:false});if(data)setReviews(data);};
  useEffect(()=>{fR();},[]);
  const addReview=async()=>{if(!form.content||!form.display_name)return;await supabase.from("reviews").insert({display_name:form.display_name,display_school:form.display_school,best_grade:form.best_grade,keywords:form.keywords,content:form.content,is_featured:true});setForm({display_name:"",display_school:"",best_grade:"",keywords:"",content:""});setShowAdd(false);fR();};
  const delReview=async(id:number)=>{if(!confirm("삭제?"))return;await supabase.from("reviews").delete().eq("id",id);fR();};
  const startEdit=(r:any)=>{setEditId(r.id);setEditForm({display_name:r.display_name||"",display_school:r.display_school||"",best_grade:r.best_grade||"",keywords:r.keywords||"",content:r.content||""});};
  const saveEdit=async()=>{if(!editId||!editForm.content||!editForm.display_name)return;await supabase.from("reviews").update({display_name:editForm.display_name,display_school:editForm.display_school,best_grade:editForm.best_grade,keywords:editForm.keywords,content:editForm.content}).eq("id",editId);setEditId(null);fR();};
  const kwOptions=["흥미유발","관리","발문해석","좋은자료","기발한풀이","이해가잘되는해설","친근함","열정","소통","꼼꼼함"];
  const kwToggle=(kws:string,kw:string)=>{const cur=kws.split(",").map(k=>k.trim()).filter(Boolean);if(cur.includes(kw))return cur.filter(k=>k!==kw).join(",");return[...cur,kw].join(",");};
  return(<div><div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">✍️ 후기 관리 (로그인 화면 노출용)</h2><button onClick={()=>setShowAdd(true)} className="admin-btn px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1"><Icon type="plus" size={14}/>후기 추가</button></div>
    {showAdd&&<div className="bg-white rounded-2xl p-5 shadow-sm mb-4 space-y-3">
      <div className="grid grid-cols-2 gap-3"><div><label className="text-xs font-semibold text-slate-500">학생 이름 *</label><input className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={form.display_name} onChange={e=>setForm(p=>({...p,display_name:e.target.value}))} placeholder="예: 김OO"/></div><div><label className="text-xs font-semibold text-slate-500">학교</label><input className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={form.display_school} onChange={e=>setForm(p=>({...p,display_school:e.target.value}))} placeholder="예: 서서고"/></div></div>
      <div><label className="text-xs font-semibold text-slate-500">성적 향상</label><input className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={form.best_grade} onChange={e=>setForm(p=>({...p,best_grade:e.target.value}))} placeholder="예: 500등 → 100등"/></div>
      <div><label className="text-xs font-semibold text-slate-500">장점 키워드 (쉼표 구분)</label><div className="flex flex-wrap gap-1.5 mt-1">{kwOptions.map(kw=>{const sel=form.keywords.split(",").map(k=>k.trim()).includes(kw);return(<button key={kw} onClick={()=>setForm(p=>({...p,keywords:kwToggle(p.keywords,kw)}))} className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${sel?"bg-[#D4AF37] text-white":"bg-slate-100 text-slate-500"}`}>#{kw}</button>);})}</div></div>
      <div><label className="text-xs font-semibold text-slate-500">수강 후기 *</label><textarea className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm mt-1 border-0 resize-none h-24" value={form.content} onChange={e=>setForm(p=>({...p,content:e.target.value}))} placeholder="후기 내용"/></div>
      <div className="flex gap-2"><button onClick={addReview} className="bg-[#D4AF37] text-white px-4 py-2 rounded-xl text-xs font-semibold">추가</button><button onClick={()=>setShowAdd(false)} className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-2.5 py-1 rounded-lg bg-slate-100 transition-colors">취소</button></div>
    </div>}
    <p className="text-xs text-slate-400 mb-3">아래 후기들이 로그인 화면 하단 슬라이더에 표시됩니다.</p>
    {reviews.length>0?<div className="space-y-3">{reviews.map((r:any)=>(<div key={r.id} className="bg-white rounded-2xl p-5 shadow-sm">
      {editId===r.id?<div className="space-y-3">
        <div className="grid grid-cols-2 gap-3"><div><label className="text-xs font-semibold text-slate-500">학생 이름 *</label><input className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={editForm.display_name} onChange={e=>setEditForm(p=>({...p,display_name:e.target.value}))}/></div><div><label className="text-xs font-semibold text-slate-500">학교</label><input className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={editForm.display_school} onChange={e=>setEditForm(p=>({...p,display_school:e.target.value}))}/></div></div>
        <div><label className="text-xs font-semibold text-slate-500">성적 향상</label><input className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm mt-1 border-0" value={editForm.best_grade} onChange={e=>setEditForm(p=>({...p,best_grade:e.target.value}))} placeholder="예: 500등 → 100등"/></div>
        <div><label className="text-xs font-semibold text-slate-500">장점 키워드</label><div className="flex flex-wrap gap-1.5 mt-1">{kwOptions.map(kw=>{const sel=editForm.keywords.split(",").map(k=>k.trim()).includes(kw);return(<button key={kw} onClick={()=>setEditForm(p=>({...p,keywords:kwToggle(p.keywords,kw)}))} className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${sel?"bg-[#D4AF37] text-white":"bg-slate-100 text-slate-500"}`}>#{kw}</button>);})}</div></div>
        <div><label className="text-xs font-semibold text-slate-500">수강 후기 *</label><textarea className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm mt-1 border-0 resize-none h-24" value={editForm.content} onChange={e=>setEditForm(p=>({...p,content:e.target.value}))}/></div>
        <div className="flex gap-2"><button onClick={saveEdit} className="bg-[#D4AF37] text-white px-4 py-2 rounded-xl text-xs font-semibold">저장</button><button onClick={()=>setEditId(null)} className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-2.5 py-1 rounded-lg bg-slate-100 transition-colors">취소</button></div>
      </div>:<>
        <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-lg">{r.display_name||"?"}</span><span className="text-xs text-slate-400">{r.display_school||""}</span></div><div className="flex items-center gap-2"><button onClick={()=>startEdit(r)} className="text-xs font-semibold text-slate-700 hover:text-[#D4AF37] transition-colors px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#D4AF37]/10">수정</button><button onClick={()=>delReview(r.id)} className="text-xs font-semibold text-slate-700 hover:text-red-500 transition-colors px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50">삭제</button></div></div>
        {r.best_grade&&<p className="text-xs text-amber-600 font-semibold mb-1">📈 {r.best_grade}</p>}
        {r.keywords&&<div className="flex flex-wrap gap-1 mb-2">{r.keywords.split(",").map((kw:string)=>(<span key={kw} className="bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded-full text-[10px] font-semibold">#{kw}</span>))}</div>}
        <p className="text-sm text-slate-600 whitespace-pre-line">{r.content}</p>
      </>}
    </div>))}</div>:<div className="bg-white rounded-2xl p-12 shadow-sm text-center text-slate-400 text-sm">후기를 추가하면 로그인 화면에 표시됩니다</div>}
  </div>);
}

/* ═══ ADMIN: STUDENT REVIEW VIEWER ═══ */
function AdminStudentReviewViewer(){
  const[reviews,setReviews]=useState<any[]>([]);
  const fR=async()=>{const{data}=await supabase.from("reviews").select("*, users:user_id(name, school, login_id)").not("user_id","is",null).order("created_at",{ascending:false});if(data)setReviews(data);};
  useEffect(()=>{fR();},[]);
  const delStudentReview=async(id:number)=>{if(!confirm("이 학생 후기를 삭제할까요?"))return;await supabase.from("reviews").delete().eq("id",id);fR();};
  return(<div><h2 className="text-lg font-bold mb-4">📝 학생 후기 ({reviews.length}건)</h2>
    {reviews.length>0?<div className="space-y-3">{reviews.map((r:any)=>(<div key={r.id} className="bg-white rounded-2xl p-5 shadow-sm"><div className="flex items-center gap-2 mb-3"><span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-lg">{r.users?.login_id||r.users?.name||"?"}</span><span className="text-xs text-slate-400">{r.users?.school||""}</span><span className="text-xs text-slate-300 ml-auto">{r.created_at?.slice(0,10)}</span><button onClick={()=>delStudentReview(r.id)} className="text-xs font-semibold text-slate-700 hover:text-red-500 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50 transition-colors">삭제</button></div>
      {r.best_grade&&<div className="mb-2"><p className="text-[10px] font-semibold text-slate-400">📈 성적 향상</p><p className="text-sm font-bold text-slate-700">{r.best_grade}</p></div>}
      {r.keywords&&<div className="flex flex-wrap gap-1.5 mb-2">{r.keywords.split(",").map((kw:string,i:number)=>(<span key={i} className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${i===0?"bg-amber-100 text-amber-600":i===1?"bg-slate-100 text-slate-500":"bg-orange-50 text-orange-400"}`}>{i+1}순위 #{kw}</span>))}</div>}
      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{r.content}</p>
    </div>))}</div>:<div className="bg-white rounded-2xl p-12 shadow-sm text-center text-slate-400 text-sm">학생이 작성한 후기가 없습니다</div>}
  </div>);
}

/* ═══ ADMIN: SHORTS MANAGER ═══ */
function AdminShortsManager(){
  const[shorts,setShorts]=useState<any[]>([]);const[url,setUrl]=useState("");const[title,setTitle]=useState("");
  const fS=async()=>{const{data}=await supabase.from("shorts").select("*").order("created_at",{ascending:false});if(data)setShorts(data);};
  useEffect(()=>{fS();},[]);
  const extractId=(u:string)=>{const m=u.match(/(?:shorts\/|youtu\.be\/|embed\/|v=|\/v\/)([a-zA-Z0-9_-]{11})/);if(m)return m[1];const clean=u.trim();if(/^[a-zA-Z0-9_-]{11}$/.test(clean))return clean;return "";};
  const addShort=async()=>{const vid=extractId(url);if(!vid){alert("유효한 유튜브 URL 또는 영상 ID를 입력해주세요");return;}const{error}=await supabase.from("shorts").insert({video_id:vid,title});if(error){alert("저장 실패: "+error.message);return;}setUrl("");setTitle("");fS();alert("추가 완료!");};
  const delShort=async(id:number)=>{if(!confirm("삭제?"))return;await supabase.from("shorts").delete().eq("id",id);fS();};
  return(<div><h2 className="text-lg font-bold mb-4">▶ 쇼츠 관리</h2>
    <div className="bg-white rounded-2xl p-5 shadow-sm mb-4 space-y-3"><p className="text-xs text-slate-400">유튜브 쇼츠 URL을 붙여넣기</p><div className="flex gap-2"><input className="flex-1 bg-slate-50 rounded-xl px-4 py-2.5 text-sm border-0" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://youtube.com/shorts/xxxxx"/></div><div className="flex gap-2"><input className="flex-1 bg-slate-50 rounded-xl px-4 py-2.5 text-sm border-0" value={title} onChange={e=>setTitle(e.target.value)} placeholder="제목 (선택)"/><button onClick={addShort} className="bg-[#D4AF37] text-white px-5 py-2.5 rounded-xl text-xs font-semibold">추가</button></div></div>
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">{shorts.map((s:any)=>(<div key={s.id} className="relative group"><div className="bg-black rounded-xl overflow-hidden shadow-sm" style={{aspectRatio:"9/16"}}><img src={`https://img.youtube.com/vi/${s.video_id}/0.jpg`} alt="" className="w-full h-full object-cover"/></div><button onClick={()=>delShort(s.id)} className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">×</button>{s.title&&<p className="text-[10px] text-slate-500 mt-1 truncate">{s.title}</p>}</div>))}</div>
  </div>);
}

/* ═══ ADMIN SITE SETTINGS ═══ */
function AdminSiteSettings({settings,fetchSettings}:{settings:any;fetchSettings:()=>void}){
  const[name,setName]=useState(settings.profile_name||"");const[bio,setBio]=useState(settings.profile_bio||"");const[upl,setUpl]=useState("");const[msg,setMsg]=useState("");const pRef=useRef<HTMLInputElement>(null);const bRef=useRef<HTMLInputElement>(null);
  const saveMeta=async()=>{await supabase.from("site_settings").update({value:name}).eq("key","profile_name");await supabase.from("site_settings").update({value:bio}).eq("key","profile_bio");setMsg("저장!");fetchSettings();};
  const up=async(file:File,key:string)=>{setUpl(key);const url=await uploadImage(file,key);if(url){await supabase.from("site_settings").update({value:url}).eq("key",key);fetchSettings();}setUpl("");};
  return(<div><h2 className="text-lg font-bold mb-4">로그인 화면 설정</h2><div className="grid grid-cols-1 lg:grid-cols-2 gap-4"><div className="bg-white rounded-2xl p-6 shadow-sm"><h3 className="font-semibold text-sm mb-4">프로필</h3><div className="flex items-center gap-4 mb-4"><img src={settings.profile_image||"/profile.png"} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-slate-100"/><button onClick={()=>pRef.current?.click()} className="bg-[#D4AF37] text-white px-4 py-2 rounded-xl text-xs font-semibold">{upl==="profile_image"?"...":"사진 변경"}</button><input ref={pRef} type="file" accept="image/*" className="hidden" onChange={e=>{if(e.target.files?.[0])up(e.target.files[0],"profile_image");}}/></div><div className="space-y-3"><div><label className="text-xs font-semibold text-slate-500">이름</label><input className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm mt-1 border-0" value={name} onChange={e=>setName(e.target.value)}/></div><div><label className="text-xs font-semibold text-slate-500">약력 (\\n = 줄바꿈)</label><textarea className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm mt-1 border-0 resize-none h-28" value={bio} onChange={e=>setBio(e.target.value)}/></div></div><button onClick={saveMeta} className="mt-3 bg-[#D4AF37] text-white px-6 py-2.5 rounded-xl text-sm font-semibold">저장</button>{msg&&<span className="text-xs text-green-500 ml-2">{msg}</span>}</div><div className="bg-white rounded-2xl p-6 shadow-sm"><h3 className="font-semibold text-sm mb-4">배경</h3><div className="rounded-xl overflow-hidden mb-4 bg-slate-100 h-[200px]">{settings.background_image&&settings.background_image.length>5?<img src={settings.background_image} alt="" className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center text-slate-300 text-sm">없음</div>}</div><button onClick={()=>bRef.current?.click()} className="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold">{upl==="background_image"?"...":"배경 변경"}</button><input ref={bRef} type="file" accept="image/*" className="hidden" onChange={e=>{if(e.target.files?.[0])up(e.target.files[0],"background_image");}}/></div></div></div>);
}

/* ═══ MAIN ═══ */
export default function Home(){
  const[user,setUser]=useState<any>(null);const[tab,setTab]=useState("classes");const[mm,setMm]=useState(false);
  const[users,setUsers]=useState<any[]>([]);const[groups,setGroups]=useState<any[]>([]);const[loading,setLoading]=useState(false);const[initializing,setInitializing]=useState(true);
  const[unansweredInq,setUnansweredInq]=useState(0);
  const[pendingOrders,setPendingOrders]=useState(0);
  const[settings,setSettings]=useState<any>({profile_name:"서정인 수학",profile_bio:"",profile_image:"",background_image:""});
  const[adminUnlocked,setAdminUnlocked]=useState(false);const[adminPwInput,setAdminPwInput]=useState("");const[adminPwErr,setAdminPwErr]=useState("");

  const fU=async()=>{const{data}=await supabase.from("users").select("*").order("created_at",{ascending:false});if(data)setUsers(data);};
  const fG=async()=>{const{data}=await supabase.from("class_groups").select("*").order("created_at");if(data)setGroups(data);};
  const fInqCount=async()=>{const{count}=await supabase.from("inquiries").select("*",{count:"exact",head:true}).or("reply.is.null,reply.eq.");if(count)setUnansweredInq(count);else setUnansweredInq(0);};
  const fOrderCount=async()=>{const{count}=await supabase.from("purchases").select("*",{count:"exact",head:true}).or("status.is.null,status.eq.pending");if(count)setPendingOrders(count);else setPendingOrders(0);};
  const fS=async()=>{const{data}=await supabase.from("site_settings").select("*");if(data){const s:any={};data.forEach((r:any)=>{s[r.key]=r.value;});setSettings(s);}};
  useEffect(()=>{fS();
    // 모바일 줌 방지: viewport meta 설정
    let vp=document.querySelector('meta[name="viewport"]') as HTMLMetaElement;if(!vp){vp=document.createElement("meta");vp.name="viewport";document.head.appendChild(vp);}vp.content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
    try{const saved=window.localStorage.getItem("suhsuh_user");if(saved){const u=JSON.parse(saved);if(u&&u.id){(async()=>{const{data}=await supabase.from("users").select("*").eq("id",u.id).single();if(data&&data.status!=="pending"){setUser(data);setTab(data.role==="admin"?"classes":"grades");}setInitializing(false);})();return;}}
    }catch{}setInitializing(false);
  },[]);
  useEffect(()=>{if(user){setLoading(true);Promise.all([fU(),fG(),fInqCount(),fOrderCount()]).then(()=>setLoading(false));window.localStorage.setItem("suhsuh_user",JSON.stringify({id:user.id}));}else{window.localStorage.removeItem("suhsuh_user");}},[user]);

  const handleLogin=async(id:string,pw:string):Promise<string>=>{const{data}=await supabase.from("users").select("*").eq("login_id",id).eq("password",pw).single();if(!data)return"아이디 또는 비밀번호 오류";if(data.status==="pending")return"승인 대기 중";setUser(data);setTab(data.role==="admin"?"classes":"grades");return"";};
  const logout=()=>{setUser(null);setTab("classes");};

  if(initializing)return<div className="min-h-screen bg-[#f0f2f8] flex items-center justify-center"><img src="/logo.png" alt="" className="h-10 opacity-50 animate-pulse"/></div>;
  if(!user)return<LoginScreen onLogin={handleLogin} settings={settings}/>;
  if(loading)return<div className="lux-bg min-h-screen flex items-center justify-center"><img src="/logo.png" alt="" className="h-10 opacity-40 animate-pulse mx-auto"/></div>;
  if(user.role!=="admin")return<StudentView user={user} logout={logout}/>;

  const ADMIN_SECRET="Tjwjddls1!";
  const lockedTabs=["exams","tokens","shop","reviews","studentReviews","shorts","notices","inquiries","site","changepw"];
  const tryUnlock=()=>{if(adminPwInput===ADMIN_SECRET){setAdminUnlocked(true);setAdminPwErr("");}else{setAdminPwErr("비밀번호가 틀렸습니다");}};
  const handleAdminTab=(id:string,mob?:boolean)=>{if(lockedTabs.includes(id)&&!adminUnlocked){setTab("unlock");if(mob)setMm(false);return;}setTab(id);if(mob)setMm(false);if(id==="inquiries")fInqCount();if(id==="shop")fOrderCount();};

  const miPublic=[{id:"classes",icon:"folder",label:"반 관리"},{id:"students",icon:"users",label:"학생 관리"}];
  const miLocked=[{id:"exams",icon:"test",label:"시험 성적"},{id:"tokens",icon:"coin",label:"서서갈비"},{id:"shop",icon:"cart",label:"상점 관리"},{id:"reviews",icon:"msg",label:"후기 관리"},{id:"studentReviews",icon:"msg",label:"학생 후기"},{id:"shorts",icon:"play",label:"쇼츠 관리"},{id:"calendar",icon:"home",label:"캘린더 관리"},{id:"notices",icon:"bell",label:"공지사항"},{id:"inquiries",icon:"msg",label:"문의사항"},{id:"site",icon:"upload",label:"로그인 화면"},{id:"changepw",icon:"settings",label:"비밀번호 변경"}];

  const navEl=(mob?:boolean)=>(<nav className={`${mob?"":"flex-1"} space-y-0.5`}>
    {miPublic.map(m=>(<button key={m.id} onClick={()=>handleAdminTab(m.id,mob)} className={`luxury-nav-btn flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium relative ${tab===m.id?"admin-active":"text-slate-500"}`}><span className="shimmer-nav"/><Icon type={m.icon} size={18}/>{m.label}</button>))}
    <div className="pt-2 mt-2" style={{borderTop:"1px solid rgba(212,175,55,0.08)"}}>
      <button onClick={()=>{if(adminUnlocked){setAdminUnlocked(false);setAdminPwInput("");setTab("classes");if(mob)setMm(false);}else{setTab("unlock");if(mob)setMm(false);}}} className="flex items-center gap-2 w-full px-3 py-1.5 mb-1 text-[10px] font-semibold" style={{color:"rgba(212,175,55,0.65)",fontFamily:"'Montserrat',sans-serif"}}>{adminUnlocked?"🔓 관리 메뉴 (잠그기)":"🔒 관리 메뉴 (잠김)"}</button>
      {adminUnlocked&&miLocked.map(m=>(<button key={m.id} onClick={()=>handleAdminTab(m.id,mob)} className={`luxury-nav-btn flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium relative ${tab===m.id?"admin-active":"text-slate-500"}`}><span className="shimmer-nav"/><Icon type={m.icon} size={18}/>{m.label}{m.id==="inquiries"&&unansweredInq>0&&<span className="bg-red-500 text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center ml-auto">{unansweredInq}</span>}{m.id==="shop"&&pendingOrders>0&&<span className="bg-red-500 text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center ml-auto">{pendingOrders}</span>}</button>))}
    </div>
  </nav>);

  return(<div className="min-h-screen flex" style={{background:"linear-gradient(135deg,#faf9f7 0%,#ffffff 40%,#fdfbf6 100%)",fontFamily:"'Montserrat',sans-serif"}}>
    <aside className="hidden lg:flex flex-col w-56 min-h-screen p-2 fixed left-0 top-0 bottom-0 z-40"><div className="flex flex-col flex-1 rounded-3xl p-5 border" style={{background:"rgba(255,255,255,0.92)",backdropFilter:"blur(32px)",WebkitBackdropFilter:"blur(32px)",border:"1px solid rgba(212,175,55,0.08)",boxShadow:"var(--c-shadow-card)"}}><div className="flex items-center gap-3 mb-7"><img src="/logo.png" alt="" className="h-7 object-contain"/><span className="font-semibold text-sm" style={{color:"var(--c-text-primary)",fontFamily:"var(--font-serif)",fontWeight:600,letterSpacing:"-0.02em"}}>서정인 수학</span></div>{navEl()}<div className="pt-4 mt-4" style={{borderTop:"1px solid rgba(212,175,55,0.08)"}}><div className="flex items-center gap-3 mb-3 px-1"><div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:"rgba(212,175,55,0.15)",color:"var(--c-gold)"}}><Icon type="user" size={14}/></div><div><p className="text-xs font-semibold" style={{color:"var(--c-text-primary)",fontWeight:600}}>{user.name}</p><p className="text-[10px]" style={{color:"var(--c-text-muted)"}}>관리자</p></div></div><button onClick={logout} className="luxury-nav-btn flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm transition-colors" style={{color:"rgba(200,80,80,0.7)"}}><Icon type="logout" size={16}/>로그아웃</button></div></div></aside>
    <div className="lux-topbar lg:hidden fixed top-0 left-0 right-0 z-40 px-4 py-3 flex justify-between items-center"><div className="flex items-center gap-2"><img src="/logo.png" alt="" className="h-6 object-contain"/><span className="font-bold text-sm" style={{color:"var(--c-text-primary)",fontFamily:"var(--font-serif)",fontWeight:600}}>서정인 수학</span></div><button onClick={()=>setMm(!mm)}><Icon type={mm?"close":"menu"} size={22}/></button></div>
    {mm&&<><div onClick={()=>setMm(false)} className="lg:hidden fixed inset-0 z-40" style={{background:"rgba(10,8,20,0.4)",backdropFilter:"blur(4px)"}}/><div className="lg:hidden fixed right-0 top-0 bottom-0 w-64 z-50 p-5" style={{background:"rgba(250,249,255,0.98)",backdropFilter:"blur(32px)",WebkitBackdropFilter:"blur(32px)",boxShadow:"-8px 0 40px rgba(212,175,55,0.1)",borderLeft:"1px solid rgba(212,175,55,0.08)"}}><div className="flex justify-between items-center mb-6"><span className="font-semibold" style={{fontFamily:"'Playfair Display',serif"}}>메뉴</span><button onClick={()=>setMm(false)}><Icon type="close" size={20}/></button></div>{navEl(true)}<button onClick={()=>{logout();setMm(false);}} className="luxury-nav-btn flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm mt-3" style={{color:"rgba(200,80,80,0.7)"}}><Icon type="logout" size={16}/>로그아웃</button></div></>}
    <main className="flex-1 lg:ml-56 pt-16 lg:pt-0"><div className="max-w-5xl mx-auto p-5 lg:p-8">
      {tab==="unlock"&&<div className="max-w-sm mx-auto mt-20"><div className="rounded-3xl p-8 text-center border" style={{background:"rgba(250,249,255,0.97)",backdropFilter:"blur(32px)",WebkitBackdropFilter:"blur(32px)",border:"1px solid rgba(212,175,55,0.1)",boxShadow:"var(--c-shadow-card)"}}><div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl" style={{background:"linear-gradient(135deg,rgba(212,175,55,0.08),rgba(212,175,55,0.06))"}}>🔒</div><h2 className="text-lg font-semibold mb-1" style={{fontFamily:"'Playfair Display',serif",color:"#1a1628"}}>관리 메뉴</h2><p className="text-xs mb-6" style={{color:"rgba(130,120,150,0.7)",fontFamily:"'Montserrat',sans-serif"}}>접근하려면 비밀번호를 입력하세요</p><input type="password" className="w-full rounded-2xl px-4 py-3 text-sm outline-none text-center mb-3" style={{background:"rgba(245,244,255,0.8)",border:"1px solid rgba(212,175,55,0.15)",fontFamily:"'Montserrat',sans-serif",color:"#1a1628"}} value={adminPwInput} onChange={e=>{setAdminPwInput(e.target.value);setAdminPwErr("");}} placeholder="비밀번호" onKeyDown={e=>e.key==="Enter"&&tryUnlock()}/>{adminPwErr&&<p className="text-xs mb-3" style={{color:"#e05555",fontFamily:"'Montserrat',sans-serif"}}>{adminPwErr}</p>}<button onClick={tryUnlock} className="admin-btn w-full py-3 rounded-2xl font-semibold text-sm" style={{letterSpacing:"0.1em"}}>확인</button></div></div>}
      {tab==="classes"&&<AdminClassManager users={users}/>}
      {tab==="students"&&<AdminStudentManager users={users} fetchUsers={fU} groups={groups}/>}
      {tab==="exams"&&adminUnlocked&&<AdminExamViewer users={users}/>}
      {tab==="tokens"&&adminUnlocked&&<AdminTokenManager users={users} fetchUsers={fU}/>}
      {tab==="shop"&&adminUnlocked&&<AdminShopManager onProcess={fOrderCount}/>}
      {tab==="notices"&&adminUnlocked&&<AdminNoticeManager groups={groups}/>}
      {tab==="calendar"&&adminUnlocked&&<AdminCalendarManager groups={groups}/>}
      {tab==="reviews"&&adminUnlocked&&<AdminReviewViewer/>}
      {tab==="studentReviews"&&adminUnlocked&&<AdminStudentReviewViewer/>}
      {tab==="shorts"&&adminUnlocked&&<AdminShortsManager/>}
      {tab==="inquiries"&&adminUnlocked&&<AdminInquiryManager onReply={fInqCount}/>}
      {tab==="site"&&adminUnlocked&&<AdminSiteSettings settings={settings} fetchSettings={fS}/>}
      {tab==="changepw"&&adminUnlocked&&<div className="max-w-sm"><h2 className="text-lg font-bold mb-4">🔒 비밀번호 변경</h2><div className="bg-white rounded-2xl p-6 shadow-sm space-y-3"><input type="password" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm border-0" id="admin-pw1" placeholder="새 비밀번호"/><input type="password" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm border-0" id="admin-pw2" placeholder="새 비밀번호 확인"/><button onClick={async()=>{const p1=(document.getElementById("admin-pw1") as HTMLInputElement).value;const p2=(document.getElementById("admin-pw2") as HTMLInputElement).value;if(!p1){alert("비밀번호를 입력하세요");return;}if(p1!==p2){alert("비밀번호가 일치하지 않습니다");return;}await supabase.from("users").update({password:p1}).eq("id",user.id);alert("비밀번호가 변경되었습니다!");(document.getElementById("admin-pw1") as HTMLInputElement).value="";(document.getElementById("admin-pw2") as HTMLInputElement).value="";}} className="admin-btn w-full py-3 rounded-xl font-semibold text-sm">변경</button></div></div>}
    </div></main>
  </div>);
}