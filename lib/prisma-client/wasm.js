
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  password: 'password',
  role: 'role',
  school: 'school',
  isActive: 'isActive',
  lastActiveAt: 'lastActiveAt',
  reminderTime: 'reminderTime',
  notificationPrefs: 'notificationPrefs',
  classId: 'classId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  image: 'image',
  nis: 'nis',
  noAbsen: 'noAbsen',
  phone: 'phone',
  gender: 'gender',
  address: 'address',
  emailVerified: 'emailVerified',
  parentPin: 'parentPin',
  position: 'position',
  affiliations: 'affiliations',
  canEditMaterials: 'canEditMaterials',
  canEditAssignments: 'canEditAssignments'
};

exports.Prisma.UserNoteScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  authorId: 'authorId',
  content: 'content',
  type: 'type',
  createdAt: 'createdAt'
};

exports.Prisma.AttendanceScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  date: 'date',
  status: 'status',
  notes: 'notes',
  checkInTime: 'checkInTime',
  checkOutTime: 'checkOutTime',
  createdAt: 'createdAt'
};

exports.Prisma.ClassScalarFieldEnum = {
  id: 'id',
  name: 'name',
  school: 'school',
  gradeYear: 'gradeYear',
  createdAt: 'createdAt'
};

exports.Prisma.SubjectScalarFieldEnum = {
  id: 'id',
  name: 'name',
  color: 'color',
  icon: 'icon',
  description: 'description',
  teacherId: 'teacherId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TopicScalarFieldEnum = {
  id: 'id',
  name: 'name',
  order: 'order',
  description: 'description',
  estimatedHours: 'estimatedHours',
  isLocked: 'isLocked',
  materials: 'materials',
  subjectId: 'subjectId',
  createdAt: 'createdAt'
};

exports.Prisma.ProgressLogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  topicId: 'topicId',
  duration: 'duration',
  difficulty: 'difficulty',
  notes: 'notes',
  loggedAt: 'loggedAt'
};

exports.Prisma.UserSubjectScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  subjectId: 'subjectId',
  targetHours: 'targetHours'
};

exports.Prisma.ClassScheduleScalarFieldEnum = {
  id: 'id',
  classId: 'classId',
  subjectId: 'subjectId',
  teacherId: 'teacherId',
  dayOfWeek: 'dayOfWeek',
  startTime: 'startTime',
  endTime: 'endTime',
  room: 'room',
  createdAt: 'createdAt'
};

exports.Prisma.MaterialScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  subjectId: 'subjectId',
  teacherId: 'teacherId',
  classId: 'classId',
  attachments: 'attachments',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ExtracurricularScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  schedule: 'schedule',
  leaderId: 'leaderId',
  coachId: 'coachId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ExtracurricularMemberScalarFieldEnum = {
  id: 'id',
  studentId: 'studentId',
  extracurricularId: 'extracurricularId',
  joinedAt: 'joinedAt'
};

exports.Prisma.ExtracurricularSessionScalarFieldEnum = {
  id: 'id',
  extracurricularId: 'extracurricularId',
  date: 'date',
  time: 'time',
  room: 'room',
  material: 'material',
  createdAt: 'createdAt'
};

exports.Prisma.ExtracurricularAttendanceScalarFieldEnum = {
  id: 'id',
  sessionId: 'sessionId',
  studentId: 'studentId',
  status: 'status',
  notes: 'notes'
};

exports.Prisma.AssignmentScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  subjectId: 'subjectId',
  topicId: 'topicId',
  teacherId: 'teacherId',
  classId: 'classId',
  studentId: 'studentId',
  deadline: 'deadline',
  maxScore: 'maxScore',
  attachments: 'attachments',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AssignmentSubmissionScalarFieldEnum = {
  id: 'id',
  assignmentId: 'assignmentId',
  studentId: 'studentId',
  content: 'content',
  attachments: 'attachments',
  score: 'score',
  feedback: 'feedback',
  submittedAt: 'submittedAt',
  gradedAt: 'gradedAt'
};

exports.Prisma.CommentScalarFieldEnum = {
  id: 'id',
  content: 'content',
  authorId: 'authorId',
  assignmentId: 'assignmentId',
  submissionId: 'submissionId',
  createdAt: 'createdAt'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  title: 'title',
  message: 'message',
  read: 'read',
  announcementId: 'announcementId',
  createdAt: 'createdAt'
};

exports.Prisma.AnnouncementScalarFieldEnum = {
  id: 'id',
  title: 'title',
  message: 'message',
  type: 'type',
  createdAt: 'createdAt'
};

exports.Prisma.OperatorScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  scope: 'scope',
  school: 'school',
  createdAt: 'createdAt'
};

exports.Prisma.SettingsScalarFieldEnum = {
  id: 'id',
  appName: 'appName',
  school: 'school',
  timezone: 'timezone',
  maintenanceMode: 'maintenanceMode',
  disableRegistration: 'disableRegistration',
  loginMaintenance: 'loginMaintenance',
  supportEmail: 'supportEmail',
  backupEnabled: 'backupEnabled',
  securityLog: 'securityLog'
};

exports.Prisma.AccountScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  provider: 'provider',
  providerAccountId: 'providerAccountId',
  refresh_token: 'refresh_token',
  access_token: 'access_token',
  expires_at: 'expires_at',
  token_type: 'token_type',
  scope: 'scope',
  id_token: 'id_token',
  session_state: 'session_state'
};

exports.Prisma.SessionScalarFieldEnum = {
  id: 'id',
  sessionToken: 'sessionToken',
  userId: 'userId',
  expires: 'expires'
};

exports.Prisma.VerificationTokenScalarFieldEnum = {
  identifier: 'identifier',
  token: 'token',
  expires: 'expires'
};

exports.Prisma.PasswordResetTokenScalarFieldEnum = {
  id: 'id',
  email: 'email',
  token: 'token',
  expires: 'expires'
};

exports.Prisma.CalendarReminderScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  title: 'title',
  notes: 'notes',
  date: 'date',
  createdAt: 'createdAt'
};

exports.Prisma.DocumentScalarFieldEnum = {
  id: 'id',
  title: 'title',
  content: 'content',
  userId: 'userId',
  parentId: 'parentId',
  date: 'date',
  position: 'position',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DiscussionThreadScalarFieldEnum = {
  id: 'id',
  title: 'title',
  content: 'content',
  classId: 'classId',
  authorId: 'authorId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DiscussionReplyScalarFieldEnum = {
  id: 'id',
  content: 'content',
  threadId: 'threadId',
  authorId: 'authorId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.Role = exports.$Enums.Role = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  ADMIN: 'ADMIN',
  COACH: 'COACH',
  USER: 'USER',
  PARENT: 'PARENT'
};

exports.AttendanceStatus = exports.$Enums.AttendanceStatus = {
  PRESENT: 'PRESENT',
  SICK: 'SICK',
  PERMISSION: 'PERMISSION',
  ABSENT: 'ABSENT'
};

exports.AssignmentStatus = exports.$Enums.AssignmentStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  CLOSED: 'CLOSED'
};

exports.NotificationType = exports.$Enums.NotificationType = {
  ASSIGNMENT_NEW: 'ASSIGNMENT_NEW',
  ASSIGNMENT_DUE: 'ASSIGNMENT_DUE',
  ASSIGNMENT_GRADED: 'ASSIGNMENT_GRADED',
  STUDENT_LAGGING: 'STUDENT_LAGGING',
  SYSTEM: 'SYSTEM',
  ACHIEVEMENT: 'ACHIEVEMENT'
};

exports.Prisma.ModelName = {
  User: 'User',
  UserNote: 'UserNote',
  Attendance: 'Attendance',
  Class: 'Class',
  Subject: 'Subject',
  Topic: 'Topic',
  ProgressLog: 'ProgressLog',
  UserSubject: 'UserSubject',
  ClassSchedule: 'ClassSchedule',
  Material: 'Material',
  Extracurricular: 'Extracurricular',
  ExtracurricularMember: 'ExtracurricularMember',
  ExtracurricularSession: 'ExtracurricularSession',
  ExtracurricularAttendance: 'ExtracurricularAttendance',
  Assignment: 'Assignment',
  AssignmentSubmission: 'AssignmentSubmission',
  Comment: 'Comment',
  Notification: 'Notification',
  Announcement: 'Announcement',
  Operator: 'Operator',
  Settings: 'Settings',
  Account: 'Account',
  Session: 'Session',
  VerificationToken: 'VerificationToken',
  PasswordResetToken: 'PasswordResetToken',
  CalendarReminder: 'CalendarReminder',
  Document: 'Document',
  DiscussionThread: 'DiscussionThread',
  DiscussionReply: 'DiscussionReply'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
