// Helper function to strip "X Set x" from reps string if present
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
    '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍒', '🍑', 
    '🍍', '🥝', '🥭', '🍐', '🍈', '🥥', '🥑', '🍅', '🍏',
    '🔥', '💪', '🏋️', '🏃', '⭐', '🌟', '✨', '💫', '🎯', '🏆', 
    '🥇', '⚡', '🚀', '📈', '✅', '🛡️', '🧠', '💧', '😴', '🥗', '🎧', '🌱', '👑', '🎖️'
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

    const [collapsedDays, setCollapsedDays] = React.useState(() => {
        const saved = localStorage.getItem('workout_collapsed_days_v2');
        return saved ? JSON.parse(saved) : {};
    });

    const [collapsedTemplates, setCollapsedTemplates] = React.useState(() => {
        const saved = localStorage.getItem('workout_collapsed_templates_v2');
        return saved ? JSON.parse(saved) : {};
    });

    const [currentView, setCurrentView] = React.useState('notes');
    const [activeDayModal, setActiveDayModal] = React.useState(null);
    const [activeTemplateModal, setActiveTemplateModal] = React.useState(null);
    const [activeActivityModal, setActiveActivityModal] = React.useState(null);
    const [activeWeekModal, setActiveWeekModal] = React.useState(null);
    const [confirmDeleteModal, setConfirmDeleteModal] = React.useState(null);

    const [showDayEmojiPicker, setShowDayEmojiPicker] = React.useState(false);
    const [showTplEmojiPicker, setShowTplEmojiPicker] = React.useState(false);
    const [showWeekEmojiPicker, setShowWeekEmojiPicker] = React.useState(false);

    React.useEffect(() => {
        localStorage.setItem('workout_templates_v2', JSON.stringify(templates));
    }, [templates]);

    React.useEffect(() => {
        localStorage.setItem('workout_weeks_v2', JSON.stringify(weeks));
    }, [weeks]);

    React.useEffect(() => {
        localStorage.setItem('workout_checked_state_v2', JSON.stringify(checkedState));
    }, [checkedState]);

    React.useEffect(() => {
        localStorage.setItem('workout_collapsed_days_v2', JSON.stringify(collapsedDays));
    }, [collapsedDays]);

    React.useEffect(() => {
        localStorage.setItem('workout_collapsed_templates_v2', JSON.stringify(collapsedTemplates));
    }, [collapsedTemplates]);

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

    const toggleTemplateBukakTutup = (templateId) => {
        setCollapsedTemplates(prev => ({
            ...prev,
            [templateId]: !prev[templateId]
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

    const handleSelectSetCount = (setCount) => {
        if (!activeWeekModal) return;
        const weekMatch = activeWeekModal.title.match(/MINGGU\s*(\d+)/i);
        const weekNum = weekMatch ? weekMatch[1] : '1';
        const newTitle = `MINGGU ${weekNum} — ${setCount} SET`;
        const newStars = '⭐'.repeat(Math.min(setCount, 5));
        setActiveWeekModal({
            ...activeWeekModal,
            title: newTitle,
            stars: newStars
        });
    };

    const handleUpdateActivity = (templateId, updatedActivity) => {
        setTemplates(prev => prev.map(t => {
            if (t.id !== templateId) return t;
            return {
                ...t,
                activities: t.activities.map(a => a.id === updatedActivity.id ? updatedActivity : a)
            };
        }));
        setActiveActivityModal(null);
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
        setCollapsedTemplates({});
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
                            onClick={() => {
                                setActiveTemplateModal({ id: 'new', isNew: true, name: '', emoji: '🍎' });
                                setShowTplEmojiPicker(false);
                            }}
                            className="px-3 py-2 bg-amber-500 text-black font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors flex items-center gap-1.5 shadow-md active:scale-95"
                        >
                            <i className="fa-solid fa-plus text-sm"></i> Sesi Baru
                        </button>
                    </div>

                    <div className="space-y-6">
                        {templates.map((tpl) => {
                            const isTplCollapsed = !!collapsedTemplates[tpl.id];

                            return (
                                <div key={tpl.id} className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 space-y-4 shadow-lg">
                                    {/* TEMPLATE HEADER */}
                                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                                        <div className="flex items-center space-x-2.5">
                                            <span className="text-2xl">{tpl.emoji}</span>
                                            <div>
                                                <h3 className="font-bold text-zinc-100 text-base">{tpl.name}</h3>
                                                <p className="text-[11px] text-zinc-500">{tpl.activities.length} aktiviti latihan</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-1.5 sm:space-x-2">
                                            {/* BUKAK / TUTUP BUTTON */}
                                            <button 
                                                onClick={() => toggleTemplateBukakTutup(tpl.id)}
                                                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1 transition-all ${
                                                    isTplCollapsed 
                                                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
                                                        : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-zinc-200'
                                                }`}
                                                title={isTplCollapsed ? 'Bukak Paparan Latihan' : 'Tutup Paparan Latihan'}
                                            >
                                                <span>{isTplCollapsed ? 'Bukak' : 'Tutup'}</span>
                                                <i className={`fa-solid ${isTplCollapsed ? 'fa-chevron-down' : 'fa-chevron-up'} text-[10px]`}></i>
                                            </button>

                                            <button 
                                                onClick={() => {
                                                    setActiveTemplateModal({ ...tpl, isNew: false });
                                                    setShowTplEmojiPicker(false);
                                                }}
                                                className="px-2.5 sm:px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all active:scale-95"
                                            >
                                                <i className="fa-solid fa-pen text-amber-400"></i> Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteTemplate(tpl.id)}
                                                className="px-2.5 sm:px-3 py-1.5 bg-red-950/80 border border-red-800/80 hover:bg-red-900 text-red-300 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all active:scale-95"
                                                title="Padam Sesi Fokus"
                                            >
                                                <i className="fa-solid fa-trash-can"></i> Padam
                                            </button>
                                        </div>
                                    </div>

                                    {/* CONTENT: ACTIVITIES LIST & ADD FORM */}
                                    {!isTplCollapsed && (
                                        <>
                                            <div className="space-y-2">
                                                {tpl.activities.map((act, index) => (
                                                    <div key={act.id} className="flex items-center justify-between p-2.5 bg-zinc-950/90 rounded-xl border border-zinc-800/80 transition-all gap-2">
                                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                                            <span className="text-xs font-mono text-amber-500 font-bold shrink-0">{index + 1}.</span>
                                                            <div className="flex flex-wrap items-center gap-1.5 min-w-0 flex-1">
                                                                <span className="text-sm font-semibold text-zinc-100 leading-tight">
                                                                    {act.name}
                                                                </span>
                                                                {act.reps && (
                                                                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 font-mono font-bold border border-amber-500/30 whitespace-nowrap shrink-0">
                                                                        {cleanRepsText(act.reps)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex items-center space-x-1.5 shrink-0">
                                                            <button 
                                                                onClick={() => setActiveActivityModal({ templateId: tpl.id, activity: { ...act } })}
                                                                className="w-8 h-8 rounded-lg bg-zinc-800/80 hover:bg-amber-500/20 text-zinc-300 hover:text-amber-400 border border-zinc-700/60 flex items-center justify-center transition-all active:scale-90"
                                                                title="Edit Latihan"
                                                            >
                                                                <i className="fa-solid fa-pen text-xs"></i>
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteActivity(tpl.id, act.id)}
                                                                className="w-8 h-8 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/50 flex items-center justify-center transition-all active:scale-90"
                                                                title="Padam Latihan"
                                                            >
                                                                <i className="fa-solid fa-trash-can text-xs"></i>
                                                            </button>
                                                        </div>
                                                    </div>
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
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </main>
            )}

            {/* MODAL SUNTING LATIHAN */}
            {activeActivityModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 space-y-4 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                            <h3 className="font-bold text-amber-400 text-base">Sunting Latihan</h3>
                            <button 
                                onClick={() => setActiveActivityModal(null)}
                                className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 font-bold flex items-center justify-center text-xs"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-semibold text-zinc-400 block mb-1">Nama Latihan</label>
                                <input 
                                    type="text" 
                                    value={activeActivityModal.activity.name}
                                    onChange={(e) => setActiveActivityModal({
                                        ...activeActivityModal,
                                        activity: { ...activeActivityModal.activity, name: e.target.value }
                                    })}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-zinc-400 block mb-1">Reps / Duration</label>
                                <input 
                                    type="text" 
                                    value={activeActivityModal.activity.reps}
                                    onChange={(e) => setActiveActivityModal({
                                        ...activeActivityModal,
                                        activity: { ...activeActivityModal.activity, reps: e.target.value }
                                    })}
                                    placeholder="cth: 12 Reps / 45 Saat"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                            <button 
                                type="button"
                                onClick={() => setActiveActivityModal(null)}
                                className="w-1/2 py-2.5 bg-zinc-800 text-zinc-300 font-bold text-xs rounded-xl"
                            >
                                Batal
                            </button>
                            <button 
                                type="button"
                                onClick={() => handleUpdateActivity(activeActivityModal.templateId, activeActivityModal.activity)}
                                className="w-1/2 py-2.5 bg-amber-500 text-black font-bold text-xs rounded-xl hover:bg-amber-400"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
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
                    <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                        
                        {/* HEADER */}
                        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                            <div>
                                <h3 className="font-bold text-amber-400 text-base">Tetapan: {activeDayModal.day.dayName}</h3>
                                <p className="text-xs text-zinc-400 mt-0.5">Pilih Sesi Fokus & Emoji Hari</p>
                            </div>
                            <button 
                                onClick={() => {
                                    setActiveDayModal(null);
                                    setShowDayEmojiPicker(false);
                                }}
                                className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 flex items-center justify-center text-xs"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* TAJUK HARI & FOKUS */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-zinc-300 block">Tajuk Hari & Fokus</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input 
                                        type="text" 
                                        value={activeDayModal.day.dayName}
                                        onChange={(e) => setActiveDayModal({
                                            ...activeDayModal,
                                            day: { ...activeDayModal.day, dayName: e.target.value }
                                        })}
                                        placeholder="ISNIN"
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white font-bold focus:border-amber-500 focus:outline-none"
                                    />
                                    <input 
                                        type="text" 
                                        value={activeDayModal.day.focusName}
                                        onChange={(e) => setActiveDayModal({
                                            ...activeDayModal,
                                            day: { ...activeDayModal.day, focusName: e.target.value }
                                        })}
                                        placeholder="DADA"
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white font-bold focus:border-amber-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* EMOJI HARI */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold text-zinc-300">Emoji Hari:</span>
                                        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-lg">
                                            {activeDayModal.day.emoji || '🔥'}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowDayEmojiPicker(!showDayEmojiPicker)}
                                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-bold text-xs rounded-xl border border-zinc-700 flex items-center gap-1.5"
                                    >
                                        <span>Pilih Emoji</span>
                                        <i className={`fa-solid ${showDayEmojiPicker ? 'fa-chevron-up' : 'fa-chevron-down'} text-[10px]`}></i>
                                    </button>
                                </div>

                                {showDayEmojiPicker && (
                                    <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl grid grid-cols-8 gap-1.5 max-h-36 overflow-y-auto">
                                        {POPULAR_EMOJIS.map((emoji, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => {
                                                    setActiveDayModal({
                                                        ...activeDayModal,
                                                        day: { ...activeDayModal.day, emoji: emoji }
                                                    });
                                                    setShowDayEmojiPicker(false);
                                                }}
                                                className={`h-9 flex items-center justify-center rounded-lg hover:bg-zinc-800 text-lg transition-colors ${
                                                    activeDayModal.day.emoji === emoji ? 'bg-amber-500/20 border border-amber-500' : ''
                                                }`}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* REST DAY TOGGLE */}
                            <div className="flex items-center justify-between p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">😴</span>
                                    <div>
                                        <div className="text-xs font-bold text-zinc-100">Jadikan Rest Day</div>
                                        <div className="text-[11px] text-zinc-500">Sembunyikan latihan untuk hari ini</div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setActiveDayModal({
                                        ...activeDayModal,
                                        day: { 
                                            ...activeDayModal.day, 
                                            isRest: !activeDayModal.day.isRest,
                                            focusName: !activeDayModal.day.isRest ? 'REST' : 'DADA',
                                            emoji: !activeDayModal.day.isRest ? '😴' : '🔥'
                                        }
                                    })}
                                    className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                                        activeDayModal.day.isRest 
                                            ? 'bg-amber-500 border-amber-500 text-black font-extrabold' 
                                            : 'bg-zinc-900 border-zinc-600'
                                    }`}
                                >
                                    {activeDayModal.day.isRest && '✓'}
                                </button>
                            </div>

                            {/* PILIH SESI FOKUS */}
                            {!activeDayModal.day.isRest && (
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-zinc-300 block">
                                        Pilih Sesi Fokus yang Ditambah pada {activeDayModal.day.dayName}:
                                    </label>
                                    <div className="space-y-2">
                                        {templates.map((tpl) => {
                                            const isSelected = activeDayModal.day.focusTemplateIds.includes(tpl.id);
                                            const activityCount = tpl.activities ? tpl.activities.length : 0;

                                            return (
                                                <div 
                                                    key={tpl.id}
                                                    onClick={() => {
                                                        const newTplIds = isSelected
                                                            ? activeDayModal.day.focusTemplateIds.filter(id => id !== tpl.id)
                                                            : [...activeDayModal.day.focusTemplateIds, tpl.id];
                                                        setActiveDayModal({
                                                            ...activeDayModal,
                                                            day: { ...activeDayModal.day, focusTemplateIds: newTplIds }
                                                        });
                                                    }}
                                                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                                                        isSelected 
                                                            ? 'bg-amber-500/10 border-amber-500/80 text-white shadow-[0_0_15px_rgba(234,179,8,0.1)]' 
                                                            : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                                                    }`}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-xl">{tpl.emoji}</span>
                                                        <div>
                                                            <div className="text-xs font-extrabold uppercase tracking-wide">{tpl.name}</div>
                                                            <div className="text-[11px] text-zinc-500 font-medium">{activityCount} aktiviti</div>
                                                        </div>
                                                    </div>

                                                    <span className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all ${
                                                        isSelected 
                                                            ? 'bg-amber-500 text-black shadow-sm' 
                                                            : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
                                                    }`}>
                                                        {isSelected ? '✓ Dipilih' : '+ Tambah'}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* BUTTON SIMPAN */}
                        <div className="pt-2">
                            <button 
                                type="button"
                                onClick={() => handleUpdateDay(activeDayModal.day)}
                                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-2xl transition-all shadow-md active:scale-98"
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT TEMPLATE MODAL */}
            {activeTemplateModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                            <h3 className="font-bold text-amber-400 text-base">
                                {activeTemplateModal.isNew ? 'Sesi Fokus Baru' : 'Edit Sesi Fokus'}
                            </h3>
                            <button 
                                onClick={() => {
                                    setActiveTemplateModal(null);
                                    setShowTplEmojiPicker(false);
                                }}
                                className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 font-bold flex items-center justify-center text-xs"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-zinc-400 block mb-1">Nama Sesi Fokus</label>
                                <input 
                                    type="text" 
                                    value={activeTemplateModal.name || ''}
                                    onChange={(e) => setActiveTemplateModal({ ...activeTemplateModal, name: e.target.value })}
                                    placeholder="cth: LATIHAN OTOT BAHU"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                                    autoFocus
                                />
                            </div>

                            {/* EMOJI SESI SELECTOR */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-400 block">Emoji Sesi</label>
                                <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl">
                                            {activeTemplateModal.emoji || '🔥'}
                                        </div>
                                        <span className="text-xs text-zinc-400 font-medium">Pilih emoji buah atau simbol</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowTplEmojiPicker(!showTplEmojiPicker)}
                                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-bold text-xs rounded-xl border border-zinc-700 flex items-center gap-1.5"
                                    >
                                        <span>Pilih Emoji</span>
                                        <i className={`fa-solid ${showTplEmojiPicker ? 'fa-chevron-up' : 'fa-chevron-down'} text-[10px]`}></i>
                                    </button>
                                </div>

                                {/* EMOJI PICKER GRID */}
                                {showTplEmojiPicker && (
                                    <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
                                        <div className="text-[10px] font-bold text-amber-400/90 tracking-wider uppercase">Pilihan Buah-Buahan & Simbol:</div>
                                        <div className="grid grid-cols-7 sm:grid-cols-8 gap-1.5 max-h-48 overflow-y-auto pr-1">
                                            {POPULAR_EMOJIS.map((emoji, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => {
                                                        setActiveTemplateModal({
                                                            ...activeTemplateModal,
                                                            emoji: emoji
                                                        });
                                                        setShowTplEmojiPicker(false);
                                                    }}
                                                    className={`h-10 flex items-center justify-center rounded-xl hover:bg-zinc-800 text-xl transition-all active:scale-90 ${
                                                        activeTemplateModal.emoji === emoji ? 'bg-amber-500/20 border border-amber-500 text-2xl shadow-sm' : ''
                                                    }`}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setActiveTemplateModal(null);
                                        setShowTplEmojiPicker(false);
                                    }}
                                    className="w-1/2 py-2.5 bg-zinc-800 text-zinc-300 font-bold text-xs rounded-xl hover:bg-zinc-700 transition-all"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => {
                                        const name = activeTemplateModal.name ? activeTemplateModal.name.trim() : '';
                                        const emoji = activeTemplateModal.emoji || '🔥';

                                        if (!name) return;

                                        if (activeTemplateModal.isNew) {
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
                                    }}
                                    className="w-1/2 py-2.5 bg-amber-500 text-black font-extrabold text-xs rounded-xl hover:bg-amber-400 transition-all shadow-md active:scale-95"
                                >
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT WEEK SETS & TITLE MODAL */}
            {activeWeekModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                            <div>
                                <h3 className="font-bold text-amber-400 text-base">Tetapan Minggu & Bilangan Set</h3>
                                <p className="text-xs text-zinc-400 mt-0.5">Tentukan berapa set yang ingin anda lakukan</p>
                            </div>
                            <button 
                                onClick={() => {
                                    setActiveWeekModal(null);
                                    setShowWeekEmojiPicker(false);
                                }}
                                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold flex items-center justify-center text-xs shrink-0"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* PILIH BILANGAN SET */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-300 block">Pilih Bilangan Set:</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[1, 2, 3, 4].map((setNum) => {
                                        const isSelected = activeWeekModal.title.includes(`${setNum} SET`);
                                        return (
                                            <button
                                                key={setNum}
                                                type="button"
                                                onClick={() => handleSelectSetCount(setNum)}
                                                className={`py-2 px-1 rounded-xl font-extrabold text-xs border transition-all ${
                                                    isSelected
                                                        ? 'bg-amber-500 border-amber-500 text-black shadow-md'
                                                        : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                                                }`}
                                            >
                                                {setNum} SET
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* TAJUK PENUH MINGGU */}
                            <div>
                                <label className="text-xs font-semibold text-zinc-300 block mb-1">Tajuk Penuh Minggu:</label>
                                <input 
                                    type="text" 
                                    value={activeWeekModal.title}
                                    onChange={(e) => setActiveWeekModal({ ...activeWeekModal, title: e.target.value })}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-bold focus:border-amber-500 focus:outline-none"
                                />
                            </div>

                            {/* SIMBOL / EMOJI BINTANG MINGGU */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-semibold text-zinc-300 block">Simbol / Emoji Bintang Minggu:</label>
                                    <button 
                                        type="button"
                                        onClick={() => setShowWeekEmojiPicker(!showWeekEmojiPicker)}
                                        className="text-[11px] font-semibold text-amber-400 bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 rounded-lg border border-zinc-700 flex items-center gap-1"
                                    >
                                        Pilih Emoji <i className={`fa-solid ${showWeekEmojiPicker ? 'fa-chevron-up' : 'fa-chevron-down'} text-[9px]`}></i>
                                    </button>
                                </div>

                                {/* EMOJI PICKER POPUP */}
                                {showWeekEmojiPicker && (
                                    <div className="p-2 bg-zinc-950 border border-zinc-800 rounded-xl grid grid-cols-8 gap-1.5 max-h-32 overflow-y-auto">
                                        {POPULAR_EMOJIS.map((emoji, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => {
                                                    setActiveWeekModal({ ...activeWeekModal, stars: activeWeekModal.stars + emoji });
                                                }}
                                                className="h-8 flex items-center justify-center hover:bg-zinc-800 rounded text-sm"
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* PRESET STARS BUTTONS */}
                                <div className="flex flex-wrap gap-1.5">
                                    {STAR_PRESETS.map((starPreset, idx) => {
                                        const isPresetActive = activeWeekModal.stars === starPreset;
                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setActiveWeekModal({ ...activeWeekModal, stars: starPreset })}
                                                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                                                    isPresetActive 
                                                        ? 'bg-amber-500/20 border-amber-500 text-amber-300' 
                                                        : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                                                }`}
                                            >
                                                {starPreset}
                                            </button>
                                        );
                                    })}
                                </div>

                                <input 
                                    type="text" 
                                    value={activeWeekModal.stars}
                                    onChange={(e) => setActiveWeekModal({ ...activeWeekModal, stars: e.target.value })}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="space-y-2 pt-2">
                            <button 
                                type="button"
                                onClick={() => handleUpdateWeek(activeWeekModal)}
                                className="w-full py-3 bg-amber-500 text-black font-bold text-xs rounded-xl hover:bg-amber-400 transition-all shadow-md"
                            >
                                Simpan Tetapan Minggu
                            </button>
                            <button 
                                type="button"
                                onClick={() => handleDeleteWeek(activeWeekModal.id)}
                                className="w-full py-3 bg-red-950/60 hover:bg-red-900/80 text-red-400 border border-red-900/60 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <i className="fa-solid fa-trash-can"></i>
                                Padam Minggu Ini
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

window.onload = function() {
    const rootElement = document.getElementById('root');
    if (rootElement) {
        const root = ReactDOM.createRoot(rootElement);
        root.render(<App />);
    }
};
