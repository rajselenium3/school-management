import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
  Badge,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Work as DepartmentIcon,
  Edit as EditIcon,
  Badge as EmploymentIcon,
  Grade as GradeIcon,
  People as Group,
  Save as SaveIcon,
  School as SchoolIcon,
  Group as SectionIcon,
  Schedule as SemesterIcon,
  Settings as SettingsIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState, useEffect } from 'react';

import DashboardLayout from '../../components/layout/DashboardLayout.js';
import idConfigurationService from '../../services/idConfigurationService.js';
import masterDataService from '../../services/masterDataService.js';
import accessCodeService from '../../services/accessCodeService.js';

const DataManagement = () => {
  // Tabs for all data management, including new ones
  const dataTabs = [
    { label: 'ID Configuration', icon: <Badge /> },
    { label: 'Grades', icon: <GradeIcon /> },
    { label: 'Sections', icon: <SectionIcon /> },
    { label: 'Departments', icon: <DepartmentIcon /> },
    { label: 'Employment Types', icon: <EmploymentIcon /> },
    { label: 'Semesters', icon: <SemesterIcon /> },
    { label: 'Assignment Types', icon: <AssignmentIcon /> },
    { label: 'Access Codes', icon: <SettingsIcon /> },
    { label: 'Parent-Child Mapping', icon: <Group /> },
  ];

  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setOpenDialog] = useState(false);
  const [dialog, setDialog] = useState({
    open: false,
    type: '',
    mode: 'add',
    data: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Data states
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [assignmentTypes, setAssignmentTypes] = useState([]);

  // New states for access codes and parent-child mapping
  const [accessCodes, setAccessCodes] = useState([]);
  const [parentChildMappings, setParentChildMappings] = useState([]);
  const [selectedAccessCode, setSelectedAccessCode] = useState(null);
  const [selectedMapping, setSelectedMapping] = useState(null);

  // ID Configuration states
  const [idConfigurations, setIdConfigurations] = useState([]);
  const [selectedIdConfig, setSelectedIdConfig] = useState(null);
  const [previewId, setPreviewId] = useState('');

  useEffect(() => {
    loadAllData();
    // eslint-disable-next-line
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadIdConfigurations(),
        loadGrades(),
        loadSections(),
        loadDepartments(),
        loadEmploymentTypes(),
        loadSemesters(),
        loadAssignmentTypes(),
        loadAccessCodes(),
        loadParentChildMappings(),
      ]);
    } catch (error) {
      setError(`Failed to load data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Configuration data loading functions - now using proper services
  const loadGrades = async () => {
    try {
      const gradeLevels = await masterDataService.getAllGradeLevels();
      const transformedGrades = gradeLevels.map((grade) => ({
        id: grade.id,
        name: grade.gradeName,
        description: grade.description || grade.gradeName,
        status: grade.active ? 'active' : 'inactive',
        students: 0, // This would come from student count API
      }));
      setGrades(transformedGrades);
    } catch (error) {
      console.error('Error loading grades:', error);
      // Fallback to hardcoded data
      setGrades([
        {
          id: 1,
          name: 'Grade 9',
          description: 'Ninth Grade',
          status: 'active',
          students: 0,
        },
        {
          id: 2,
          name: 'Grade 10',
          description: 'Tenth Grade',
          status: 'active',
          students: 0,
        },
        {
          id: 3,
          name: 'Grade 11',
          description: 'Eleventh Grade',
          status: 'active',
          students: 0,
        },
        {
          id: 4,
          name: 'Grade 12',
          description: 'Twelfth Grade',
          status: 'active',
          students: 0,
        },
      ]);
    }
  };

  const loadSections = async () => {
    try {
      const sectionsData = await masterDataService.getAllSections();
      const transformedSections = sectionsData.map((section) => ({
        id: section.id,
        name: section.sectionName,
        grade: 'Grade 10', // This would need to be mapped properly
        capacity: section.maxCapacity || 35,
        enrolled: section.currentEnrollment || 0,
        teacher: 'TBD',
      }));
      setSections(transformedSections);
    } catch (error) {
      console.error('Error loading sections:', error);
      // Fallback to hardcoded data
      setSections([
        {
          id: 1,
          name: 'Section A',
          grade: 'Grade 10',
          capacity: 35,
          enrolled: 0,
          teacher: 'TBD',
        },
        {
          id: 2,
          name: 'Section B',
          grade: 'Grade 10',
          capacity: 35,
          enrolled: 0,
          teacher: 'TBD',
        },
        {
          id: 3,
          name: 'Section A',
          grade: 'Grade 11',
          capacity: 35,
          enrolled: 0,
          teacher: 'TBD',
        },
      ]);
    }
  };

  const loadDepartments = async () => {
    try {
      const departmentsData = await masterDataService.getAllDepartments();
      const transformedDepartments = departmentsData.map((dept) => ({
        id: dept.id,
        name: dept.departmentName,
        head: dept.headOfDepartment || 'TBD',
        teachers: dept.currentTeachers || 0,
        subjects: 0, // This would come from subjects API
        status: dept.active ? 'active' : 'inactive',
      }));
      setDepartments(transformedDepartments);
    } catch (error) {
      console.error('Error loading departments:', error);
      // Fallback to hardcoded data
      setDepartments([
        {
          id: 1,
          name: 'Mathematics',
          head: 'TBD',
          teachers: 0,
          subjects: 0,
          status: 'active',
        },
        {
          id: 2,
          name: 'Science',
          head: 'TBD',
          teachers: 0,
          subjects: 0,
          status: 'active',
        },
        {
          id: 3,
          name: 'English',
          head: 'TBD',
          teachers: 0,
          subjects: 0,
          status: 'active',
        },
        {
          id: 4,
          name: 'Computer Science',
          head: 'TBD',
          teachers: 0,
          subjects: 0,
          status: 'active',
        },
      ]);
    }
  };

  const loadEmploymentTypes = async () => {
    try {
      const employmentTypesData =
        await masterDataService.getAllEmploymentTypes();
      const transformedTypes = employmentTypesData.map((type) => ({
        id: type.id,
        name: type.typeName,
        description: type.description,
        benefits: type.eligibleForBenefits || false,
        hours: type.maxHoursPerWeek || 'Variable',
      }));
      setEmploymentTypes(transformedTypes);
    } catch (error) {
      console.error('Error loading employment types:', error);
      // Fallback to hardcoded data
      setEmploymentTypes([
        {
          id: 1,
          name: 'Full-time Teacher',
          description: 'Regular full-time teaching position',
          benefits: true,
          hours: 40,
        },
        {
          id: 2,
          name: 'Part-time Teacher',
          description: 'Part-time teaching position',
          benefits: false,
          hours: 20,
        },
        {
          id: 3,
          name: 'Contract Teacher',
          description: 'Contract-based teaching position',
          benefits: false,
          hours: 'Variable',
        },
        {
          id: 4,
          name: 'Administrative Staff',
          description: 'Administrative and support staff',
          benefits: true,
          hours: 40,
        },
      ]);
    }
  };

  const loadSemesters = async () => {
    try {
      const semestersData = await masterDataService.getAllSemesters();
      const transformedSemesters = semestersData.map((semester) => ({
        id: semester.id,
        name: semester.semesterName,
        startDate: semester.startDate,
        endDate: semester.endDate,
        status: semester.isCurrentSemester
          ? 'active'
          : semester.isUpcoming
          ? 'upcoming'
          : 'completed',
      }));
      setSemesters(transformedSemesters);
    } catch (error) {
      console.error('Error loading semesters:', error);
      // Fallback to hardcoded data
      setSemesters([
        {
          id: 1,
          name: 'Fall 2024',
          startDate: '2024-08-15',
          endDate: '2024-12-20',
          status: 'completed',
        },
        {
          id: 2,
          name: 'Spring 2025',
          startDate: '2025-01-08',
          endDate: '2025-05-25',
          status: 'active',
        },
        {
          id: 3,
          name: 'Fall 2025',
          startDate: '2025-08-20',
          endDate: '2025-12-22',
          status: 'upcoming',
        },
      ]);
    }
  };

  const loadAssignmentTypes = async () => {
    setAssignmentTypes([
      {
        id: 1,
        name: 'Homework',
        description: 'Regular homework assignments',
        weight: 20,
        maxPoints: 100,
      },
      {
        id: 2,
        name: 'Quiz',
        description: 'Short quizzes and tests',
        weight: 25,
        maxPoints: 50,
      },
      {
        id: 3,
        name: 'Exam',
        description: 'Major examinations',
        weight: 40,
        maxPoints: 200,
      },
      {
        id: 4,
        name: 'Project',
        description: 'Long-term projects',
        weight: 15,
        maxPoints: 150,
      },
    ]);
  };

  const loadAccessCodes = async () => {
    try {
      const codes = await accessCodeService.getAllAccessCodes();
      setAccessCodes(codes);
    } catch (error) {
      console.error('Error loading access codes:', error);
      // Fallback to local storage
      try {
        const storedCodes = JSON.parse(
          localStorage.getItem('access_codes') || '[]'
        );
        setAccessCodes(storedCodes);
      } catch (localError) {
        console.error('Error loading from local storage:', localError);
        setAccessCodes([]);
      }
    }
  };

  // Add missing ID Configuration handler functions
  const handlePreviewId = async (config) => {
    try {
      const preview = await idConfigurationService.previewId(config.idType);
      setPreviewId(preview);
    } catch (error) {
      console.error('Error generating preview:', error);
      setError(`Failed to generate preview: ${error.message}`);
    }
  };

  const handleResetCounter = async (idType) => {
    if (
      !window.confirm(
        `Are you sure you want to reset the counter for ${idType}? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await idConfigurationService.resetCounter(idType);
      setSuccess(`Counter reset successfully for ${idType}`);
      await loadIdConfigurations();
    } catch (error) {
      console.error('Error resetting counter:', error);
      setError(`Failed to reset counter: ${error.message}`);
    }
  };

  const handleDeleteIdConfiguration = async (id) => {
    if (
      !window.confirm('Are you sure you want to delete this ID configuration?')
    ) {
      return;
    }

    try {
      await idConfigurationService.deleteConfiguration(id);
      setSuccess('ID configuration deleted successfully');
      await loadIdConfigurations();
    } catch (error) {
      console.error('Error deleting configuration:', error);
      setError(`Failed to delete configuration: ${error.message}`);
    }
  };

  const handleSaveIdConfiguration = async () => {
    if (!selectedIdConfig) return;

    try {
      setLoading(true);
      let savedConfig;

      if (selectedIdConfig.id) {
        // Update existing configuration
        savedConfig = await idConfigurationService.updateConfiguration(
          selectedIdConfig.id,
          selectedIdConfig
        );
      } else {
        // Create new configuration
        savedConfig = await idConfigurationService.createConfiguration(
          selectedIdConfig
        );
      }

      setSuccess('ID configuration saved successfully!');
      setSelectedIdConfig(null);
      setOpenDialog(false);
      await loadIdConfigurations();
    } catch (error) {
      console.error('Error saving ID configuration:', error);
      setError(`Failed to save ID configuration: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIdConfiguration = () => {
    const newConfig = {
      idType: 'STUDENT_ID',
      prefix: 'STU',
      length: 12,
      currentCounter: 0,
      separator: '-',
      includeYear: true,
      includeGradeSection: true,
      format: 'STU-{YEAR}-{GRADE}-{SECTION}-{COUNTER:4}',
      description: 'Student ID format',
      active: true,
    };
    setSelectedIdConfig(newConfig);
    setOpenDialog(true);
  };

  // Access Code Management Functions (keeping local storage for now)
  const generateAccessCode = (role) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${role.charAt(0).toUpperCase()}${code}`;
  };

  const handleAddAccessCode = () => {
    const newCode = {
      id: Date.now(),
      code: generateAccessCode('STU'),
      accessCode: generateAccessCode('STU'),
      role: 'STUDENT',
      codeType: 'STUDENT',
      isUsed: false,
      status: 'ACTIVE',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      usedBy: null,
    };
    setSelectedAccessCode(newCode);
    setOpenDialog(true);
  };

  const handleSaveAccessCode = () => {
    if (!selectedAccessCode) return;

    try {
      let updatedCodes;
      if (
        selectedAccessCode.id &&
        accessCodes.find((c) => c.id === selectedAccessCode.id)
      ) {
        updatedCodes = accessCodes.map((c) =>
          c.id === selectedAccessCode.id ? selectedAccessCode : c
        );
      } else {
        const newCode = { ...selectedAccessCode, id: Date.now() };
        updatedCodes = [...accessCodes, newCode];
      }

      setAccessCodes(updatedCodes);
      localStorage.setItem('access_codes', JSON.stringify(updatedCodes));
      setSuccess('Access code saved successfully!');
      setOpenDialog(false);
      setSelectedAccessCode(null);
    } catch (error) {
      setError(`Failed to save access code: ${error.message}`);
    }
  };

  const handleDeleteAccessCode = (id) => {
    try {
      const updatedCodes = accessCodes.filter((c) => c.id !== id);
      setAccessCodes(updatedCodes);
      localStorage.setItem('access_codes', JSON.stringify(updatedCodes));
      setSuccess('Access code deleted successfully!');
    } catch (error) {
      setError(`Failed to delete access code: ${error.message}`);
    }
  };

  // Parent-Child Mapping Functions (keeping local storage for now)
  const loadParentChildMappings = async () => {
    try {
      const storedMappings = JSON.parse(
        localStorage.getItem('parent_child_mappings') || '[]'
      );
      setParentChildMappings(storedMappings);
    } catch (error) {
      console.error('Error loading parent-child mappings:', error);
    }
  };

  const generateChildId = () => {
    const chars = '0123456789';
    let id = '';
    for (let i = 0; i < 8; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `CHD${id}`;
  };

  const handleAddParentChildMapping = () => {
    const newMapping = {
      id: Date.now(),
      childId: generateChildId(),
      childName: '',
      grade: '',
      section: '',
      parentEmail: '',
      parentName: '',
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    setSelectedMapping(newMapping);
    setOpenDialog(true);
  };

  const handleSaveParentChildMapping = () => {
    if (!selectedMapping) return;

    try {
      let updatedMappings;
      if (
        selectedMapping.id &&
        parentChildMappings.find((m) => m.id === selectedMapping.id)
      ) {
        updatedMappings = parentChildMappings.map((m) =>
          m.id === selectedMapping.id ? selectedMapping : m
        );
      } else {
        const newMapping = { ...selectedMapping, id: Date.now() };
        updatedMappings = [...parentChildMappings, newMapping];
      }

      setParentChildMappings(updatedMappings);
      localStorage.setItem(
        'parent_child_mappings',
        JSON.stringify(updatedMappings)
      );
      setSuccess('Parent-child mapping saved successfully!');
      setOpenDialog(false);
      setSelectedMapping(null);
    } catch (error) {
      setError(`Failed to save mapping: ${error.message}`);
    }
  };

  // ID Configuration Management Functions - now using proper service
  const loadIdConfigurations = async () => {
    try {
      const configs = await idConfigurationService.getAllConfigurations();
      setIdConfigurations(configs);
    } catch (error) {
      console.error('Error loading ID configurations:', error);
      try {
        // Try to initialize defaults if none exist
        await idConfigurationService.initializeDefaults();
        const configs = await idConfigurationService.getAllConfigurations();
        setIdConfigurations(configs);
      } catch (initError) {
        console.error('Error initializing ID configurations:', initError);
        // Set default configurations for display
        setIdConfigurations([
          {
            id: '1',
            idType: 'STUDENT_ID',
            format: 'STU-{YEAR}-{GRADE}-{SECTION}-{COUNTER:4}',
            currentCounter: 0,
            active: true,
            description: 'Student ID format',
          },
          {
            id: '2',
            idType: 'ADMISSION_NUMBER',
            format: 'ADM{YEAR}{COUNTER:5}',
            currentCounter: 0,
            active: true,
            description: 'Admission Number format',
          },
          {
            id: '3',
            idType: 'ROLL_NUMBER',
            format: '{COUNTER:3}',
            currentCounter: 0,
            active: true,
            description: 'Roll Number format',
          },
          {
            id: '4',
            idType: 'EMPLOYEE_ID',
            format: 'EMP{YEAR}{COUNTER:3}',
            currentCounter: 0,
            active: true,
            description: 'Employee ID format',
          },
        ]);
      }
    }
  };

  // Standard CRUD for other data - now using proper services
  const handleAdd = (type) => {
    setDialog({ open: true, type, mode: 'add', data: null });
    setOpenDialog(true);
  };

  const handleEdit = (type, item) => {
    setDialog({ open: true, type, mode: 'edit', data: item });
    setOpenDialog(true);
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      switch (type) {
        case 'grades':
          await masterDataService.deleteGradeLevel(id);
          await loadGrades();
          break;
        case 'sections':
          await masterDataService.deleteSection(id);
          await loadSections();
          break;
        case 'departments':
          await masterDataService.deleteDepartment(id);
          await loadDepartments();
          break;
        case 'employment':
          await masterDataService.deleteEmploymentType(id);
          await loadEmploymentTypes();
          break;
        case 'semesters':
          await masterDataService.deleteSemester(id);
          await loadSemesters();
          break;
        case 'assignments':
          // Assignment types would need their own service
          setAssignmentTypes((prev) => prev.filter((item) => item.id !== id));
          break;
        default:
          throw new Error('Invalid type');
      }
      setSuccess('Item deleted successfully!');
    } catch (error) {
      setError(`Failed to delete item: ${error.message}`);
    }
  };

  const handleSaveData = async (formData) => {
    try {
      setLoading(true);

      let savedItem;
      switch (dialog.type) {
        case 'grades':
          if (dialog.mode === 'add') {
            const gradeData = {
              gradeCode: formData.name.replace(/\s+/g, ''),
              gradeName: formData.name,
              description: formData.description,
              gradeLevel: parseInt(formData.name.replace(/\D/g, '')) || 1,
              minimumAge: 5,
              maximumAge: 18,
              displayOrder: 1,
              active: formData.status === 'active',
            };
            savedItem = await masterDataService.createGradeLevel(gradeData);
          } else {
            const gradeData = {
              gradeName: formData.name,
              description: formData.description,
              active: formData.status === 'active',
            };
            savedItem = await masterDataService.updateGradeLevel(
              dialog.data.id,
              gradeData
            );
          }
          await loadGrades();
          break;
        case 'sections':
          if (dialog.mode === 'add') {
            const sectionData = {
              sectionCode: formData.name.replace(/\s+/g, ''),
              sectionName: formData.name,
              maxCapacity: formData.capacity,
              currentEnrollment: 0,
              displayOrder: 1,
              active: true,
            };
            savedItem = await masterDataService.createSection(sectionData);
          } else {
            const sectionData = {
              sectionName: formData.name,
              maxCapacity: formData.capacity,
            };
            savedItem = await masterDataService.updateSection(
              dialog.data.id,
              sectionData
            );
          }
          await loadSections();
          break;
        case 'departments':
          if (dialog.mode === 'add') {
            const deptData = {
              departmentCode: formData.name.replace(/\s+/g, '').toUpperCase(),
              departmentName: formData.name,
              headOfDepartment: formData.head,
              maxTeachers: 20,
              currentTeachers: 0,
              displayOrder: 1,
              active: formData.status === 'active',
            };
            savedItem = await masterDataService.createDepartment(deptData);
          } else {
            const deptData = {
              departmentName: formData.name,
              headOfDepartment: formData.head,
              active: formData.status === 'active',
            };
            savedItem = await masterDataService.updateDepartment(
              dialog.data.id,
              deptData
            );
          }
          await loadDepartments();
          break;
        case 'employment':
          if (dialog.mode === 'add') {
            const empData = {
              typeCode: formData.name.replace(/\s+/g, '_').toUpperCase(),
              typeName: formData.name,
              description: formData.description,
              minHoursPerWeek: 1,
              maxHoursPerWeek:
                typeof formData.hours === 'number' ? formData.hours : 40,
              eligibleForBenefits: formData.benefits,
              requiresContract: false,
              displayOrder: 1,
              active: true,
            };
            savedItem = await masterDataService.createEmploymentType(empData);
          } else {
            const empData = {
              typeName: formData.name,
              description: formData.description,
              maxHoursPerWeek:
                typeof formData.hours === 'number' ? formData.hours : 40,
              eligibleForBenefits: formData.benefits,
            };
            savedItem = await masterDataService.updateEmploymentType(
              dialog.data.id,
              empData
            );
          }
          await loadEmploymentTypes();
          break;
        case 'semesters':
          if (dialog.mode === 'add') {
            const semesterData = {
              semesterCode: formData.name.replace(/\s+/g, '_').toUpperCase(),
              semesterName: formData.name,
              academicYear: new Date().getFullYear(),
              startDate: formData.startDate,
              endDate: formData.endDate,
              semesterType: 'REGULAR',
              isCurrentSemester: formData.status === 'active',
              displayOrder: 1,
              active: true,
            };
            savedItem = await masterDataService.createSemester(semesterData);
          } else {
            const semesterData = {
              semesterName: formData.name,
              startDate: formData.startDate,
              endDate: formData.endDate,
              isCurrentSemester: formData.status === 'active',
            };
            savedItem = await masterDataService.updateSemester(
              dialog.data.id,
              semesterData
            );
          }
          await loadSemesters();
          break;
        case 'assignments':
          // Assignment types would need their own service
          if (dialog.mode === 'add') {
            const newAssignment = { ...formData, id: Date.now() };
            setAssignmentTypes((prev) => [...prev, newAssignment]);
          } else {
            setAssignmentTypes((prev) =>
              prev.map((item) =>
                item.id === dialog.data.id
                  ? { ...formData, id: dialog.data.id }
                  : item
              )
            );
          }
          break;
        default:
          throw new Error('Invalid type');
      }

      setSuccess('Item saved successfully!');
      setDialog({ open: false, type: '', mode: 'add', data: null });
      setOpenDialog(false);
    } catch (error) {
      setError(`Failed to save item: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Renderers for each tab
  // ... (unchanged, see original code above for renderGradesTab, renderSectionsTab, etc.)

  // The rest of the component remains the same as in the original file
  // (renderers, dialog content, return, DataFormDialog, etc.)

  // --- Begin unchanged code from original file ---

  // Renderers for each tab
  const renderGradesTab = () => (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h6">Grade Levels Management</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleAdd('grades')}
          >
            Add Grade Level
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Grade Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Students Enrolled</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell>{grade.name}</TableCell>
                  <TableCell>{grade.description}</TableCell>
                  <TableCell>{grade.students}</TableCell>
                  <TableCell>
                    <Chip
                      label={grade.status}
                      color={grade.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleEdit('grades', grade)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete('grades', grade.id)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderSectionsTab = () => (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h6">Class Sections Management</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleAdd('sections')}
          >
            Add Section
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Section Name</TableCell>
                <TableCell>Grade Level</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Enrolled</TableCell>
                <TableCell>Class Teacher</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sections.map((section) => (
                <TableRow key={section.id}>
                  <TableCell>{section.name}</TableCell>
                  <TableCell>{section.grade}</TableCell>
                  <TableCell>{section.capacity}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {section.enrolled}
                      <Chip
                        label={`${Math.round(
                          (section.enrolled / section.capacity) * 100
                        )}%`}
                        size="small"
                        color={
                          section.enrolled >= section.capacity
                            ? 'error'
                            : section.enrolled > section.capacity * 0.8
                            ? 'warning'
                            : 'success'
                        }
                      />
                    </Box>
                  </TableCell>
                  <TableCell>{section.teacher}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleEdit('sections', section)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete('sections', section.id)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderDepartmentsTab = () => (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h6">Academic Departments</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleAdd('departments')}
          >
            Add Department
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Department Name</TableCell>
                <TableCell>Department Head</TableCell>
                <TableCell>Teachers</TableCell>
                <TableCell>Subjects</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell>{dept.name}</TableCell>
                  <TableCell>{dept.head}</TableCell>
                  <TableCell>{dept.teachers}</TableCell>
                  <TableCell>{dept.subjects}</TableCell>
                  <TableCell>
                    <Chip
                      label={dept.status}
                      color={dept.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleEdit('departments', dept)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete('departments', dept.id)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderEmploymentTab = () => (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h6">Employment Types</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleAdd('employment')}
          >
            Add Employment Type
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Hours/Week</TableCell>
                <TableCell>Benefits</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employmentTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>{type.name}</TableCell>
                  <TableCell>{type.description}</TableCell>
                  <TableCell>{type.hours}</TableCell>
                  <TableCell>
                    <Chip
                      label={type.benefits ? 'Yes' : 'No'}
                      color={type.benefits ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleEdit('employment', type)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete('employment', type.id)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderSemestersTab = () => (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h6">Academic Semesters</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleAdd('semesters')}
          >
            Add Semester
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Semester Name</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {semesters.map((semester) => (
                <TableRow key={semester.id}>
                  <TableCell>{semester.name}</TableCell>
                  <TableCell>{semester.startDate}</TableCell>
                  <TableCell>{semester.endDate}</TableCell>
                  <TableCell>
                    <Chip
                      label={semester.status}
                      color={
                        semester.status === 'active'
                          ? 'success'
                          : semester.status === 'upcoming'
                          ? 'info'
                          : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleEdit('semesters', semester)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete('semesters', semester.id)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderAssignmentTypesTab = () => (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h6">Assignment Types</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleAdd('assignments')}
          >
            Add Assignment Type
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Weight (%)</TableCell>
                <TableCell>Max Points</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignmentTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>{type.name}</TableCell>
                  <TableCell>{type.description}</TableCell>
                  <TableCell>{type.weight}%</TableCell>
                  <TableCell>{type.maxPoints}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleEdit('assignments', type)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete('assignments', type.id)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  // New: Access Codes Tab
  const renderAccessCodesTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Access Code Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddAccessCode}
          sx={{
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          }}
        >
          Generate New Code
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
              <TableCell>
                <strong>Code</strong>
              </TableCell>
              <TableCell>
                <strong>Role</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Valid Until</strong>
              </TableCell>
              <TableCell>
                <strong>Used By</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accessCodes.map((code) => (
              <TableRow key={code.id}>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}
                  >
                    {code.code || code.accessCode}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={code.role || code.codeType}
                    color={
                      (code.role || code.codeType) === 'STUDENT'
                        ? 'primary'
                        : (code.role || code.codeType) === 'TEACHER'
                        ? 'secondary'
                        : (code.role || code.codeType) === 'PARENT'
                        ? 'success'
                        : 'default'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={
                      code.isUsed || code.status === 'USED'
                        ? 'Used'
                        : 'Available'
                    }
                    color={
                      code.isUsed || code.status === 'USED'
                        ? 'default'
                        : 'success'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {code.validUntil
                    ? new Date(code.validUntil).toLocaleDateString()
                    : code.expiryDate
                    ? new Date(code.expiryDate).toLocaleDateString()
                    : 'N/A'}
                </TableCell>
                <TableCell>{code.usedBy || 'N/A'}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setSelectedAccessCode(code);
                      setOpenDialog(true);
                    }}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteAccessCode(code.id)}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // New: Parent-Child Mapping Tab
  const renderParentChildMappingTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Parent-Child Mapping</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddParentChildMapping}
          sx={{
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          }}
        >
          Add Child Record
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
              <TableCell>
                <strong>Child ID</strong>
              </TableCell>
              <TableCell>
                <strong>Child Name</strong>
              </TableCell>
              <TableCell>
                <strong>Grade</strong>
              </TableCell>
              <TableCell>
                <strong>Section</strong>
              </TableCell>
              <TableCell>
                <strong>Parent Name</strong>
              </TableCell>
              <TableCell>
                <strong>Parent Email</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parentChildMappings.map((mapping) => (
              <TableRow key={mapping.id}>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}
                  >
                    {mapping.childId}
                  </Typography>
                </TableCell>
                <TableCell>{mapping.childName}</TableCell>
                <TableCell>{mapping.grade}</TableCell>
                <TableCell>{mapping.section}</TableCell>
                <TableCell>{mapping.parentName}</TableCell>
                <TableCell>{mapping.parentEmail}</TableCell>
                <TableCell>
                  <Chip
                    label={mapping.isActive ? 'Active' : 'Inactive'}
                    color={mapping.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setSelectedMapping(mapping);
                      setOpenDialog(true);
                    }}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      if (
                        window.confirm(
                          'Are you sure you want to delete this mapping?'
                        )
                      ) {
                        setParentChildMappings(
                          parentChildMappings.filter((m) => m.id !== mapping.id)
                        );
                        localStorage.setItem(
                          'parent_child_mappings',
                          JSON.stringify(
                            parentChildMappings.filter(
                              (m) => m.id !== mapping.id
                            )
                          )
                        );
                        setSuccess('Mapping deleted successfully!');
                      }
                    }}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // ID Configuration Tab
  const renderIdConfigurationTab = () => (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h6">Auto-ID Generation Configuration</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddIdConfiguration}
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            }}
          >
            Add Configuration
          </Button>
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>Auto-ID Generation:</strong> Configure automatic ID generation
          for Student ID, Admission Number, Roll Number, and Employee ID. The
          system will automatically generate sequential IDs based on your format
          settings.
        </Alert>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                <TableCell>
                  <strong>ID Type</strong>
                </TableCell>
                <TableCell>
                  <strong>Format</strong>
                </TableCell>
                <TableCell>
                  <strong>Current Counter</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell>
                  <strong>Preview</strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {idConfigurations.map((config) => (
                <TableRow key={config.id}>
                  <TableCell>
                    <Chip
                      label={config.idType}
                      color={
                        config.idType === 'STUDENT_ID'
                          ? 'primary'
                          : config.idType === 'ADMISSION_NUMBER'
                          ? 'secondary'
                          : config.idType === 'ROLL_NUMBER'
                          ? 'success'
                          : config.idType === 'EMPLOYEE_ID'
                          ? 'warning'
                          : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'monospace',
                        backgroundColor: '#f5f5f5',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                      }}
                    >
                      {config.format}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1, display: 'block' }}
                    >
                      {config.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" color="primary">
                      {config.currentCounter}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={config.active ? 'Active' : 'Inactive'}
                      color={config.active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<ViewIcon />}
                        onClick={() => handlePreviewId(config)}
                      >
                        Preview
                      </Button>
                      {previewId && (
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'monospace',
                            color: 'primary.main',
                          }}
                        >
                          {previewId}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        onClick={() => {
                          setSelectedIdConfig(config);
                          setOpenDialog(true);
                        }}
                        size="small"
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleResetCounter(config.idType)}
                        size="small"
                        color="warning"
                        title="Reset Counter"
                      >
                        <RefreshIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteIdConfiguration(config.id)}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  // Main tab content renderer
  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return renderIdConfigurationTab();
      case 1:
        return renderGradesTab();
      case 2:
        return renderSectionsTab();
      case 3:
        return renderDepartmentsTab();
      case 4:
        return renderEmploymentTab();
      case 5:
        return renderSemestersTab();
      case 6:
        return renderAssignmentTypesTab();
      case 7:
        return renderAccessCodesTab();
      case 8:
        return renderParentChildMappingTab();
      default:
        return renderIdConfigurationTab();
    }
  };

  // Dialog content for ID configuration, access codes and parent-child mapping
  const renderDialogContent = () => {
    if (selectedIdConfig) {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>ID Type</InputLabel>
              <Select
                value={selectedIdConfig.idType}
                onChange={(e) =>
                  setSelectedIdConfig({
                    ...selectedIdConfig,
                    idType: e.target.value,
                  })
                }
              >
                <MenuItem value="STUDENT_ID">Student ID</MenuItem>
                <MenuItem value="ADMISSION_NUMBER">Admission Number</MenuItem>
                <MenuItem value="ROLL_NUMBER">Roll Number</MenuItem>
                <MenuItem value="EMPLOYEE_ID">Employee ID</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Prefix"
              value={selectedIdConfig.prefix || ''}
              onChange={(e) =>
                setSelectedIdConfig({
                  ...selectedIdConfig,
                  prefix: e.target.value.toUpperCase(),
                })
              }
              placeholder="e.g., STU, ADM, EMP"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Format Pattern"
              value={selectedIdConfig.format || ''}
              onChange={(e) =>
                setSelectedIdConfig({
                  ...selectedIdConfig,
                  format: e.target.value,
                })
              }
              placeholder="e.g., STU-{YEAR}-{GRADE}-{SECTION}-{COUNTER:4}"
              helperText="Use {YEAR}, {GRADE}, {SECTION}, {COUNTER:n} placeholders"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Total Length"
              type="number"
              value={selectedIdConfig.length || ''}
              onChange={(e) =>
                setSelectedIdConfig({
                  ...selectedIdConfig,
                  length: parseInt(e.target.value),
                })
              }
              inputProps={{ min: 3, max: 20 }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Current Counter"
              type="number"
              value={selectedIdConfig.currentCounter || 0}
              onChange={(e) =>
                setSelectedIdConfig({
                  ...selectedIdConfig,
                  currentCounter: parseInt(e.target.value),
                })
              }
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Separator"
              value={selectedIdConfig.separator || ''}
              onChange={(e) =>
                setSelectedIdConfig({
                  ...selectedIdConfig,
                  separator: e.target.value,
                })
              }
              placeholder="e.g., -, /, or leave empty"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={2}
              value={selectedIdConfig.description || ''}
              onChange={(e) =>
                setSelectedIdConfig({
                  ...selectedIdConfig,
                  description: e.target.value,
                })
              }
              placeholder="Human readable description of this ID format"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={selectedIdConfig.includeYear || false}
                  onChange={(e) =>
                    setSelectedIdConfig({
                      ...selectedIdConfig,
                      includeYear: e.target.checked,
                    })
                  }
                />
              }
              label="Include Year"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={selectedIdConfig.includeGradeSection || false}
                  onChange={(e) =>
                    setSelectedIdConfig({
                      ...selectedIdConfig,
                      includeGradeSection: e.target.checked,
                    })
                  }
                />
              }
              label="Include Grade/Section"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={selectedIdConfig.active !== false}
                  onChange={(e) =>
                    setSelectedIdConfig({
                      ...selectedIdConfig,
                      active: e.target.checked,
                    })
                  }
                />
              }
              label="Active"
            />
          </Grid>
        </Grid>
      );
    }

    if (selectedAccessCode) {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Access Code"
              value={selectedAccessCode.code || selectedAccessCode.accessCode}
              onChange={(e) =>
                setSelectedAccessCode({
                  ...selectedAccessCode,
                  code: e.target.value.toUpperCase(),
                  accessCode: e.target.value.toUpperCase(),
                })
              }
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={selectedAccessCode.role || selectedAccessCode.codeType}
                onChange={(e) =>
                  setSelectedAccessCode({
                    ...selectedAccessCode,
                    role: e.target.value,
                    codeType: e.target.value,
                  })
                }
              >
                <MenuItem value="STUDENT">Student</MenuItem>
                <MenuItem value="TEACHER">Teacher</MenuItem>
                <MenuItem value="PARENT">Parent</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Valid Until"
              type="date"
              value={
                selectedAccessCode.validUntil || selectedAccessCode.expiryDate
              }
              onChange={(e) =>
                setSelectedAccessCode({
                  ...selectedAccessCode,
                  validUntil: e.target.value,
                  expiryDate: e.target.value,
                })
              }
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={
                    !selectedAccessCode.isUsed &&
                    selectedAccessCode.status !== 'USED'
                  }
                  onChange={(e) =>
                    setSelectedAccessCode({
                      ...selectedAccessCode,
                      isUsed: !e.target.checked,
                      status: !e.target.checked ? 'USED' : 'ACTIVE',
                    })
                  }
                />
              }
              label="Available for Use"
            />
          </Grid>
        </Grid>
      );
    }

    if (selectedMapping) {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Child ID"
              value={selectedMapping.childId}
              onChange={(e) =>
                setSelectedMapping({
                  ...selectedMapping,
                  childId: e.target.value.toUpperCase(),
                })
              }
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Child Name"
              value={selectedMapping.childName}
              onChange={(e) =>
                setSelectedMapping({
                  ...selectedMapping,
                  childName: e.target.value,
                })
              }
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Grade</InputLabel>
              <Select
                value={selectedMapping.grade}
                onChange={(e) =>
                  setSelectedMapping({
                    ...selectedMapping,
                    grade: e.target.value,
                  })
                }
              >
                {grades.map((grade) => (
                  <MenuItem key={grade.id} value={grade.name}>
                    {grade.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Section</InputLabel>
              <Select
                value={selectedMapping.section}
                onChange={(e) =>
                  setSelectedMapping({
                    ...selectedMapping,
                    section: e.target.value,
                  })
                }
              >
                {sections.map((section) => (
                  <MenuItem key={section.id} value={section.name}>
                    {section.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={selectedMapping.isActive}
                  onChange={(e) =>
                    setSelectedMapping({
                      ...selectedMapping,
                      isActive: e.target.checked,
                    })
                  }
                />
              }
              label="Active"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Parent Name"
              value={selectedMapping.parentName}
              onChange={(e) =>
                setSelectedMapping({
                  ...selectedMapping,
                  parentName: e.target.value,
                })
              }
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Parent Email"
              type="email"
              value={selectedMapping.parentEmail}
              onChange={(e) =>
                setSelectedMapping({
                  ...selectedMapping,
                  parentEmail: e.target.value,
                })
              }
              required
            />
          </Grid>
        </Grid>
      );
    }

    // Fallback to standard data dialog
    return (
      <DataFormDialog
        open={dialog.open}
        type={dialog.type}
        mode={dialog.mode}
        data={dialog.data}
        onClose={() => {
          setDialog({ open: false, type: '', mode: 'add', data: null });
          setOpenDialog(false);
        }}
        onSave={handleSaveData}
      />
    );
  };

  // Dialog save handler
  const handleSave = () => {
    if (selectedIdConfig) {
      handleSaveIdConfiguration();
    } else if (selectedAccessCode) {
      handleSaveAccessCode();
    } else if (selectedMapping) {
      handleSaveParentChildMapping();
    }
  };

  // Dialog close handler
  const handleDialogClose = () => {
    setDialog({ open: false, type: '', mode: 'add', data: null });
    setSelectedIdConfig(null);
    setSelectedAccessCode(null);
    setSelectedMapping(null);
    setPreviewId('');
    setOpenDialog(false);
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}
          >
            📊 System Data Management
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Configure and manage core system data (Admin Only)
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            onClose={() => setSuccess('')}
          >
            {success}
          </Alert>
        )}

        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>Admin Only:</strong> This section is exclusively for system
          administrators to manage core data that affects the entire school
          system.
        </Alert>

        {/* Tabs */}
        <Card sx={{ mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={(e, newValue) => {
              setCurrentTab(newValue);
              setError('');
              setSuccess('');
            }}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
            variant="scrollable"
            scrollButtons="auto"
          >
            {dataTabs.map((tab, index) => (
              <Tab
                key={index}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {tab.icon}
                    {tab.label}
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Card>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Add/Edit Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {selectedIdConfig
              ? selectedIdConfig.id
                ? 'Edit ID Configuration'
                : 'Add ID Configuration'
              : selectedAccessCode
              ? selectedAccessCode.id
                ? 'Edit Access Code'
                : 'Add Access Code'
              : selectedMapping
              ? selectedMapping.id
                ? 'Edit Child Mapping'
                : 'Add Child Mapping'
              : `${dialog.mode === 'add' ? 'Add' : 'Edit'} ${dialog.type}`}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 1 }}>{renderDialogContent()}</Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} startIcon={<CancelIcon />}>
              Cancel
            </Button>
            {!selectedIdConfig &&
            !selectedAccessCode &&
            !selectedMapping ? null : (
              <Button
                variant="contained"
                onClick={handleSave}
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

// Standard data form dialog for CRUD
const DataFormDialog = ({ open, type, mode, data, onClose, onSave }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData(data || {});
    }
  }, [open, data]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderFormFields = () => {
    switch (type) {
      case 'grades':
        return (
          <>
            <TextField
              fullWidth
              label="Grade Name"
              value={formData.name || ''}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description || ''}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status || 'active'}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </>
        );
      case 'sections':
        return (
          <>
            <TextField
              fullWidth
              label="Section Name"
              value={formData.name || ''}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Grade Level"
              value={formData.grade || ''}
              onChange={(e) =>
                setFormData({ ...formData, grade: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Capacity"
              type="number"
              value={formData.capacity || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  capacity: Number.parseInt(e.target.value),
                })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Class Teacher"
              value={formData.teacher || ''}
              onChange={(e) =>
                setFormData({ ...formData, teacher: e.target.value })
              }
              sx={{ mb: 2 }}
            />
          </>
        );
      case 'departments':
        return (
          <>
            <TextField
              fullWidth
              label="Department Name"
              value={formData.name || ''}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Department Head"
              value={formData.head || ''}
              onChange={(e) =>
                setFormData({ ...formData, head: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status || 'active'}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </>
        );
      case 'employment':
        return (
          <>
            <TextField
              fullWidth
              label="Employment Type Name"
              value={formData.name || ''}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description || ''}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Hours per Week"
              value={formData.hours || ''}
              onChange={(e) =>
                setFormData({ ...formData, hours: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.benefits || false}
                  onChange={(e) =>
                    setFormData({ ...formData, benefits: e.target.checked })
                  }
                />
              }
              label="Includes Benefits"
              sx={{ mb: 2 }}
            />
          </>
        );
      case 'semesters':
        return (
          <>
            <TextField
              fullWidth
              label="Semester Name"
              value={formData.name || ''}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={formData.startDate || ''}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={formData.endDate || ''}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status || 'upcoming'}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <MenuItem value="upcoming">Upcoming</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </>
        );
      case 'assignments':
        return (
          <>
            <TextField
              fullWidth
              label="Assignment Type Name"
              value={formData.name || ''}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description || ''}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Weight (%)"
              type="number"
              value={formData.weight || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  weight: Number.parseInt(e.target.value),
                })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Maximum Points"
              type="number"
              value={formData.maxPoints || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maxPoints: Number.parseInt(e.target.value),
                })
              }
              sx={{ mb: 2 }}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === 'add' ? 'Add' : 'Edit'} {type}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>{renderFormFields()}</Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} startIcon={<CancelIcon />}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          startIcon={loading ? null : <SaveIcon />}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DataManagement;
