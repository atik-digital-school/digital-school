import { useEffect, useState } from 'react';

const ROOM_DIRECTIONS: Record<string, string[]> = {
    // PRÍZEMIE (Prízemie)
    '5':  [
        'Vojdite hlavným vchodom do budovy školy.',
        'Pokračujte priamo chodbou.',
        'Učebňa č. 5 je na ľavej strane, tretie dvere.',
    ],
    '6':  [
        'Vojdite hlavným vchodom do budovy školy.',
        'Pokračujte priamo chodbou.',
        'Učebňa č. 6 je na ľavej strane, štvrté dvere.',
    ],
    '7':  [
        'Vojdite hlavným vchodom do budovy školy.',
        'Choďte priamo do konca chodby.',
        'Učebňa č. 7 je napravo na konci chodby.',
    ],
    '8':  [
        'Vojdite hlavným vchodom do budovy školy.',
        'Odbočte doprava hneď za vchodom.',
        'Učebňa č. 8 je prvá miestnosť napravo.',
    ],
    '9':  [
        'Vojdite hlavným vchodom do budovy školy.',
        'Odbočte doprava hneď za vchodom.',
        'Učebňa č. 9 je druhá miestnosť napravo.',
    ],
    '10': [
        'Vojdite hlavným vchodom do budovy školy.',
        'Odbočte doprava hneď za vchodom.',
        'Učebňa č. 10 je tretia miestnosť napravo.',
    ],
    // 1. POSCHODIE
    '11': [
        'Vojdite hlavným vchodom do budovy školy.',
        'Choďte priamo k schodisku v strede budovy.',
        'Vystúpte na 1. poschodie.',
        'Odbočte doľava na chodbe.',
        'Učebňa č. 11 je prvá miestnosť naľavo.',
    ],
    '12': [
        'Vojdite hlavným vchodom do budovy školy.',
        'Choďte priamo k schodisku v strede budovy.',
        'Vystúpte na 1. poschodie.',
        'Odbočte doľava na chodbe.',
        'Učebňa č. 12 je druhá miestnosť naľavo.',
    ],
    '13': [
        'Vojdite hlavným vchodom do budovy školy.',
        'Choďte priamo k schodisku v strede budovy.',
        'Vystúpte na 1. poschodie.',
        'Pokračujte priamo chodbou.',
        'Učebňa č. 13 je uprostred chodby napravo.',
    ],
    '14': [
        'Vojdite hlavným vchodom do budovy školy.',
        'Choďte priamo k schodisku v strede budovy.',
        'Vystúpte na 1. poschodie.',
        'Pokračujte priamo chodbou.',
        'Učebňa č. 14 je uprostred chodby naľavo.',
    ],
    '15': [
        'Vojdite hlavným vchodom do budovy školy.',
        'Choďte priamo k schodisku v strede budovy.',
        'Vystúpte na 1. poschodie.',
        'Odbočte doprava na chodbe.',
        'Učebňa č. 15 je na konci chodby napravo.',
    ],
    // 2. POSCHODIE
    '16': [
        'Vojdite hlavným vchodom do budovy školy.',
        'Choďte priamo k schodisku v strede budovy.',
        'Vystúpte na 2. poschodie.',
        'Odbočte doľava na chodbe.',
        'Učebňa č. 16 je prvá miestnosť naľavo.',
    ],
    '17': [
        'Vojdite hlavným vchodom do budovy školy.',
        'Choďte priamo k schodisku v strede budovy.',
        'Vystúpte na 2. poschodie.',
        'Odbočte doľava na chodbe.',
        'Učebňa č. 17 je druhá miestnosť naľavo.',
    ],
    '18': [
        'Vojdite hlavným vchodom do budovy školy.',
        'Choďte priamo k schodisku v strede budovy.',
        'Vystúpte na 2. poschodie.',
        'Pokračujte priamo chodbou.',
        'Učebňa č. 18 je napravo.',
    ],
    '19': [
        'Vojdite hlavným vchodom do budovy školy.',
        'Choďte priamo k schodisku v strede budovy.',
        'Vystúpte na 2. poschodie.',
        'Pokračujte priamo chodbou.',
        'Učebňa č. 19 je naľavo.',
    ],
    '20': [
        'Vojdite hlavným vchodom do budovy školy.',
        'Choďte priamo k schodisku v strede budovy.',
        'Vystúpte na 2. poschodie.',
        'Odbočte doprava na chodbe.',
        'Učebňa č. 20 je prvá miestnosť napravo.',
    ],
    '21': [
        'Vojdite hlavným vchodom do budovy školy.',
        'Choďte priamo k schodisku v strede budovy.',
        'Vystúpte na 2. poschodie.',
        'Odbočte doprava na chodbe.',
        'Učebňa č. 21 je na konci chodby napravo.',
    ],
    // 3. POSCHODIE
    '22': [
        'Vojdite hlavným vchodom do budovy školy.',
        'Choďte priamo k schodisku v strede budovy.',
        'Vystúpte na 3. poschodie.',
        'Odbočte doľava na chodbe.',
        'Učebňa č. 22 je prvá miestnosť naľavo.',
    ],
    '23': [
        'Vojdite hlavným vchodom do budovy školy.',
        'Choďte priamo k schodisku v strede budovy.',
        'Vystúpte na 3. poschodie.',
        'Odbočte doľava na chodbe.',
        'Učebňa č. 23 je druhá miestnosť naľavo.',
    ],
    '24': [
        'Vojdite hlavným vchodom do budovy školy.',
        'Choďte priamo k schodisku v strede budovy.',
        'Vystúpte na 3. poschodie.',
        'Pokračujte priamo chodbou.',
        'Učebňa č. 24 je napravo.',
    ],
    '25': [
        'Vojdite hlavným vchodom do budovy školy.',
        'Choďte priamo k schodisku v strede budovy.',
        'Vystúpte na 3. poschodie.',
        'Pokračujte priamo chodbou.',
        'Učebňa č. 25 je naľavo.',
    ],
    '26': [
        'Vojdite hlavným vchodom do budovy školy.',
        'Choďte priamo k schodisku v strede budovy.',
        'Vystúpte na 3. poschodie.',
        'Pokračujte priamo chodbou.',
        'Učebňa č. 26 je druhá napravo.',
    ],
    '27': [
        'Vojdite hlavným vchodom do budovy školy.',
        'Choďte priamo k schodisku v strede budovy.',
        'Vystúpte na 3. poschodie.',
        'Odbočte doprava na chodbe.',
        'Učebňa č. 27 je prvá miestnosť napravo.',
    ],
    '28': [
        'Vojdite hlavným vchodom do budovy školy.',
        'Choďte priamo k schodisku v strede budovy.',
        'Vystúpte na 3. poschodie.',
        'Odbočte doprava na chodbe.',
        'Učebňa č. 28 je druhá miestnosť napravo.',
    ],
    '29': [
        'Vojdite hlavným vchodom do budovy školy.',
        'Choďte priamo k schodisku v strede budovy.',
        'Vystúpte na 3. poschodie.',
        'Odbočte doprava na chodbe.',
        'Učebňa č. 29 je tretia miestnosť napravo.',
    ],
    '30': [
        'Vojdite hlavným vchodom do budovy školy.',
        'Choďte priamo k schodisku v strede budovy.',
        'Vystúpte na 3. poschodie.',
        'Odbočte doprava na chodbe.',
        'Učebňa č. 30 je na konci chodby napravo.',
    ],
    // 4. POSCHODIE — administratíva
    '401': [
        'Vojdite hlavným vchodom do budovy školy.',
        'Choďte priamo k schodisku v strede budovy.',
        'Vystúpte na 4. poschodie.',
        'Odbočte doľava.',
        'Riaditeľstvo je prvé dvere naľavo (č. 401).',
    ],
    '402': [
        'Vojdite hlavným vchodom do budovy školy.',
        'Choďte priamo k schodisku v strede budovy.',
        'Vystúpte na 4. poschodie.',
        'Odbočte doľava.',
        'Sekretariát je druhé dvere naľavo (č. 402).',
    ],
    '403': [
        'Vojdite hlavným vchodom do budovy školy.',
        'Choďte priamo k schodisku v strede budovy.',
        'Vystúpte na 4. poschodie.',
        'Pokračujte priamo chodbou.',
        'Zborovňa je napravo (č. 403).',
    ],
};

// Fallback inštrukcie ak kancelária nie je v zozname
function getFallbackDirections(floor: string, roomNumber: string, name: string): string[] {
    const floorNum = floor.replace('. poschodie', '').replace('Prízemie', '0');
    const steps: string[] = [
        'Vojdite hlavným vchodom do budovy školy.',
    ];

    if (floor === 'Prízemie') {
        steps.push('Miestnosť sa nachádza na prízemí.');
        steps.push('Sledujte označenie na chodbe.');
    } else {
        steps.push('Choďte priamo k schodisku v strede budovy.');
        steps.push(`Vystúpte na ${floor}.`);
        steps.push('Sledujte označenie na chodbe.');
    }

    steps.push(`Hľadajte tabuľu s nápisom "${name}" alebo číslom ${roomNumber}.`);
    return steps;
}

const STEP_ICONS: Record<number, string> = {};

function getStepIcon(step: string): string {
    if (step.includes('Vojdite') || step.includes('vchodom')) return '🚪';
    if (step.includes('doľava') || step.includes('Odbočte doľava')) return '↰';
    if (step.includes('doprava') || step.includes('Odbočte doprava')) return '↱';
    if (step.includes('priamo') || step.includes('Pokračujte')) return '↑';
    if (step.includes('Vystúpte') || step.includes('poschodie') || step.includes('schodis')) return '🪜';
    if (step.includes('Hľadajte') || step.includes('tabuľu') || step.includes('dvere')) return '🔍';
    return '•';
}

export default function NavigatePage() {
    const [params, setParams] = useState<{
        room: string;
        floor: string;
        name: string;
        type: string;
    } | null>(null);

    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const search = new URLSearchParams(window.location.search);
        setParams({
            room: search.get('room') || '',
            floor: search.get('floor') || '',
            name: search.get('name') || '',
            type: search.get('type') || 'classroom',
        });
    }, []);

    if (!params) return null;

    const { room, floor, name, type } = params;

    const steps =
        ROOM_DIRECTIONS[room] || getFallbackDirections(floor, room, name);

    const TYPE_COLOR: Record<string, string> = {
        classroom:  '#1d4ed8',
        office:     '#15803d',
        facility:   '#b45309',
        department: '#6d28d9',
    };
    const accentColor = TYPE_COLOR[type] || '#1d4ed8';

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(160deg, #f0f7ff 0%, #e8f4fd 50%, #f5f3ff 100%)',
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
            padding: '0 0 40px',
        }}>
            {/* Header */}
            <div style={{
                background: 'white',
                borderBottom: '1px solid rgba(0,0,0,0.08)',
                padding: '16px 20px',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}>
                <div style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.12em', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>
                    SPŠ stavebná a geodetická
                </div>
                <div style={{ fontSize: 13, color: '#94a3b8' }}>Navigačný sprievodca</div>
            </div>

            <div style={{ padding: '20px 20px 0' }}>
                {/* Destination card */}
                <div style={{
                    background: 'white',
                    borderRadius: 20,
                    padding: '20px',
                    marginBottom: 20,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    border: `2px solid ${accentColor}22`,
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        background: `${accentColor}15`,
                        color: accentColor,
                        borderRadius: 100,
                        padding: '4px 12px',
                        fontSize: 12,
                        fontWeight: 700,
                        marginBottom: 10,
                    }}>
                        🎯 Cieľ
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', lineHeight: 1.2, marginBottom: 6 }}>
                        {name || `Miestnosť ${room}`}
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
                background: '#f1f5f9', color: '#475569', borderRadius: 8,
                padding: '4px 10px', fontSize: 13, fontWeight: 600,
            }}>
              📍 {floor}
            </span>
                        <span style={{
                            background: '#f1f5f9', color: '#475569', borderRadius: 8,
                            padding: '4px 10px', fontSize: 13, fontWeight: 600,
                        }}>
              🚪 č. {room}
            </span>
                    </div>
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Postup
            </span>
                        <span style={{ fontSize: 12, color: accentColor, fontWeight: 700 }}>
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
                    </div>
                    <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{
                            height: '100%',
                            width: `${((currentStep + 1) / steps.length) * 100}%`,
                            background: `linear-gradient(90deg, ${accentColor}, ${accentColor}99)`,
                            borderRadius: 3,
                            transition: 'width 0.4s ease',
                        }} />
                    </div>
                </div>

                {/* Steps */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                    {steps.map((step, i) => {
                        const isDone = i < currentStep;
                        const isCurrent = i === currentStep;
                        const icon = getStepIcon(step);

                        return (
                            <div
                                key={i}
                                onClick={() => setCurrentStep(i)}
                                style={{
                                    background: isCurrent ? `${accentColor}12` : isDone ? '#f8fafc' : 'white',
                                    border: isCurrent
                                        ? `2px solid ${accentColor}`
                                        : isDone
                                            ? '2px solid #e2e8f0'
                                            : '2px solid #f1f5f9',
                                    borderRadius: 16,
                                    padding: '16px',
                                    display: 'flex',
                                    gap: 14,
                                    alignItems: 'flex-start',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    opacity: isDone ? 0.6 : 1,
                                }}
                            >
                                {/* Step number / checkmark */}
                                <div style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '50%',
                                    background: isDone
                                        ? '#dcfce7'
                                        : isCurrent
                                            ? accentColor
                                            : '#f1f5f9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: isDone ? 16 : 14,
                                    fontWeight: 800,
                                    color: isDone ? '#16a34a' : isCurrent ? 'white' : '#94a3b8',
                                    flexShrink: 0,
                                }}>
                                    {isDone ? '✓' : isCurrent ? icon : i + 1}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontSize: isCurrent ? 16 : 15,
                                        fontWeight: isCurrent ? 700 : 500,
                                        color: isDone ? '#94a3b8' : isCurrent ? '#0f172a' : '#334155',
                                        lineHeight: 1.5,
                                        textDecoration: isDone ? 'line-through' : 'none',
                                    }}>
                                        {step}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Navigation buttons */}
                <div style={{ display: 'flex', gap: 12 }}>
                    {currentStep > 0 && (
                        <button
                            onClick={() => setCurrentStep(s => s - 1)}
                            style={{
                                flex: 1,
                                padding: '16px',
                                borderRadius: 14,
                                border: '2px solid #e2e8f0',
                                background: 'white',
                                fontSize: 15,
                                fontWeight: 700,
                                color: '#475569',
                                cursor: 'pointer',
                            }}
                        >
                            ← Späť
                        </button>
                    )}

                    {currentStep < steps.length - 1 ? (
                        <button
                            onClick={() => setCurrentStep(s => s + 1)}
                            style={{
                                flex: 2,
                                padding: '16px',
                                borderRadius: 14,
                                border: 'none',
                                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                                fontSize: 15,
                                fontWeight: 700,
                                color: 'white',
                                cursor: 'pointer',
                                boxShadow: `0 4px 16px ${accentColor}44`,
                            }}
                        >
                            Ďalší krok →
                        </button>
                    ) : (
                        <div style={{
                            flex: 2,
                            padding: '16px',
                            borderRadius: 14,
                            background: '#dcfce7',
                            border: '2px solid #86efac',
                            textAlign: 'center',
                            fontSize: 15,
                            fontWeight: 700,
                            color: '#15803d',
                        }}>
                            🎉 Ste na mieste!
                        </div>
                    )}
                </div>

                {/* All steps list */}
                <div style={{
                    marginTop: 28,
                    background: 'white',
                    borderRadius: 16,
                    padding: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
                        Všetky kroky
                    </div>
                    {steps.map((step, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            gap: 10,
                            paddingBottom: i < steps.length - 1 ? 10 : 0,
                            marginBottom: i < steps.length - 1 ? 10 : 0,
                            borderBottom: i < steps.length - 1 ? '1px solid #f1f5f9' : 'none',
                        }}>
                            <div style={{
                                width: 22,
                                height: 22,
                                borderRadius: '50%',
                                background: i < currentStep ? '#dcfce7' : i === currentStep ? accentColor : '#f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 10,
                                fontWeight: 800,
                                color: i < currentStep ? '#16a34a' : i === currentStep ? 'white' : '#94a3b8',
                                flexShrink: 0,
                                marginTop: 1,
                            }}>
                                {i < currentStep ? '✓' : i + 1}
                            </div>
                            <div style={{
                                fontSize: 13,
                                color: i < currentStep ? '#94a3b8' : '#475569',
                                lineHeight: 1.5,
                                fontWeight: i === currentStep ? 600 : 400,
                                textDecoration: i < currentStep ? 'line-through' : 'none',
                            }}>
                                {step}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer note */}
                <div style={{
                    marginTop: 20,
                    padding: '12px 16px',
                    borderRadius: 12,
                    background: 'rgba(0,0,0,0.04)',
                    textAlign: 'center',
                    fontSize: 12,
                    color: '#94a3b8',
                    lineHeight: 1.5,
                }}>
                    Ak sa stratíte, požiadajte o pomoc personál školy alebo sa vráťte k informačnému kiosku.
                </div>
            </div>
        </div>
    );
}
