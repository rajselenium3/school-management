import apiClient from "../config/api.js";

class MasterDataService {
  // ====================
  // GRADE LEVEL APIs
  // ====================

  async getAllGradeLevels() {
    try {
      const response = await apiClient.get("/api/master-data/grade-levels");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch grade levels");
    }
  }

  async getGradeLevelByCode(gradeCode) {
    try {
      const response = await apiClient.get(`/api/master-data/grade-levels/${gradeCode}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch grade level");
    }
  }

  async createGradeLevel(gradeLevelData) {
    try {
      const response = await apiClient.post("/api/master-data/grade-levels", gradeLevelData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create grade level");
    }
  }

  async updateGradeLevel(id, gradeLevelData) {
    try {
      const response = await apiClient.put(`/api/master-data/grade-levels/${id}`, gradeLevelData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update grade level");
    }
  }

  async deleteGradeLevel(id) {
    try {
      await apiClient.delete(`/api/master-data/grade-levels/${id}`);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete grade level");
    }
  }

  // ====================
  // SECTION APIs
  // ====================

  async getAllSections() {
    try {
      const response = await apiClient.get("/api/master-data/sections");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch sections");
    }
  }

  async getSectionByCode(sectionCode) {
    try {
      const response = await apiClient.get(`/api/master-data/sections/${sectionCode}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch section");
    }
  }

  async createSection(sectionData) {
    try {
      const response = await apiClient.post("/api/master-data/sections", sectionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create section");
    }
  }

  async updateSection(id, sectionData) {
    try {
      const response = await apiClient.put(`/api/master-data/sections/${id}`, sectionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update section");
    }
  }

  async deleteSection(id) {
    try {
      await apiClient.delete(`/api/master-data/sections/${id}`);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete section");
    }
  }

  // ====================
  // DEPARTMENT APIs
  // ====================

  async getAllDepartments() {
    try {
      const response = await apiClient.get("/api/master-data/departments");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch departments");
    }
  }

  async getDepartmentByCode(departmentCode) {
    try {
      const response = await apiClient.get(`/api/master-data/departments/${departmentCode}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch department");
    }
  }

  async createDepartment(departmentData) {
    try {
      const response = await apiClient.post("/api/master-data/departments", departmentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create department");
    }
  }

  async updateDepartment(id, departmentData) {
    try {
      const response = await apiClient.put(`/api/master-data/departments/${id}`, departmentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update department");
    }
  }

  async deleteDepartment(id) {
    try {
      await apiClient.delete(`/api/master-data/departments/${id}`);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete department");
    }
  }

  // ====================
  // EMPLOYMENT TYPE APIs
  // ====================

  async getAllEmploymentTypes() {
    try {
      const response = await apiClient.get("/api/master-data/employment-types");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch employment types");
    }
  }

  async getEmploymentTypeByCode(typeCode) {
    try {
      const response = await apiClient.get(`/api/master-data/employment-types/${typeCode}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch employment type");
    }
  }

  async createEmploymentType(employmentTypeData) {
    try {
      const response = await apiClient.post("/api/master-data/employment-types", employmentTypeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create employment type");
    }
  }

  async updateEmploymentType(id, employmentTypeData) {
    try {
      const response = await apiClient.put(`/api/master-data/employment-types/${id}`, employmentTypeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update employment type");
    }
  }

  async deleteEmploymentType(id) {
    try {
      await apiClient.delete(`/api/master-data/employment-types/${id}`);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete employment type");
    }
  }

  // ====================
  // SEMESTER APIs
  // ====================

  async getAllSemesters() {
    try {
      const response = await apiClient.get("/api/master-data/semesters");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch semesters");
    }
  }

  async getSemesterByCode(semesterCode) {
    try {
      const response = await apiClient.get(`/api/master-data/semesters/${semesterCode}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch semester");
    }
  }

  async createSemester(semesterData) {
    try {
      const response = await apiClient.post("/api/master-data/semesters", semesterData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create semester");
    }
  }

  async updateSemester(id, semesterData) {
    try {
      const response = await apiClient.put(`/api/master-data/semesters/${id}`, semesterData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update semester");
    }
  }

  async deleteSemester(id) {
    try {
      await apiClient.delete(`/api/master-data/semesters/${id}`);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete semester");
    }
  }

  // ====================
  // INITIALIZATION APIs
  // ====================

  async initializeAllDefaults() {
    try {
      const response = await apiClient.post("/api/master-data/initialize-defaults");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to initialize defaults");
    }
  }

  async initializeDefaultGradeLevels() {
    try {
      const response = await apiClient.post("/api/master-data/grade-levels/initialize-defaults");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to initialize default grade levels");
    }
  }

  async initializeDefaultSections() {
    try {
      const response = await apiClient.post("/api/master-data/sections/initialize-defaults");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to initialize default sections");
    }
  }

  async initializeDefaultDepartments() {
    try {
      const response = await apiClient.post("/api/master-data/departments/initialize-defaults");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to initialize default departments");
    }
  }

  async initializeDefaultEmploymentTypes() {
    try {
      const response = await apiClient.post("/api/master-data/employment-types/initialize-defaults");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to initialize default employment types");
    }
  }

  async initializeDefaultSemesters() {
    try {
      const response = await apiClient.post("/api/master-data/semesters/initialize-defaults");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to initialize default semesters");
    }
  }

  // ====================
  // HELPER METHODS
  // ====================

  // Transform backend data to dropdown options
  transformToDropdownOptions(dataArray, valueField = 'id', labelField = 'name', codeField = null) {
    return dataArray.map(item => ({
      value: codeField ? item[codeField] : item[valueField],
      label: item[labelField],
      data: item
    }));
  }

  // Get grade level options for dropdowns
  async getGradeLevelOptions() {
    try {
      const gradeLevels = await this.getAllGradeLevels();
      return this.transformToDropdownOptions(gradeLevels, 'gradeCode', 'gradeName', 'gradeCode');
    } catch (error) {
      // Fallback to hardcoded values if API fails
      return [
        { value: "Pre-K", label: "Pre-K" },
        { value: "K", label: "K" },
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
        { value: "6", label: "6" },
        { value: "7", label: "7" },
        { value: "8", label: "8" },
        { value: "9", label: "9" },
        { value: "10", label: "10" },
        { value: "11", label: "11" },
        { value: "12", label: "12" }
      ];
    }
  }

  // Get section options for dropdowns
  async getSectionOptions() {
    try {
      const sections = await this.getAllSections();
      return this.transformToDropdownOptions(sections, 'sectionCode', 'sectionName', 'sectionCode');
    } catch (error) {
      // Fallback to hardcoded values if API fails
      return [
        { value: "A", label: "A" },
        { value: "B", label: "B" },
        { value: "C", label: "C" },
        { value: "D", label: "D" },
        { value: "E", label: "E" }
      ];
    }
  }

  // Get department options for dropdowns
  async getDepartmentOptions() {
    try {
      const departments = await this.getAllDepartments();
      return this.transformToDropdownOptions(departments, 'departmentCode', 'departmentName', 'departmentCode');
    } catch (error) {
      // Fallback to hardcoded values if API fails
      return [
        { value: "MATH", label: "Mathematics" },
        { value: "ENG", label: "English" },
        { value: "SCI", label: "Science" },
        { value: "SS", label: "Social Studies" },
        { value: "CS", label: "Computer Science" },
        { value: "PE", label: "Physical Education" },
        { value: "ART", label: "Arts" },
        { value: "LANG", label: "Languages" },
        { value: "LIB", label: "Library" },
        { value: "ADMIN", label: "Administration" }
      ];
    }
  }

  // Get employment type options for dropdowns
  async getEmploymentTypeOptions() {
    try {
      const employmentTypes = await this.getAllEmploymentTypes();
      return this.transformToDropdownOptions(employmentTypes, 'typeCode', 'typeName', 'typeCode');
    } catch (error) {
      // Fallback to hardcoded values if API fails
      return [
        { value: "FULL_TIME", label: "Full Time" },
        { value: "PART_TIME", label: "Part Time" },
        { value: "CONTRACT", label: "Contract" },
        { value: "SUBSTITUTE", label: "Substitute" },
        { value: "INTERN", label: "Intern" }
      ];
    }
  }

  // Get semester options for dropdowns
  async getSemesterOptions() {
    try {
      const semesters = await this.getAllSemesters();
      return this.transformToDropdownOptions(semesters, 'semesterCode', 'semesterName', 'semesterCode');
    } catch (error) {
      // Fallback to hardcoded values if API fails
      const currentYear = new Date().getFullYear();
      return [
        { value: `FALL${currentYear}`, label: `Fall ${currentYear}` },
        { value: `SPRING${currentYear + 1}`, label: `Spring ${currentYear + 1}` },
        { value: `SUMMER${currentYear + 1}`, label: `Summer ${currentYear + 1}` }
      ];
    }
  }
}

export default new MasterDataService();
