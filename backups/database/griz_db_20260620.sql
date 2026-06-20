--
-- PostgreSQL database dump
--

\restrict P41D73lMR9E7msmsSHVd9tCg9aBYYetPRGltdNcDj4D2qLK7zoi9h5noikdsSvq

-- Dumped from database version 18.4 (Ubuntu 18.4-0ubuntu0.26.04.1)
-- Dumped by pg_dump version 18.4 (Ubuntu 18.4-0ubuntu0.26.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bookings; Type: TABLE; Schema: public; Owner: griz
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    name text NOT NULL,
    phone text NOT NULL,
    date text NOT NULL,
    "time" text NOT NULL,
    guests integer DEFAULT 2 NOT NULL,
    comment text,
    status text DEFAULT 'pending'::text NOT NULL,
    reminder_sent boolean DEFAULT false NOT NULL,
    reminder_day_sent boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.bookings OWNER TO griz;

--
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: griz
--

CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookings_id_seq OWNER TO griz;

--
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: griz
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- Name: gallery_images; Type: TABLE; Schema: public; Owner: griz
--

CREATE TABLE public.gallery_images (
    id integer NOT NULL,
    url text NOT NULL,
    caption text DEFAULT ''::text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.gallery_images OWNER TO griz;

--
-- Name: gallery_images_id_seq; Type: SEQUENCE; Schema: public; Owner: griz
--

CREATE SEQUENCE public.gallery_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.gallery_images_id_seq OWNER TO griz;

--
-- Name: gallery_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: griz
--

ALTER SEQUENCE public.gallery_images_id_seq OWNED BY public.gallery_images.id;


--
-- Name: loyalty_cards; Type: TABLE; Schema: public; Owner: griz
--

CREATE TABLE public.loyalty_cards (
    id integer NOT NULL,
    token uuid DEFAULT gen_random_uuid(),
    telegram_id bigint,
    phone text,
    name text DEFAULT ''::text NOT NULL,
    visits integer DEFAULT 0 NOT NULL,
    bonus_points integer DEFAULT 0 NOT NULL,
    tier text DEFAULT 'bronze'::text NOT NULL,
    total_spent integer DEFAULT 0 NOT NULL,
    registered_at timestamp without time zone DEFAULT now() NOT NULL,
    last_visit_at timestamp without time zone
);


ALTER TABLE public.loyalty_cards OWNER TO griz;

--
-- Name: loyalty_cards_id_seq; Type: SEQUENCE; Schema: public; Owner: griz
--

CREATE SEQUENCE public.loyalty_cards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.loyalty_cards_id_seq OWNER TO griz;

--
-- Name: loyalty_cards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: griz
--

ALTER SEQUENCE public.loyalty_cards_id_seq OWNED BY public.loyalty_cards.id;


--
-- Name: loyalty_visits; Type: TABLE; Schema: public; Owner: griz
--

CREATE TABLE public.loyalty_visits (
    id integer NOT NULL,
    card_id integer NOT NULL,
    amount_spent integer DEFAULT 0 NOT NULL,
    bonus_earned integer DEFAULT 0 NOT NULL,
    bonus_used integer DEFAULT 0 NOT NULL,
    note text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.loyalty_visits OWNER TO griz;

--
-- Name: loyalty_visits_id_seq; Type: SEQUENCE; Schema: public; Owner: griz
--

CREATE SEQUENCE public.loyalty_visits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.loyalty_visits_id_seq OWNER TO griz;

--
-- Name: loyalty_visits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: griz
--

ALTER SEQUENCE public.loyalty_visits_id_seq OWNED BY public.loyalty_visits.id;


--
-- Name: menu_categories; Type: TABLE; Schema: public; Owner: griz
--

CREATE TABLE public.menu_categories (
    id integer NOT NULL,
    key character varying(50) NOT NULL,
    label character varying(100) NOT NULL,
    emoji character varying(10),
    image text,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    title_size integer DEFAULT 40,
    title_position integer DEFAULT 50
);


ALTER TABLE public.menu_categories OWNER TO griz;

--
-- Name: menu_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: griz
--

CREATE SEQUENCE public.menu_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.menu_categories_id_seq OWNER TO griz;

--
-- Name: menu_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: griz
--

ALTER SEQUENCE public.menu_categories_id_seq OWNED BY public.menu_categories.id;


--
-- Name: menu_items; Type: TABLE; Schema: public; Owner: griz
--

CREATE TABLE public.menu_items (
    id integer NOT NULL,
    section text NOT NULL,
    category text NOT NULL,
    name text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    price text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active integer DEFAULT 1 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    is_featured integer DEFAULT 0 NOT NULL,
    strength integer DEFAULT 4,
    session_duration integer DEFAULT 120,
    bowl text DEFAULT 'Phunnel · Glaze'::text,
    coal text DEFAULT 'Coco · 25mm'::text,
    tobacco_brand text,
    tobacco_flavor text,
    hookah_model text,
    price_featured text,
    description_featured text,
    image text,
    category_image text,
    ingredients text,
    allergens text,
    calories integer,
    protein integer,
    fat integer,
    carbs integer,
    menu_category text,
    status text DEFAULT 'active'::text,
    is_visible integer DEFAULT 1
);


ALTER TABLE public.menu_items OWNER TO griz;

--
-- Name: menu_items_id_seq; Type: SEQUENCE; Schema: public; Owner: griz
--

CREATE SEQUENCE public.menu_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.menu_items_id_seq OWNER TO griz;

--
-- Name: menu_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: griz
--

ALTER SEQUENCE public.menu_items_id_seq OWNED BY public.menu_items.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: griz
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    name text NOT NULL,
    text text NOT NULL,
    rating integer DEFAULT 5 NOT NULL,
    source text DEFAULT 'site'::text NOT NULL,
    is_published integer DEFAULT 1 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.reviews OWNER TO griz;

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: griz
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO griz;

--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: griz
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: site_settings; Type: TABLE; Schema: public; Owner: griz
--

CREATE TABLE public.site_settings (
    key text NOT NULL,
    value jsonb NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.site_settings OWNER TO griz;

--
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: griz
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- Name: gallery_images id; Type: DEFAULT; Schema: public; Owner: griz
--

ALTER TABLE ONLY public.gallery_images ALTER COLUMN id SET DEFAULT nextval('public.gallery_images_id_seq'::regclass);


--
-- Name: loyalty_cards id; Type: DEFAULT; Schema: public; Owner: griz
--

ALTER TABLE ONLY public.loyalty_cards ALTER COLUMN id SET DEFAULT nextval('public.loyalty_cards_id_seq'::regclass);


--
-- Name: loyalty_visits id; Type: DEFAULT; Schema: public; Owner: griz
--

ALTER TABLE ONLY public.loyalty_visits ALTER COLUMN id SET DEFAULT nextval('public.loyalty_visits_id_seq'::regclass);


--
-- Name: menu_categories id; Type: DEFAULT; Schema: public; Owner: griz
--

ALTER TABLE ONLY public.menu_categories ALTER COLUMN id SET DEFAULT nextval('public.menu_categories_id_seq'::regclass);


--
-- Name: menu_items id; Type: DEFAULT; Schema: public; Owner: griz
--

ALTER TABLE ONLY public.menu_items ALTER COLUMN id SET DEFAULT nextval('public.menu_items_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: griz
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: griz
--

COPY public.bookings (id, name, phone, date, "time", guests, comment, status, reminder_sent, reminder_day_sent, created_at) FROM stdin;
1	Никита	+79163283891	2026-06-14	18:30	2	Оааооа	confirmed	f	f	2026-06-13 12:24:39.310805
2	Писька 	79026297144	2026-06-19	01:00	1	Чтоб у тебя все получилось )	confirmed	f	f	2026-06-19 17:05:20.312385
\.


--
-- Data for Name: gallery_images; Type: TABLE DATA; Schema: public; Owner: griz
--

COPY public.gallery_images (id, url, caption, sort_order, created_at) FROM stdin;
\.


--
-- Data for Name: loyalty_cards; Type: TABLE DATA; Schema: public; Owner: griz
--

COPY public.loyalty_cards (id, token, telegram_id, phone, name, visits, bonus_points, tier, total_spent, registered_at, last_visit_at) FROM stdin;
\.


--
-- Data for Name: loyalty_visits; Type: TABLE DATA; Schema: public; Owner: griz
--

COPY public.loyalty_visits (id, card_id, amount_spent, bonus_earned, bonus_used, note, created_at) FROM stdin;
\.


--
-- Data for Name: menu_categories; Type: TABLE DATA; Schema: public; Owner: griz
--

COPY public.menu_categories (id, key, label, emoji, image, display_order, is_active, created_at, updated_at, title_size, title_position) FROM stdin;
4	tea	TEA		/images/categories/tea.jpg	4	t	2026-06-19 16:04:05.268639	2026-06-20 16:40:49.997737	40	40
1	hookah	HOOKAH		/images/categories/hookah.jpg	1	t	2026-06-19 16:04:05.268639	2026-06-20 16:41:39.684552	40	40
3	bar	BAR		/images/categories/bar.jpg	3	t	2026-06-19 16:04:05.268639	2026-06-20 16:42:10.388667	40	40
2	food	FOOD		/images/categories/food.jpg	2	t	2026-06-19 16:04:05.268639	2026-06-20 16:42:18.05682	40	40
\.


--
-- Data for Name: menu_items; Type: TABLE DATA; Schema: public; Owner: griz
--

COPY public.menu_items (id, section, category, name, description, price, sort_order, is_active, created_at, is_featured, strength, session_duration, bowl, coal, tobacco_brand, tobacco_flavor, hookah_model, price_featured, description_featured, image, category_image, ingredients, allergens, calories, protein, fat, carbs, menu_category, status, is_visible) FROM stdin;
61	Hookah	Premium	Premium	Все бренды категории Premium : Trofimoffs, Bonche, Dogma	1500	0	1	2026-06-14 18:07:43.73216	1	7	90	Darkside · killer	Coco 25	null	null	null	null	null	\N	\N	\N	\N	\N	\N	\N	\N	hookah	active	1
51	Чайная карта	Китайский чай	Жасминовый улун		415	0	1	2026-06-14 17:43:33.479218	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	tea	active	1
52	Чайная карта	Китайский чай	Женьшень улун		415	0	1	2026-06-14 17:44:38.710285	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	tea	active	1
53	Чайная карта	Китайский чай	Молочный улун		415	0	1	2026-06-14 17:44:58.82125	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	tea	active	1
55	Чайная карта	Китайский чай	Пуэр медальоны		415	0	1	2026-06-14 17:46:14.613286	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	tea	active	1
56	Чайная карта	Китайский чай	Дахун пао		415	0	1	2026-06-14 17:47:04.643163	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	tea	active	1
57	Чайная карта	Китайский чай	Шу пуэр		415	0	1	2026-06-14 17:47:23.751202	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	tea	active	1
58	Hookah	Standart	Standart	Все бренды категорий Standart	1350	0	1	2026-06-14 17:59:18.681585	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	hookah	active	1
60	Hookah	Авторские	Авторские	Все бренды категории Standard с подачей на фруктовой чаше 	1700	0	1	2026-06-14 18:03:10.811964	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	hookah	active	1
28	Меню бар	Напитки	Сок	Апельсин\nананас\nВишня	148	0	1	2026-06-14 17:10:54.476883	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	bar	active	1
26	Меню бар	Напитки	Вода	Газ/не газ	238	0	1	2026-06-14 17:09:31.916223	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	bar	active	1
24	Меню бар	Напитки	Адреналин	Classic /Zero 	214	0	1	2026-06-14 17:08:09.51048	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	bar	active	1
29	Меню бар	Напитки	Спрайт		142	0	1	2026-06-14 17:13:28.954955	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	bar	active	1
30	Меню бар	Напитки	Кола 	Classic/zero	179	0	1	2026-06-14 17:14:15.231602	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	bar	active	1
31	Меню бар	Пиво 	El Capulco 	 	186	0	1	2026-06-14 17:17:38.270848	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	bar	active	1
32	Меню бар	Пиво 	El Capulco 	Б/а	150	0	1	2026-06-14 17:19:03.413031	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	bar	active	1
33	Меню бар	Пиво 	Blanche 	Б/а	189	0	1	2026-06-14 17:21:58.142129	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	bar	active	1
38	Меню бар	Пиво 	Hoegaarden	Вишня 	216	0	1	2026-06-14 17:27:46.322584	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	bar	active	1
39	Меню бар	Пиво 	Hoegaarden	Грейпфрут 	216	0	1	2026-06-14 17:28:12.385737	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	bar	active	1
62	Меню бар	Пиво 	Kozel темн.		185	0	1	2026-06-19 11:38:14.170499	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	bar	active	1
40	Меню бар	Лимонады	Прохладный вайб	0,4 /1л	269/487	0	1	2026-06-14 17:31:05.228599	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	bar	active	1
41	Меню бар	Лимонады	CHERRY PUNCH	0,4/1л\nЛимонад с характером который <<Бьет по рецепторам >> так же мощно как басы в хорошем трек листе	269/487	0	1	2026-06-14 17:35:06.136903	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	bar	active	1
42	Меню бар	Лимонады	Neon Purple drip	0,4/1л Лавандовый 	269/487	0	1	2026-06-14 17:37:19.515952	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	bar	active	1
43	Меню бар	Лимонады	Chill Vibs	0,4/1л\nЧиловый малиновый лимонад со спокойной кислинкой в конце	269/487	0	1	2026-06-14 17:40:29.172019	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	bar	active	1
83	Еда	Десерты	Чизкейк 	(Топпинг на выбор )	398	0	1	2026-06-19 12:10:57.268657	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	food	active	1
84	Еда	Десерты	Мороженое	3 шарика на выбор	398	0	1	2026-06-19 12:13:27.884591	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	food	active	1
85	Еда	Допы 	Лимонная нарезка		60	0	1	2026-06-19 12:14:12.82765	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	food	active	1
86	Еда	Допы 	Топпинг или сироп		60	0	1	2026-06-19 12:15:21.913138	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	food	active	1
63	Меню бар	Пиво 	Bud 		199	0	1	2026-06-19 11:40:14.691976	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	bar	active	1
64	Меню бар	Пиво 	Blanche		200	0	1	2026-06-19 11:42:32.718551	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	bar	active	1
65	Меню бар	Пиво 	Честерс груша 	(Сидр)	239	0	1	2026-06-19 11:46:37.436931	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	bar	active	1
66	Чайная карта	Обычный	Каркаде		315	0	1	2026-06-19 11:48:19.819943	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	tea	active	1
67	Чайная карта	Обычный	Черный		315	0	1	2026-06-19 11:48:55.71415	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	tea	active	1
68	Чайная карта	Обычный	Зеленый		315	0	1	2026-06-19 11:49:13.209299	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	tea	active	1
69	Чайная карта	Обычный	Земляника со сливками		315	0	1	2026-06-19 11:49:39.739167	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	tea	active	1
70	Чайная карта	Обычный	Эрл-грей	(С бергамотом )	315	0	1	2026-06-19 11:50:22.768572	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	tea	active	1
71	Чайная карта	Обычный	Гречишный		315	0	1	2026-06-19 11:51:08.31207	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	tea	active	1
72	Чайная карта	Обычный	Таежный		315	0	1	2026-06-19 11:51:30.065419	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	tea	active	1
74	Чайная карта	Допы к чаю	Лимон 		30	0	1	2026-06-19 11:52:33.163122	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	tea	active	1
75	Чайная карта	Допы к чаю	Чабрец 		30	0	1	2026-06-19 11:52:51.801081	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	tea	active	1
76	Чайная карта	Допы к чаю	Мед		60	0	1	2026-06-19 11:53:44.587265	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	tea	active	1
77	Чайная карта	Авторский	LiL Barry 	\nЯГОДНЫЙ ПОПСОВЫЙ МИКС	436	0	1	2026-06-19 11:58:55.607005	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	tea	active	1
78	Чайная карта	Авторский	Claud Rap	нежный сливочный чай с лавандой черникой	435	0	1	2026-06-19 12:00:25.165359	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	tea	active	1
79	Чайная карта	Авторский	Punchline	чай с неожиданном послевкусием обычный зеленый чай с острым послевкусием лемонграса и имбиря	435	0	1	2026-06-19 12:01:40.519075	0	4	120	Phunnel · Glaze	Coco · 25mm	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	tea	active	1
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: griz
--

COPY public.reviews (id, name, text, rating, source, is_published, created_at) FROM stdin;
\.


--
-- Data for Name: site_settings; Type: TABLE DATA; Schema: public; Owner: griz
--

COPY public.site_settings (key, value, updated_at) FROM stdin;
images	{"logo": "", "heroBg": "", "cocktail": "", "interior": "", "bearSkull": ""}	2026-06-14 19:47:59.625
brand	{"city": "Тюмени", "name": "ГРИЗЛИ", "estYear": "2026", "badgeText": "Тюмень · с 2026 года"}	2026-06-14 19:48:57.352
schedule	[{"days": "Пн — Чт", "hours": "15:00 — 02:00"}, {"days": "Пт — Сб", "hours": "15:00 — 04:00"}, {"days": "Вс", "hours": "15:00 — 02:00"}]	2026-06-13 13:06:32.375733
about	{"p1": "Мы создали место, где город остается за дверью. «ГРИЗЛИ» — это тяжёлое дерево, потёртая кожа, приглушённый янтарный свет и густой дым.", "p2": "Здесь некуда спешить. Мы уважаем личное пространство и ценим тишину. Это территория взрослых, где каждый вдох имеет глубину.", "title": "Не клуб. Не кафе. Берлога."}	2026-06-13 13:06:48.80134
rules	[{"text": "Строго 18+. Мы оставляем за собой право попросить документ. Без исключений.", "title": "Возраст"}, {"text": "Не повышаем голос, не включаем видео без наушников. Уважаем отдых друг друга.", "title": "Уважение"}]	2026-06-13 13:06:57.440213
ticker	["СЕЙЧАС ОТКРЫТО", "ПРЕМИАЛЬНЫЙ ТАБАК", "АВТОРСКИЕ ЛИМОНАДЫ", "БРОНЬ +7-916-328-38-91", "УЛ. НОВОСЁЛОВ, 92"]	2026-06-15 08:52:48.74
loyalty	{"tagline": "Программа лояльности", "botUsername": "GrizzlyLoyalty_bot", "description": "Цифровая карта в Telegram. Никакого пластика — только баллы, статусы и приглашения на закрытые вечера."}	2026-06-13 13:07:20.089118
footer	{"tagline": "Премиальный хука-лаунж в самом сердце Тюмени.", "copyright": "© ГРИЗЛИ Hookah Lounge"}	2026-06-13 13:07:25.482129
typography	{"brand.city": {"font": "sans-serif", "mobileSize": 10, "desktopSize": 12}, "brand.name": {"font": "sans-serif", "mobileSize": 24, "desktopSize": 99}, "hero.title1": {"font": "sans-serif", "mobileSize": 74, "desktopSize": 90}, "rules.0.text": {"font": "sans-serif", "mobileSize": 15, "desktopSize": 12}, "rules.1.text": {"font": "sans-serif", "mobileSize": 15, "desktopSize": 12}, "brand.estYear": {"font": "sans-serif", "mobileSize": 10, "desktopSize": 12}, "rules.0.title": {"font": "sans-serif", "mobileSize": 18, "desktopSize": 25}}	2026-06-19 13:05:05.918
hero	{"title1": "ИНСТИНКТ", "title2": "отдыха", "subtitle": "Премиальный лаунж для тех, кто знает цену времени. Глубокие вкусы, полумрак и никакого ритма большого города.", "title1Size": 190}	2026-06-14 15:24:15.053
contacts	{"vk": "", "phone": "+7 (916) 328-38-91", "mapUrl": "https://yandex.ru/maps/org/grizli/20543811009", "address": "Тюмень, ул. Новосёлов, 92", "telegram": "", "instagram": "https://www.instagram.com/grizzly_lounge371?igsh=OHMyNmJkOGw5OWJ4"}	2026-06-13 15:24:27.386
\.


--
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: griz
--

SELECT pg_catalog.setval('public.bookings_id_seq', 2, true);


--
-- Name: gallery_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: griz
--

SELECT pg_catalog.setval('public.gallery_images_id_seq', 1, false);


--
-- Name: loyalty_cards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: griz
--

SELECT pg_catalog.setval('public.loyalty_cards_id_seq', 1, false);


--
-- Name: loyalty_visits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: griz
--

SELECT pg_catalog.setval('public.loyalty_visits_id_seq', 1, false);


--
-- Name: menu_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: griz
--

SELECT pg_catalog.setval('public.menu_categories_id_seq', 4, true);


--
-- Name: menu_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: griz
--

SELECT pg_catalog.setval('public.menu_items_id_seq', 86, true);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: griz
--

SELECT pg_catalog.setval('public.reviews_id_seq', 1, false);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: griz
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: gallery_images gallery_images_pkey; Type: CONSTRAINT; Schema: public; Owner: griz
--

ALTER TABLE ONLY public.gallery_images
    ADD CONSTRAINT gallery_images_pkey PRIMARY KEY (id);


--
-- Name: loyalty_cards loyalty_cards_phone_unique; Type: CONSTRAINT; Schema: public; Owner: griz
--

ALTER TABLE ONLY public.loyalty_cards
    ADD CONSTRAINT loyalty_cards_phone_unique UNIQUE (phone);


--
-- Name: loyalty_cards loyalty_cards_pkey; Type: CONSTRAINT; Schema: public; Owner: griz
--

ALTER TABLE ONLY public.loyalty_cards
    ADD CONSTRAINT loyalty_cards_pkey PRIMARY KEY (id);


--
-- Name: loyalty_cards loyalty_cards_telegram_id_unique; Type: CONSTRAINT; Schema: public; Owner: griz
--

ALTER TABLE ONLY public.loyalty_cards
    ADD CONSTRAINT loyalty_cards_telegram_id_unique UNIQUE (telegram_id);


--
-- Name: loyalty_cards loyalty_cards_token_unique; Type: CONSTRAINT; Schema: public; Owner: griz
--

ALTER TABLE ONLY public.loyalty_cards
    ADD CONSTRAINT loyalty_cards_token_unique UNIQUE (token);


--
-- Name: loyalty_visits loyalty_visits_pkey; Type: CONSTRAINT; Schema: public; Owner: griz
--

ALTER TABLE ONLY public.loyalty_visits
    ADD CONSTRAINT loyalty_visits_pkey PRIMARY KEY (id);


--
-- Name: menu_categories menu_categories_key_key; Type: CONSTRAINT; Schema: public; Owner: griz
--

ALTER TABLE ONLY public.menu_categories
    ADD CONSTRAINT menu_categories_key_key UNIQUE (key);


--
-- Name: menu_categories menu_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: griz
--

ALTER TABLE ONLY public.menu_categories
    ADD CONSTRAINT menu_categories_pkey PRIMARY KEY (id);


--
-- Name: menu_items menu_items_pkey; Type: CONSTRAINT; Schema: public; Owner: griz
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: griz
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: griz
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (key);


--
-- PostgreSQL database dump complete
--

\unrestrict P41D73lMR9E7msmsSHVd9tCg9aBYYetPRGltdNcDj4D2qLK7zoi9h5noikdsSvq

