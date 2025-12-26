import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "../../contexts/SettingsContext";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaUserPlus, FaSearch, FaEdit, FaTrash, FaEye, FaIdCard,
  FaKey, FaEnvelope, FaPhone, FaBuilding, FaVenusMars,
  FaRing, FaBriefcase, FaCalendarAlt, FaGraduationCap,
  FaDollarSign, FaMapMarkerAlt, FaShieldAlt, FaSync,
  FaTimes, FaCheck, FaUserTie, FaLock, FaUserCircle,
  FaLanguage, FaCopy, FaExclamationTriangle
} from "react-icons/fa";
import { IoMdPerson, IoIosBusiness } from "react-icons/io";
import { MdWork, MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const ManageEmployee = () => {
  const { darkMode, setDarkMode } = useSettings();
  const { user, token } = useAuth();

  // Language state
  const [language, setLanguage] = useState("en");

  // Amharic translations
  const translations = {
    en: {
      // Titles and Headers
      pageTitle: "Employee Management",
      pageDescription: "Manage employee accounts, roles, and information in your organization",
      addEmployee: "Add New Employee",
      editEmployee: "Edit Employee",
      employeeDetails: "Employee Details",
      employeeDirectory: "Employee Directory",
      
      // Stats
      totalEmployees: "Total Employees",
      activeEmployees: "Active",
      inactiveEmployees: "Inactive",
      departments: "Departments",
      
      // Form Sections
      personalInfo: "Personal Information",
      accountCredentials: "Account Credentials",
      employmentInfo: "Employment Information",
      
      // Form Labels
      firstName: "First Name",
      middleName: "Middle Name",
      lastName: "Last Name",
      email: "Email",
      phoneNumber: "Phone Number",
      dateOfBirth: "Date of Birth",
      employeeId: "Employee ID",
      password: "Password",
      role: "Role",
      department: "Department",
      sex: "Sex",
      maritalStatus: "Marital Status",
      positionType: "Position Type",
      employmentTerm: "Employment Term",
      employeeStatus: "Employee Status",
      profilePhoto: "Profile Photo",
      salary: "Salary",
      experience: "Experience",
      qualification: "Qualification",
      address: "Address",
      emergencyContact: "Emergency Contact",
      contactAddress: "Contact Address",
      
      // Options
      selectDepartment: "Select Department",
      selectSex: "Select Sex",
      selectMaritalStatus: "Marital Status",
      selectPositionType: "Type of Position",
      selectEmploymentTerm: "Term of Employment",
      selectStatus: "Employee Status",
      male: "Male",
      female: "Female",
      single: "Single",
      married: "Married",
      permanent: "Permanent",
      temporary: "Temporary",
      contract: "Contract",
      fullTime: "Full Time",
      partTime: "Part Time",
      active: "Active",
      inactive: "Inactive",
      
      // Roles
      employee: "Employee",
      departmentHead: "Department Head",
      administrator: "Administrator",
      
      // Buttons
      createAccount: "Create Account",
      updateEmployee: "Update Employee",
      resetPassword: "Reset Password",
      generateNew: "Generate New",
      show: "Show",
      hide: "Hide",
      close: "Close",
      save: "Save",
      cancel: "Cancel",
      view: "View",
      edit: "Edit",
      delete: "Delete",
      copy: "Copy",
      
      // Messages
      employeeCreated: "Employee created successfully!",
      employeeUpdated: "Employee updated successfully!",
      employeeDeleted: "Employee deleted successfully!",
      passwordReset: "Password reset successfully!",
      passwordRequirements: "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
      idRequirements: "Employee ID is unique and auto-generated",
      searchPlaceholder: "Search employees...",
      noEmployeesFound: "No employees found",
      addFirstEmployee: "Add your first employee",
      tryDifferentSearch: "Try a different search term",
      showing: "Showing",
      of: "of",
      employees: "employees",
      
      // Validation Messages
      phoneValidation: "Phone number must be exactly 10 digits",
      passwordValidation: "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
      idInUse: "Employee ID is already in use",
      nameValidation: "Only letters and spaces allowed",
      
      // Status
      processing: "Processing...",
      loading: "Loading...",
      
      // Tabs
      all: "All",
      activeTab: "Active",
      inactiveTab: "Inactive",
      
      // View Modal
      completeProfile: "Complete profile information",
      personalInformation: "Personal Information",
      employmentDetails: "Employment Details",
      qualifications: "Qualifications",
      contactInformation: "Contact Information",
      fullName: "Full Name",
      gender: "Gender",
      years: "years",
      birr: "Birr",
      n_a: "N/A",
      
      // Password Display
      passwordShown: "Password shown only during account creation",
      tellEmployeePassword: "Please tell the employee: Your password is",
      andIdIs: "and your ID is",
      saveCredentials: "SAVE THESE CREDENTIALS - You will not see them again!",
      copiedToClipboard: "Copied to clipboard!",
      passwordStrength: "Password Strength",
      strong: "Strong",
      medium: "Medium",
      weak: "Weak",
      passwordResetMessage: "New password has been generated. Please inform the employee",
      
      // Language
      language: "Language",
      english: "English",
      amharic: "Amharic",
      
      // Security Notes
      securityNote: "For security, passwords are only shown during creation/reset. Please save them securely.",
      defaultPasswordNote: "System generates secure passwords. Save them as they won't be shown again."
    },
    am: {
      // Titles and Headers
      pageTitle: "ሰራተኞችን ማስተዳደር",
      pageDescription: "በድርጅትዎ ውስጥ የሰራተኞች መለያዎችን፣ ሚናዎችን እና መረጃዎችን ያስተዳድሩ",
      addEmployee: "አዲስ ሰራተኛ ያክሉ",
      editEmployee: "ሰራተኛን ያርትዑ",
      employeeDetails: "የሰራተኛ ዝርዝሮች",
      employeeDirectory: "የሰራተኞች ዝርዝር",
      
      // Stats
      totalEmployees: "ጠቅላላ ሰራተኞች",
      activeEmployees: "ንቁ",
      inactiveEmployees: "ንቁ ያልሆኑ",
      departments: "ክፍሎች",
      
      // Form Sections
      personalInfo: "የግል መረጃ",
      accountCredentials: "የመለያ ማረጋገጫዎች",
      employmentInfo: "የሥራ መረጃ",
      
      // Form Labels
      firstName: "የመጀመሪያ ስም",
      middleName: "የአባት ስም",
      lastName: "የአያት ስም",
      email: "ኢሜይል",
      phoneNumber: "ስልክ ቁጥር",
      dateOfBirth: "የተወለዱበት ቀን",
      employeeId: "የሰራተኛ መታወቂያ",
      password: "የይለፍ ቃል",
      role: "ሚና",
      department: "ክፍል",
      sex: "ጾታ",
      maritalStatus: "የጋብቻ ሁኔታ",
      positionType: "የስራ አይነት",
      employmentTerm: "የስራ ጊዜ",
      employeeStatus: "የሰራተኛ ሁኔታ",
      profilePhoto: "የፕሮፋይል ፎቶ",
      salary: "ደሞዝ",
      experience: "ልምድ",
      qualification: "ብቃት",
      address: "አድራሻ",
      emergencyContact: "አደጋ አውጭ አድራሻ",
      contactAddress: "የተገናኝ አድራሻ",
      
      // Options
      selectDepartment: "ክፍል ይምረጡ",
      selectSex: "ጾታ ይምረጡ",
      selectMaritalStatus: "የጋብቻ ሁኔታ",
      selectPositionType: "የስራ አይነት",
      selectEmploymentTerm: "የስራ ጊዜ",
      selectStatus: "የሰራተኛ ሁኔታ",
      male: "ወንድ",
      female: "ሴት",
      single: "ነጻ",
      married: "ያገባ",
      permanent: "ቋሚ",
      temporary: "ጊዜያዊ",
      contract: "ኮንትራት",
      fullTime: "ሙሉ ጊዜ",
      partTime: "ከፊል ጊዜ",
      active: "ንቁ",
      inactive: "ንቁ ያልሆነ",
      
      // Roles
      employee: "ሰራተኛ",
      departmentHead: "የክፍል ሃላፊ",
      administrator: "አስተዳዳሪ",
      
      // Buttons
      createAccount: "መለያ ይፍጠሩ",
      updateEmployee: "ሰራተኛን ያዘምኑ",
      resetPassword: "የይለፍ ቃል ዳግም ያስጀምሩ",
      generateNew: "አዲስ ይፍጠሩ",
      show: "አሳይ",
      hide: "ደብቅ",
      close: "ዝጋ",
      save: "አስቀምጥ",
      cancel: "ሰርዝ",
      view: "አሳይ",
      edit: "አርትዕ",
      delete: "ሰርዝ",
      copy: "ኮፒ አድርግ",
      
      // Messages
      employeeCreated: "ሰራተኛ በተሳካ ሁኔታ ተፈጥሯል!",
      employeeUpdated: "ሰራተኛ በተሳካ ሁኔታ ተሻሽሏል!",
      employeeDeleted: "ሰራተኛ በተሳካ ሁኔታ ተሰርዟል!",
      passwordReset: "የይለፍ ቃል በተሳካ ሁኔታ ተቀይሯል!",
      passwordRequirements: "የይለፍ ቃል ቢያንስ 8 ፊደላት መሆን አለበት፣ ከዚህም በላይ አቢይ፣ ትንሽ፣ ቁጥር እና ልዩ ምልክት ሊኖሩት ይገባል",
      idRequirements: "የሰራተኛ መታወቂያ ልዩ እና በራስ-ሰር ይፈጠራል",
      searchPlaceholder: "ሰራተኞችን ይፈልጉ...",
      noEmployeesFound: "ምንም ሰራተኞች አልተገኙም",
      addFirstEmployee: "የመጀመሪያ ሰራተኛዎን ያክሉ",
      tryDifferentSearch: "የተለየ የፍለጋ ቃል ይሞክሩ",
      showing: "እያሳየ",
      of: "ከ",
      employees: "ሰራተኞች",
      
      // Validation Messages
      phoneValidation: "ስልክ ቁጥር በትክክል 10 አሃዝ መሆን አለበት",
      passwordValidation: "የይለፍ ቃል ቢያንስ 8 ፊደላት መሆን አለበት፣ ከዚህም በላይ አቢይ፣ ትንሽ፣ ቁጥር እና ልዩ ምልክት ሊኖሩት ይገባል",
      idInUse: "የሰራተኛ መታወቂያ አስቀድሞ በመጠቀም ላይ ነው",
      nameValidation: "ፊደላት እና ስፋቶች ብቻ ይፈቀዳሉ",
      
      // Status
      processing: "በማቀናበር ላይ...",
      loading: "በመጫን ላይ...",
      
      // Tabs
      all: "ሁሉም",
      activeTab: "ንቁ",
      inactiveTab: "ንቁ ያልሆኑ",
      
      // View Modal
      completeProfile: "ሙሉ የፕሮፋይል መረጃ",
      personalInformation: "የግል መረጃ",
      employmentDetails: "የሥራ ዝርዝሮች",
      qualifications: "ብቃቶች",
      contactInformation: "የተገናኝ መረጃ",
      fullName: "ሙሉ ስም",
      gender: "ጾታ",
      years: "ዓመታት",
      birr: "ብር",
      n_a: "የለም",
      
      // Password Display
      passwordShown: "የይለፍ ቃል በመለያ መፍጠር ጊዜ ብቻ ይታያል",
      tellEmployeePassword: "እባክዎ ለሰራተኛው ይንገሩ፡ የይለፍ ቃልዎ",
      andIdIs: "ነው እና መታወቂያዎ",
      saveCredentials: "እነዚህን ማረጋገጫዎች አስቀምጥ - እንደገና አያዩዋቸውም!",
      copiedToClipboard: "ወደ ክሊፕቦርድ ተገልብጧል!",
      passwordStrength: "የይለፍ ቃል ጥንካሬ",
      strong: "ጠንካራ",
      medium: "መካከለኛ",
      weak: "ደካማ",
      passwordResetMessage: "አዲስ የይለፍ ቃል ተፈጥሯል። እባክዎ ለሰራተኛው ያሳውቁ",
      
      // Language
      language: "ቋንቋ",
      english: "እንግሊዝኛ",
      amharic: "አማርኛ",
      
      // Security Notes
      securityNote: "ለደህንነት፣ የይለፍ ቃላት በመፍጠር/ለውጥ ጊዜ ብቻ ይታያሉ። እባክዎ በደህና ያስቀምጧቸው።",
      defaultPasswordNote: "ስርዓቱ ደህንነቱ የተጠበቀ የይለፍ ቃላትን ይፈጥራል። እንደገና ስለማይታዩ ያስቀምጧቸው።"
    }
  };

  const t = translations[language];

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    empId: "",
    password: "",
    department: "",
    sex: "",
    typeOfPosition: "",
    termOfEmployment: "",
    phoneNumber: "",
    contactPerson: "",
    contactPersonAddress: "",
    employeeStatus: "",
    salary: "",
    experience: "",
    qualification: "",
    dateOfBirth: "",
    address: "",
    maritalStatus: "",
    photo: null,
    role: "employee",
  });
  const [editingId, setEditingId] = useState(null);
  const [viewEmployee, setViewEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [generatedCredentials, setGeneratedCredentials] = useState({
    empId: "",
    password: "",
    showCredentials: false,
    isNewPassword: false
  });
  const [usedEmpIds, setUsedEmpIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    color: ""
  });

  // Password validation regex
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Check password strength
  const checkPasswordStrength = (password) => {
    if (!password) return { score: 0, label: t.weak, color: "bg-red-500" };
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[@$!%*?&]/.test(password)) score += 1;
    
    if (score >= 4) return { score: 3, label: t.strong, color: "bg-green-500" };
    if (score >= 3) return { score: 2, label: t.medium, color: "bg-yellow-500" };
    return { score: 1, label: t.weak, color: "bg-red-500" };
  };

  // Generate secure random password
  const generateSecurePassword = () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const special = "@$!%*?&";
    
    const allChars = lowercase + uppercase + numbers + special;
    
    // Ensure at least one of each required character type
    let password = [
      lowercase[Math.floor(Math.random() * lowercase.length)],
      uppercase[Math.floor(Math.random() * uppercase.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      special[Math.floor(Math.random() * special.length)]
    ];
    
    // Add random characters to reach minimum 8 characters
    for (let i = 4; i < 12; i++) {
      password.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }
    
    // Shuffle the password array
    password = password.sort(() => Math.random() - 0.5).join('');
    
    // Update password strength
    setPasswordStrength(checkPasswordStrength(password));
    
    return password;
  };

  // Generate unique Employee ID
  // Generate unique Employee ID
const generateUniqueEmpId = () => {
  let empId;
  let attempts = 0;
  const maxAttempts = 50;
  
  do {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    empId = `DTU${randomNum}`; // <-- CHANGED FROM "EMP" TO "DTU"
    attempts++;
    
    if (attempts >= maxAttempts) {
      const timestamp = Date.now().toString().slice(-4);
      empId = `DTU${timestamp}`; // <-- CHANGED FROM "EMP" TO "DTU"
    }
  } while (usedEmpIds.has(empId) && attempts < maxAttempts * 2);
  
  setUsedEmpIds(prev => new Set([...prev, empId]));
  return empId;
};

  // Copy to clipboard
  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  // persist dark mode
  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode");
    if (storedMode !== null) setDarkMode(storedMode === "true");
  }, [setDarkMode]);

  useEffect(() => localStorage.setItem("darkMode", darkMode), [darkMode]);

  // fetch departments
  const fetchDepartments = async () => {
    try {
      const res = await axiosInstance.get("/admin/departments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(res.data);
      if (!formData.department && res.data.length > 0)
        setFormData((prev) => ({ ...prev, department: res.data[0]._id }));
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  // fetch employees and track used IDs
  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
      
      // Extract all used Employee IDs only
      const empIds = new Set();
      res.data.forEach(emp => {
        if (emp.empId) empIds.add(emp.empId);
      });
      
      setUsedEmpIds(empIds);
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDepartments();
      fetchEmployees();
    }
  }, [token]);

  // Validate if Employee ID is unique
  const isEmpIdUnique = (id) => {
    if (!id) return true;
    
    const existingEmployees = employees.filter(emp => 
      editingId ? emp._id !== editingId : true
    );
    
    return !existingEmployees.some(emp => emp.empId === id);
  };

  // Validate password strength
  const isValidPassword = (password) => {
    return passwordRegex.test(password);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      const file = files[0];
      setFormData({ ...formData, photo: file });
      if (file) {
        const reader = new FileReader();
        reader.onload = () => setPhotoPreview(reader.result);
        reader.readAsDataURL(file);
      } else setPhotoPreview(null);
      return;
    }

    // Validation
    if (["firstName", "middleName", "lastName", "contactPerson"].includes(name)) {
      if (!/^[a-zA-Z\s]*$/.test(value)) return;
    }
    
    if (name === "phoneNumber" && !/^\d{0,10}$/.test(value)) return;
    
    if (["salary", "experience"].includes(name) && !/^\d*$/.test(value)) return;
    
    // Password validation
    if (name === "password") {
      setFormData({ ...formData, password: value });
      setPasswordStrength(checkPasswordStrength(value));
      return;
    }
    
    // Employee ID validation (check uniqueness if editing)
    if (name === "empId" && editingId) {
      if (!isEmpIdUnique(value)) {
        alert(`${t.idInUse}: "${value}"`);
        return;
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      empId: "",
      password: "",
      department: departments.length > 0 ? departments[0]._id : "",
      sex: "",
      typeOfPosition: "",
      termOfEmployment: "",
      phoneNumber: "",
      contactPerson: "",
      contactPersonAddress: "",
      employeeStatus: "",
      salary: "",
      experience: "",
      qualification: "",
      dateOfBirth: "",
      address: "",
      maritalStatus: "",
      photo: null,
      role: "employee",
    });
    setGeneratedCredentials({
      empId: "",
      password: "",
      showCredentials: false,
      isNewPassword: false
    });
    setPhotoPreview(null);
    setShowForm(false);
    setEditingId(null);
    setSuccessMessage("");
    setShowPassword(false);
    setPasswordStrength({ score: 0, label: t.weak, color: "bg-red-500" });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      setIsLoading(false);
      return alert(t.phoneValidation);
    }

    // For new employees, validate password meets requirements
    if (!editingId && !isValidPassword(formData.password)) {
      setIsLoading(false);
      return alert(t.passwordValidation);
    }

    // Check if Employee ID is unique
    if (!isEmpIdUnique(formData.empId)) {
      setIsLoading(false);
      return alert(`${t.idInUse}: "${formData.empId}"`);
    }

    // Prepare data for submission
    const submitData = { ...formData };

    if (!editingId) {
      // Ensure empId is set and unique
      if (!submitData.empId) {
        submitData.empId = generateUniqueEmpId();
      }
      // Ensure password meets requirements
      if (!submitData.password || !isValidPassword(submitData.password)) {
        submitData.password = generateSecurePassword();
      }
    } else {
      // For editing, don't send password unless it was changed
      if (!submitData.password || submitData.password === "") {
        delete submitData.password;
      }
    }

    try {
      const data = new FormData();
      Object.keys(submitData).forEach((key) => {
        if (key === "photo" && submitData.photo) data.append("photo", submitData.photo);
        else if (submitData[key] !== "" && submitData[key] !== null && submitData[key] !== undefined)
          data.append(key, submitData[key]);
      });

      const config = {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      };

      if (editingId) {
        await axiosInstance.put(`/employees/${editingId}`, data, config);
        setSuccessMessage(t.employeeUpdated);
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        await axiosInstance.post("/employees", data, config);
        
        // Update used IDs set
        setUsedEmpIds(prev => new Set([...prev, submitData.empId]));
        
        // Show credentials to user after successful creation
        const successMsg = `${t.employeeCreated} ${t.tellEmployeePassword}: ${submitData.password} ${t.andIdIs}: ${submitData.empId}`;
        setSuccessMessage(successMsg);
        setGeneratedCredentials({
          empId: submitData.empId,
          password: submitData.password,
          showCredentials: true,
          isNewPassword: true
        });
        
        // Show credentials for a while before closing form
        setTimeout(() => {
          setGeneratedCredentials(prev => ({ ...prev, showCredentials: false }));
        }, 10000);
      }

      fetchEmployees();
      if (!generatedCredentials.showCredentials) {
        resetForm();
      }
    } catch (err) {
      console.error("Error adding/updating employee:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to save employee.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (emp) => {
    setEditingId(emp._id);
    setShowForm(true);
    setFormData({
      firstName: emp.firstName || "",
      middleName: emp.middleName || "",
      lastName: emp.lastName || "",
      email: emp.email || "",
      empId: emp.empId || "",
      password: "", // Don't show password in edit mode
      department: emp.department?._id || (departments[0]?._id || ""),
      sex: emp.sex || "",
      typeOfPosition: emp.typeOfPosition || "",
      termOfEmployment: emp.termOfEmployment || "",
      phoneNumber: emp.phoneNumber || "",
      contactPerson: emp.contactPerson || "",
      contactPersonAddress: emp.contactPersonAddress || "",
      employeeStatus: emp.employeeStatus || "",
      salary: emp.salary || "",
      experience: emp.experience || "",
      qualification: emp.qualification || "",
      dateOfBirth: emp.dateOfBirth ? emp.dateOfBirth.split("T")[0] : "",
      address: emp.address || "",
      maritalStatus: emp.maritalStatus || "",
      photo: null,
      role: emp.role || "employee",
    });
    setGeneratedCredentials({
      empId: "",
      password: "",
      showCredentials: false,
      isNewPassword: false
    });
    setPhotoPreview(emp.photo ? `http://localhost:5000${emp.photo}` : null);
    setPasswordStrength({ score: 0, label: t.weak, color: "bg-red-500" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm(language === "en" 
      ? "Are you sure you want to delete this employee? This action cannot be undone." 
      : "እርግጠኛ ነዎት ይህን ሰራተኛ መሰረዝ ይፈልጋሉ? ይህ እርምጃ ሊቀለበስ አይችልም.")) return;
    try {
      setIsLoading(true);
      await axiosInstance.delete(`/employees/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchEmployees();
      setSuccessMessage(t.employeeDeleted);
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) { 
      console.error(err);
      alert(language === "en" ? "Failed to delete employee." : "ሰራተኛን ለማሰርዝ አልተሳካም።");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reset password
  const handleResetPassword = async () => {
    if (!editingId) {
      alert("No employee selected for password reset.");
      return;
    }
    
    const newPassword = generateSecurePassword();
    
    if (!window.confirm(language === "en"
      ? `Reset this employee's password to a new secure password?\n\nNew Password: ${newPassword}\n\nPlease save this password and inform the employee.`
      : `የዚህ ሰራተኛ የይለፍ ቃል ወደ አዲስ ደህንነቱ የተጠበቀ የይለፍ ቃል እንደገና ማስጀመር ይፈልጋሉ?\n\nአዲስ የይለፍ ቃል: ${newPassword}\n\nእባክዎ ይህንን የይለፍ ቃል ያስቀምጡ እና ለሰራተኛው ያሳውቁ።`)) return;
    
    try {
      setIsLoading(true);
      
      // Call the reset password endpoint
      const response = await axiosInstance.put(
        `/employees/reset-password/${editingId}`, 
        { newPassword }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Show credentials to admin
      const employee = employees.find(emp => emp._id === editingId);
      if (employee) {
        setGeneratedCredentials({
          empId: employee.empId,
          password: newPassword,
          showCredentials: true,
          isNewPassword: true
        });
        
        const resetMsg = language === "en"
          ? `Password reset successfully! New password: ${newPassword} - Please inform the employee.`
          : `የይለፍ ቃል በተሳካ ሁኔታ ተቀይሯል! አዲስ የይለፍ ቃል: ${newPassword} - እባክዎ ለሰራተኛው ያሳውቁ።`;
        
        setSuccessMessage(resetMsg);
        setTimeout(() => setSuccessMessage(""), 5000);
        
        // Hide credentials after 10 seconds
        setTimeout(() => {
          setGeneratedCredentials(prev => ({ ...prev, showCredentials: false }));
        }, 10000);
      }
      
      // Refresh employee list
      fetchEmployees();
      
    } catch (err) {
      console.error("Error resetting password:", err.response?.data || err);
      
      // Try alternative approach if the first one fails
      try {
        // Alternative: Update the employee directly with the new password
        const updateData = { password: newPassword };
        await axiosInstance.put(
          `/employees/${editingId}`, 
          updateData, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const employee = employees.find(emp => emp._id === editingId);
        if (employee) {
          setGeneratedCredentials({
            empId: employee.empId,
            password: newPassword,
            showCredentials: true,
            isNewPassword: true
          });
          
          const resetMsg = language === "en"
            ? `Password reset successfully! New password: ${newPassword} - Please inform the employee.`
            : `የይለፍ ቃል በተሳካ ሁኔታ ተቀይሯል! አዲስ የይለፍ ቃል: ${newPassword} - እባክዎ ለሰራተኛው ያሳውቁ።`;
          
          setSuccessMessage(resetMsg);
          setTimeout(() => setSuccessMessage(""), 5000);
          
          // Hide credentials after 10 seconds
          setTimeout(() => {
            setGeneratedCredentials(prev => ({ ...prev, showCredentials: false }));
          }, 10000);
        }
        
        fetchEmployees();
      } catch (secondErr) {
        console.error("Alternative password reset also failed:", secondErr);
        alert(language === "en" 
          ? "Failed to reset password. Please try again." 
          : "የይለፍ ቃልን ለመቀየር አልተሳካም። እባክዎ እንደገና ይሞክሩ።");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (emp) => setViewEmployee(emp);
  
  const handleAddNew = () => { 
    resetForm(); 
    setShowForm(true);
    
    // Auto-generate unique credentials for new employees
    setTimeout(() => {
      const empId = generateUniqueEmpId();
      const password = generateSecurePassword();
      setFormData(prev => ({ 
        ...prev, 
        empId: empId,
        password: password,
        department: departments.length > 0 ? departments[0]._id : "" 
      }));
      setGeneratedCredentials({
        empId: empId,
        password: password,
        showCredentials: true,
        isNewPassword: true
      });
      setPasswordStrength(checkPasswordStrength(password));
    }, 100);
  };

  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.firstName} ${emp.middleName} ${emp.lastName}`.toLowerCase();
    const term = searchTerm.toLowerCase();
    
    if (activeTab === "active") return (emp.employeeStatus === "Active" || !emp.employeeStatus) && 
      (emp.empId.toLowerCase().includes(term) || fullName.includes(term));
    if (activeTab === "inactive") return emp.employeeStatus === "Inactive" && 
      (emp.empId.toLowerCase().includes(term) || fullName.includes(term));
    
    return emp.empId.toLowerCase().includes(term) || fullName.includes(term);
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Inactive": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "departmenthead": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default: return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
    }
  };

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "am" : "en");
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-50"} min-h-screen p-4 md:p-6`}>
      {/* Success Message Toast */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
              <FaCheck />
              <span>{successMessage}</span>
              <button onClick={() => setSuccessMessage("")} className="ml-4">
                <FaTimes />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t.pageTitle}</h1>
              {/* Language Toggle Button */}
              <button
                onClick={toggleLanguage}
                className={`px-3 py-1 rounded-lg flex items-center space-x-2 ${
                  darkMode 
                    ? "bg-gray-700 hover:bg-gray-600" 
                    : "bg-gray-200 hover:bg-gray-300"
                } transition`}
                title={t.language}
              >
                <FaLanguage className={language === "am" ? "text-blue-500" : "text-gray-500"} />
                <span className="text-sm font-medium">
                  {language === "en" ? t.amharic : t.english}
                </span>
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {t.pageDescription}
            </p>
          </div>
          <button 
            onClick={handleAddNew} 
            className="mt-4 md:mt-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105"
          >
            <FaUserPlus />
            <span>{t.addEmployee}</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{t.totalEmployees}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{employees.length}</p>
              </div>
              <IoMdPerson className="text-3xl text-purple-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{t.activeEmployees}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {employees.filter(e => e.employeeStatus === "Active" || !e.employeeStatus).length}
                </p>
              </div>
              <FaCheck className="text-3xl text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{t.departments}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{departments.length}</p>
              </div>
              <IoIosBusiness className="text-3xl text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{t.inactiveEmployees}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {employees.filter(e => e.employeeStatus === "Inactive").length}
                </p>
              </div>
              <FaTimes className="text-3xl text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-xl border ${darkMode ? "border-gray-700" : "border-gray-200"} overflow-hidden`}>
            {/* Form Header */}
            <div className={`px-6 py-4 ${darkMode ? "bg-gray-900" : "bg-gradient-to-r from-purple-50 to-blue-50"} border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${editingId ? "bg-yellow-100 dark:bg-yellow-900" : "bg-purple-100 dark:bg-purple-900"}`}>
                    {editingId ? <FaEdit className="text-yellow-600 dark:text-yellow-400" /> : <FaUserPlus className="text-purple-600 dark:text-purple-400" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      {editingId ? t.editEmployee : t.addEmployee}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {editingId ? t.employeeUpdated.split("!")[0] + "!" : t.employeeCreated.split("!")[0] + "!"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  <FaTimes className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6">
              {/* Credentials Display for New Employees or Password Reset */}
              {generatedCredentials.showCredentials && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg border-2 border-yellow-200 dark:border-yellow-800"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <FaExclamationTriangle className="text-yellow-600 dark:text-yellow-400 text-2xl" />
                    <h4 className="font-bold text-gray-800 dark:text-white text-lg">
                      {t.saveCredentials}
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Employee ID Display */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t.employeeId}:
                        </p>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(generatedCredentials.empId, 'empId')}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition flex items-center space-x-1"
                        >
                          <FaCopy className="text-sm" />
                          <span className="text-xs">{t.copy}</span>
                        </button>
                      </div>
                      <div className="relative">
                        <p className="text-2xl font-mono font-bold text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 p-3 rounded-lg border border-gray-300 dark:border-gray-700">
                          {generatedCredentials.empId}
                        </p>
                        {copiedField === 'empId' && (
                          <span className="absolute -top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            {t.copiedToClipboard}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Password Display */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t.password}:
                        </p>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition"
                          >
                            {showPassword ? <FaEye /> : <FaLock />}
                          </button>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(generatedCredentials.password, 'password')}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition flex items-center space-x-1"
                          >
                            <FaCopy className="text-sm" />
                            <span className="text-xs">{t.copy}</span>
                          </button>
                        </div>
                      </div>
                      <div className="relative">
                        <p className="text-2xl font-mono font-bold text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 p-3 rounded-lg border border-gray-300 dark:border-gray-700">
                          {showPassword ? generatedCredentials.password : '••••••••••••'}
                        </p>
                        {copiedField === 'password' && (
                          <span className="absolute -top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            {t.copiedToClipboard}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Password Strength Indicator */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t.passwordStrength}: <span className={`font-bold ${passwordStrength.color.replace('bg-', 'text-')}`}>
                        {passwordStrength.label}
                      </span>
                    </p>
                    <div className="flex space-x-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`h-2 flex-1 rounded-full ${
                            level <= passwordStrength.score
                              ? passwordStrength.color
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      <FaExclamationTriangle className="inline mr-2" />
                      {generatedCredentials.isNewPassword
                        ? t.passwordResetMessage
                        : t.tellEmployeePassword}
                    </p>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Personal Information Section */}
                <div className="lg:col-span-3">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <IoMdPerson className="mr-2 text-purple-500" />
                    {t.personalInfo}
                  </h4>
                </div>

                {["firstName", "middleName", "lastName"].map((name, i) => (
                  <div key={i}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t[name]} {["firstName", "lastName"].includes(name) && "*"}
                    </label>
                    <input
                      type="text"
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      }`}
                      required={["firstName", "lastName"].includes(name)}
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MdEmail className="inline mr-1" />
                    {t.email} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MdPhone className="inline mr-1" />
                    {t.phoneNumber} *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    maxLength="10"
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                    required
                    placeholder={language === "en" ? "10-digit number" : "10-አሃዝ ቁጥር"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaCalendarAlt className="inline mr-1" />
                    {t.dateOfBirth}
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>

                {/* Credentials Section */}
                <div className="lg:col-span-3 mt-4">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <FaLock className="mr-2 text-blue-500" />
                    {t.accountCredentials}
                  </h4>
                </div>

                {/* Employee ID Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaIdCard className="inline mr-1" />
                    {t.employeeId} *
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      name="empId"
                      value={editingId ? formData.empId : generatedCredentials.empId || formData.empId}
                      onChange={handleChange}
                      className={`flex-1 px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : editingId
                          ? "bg-white border-gray-300"
                          : "bg-gray-50 border-gray-300"
                      } ${!isEmpIdUnique(formData.empId) && editingId ? "border-red-500" : ""}`}
                      readOnly={!editingId}
                      required
                    />
                    {!editingId && (
                      <button
                        type="button"
                        onClick={() => {
                          const newId = generateUniqueEmpId();
                          setFormData(prev => ({ ...prev, empId: newId }));
                          setGeneratedCredentials(prev => ({ ...prev, empId: newId }));
                        }}
                        className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition flex items-center"
                        title={t.generateNew}
                      >
                        <FaSync />
                      </button>
                    )}
                  </div>
                  {editingId && !isEmpIdUnique(formData.empId) && (
                    <p className="text-xs text-red-500 mt-1 flex items-center">
                      <FaTimes className="mr-1" /> {t.idInUse}
                    </p>
                  )}
                </div>

                {/* Password Field - Different behavior for new vs edit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaKey className="inline mr-1" />
                    {t.password} {!editingId && "*"}
                  </label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      {editingId ? (
                        // In edit mode, show placeholder without actual password
                        <>
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition pr-10 ${
                              darkMode
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          >
                            {showPassword ? <FaEye /> : <FaLock />}
                          </button>
                        </>
                      ) : (
                        // In create mode, show actual password field
                        <>
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition pr-10 ${
                              darkMode
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300"
                            } ${formData.password && !isValidPassword(formData.password) ? "border-red-500" : ""}`}
                            required
                            placeholder="Enter secure password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          >
                            {showPassword ? <FaEye /> : <FaLock />}
                          </button>
                        </>
                      )}
                    </div>
                    {!editingId && (
                      <button
                        type="button"
                        onClick={() => {
                          const newPwd = generateSecurePassword();
                          setFormData(prev => ({ ...prev, password: newPwd }));
                          setGeneratedCredentials(prev => ({ ...prev, password: newPwd }));
                        }}
                        className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition flex items-center"
                        title={t.generateNew}
                      >
                        <FaSync />
                      </button>
                    )}
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {t.passwordStrength}: <span className={`font-bold ${passwordStrength.color.replace('bg-', 'text-')}`}>
                            {passwordStrength.label}
                          </span>
                        </span>
                        <span className="text-xs text-gray-500">
                          {formData.password.length}/12
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        {[1, 2, 3].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full ${
                              level <= passwordStrength.score
                                ? passwordStrength.color
                                : "bg-gray-200 dark:bg-gray-700"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {!isValidPassword(formData.password) && formData.password.length > 0 && (
                          <span className="text-red-500 flex items-center">
                            <FaExclamationTriangle className="mr-1" /> {t.passwordValidation}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {editingId && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {language === "en" 
                        ? "Leave empty to keep current password. Enter new password to change."
                        : "ለመቀየር አዲስ የይለፍ ቃል ያስገቡ። ባዶ ለማስቀመጥ ቢያንስ ይተዉት።"}
                    </p>
                  )}
                </div>

                {/* Role Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaShieldAlt className="inline mr-1" />
                    {t.role} *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                    required
                  >
                    <option value="employee">{t.employee}</option>
                    <option value="departmenthead">{t.departmentHead}</option>
                    <option value="admin">{t.administrator}</option>
                  </select>
                </div>

                {/* Employment Information Section */}
                <div className="lg:col-span-3 mt-4">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <MdWork className="mr-2 text-green-500" />
                    {t.employmentInfo}
                  </h4>
                </div>

                {/* ... Rest of the form fields remain the same ... */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaBuilding className="inline mr-1" />
                    {t.department} *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                    required
                  >
                    <option value="">{t.selectDepartment}</option>
                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaVenusMars className="inline mr-1" />
                    {t.sex}
                  </label>
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <option value="">{t.selectSex}</option>
                    <option value="Male">{t.male}</option>
                    <option value="Female">{t.female}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaRing className="inline mr-1" />
                    {t.maritalStatus}
                  </label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <option value="">{t.selectMaritalStatus}</option>
                    <option value="Single">{t.single}</option>
                    <option value="Married">{t.married}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaBriefcase className="inline mr-1" />
                    {t.positionType}
                  </label>
                  <select
                    name="typeOfPosition"
                    value={formData.typeOfPosition}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <option value="">{t.selectPositionType}</option>
                    <option value="Permanent">{t.permanent}</option>
                    <option value="Temporary">{t.temporary}</option>
                    <option value="Contract">{t.contract}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t.employmentTerm}
                  </label>
                  <select
                    name="termOfEmployment"
                    value={formData.termOfEmployment}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <option value="">{t.selectEmploymentTerm}</option>
                    <option value="FullTime">{t.fullTime}</option>
                    <option value="PartTime">{t.partTime}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t.employeeStatus}
                  </label>
                  <select
                    name="employeeStatus"
                    value={formData.employeeStatus}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <option value="">{t.selectStatus}</option>
                    <option value="Active">{t.active}</option>
                    <option value="Inactive">{t.inactive}</option>
                  </select>
                </div>

                {/* Additional Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaDollarSign className="inline mr-1" />
                    {t.salary}
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                    placeholder={t.birr}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t.experience}
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                    placeholder={t.years}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaGraduationCap className="inline mr-1" />
                    {t.qualification}
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>

                <div className="lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaMapMarkerAlt className="inline mr-1" />
                    {t.address}
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="2"
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>

                {/* Emergency Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t.emergencyContact}
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t.contactAddress}
                  </label>
                  <textarea
                    name="contactPersonAddress"
                    value={formData.contactPersonAddress}
                    onChange={handleChange}
                    rows="2"
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>

                {/* Photo Upload */}
                <div className="lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t.profilePhoto}
                  </label>
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full border-4 border-purple-200 dark:border-purple-800 overflow-hidden">
                        {photoPreview ? (
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center">
                            <FaUserCircle className="text-5xl text-purple-300 dark:text-purple-700" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        name="photo"
                        onChange={handleChange}
                        accept="image/*"
                        className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300"
                        }`}
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {language === "en" 
                          ? "Upload a professional headshot (JPG, PNG, max 5MB)"
                          : "ሙያዊ የፊት ፎቶ ይስቀሉ (JPG, PNG, ከፍተኛ 5MB)"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-8 pt-6 border-t dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-0">
                  <p className="flex items-center">
                    <FaExclamationTriangle className="mr-2" /> {t.securityNote}
                  </p>
                  <p className="flex items-center mt-1">
                    <FaKey className="mr-2" /> {t.defaultPasswordNote}
                  </p>
                </div>
                <div className="flex space-x-3">
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleResetPassword}
                      className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow transition flex items-center space-x-2"
                    >
                      <FaKey />
                      <span>{t.resetPassword}</span>
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow transition flex items-center space-x-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>{t.processing}</span>
                      </>
                    ) : editingId ? (
                      <>
                        <FaEdit />
                        <span>{t.updateEmployee}</span>
                      </>
                    ) : (
                      <>
                        <FaUserPlus />
                        <span>{t.createAccount}</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-xl shadow transition"
                  >
                    {t.cancel}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {/* Main Content - Employee Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t.employeeDirectory}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t.showing} {filteredEmployees.length} {t.of} {employees.length} {t.employees}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
              {/* Status Tabs */}
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                {["all", "active", "inactive"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                      activeTab === tab
                        ? "bg-white dark:bg-gray-600 text-purple-600 dark:text-white shadow"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                    }`}
                  >
                    {tab === "all" ? t.all : tab === "active" ? t.activeTab : t.inactiveTab}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-64 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t.employee}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t.contactInformation}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t.department}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t.employeeStatus}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t.actions}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">{t.loading}</p>
                  </td>
                </tr>
              ) : filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr
                    key={emp._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-full object-cover border-2 border-purple-200 dark:border-purple-800"
                            src={
                              emp.photo
                                ? `http://localhost:5000${emp.photo}`
                                : "/fallback-avatar.png"
                            }
                            alt={emp.firstName}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {emp.firstName} {emp.middleName} {emp.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(emp.role)}`}>
                              {emp.role === "departmenthead" ? t.departmentHead : t[emp.role] || emp.role}
                            </span>
                          </div>
                          <div className="text-xs text-purple-600 dark:text-purple-400 font-mono">
                            <FaIdCard className="inline mr-1" /> {emp.empId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{emp.email}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <FaPhone className="inline mr-1" /> {emp.phoneNumber || t.n_a}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {emp.department?.name || t.n_a}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {emp.typeOfPosition || t.n_a}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(emp.employeeStatus)}`}>
                        {emp.employeeStatus ? t[emp.employeeStatus.toLowerCase()] || emp.employeeStatus : t.active}
                      </span>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {emp.maritalStatus || t.n_a}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(emp)}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition"
                          title={t.view}
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(emp)}
                          className="inline-flex items-center px-3 py-1.5 bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-800 transition"
                          title={t.edit}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(emp._id)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-800 transition"
                          title={t.delete}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      <FaUserCircle className="mx-auto h-12 w-12 mb-3 opacity-50" />
                      <p className="text-lg font-medium">{t.noEmployeesFound}</p>
                      <p className="text-sm">
                        {searchTerm ? t.tryDifferentSearch : t.addFirstEmployee}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal - This remains the same as before */}
      <AnimatePresence>
        {viewEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
            onClick={() => setViewEmployee(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${
                darkMode ? "bg-gray-900" : "bg-white"
              } rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={`px-6 py-4 ${darkMode ? "bg-gray-800" : "bg-gradient-to-r from-purple-50 to-blue-50"} border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                      <FaUserTie className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        {t.employeeDetails}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t.completeProfile}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewEmployee(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                  >
                    <FaTimes className="text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left Column - Profile */}
                  <div className="lg:w-1/3">
                    <div className="text-center">
                      <div className="relative inline-block">
                        <img
                          src={
                            viewEmployee.photo
                              ? `http://localhost:5000${viewEmployee.photo}`
                              : "/fallback-avatar.png"
                          }
                          alt="Employee"
                          className="w-48 h-48 rounded-full border-4 border-purple-200 dark:border-purple-800 object-cover mx-auto"
                        />
                        <div className="absolute bottom-4 right-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(viewEmployee.employeeStatus)}`}>
                            {viewEmployee.employeeStatus ? t[viewEmployee.employeeStatus.toLowerCase()] || viewEmployee.employeeStatus : t.active}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-4">
                        {viewEmployee.firstName} {viewEmployee.middleName} {viewEmployee.lastName}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2 justify-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(viewEmployee.role)}`}>
                          {viewEmployee.role === "departmenthead" ? t.departmentHead : t[viewEmployee.role] || viewEmployee.role}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          <FaIdCard className="mr-1" /> {viewEmployee.empId}
                        </span>
                      </div>
                    </div>

                    {/* Quick Info */}
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <FaEnvelope className="mr-3 text-purple-500" />
                        <span className="truncate">{viewEmployee.email}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <FaPhone className="mr-3 text-green-500" />
                        <span>{viewEmployee.phoneNumber || t.n_a}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <FaCalendarAlt className="mr-3 text-blue-500" />
                        <span>
                          {viewEmployee.dateOfBirth
                            ? new Date(viewEmployee.dateOfBirth).toLocaleDateString()
                            : t.n_a}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <FaBuilding className="mr-3 text-orange-500" />
                        <span>{viewEmployee.department?.name || t.n_a}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Details */}
                  <div className="lg:w-2/3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Personal Info */}
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white border-b pb-2">
                          {t.personalInformation}
                        </h4>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{t.fullName}</p>
                          <p className="font-medium">
                            {viewEmployee.firstName} {viewEmployee.middleName} {viewEmployee.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{t.gender}</p>
                          <p className="font-medium">{viewEmployee.sex || t.n_a}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{t.maritalStatus}</p>
                          <p className="font-medium">{viewEmployee.maritalStatus || t.n_a}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{t.dateOfBirth}</p>
                          <p className="font-medium">
                            {viewEmployee.dateOfBirth
                              ? new Date(viewEmployee.dateOfBirth).toLocaleDateString()
                              : t.n_a}
                          </p>
                        </div>
                      </div>

                      {/* Employment Info */}
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white border-b pb-2">
                          {t.employmentDetails}
                        </h4>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{t.employeeId}</p>
                          <p className="font-medium font-mono">{viewEmployee.empId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{t.positionType}</p>
                          <p className="font-medium">{viewEmployee.typeOfPosition || t.n_a}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{t.employmentTerm}</p>
                          <p className="font-medium">{viewEmployee.termOfEmployment || t.n_a}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{t.experience}</p>
                          <p className="font-medium">{viewEmployee.experience ? `${viewEmployee.experience} ${t.years}` : t.n_a}</p>
                        </div>
                      </div>

                      {/* Qualifications */}
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white border-b pb-2">
                          {t.qualifications}
                        </h4>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{t.qualification}</p>
                          <p className="font-medium">{viewEmployee.qualification || t.n_a}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{t.salary}</p>
                          <p className="font-medium">
                            {viewEmployee.salary ? `${viewEmployee.salary} ${t.birr}` : t.n_a}
                          </p>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white border-b pb-2">
                          {t.contactInformation}
                        </h4>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{t.address}</p>
                          <p className="font-medium">{viewEmployee.address || t.n_a}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{t.emergencyContact}</p>
                          <p className="font-medium">{viewEmployee.contactPerson || t.n_a}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{t.contactAddress}</p>
                          <p className="font-medium">{viewEmployee.contactPersonAddress || t.n_a}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Note about password security */}
                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center space-x-2">
                        <FaLock className="text-yellow-600 dark:text-yellow-400" />
                        <p className="text-sm text-yellow-800 dark:text-yellow-300">
                          {language === "en" 
                            ? "For security reasons, employee passwords are never displayed. The system generates secure passwords during account creation or reset. Admin must save and share credentials with employees."
                            : "ለደህንነት ምክንያቶች፣ የሰራተኛ የይለፍ ቃላት በጭራሽ አይታዩም። ስርዓቱ ደህንነቱ የተጠበቀ የይለፍ ቃላትን በመለያ መፍጠር ወይም ዳግም ሲሰጥ ይፈጥራል። አስተዳዳሪ ማረጋገጫዎቹን ማስቀመጥ እና ከሰራተኞች ጋር መጋራት አለበት።"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t dark:border-gray-700 flex justify-end">
                <button
                  onClick={() => setViewEmployee(null)}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition"
                >
                  {t.close}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageEmployee;