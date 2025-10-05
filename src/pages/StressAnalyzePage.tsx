import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components';
import { MOCK_DATA } from '../data/mockData';

interface StressAnalysisResult {
    label: string;
    prediction: number;
    confidence: {
        sakin: number;
        stres: number;
    };
    confidence_percentage: string;
    ai_advice: {
        recommendation: string;
        source: string;
    };
    timestamp: string;
}

interface PastAnalysis {
    date: string;
    label: string;
    stressLevel: number;
    note: string;
    advice_summary: string;
    benefit: string;
    icon: string;
    fullAdvice: string;
    followUpData: {
        day3: { status: string; improvement: number; notes: string };
        day7: { status: string; improvement: number; notes: string };
        day14: { status: string; improvement: number; notes: string };
    };
}

// Statik geçmiş analizler - detaylı versiyon
const PAST_ANALYSES: PastAnalysis[] = [
    {
        date: '2025-09-28',
        label: 'Sakin',
        stressLevel: 18,
        note: 'Bugün güzel bir gün geçirdim',
        advice_summary: 'Düzenli uyku ve meditasyon rutininizi sürdürün',
        benefit: 'Uykusuzluk sorununda %40 iyileşme',
        icon: '😌',
        fullAdvice: 'Sevgili astronot,\n\nBugünkü sakin durumunuz sevindirici. Ancak bu durumu korumak için öneriler:\n\n**Önerilen Rutinler:**\n\n1. **Sabah Meditasyonu:** Her sabah 10 dakika sessizlik ve nefes egzersizleri yapın.\n2. **Düzenli Uyku:** 22:00-06:00 arası uyku saatlerinizi koruyun.\n3. **Günlük Yazma:** Minnetarlık günlüğünüzü sürdürün.\n\nBu rutinleri devam ettirerek zihinsel sağlığınızı koruyabilirsiniz.',
        followUpData: {
            day3: {
                status: 'İyileşme Devam Ediyor',
                improvement: 15,
                notes: 'Uyku kalitesinde belirgin artış. Sabah rutini başarıyla uygulanıyor.'
            },
            day7: {
                status: 'Hedef Başarıldı',
                improvement: 40,
                notes: 'Uykusuzluk sorunu büyük ölçüde çözüldü. Genel ruh hali olumlu.'
            },
            day14: {
                status: 'Stabilize',
                improvement: 45,
                notes: 'Uyku rutini oturtuldu. Stress seviyeleri düşük kalmaya devam ediyor.'
            }
        }
    },
    {
        date: '2025-09-25',
        label: 'Hafif Stres',
        stressLevel: 55,
        note: 'Görev yoğunluğu arttı',
        advice_summary: 'Nefes egzersizleri ve kısa molalar önerildi',
        benefit: 'Konsantrasyon süresinde %25 artış',
        icon: '😐',
        fullAdvice: 'Sevgili astronot,\n\nGörev yoğunluğunuzun artması normaldir. İşte öneriler:\n\n**Acil Öneriler:**\n\n1. **4-7-8 Nefes Tekniği:** Her 2 saatte bir uygulayın.\n2. **Mikro Molalar:** 45 dakikada bir 5 dakika mola verin.\n3. **Önceliklendirme:** Görevlerinizi aciliyet ve önem matrisine göre sıralayın.\n\nBu teknikler iş verimliliğinizi artıracaktır.',
        followUpData: {
            day3: {
                status: 'Hafif İyileşme',
                improvement: 10,
                notes: 'Nefes egzersizleri uygulanıyor. Henüz tam adaptasyon sağlanmadı.'
            },
            day7: {
                status: 'Belirgin İyileşme',
                improvement: 25,
                notes: 'Mola rutini oturtuldu. Konsantrasyon süresi arttı.'
            },
            day14: {
                status: 'Başarı',
                improvement: 30,
                notes: 'İş verimliliği optimize edildi. Stres yönetimi etkili.'
            }
        }
    },
    {
        date: '2025-09-20',
        label: 'Stres',
        stressLevel: 78,
        note: 'Uykusuzluk ve yorgunluk',
        advice_summary: 'Derin uyku teknikleri ve fiziksel aktivite önerildi',
        benefit: 'Stres seviyesinde %35 azalma (1 hafta sonra)',
        icon: '😟',
        fullAdvice: 'Sevgili astronot,\n\nYüksek stres seviyeniz endişe verici. Acil müdahale gerekiyor:\n\n**Kritik Öneriler:**\n\n1. **Uyku Protokolü:** Yatmadan 2 saat önce ekrandan uzak durun. Oda sıcaklığını 18-20°C yapın.\n2. **Progresif Kas Gevşetme:** Her gece uygulanmalı.\n3. **Hafif Egzersiz:** Günde 20 dakika hafif kardiyo.\n4. **Uzman Görüşmesi:** Düzenli psikolojik destek alın.\n\nBu durumda ekip liderinizle görüşmenizi öneriyorum.',
        followUpData: {
            day3: {
                status: 'Başlangıç Aşaması',
                improvement: 5,
                notes: 'Uyku protokolü başlatıldı. Henüz tam etki görülmedi.'
            },
            day7: {
                status: 'Orta Düzey İyileşme',
                improvement: 35,
                notes: 'Uyku kalitesi arttı. Yorgunluk azaldı. Egzersiz rutini düzenli.'
            },
            day14: {
                status: 'İyi İyileşme',
                improvement: 42,
                notes: 'Stres seviyeleri normal aralığa döndü. Uzman görüşmeleri devam ediyor.'
            }
        }
    },
    {
        date: '2025-09-15',
        label: 'Stres',
        stressLevel: 82,
        note: 'Çok yorgunum, aile özlemi',
        advice_summary: 'Sosyal bağlantı egzersizleri ve minnetarlık günlüğü',
        benefit: 'Duygusal iyilik halinde %45 iyileşme',
        icon: '😔',
        fullAdvice: 'Sevgili astronot,\n\nYüksek stres ve aile özleminiz anlaşılır. Duygusal destek çok önemli:\n\n**Duygusal Destek Stratejileri:**\n\n1. **Günlük Video Görüşme:** Ailenizle her gün en az 15 dakika konuşun.\n2. **Anı Köşesi:** Kişisel alanınızda aile fotoğrafları bulundurun.\n3. **Mektup Yazma:** Duygularınızı yazıya dökmek terapötik.\n4. **Ekip Aktiviteleri:** Mürettebatla sosyal aktivitelere katılın.\n5. **Psikolojik Danışmanlık:** Haftada 2 kez profesyonel destek.\n\nYalnız olmadığınızı unutmayın.',
        followUpData: {
            day3: {
                status: 'Duygusal Destek Başladı',
                improvement: 12,
                notes: 'Video görüşmeler düzenli yapılıyor. Hafif rahatlama.'
            },
            day7: {
                status: 'Sosyal Bağlar Güçleniyor',
                improvement: 30,
                notes: 'Ekip aktivitelerine katılım arttı. Yalnızlık hissi azaldı.'
            },
            day14: {
                status: 'Belirgin İyileşme',
                improvement: 45,
                notes: 'Duygusal iyilik hali normale döndü. Aile bağları güçlendi.'
            }
        }
    },
];

const StressAnalyzePage: React.FC = () => {
    const navigate = useNavigate();
    const [userNote, setUserNote] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<StressAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showHistory, setShowHistory] = useState(true);
    const [selectedAnalysis, setSelectedAnalysis] = useState<PastAnalysis | null>(null);

    const analyzeStress = async () => {
        if (!userNote.trim()) {
            setError('Lütfen bir not girin');
            return;
        }

        setIsAnalyzing(true);
        setError(null);
        setShowHistory(false);

        try {
            const t = Array.from({ length: 42000 }, (_, i) => i / 700);
            const ecg = t.map(time => Math.sin(2 * Math.PI * 1.1 * time) + 0.05 * (Math.random() - 0.5) * 2);
            const eda = t.map(time => 2.0 + 0.3 * Math.sin(2 * Math.PI * 0.05 * time));

            const payload = {
                ecg: ecg,
                eda: eda,
                get_ai_advice: true,
                user_note: userNote
            };

            const response = await fetch('http://localhost:5617/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Analiz başarısız oldu');
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Bir hata oluştu');
            setShowHistory(true);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getStressColor = (prediction: number) => {
        if (prediction === 2) return 'text-red-500';
        if (prediction === 1) return 'text-yellow-500';
        return 'text-green-500';
    };

    const getStressBg = (prediction: number) => {
        if (prediction === 2) return 'bg-red-900/20 border-red-500';
        if (prediction === 1) return 'bg-yellow-900/20 border-yellow-500';
        return 'bg-green-900/20 border-green-500';
    };

    const getStressColorByLevel = (level: number) => {
        if (level >= 70) return 'text-red-400';
        if (level >= 40) return 'text-yellow-400';
        return 'text-green-400';
    };

    return (
        <div className="min-h-screen bg-gray-950">
            <Header name={MOCK_DATA.astronautName} day={MOCK_DATA.missionDay} showBack={true} />
            
            <main className="p-4 md:p-8 pb-16 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-purple-400 border-b border-gray-700 pb-2">
                        Stres & Mental Sağlık Analizi
                    </h2>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-gray-400 hover:text-white transition"
                    >
                        Dashboard'a Dön
                    </button>
                </div>

                {/* Input Section */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-2xl mb-8 border border-purple-500/30">
                    <h3 className="text-xl font-semibold text-gray-200 mb-4">
                        Nasıl Hissediyorsunuz?
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                        Şu anki ruh halinizi, yorgunluk düzeyinizi veya endişelerinizi paylaşın. 
                        Yapay zeka danışmanınız size özel öneriler sunacak.
                    </p>
                    
                    <textarea
                        value={userNote}
                        onChange={(e) => setUserNote(e.target.value)}
                        placeholder="Örnek: Çok yorgunum, uyuyamıyorum..."
                        className="w-full h-32 p-4 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none resize-none"
                        disabled={isAnalyzing}
                    />

                    {error && (
                        <p className="text-red-400 text-sm mt-2">⚠️ {error}</p>
                    )}

                    <button
                        onClick={analyzeStress}
                        disabled={isAnalyzing || !userNote.trim()}
                        className={`mt-4 w-full md:w-auto px-8 py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
                            isAnalyzing || !userNote.trim()
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-500 text-white transform hover:scale-105'
                        }`}
                    >
                        {isAnalyzing ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Analiz Ediliyor...
                            </span>
                        ) : (
                            'Stres Analizini Başlat'
                        )}
                    </button>
                </div>

                {/* Geçmiş Analizler */}
                {showHistory && !result && (
                    <div className="mb-8 animate-fadeIn">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl font-bold text-white">
                                Geçmiş Analizler ve Sonuçlar
                            </h3>
                            <span className="text-sm text-gray-400">Son 20 Gün</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {PAST_ANALYSES.map((analysis, index) => (
                                <div 
                                    key={index}
                                    onClick={() => setSelectedAnalysis(analysis)}
                                    className="bg-gray-800 p-5 rounded-xl border border-gray-700 hover:border-purple-500 transition-all cursor-pointer transform hover:scale-[1.02]"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-4xl">{analysis.icon}</span>
                                            <div>
                                                <p className={`font-bold text-lg ${getStressColorByLevel(analysis.stressLevel)}`}>
                                                    {analysis.label}
                                                </p>
                                                <p className="text-xs text-gray-400">{analysis.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-white">{analysis.stressLevel}%</p>
                                            <p className="text-xs text-gray-500">Stres</p>
                                        </div>
                                    </div>

                                    <div className="mb-3 p-3 bg-gray-900/50 rounded-lg">
                                        <p className="text-sm text-gray-400 italic">"{analysis.note}"</p>
                                    </div>

                                    <div className="mb-3">
                                        <p className="text-xs text-purple-400 font-semibold mb-1">AI Tavsiyesi:</p>
                                        <p className="text-sm text-gray-300">{analysis.advice_summary}</p>
                                    </div>

                                    <div className="pt-3 border-t border-gray-700">
                                        <div className="flex items-start gap-2">
                                            <span className="text-green-400 text-sm flex-shrink-0">✓</span>
                                            <p className="text-sm text-green-400 font-medium">{analysis.benefit}</p>
                                        </div>
                                    </div>

                                    <div className="mt-3 text-center">
                                        <span className="text-xs text-purple-400 hover:text-purple-300">
                                            Detayları görüntülemek için tıklayın →
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* İstatistikler */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 p-6 rounded-xl border border-green-500/30">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-lg font-semibold text-white">Genel İyileşme</h4>
                                    <span className="text-3xl">📈</span>
                                </div>
                                <p className="text-4xl font-bold text-green-400 mb-1">38%</p>
                                <p className="text-sm text-gray-400">Son 20 günde stres seviyesi azalması</p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 p-6 rounded-xl border border-blue-500/30">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-lg font-semibold text-white">Takip Süresi</h4>
                                    <span className="text-3xl">📅</span>
                                </div>
                                <p className="text-4xl font-bold text-blue-400 mb-1">4</p>
                                <p className="text-sm text-gray-400">Toplam analiz sayısı</p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 p-6 rounded-xl border border-purple-500/30">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-lg font-semibold text-white">Başarı Oranı</h4>
                                    <span className="text-3xl">🎯</span>
                                </div>
                                <p className="text-4xl font-bold text-purple-400 mb-1">92%</p>
                                <p className="text-sm text-gray-400">Önerilerin uygulanma oranı</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results Section */}
                {result && (
                    <div className="space-y-6 animate-fadeIn">
                        {/* Stres Seviyesi */}
                        <div className={`p-6 rounded-xl shadow-2xl border-2 ${getStressBg(result.prediction)}`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl font-bold text-white">
                                    Stres Seviyesi Tespiti
                                </h3>
                                <span className="text-sm text-gray-400">{new Date(result.timestamp).toLocaleString('tr-TR')}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <p className="text-sm text-gray-400 mb-2">Durum</p>
                                    <p className={`text-4xl font-extrabold ${getStressColor(result.prediction)}`}>
                                        {result.label}
                                    </p>
                                </div>

                                <div className="text-center">
                                    <p className="text-sm text-gray-400 mb-2">Güven Oranı</p>
                                    <p className="text-4xl font-extrabold text-white">
                                        {result.confidence_percentage}
                                    </p>
                                </div>

                                <div className="text-center">
                                    <p className="text-sm text-gray-400 mb-2">Stres Puanı</p>
                                    <div className="flex justify-center gap-4 text-sm">
                                        <div>
                                            <span className="text-green-400">Sakin: </span>
                                            <span className="text-white font-bold">{(result.confidence.sakin * 100).toFixed(0)}%</span>
                                        </div>
                                        <div>
                                            <span className="text-red-400">Stres: </span>
                                            <span className="text-white font-bold">{(result.confidence.stres * 100).toFixed(0)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-1000"
                                        style={{ width: `${result.confidence.stres * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* AI Tavsiyesi */}
                        <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-6 rounded-xl shadow-2xl border border-purple-500/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">🤖</span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">
                                        AI Danışman Önerileri
                                    </h3>
                                    <p className="text-sm text-gray-400">Kaynak: {result.ai_advice.source}</p>
                                </div>
                            </div>

                            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 max-h-96 overflow-y-auto">
                                <div className="prose prose-invert max-w-none">
                                    {result.ai_advice.recommendation.split('\n\n').map((paragraph, index) => {
                                        if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                                            return (
                                                <h4 key={index} className="text-xl font-bold text-purple-400 mt-6 mb-3">
                                                    {paragraph.replace(/\*\*/g, '')}
                                                </h4>
                                            );
                                        }
                                        if (paragraph.startsWith('*   ')) {
                                            return (
                                                <ul key={index} className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                                    <li>{paragraph.replace('*   ', '')}</li>
                                                </ul>
                                            );
                                        }
                                        return (
                                            <p key={index} className="text-gray-300 leading-relaxed mb-4">
                                                {paragraph}
                                            </p>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mt-6 flex gap-4">
                                <button 
                                    onClick={() => window.print()}
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition font-semibold"
                                >
                                    Raporu Yazdır
                                </button>
                                <button 
                                    onClick={() => {
                                        setResult(null);
                                        setShowHistory(true);
                                    }}
                                    className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-lg transition font-semibold"
                                >
                                    Yeni Analiz Yap
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* MODAL - Detaylı Analiz Görünümü */}
            {selectedAnalysis && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedAnalysis(null)}
                >
                    <div 
                        className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-purple-500/50 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gray-800 p-6 border-b border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="text-5xl">{selectedAnalysis.icon}</span>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{selectedAnalysis.label}</h3>
                                    <p className="text-sm text-gray-400">{selectedAnalysis.date}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedAnalysis(null)}
                                className="text-gray-400 hover:text-white text-3xl"
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Başlangıç Durumu */}
                            <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                                <h4 className="text-lg font-bold text-purple-400 mb-3">Başlangıç Durumu</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">Stres Seviyesi</p>
                                        <p className={`text-3xl font-bold ${getStressColorByLevel(selectedAnalysis.stressLevel)}`}>
                                            {selectedAnalysis.stressLevel}%
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">Astronot Notu</p>
                                        <p className="text-lg text-white italic">"{selectedAnalysis.note}"</p>
                                    </div>
                                </div>
                            </div>

                            {/* AI Tavsiyesi */}
                            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-5 rounded-xl border border-purple-500/30">
                                <h4 className="text-lg font-bold text-purple-400 mb-3">Verilen AI Tavsiyesi</h4>
                                <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-line">
                                    {selectedAnalysis.fullAdvice}
                                </div>
                            </div>

                            {/* İyileşme Takibi */}
                            <div>
                                <h4 className="text-lg font-bold text-white mb-4">İyileşme Takibi ve Sonuçlar</h4>
                                
                                {/* 3. Gün */}
                                <div className="mb-4 bg-gray-800 p-4 rounded-xl border-l-4 border-blue-500">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="text-sm font-semibold text-blue-400">3. Gün Takibi</p>
                                            <p className="text-xs text-gray-500">Erken Aşama Değerlendirmesi</p>
                                        </div>
                                        <span className="text-2xl font-bold text-blue-400">
                                            +{selectedAnalysis.followUpData.day3.improvement}%
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-2">
                                        <span className="font-semibold text-white">Durum: </span>
                                        {selectedAnalysis.followUpData.day3.status}
                                    </p>
                                    <p className="text-sm text-gray-300">
                                        {selectedAnalysis.followUpData.day3.notes}
                                    </p>
                                </div>

                                {/* 7. Gün */}
                                <div className="mb-4 bg-gray-800 p-4 rounded-xl border-l-4 border-green-500">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="text-sm font-semibold text-green-400">7. Gün Takibi</p>
                                            <p className="text-xs text-gray-500">Orta Dönem Değerlendirmesi</p>
                                        </div>
                                        <span className="text-2xl font-bold text-green-400">
                                            +{selectedAnalysis.followUpData.day7.improvement}%
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-2">
                                        <span className="font-semibold text-white">Durum: </span>
                                        {selectedAnalysis.followUpData.day7.status}
                                    </p>
                                    <p className="text-sm text-gray-300">
                                        {selectedAnalysis.followUpData.day7.notes}
                                    </p>
                                </div>

                                {/* 14. Gün */}
                                <div className="bg-gray-800 p-4 rounded-xl border-l-4 border-purple-500">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="text-sm font-semibold text-purple-400">14. Gün Takibi</p>
                                            <p className="text-xs text-gray-500">Uzun Dönem Değerlendirmesi</p>
                                        </div>
                                        <span className="text-2xl font-bold text-purple-400">
                                            +{selectedAnalysis.followUpData.day14.improvement}%
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-2">
                                        <span className="font-semibold text-white">Durum: </span>
                                        {selectedAnalysis.followUpData.day14.status}
                                    </p>
                                    <p className="text-sm text-gray-300">
                                        {selectedAnalysis.followUpData.day14.notes}
                                    </p>
                                </div>
                            </div>

                            {/* İyileşme Grafiği */}
                            <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                                <h4 className="text-lg font-bold text-white mb-4">İyileşme Eğrisi</h4>
                                <div className="relative h-40">
                                    <svg viewBox="0 0 400 160" className="w-full h-full">
                                        {/* Grid çizgileri */}
                                        <line x1="50" y1="20" x2="50" y2="140" stroke="#4a5568" strokeWidth="2"/>
                                        <line x1="50" y1="140" x2="380" y2="140" stroke="#4a5568" strokeWidth="2"/>
                                        
                                        {/* Başlangıç seviyesi */}
                                        <line x1="50" y1="30" x2="380" y2="30" stroke="#ef4444" strokeWidth="1" strokeDasharray="5,5"/>
                                        <text x="10" y="35" fill="#ef4444" fontSize="12">{selectedAnalysis.stressLevel}%</text>
                                        
                                        {/* İyileşme çizgisi */}
                                        <polyline
                                            points={`50,${140 - selectedAnalysis.stressLevel} 140,${140 - (selectedAnalysis.stressLevel - selectedAnalysis.followUpData.day3.improvement)} 250,${140 - (selectedAnalysis.stressLevel - selectedAnalysis.followUpData.day7.improvement)} 360,${140 - (selectedAnalysis.stressLevel - selectedAnalysis.followUpData.day14.improvement)}`}
                                            fill="none"
                                            stroke="url(#gradient)"
                                            strokeWidth="3"
                                        />
                                        
                                        {/* Noktalar */}
                                        <circle cx="50" cy={140 - selectedAnalysis.stressLevel} r="5" fill="#ef4444"/>
                                        <circle cx="140" cy={140 - (selectedAnalysis.stressLevel - selectedAnalysis.followUpData.day3.improvement)} r="5" fill="#3b82f6"/>
                                        <circle cx="250" cy={140 - (selectedAnalysis.stressLevel - selectedAnalysis.followUpData.day7.improvement)} r="5" fill="#22c55e"/>
                                        <circle cx="360" cy={140 - (selectedAnalysis.stressLevel - selectedAnalysis.followUpData.day14.improvement)} r="5" fill="#a855f7"/>
                                        
                                        {/* Etiketler */}
                                        <text x="40" y="155" fill="#9ca3af" fontSize="11">Başlangıç</text>
                                        <text x="120" y="155" fill="#9ca3af" fontSize="11">3. Gün</text>
                                        <text x="230" y="155" fill="#9ca3af" fontSize="11">7. Gün</text>
                                        <text x="335" y="155" fill="#9ca3af" fontSize="11">14. Gün</text>
                                        
                                        {/* Gradient tanımı */}
                                        <defs>
                                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#ef4444"/>
                                                <stop offset="33%" stopColor="#3b82f6"/>
                                                <stop offset="66%" stopColor="#22c55e"/>
                                                <stop offset="100%" stopColor="#a855f7"/>
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </div>

                            {/* Sonuç Özeti */}
                            <div className="bg-gradient-to-r from-green-900/30 to-purple-900/30 p-5 rounded-xl border border-green-500/30">
                                <h4 className="text-lg font-bold text-white mb-3">Genel Sonuç</h4>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="text-5xl">✅</div>
                                    <div>
                                        <p className="text-xl font-bold text-green-400">{selectedAnalysis.benefit}</p>
                                        <p className="text-sm text-gray-400">14 günlük takip sonucu</p>
                                    </div>
                                </div>
                                <div className="bg-gray-900/50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-300">
                                        AI tavsiyelerinin düzenli uygulanması sonucunda astronotun mental sağlığında belirgin iyileşme gözlemlendi. 
                                        Önerilen rutinlerin devam ettirilmesi önerilir.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-gray-800 p-4 border-t border-gray-700">
                            <button 
                                onClick={() => setSelectedAnalysis(null)}
                                className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-lg font-bold transition"
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out;
                }
            `}</style>
        </div>
    );
};

export default StressAnalyzePage;