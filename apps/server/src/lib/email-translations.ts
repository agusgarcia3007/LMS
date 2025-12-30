type TenantWelcomeTranslations = {
  subject: string;
  title: string;
  greeting: string;
  accessMessage: string;
  button: string;
  footer: string;
};

type InvitationTranslations = {
  subject: string;
  title: string;
  greeting: string;
  setupMessage: string;
  button: string;
  linkExpiry: string;
  fallbackText: string;
  ignoreText: string;
};

type CertificateEmailTranslations = {
  subject: string;
  congratulations: string;
  completedCourse: string;
  issuedBy: string;
  readyMessage: string;
  downloadButton: string;
  verifyButton: string;
  shareMessage: string;
  footer: string;
};

type BuyerConfirmationTranslations = {
  subject: string;
  title: string;
  greeting: string;
  course: string;
  price: string;
  total: string;
  startButton: string;
  receiptButton: string;
  footer: string;
};

type OwnerSaleTranslations = {
  subject: string;
  title: string;
  greeting: string;
  customer: string;
  course: string;
  price: string;
  gross: string;
  platformFee: string;
  netEarnings: string;
  footer: string;
};

type RevenueCatWelcomeTranslations = {
  subject: string;
  title: string;
  greeting: string;
  purchaseMessage: string;
  button: string;
  linkExpiry: string;
  ignoreText: string;
  footer: string;
};

type ForgotPasswordTranslations = {
  subject: string;
  title: string;
  message: string;
  button: string;
  linkExpiry: string;
  ignoreText: string;
};

export type EmailTranslations = {
  tenantWelcome: TenantWelcomeTranslations;
  invitation: InvitationTranslations;
  certificateEmail: CertificateEmailTranslations;
  buyerConfirmation: BuyerConfirmationTranslations;
  ownerSale: OwnerSaleTranslations;
  revenueCatWelcome: RevenueCatWelcomeTranslations;
  forgotPassword: ForgotPasswordTranslations;
};

const translations: Record<string, EmailTranslations> = {
  en: {
    tenantWelcome: {
      subject: "Welcome to {tenantName}!",
      title: "Welcome to {tenantName}!",
      greeting: "Hi {userName}, your account has been created successfully.",
      accessMessage: "You now have access to all the courses and content available on our platform. Start exploring and learning today!",
      button: "Start Learning",
      footer: "This email was sent by {tenantName}.",
    },
    invitation: {
      subject: "You've been invited to {tenantName}",
      title: "Welcome to {tenantName}",
      greeting: "Hi {recipientName}, you've been invited by {inviterName}",
      setupMessage: "To get started, please set up your password by clicking the button below.",
      button: "Set Up Password",
      linkExpiry: "This link will expire in 1 hour.",
      fallbackText: "If the button doesn't work, copy this link:",
      ignoreText: "If you didn't expect this invitation, you can safely ignore this email.",
    },
    certificateEmail: {
      subject: "Congratulations! Your certificate is ready",
      congratulations: "Congratulations, {studentName}!",
      completedCourse: "You have successfully completed the course",
      issuedBy: "Issued by {tenantName}",
      readyMessage: "Your certificate is ready! You can download it or share the verification link with others.",
      downloadButton: "Download Certificate",
      verifyButton: "View Verification Page",
      shareMessage: "Share your achievement with others using this verification link:",
      footer: "This email was sent by {tenantName}",
    },
    buyerConfirmation: {
      subject: "Thank you for your purchase!",
      title: "Thank you for your purchase!",
      greeting: "Hi {buyerName}, your purchase from {tenantName} has been confirmed.",
      course: "Course",
      price: "Price",
      total: "Total",
      startButton: "Start Learning",
      receiptButton: "View Receipt",
      footer: "This email was sent by {tenantName}.",
    },
    ownerSale: {
      subject: "New sale on {tenantName}",
      title: "New Sale on {tenantName}",
      greeting: "Hi {ownerName}, you have a new sale!",
      customer: "Customer",
      course: "Course",
      price: "Price",
      gross: "Gross",
      platformFee: "Platform fee",
      netEarnings: "Net earnings",
      footer: "You received this email because you are the owner of {tenantName}.",
    },
    revenueCatWelcome: {
      subject: "Welcome to {tenantName}",
      title: "Welcome to {tenantName}!",
      greeting: "Hi {recipientName}, thanks for your purchase!",
      purchaseMessage: "Your account has been created and your course is ready. Set up your password to start learning.",
      button: "Set Up My Account",
      linkExpiry: "This link expires in 48 hours",
      ignoreText: "If you didn't make this purchase, please ignore this email",
      footer: "This email was sent by {tenantName}",
    },
    forgotPassword: {
      subject: "Reset your password",
      title: "Reset Your Password",
      message: "You requested to reset your password. Click the button below to set a new password.",
      button: "Reset Password",
      linkExpiry: "This link will expire in 1 hour.",
      ignoreText: "If you didn't request this, you can safely ignore this email.",
    },
  },
  es: {
    tenantWelcome: {
      subject: "Bienvenido a {tenantName}!",
      title: "Bienvenido a {tenantName}!",
      greeting: "Hola {userName}, tu cuenta ha sido creada exitosamente.",
      accessMessage: "Ahora tienes acceso a todos los cursos y contenido disponible en nuestra plataforma. Comienza a explorar y aprender hoy!",
      button: "Comenzar a Aprender",
      footer: "Este correo fue enviado por {tenantName}.",
    },
    invitation: {
      subject: "Has sido invitado a {tenantName}",
      title: "Bienvenido a {tenantName}",
      greeting: "Hola {recipientName}, has sido invitado por {inviterName}",
      setupMessage: "Para comenzar, configura tu contrasena haciendo clic en el boton de abajo.",
      button: "Configurar Contrasena",
      linkExpiry: "Este enlace expira en 1 hora.",
      fallbackText: "Si el boton no funciona, copia este enlace:",
      ignoreText: "Si no esperabas esta invitacion, puedes ignorar este correo.",
    },
    certificateEmail: {
      subject: "Felicitaciones! Tu certificado esta listo",
      congratulations: "Felicitaciones, {studentName}!",
      completedCourse: "Has completado exitosamente el curso",
      issuedBy: "Emitido por {tenantName}",
      readyMessage: "Tu certificado esta listo! Puedes descargarlo o compartir el enlace de verificacion con otros.",
      downloadButton: "Descargar Certificado",
      verifyButton: "Ver Pagina de Verificacion",
      shareMessage: "Comparte tu logro con otros usando este enlace de verificacion:",
      footer: "Este correo fue enviado por {tenantName}",
    },
    buyerConfirmation: {
      subject: "Gracias por tu compra!",
      title: "Gracias por tu compra!",
      greeting: "Hola {buyerName}, tu compra en {tenantName} ha sido confirmada.",
      course: "Curso",
      price: "Precio",
      total: "Total",
      startButton: "Comenzar a Aprender",
      receiptButton: "Ver Recibo",
      footer: "Este correo fue enviado por {tenantName}.",
    },
    ownerSale: {
      subject: "Nueva venta en {tenantName}",
      title: "Nueva Venta en {tenantName}",
      greeting: "Hola {ownerName}, tienes una nueva venta!",
      customer: "Cliente",
      course: "Curso",
      price: "Precio",
      gross: "Bruto",
      platformFee: "Comision de plataforma",
      netEarnings: "Ganancias netas",
      footer: "Recibiste este correo porque eres el propietario de {tenantName}.",
    },
    revenueCatWelcome: {
      subject: "Bienvenido a {tenantName}",
      title: "Bienvenido a {tenantName}!",
      greeting: "Hola {recipientName}, gracias por tu compra!",
      purchaseMessage: "Tu cuenta ha sido creada y tu curso esta listo. Configura tu contrasena para comenzar a aprender.",
      button: "Configurar Mi Cuenta",
      linkExpiry: "Este enlace expira en 48 horas",
      ignoreText: "Si no realizaste esta compra, ignora este correo",
      footer: "Este correo fue enviado por {tenantName}",
    },
    forgotPassword: {
      subject: "Restablecer tu contrasena",
      title: "Restablecer Tu Contrasena",
      message: "Solicitaste restablecer tu contrasena. Haz clic en el boton de abajo para establecer una nueva contrasena.",
      button: "Restablecer Contrasena",
      linkExpiry: "Este enlace expira en 1 hora.",
      ignoreText: "Si no solicitaste esto, puedes ignorar este correo.",
    },
  },
  pt: {
    tenantWelcome: {
      subject: "Bem-vindo a {tenantName}!",
      title: "Bem-vindo a {tenantName}!",
      greeting: "Ola {userName}, sua conta foi criada com sucesso.",
      accessMessage: "Agora voce tem acesso a todos os cursos e conteudos disponiveis em nossa plataforma. Comece a explorar e aprender hoje!",
      button: "Comecar a Aprender",
      footer: "Este email foi enviado por {tenantName}.",
    },
    invitation: {
      subject: "Voce foi convidado para {tenantName}",
      title: "Bem-vindo a {tenantName}",
      greeting: "Ola {recipientName}, voce foi convidado por {inviterName}",
      setupMessage: "Para comecar, configure sua senha clicando no botao abaixo.",
      button: "Configurar Senha",
      linkExpiry: "Este link expira em 1 hora.",
      fallbackText: "Se o botao nao funcionar, copie este link:",
      ignoreText: "Se voce nao esperava este convite, pode ignorar este email.",
    },
    certificateEmail: {
      subject: "Parabens! Seu certificado esta pronto",
      congratulations: "Parabens, {studentName}!",
      completedCourse: "Voce concluiu com sucesso o curso",
      issuedBy: "Emitido por {tenantName}",
      readyMessage: "Seu certificado esta pronto! Voce pode baixa-lo ou compartilhar o link de verificacao com outros.",
      downloadButton: "Baixar Certificado",
      verifyButton: "Ver Pagina de Verificacao",
      shareMessage: "Compartilhe sua conquista com outros usando este link de verificacao:",
      footer: "Este email foi enviado por {tenantName}",
    },
    buyerConfirmation: {
      subject: "Obrigado pela sua compra!",
      title: "Obrigado pela sua compra!",
      greeting: "Ola {buyerName}, sua compra em {tenantName} foi confirmada.",
      course: "Curso",
      price: "Preco",
      total: "Total",
      startButton: "Comecar a Aprender",
      receiptButton: "Ver Recibo",
      footer: "Este email foi enviado por {tenantName}.",
    },
    ownerSale: {
      subject: "Nova venda em {tenantName}",
      title: "Nova Venda em {tenantName}",
      greeting: "Ola {ownerName}, voce tem uma nova venda!",
      customer: "Cliente",
      course: "Curso",
      price: "Preco",
      gross: "Bruto",
      platformFee: "Taxa da plataforma",
      netEarnings: "Ganhos liquidos",
      footer: "Voce recebeu este email porque e o proprietario de {tenantName}.",
    },
    revenueCatWelcome: {
      subject: "Bem-vindo a {tenantName}",
      title: "Bem-vindo a {tenantName}!",
      greeting: "Ola {recipientName}, obrigado pela sua compra!",
      purchaseMessage: "Sua conta foi criada e seu curso esta pronto. Configure sua senha para comecar a aprender.",
      button: "Configurar Minha Conta",
      linkExpiry: "Este link expira em 48 horas",
      ignoreText: "Se voce nao fez esta compra, ignore este email",
      footer: "Este email foi enviado por {tenantName}",
    },
    forgotPassword: {
      subject: "Redefinir sua senha",
      title: "Redefinir Sua Senha",
      message: "Voce solicitou redefinir sua senha. Clique no botao abaixo para definir uma nova senha.",
      button: "Redefinir Senha",
      linkExpiry: "Este link expira em 1 hora.",
      ignoreText: "Se voce nao solicitou isso, pode ignorar este email.",
    },
  },
};

export function getEmailTranslations(locale?: string | null): EmailTranslations {
  return translations[locale || "en"] || translations.en;
}

export function interpolate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] || `{${key}}`);
}
