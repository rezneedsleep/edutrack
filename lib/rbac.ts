export const RBAC = {
  // Helper for case-insensitive check and robust string matching
  check: (role: string | undefined, allowedRoles: string[]) => {
    if (!role) return false;
    const normalizedRole = role.toUpperCase().replace(/[\s\-]/g, '_');
    return allowedRoles.includes(normalizedRole);
  },

  // 1. Super Admin Level (Absolute access)
  isSuperAdmin: (role?: string) => RBAC.check(role, ['SUPER_ADMIN']),
  
  // 2. Foundation / Management Level
  isYayasanLevel: (role?: string) => RBAC.check(role, ['SUPER_ADMIN', 'KETUA_YAYASAN', 'BENDAHARA_YAYASAN']),

  // 3. School Leadership Level
  isLeadershipLevel: (role?: string) => RBAC.check(role, ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'WAKASEK_KURIKULUM', 'WAKASEK_KESISWAAN', 'WAKASEK_HUBIN', 'ADMIN']),

  // 4. Admin / Operational Level (Equivalent to legacy 'ADMIN')
  isAdminLevel: (role?: string) => RBAC.check(role, ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'TATA_USAHA', 'ADMIN']),

  // 5. Finance Level
  isFinanceLevel: (role?: string) => RBAC.check(role, ['SUPER_ADMIN', 'BENDAHARA_YAYASAN', 'BENDAHARA_SEKOLAH', 'ADMIN']),

  // 6. Teacher / Academic Level (Equivalent to legacy 'TEACHER')
  isTeacherLevel: (role?: string) => RBAC.check(role, ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'WAKASEK_KURIKULUM', 'KAPROG', 'GURU_MAPEL', 'WALI_KELAS', 'GURU_BK', 'TEACHER', 'ADMIN']),

  // 7. Support Staff Level
  isSupportLevel: (role?: string) => RBAC.check(role, ['KEPALA_LAB', 'PUSTAKAWAN', 'PETUGAS_UKS', 'STAF_SARPRAS']),

  // 8. Student Level (Equivalent to legacy 'STUDENT')
  isStudentLevel: (role?: string) => RBAC.check(role, ['SISWA', 'STUDENT']),

  // 9. Parent Level (Equivalent to legacy 'PARENT')
  isParentLevel: (role?: string) => RBAC.check(role, ['ORANG_TUA', 'PARENT']),

  // 10. Alumni Level
  isAlumniLevel: (role?: string) => RBAC.check(role, ['ALUMNI']),
  
  // Legacy mappings for quick checks
  canAccessAdminDashboard: (role?: string) => RBAC.check(role, ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'WAKASEK_KURIKULUM', 'WAKASEK_KESISWAAN', 'WAKASEK_HUBIN', 'KAPROG', 'TATA_USAHA', 'BENDAHARA_YAYASAN', 'BENDAHARA_SEKOLAH', 'ADMIN']),
  
  canManageUsers: (role?: string) => RBAC.check(role, ['SUPER_ADMIN', 'TATA_USAHA', 'ADMIN']),
  
  canManageFinance: (role?: string) => RBAC.check(role, ['SUPER_ADMIN', 'KETUA_YAYASAN', 'BENDAHARA_YAYASAN', 'BENDAHARA_SEKOLAH', 'ADMIN']),
  
  canManageAcademics: (role?: string) => RBAC.check(role, ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'WAKASEK_KURIKULUM', 'KAPROG', 'TATA_USAHA', 'ADMIN'])
};
