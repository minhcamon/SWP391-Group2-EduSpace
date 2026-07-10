import api from "@/lib/axios";
import { mockMentorClasses, mockIncidents, mockArbitrations } from "@/modules/mentor/utils/mockData";

export const mentorService = {
  /**
   * Fetches the classes mentored by the current mentor.
   */
  getMentorClasses: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockMentorClasses);
      }, 200);
    });
  },

  /**
   * Fetches class detail by ID.
   */
  getClassById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundClass = mockMentorClasses.find((c) => c.id === id);
        if (foundClass) {
          resolve(foundClass);
        } else {
          reject(new Error("Không tìm thấy lớp học!"));
        }
      }, 200);
    });
  },

  /**
   * Simulates starting a new class/cohort.
   */
  startNewClass: async (classData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ isSuccess: true, message: "Đã tạo lớp học mới thành công!" });
      }, 300);
    });
  },

  /**
   * Fetches all incidents.
   */
  getIncidents: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockIncidents);
      }, 200);
    });
  },

  /**
   * Fetches incident by ID.
   */
  getIncidentById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const found = mockIncidents.find((i) => i.id === id);
        if (found) {
          resolve(found);
        } else {
          reject(new Error("Không tìm thấy sự cố!"));
        }
      }, 200);
    });
  },

  /**
   * Claims an incident.
   */
  claimIncident: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = mockIncidents.find((i) => i.id === id);
        if (found) {
          found.status = "IN_PROGRESS";
          found.assignedMentor = "Mentor Minh";
          if (!found.history.find(h => h.action.includes("tiếp nhận"))) {
            found.history.push({
              id: found.history.length + 1,
              action: "Mentor Minh tiếp nhận xử lý sự cố",
              time: "Vừa xong"
            });
          }
        }
        resolve({ isSuccess: true, message: "Nhận xử lý sự cố thành công!" });
      }, 200);
    });
  },

  /**
   * Resolves an incident.
   */
  resolveIncident: async (id, resolutionNote) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = mockIncidents.find((i) => i.id === id);
        if (found) {
          found.status = "RESOLVED";
          found.resolutionNote = resolutionNote;
          found.history.push({
            id: found.history.length + 1,
            action: "Sự cố đã được giải quyết",
            time: "Vừa xong"
          });
        }
        resolve({ isSuccess: true, message: "Đã giải quyết sự cố thành công!" });
      }, 200);
    });
  },

  /**
   * Fetches all arbitrations.
   */
  getArbitrations: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockArbitrations);
      }, 200);
    });
  },

  /**
   * Fetches arbitration by ID.
   */
  getArbitrationById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const found = mockArbitrations.find((a) => a.id === id);
        if (found) {
          resolve(found);
        } else {
          reject(new Error("Không tìm thấy đơn phân xử!"));
        }
      }, 200);
    });
  },

  /**
   * Submits final score for arbitration.
   */
  submitArbitrationGrade: async (id, finalScore, comment) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = mockArbitrations.find((a) => a.id === id);
        if (found) {
          found.status = "RESOLVED";
          found.finalScore = finalScore;
          found.comment = comment;
        }
        resolve({ isSuccess: true, message: "Đã chấm điểm phân xử thành công!" });
      }, 200);
    });
  },

  /**
   * Fetches pair details by ID.
   */
  getPairById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Find pair in classes
        let foundPair = null;
        let foundClass = null;
        for (const c of mockMentorClasses) {
          const p = c.pairs.find((p) => p.id === parseInt(id));
          if (p) {
            foundPair = p;
            foundClass = c;
            break;
          }
        }
        if (foundPair) {
          resolve({ ...foundPair, className: foundClass.cohortName });
        } else {
          reject(new Error("Không tìm thấy cặp học viên!"));
        }
      }, 200);
    });
  }
};

export default mentorService;
