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
