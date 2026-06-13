export interface Device {
  serial: string;
  type: 'emulator' | 'physical';
  model: string;
  androidVersion: number;
  xInstalled: boolean;
  handles: string[];
  used: number;
  cap: number;
  status: 'available' | 'unavailable';
  has2fa: boolean;
}

export interface OutlookRow {
  id: string;
  name: string;
  email: string;
  status: 'available' | 'unavailable' | 'running';
}

export interface Credential {
  id: string;
  name: string;
  handle: string | null;
  password: string;
  email: string;
  ipAddress: string;
  twoFaSecret: string | null;
  deviceId: string;
  createdAt: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'step' | 'done' | 'error' | 'info' | 'shot';
  deviceId: string;
}

export interface Screenshot {
  deviceId: string;
  label: string;
  timestamp: string;
}

export const devices: Device[] = [
  {
    serial: 'emulator-5554',
    type: 'emulator',
    model: 'Google sdk_gphone64_x86_64',
    androidVersion: 13,
    xInstalled: true,
    handles: ['@OliviaMartj6b'],
    used: 1,
    cap: 3,
    status: 'available',
    has2fa: true,
  },
  {
    serial: 'emulator-5556',
    type: 'emulator',
    model: 'Google sdk_gphone64_x86_64',
    androidVersion: 13,
    xInstalled: false,
    handles: [],
    used: 0,
    cap: 3,
    status: 'unavailable',
    has2fa: false,
  },
  {
    serial: '15cb1858',
    type: 'physical',
    model: 'Samsung Galaxy S23',
    androidVersion: 14,
    xInstalled: true,
    handles: ['@MaggieRod', '@SaraJohn', '@RobertWill'],
    used: 3,
    cap: 3,
    status: 'unavailable',
    has2fa: false,
  },
  {
    serial: '12374e74',
    type: 'physical',
    model: 'OnePlus 11',
    androidVersion: 13,
    xInstalled: true,
    handles: ['@LiziBrown', '@OmkarMill'],
    used: 2,
    cap: 3,
    status: 'available',
    has2fa: true,
  },
  {
    serial: '80ef4659',
    type: 'physical',
    model: 'Pixel 7 Pro',
    androidVersion: 14,
    xInstalled: true,
    handles: ['@AishaKhan', '@OmarSiddiq', '@FatimaH'],
    used: 3,
    cap: 3,
    status: 'available',
    has2fa: false,
  },
  {
    serial: '6f16a2d1',
    type: 'physical',
    model: 'Xiaomi 13T',
    androidVersion: 13,
    xInstalled: true,
    handles: ['@NoraMart'],
    used: 1,
    cap: 3,
    status: 'available',
    has2fa: true,
  },
  {
    serial: 'a9c04d77',
    type: 'physical',
    model: 'Samsung Galaxy A54',
    androidVersion: 13,
    xInstalled: false,
    handles: [],
    used: 0,
    cap: 3,
    status: 'available',
    has2fa: false,
  },
];

export const outlooks: OutlookRow[] = [
  { id: 'ol1', name: 'Sophia Harris', email: 'sophia.harris895698@outlook.com', status: 'available' },
  { id: 'ol2', name: 'James Wilson', email: 'james.wilson441232@outlook.com', status: 'available' },
  { id: 'ol3', name: 'Emma Davis', email: 'emma.davis778431@outlook.com', status: 'running' },
  { id: 'ol4', name: 'Liam Johnson', email: 'liam.johnson331847@outlook.com', status: 'available' },
  { id: 'ol5', name: 'Ava Martinez', email: 'ava.martinez992134@outlook.com', status: 'unavailable' },
  { id: 'ol6', name: 'Noah Brown', email: 'noah.brown554821@outlook.com', status: 'available' },
  { id: 'ol7', name: 'Isabella Taylor', email: 'isabella.taylor663921@outlook.com', status: 'available' },
  { id: 'ol8', name: 'Oliver Anderson', email: 'oliver.anderson228847@outlook.com', status: 'available' },
];

export const credentials: Credential[] = [
  { id: 'c1', name: 'Maggie Rodrigeuz', handle: null, password: 'Maggierodr!7Q', email: 'maggierodri963789123@outlook.com', ipAddress: '192.168.1.101', twoFaSecret: null, deviceId: '15cb1858', createdAt: '2026-06-03 09:00:00' },
  { id: 'c2', name: 'Sara Johnson', handle: null, password: 'Sarajohnso!7Q', email: 'sarajohnson123987123@outlook.com', ipAddress: '192.168.1.102', twoFaSecret: null, deviceId: '15cb1858', createdAt: '2026-06-03 15:55:31' },
  { id: 'c3', name: 'Robert Williams', handle: null, password: 'Roberwilli!7Q', email: 'roberwilliams963852123@outlook.com', ipAddress: '192.168.1.103', twoFaSecret: null, deviceId: '15cb1858', createdAt: '2026-06-03 16:09:34' },
  { id: 'c4', name: 'Lizi Brown', handle: '@LiziBrown', password: 'Lizibrown8!7Q', email: 'lizibrown852741123@outlook.com', ipAddress: '10.0.0.45', twoFaSecret: null, deviceId: '12374e74', createdAt: '2026-06-03 16:48:16' },
  { id: 'c5', name: 'Omkar Miller', handle: '@OmkarMiller', password: 'Omkarmille!7Q', email: 'omkarmiller741852123@outlook.com', ipAddress: '10.0.0.46', twoFaSecret: null, deviceId: '12374e74', createdAt: '2026-06-03 17:39:32' },
  { id: 'c6', name: 'Ahmad Rahman', handle: '@AhmadRahmaabgy', password: 'Ahmadrahma!7Q', email: 'ahmad.rahman959632@outlook.com', ipAddress: '172.16.0.22', twoFaSecret: null, deviceId: '80ef4659', createdAt: '2026-06-04 11:13:11' },
  { id: 'c7', name: 'Aisha Khan', handle: '@AishaKhansd3f', password: 'Aishakhan8!7Q', email: 'aisha.khan88647@outlook.com', ipAddress: '172.16.0.23', twoFaSecret: null, deviceId: '80ef4659', createdAt: '2026-06-04 11:48:46' },
  { id: 'c8', name: 'Omar Siddiqui', handle: '@OmarSiddiq8l7f', password: 'Omarsid951!7Q', email: 'omar.sid951359@outlook.com', ipAddress: '172.16.0.24', twoFaSecret: null, deviceId: '80ef4659', createdAt: '2026-06-04 11:53:34' },
  { id: 'c9', name: 'Fatima Hussain', handle: '@FatimaHussa3ex', password: 'Fatimah899!7Q', email: 'fatima.h8998254@outlook.com', ipAddress: '10.10.10.55', twoFaSecret: null, deviceId: '6f16a2d1', createdAt: '2026-06-04 17:33:01' },
  { id: 'c10', name: 'Nora Martinez', handle: '@NoraMartinez', password: 'Noramart77!8Q', email: 'nora.martinez441923@outlook.com', ipAddress: '192.168.2.10', twoFaSecret: 'JBSWY3DPEHPK3PXP', deviceId: 'emulator-5554', createdAt: '2026-06-05 08:14:22' },
  { id: 'c11', name: 'Olivia Martin', handle: '@OliviaMartj6b', password: 'Oliviama99!3Q', email: 'olivia.martin774821@outlook.com', ipAddress: '192.168.2.11', twoFaSecret: 'KV6Y6MCOXX35U6XH', deviceId: 'emulator-5554', createdAt: '2026-06-05 09:31:07' },
  { id: 'c12', name: 'Chen Wei', handle: '@ChenWei_x9', password: 'Chenwwei44!7Q', email: 'chen.wei991234@outlook.com', ipAddress: '10.0.0.47', twoFaSecret: null, deviceId: '12374e74', createdAt: '2026-06-05 10:02:55' },
  { id: 'c13', name: 'Priya Sharma', handle: '@PriyaShar8m', password: 'Priyasha11!6Q', email: 'priya.sharma882341@outlook.com', ipAddress: '10.10.10.56', twoFaSecret: 'MFZWIZLTMVZHG3DB', deviceId: '6f16a2d1', createdAt: '2026-06-05 11:47:33' },
  { id: 'c14', name: 'Carlos Rivera', handle: '@CarlosRiv3ra', password: 'Carlosriv!9Q', email: 'carlos.rivera334871@outlook.com', ipAddress: '172.16.0.25', twoFaSecret: null, deviceId: '80ef4659', createdAt: '2026-06-05 13:22:11' },
  { id: 'c15', name: 'Yuki Tanaka', handle: '@YukiTanaka_k', password: 'Yukitanak!5Q', email: 'yuki.tanaka558923@outlook.com', ipAddress: '10.0.0.48', twoFaSecret: null, deviceId: '12374e74', createdAt: '2026-06-06 07:55:48' },
  { id: 'c16', name: 'Maria Garcia', handle: '@MariaGarcia7q', password: 'Mariagar88!2Q', email: 'maria.garcia662341@outlook.com', ipAddress: '10.10.10.57', twoFaSecret: 'ORSXG5DJNVQXI2LB', deviceId: '6f16a2d1', createdAt: '2026-06-06 09:17:04' },
  { id: 'c17', name: 'James Lee', handle: '@JamesLee_auto', password: 'Jameslee77!4Q', email: 'james.lee441827@outlook.com', ipAddress: '172.16.0.26', twoFaSecret: null, deviceId: '80ef4659', createdAt: '2026-06-06 11:03:29' },
  { id: 'c18', name: 'Sophie Turner', handle: '@SophieTurner9', password: 'Sophietur!8Q', email: 'sophie.turner994213@outlook.com', ipAddress: '10.10.10.58', twoFaSecret: null, deviceId: '6f16a2d1', createdAt: '2026-06-07 08:42:17' },
  { id: 'c19', name: 'Raj Patel', handle: '@RajPatel_x3m', password: 'Rajpatel99!1Q', email: 'raj.patel771523@outlook.com', ipAddress: '192.168.2.12', twoFaSecret: 'GEZDGNBVGY3TQOJQ', deviceId: 'emulator-5554', createdAt: '2026-06-07 10:11:58' },
  { id: 'c20', name: 'Elena Kozlov', handle: '@ElenaKozlov_f', password: 'Elenakozl!6Q', email: 'elena.kozlov558471@outlook.com', ipAddress: '10.0.0.49', twoFaSecret: null, deviceId: '12374e74', createdAt: '2026-06-08 09:23:44' },
  { id: 'c21', name: 'Lucas Silva', handle: '@LucasSilva8x', password: 'Lucassilv!3Q', email: 'lucas.silva884321@outlook.com', ipAddress: '172.16.0.27', twoFaSecret: null, deviceId: '80ef4659', createdAt: '2026-06-08 14:05:12' },
  { id: 'c22', name: 'Amara Osei', handle: '@AmaraOsei_bot', password: 'Amaraosei!9Q', email: 'amara.osei441982@outlook.com', ipAddress: '10.10.10.59', twoFaSecret: 'NBSWY3DPEHPK5QXH', deviceId: '6f16a2d1', createdAt: '2026-06-09 07:31:05' },
];

export const initialLogs: LogEntry[] = [
  { id: 'l1', timestamp: '12:40:38', message: 'shot → /tmp/tw2fa_shots/021ac3e7/1780729838_09_qr_screen.png', type: 'shot', deviceId: '021ac3e7' },
  { id: 'l2', timestamp: '12:40:38', message: '--- step: reveal_secret ---', type: 'step', deviceId: '021ac3e7' },
  { id: 'l3', timestamp: '12:40:39', message: 'shot → /tmp/tw2fa_shots/021ac3e7/1780729838_before_reveal_secret.png', type: 'shot', deviceId: '021ac3e7' },
  { id: 'l4', timestamp: '12:40:52', message: 'blue link detected via pixel scan at y=1537', type: 'info', deviceId: '021ac3e7' },
  { id: 'l5', timestamp: '12:40:56', message: 'shot → /tmp/tw2fa_shots/021ac3e7/1780729855_10_secret_revealed.png', type: 'shot', deviceId: '021ac3e7' },
  { id: 'l6', timestamp: '12:40:58', message: 'captured secret (16 chars): KV6Y6MCOXX35U6XH', type: 'info', deviceId: '021ac3e7' },
  { id: 'l7', timestamp: '12:40:58', message: 'secret saved to audit CSV for @OliviaMartj6b', type: 'info', deviceId: '021ac3e7' },
  { id: 'l8', timestamp: '12:40:58', message: '--- step: tap_next_or_enter_code ---', type: 'step', deviceId: '021ac3e7' },
  { id: 'l9', timestamp: '12:40:58', message: 'shot → /tmp/tw2fa_shots/021ac3e7/1780729858_before_tap_next_or_enter_code.png', type: 'shot', deviceId: '021ac3e7' },
  { id: 'l10', timestamp: '12:40:59', message: 'tapping bottom Enter-code button at (540, 2121)', type: 'info', deviceId: '021ac3e7' },
  { id: 'l11', timestamp: '12:41:04', message: 'shot → /tmp/tw2fa_shots/021ac3e7/1780729864_11_code_entry_screen.png', type: 'shot', deviceId: '021ac3e7' },
  { id: 'l12', timestamp: '12:41:04', message: '--- step: enter_totp_code ---', type: 'step', deviceId: '021ac3e7' },
  { id: 'l13', timestamp: '12:41:04', message: 'shot → /tmp/tw2fa_shots/021ac3e7/1780729864_before_enter_totp_code.png', type: 'shot', deviceId: '021ac3e7' },
  { id: 'l14', timestamp: '12:41:04', message: 'generated TOTP: 691019', type: 'info', deviceId: '021ac3e7' },
  { id: 'l15', timestamp: '12:41:16', message: 'shot → /tmp/tw2fa_shots/021ac3e7/1780729875_12_code_typed.png', type: 'shot', deviceId: '021ac3e7' },
  { id: 'l16', timestamp: '12:41:27', message: 'no Confirm in dump — tapping observed coord (918, 1359)', type: 'info', deviceId: '021ac3e7' },
  { id: 'l17', timestamp: '12:41:34', message: 'shot → /tmp/tw2fa_shots/021ac3e7/1780729894_13_after_code.png', type: 'shot', deviceId: '021ac3e7' },
  { id: 'l18', timestamp: '12:41:34', message: '=== DONE — 2FA enabled for @OliviaMartj6b ===', type: 'done', deviceId: '021ac3e7' },
];

export const liveLogSequence: Omit<LogEntry, 'id'>[] = [
  { timestamp: '', message: '--- step: launch_outlook ---', type: 'step', deviceId: '80ef4659' },
  { timestamp: '', message: 'launching Outlook session on port 9845...', type: 'info', deviceId: '80ef4659' },
  { timestamp: '', message: 'shot → /tmp/tw2fa_shots/80ef4659/1780730001_01_outlook_launch.png', type: 'shot', deviceId: '80ef4659' },
  { timestamp: '', message: '--- step: sign_in_outlook ---', type: 'step', deviceId: '80ef4659' },
  { timestamp: '', message: 'entering credentials for amara.osei441982@outlook.com', type: 'info', deviceId: '80ef4659' },
  { timestamp: '', message: 'shot → /tmp/tw2fa_shots/80ef4659/1780730012_02_signin.png', type: 'shot', deviceId: '80ef4659' },
  { timestamp: '', message: 'sign-in successful. inbox loaded.', type: 'info', deviceId: '80ef4659' },
  { timestamp: '', message: '--- step: create_x_account ---', type: 'step', deviceId: '80ef4659' },
  { timestamp: '', message: 'navigating to x.com/signup', type: 'info', deviceId: '80ef4659' },
  { timestamp: '', message: 'shot → /tmp/tw2fa_shots/80ef4659/1780730025_03_signup.png', type: 'shot', deviceId: '80ef4659' },
  { timestamp: '', message: 'filling name: Amara Osei', type: 'info', deviceId: '80ef4659' },
  { timestamp: '', message: 'filling email: amara.osei441982@outlook.com', type: 'info', deviceId: '80ef4659' },
  { timestamp: '', message: 'tapping Next at (540, 1850)', type: 'info', deviceId: '80ef4659' },
  { timestamp: '', message: '--- step: verify_email ---', type: 'step', deviceId: '80ef4659' },
  { timestamp: '', message: 'shot → /tmp/tw2fa_shots/80ef4659/1780730041_04_verify.png', type: 'shot', deviceId: '80ef4659' },
  { timestamp: '', message: 'waiting for verification email...', type: 'info', deviceId: '80ef4659' },
  { timestamp: '', message: 'code extracted from inbox: 847291', type: 'info', deviceId: '80ef4659' },
  { timestamp: '', message: 'entering verification code: 847291', type: 'info', deviceId: '80ef4659' },
  { timestamp: '', message: '--- step: set_password ---', type: 'step', deviceId: '80ef4659' },
  { timestamp: '', message: 'password set: Amaraosei!9Q', type: 'info', deviceId: '80ef4659' },
  { timestamp: '', message: '--- step: enable_2fa ---', type: 'step', deviceId: '80ef4659' },
  { timestamp: '', message: 'shot → /tmp/tw2fa_shots/80ef4659/1780730098_05_2fa_setup.png', type: 'shot', deviceId: '80ef4659' },
  { timestamp: '', message: 'captured 2FA secret (16 chars): NBSWY3DPEHPK5QXH', type: 'info', deviceId: '80ef4659' },
  { timestamp: '', message: '=== DONE — account created @AmaraOsei_bot ===', type: 'done', deviceId: '80ef4659' },
];

export const sparklineData = [42, 58, 51, 67, 73, 61, 88, 79, 92, 85, 94, 87, 98, 91, 96];
