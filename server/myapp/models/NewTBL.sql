-- Table: public.newtbl

-- DROP TABLE IF EXISTS public.newtbl;

CREATE TABLE IF NOT EXISTS public.newtbl
(
    id integer NOT NULL DEFAULT nextval('newtbl_id_seq'::regclass),
    email character varying(120) COLLATE pg_catalog."default" NOT NULL,
    userName character varying(80) COLLATE pg_catalog."default" NOT NULL,
    password character varying(120) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT newtbl_pkey PRIMARY KEY (id),
    CONSTRAINT newtbl_email_key UNIQUE (email),
    CONSTRAINT newtbl_username_key UNIQUE (username)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.newtbl
    OWNER to postgres;