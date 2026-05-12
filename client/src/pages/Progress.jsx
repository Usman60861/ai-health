import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Droplet, Moon, Calendar, Scale,
  Flame, Zap, Activity, X, ChevronRight, Award, BarChart2, Heart
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';

// ── Design tokens ──────────────────────────────────────────────
const CYAN   = '#2FE8FF';
const C55 = 'rgba(47,232,255,0.55)';
const C45 = 'rgba(47,232,255,0.45)';
const C35 = 'rgba(47,232,255,0.35)';
const C20 = 'rgba(47,232,255,0.2)';
const C15 = 'rgba(47,232,255,0.15)';
const C12 = 'rgba(47,232,255,0.12)';
const C10 = 'rgba(47,232,255,0.1)';
const C08 = 'rgba(47,232,255,0.08)';
const C05 = 'rgba(47,232,255,0.05)';
const CARD  = 'linear-gradient(160deg,#001428 0%,#001f3d 50%,#002d5c 100%)';
const CARD2 = 'linear-gradient(160deg,#0d1520 0%,#0a1a2e 50%,#0d2040 100%)';
const CLIP    = 'polygon(0 0,100% 0,100% calc(100% - 20px),calc(100% - 20px) 100%,0 100%)';
const CLIP_SM = 'polygon(0 0,100% 0,100% calc(100% - 16px),calc(100% - 16px) 100%,0 100%)';
const CLIP_BTN= 'polygon(0 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%)';

// ── Mini sparkline ──────────────────────────────────────────────
function Sparkline({ data, color, height = 48 }) {
  if (!data || data.length < 2) return <div style={{ height }} />;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const W = 200; const H = height;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - ((v - min) / range) * (H - 6) - 3,
  }));
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const area = line + ` L${pts[pts.length-1].x},${H} L0,${H} Z`;
  const gid = `sp${color.replace('#','')}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gid} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`}/>
      <motion.path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength:0 }} animate={{ pathLength:1 }}
        transition={{ duration:1.6, ease:'easeInOut' }}
        style={{ filter:`drop-shadow(0 0 4px ${color})` }}/>
    </svg>
  );
}

// ── Metric card ─────────────────────────────────────────────────
function MetricCard({ icon: Icon, title, value, unit, sub, color, sparkData, pct, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay }}
      style={{
        background: CARD, clipPath: CLIP,
        border: `1px solid ${hov ? color+'66' : C15}`,
        padding:'20px', position:'relative', overflow:'hidden',
        transition:'border-color 0.3s',
      }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      {/* top accent */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px',
        background:`linear-gradient(90deg,transparent,${color},transparent)`,
        opacity: hov ? 1 : 0.4, transition:'opacity 0.3s' }}/>

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'12px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'36px', height:'36px', display:'flex', alignItems:'center', justifyContent:'center',
            background:`${color}18`, border:`1px solid ${color}44`, clipPath:CLIP_BTN }}>
            <Icon size={18} color={color}/>
          </div>
          <div>
            <p style={{ color: C45, fontSize:'0.65rem', letterSpacing:'2px', textTransform:'uppercase', margin:0 }}>{title}</p>
            <p style={{ color, fontSize:'1.5rem', fontWeight:800, fontFamily:'Montserrat,sans-serif', margin:0, lineHeight:1.1 }}>
              {value}<span style={{ fontSize:'0.75rem', fontWeight:400, marginLeft:'4px', color:`${color}99` }}>{unit}</span>
            </p>
          </div>
        </div>
        <div style={{ textAlign:'right' }}>
          <p style={{ color: C35, fontSize:'0.7rem', margin:0 }}>{sub}</p>
        </div>
      </div>

      {/* progress bar */}
      <div style={{ height:'3px', background:C08, borderRadius:'2px', marginBottom:'10px' }}>
        <motion.div initial={{ width:0 }} animate={{ width:`${Math.min(pct*100,100)}%` }}
          transition={{ duration:1.2, ease:'easeOut', delay: delay+0.3 }}
          style={{ height:'100%', background:`linear-gradient(90deg,${color},${color}88)`,
            borderRadius:'2px', boxShadow:`0 0 6px ${color}` }}/>
      </div>

      <Sparkline data={sparkData} color={color} height={44}/>
    </motion.div>
  );
}

// ── Full area chart ─────────────────────────────────────────────
function AreaChart({ title, sub, dataKey, color, chartData, EmptyIcon, badge }) {
  const [hov, setHov] = useState(false);
  const vals = chartData.map(d => d[dataKey]).filter(v => v != null && v !== 0);
  const hasData = vals.length > 1;
  const latest = vals[vals.length-1];
  const prev   = vals[vals.length-2];
  const delta  = hasData ? (latest - prev).toFixed(1) : null;
  const up     = delta > 0;

  return (
    <div style={{ background:CARD2, clipPath:CLIP, border:`1px solid ${hov ? color+'55' : C15}`,
      padding:'24px', position:'relative', overflow:'hidden', transition:'border-color 0.3s' }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px',
        background:`linear-gradient(90deg,transparent,${color},transparent)`,
        opacity: hov ? 1 : 0.5, transition:'opacity 0.3s' }}/>

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'20px' }}>
        <div>
          <h3 style={{ color, fontFamily:'Montserrat,sans-serif', fontWeight:700, fontSize:'0.95rem', margin:'0 0 4px' }}>{title}</h3>
          <p style={{ color:C35, fontSize:'0.75rem', margin:0 }}>{sub}</p>
        </div>
        <div style={{ textAlign:'right' }}>
          {hasData && (
            <>
              <div style={{ color, fontSize:'1.4rem', fontWeight:800, fontFamily:'Montserrat,sans-serif', lineHeight:1 }}>
                {latest}{badge}
              </div>
              {delta !== null && (
                <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:'4px', marginTop:'4px' }}>
                  {up ? <TrendingUp size={12} color="#4ECDC4"/> : <TrendingDown size={12} color="#FF6B6B"/>}
                  <span style={{ color: up ? '#4ECDC4' : '#FF6B6B', fontSize:'0.75rem' }}>
                    {up ? '+' : ''}{delta}{badge}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div style={{ height:'160px' }}>
        {hasData ? (() => {
          const min = Math.min(...vals);
          const max = Math.max(...vals);
          const range = max - min || 1;
          const allPts = chartData.map((d, i) => ({
            x: (i / (chartData.length-1||1)) * 600,
            y: 150 - ((d[dataKey] - min) / range) * 130,
          }));
          const linePath = allPts.map((p,i) => `${i===0?'M':'L'}${p.x},${p.y}`).join(' ');
          const areaPath = linePath + ` L${allPts[allPts.length-1].x},160 L0,160 Z`;
          const gLine = `${dataKey}Line`; const gArea = `${dataKey}Area`;
          return (
            <svg width="100%" height="160" viewBox="0 0 600 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id={gLine} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={color}/><stop offset="100%" stopColor={color+'88'}/>
                </linearGradient>
                <linearGradient id={gArea} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={color} stopOpacity="0.2"/>
                  <stop offset="100%" stopColor={color} stopOpacity="0"/>
                </linearGradient>
              </defs>
              {[40,80,120].map(y => (
                <line key={y} x1="0" y1={y} x2="600" y2={y} stroke={C08} strokeWidth="1"/>
              ))}
              <path d={areaPath} fill={`url(#${gArea})`}/>
              <motion.path d={linePath} fill="none" stroke={`url(#${gLine})`}
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength:0 }} animate={{ pathLength:1 }}
                transition={{ duration:2, ease:'easeInOut' }}
                style={{ filter:`drop-shadow(0 0 4px ${color})` }}/>
              {allPts.map((p,i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={color}
                  style={{ filter:`drop-shadow(0 0 3px ${color})` }}/>
              ))}
            </svg>
          );
        })() : (
          <div style={{ height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'12px' }}>
            <EmptyIcon size={40} color={C20}/>
            <p style={{ color:C35, fontSize:'0.8rem', margin:0 }}>No data yet — start logging!</p>
          </div>
        )}
      </div>

      {hasData && (
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:'8px' }}>
          {chartData.filter((_,i) => i % Math.max(1, Math.floor(chartData.length/5)) === 0).map((d,i) => (
            <span key={i} style={{ color:C35, fontSize:'0.65rem' }}>{d.date}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Log timeline item ───────────────────────────────────────────
function LogItem({ log, index }) {
  const [hov, setHov] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const metrics = [
    { icon: Flame,  label:'Calories', value: log.caloriesConsumed, unit:'kcal', color:'#FF9800' },
    { icon: Droplet,label:'Water',    value: log.waterIntake,      unit:'L',    color: CYAN },
    { icon: Moon,   label:'Sleep',    value: log.sleepHours,       unit:'h',    color:'#A89FFF' },
  ];
  return (
    <motion.div
      initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
      transition={{ delay: index*0.07 }}
      style={{ background: hov ? C08 : C05, border:`1px solid ${hov ? C20 : C10}`,
        clipPath:CLIP_SM, overflow:'hidden', transition:'all 0.2s', cursor:'pointer' }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={() => setExpanded(!expanded)}
    >
      <div style={{ padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          {/* date badge */}
          <div style={{ width:'44px', height:'44px', display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center', background:C12,
            border:`1px solid ${C20}`, clipPath:CLIP_BTN, flexShrink:0 }}>
            <span style={{ color:CYAN, fontSize:'1rem', fontWeight:800, lineHeight:1 }}>
              {new Date(log.date).getDate()}
            </span>
            <span style={{ color:C45, fontSize:'0.55rem', letterSpacing:'1px', textTransform:'uppercase' }}>
              {new Date(log.date).toLocaleDateString('en-US',{month:'short'})}
            </span>
          </div>
          <div>
            <p style={{ color:CYAN, fontWeight:600, fontSize:'0.9rem', margin:0 }}>
              {new Date(log.date).toLocaleDateString('en-US',{weekday:'long'})}
            </p>
            <div style={{ display:'flex', gap:'12px', marginTop:'4px' }}>
              {metrics.map(({ icon:Icon, label, value, unit, color }) => (
                <span key={label} style={{ display:'flex', alignItems:'center', gap:'4px', color, fontSize:'0.75rem' }}>
                  <Icon size={11}/>{value}{unit}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'6px', padding:'4px 10px',
            background:C12, border:`1px solid ${C20}`, clipPath:CLIP_BTN }}>
            <Scale size={13} color={CYAN}/>
            <span style={{ color:CYAN, fontFamily:'monospace', fontWeight:700, fontSize:'0.85rem' }}>{log.weight} kg</span>
          </div>
          <ChevronRight size={16} color={C35}
            style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0)', transition:'transform 0.2s' }}/>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
            exit={{ height:0, opacity:0 }} transition={{ duration:0.25 }}
            style={{ overflow:'hidden' }}>
            <div style={{ padding:'0 16px 14px', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
              {metrics.map(({ icon:Icon, label, value, unit, color }) => (
                <div key={label} style={{ padding:'10px', background:C05, border:`1px solid ${C10}`,
                  display:'flex', alignItems:'center', gap:'8px' }}>
                  <Icon size={16} color={color}/>
                  <div>
                    <p style={{ color:C35, fontSize:'0.65rem', margin:0, textTransform:'uppercase', letterSpacing:'1px' }}>{label}</p>
                    <p style={{ color, fontFamily:'monospace', fontWeight:700, fontSize:'0.9rem', margin:0 }}>{value} {unit}</p>
                  </div>
                </div>
              ))}
            </div>
            {log.notes && (
              <div style={{ margin:'0 16px 14px', padding:'10px 12px', background:C05, borderLeft:`2px solid ${CYAN}` }}>
                <p style={{ color:C55, fontSize:'0.8rem', fontStyle:'italic', margin:0 }}>"{log.notes}"</p>
              </div>
            )}
            {log.symptoms?.length > 0 && (
              <div style={{ margin:'0 16px 14px', display:'flex', gap:'6px', flexWrap:'wrap' }}>
                {log.symptoms.map((s,i) => (
                  <span key={i} style={{ padding:'2px 8px', background:'rgba(255,107,107,0.1)',
                    border:'1px solid rgba(255,107,107,0.3)', color:'#FF6B6B', fontSize:'0.7rem', borderRadius:'2px' }}>
                    {s}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main component ──────────────────────────────────────────────
export default function Progress() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [activeChart, setActiveChart] = useState('weight');
  const [formData, setFormData] = useState({
    weight:'', caloriesConsumed:'', waterIntake:'', sleepHours:'', symptoms:'', notes:''
  });

  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => (await api.get('/progress/stats')).data,
  });

  const logMutation = useMutation({
    mutationFn: (data) => api.post('/progress', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['stats']);
      queryClient.invalidateQueries(['todayProgress']);
      toast.success('Progress logged!');
      setShowForm(false);
      setFormData({ weight:'', caloriesConsumed:'', waterIntake:'', sleepHours:'', symptoms:'', notes:'' });
    },
    onError: () => toast.error('Failed to log progress'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    logMutation.mutate({
      weight: parseFloat(formData.weight),
      caloriesConsumed: parseInt(formData.caloriesConsumed),
      waterIntake: parseFloat(formData.waterIntake),
      sleepHours: parseFloat(formData.sleepHours),
      symptoms: formData.symptoms.split(',').map(s => s.trim()).filter(Boolean),
      notes: formData.notes,
    });
  };

  const chartData = stats?.data?.map(p => ({
    date: new Date(p.date).toLocaleDateString('en-US',{ month:'short', day:'numeric' }),
    weight: p.weight,
    calories: p.caloriesConsumed,
    water: p.waterIntake,
    sleep: p.sleepHours,
  })).reverse() || [];

  const weightTrend    = stats?.weightChange || 0;
  const isDecreasing   = weightTrend < 0;
  const totalLogs      = stats?.data?.length || 0;
  const streak         = Math.min(totalLogs, 7);
  const bestWeight     = stats?.data?.length ? Math.min(...stats.data.map(d => d.weight).filter(Boolean)) : null;

  const inputStyle = {
    background: C05, border:`1px solid ${C20}`, color: CYAN,
    clipPath: CLIP_BTN, width:'100%', padding:'11px 14px', outline:'none',
    fontSize:'0.875rem', fontFamily:'inherit',
  };

  const chartTabs = [
    { key:'weight',   label:'Weight',   color:'#A89FFF', badge:' kg' },
    { key:'calories', label:'Calories', color:'#FF9800', badge:' kcal' },
    { key:'water',    label:'Water',    color: CYAN,     badge:' L' },
    { key:'sleep',    label:'Sleep',    color:'#6C63FF', badge:' h' },
  ];

  const activeTab = chartTabs.find(t => t.key === activeChart);

  return (
    <div style={{ background:'#000d1a', minHeight:'100vh' }}>
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'24px 24px 48px' }}>

        {/* ── HEADER ── */}
        <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
          style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
            flexWrap:'wrap', gap:'16px', marginBottom:'24px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
            <div style={{ width:'52px', height:'52px', display:'flex', alignItems:'center', justifyContent:'center',
              background:'linear-gradient(135deg,#001428,#002d5c)', border:`1px solid ${C20}`, clipPath:CLIP_SM }}>
              <Activity size={26} color={CYAN}/>
            </div>
            <div>
              <h1 style={{ fontFamily:'Montserrat,sans-serif', color:CYAN, fontSize:'1.75rem',
                fontWeight:800, margin:0, lineHeight:1.2 }}>Progress Tracking</h1>
              <p style={{ color:C45, fontSize:'0.85rem', margin:'4px 0 0' }}>
                Monitor your health journey and achievements
              </p>
            </div>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            style={{ display:'flex', alignItems:'center', gap:'8px', padding:'11px 22px',
              background: showForm ? C12 : 'transparent',
              border:`1px solid ${showForm ? CYAN : 'rgba(47,232,255,0.5)'}`,
              color:CYAN, clipPath:CLIP_BTN, fontWeight:600, fontSize:'0.875rem',
              cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = C12}
            onMouseLeave={e => e.currentTarget.style.background = showForm ? C12 : 'transparent'}>
            {showForm ? <X size={16}/> : <Zap size={16}/>}
            {showForm ? 'Cancel' : "Log Today's Progress"}
          </button>
        </motion.div>

        {/* ── SUMMARY STRIP ── */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
          style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',
            gap:'12px', marginBottom:'24px' }}>
          {[
            { icon:BarChart2, label:'Total Logs',    value: totalLogs,                    color:'#4ECDC4' },
            { icon:Award,     label:'Day Streak',    value: `${streak} days`,             color:'#FFB74D' },
            { icon:Scale,     label:'Best Weight',   value: bestWeight ? `${bestWeight} kg` : '--', color:'#A89FFF' },
            { icon:Heart,     label:'Consistency',   value: `${Math.min(Math.round((totalLogs/30)*100),100)}%`, color:'#FF6B9D' },
          ].map(({ icon:Icon, label, value, color }) => (
            <div key={label} style={{ padding:'14px 16px', background:CARD2,
              border:`1px solid ${color}22`, clipPath:CLIP_SM,
              display:'flex', alignItems:'center', gap:'12px' }}>
              <div style={{ width:'36px', height:'36px', display:'flex', alignItems:'center', justifyContent:'center',
                background:`${color}18`, border:`1px solid ${color}44`, clipPath:CLIP_BTN, flexShrink:0 }}>
                <Icon size={17} color={color}/>
              </div>
              <div>
                <p style={{ color:C35, fontSize:'0.65rem', letterSpacing:'1px', textTransform:'uppercase', margin:0 }}>{label}</p>
                <p style={{ color, fontWeight:700, fontSize:'1rem', fontFamily:'Montserrat,sans-serif', margin:0 }}>{value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── LOG FORM ── */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
              exit={{ opacity:0, height:0 }} transition={{ duration:0.3 }}
              style={{ overflow:'hidden', marginBottom:'24px' }}>
              <div style={{ padding:'24px', background:CARD2, clipPath:CLIP,
                border:`1px solid ${C20}`, position:'relative' }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px',
                  background:`linear-gradient(90deg,transparent,${CYAN},transparent)` }}/>
                <h2 style={{ fontFamily:'Montserrat,sans-serif', color:CYAN, fontSize:'1.1rem',
                  fontWeight:700, margin:'0 0 20px', letterSpacing:'2px', textTransform:'uppercase' }}>
                  Log Today's Progress
                </h2>
                <form onSubmit={handleSubmit}>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'16px', marginBottom:'16px' }}>
                    {[
                      { label:'Weight (kg)',        key:'weight',          type:'number', step:'0.1',  icon:Scale,   color:'#A89FFF' },
                      { label:'Calories Consumed',  key:'caloriesConsumed',type:'number', step:'1',    icon:Flame,   color:'#FF9800' },
                      { label:'Water Intake (L)',   key:'waterIntake',     type:'number', step:'0.1',  icon:Droplet, color: CYAN },
                      { label:'Sleep Hours',        key:'sleepHours',      type:'number', step:'0.5',  icon:Moon,    color:'#6C63FF' },
                    ].map(({ label, key, type, step, icon:Icon, color }) => (
                      <div key={key}>
                        <label style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'8px',
                          color:C45, fontSize:'0.7rem', letterSpacing:'1px', textTransform:'uppercase' }}>
                          <Icon size={12} color={color}/>{label}
                        </label>
                        <input type={type} step={step} value={formData[key]}
                          onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                          style={{ ...inputStyle, borderColor: formData[key] ? color+'66' : C20 }}
                          placeholder="0"/>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'20px' }}>
                    <div>
                      <label style={{ display:'block', marginBottom:'8px', color:C45,
                        fontSize:'0.7rem', letterSpacing:'1px', textTransform:'uppercase' }}>
                        Symptoms (comma separated)
                      </label>
                      <input type="text" value={formData.symptoms}
                        onChange={e => setFormData({ ...formData, symptoms: e.target.value })}
                        style={inputStyle} placeholder="headache, fatigue..."/>
                    </div>
                    <div>
                      <label style={{ display:'block', marginBottom:'8px', color:C45,
                        fontSize:'0.7rem', letterSpacing:'1px', textTransform:'uppercase' }}>
                        Notes
                      </label>
                      <input type="text" value={formData.notes}
                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        style={inputStyle} placeholder="How are you feeling?"/>
                    </div>
                  </div>
                  <button type="submit" disabled={logMutation.isPending}
                    style={{ width:'100%', padding:'13px', background:'transparent',
                      border:`1px solid rgba(47,232,255,0.5)`, color:CYAN, clipPath:CLIP_BTN,
                      fontWeight:700, fontSize:'0.875rem', cursor:'pointer',
                      opacity: logMutation.isPending ? 0.5 : 1, fontFamily:'inherit',
                      letterSpacing:'2px', textTransform:'uppercase' }}
                    onMouseEnter={e => e.currentTarget.style.background = C08}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    {logMutation.isPending ? 'Saving...' : 'Save Progress'}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── METRIC CARDS ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',
          gap:'16px', marginBottom:'24px' }}>
          <MetricCard icon={Scale}   title="Weight Change" delay={0.1}
            value={weightTrend > 0 ? `+${weightTrend.toFixed(1)}` : weightTrend.toFixed(1)}
            unit="kg" sub={isDecreasing ? '↓ Losing weight' : '↑ Gaining weight'}
            color="#A89FFF"
            sparkData={chartData.map(d => d.weight).filter(Boolean)}
            pct={Math.min(Math.abs(weightTrend)/10, 1)}/>
          <MetricCard icon={Flame}   title="Avg Calories" delay={0.2}
            value={Math.round(stats?.avgCalories || 0)}
            unit="kcal" sub="Daily energy intake"
            color="#FF9800"
            sparkData={chartData.map(d => d.calories).filter(Boolean)}
            pct={Math.min((stats?.avgCalories||0)/2500, 1)}/>
          <MetricCard icon={Droplet} title="Avg Water" delay={0.3}
            value={(stats?.avgWater||0).toFixed(1)}
            unit="/ 4L" sub="Daily hydration"
            color={CYAN}
            sparkData={chartData.map(d => d.water).filter(Boolean)}
            pct={Math.min((stats?.avgWater||0)/4, 1)}/>
          <MetricCard icon={Moon}    title="Avg Sleep" delay={0.4}
            value={(stats?.avgSleep||0).toFixed(1)}
            unit="/ 8h" sub="Rest & recovery"
            color="#6C63FF"
            sparkData={chartData.map(d => d.sleep).filter(Boolean)}
            pct={Math.min((stats?.avgSleep||0)/8, 1)}/>
        </div>

        {/* ── CHART TABS + CHART ── */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
          style={{ marginBottom:'24px' }}>
          {/* tab bar */}
          <div style={{ display:'flex', gap:'4px', marginBottom:'0',
            borderBottom:`1px solid ${C12}`, paddingBottom:'0' }}>
            {chartTabs.map(({ key, label, color }) => (
              <button key={key} onClick={() => setActiveChart(key)}
                style={{ padding:'9px 18px', background: activeChart===key ? C12 : 'transparent',
                  border:'none', borderBottom: activeChart===key ? `2px solid ${color}` : '2px solid transparent',
                  color: activeChart===key ? color : C35,
                  fontWeight:600, fontSize:'0.8rem', cursor:'pointer',
                  fontFamily:'Montserrat,sans-serif', letterSpacing:'1px',
                  transition:'all 0.2s', marginBottom:'-1px' }}
                onMouseEnter={e => { if(activeChart!==key) e.currentTarget.style.color = color; }}
                onMouseLeave={e => { if(activeChart!==key) e.currentTarget.style.color = C35; }}>
                {label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeChart}
              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-8 }} transition={{ duration:0.25 }}>
              <AreaChart
                title={activeTab.label + ' Trend'}
                sub="Last 30 days"
                dataKey={activeChart}
                color={activeTab.color}
                badge={activeTab.badge}
                chartData={chartData}
                EmptyIcon={activeChart==='weight' ? Scale : activeChart==='calories' ? Flame : activeChart==='water' ? Droplet : Moon}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ── RECENT LOGS ── */}
        {stats?.data && stats.data.length > 0 && (
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}>
            <div style={{ padding:'24px', background:CARD2, clipPath:CLIP,
              border:`1px solid ${C15}`, position:'relative' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px',
                background:`linear-gradient(90deg,transparent,${CYAN},transparent)` }}/>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                  <div style={{ width:'38px', height:'38px', display:'flex', alignItems:'center', justifyContent:'center',
                    background:C12, border:`1px solid ${C20}`, clipPath:CLIP_SM }}>
                    <Calendar size={18} color={CYAN}/>
                  </div>
                  <div>
                    <h2 style={{ fontFamily:'Montserrat,sans-serif', color:CYAN, fontSize:'1rem',
                      fontWeight:700, margin:0, letterSpacing:'2px', textTransform:'uppercase' }}>
                      Recent Logs
                    </h2>
                    <p style={{ color:C35, fontSize:'0.7rem', margin:0 }}>Click any entry to expand</p>
                  </div>
                </div>
                <span style={{ color:C35, fontSize:'0.75rem' }}>{stats.data.length} total entries</span>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                {stats.data.slice(0, 7).map((log, index) => (
                  <LogItem key={index} log={log} index={index}/>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── EMPTY STATE ── */}
        {!isLoading && (!stats?.data || stats.data.length === 0) && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
            style={{ textAlign:'center', padding:'60px 24px', background:CARD2,
              clipPath:CLIP, border:`1px solid ${C15}` }}>
            <Activity size={56} color={C20} style={{ marginBottom:'16px' }}/>
            <h3 style={{ color:CYAN, fontFamily:'Montserrat,sans-serif', fontWeight:700,
              fontSize:'1.1rem', margin:'0 0 8px' }}>No progress logged yet</h3>
            <p style={{ color:C35, fontSize:'0.875rem', margin:'0 0 24px' }}>
              Start tracking your health journey today
            </p>
            <button onClick={() => setShowForm(true)}
              style={{ padding:'11px 28px', background:'transparent',
                border:`1px solid rgba(47,232,255,0.5)`, color:CYAN, clipPath:CLIP_BTN,
                fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}
              onMouseEnter={e => e.currentTarget.style.background = C08}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              Log First Entry
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
}
