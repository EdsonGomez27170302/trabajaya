-- PostgreSQL - TrabajaYa Ayacucho
-- Schema + Seed Data

CREATE TABLE IF NOT EXISTS users (
    id                              BIGSERIAL PRIMARY KEY,
    username                        VARCHAR(255) NOT NULL UNIQUE,
    email                           VARCHAR(255) NOT NULL UNIQUE,
    password_hash                   VARCHAR(255) NOT NULL,
    role                            VARCHAR(20)  NOT NULL,
    is_verified                     BOOLEAN      NOT NULL DEFAULT FALSE,
    is_active                       BOOLEAN      NOT NULL DEFAULT TRUE,
    verification_token              VARCHAR(255),
    verification_token_expires_at   TIMESTAMPTZ,
    created_at                      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at                      TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users (verification_token);

CREATE TABLE IF NOT EXISTS student_profiles (
    id                   BIGSERIAL PRIMARY KEY,
    user_id              BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    first_name           VARCHAR(255) NOT NULL DEFAULT '',
    last_name            VARCHAR(255) NOT NULL DEFAULT '',
    institutional_email  VARCHAR(255) UNIQUE,
    faculty              VARCHAR(255) NOT NULL DEFAULT '',
    career               VARCHAR(255) NOT NULL DEFAULT '',
    semester             INTEGER      NOT NULL DEFAULT 0,
    phone                VARCHAR(50)  NOT NULL DEFAULT '',
    bio                  TEXT         NOT NULL DEFAULT '',
    cv_url               VARCHAR(500) NOT NULL DEFAULT '',
    availability         JSONB        NOT NULL DEFAULT '{}'::jsonb,
    zone                 VARCHAR(255) NOT NULL DEFAULT '',
    profile_photo        VARCHAR(500) NOT NULL DEFAULT '',
    is_available         BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS company_profiles (
    id            BIGSERIAL PRIMARY KEY,
    user_id       BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    company_name  VARCHAR(255) NOT NULL DEFAULT '',
    ruc           VARCHAR(50)  NOT NULL DEFAULT '',
    sector        VARCHAR(255) NOT NULL DEFAULT '',
    description   TEXT         NOT NULL DEFAULT '',
    address       VARCHAR(500) NOT NULL DEFAULT '',
    zone          VARCHAR(255) NOT NULL DEFAULT '',
    phone         VARCHAR(50)  NOT NULL DEFAULT '',
    website       VARCHAR(255) NOT NULL DEFAULT '',
    logo_url      VARCHAR(500) NOT NULL DEFAULT '',
    is_verified   BOOLEAN      NOT NULL DEFAULT FALSE,
    plan          VARCHAR(20)  NOT NULL DEFAULT 'free'
);

CREATE TABLE IF NOT EXISTS jobs (
    id              BIGSERIAL PRIMARY KEY,
    company_id      BIGINT NOT NULL REFERENCES company_profiles(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    description     TEXT         NOT NULL DEFAULT '',
    requirements    TEXT         NOT NULL DEFAULT '',
    category        VARCHAR(255) NOT NULL DEFAULT '',
    modality        VARCHAR(20)  NOT NULL DEFAULT 'presencial',
    zone            VARCHAR(255) NOT NULL DEFAULT '',
    salary          NUMERIC(10,2) NOT NULL DEFAULT 0,
    salary_type     VARCHAR(20)  NOT NULL DEFAULT 'por_hora',
    hours_per_week  INTEGER      NOT NULL DEFAULT 0,
    schedule        JSONB        NOT NULL DEFAULT '{}'::jsonb,
    vacancies       INTEGER      NOT NULL DEFAULT 1,
    status          VARCHAR(20)  NOT NULL DEFAULT 'active',
    is_featured     BOOLEAN      NOT NULL DEFAULT FALSE,
    views_count     INTEGER      NOT NULL DEFAULT 0,
    expires_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs (company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs (category);
CREATE INDEX IF NOT EXISTS idx_jobs_zone ON jobs (zone);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs (status);
CREATE INDEX IF NOT EXISTS idx_jobs_deleted_at ON jobs (deleted_at);

CREATE TABLE IF NOT EXISTS applications (
    id            BIGSERIAL PRIMARY KEY,
    job_id        BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    student_id    BIGINT NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    cover_letter  TEXT        NOT NULL DEFAULT '',
    status        VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT idx_job_student UNIQUE (job_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_applications_status ON applications (status);

CREATE TABLE IF NOT EXISTS notifications (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL DEFAULT '',
    message     TEXT         NOT NULL DEFAULT '',
    type        VARCHAR(50)  NOT NULL DEFAULT 'system',
    is_read     BOOLEAN      NOT NULL DEFAULT FALSE,
    link        VARCHAR(500) NOT NULL DEFAULT '',
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications (user_id);

BEGIN;

INSERT INTO users (username, email, password_hash, role, is_verified, is_active) VALUES
('serviexpress',     'contacto@serviexpress.pe',      '$2a$10$f7r5gUQjSok2URr55s2/auJANmgde/fLfXmE9R7HquG4c5PqMRnhi', 'company', true, true),
('cafeuniversitario','contacto@cafeuniversitario.pe', '$2a$10$f7r5gUQjSok2URr55s2/auJANmgde/fLfXmE9R7HquG4c5PqMRnhi', 'company', true, true),
('ayacuchocenter',   'contacto@ayacuchocenter.pe',    '$2a$10$f7r5gUQjSok2URr55s2/auJANmgde/fLfXmE9R7HquG4c5PqMRnhi', 'company', true, true),
('constructorawari', 'contacto@constructorawari.pe',  '$2a$10$f7r5gUQjSok2URr55s2/auJANmgde/fLfXmE9R7HquG4c5PqMRnhi', 'company', true, true),
('techsoluciones',   'contacto@techsoluciones.pe',    '$2a$10$f7r5gUQjSok2URr55s2/auJANmgde/fLfXmE9R7HquG4c5PqMRnhi', 'company', true, true),
('agroandina',       'contacto@agroandina.pe',        '$2a$10$f7r5gUQjSok2URr55s2/auJANmgde/fLfXmE9R7HquG4c5PqMRnhi', 'company', true, true),
('maria.quispe',   'maria.quispe@gmail.com',   '$2a$10$f7r5gUQjSok2URr55s2/auJANmgde/fLfXmE9R7HquG4c5PqMRnhi', 'student', true, true),
('jose.huaman',    'jose.huaman@gmail.com',    '$2a$10$f7r5gUQjSok2URr55s2/auJANmgde/fLfXmE9R7HquG4c5PqMRnhi', 'student', true, true),
('ana.flores',     'ana.flores@gmail.com',     '$2a$10$f7r5gUQjSok2URr55s2/auJANmgde/fLfXmE9R7HquG4c5PqMRnhi', 'student', true, true),
('luis.mendoza',   'luis.mendoza@gmail.com',   '$2a$10$f7r5gUQjSok2URr55s2/auJANmgde/fLfXmE9R7HquG4c5PqMRnhi', 'student', true, true),
('carla.palomino', 'carla.palomino@gmail.com', '$2a$10$f7r5gUQjSok2URr55s2/auJANmgde/fLfXmE9R7HquG4c5PqMRnhi', 'student', true, true),
('diego.ramos',    'diego.ramos@gmail.com',    '$2a$10$f7r5gUQjSok2URr55s2/auJANmgde/fLfXmE9R7HquG4c5PqMRnhi', 'student', true, true),
('rosa.tinco',     'rosa.tinco@gmail.com',     '$2a$10$f7r5gUQjSok2URr55s2/auJANmgde/fLfXmE9R7HquG4c5PqMRnhi', 'student', true, true),
('jhon.pariona',   'jhon.pariona@gmail.com',   '$2a$10$f7r5gUQjSok2URr55s2/auJANmgde/fLfXmE9R7HquG4c5PqMRnhi', 'student', true, true),
('admin', 'admin@trabajaya.pe', '$2a$10$f7r5gUQjSok2URr55s2/auJANmgde/fLfXmE9R7HquG4c5PqMRnhi', 'admin', true, true);

INSERT INTO company_profiles (user_id, company_name, ruc, sector, description, address, zone, phone, website, logo_url, is_verified, plan) VALUES
(1, 'ServiExpress Ayacucho',   '20601234561', 'Servicios y logística', 'Empresa de mensajería y delivery en la ciudad de Ayacucho.', 'Jr. Asamblea 245', 'Huamanga', '066-312345', 'https://serviexpress.pe', '/uploads/companies/empresa-1.jpg', true, 'free'),
(2, 'Café Universitario',      '20601234562', 'Gastronomía', 'Cafetería frente a la Universidad Nacional de San Cristóbal de Huamanga.', 'Av. Independencia 780', 'San Juan Bautista', '066-312346', 'https://cafeuniversitario.pe', '/uploads/companies/empresa-2.jpg', true, 'free'),
(3, 'Tienda Ayacucho Center',  '20601234563', 'Comercio retail', 'Centro comercial con tiendas de ropa, electrónica y abarrotes.', 'Jr. Lima 320', 'Centro', '066-312347', 'https://ayacuchocenter.pe', '/uploads/companies/empresa-3.jpg', true, 'premium'),
(4, 'Constructora Wari',       '20601234564', 'Construcción', 'Empresa constructora de obras civiles y proyectos de vivienda.', 'Av. Mariscal Cáceres 102', 'Jesús Nazareno', '066-312348', 'https://constructorawari.pe', '/uploads/companies/empresa-4.jpg', true, 'free'),
(5, 'TechSoluciones Ayacucho', '20601234565', 'Tecnología', 'Desarrollo de software, soporte técnico y marketing digital para negocios locales.', 'Jr. 28 de Julio 415', 'Centro', '066-312349', 'https://techsolucionesayacucho.pe', '/uploads/companies/empresa-5.jpg', true, 'premium'),
(6, 'AgroAndina Perú',         '20601234566', 'Agroindustria', 'Procesamiento y comercialización de productos agrícolas andinos.', 'Carretera a Quinua km 5', 'Socos', '066-312350', 'https://agroandina.pe', '/uploads/companies/empresa-6.jpg', false, 'free');

INSERT INTO student_profiles (user_id, first_name, last_name, institutional_email, faculty, career, semester, phone, bio, cv_url, availability, zone, profile_photo, is_available) VALUES
(7,  'María', 'Quispe Huamán',      'maria.quispe@unsch.edu.pe',   'Facultad de Ingeniería de Minas, Geología y Civil',     'Ingeniería de Sistemas',     7, '966111222', 'Estudiante de Ingeniería de Sistemas, interesada en desarrollo web y atención al cliente.', '', '{"lunes":["14:00-18:00"],"martes":["14:00-18:00"],"miercoles":["14:00-18:00"]}'::jsonb, 'Centro', '/uploads/students/estudiante-1.jpg', true),
(8,  'José', 'Huamán Cárdenas',     'jose.huaman@unsch.edu.pe',    'Facultad de Ciencias Administrativas',                  'Administración de Empresas', 5, '966111223', 'Busco prácticas en administración y ventas para aplicar lo aprendido en clase.', '', '{"lunes":["08:00-13:00"],"martes":["08:00-13:00"],"sabado":["08:00-13:00"]}'::jsonb, 'San Juan Bautista', '/uploads/students/estudiante-2.jpg', true),
(9,  'Ana', 'Flores Rojas',         'ana.flores@unsch.edu.pe',     'Facultad de Ciencias Económicas y Administrativas',     'Contabilidad',               8, '966111224', 'Próxima egresada de Contabilidad, con experiencia en hojas de cálculo y facturación.', '', '{"lunes":["09:00-13:00"],"miercoles":["09:00-13:00"],"viernes":["09:00-13:00"]}'::jsonb, 'Carmen Alto', '/uploads/students/estudiante-3.jpg', true),
(10, 'Luis', 'Mendoza Tueros',      'luis.mendoza@unsch.edu.pe',   'Facultad de Ciencias de la Educación',                  'Educación Inicial',          4, '966111225', 'Me gusta trabajar con niños y tengo disponibilidad por las tardes.', '', '{"lunes":["15:00-19:00"],"jueves":["15:00-19:00"]}'::jsonb, 'Jesús Nazareno', '/uploads/students/estudiante-4.jpg', true),
(11, 'Carla', 'Palomino Vega',      'carla.palomino@unsch.edu.pe', 'Facultad de Derecho y Ciencias Políticas',              'Derecho',                    6, '966111226', 'Estudiante de Derecho con interés en temas administrativos y atención al público.', '', '{"martes":["08:00-12:00"],"jueves":["08:00-12:00"]}'::jsonb, 'Andrés Avelino Cáceres', '/uploads/students/estudiante-5.jpg', true),
(12, 'Diego', 'Ramos Curi',         'diego.ramos@unsch.edu.pe',    'Facultad de Ingeniería de Minas, Geología y Civil',     'Ingeniería Civil',           9, '966111227', 'Practicante de Ingeniería Civil con conocimientos en AutoCAD y supervisión de obra.', '', '{"lunes":["08:00-17:00"],"martes":["08:00-17:00"],"miercoles":["08:00-17:00"]}'::jsonb, 'Centro', '/uploads/students/estudiante-6.jpg', true),
(13, 'Rosa', 'Tinco Allccahuamán',  'rosa.tinco@unsch.edu.pe',     'Facultad de Enfermería',                                'Enfermería',                 5, '966111228', 'Disponible para trabajos de fin de semana y apoyo en campañas de salud.', '', '{"sabado":["08:00-13:00"],"domingo":["08:00-13:00"]}'::jsonb, 'Socos', '/uploads/students/estudiante-7.jpg', true),
(14, 'Jhon', 'Pariona Espinoza',    'jhon.pariona@unsch.edu.pe',   'Facultad de Ciencias Agrarias',                         'Ingeniería Agroindustrial',  6, '966111229', 'Interesado en procesos agroindustriales y control de calidad.', '', '{"lunes":["07:00-13:00"],"martes":["07:00-13:00"],"miercoles":["07:00-13:00"]}'::jsonb, 'Quinua', '/uploads/students/estudiante-8.jpg', true);

INSERT INTO jobs (company_id, title, description, requirements, category, modality, zone, salary, salary_type, hours_per_week, schedule, vacancies, status, is_featured, views_count, expires_at, created_at) VALUES
(1, 'Mensajería y apoyo administrativo', 'Reparto de documentos y paquetes pequeños en la zona de Huamanga, además de apoyo en tareas de oficina.', 'Disponibilidad en las mañanas, conocimiento básico de la ciudad, responsabilidad.', 'Logística', 'presencial', 'Huamanga', 18.00, 'por_hora', 20, '{"lunes":["08:00-12:00"],"martes":["08:00-12:00"],"miercoles":["08:00-12:00"],"jueves":["08:00-12:00"],"viernes":["08:00-12:00"]}'::jsonb, 2, 'active', false, 34, now() + interval '30 days', now() - interval '10 days'),
(1, 'Repartidor con moto propia', 'Entrega de pedidos dentro del centro de Ayacucho usando moto propia (combustible cubierto por la empresa).', 'Moto propia y brevete vigente, conocimiento de rutas del centro.', 'Logística', 'presencial', 'Centro', 20.00, 'por_hora', 24, '{"lunes":["09:00-13:00","15:00-19:00"],"miercoles":["09:00-13:00","15:00-19:00"],"viernes":["09:00-13:00","15:00-19:00"]}'::jsonb, 3, 'active', false, 51, now() + interval '25 days', now() - interval '8 days'),
(1, 'Asistente de almacén', 'Control de inventario y organización de paquetería en almacén central.', 'Orden, puntualidad y disponibilidad en horario de mañana.', 'Logística', 'presencial', 'Carmen Alto', 1100.00, 'mensual', 30, '{"lunes":["08:00-14:00"],"martes":["08:00-14:00"],"miercoles":["08:00-14:00"],"jueves":["08:00-14:00"],"viernes":["08:00-14:00"]}'::jsonb, 1, 'paused', false, 12, now() + interval '20 days', now() - interval '15 days'),

(2, 'Cajero y atención al público', 'Atención en caja y al público en cafetería universitaria, fines de semana.', 'Buen trato al cliente, manejo básico de caja.', 'Atención al cliente', 'presencial', 'San Juan Bautista', 12.00, 'por_hora', 20, '{"sabado":["08:00-13:00"],"domingo":["08:00-13:00"]}'::jsonb, 2, 'active', false, 40, now() + interval '20 days', now() - interval '6 days'),
(2, 'Barista para fines de semana', 'Preparación de bebidas calientes y frías, atención de barra los fines de semana.', 'Experiencia previa como barista deseable, no excluyente.', 'Gastronomía', 'presencial', 'San Juan Bautista', 14.00, 'por_hora', 16, '{"sabado":["07:00-15:00"],"domingo":["07:00-15:00"]}'::jsonb, 1, 'active', false, 28, now() + interval '18 days', now() - interval '5 days'),
(2, 'Mesero/a medio tiempo', 'Atención de mesas y servicio al cliente en horario de tarde, de lunes a jueves.', 'Buena presencia, disponibilidad de tarde, trabajo en equipo.', 'Gastronomía', 'presencial', 'San Juan Bautista', 13.00, 'por_hora', 20, '{"lunes":["14:00-18:00"],"martes":["14:00-18:00"],"miercoles":["14:00-18:00"],"jueves":["14:00-18:00"]}'::jsonb, 2, 'active', false, 19, now() + interval '22 days', now() - interval '3 days'),

(3, 'Asistente de ventas por horas', 'Atención y venta a clientes en tienda del centro comercial, turno de tarde.', 'Disponibilidad de lunes a viernes por las tardes, gusto por la atención al cliente.', 'Ventas', 'presencial', 'Centro', 15.00, 'por_hora', 24, '{"lunes":["14:00-18:00"],"martes":["14:00-18:00"],"miercoles":["14:00-18:00"],"jueves":["14:00-18:00"],"viernes":["14:00-18:00"]}'::jsonb, 3, 'active', true, 88, now() + interval '30 days', now() - interval '12 days'),
(3, 'Vendedor/a de tienda - turno mañana', 'Atención al cliente y reposición de mercadería en tienda de electrónica, turno mañana de lunes a sábado.', 'Disponibilidad de mañana, responsabilidad y puntualidad.', 'Ventas', 'presencial', 'Centro', 1000.00, 'mensual', 36, '{"lunes":["08:00-14:00"],"martes":["08:00-14:00"],"miercoles":["08:00-14:00"],"jueves":["08:00-14:00"],"viernes":["08:00-14:00"],"sabado":["08:00-14:00"]}'::jsonb, 2, 'active', true, 75, now() + interval '28 days', now() - interval '9 days'),
(3, 'Reponedor de mercadería', 'Reposición y orden de productos en góndolas, control de fechas de vencimiento.', 'Disponibilidad en horario de madrugada/mañana tres veces por semana.', 'Logística', 'presencial', 'Centro', 14.00, 'por_hora', 20, '{"martes":["06:00-10:00"],"jueves":["06:00-10:00"],"sabado":["06:00-10:00"]}'::jsonb, 2, 'active', false, 22, now() + interval '15 days', now() - interval '4 days'),
(3, 'Cajero/a para temporada', 'Atención de caja durante temporada de campaña escolar.', 'Disponibilidad inmediata, manejo de caja registradora.', 'Ventas', 'presencial', 'Centro', 13.00, 'por_hora', 24, '{"lunes":["10:00-18:00"]}'::jsonb, 1, 'closed', false, 60, now() - interval '2 days', now() - interval '25 days'),

(4, 'Practicante de Ingeniería Civil', 'Apoyo en supervisión de obra, metrados y elaboración de informes técnicos.', 'Estudiante de los últimos ciclos de Ingeniería Civil, conocimientos de AutoCAD y S10.', 'Construcción', 'presencial', 'Jesús Nazareno', 1200.00, 'mensual', 40, '{"lunes":["08:00-17:00"],"martes":["08:00-17:00"],"miercoles":["08:00-17:00"],"jueves":["08:00-17:00"],"viernes":["08:00-17:00"]}'::jsonb, 1, 'active', false, 47, now() + interval '35 days', now() - interval '14 days'),
(4, 'Ayudante de obra', 'Apoyo general en obra de construcción: traslado de materiales, encofrado y limpieza.', 'Disponibilidad de tiempo completo, buena condición física.', 'Construcción', 'presencial', 'Jesús Nazareno', 16.00, 'por_hora', 30, '{"lunes":["07:00-13:00"],"martes":["07:00-13:00"],"miercoles":["07:00-13:00"],"jueves":["07:00-13:00"],"viernes":["07:00-13:00"]}'::jsonb, 4, 'active', false, 33, now() + interval '20 days', now() - interval '7 days'),
(4, 'Dibujante AutoCAD (medio tiempo)', 'Elaboración y actualización de planos arquitectónicos y de instalaciones en AutoCAD.', 'Manejo de AutoCAD 2D, disponibilidad dos tardes a la semana.', 'Construcción', 'mixto', 'Jesús Nazareno', 18.00, 'por_hora', 20, '{"martes":["15:00-19:00"],"jueves":["15:00-19:00"]}'::jsonb, 1, 'active', false, 17, now() + interval '18 days', now() - interval '2 days'),

(5, 'Practicante de Desarrollo Web', 'Desarrollo y mantenimiento de aplicaciones web para clientes locales usando JavaScript/TypeScript.', 'Conocimientos de HTML, CSS, JavaScript; deseable React o similar.', 'Tecnología', 'remoto', 'Centro', 1000.00, 'mensual', 24, '{"lunes":["09:00-13:00"],"miercoles":["09:00-13:00"],"viernes":["09:00-13:00"]}'::jsonb, 2, 'active', true, 102, now() + interval '30 days', now() - interval '11 days'),
(5, 'Soporte técnico (medio tiempo)', 'Atención de incidencias de hardware y software a clientes, instalación de equipos.', 'Conocimientos básicos de redes y mantenimiento de PC, disponibilidad de tarde.', 'Tecnología', 'presencial', 'Centro', 15.00, 'por_hora', 20, '{"lunes":["14:00-18:00"],"martes":["14:00-18:00"],"jueves":["14:00-18:00"]}'::jsonb, 1, 'active', true, 64, now() + interval '25 days', now() - interval '6 days'),
(5, 'Asistente de Marketing Digital', 'Gestión de redes sociales y campañas digitales para clientes de la agencia.', 'Conocimientos de redes sociales, herramientas de diseño básicas (Canva).', 'Marketing', 'mixto', 'Centro', 14.00, 'por_hora', 20, '{"lunes":["09:00-13:00"],"miercoles":["09:00-13:00"]}'::jsonb, 1, 'active', false, 39, now() + interval '20 days', now() - interval '5 days'),
(5, 'Diseñador/a gráfico junior', 'Diseño de piezas gráficas para redes sociales y material publicitario.', 'Manejo básico de Photoshop o Canva, portafolio (aunque sea académico).', 'Marketing', 'remoto', 'Centro', 900.00, 'mensual', 20, '{"martes":["10:00-14:00"],"jueves":["10:00-14:00"]}'::jsonb, 1, 'paused', false, 21, now() + interval '15 days', now() - interval '16 days'),

(6, 'Asistente de campo agroindustrial', 'Apoyo en labores de campo y procesamiento inicial de productos agrícolas.', 'Disponibilidad de mañana, gusto por el trabajo de campo.', 'Agro', 'presencial', 'Socos', 17.00, 'por_hora', 24, '{"lunes":["06:00-12:00"],"martes":["06:00-12:00"],"miercoles":["06:00-12:00"]}'::jsonb, 3, 'active', false, 26, now() + interval '22 days', now() - interval '4 days'),
(6, 'Auxiliar de control de calidad', 'Apoyo en el control de calidad de productos agroindustriales antes de su empaque.', 'Estudiante de carreras afines a agroindustria o alimentos.', 'Agro', 'presencial', 'Socos', 1100.00, 'mensual', 30, '{"lunes":["07:00-13:00"],"miercoles":["07:00-13:00"],"viernes":["07:00-13:00"]}'::jsonb, 1, 'active', false, 18, now() + interval '25 days', now() - interval '3 days'),
(6, 'Encuestador/a para estudio de mercado', 'Aplicación de encuestas presenciales para estudio de consumo en la zona de Andrés Avelino Cáceres.', 'Buena comunicación, disponibilidad un fin de semana.', 'Marketing', 'presencial', 'Andrés Avelino Cáceres', 15.00, 'por_hora', 16, '{"sabado":["09:00-17:00"]}'::jsonb, 4, 'closed', false, 41, now() - interval '5 days', now() - interval '20 days');

INSERT INTO applications (job_id, student_id, cover_letter, status, created_at) VALUES
(7,  1, 'Me interesa el puesto de ventas, tengo disponibilidad las tardes y me gusta la atención al cliente.', 'accepted', now() - interval '10 days'),
(14, 1, 'Quisiera postular como practicante de desarrollo web, curso el 7mo ciclo de Ingeniería de Sistemas y manejo HTML, CSS y JavaScript.', 'pending', now() - interval '2 days'),
(7,  2, 'Tengo experiencia en atención al cliente y ventas durante las vacaciones de verano.', 'pending', now() - interval '3 days'),
(4,  2, 'Me gustaría trabajar como cajero los fines de semana, tengo disponibilidad completa sábados y domingos.', 'viewed', now() - interval '4 days'),
(9,  3, 'Cuento con disponibilidad en las mañanas para apoyo en reposición de mercadería.', 'pending', now() - interval '5 days'),
(11, 6, 'Soy estudiante del último ciclo de Ingeniería Civil, manejo AutoCAD y S10 y tengo disponibilidad de tiempo completo.', 'accepted', now() - interval '6 days'),
(12, 6, 'También me interesa el puesto de ayudante de obra como complemento a mi práctica.', 'viewed', now() - interval '5 days'),
(5,  4, 'Tengo experiencia preparando bebidas y disponibilidad los fines de semana.', 'accepted', now() - interval '4 days'),
(16, 4, 'Me interesa el puesto de marketing digital, manejo redes sociales y herramientas básicas de diseño.', 'pending', now() - interval '1 days'),
(8,  5, 'Tengo disponibilidad en las mañanas de lunes a sábado para el puesto de vendedor/a.', 'viewed', now() - interval '2 days'),
(15, 7, 'Tengo conocimientos básicos de soporte técnico y disponibilidad por las tardes.', 'pending', now() - interval '3 days'),
(18, 8, 'Soy estudiante de Ingeniería Agroindustrial y me interesa mucho el trabajo de campo.', 'pending', now() - interval '2 days');

INSERT INTO notifications (user_id, title, message, type, is_read, link, created_at) VALUES
(7,  '¡Postulación aceptada!', 'Tu postulación a "Asistente de ventas por horas" fue aceptada.', 'application_update', false, '/estudiante/postulaciones', now() - interval '9 days'),
(7,  'Nueva oferta en Tecnología', 'TechSoluciones Ayacucho publicó: Practicante de Desarrollo Web.', 'new_job', true, '/estudiante/ofertas', now() - interval '11 days'),
(8,  'Tu postulación fue revisada', 'La empresa revisó tu postulación a "Cajero y atención al público".', 'application_update', false, '/estudiante/postulaciones', now() - interval '3 days'),
(12, '¡Postulación aceptada!', 'Tu postulación a "Practicante de Ingeniería Civil" fue aceptada.', 'application_update', false, '/estudiante/postulaciones', now() - interval '6 days'),
(12, 'Tu postulación fue revisada', 'La empresa revisó tu postulación a "Ayudante de obra".', 'application_update', true, '/estudiante/postulaciones', now() - interval '5 days'),
(10, '¡Postulación aceptada!', 'Tu postulación a "Barista para fines de semana" fue aceptada.', 'application_update', false, '/estudiante/postulaciones', now() - interval '4 days'),
(11, 'Tu postulación fue revisada', 'La empresa revisó tu postulación a "Vendedor/a de tienda - turno mañana".', 'application_update', false, '/estudiante/postulaciones', now() - interval '2 days'),
(3,  'Nuevo candidato', 'Tienes nuevos candidatos para "Asistente de ventas por horas".', 'system', false, '/empresa/candidatos/7', now() - interval '3 days'),
(5,  'Nuevo candidato', 'Tienes un nuevo candidato para "Practicante de Desarrollo Web".', 'system', false, '/empresa/candidatos/14', now() - interval '2 days'),
(15, 'Empresa pendiente de verificación', 'AgroAndina Perú está esperando verificación de RUC.', 'system', false, '/admin/usuarios', now() - interval '7 days');

COMMIT;
