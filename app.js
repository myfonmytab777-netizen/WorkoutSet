// Helper function to clean reps text string
const cleanRepsText = (reps) => reps ? reps.replace(/^\d+\s*Set\s*x\s*/i, '') : '';

const DEFAULT_TEMPLATES = [
    {
        id: 'tpl_chest',
        name: 'DADA',
        emoji: '🔥',
        activities: [
            { id: 'act_c1', name: 'Push Up Standard', reps: '15 Reps' },
            { id: 'act_c2', name: 'Wide Push Up', reps: '12 Reps' },
            { id: 'act_c3', name: 'Incline Push Up', reps: '12 Reps' },
            { id: 'act_c4', name: 'Dips / Diamond Push Up', reps: '10 Reps' }
        ]
    },
    {
        id: 'tpl_abs',
        name: 'PERUT',
        emoji: '🍉',
        activities: [
            { id: 'act_a1', name: 'Crunches', reps: '20 Reps' },
            { id: 'act_a2', name: 'Leg Raises', reps: '15 Reps' },
            { id: 'act_a3', name: 'Plank Hold', reps: '45 Saat' },
            { id: 'act_a4', name: 'Russian Twists', reps: '20 Reps' }
        ]
    },
    {
        id: 'tpl_legs',
        name: 'LEG DAY',
        emoji: '🥥',
        activities: [
            { id: 'act_l1', name: 'Bodyweight Squats', reps: '20 Reps' },
            { id: 'act_l2', name: 'Lunges Walk', reps: '12 Reps' },
            { id: 'act_l3', name: 'Calf Raises', reps: '25 Reps' },
            { id: 'act_l4', name: 'Wall Sit', reps: '45 Saat' }
        ]
    }
];

const TIME_SLOTS = [
    { id: 'slot_pagi', name: 'PAGI', emoji: '🌅' },
    { id: 'slot_petang', name: 'PETANG', emoji: '🌇' },
    { id: 'slot_malam', name: 'MALAM', emoji: '🌙' }
];

const POPULAR_EMOJIS = [
    '⭐', '🌟', '✨', '💫', '🔥', '💪', '🏋️', '🏃', 
    '🎯', '🏆', '🥇', '⚡', '🚀', '📈', '✅', '🛡️', 
    '🧠', '💧', '😴', '🥗', '🎧', '🌱', '👑', '🎖️'
];

const STAR_PRESETS = ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '🌟', '✨', '💫'];

const INITIAL_WEEKS = [
    {
        id: 'week_1',
        title: 'MINGGU 1 — 1 SET',
        stars: '⭐',
        days: [
            { id: 'w1_d1', dayName: 'ISNIN', focusName: 'DADA', emoji: '🔥', focusTemplateIds: ['tpl_chest'], isRest: false },
            { id: 'w1_d2', dayName: 'SELASA', focusName: 'PERUT', emoji: '🍉', focusTemplateIds: ['tpl_abs'], isRest: false },
            { id: 'w1_d3', dayName: 'RABU', focusName: 'DADA', emoji: '🔥', focusTemplateIds: ['tpl_chest'], isRest: false },
            { id: 'w1_d4', dayName: 'KHAMIS', focusName: 'PERUT', emoji: '🍉', focusTemplateIds: ['tpl_abs'], isRest: false },
            { id: 'w1_d5', dayName: 'JUMAAT', focusName: 'DADA', emoji: '🔥', focusTemplateIds: ['tpl_chest'], isRest: false },
            { id: 'w1_d6', dayName: 'SABTU', focusName: 'LEG DAY', emoji: '🥥', focusTemplateIds: ['tpl_legs'], isRest: false },
            { id: 'w1_d7', dayName: 'AHAD', focusName: 'REST', emoji: '😴', focusTemplateIds: [], isRest: true }
        ]
    }
];

function App() {
    const [templates, setTemplates] = React.useState(() => {
        const saved = localStorage.getItem('workout_templates_v2');
        return saved ? JSON.parse(saved) : DEFAULT_TEMPLATES;
    });

    const [weeks, setWeeks] = React.useState(() => {
        const saved = localStorage.getItem('workout_weeks_v2');
        return saved ? JSON.parse(saved) : INITIAL_WEEKS;
    });

    const [checkedState, setCheckedState] = React.useState(() => {
        const saved = localStorage.getItem('workout_checked_state_v2');
        return saved ? JSON.parse(saved) : {};
    });

    const [collapsedDays, setCollapsedDays] = React.useState({});

    const [currentView, setCurrentView] = React.useState('notes');
    const [activeDayModal, setActiveDayModal] = React.useState(null);
    const [activeTemplateModal, setActiveTemplateModal] = React.useState(null);
    const [activeWeekModal, setActiveWeekModal] = React.useState(null);
    const [confirmDeleteModal, setConfirmDeleteModal] = React.useState(null);

    const [showDayEmojiPicker, setShowDayEmojiPicker] = React.useState(false);
    const [showTplEmojiPicker, setShowTplEmojiPicker] = React.useState(false);
    const [showWeekEmojiPicker, setShowWeekEmojiPicker] = React.useState(false);

    const [editingActivity, setEditingActivity] = React.useState(null);

    React.useEffect(() => {
        localStorage.setItem('workout_templates_v2', JSON.stringify(templates));
    }, [templates]);

    React.useEffect(() => {
        localStorage.setItem('workout_weeks_v2', JSON.stringify(weeks));
    }, [weeks]);

    React.useEffect(() => {
        localStorage.setItem('workout_checked_state_v2', JSON.stringify(checkedState));
    }, [checkedState]);

    const toggleCheck = (weekId, dayId, templateId, activityId) => {
        const key = `${weekId}_${dayId}_${templateId}_${activityId}`;
        setCheckedState(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const toggleBukakTutup = (weekId, dayId) => {
        const key = `${weekId}_${dayId}`;
        setCollapsedDays(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const isDayCompleted = (weekId, day) => {
        if (day.isRest) return true;
        let total = 0;
        let done = 0;

        day.focusTemplateIds.forEach(tplId => {
            const tpl = templates.find(t => t.id === tplId);
            if (tpl) {
                tpl.activities.forEach(act => {
                    total++;
                    if (checkedState[`${weekId}_${day.id}_${tplId}_${act.id}`]) {
                        done++;
                    }
                });
            }
        });

        return total > 0 && total === done;
    };

    const toggleAllInDay = (weekId, day) => {
        const currentlyCompleted = isDayCompleted(weekId, day);
        const newChecked = { ...checkedState };

        day.focusTemplateIds.forEach(tplId => {
            const tpl = templates.find(t => t.id === tplId);
            if (tpl) {
                tpl.activities.forEach(act => {
                    const key = `${weekId}_${day.id}_${tplId}_${act.id}`;
                    newChecked[key] = !currentlyCompleted;
                });
            }
        });

        setCheckedState(newChecked);
    };

    const handleUpdateDay = (updatedDay) => {
        setWeeks(prevWeeks => prevWeeks.map(w => {
            if (w.id !== activeDayModal.weekId) return w;
            return {
                ...w,
                days: w.days.map(d => d.id === updatedDay.id ? updatedDay : d)
            };
        }));
        setActiveDayModal(null);
        setShowDayEmojiPicker(false);
    };

    const handleUpdateWeek = (updatedWeek) => {
        setWeeks(prevWeeks => prevWeeks.map(w => w.id === updatedWeek.id ? updatedWeek : w));
        setActiveWeekModal(null);
        setShowWeekEmojiPicker(false);
    };

    const handleDeleteWeek = (weekId) => {
        setWeeks(prevWeeks => prevWeeks.filter(w => w.id !== weekId));
        setActiveWeekModal(null);
        setShowWeekEmojiPicker(false);
    };

    const handleDeleteActivity = (templateId, activityId) => {
        setTemplates(prev => prev.map(t => {
            if (t.id !== templateId) return t;
            return {
                ...t,
                activities: t.activities.filter(a => a.id !== activityId)
            };
        }));
    };

    const handleSaveEditActivity = () => {
        if (!editingActivity || !editingActivity.name.trim()) return;
        
        setTemplates(prev => prev.map(t => {
            if (t.id !== editingActivity.templateId) return t;
            return {
                ...t,
                activities: t.activities.map(a => {
                    if (a.id !== editingActivity.activityId) return a;
                    return {
                        ...a,
                        name: editingActivity.name.trim(),
                        reps: editingActivity.reps.trim()
                    };
                })
            };
        }));
        setEditingActivity(null);
    };

    const handleDeleteTemplate = (templateId) => {
        setTemplates(prev => prev.filter(t => t.id !== templateId));
        setWeeks(prevWeeks => prevWeeks.map(w => ({
            ...w,
            days: w.days.map(d => ({
                ...d,
                focusTemplateIds: d.focusTemplateIds ? d.focusTemplateIds.filter(id => id !== templateId) : []
            }))
        })));
    };

    const handleAddWeek = () => {
        const newWeekNum = weeks.length + 1;
        const starStr = '⭐'.repeat(Math.min(newWeekNum, 5));
        const newWeek = {
            id: `week_${Date.now()}`,
            title: `MINGGU ${newWeekNum} — ${newWeekNum} SET`,
            stars: starStr,
            days: [
                { id: `w${newWeekNum}_d1`, dayName: 'ISNIN', focusName: 'DADA', emoji: '🔥', focusTemplateIds: ['tpl_chest'], isRest: false },
                { id: `w${newWeekNum}_d2`, dayName: 'SELASA', focusName: 'PERUT', emoji: '🍉', focusTemplateIds: ['tpl_abs'], isRest: false },
                { id: `w${newWeekNum}_d3`, dayName: 'RABU', focusName: 'DADA', emoji: '🔥', focusTemplateIds: ['tpl_chest'], isRest: false },
                { id: `w${newWeekNum}_d4`, dayName: 'KHAMIS', focusName: 'PERUT', emoji: '🍉', focusTemplateIds: ['tpl_abs'], isRest: false },
                { id: `w${newWeekNum}_d5`, dayName: 'JUMAAT', focusName: 'DADA', emoji: '🔥', focusTemplateIds: ['tpl_chest'], isRest: false },
                { id: `w${newWeekNum}_d6`, dayName: 'SABTU', focusName: 'LEG DAY', emoji: '🥥', focusTemplateIds: ['tpl_legs'], isRest: false },
                { id: `w${newWeekNum}_d7`, dayName: 'AHAD', focusName: 'REST', emoji: '😴', focusTemplateIds: [], isRest: true }
            ]
        };
        setWeeks([...weeks, newWeek]);
    };

    const handleHapusSemuaTicks = () => {
        setCheckedState({});
        setConfirmDeleteModal(null);
    };

    const handleHapusSemuaSampel = () => {
        setTemplates([]);
        setWeeks([]);
        setCheckedState({});
        setCollapsedDays({});
        localStorage.clear();
        setConfirmDeleteModal(null);
    };

    const getOverallStats = () => {
        let total = 0;
        let completed = 0;

        weeks.forEach(w => {
            w.days.forEach(d => {
                if (!d.isRest) {
                    d.focusTemplateIds.forEach(tplId => {
                        const tpl = templates.find(t => t.id === tplId);
                        if (tpl) {
                            tpl.activities.forEach(act => {
                                total++;
                                if (checkedState[`${w.id}_${d.id}_${tplId}_${act.id}`]) {
                                    completed++;
                                }
                            });
                        }
                    });
                }
            });
        });

        return { total, completed, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
    };

    const stats = getOverallStats();

    const getRankTitle = (percent) => {
        if (percent >= 80) return '⚡ STREAK MASTER';
        if (percent >= 50) return '⚡ WORKOUT WARRIOR';
        if (percent >= 20) return '⚡ APPRENTICE';
        return '⚡ BEGINNER';
    };

    return (
        <div className="max-w-md mx-auto min-h-screen pb-24 bg-black relative selection:bg-amber-500">
            
            {/* TOP HEADER */}
            <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3 flex items-center justify-between">
                
                {/* AURA PRO BRANDING WITH FLAME ANIMATION */}
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500/70 via-orange-500/80 to-yellow-400/70 rounded-2xl blur-md animate-pulse opacity-90"></div>
                        <div className="absolute -inset-3 bg-amber-500/20 rounded-full blur-xl animate-pulse"></div>

                        <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-yellow-400 p-0.5 flex items-center justify-center animate-aura-glow cursor-pointer ambient-glow">
                            <div className="w-full h-full bg-gradient-to-br from-amber-500/90 to-orange-600 rounded-[14px] flex items-center justify-center">
                                <span className="text-xl animate-flame-flicker select-none">🔥</span>
                            </div>
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-amber-400 border-2 border-black rounded-full shadow-sm z-10"></span>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center space-x-1.5">
                            <span className="text-white font-extrabold text-lg tracking-wide uppercase">AURA</span>
                            <span className="px-1.5 py-0.5 text-[10px] font-black text-amber-400 border border-amber-500/80 rounded-md bg-amber-500/10 tracking-widest uppercase">
                                PRO
                            </span>
                        </div>
                        <div className="text-[10px] font-bold text-amber-400/90 tracking-wider flex items-center gap-1 uppercase">
                            <span>{getRankTitle(stats.percent)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button 
                        onClick={() => setCurrentView(currentView === 'notes' ? 'templates' : 'notes')}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                            currentView === 'templates' 
                                ? 'bg-amber-500 text-black font-bold' 
                                : 'bg-zinc-800/90 text-zinc-200 hover:bg-zinc-700'
                        }`}
                    >
                        <i className={`fa-solid ${currentView === 'notes' ? 'fa-sliders' : 'fa-list-check'}`}></i>
                        {currentView === 'notes' ? 'Sesi Fokus' : 'Lihat Notes'}
                    </button>

                    <button 
                        onClick={() => setConfirmDeleteModal('menu')}
                        title="Hapus & Reset"
                        className="p-2 text-zinc-400 hover:text-red-400 transition-colors text-sm rounded-lg bg-zinc-900 border border-zinc-800"
                    >
                        <i className="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </header>

            {/* Progress Banner */}
            <div className="px-4 pt-3 pb-1 bg-gradient-to-b from-zinc-900/60 to-transparent">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1.5">
                    <span>KEMAJUAN KESELURUHAN</span>
                    <span className="text-amber-400 font-bold">{stats.completed} / {stats.total} ({stats.percent}%)</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden mb-2">
                    <div 
                        className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${stats.percent}%` }}
                    ></div>
                </div>
            </div>

            {/* NOTES MAIN VIEW */}
            {currentView === 'notes' && (
                <main className="px-4 py-3 space-y-8">
                    {weeks.length === 0 ? (
                        <div className="py-12 text-center space-y-4 bg-zinc-950/60 border border-zinc-900 rounded-2xl p-6">
                            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-3xl flex items-center justify-center mx-auto">
                                📋
                            </div>
                            <div>
                                <h3 className="font-bold text-zinc-200 text-base">Tiada Jadual Minggu</h3>
                                <p className="text-xs text-zinc-500 max-w-xs mx-auto mt-1">
                                    Semua minggu telah dipadamkan. Tekan butang di bawah untuk menambah minggu latihan baharu.
                                </p>
                            </div>
                            <button 
                                onClick={handleAddWeek}
                                className="py-2.5 px-5 bg-amber-500 text-black font-bold text-xs rounded-xl hover:bg-amber-400 transition-all shadow-lg inline-flex items-center gap-2"
                            >
                                <i className="fa-solid fa-plus"></i> Tambah Minggu Baru
                            </button>
                        </div>
                    ) : (
                        weeks.map((week) => (
                            <section key={week.id} className="space-y-4 border border-zinc-900/80 rounded-2xl p-4 bg-zinc-950/40">
                                {/* WEEK HEADER */}
                                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-amber-400 font-extrabold text-sm sm:text-base tracking-wide">{week.title}</span>
                                        <span className="text-xs">{week.stars}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button 
                                            onClick={() => setActiveWeekModal(week)}
                                            className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-lg border border-zinc-800 flex items-center gap-1 transition-all"
                                        >
                                            <i className="fa-solid fa-pen text-amber-500 text-[10px]"></i>
                                            <span>Tetapan</span>
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteWeek(week.id)}
                                            title="Padam Minggu Ini"
                                            className="px-2 py-1 bg-red-950/60 hover:bg-red-900/80 text-red-400 text-xs rounded-lg border border-red-800/60 transition-all active:scale-95"
                                        >
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
                                    </div>
                                </div>

                                {/* DAYS LIST */}
                                <div className="space-y-5 pt-1">
                                    {week.days.map((day) => {
                                        const dayCompleted = isDayCompleted(week.id, day);
                                        const isCollapsed = !!collapsedDays[`${week.id}_${day.id}`];

                                        return (
                                            <div key={day.id} className="space-y-2 group">
                                                
                                                {/* DAY HEADER LINE */}
                                                <div className="flex items-center justify-between py-1.5 border-b border-zinc-900">
                                                    <div className="flex items-center space-x-2.5">
                                                        <button 
                                                            onClick={() => toggleAllInDay(week.id, day)}
                                                            className={`w-7 h-7 rounded-full flex items-center justify-center border text-xs check-anim active:scale-90 ${
                                                                day.isRest 
                                                                    ? 'border-zinc-700 bg-zinc-900 text-zinc-500' 
                                                                    : dayCompleted 
                                                                        ? 'border-amber-500 bg-amber-500 text-black font-bold' 
                                                                        : 'border-amber-500/60 hover:border-amber-500 text-transparent'
                                                            }`}
                                                        >
                                                            {day.isRest ? '😴' : dayCompleted ? <i className="fa-solid fa-check"></i> : <i className="fa-solid fa-check opacity-0 hover:opacity-50"></i>}
                                                        </button>

                                                        <span className={`font-bold tracking-wide text-base ${
                                                            day.isRest ? 'text-zinc-500 italic' : dayCompleted ? 'text-zinc-400 line-through decoration-amber-500/50' : 'text-zinc-100'
                                                        }`}>
                                                            {day.dayName} {day.focusName} {day.emoji}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center space-x-2">
                                                        {!day.isRest && (
                                                            <button 
                                                                onClick={() => toggleBukakTutup(week.id, day.id)}
                                                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1 transition-all ${
                                                                    isCollapsed 
                                                                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
                                                                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                                                                }`}
                                                                title={isCollapsed ? 'Bukak Paparan Hari' : 'Tutup Paparan Hari'}
                                                            >
                                                                <span>{isCollapsed ? 'Bukak' : 'Tutup'}</span>
                                                                <i className={`fa-solid ${isCollapsed ? 'fa-chevron-down' : 'fa-chevron-up'} text-[10px]`}></i>
                                                            </button>
                                                        )}

                                                        <button 
                                                            onClick={() => setActiveDayModal({ weekId: week.id, day })}
                                                            className="px-2.5 py-1 bg-zinc-800/90 hover:bg-amber-500/20 hover:text-amber-400 text-zinc-300 border border-zinc-700/80 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all active:scale-95"
                                                            title="Sunting Hari & Sesi Fokus"
                                                        >
                                                            <i className="fa-solid fa-pen-to-square text-amber-500"></i>
                                                            <span>Sunting</span>
                                                        </button>
                                                    </div>
                                                </div>

                                                {day.isRest && (
                                                    <div className="pl-8 text-sm text-zinc-600 italic py-1">
                                                        Hari Rehat / Pemulihan Otot 😴
                                                    </div>
                                                )}

                                                {!day.isRest && !isCollapsed && (
                                                    <div className="pl-3 space-y-4 border-l-2 border-zinc-800/80 ml-3 pt-1">
                                                        
                                                        {/* SHIFT / TIME SLOTS */}
                                                        <div className="bg-zinc-950/80 border border-zinc-900 rounded-xl p-2.5 space-y-1.5">
                                                            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-1">
                                                                SYIF / SET MASA LATIHAN
                                                            </div>
                                                            <div className="grid grid-cols-3 gap-1.5">
                                                                {TIME_SLOTS.map((slot) => {
                                                                    const slotKey = `${week.id}_${day.id}_slots_${slot.id}`;
                                                                    const isSlotChecked = !!checkedState[slotKey];

                                                                    return (
                                                                        <button
                                                                            key={slot.id}
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                toggleCheck(week.id, day.id, 'slots', slot.id);
                                                                            }}
                                                                            className={`px-2 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all active:scale-95 cursor-pointer touch-manipulation select-none min-w-0 ${
                                                                                isSlotChecked
                                                                                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(234,179,8,0.25)]'
                                                                                    : 'bg-zinc-900/90 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                                                            }`}
                                                                        >
                                                                            <span className="flex items-center gap-1 min-w-0 overflow-hidden">
                                                                                <span className="text-xs sm:text-sm shrink-0">{slot.emoji}</span>
                                                                                <span className="text-[10px] sm:text-xs truncate font-bold">{slot.name}</span>
                                                                            </span>
                                                                            <span className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border text-[9px] sm:text-[11px] font-extrabold shrink-0 ml-0.5 transition-all ${
                                                                                isSlotChecked 
                                                                                    ? 'bg-amber-500 border-amber-500 text-black shadow-sm' 
                                                                                    : 'border-zinc-600 text-transparent'
                                                                            }`}>
                                                                                ✓
                                                                            </span>
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>

                                                        {/* FOCUS SESSIONS LIST */}
                                                        {day.focusTemplateIds && day.focusTemplateIds.length > 0 ? (
                                                            day.focusTemplateIds.map((tplId) => {
                                                                const template = templates.find(t => t.id === tplId);
                                                                if (!template) return null;

                                                                return (
                                                                    <div key={template.id} className="space-y-1.5 pt-1">
                                                                        <div className="text-xs font-bold text-amber-500/90 tracking-wider uppercase flex items-center gap-1.5 pl-2 py-0.5">
                                                                            <span>{template.emoji}</span>
                                                                            <span>SESI FOKUS {template.name}</span>
                                                                        </div>

                                                                        <div className="space-y-1">
                                                                            {template.activities.map((act) => {
                                                                                const isChecked = !!checkedState[`${week.id}_${day.id}_${template.id}_${act.id}`];

                                                                                return (
                                                                                    <div 
                                                                                        key={act.id}
                                                                                        onClick={() => toggleCheck(week.id, day.id, template.id, act.id)}
                                                                                        className="flex items-center justify-between py-2 px-2.5 rounded-lg hover:bg-zinc-900/80 cursor-pointer active:bg-zinc-900 transition-colors group/item border border-transparent hover:border-zinc-800"
                                                                                    >
                                                                                        <div className="flex items-center space-x-3">
                                                                                            <span className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all text-xs ${
                                                                                                isChecked 
                                                                                                    ? 'border-green-500 bg-green-500/20 text-green-400 font-bold' 
                                                                                                    : 'border-zinc-600 text-zinc-700 group-hover/item:border-zinc-400'
                                                                                            }`}>
                                                                                                {isChecked ? '✓' : '○'}
                                                                                            </span>

                                                                                            <span className={`text-sm font-medium transition-all ${
                                                                                                isChecked 
                                                                                                    ? 'text-zinc-500 line-through decoration-zinc-600' 
                                                                                                    : 'text-zinc-200'
                                                                                            }`}>
                                                                                                {act.name} {act.reps && <span className="font-semibold text-amber-400/90 ml-1">{cleanRepsText(act.reps)}</span>}
                                                                                            </span>
                                                                                        </div>

                                                                                        {isChecked && (
                                                                                            <span className="text-xs bg-green-950/90 text-green-400 border border-green-800 px-1.5 py-0.5 rounded font-mono font-bold">
                                                                                                ✓
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })
                                                        ) : (
                                                            <div className="pl-2 text-xs text-amber-500/70 italic flex items-center gap-2 py-2">
                                                                <span>Tiada Sesi Fokus dipilih. Tekan "Sunting" untuk tambah.</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        ))
                    )}

                    <div className="pt-4 pb-8 flex flex-col gap-3 items-center justify-center">
                        <button 
                            onClick={handleAddWeek}
                            className="w-full py-3 px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-amber-400 font-bold text-sm hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-98"
                        >
                            <i className="fa-solid fa-plus"></i>
                            Tambah Minggu Baru
                        </button>
                    </div>
                </main>
            )}

            {/* FOCUS SESSIONS MANAGER VIEW */}
            {currentView === 'templates' && (
                <main className="px-4 py-4 space-y-6">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                        <div>
                            <h2 className="text-lg font-bold text-amber-400">Pengurusan Sesi Fokus</h2>
                            <p className="text-xs text-zinc-400">Sunting template & senarai latihan otot</p>
                        </div>
                        <button 
                            onClick={() => setActiveTemplateModal('new')}
                            className="px-3 py-2 bg-amber-500 text-black font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors flex items-center gap-1.5 shadow-md active:scale-95"
                        >
                            <i className="fa-solid fa-plus text-sm"></i> Sesi Baru
                        </button>
                    </div>

                    <div className="space-y-6">
                        {templates.map((tpl) => (
                            <div key={tpl.id} className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 space-y-4 shadow-lg">
                                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                                    <div className="flex items-center space-x-2.5">
                                        <span className="text-2xl">{tpl.emoji}</span>
                                        <div>
                                            <h3 className="font-bold text-zinc-100 text-base">{tpl.name}</h3>
                                            <p className="text-[11px] text-zinc-500">{tpl.activities.length} aktiviti latihan</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button 
                                            onClick={() => setActiveTemplateModal(tpl)}
                                            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all active:scale-95"
                                        >
                                            <i className="fa-solid fa-pen text-amber-400"></i> Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteTemplate(tpl.id)}
                                            className="px-3 py-1.5 bg-red-950/80 border border-red-800/80 hover:bg-red-900 text-red-300 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all active:scale-95"
                                            title="Padam Sesi Fokus"
                                        >
                                            <i className="fa-solid fa-trash-can"></i> Padam
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {tpl.activities.map((act, index) => (
                                        <React.Fragment key={act.id}>
                                            {editingActivity && editingActivity.activityId === act.id ? (
                                                <div className="flex flex-col gap-2 p-3 bg-zinc-900 rounded-xl border border-amber-500/50 shadow-inner">
                                                    <input 
                                                        type="text" 
                                                        value={editingActivity.name}
                                                        onChange={e => setEditingActivity({...editingActivity, name: e.target.value})}
                                                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-amber-500"
                                                        placeholder="Nama latihan"
                                                        autoFocus
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <input 
                                                            type="text" 
                                                            value={editingActivity.reps}
                                                            onChange={e => setEditingActivity({...editingActivity, reps: e.target.value})}
                                                            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-amber-500"
                                                            placeholder="Reps/Masa"
                                                        />
                                                        <div className="flex gap-2 shrink-0">
                                                            <button 
                                                                onClick={handleSaveEditActivity}
                                                                className="px-3 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg transition-colors"
                                                            >
                                                                Simpan
                                                            </button>
                                                            <button 
                                                                onClick={() => setEditingActivity(null)}
                                                                className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs font-bold rounded-lg transition-colors"
                                                            >
                                                                Batal
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-xl border border-zinc-800/80 transition-all gap-2">
                                                    <div className="flex items-center space-x-2.5 flex-1 min-w-0 pr-1">
                                                        <span className="text-xs font-mono text-amber-500 font-bold w-4 shrink-0 text-center">{index + 1}.</span>
                                                        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0 leading-snug">
                                                            <span className="text-sm font-medium text-zinc-200 break-words">{act.name}</span>
                                                            {act.reps && (
                                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono border border-amber-500/20 whitespace-nowrap shrink-0">
                                                                    {cleanRepsText(act.reps)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <button 
                                                            onClick={() => setEditingActivity({ templateId: tpl.id, activityId: act.id, name: act.name, reps: act.reps || '' })}
                                                            className="px-2.5 py-1.5 bg-zinc-800 hover:bg-amber-500/20 hover:text-amber-400 text-zinc-300 rounded-lg text-xs font-semibold border border-zinc-700 flex items-center gap-1 transition-all active:scale-95"
                                                            title="Edit Aktiviti"
                                                        >
                                                            <i className="fa-solid fa-pen text-[10px]"></i>
                                                            <span className="hidden sm:inline">Edit</span>
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteActivity(tpl.id, act.id)}
                                                            className="px-2.5 py-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 rounded-lg text-xs font-semibold border border-red-800/60 flex items-center gap-1 transition-all active:scale-95"
                                                            title="Padam Aktiviti"
                                                        >
                                                            <i className="fa-solid fa-trash-can text-[10px]"></i>
                                                            <span className="hidden sm:inline">Padam</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </React.Fragment>
                                    ))}

                                    {tpl.activities.length === 0 && (
                                        <p className="text-xs text-zinc-500 italic py-2 text-center">Belum ada aktiviti. Tambah di bawah.</p>
                                    )}
                                </div>

                                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Nama latihan (cth: Push Up)" 
                                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                                        id={`input_name_${tpl.id}`}
                                    />
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Reps / Masa" 
                                            className="w-28 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                                            id={`input_reps_${tpl.id}`}
                                        />
                                        <button 
                                            onClick={() => {
                                                const nameEl = document.getElementById(`input_name_${tpl.id}`);
                                                const repsEl = document.getElementById(`input_reps_${tpl.id}`);
                                                if (!nameEl.value.trim()) return;

                                                setTemplates(templates.map(t => {
                                                    if (t.id !== tpl.id) return t;
                                                    return {
                                                        ...t,
                                                        activities: [
                                                            ...t.activities,
                                                            {
                                                                id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                                                                name: nameEl.value.trim(),
                                                                reps: repsEl.value.trim()
                                                            }
                                                        ]
                                                    };
                                                }));

                                                nameEl.value = '';
                                                repsEl.value = '';
                                            }}
                                            className="bg-amber-500 text-black px-4 py-2 rounded-xl font-bold text-xs hover:bg-amber-400 active:scale-95 transition-all flex items-center gap-1 shrink-0"
                                        >
                                            <i className="fa-solid fa-plus"></i> Tambah
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            )}

            {/* CONFIRM DELETE MODAL */}
            {confirmDeleteModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-2xl p-5 space-y-4 text-center shadow-2xl">
                        
                        {confirmDeleteModal === 'menu' && (
                            <>
                                <h3 className="font-bold text-amber-400 text-base">Tetapan Hapus & Reset</h3>
                                <p className="text-xs text-zinc-400">Pilih tindakan pembersihan yang ingin dilakukan:</p>
                                <div className="space-y-2 pt-2">
                                    <button 
                                        onClick={() => setConfirmDeleteModal('ticks')}
                                        className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-bold text-xs rounded-xl transition-all border border-zinc-700 flex items-center justify-center gap-2"
                                    >
                                        <i className="fa-solid fa-rotate-left"></i>
                                        Hapus Semua Tanda Tick (✓)
                                    </button>
                                    <button 
                                        onClick={() => setConfirmDeleteModal('samples')}
                                        className="w-full py-3 bg-red-950/60 hover:bg-red-900/80 text-red-300 font-bold text-xs rounded-xl transition-all border border-red-800/80 flex items-center justify-center gap-2"
                                    >
                                        <i className="fa-solid fa-eraser"></i>
                                        Padam Semua Data & Sampel (Mula Dari Kosong)
                                    </button>
                                </div>
                                <button 
                                    onClick={() => setConfirmDeleteModal(null)}
                                    className="w-full py-2 bg-zinc-950 text-zinc-400 text-xs font-semibold rounded-xl"
                                >
                                    Batal
                                </button>
                            </>
                        )}

                        {confirmDeleteModal === 'samples' && (
                            <>
                                <div className="w-12 h-12 rounded-full bg-red-950/80 text-red-400 flex items-center justify-center mx-auto text-xl border border-red-800/50">
                                    <i className="fa-solid fa-eraser"></i>
                                </div>
                                <h3 className="font-bold text-red-400 text-base">Padam Semua Sampel & Data?</h3>
                                <p className="text-xs text-zinc-400">Semua minggu, senarai latihan dan sesi sampel akan dipadamkan supaya anda boleh mula dengan paparan kosong sepenuhnya.</p>
                                <div className="flex gap-2 pt-2">
                                    <button 
                                        onClick={() => setConfirmDeleteModal('menu')}
                                        className="w-1/2 py-2.5 bg-zinc-800 text-zinc-300 font-bold text-xs rounded-xl"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        onClick={handleHapusSemuaSampel}
                                        className="w-1/2 py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-500"
                                    >
                                        Ya, Padam Semua
                                    </button>
                                </div>
                            </>
                        )}

                        {confirmDeleteModal === 'ticks' && (
                            <>
                                <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-xl">
                                    <i className="fa-solid fa-rotate-left"></i>
                                </div>
                                <h3 className="font-bold text-zinc-100 text-base">Hapus Semua Tanda (✓)?</h3>
                                <p className="text-xs text-zinc-400">Semua kemajuan latihan yang sudah ditanda (✓) akan dikosongkan semula.</p>
                                <div className="flex gap-2 pt-2">
                                    <button 
                                        onClick={() => setConfirmDeleteModal('menu')}
                                        className="w-1/2 py-2.5 bg-zinc-800 text-zinc-300 font-bold text-xs rounded-xl"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        onClick={handleHapusSemuaTicks}
                                        className="w-1/2 py-2.5 bg-amber-500 text-black font-bold text-xs rounded-xl hover:bg-amber-400"
                                    >
                                        Ya, Hapus Tanda
                                    </button>
                                </div>
                            </>
                        )}

                    </div>
                </div>
            )}

            {/* EDIT DAY MODAL */}
            {activeDayModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                            <div>
                                <h3 className="font-bold text-amber-400 text-base">
                                    Tetapan: {activeDayModal.day.dayName}
                                </h3>
                                <p className="text-[11px] text-zinc-400">Pilih Sesi Fokus & Emoji Hari</p>
                            </div>
                            <button 
                                onClick={() => {
                                    setActiveDayModal(null);
                                    setShowDayEmojiPicker(false);
                                }}
                                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold flex items-center justify-center text-sm"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Tajuk Hari & Fokus</label>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <input 
                                        type="text" 
                                        value={activeDayModal.day.dayName}
                                        onChange={(e) => setActiveDayModal({
                                            ...activeDayModal,
                                            day: { ...activeDayModal.day, dayName: e.target.value.toUpperCase() }
                                        })}
                                        placeholder="ISNIN"
                                        className="bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                                    />
                                    <input 
                                        type="text" 
                                        value={activeDayModal.day.focusName}
                                        onChange={(e) => setActiveDayModal({
                                            ...activeDayModal,
                                            day: { ...activeDayModal.day, focusName: e.target.value.toUpperCase() }
                                        })}
                                        placeholder="DADA"
                                        className="bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                                    />
                                </div>

                                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
                                            <span>Emoji Hari:</span>
                                            <span className="text-lg bg-zinc-800 px-2 py-0.5 rounded-lg">{activeDayModal.day.emoji || '🔥'}</span>
                                        </span>
                                        <button 
                                            type="button"
                                            onClick={() => setShowDayEmojiPicker(!showDayEmojiPicker)}
                                            className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-amber-400 rounded-lg text-xs font-bold border border-zinc-700 flex items-center gap-1.5 transition-all"
                                        >
                                            <span>{showDayEmojiPicker ? 'Tutup Emoji' : 'Pilih Emoji'}</span>
                                            <i className={`fa-solid ${showDayEmojiPicker ? 'fa-chevron-up' : 'fa-chevron-down'} text-[10px]`}></i>
                                        </button>
                                    </div>

                                    {showDayEmojiPicker && (
                                        <div className="pt-2 border-t border-zinc-800/80">
                                            <p className="text-[10px] text-zinc-500 mb-2">Tekan emoji untuk pilih:</p>
                                            <div className="grid grid-cols-6 gap-2">
                                                {POPULAR_EMOJIS.map((emo) => (
                                                    <button
                                                        key={emo}
                                                        type="button"
                                                        onClick={() => {
                                                            setActiveDayModal({
                                                                ...activeDayModal,
                                                                day: { ...activeDayModal.day, emoji: emo }
                                                            });
                                                        }}
                                                        className={`p-2 rounded-xl text-lg hover:bg-zinc-800 transition-all flex items-center justify-center active:scale-90 ${
                                                            activeDayModal.day.emoji === emo ? 'bg-amber-500/20 border border-amber-500 scale-105' : 'bg-zinc-900 border border-transparent'
                                                        }`}
                                                    >
                                                        {emo}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div 
                                onClick={() => setActiveDayModal({
                                    ...activeDayModal,
                                    day: { ...activeDayModal.day, isRest: !activeDayModal.day.isRest }
                                })}
                                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                                    activeDayModal.day.isRest 
                                        ? 'bg-amber-500/10 border-amber-500' 
                                        : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                                }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-xl">😴</span>
                                    <div>
                                        <div className="text-xs font-bold text-zinc-200">Jadikan Rest Day</div>
                                        <div className="text-[10px] text-zinc-500">Sembunyikan latihan untuk hari ini</div>
                                    </div>
                                </div>
                                <input 
                                    type="checkbox"
                                    checked={activeDayModal.day.isRest}
                                    onChange={() => {}} 
                                    className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                                />
                            </div>

                            {!activeDayModal.day.isRest && (
                                <div className="space-y-2 pt-1">
                                    <label className="text-xs font-semibold text-zinc-400 block">
                                        Pilih Sesi Fokus yang Ditambah pada {activeDayModal.day.dayName}:
                                    </label>
                                    <div className="space-y-2">
                                        {templates.map((tpl) => {
                                            const isSelected = activeDayModal.day.focusTemplateIds.includes(tpl.id);

                                            return (
                                                <div 
                                                    key={tpl.id}
                                                    onClick={() => {
                                                        const currentIds = activeDayModal.day.focusTemplateIds || [];
                                                        const updatedIds = isSelected 
                                                            ? currentIds.filter(id => id !== tpl.id)
                                                            : [...currentIds, tpl.id];

                                                        setActiveDayModal({
                                                            ...activeDayModal,
                                                            day: { ...activeDayModal.day, focusTemplateIds: updatedIds }
                                                        });
                                                    }}
                                                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all active:scale-98 ${
                                                        isSelected 
                                                            ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-semibold' 
                                                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                                    }`}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-xl">{tpl.emoji}</span>
                                                        <div>
                                                            <span className="text-xs font-bold text-zinc-100">{tpl.name}</span>
                                                            <p className="text-[10px] text-zinc-500">{tpl.activities.length} aktiviti</p>
                                                        </div>
                                                    </div>
                                                    <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1 ${
                                                        isSelected 
                                                            ? 'bg-amber-500 text-black border-amber-500' 
                                                            : 'border-zinc-800 bg-zinc-900 text-zinc-500'
                                                    }`}>
                                                        {isSelected ? (
                                                            <>
                                                                <i className="fa-solid fa-check text-xs"></i> Dipilih
                                                            </>
                                                        ) : (
                                                            <span>+ Tambah</span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                            <button 
                                onClick={() => handleUpdateDay(activeDayModal.day)}
                                className="w-full py-3 bg-amber-500 text-black font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors shadow-lg active:scale-95"
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* NEW / EDIT TEMPLATE MODAL */}
            {activeTemplateModal && (
                <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                            <h3 className="font-bold text-amber-400 text-base">
                                {activeTemplateModal === 'new' ? 'Sesi Fokus Baru' : 'Edit Sesi Fokus'}
                            </h3>
                            <button 
                                onClick={() => {
                                    setActiveTemplateModal(null);
                                    setShowTplEmojiPicker(false);
                                }}
                                className="text-zinc-400 hover:text-white text-lg font-bold px-2"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const form = e.target;
                            const name = form.tpl_name.value.trim();
                            const emoji = form.tpl_emoji_value.value.trim() || '🔥';

                            if (!name) return;

                            if (activeTemplateModal === 'new') {
                                setTemplates([
                                    ...templates,
                                    {
                                        id: `tpl_${Date.now()}`,
                                        name: name.toUpperCase(),
                                        emoji: emoji,
                                        activities: []
                                    }
                                ]);
                            } else {
                                setTemplates(templates.map(t => {
                                    if (t.id !== activeTemplateModal.id) return t;
                                    return { ...t, name: name.toUpperCase(), emoji: emoji };
                                }));
                            }
                            setActiveTemplateModal(null);
                            setShowTplEmojiPicker(false);
                        }} className="space-y-4">
                            <div className="space-y-3">
                                <label className="text-xs font-semibold text-zinc-400 block">Nama Sesi Fokus & Emoji</label>
                                <input 
                                    type="text" 
                                    name="tpl_name"
                                    defaultValue={activeTemplateModal === 'new' ? '' : activeTemplateModal.name}
                                    placeholder="cth: LATIHAN OTOT BAHU"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                                    autoFocus
                                />

                                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 space-y-2">
                                    <input 
                                        type="hidden" 
                                        name="tpl_emoji_value" 
                                        id="tpl_emoji_value" 
                                        defaultValue={activeTemplateModal === 'new' ? '🔥' : activeTemplateModal.emoji} 
                                    />
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
                                            <span>Emoji Sesi:</span>
                                            <span id="tpl_emoji_preview" className="text-lg bg-zinc-800 px-2 py-0.5 rounded-lg">
                                                {activeTemplateModal === 'new' ? '🔥' : activeTemplateModal.emoji}
                                            </span>
                                        </span>
                                        <button 
                                            type="button"
                                            onClick={() => setShowTplEmojiPicker(!showTplEmojiPicker)}
                                            className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-amber-400 rounded-lg text-xs font-bold border border-zinc-700 flex items-center gap-1.5 transition-all"
                                        >
                                            <span>{showTplEmojiPicker ? 'Tutup Emoji' : 'Pilih Emoji'}</span>
                                            <i className={`fa-solid ${showTplEmojiPicker ? 'fa-chevron-up' : 'fa-chevron-down'} text-[10px]`}></i>
                                        </button>
                                    </div>

                                    {showTplEmojiPicker && (
                                        <div className="pt-2 border-t border-zinc-800/80">
                                            <p className="text-[10px] text-zinc-500 mb-2">Tekan emoji untuk pilih:</p>
                                            <div className="grid grid-cols-6 gap-2">
                                                {POPULAR_EMOJIS.map((emo) => (
                                                    <button
                                                        key={emo}
                                                        type="button"
                                                        onClick={() => {
                                                            const valEl = document.getElementById('tpl_emoji_value');
                                                            const prevEl = document.getElementById('tpl_emoji_preview');
                                                            if (valEl) valEl.value = emo;
                                                            if (prevEl) prevEl.innerText = emo;
                                                        }}
                                                        className="p-2 bg-zinc-900 hover:bg-amber-500/20 rounded-xl text-lg flex items-center justify-center border border-zinc-800 active:scale-90 transition-all"
                                                    >
                                                        {emo}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setActiveTemplateModal(null);
                                        setShowTplEmojiPicker(false);
                                    }}
                                    className="w-1/2 py-2.5 bg-zinc-800 text-zinc-300 font-bold text-xs rounded-xl"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit"
                                    className="w-1/2 py-2.5 bg-amber-500 text-black font-bold text-xs rounded-xl hover:bg-amber-400 font-bold"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT WEEK SETS & TITLE MODAL */}
            {activeWeekModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                            <div>
                                <h3 className="font-bold text-amber-400 text-base">Tetapan Minggu & Bilangan Set</h3>
                                <p className="text-[11px] text-zinc-400">Tentukan berapa set yang ingin anda lakukan</p>
                            </div>
                            <button 
                                onClick={() => {
                                    setActiveWeekModal(null);
                                    setShowWeekEmojiPicker(false);
                                }}
                                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold flex items-center justify-center text-sm"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-zinc-400 block mb-2">Pilih Bilangan Set:</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {['1 SET', '2 SET', '3 SET', '4 SET'].map((sOption) => (
                                        <button
                                            key={sOption}
                                            type="button"
                                            onClick={() => {
                                                const parts = activeWeekModal.title.split('—');
                                                const weekPrefix = parts[0] ? parts[0].trim() : 'MINGGU 1';
                                                setActiveWeekModal({
                                                    ...activeWeekModal,
                                                    title: `${weekPrefix} — ${sOption}`
                                                });
                                            }}
                                            className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                                                activeWeekModal.title.includes(sOption)
                                                    ? 'bg-amber-500 border-amber-500 text-black shadow-md'
                                                    : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                                            }`}
                                        >
                                            {sOption}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-zinc-400 block mb-1">Tajuk Penuh Minggu:</label>
                                <input 
                                    type="text" 
                                    value={activeWeekModal.title}
                                    onChange={(e) => setActiveWeekModal({
                                        ...activeWeekModal,
                                        title: e.target.value.toUpperCase()
                                    })}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none font-bold"
                                    placeholder="MINGGU 1 — 1 SET"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-semibold text-zinc-400">Simbol / Emoji Bintang Minggu:</label>
                                    <button 
                                        type="button"
                                        onClick={() => setShowWeekEmojiPicker(!showWeekEmojiPicker)}
                                        className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-amber-400 rounded-lg text-xs font-bold border border-zinc-700 flex items-center gap-1 transition-all"
                                    >
                                        <span>{showWeekEmojiPicker ? 'Tutup Emoji' : 'Pilih Emoji'}</span>
                                        <i className={`fa-solid ${showWeekEmojiPicker ? 'fa-chevron-up' : 'fa-chevron-down'} text-[10px]`}></i>
                                    </button>
                                </div>

                                {/* PILIHAN BINTANG PANTAI / QUICK STAR PRESETS */}
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                    {STAR_PRESETS.map((starPreset) => (
                                        <button
                                            key={starPreset}
                                            type="button"
                                            onClick={() => setActiveWeekModal({
                                                ...activeWeekModal,
                                                stars: starPreset
                                            })}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all active:scale-95 ${
                                                activeWeekModal.stars === starPreset
                                                    ? 'bg-amber-500/25 border-amber-500 text-amber-300'
                                                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                            }`}
                                        >
                                            {starPreset}
                                        </button>
                                    ))}
                                </div>

                                <input 
                                    type="text" 
                                    value={activeWeekModal.stars}
                                    onChange={(e) => setActiveWeekModal({
                                        ...activeWeekModal,
                                        stars: e.target.value
                                    })}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                                    placeholder="⭐"
                                />

                                {showWeekEmojiPicker && (
                                    <div className="pt-2 mt-2 border-t border-zinc-800/80">
                                        <p className="text-[10px] text-zinc-500 mb-2">Tekan emoji untuk tambah ke tajuk minggu:</p>
                                        <div className="grid grid-cols-6 gap-2">
                                            {POPULAR_EMOJIS.map((emo) => (
                                                <button
                                                    key={emo}
                                                    type="button"
                                                    onClick={() => {
                                                        setActiveWeekModal({
                                                            ...activeWeekModal,
                                                            stars: emo
                                                        });
                                                    }}
                                                    className="p-2 bg-zinc-950 hover:bg-amber-500/20 rounded-xl text-lg flex items-center justify-center border border-zinc-800 active:scale-90 transition-all"
                                                >
                                                    {emo}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-2 flex flex-col gap-2">
                            <button 
                                onClick={() => handleUpdateWeek(activeWeekModal)}
                                className="w-full py-3 bg-amber-500 text-black font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors shadow-lg active:scale-95"
                            >
                                Simpan Tetapan Minggu
                            </button>

                            <button 
                                onClick={() => handleDeleteWeek(activeWeekModal.id)}
                                className="w-full py-2.5 bg-red-950/70 border border-red-800/80 hover:bg-red-900 text-red-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95"
                            >
                                <i className="fa-solid fa-trash-can"></i> Padam Minggu Ini
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
