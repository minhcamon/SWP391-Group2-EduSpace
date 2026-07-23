export const assignmentMockData = {
  title: "IELTS Writing Task 2",
  prompt: "Some people think that in the modern world we are more dependent on each other, while others think that people have become more independent. Discuss both views and give your own opinion.",
  timeRemaining: 45, // minutes
  
  partner: {
    name: "Nguyen Van A",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100",
    progress: 70,
    statusText: "Bạn học đã hoàn thành 70%",
    detail: "Nguyen is currently working on the conclusion paragraph. They have written approximately 180 words."
  },
  
  submission: {
    partnerName: "Nguyen Van A",
    partnerAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100",
    timeAgo: "10 phút trước",
    wordCount: 285,
    rubricCriteria: [
      { id: "task-response", name: "Task Response", score: 7.0, max: 9.0, percent: 77 },
      { id: "coherence-cohesion", name: "Coherence & Cohesion", score: 6.5, max: 9.0, percent: 72 },
      { id: "lexical-resource", name: "Lexical Resource", score: 7.5, max: 9.0, percent: 83 },
      { id: "grammatical-range", name: "Grammatical Range", score: 6.0, max: 9.0, percent: 66 }
    ],
    estimatedBand: 6.5,
    comments: [
      {
        id: 1,
        type: "Lexical Resource",
        text: "Good use of transition words like \"Furthermore\" and \"Conversely\".",
        category: "lexical"
      },
      {
        id: 2,
        type: "Grammar",
        text: '\"nature... mean\" -> should be \"nature... means\". Watch out for subject-verb agreement with singular subjects.',
        category: "grammar"
      }
    ]
  }
};
