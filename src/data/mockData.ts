export const MOCK_DATA = {
  astronautName: "İclal A. (Görev Kodu: 321)",
  missionDay: 321,
  mentalScore: 58, 
  muscleScore: 88,
  
  stressTrend: [
      { time: '08:00', stressLevel: 55 },
      { time: '12:00', stressLevel: 62 },
      { time: '16:00', stressLevel: 85 }, 
      { time: '20:00', stressLevel: 70 },
      { time: '24:00', stressLevel: 65 },
  ],
  fatigueTrend: [
      { day: 'Pzt', activity: 90 },
      { day: 'Sal', activity: 85 },
      { day: 'Çar', activity: 60 },
      { day: 'Per', activity: 75 },
      { day: 'Cum', activity: 80 },
  ],
};

export const PHYSICAL_DETAIL_MOCK = {
    currentStatus: "High Asymmetry: Left Vastus Medialis (12.5% loss) | Right Vastus Lateralis (5.1% gain)",
    preExercisePhotoUrl: "https://placehold.co/150x250/34D399/1F2937?text=EXERCISE+PRE", 
    postExercisePhotoUrl: "https://placehold.co/150x250/EF4444/1F2937?text=EXERCISE+POST", 
    emgBefore: 65,
    emgAfter: 72, 
    recommendation: "EXERCISE CANCELED: High risk of increased muscle loss due to repeated asymmetry. Biomechanical intervention pending. Rest and nutrition protocol activated.",
    recommendationColor: "bg-red-700",
};